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

    const admin = await isAdmin(caller.id);
    if (!admin) return fail("Forbidden", 403, "FORBIDDEN");

    const body = await req.json().catch(() => null);
    const email = body?.email;
    const password = body?.password;
    if (!email || !password) return fail("Missing email or password", 400, "BAD_REQUEST");

    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) return fail("Server not configured", 500, "SERVER_ERROR");

    const adminClient = createClient(url, serviceKey);

    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: body?.full_name || "",
        first_name: body?.first_name || "",
        last_name: body?.last_name || "",
        phone: body?.phone || "",
        role: body?.role || "user",
      },
    });

    if (createError || !created?.user) {
      return fail(createError?.message || "Failed to create user", 400, "BAD_REQUEST", { email });
    }

    const isAdminRole = body?.role === "admin" || body?.role === "super_admin";

    const { error: profileError } = await adminClient
      .from("profiles")
      .upsert(
        {
          id: created.user.id,
          email,
          full_name: body?.full_name || "",
          first_name: body?.first_name || "",
          last_name: body?.last_name || "",
          phone: body?.phone || "",
          role: body?.role || "user",
          is_admin: isAdminRole,
        },
        { onConflict: "id" }
      );

    if (profileError) {
      return fail(profileError.message, 400, "BAD_REQUEST", { userId: created.user.id });
    }

    await logAuditEvent(adminClient, {
      actorId: caller.id,
      action: "admin_create_user",
      entity: "profiles",
      entityId: created.user.id,
      metadata: { email, role: body?.role || "user" },
    });

    return ok({ userId: created.user.id });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unknown error", 500, "SERVER_ERROR");
  }
});
