import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, fail, ok } from "../_shared/response.ts";
import { deleteUserRows } from "../_shared/userDeletion.ts";

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

const SHOULD_FAIL_ON_PARTIAL_DELETE = true;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return fail("Method not allowed", 405, "BAD_REQUEST");
  }

  try {
    const caller = await getUserFromRequest(req);
    if (!caller) return fail("Unauthorized", 401, "UNAUTHORIZED");

    const body = await req.json().catch(() => null);
    const requestedUserId = body?.userId || caller.id;

    if (requestedUserId !== caller.id) {
      const admin = await isAdmin(caller.id);
      if (!admin) return fail("Forbidden", 403, "FORBIDDEN");
    }

    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) return fail("Server not configured", 500, "SERVER_ERROR");

    const adminClient = createClient(url, serviceKey);

    const errors = await deleteUserRows(adminClient, requestedUserId);
    if (errors.length && SHOULD_FAIL_ON_PARTIAL_DELETE) {
      return fail("Failed to delete all user data", 500, "SERVER_ERROR", { errors });
    }

    await adminClient.auth.admin.deleteUser(requestedUserId);

    await logAuditEvent(adminClient, {
      actorId: caller.id,
      action: "gdpr_delete_user",
      entity: "profiles",
      entityId: requestedUserId,
    });

    return ok({});
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unknown error", 500, "SERVER_ERROR");
  }
});
