import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, fail, ok } from "../_shared/response.ts";

async function logAuditEvent(
  adminClient: ReturnType<typeof createClient>,
  params: { actorId: string; action: string; entity: string; entityId?: string; metadata?: Record<string, any> }
) {
  try {
    await adminClient.rpc("log_audit_event", {
      p_action: params.action,
      p_entity: params.entity,
      p_entity_id: params.entityId || null,
      p_metadata: {
        actor_id: params.actorId,
        source: "edge",
        ...params.metadata,
      },
    });
  } catch {
    // Best-effort audit log
  }
}

function parseWhitelist(): string[] {
  const raw = Deno.env.get("ALLOWED_SERVER_KEYS") || "";
  return raw
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function getUserFromRequest(req: Request) {
  const auth = req.headers.get("Authorization");
  if (!auth) return null;

  const url = Deno.env.get("SUPABASE_URL");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !anon) return null;

  const client = createClient(url, anon, {
    global: { headers: { Authorization: auth } },
  });

  const { data } = await client.auth.getUser();
  return data?.user || null;
}

async function isAdmin(userId: string): Promise<boolean> {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return false;

  const adminClient = createClient(url, serviceKey);
  const { data } = await adminClient.from("profiles").select("is_admin").eq("id", userId).maybeSingle();
  return !!data?.is_admin;
}

function vercelHeaders() {
  const token = Deno.env.get("VERCEL_TOKEN") || "";
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function withTeamQS() {
  const team = Deno.env.get("VERCEL_TEAM_ID");
  return team ? `?teamId=${team}` : "";
}

async function upsertEnvVar(opts: { key: string; value: string; targets: ("production" | "preview")[] }) {
  const projectId = Deno.env.get("VERCEL_PROJECT_ID");
  if (!projectId || !Deno.env.get("VERCEL_TOKEN")) {
    return { ok: false, error: "Vercel not configured" };
  }

  const base = "https://api.vercel.com";
  const url = `${base}/v10/projects/${projectId}/env${withTeamQS()}`;
  const body = {
    key: opts.key,
    value: opts.value,
    target: opts.targets,
    type: "encrypted",
  };

  const res = await fetch(url, { method: "POST", headers: vercelHeaders(), body: JSON.stringify(body) });
  if (res.status === 409) {
    const list = await fetch(`${base}/v9/projects/${projectId}/env${withTeamQS()}`, { headers: vercelHeaders() });
    const data = await list.json().catch(() => ({}));
    const item = (data?.envs || []).find((e: any) => e.key === opts.key);
    if (!item) return { ok: false, error: "Env var exists but not found" };
    const patchUrl = `${base}/v9/projects/${projectId}/env/${item.id}${withTeamQS()}`;
    const patch = await fetch(patchUrl, {
      method: "PATCH",
      headers: vercelHeaders(),
      body: JSON.stringify({ value: opts.value, target: opts.targets }),
    });
    if (!patch.ok) {
      return { ok: false, error: `Vercel PATCH failed (${patch.status})` };
    }
    return { ok: true };
  }

  if (!res.ok) {
    return { ok: false, error: `Vercel POST failed (${res.status})` };
  }

  return { ok: true };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return fail("Method not allowed", 405, "BAD_REQUEST");
  }

  try {
    const user = await getUserFromRequest(req);
    if (!user) return fail("Unauthorized", 401, "UNAUTHORIZED");

    const admin = await isAdmin(user.id);
    if (!admin) return fail("Forbidden", 403, "FORBIDDEN");

    const body = await req.json().catch(() => null);
    const key = body?.key;
    const value = body?.value;
    const envTarget = body?.env;

    if (!key || typeof value !== "string" || !envTarget) {
      return fail("Invalid payload", 400, "BAD_REQUEST");
    }

    const whitelist = parseWhitelist();
    if (whitelist.length > 0 && !whitelist.includes(key)) {
      return fail("Key not allowed", 403, "FORBIDDEN");
    }

    const targets =
      envTarget === "both"
        ? ["production", "preview"]
        : envTarget === "production"
        ? ["production"]
        : ["preview"];

    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) return fail("Server not configured", 500, "SERVER_ERROR");
    const adminClient = createClient(url, serviceKey);

    const result = await upsertEnvVar({ key, value, targets });
    if (!result.ok) return fail(result.error || "Failed to apply", 500, "SERVER_ERROR", { key, envTarget });

    await logAuditEvent(adminClient, {
      actorId: user.id,
      action: "admin_apply_secret",
      entity: "vercel_env",
      metadata: { key, envTarget },
    });

    return ok({});
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unknown error", 500, "SERVER_ERROR");
  }
});
