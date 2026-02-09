import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, fail, ok } from "../_shared/response.ts";

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

    const body = await req.json().catch(() => null);
    if (!body?.session_id || !body?.start_time) {
      return fail("Invalid payload", 400, "BAD_REQUEST");
    }

    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) {
      return fail("Server not configured", 500, "SERVER_ERROR");
    }

    const adminClient = createClient(url, serviceKey);

    const payload = {
      session_id: body.session_id,
      user_id: user.id,
      start_time: body.start_time,
      end_time: body.end_time,
      duration: body.duration,
      events: body.events,
      heatmap_points: body.heatmap_points,
      url: body.url,
      user_agent: body.user_agent,
      screen_resolution: body.screen_resolution,
      viewport_size: body.viewport_size,
    };

    const { error } = await adminClient.from("session_recordings").insert(payload);
    if (error) return fail(error.message, 500, "SERVER_ERROR");

    return ok({});
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unknown error", 500, "SERVER_ERROR");
  }
});
