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

async function isAllowedPrice(priceId: string): Promise<boolean> {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return false;

  const adminClient = createClient(url, serviceKey);
  const { data } = await adminClient
    .from("subscription_plans")
    .select("id")
    .or(`stripe_price_id_monthly.eq.${priceId},stripe_price_id_annual.eq.${priceId}`)
    .limit(1);

  return (data || []).length > 0;
}

async function createStripeSession(params: {
  priceId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const key = Deno.env.get("STRIPE_SECRET_KEY");
  if (!key) return { ok: false, error: "STRIPE_SECRET_KEY not configured" };

  const body = new URLSearchParams();
  body.set("mode", "subscription");
  body.set("success_url", params.successUrl);
  body.set("cancel_url", params.cancelUrl);
  body.set("customer_email", params.email);
  body.set("line_items[0][price]", params.priceId);
  body.set("line_items[0][quantity]", "1");

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, error: data?.error?.message || `Stripe HTTP ${res.status}` };
  }

  return { ok: true, url: data?.url };
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
    if (!user || !user.email) return fail("Unauthorized", 401, "UNAUTHORIZED");

    const body = await req.json().catch(() => null);
    const priceId = body?.priceId;
    if (!priceId) return fail("Missing priceId", 400, "BAD_REQUEST");

    const allowed = await isAllowedPrice(priceId);
    if (!allowed) return fail("Invalid priceId", 400, "BAD_REQUEST");

    const origin = req.headers.get("Origin") || Deno.env.get("APP_BASE_URL") || "http://localhost:5173";
    const successUrl = `${origin}/#/member?checkout=success`;
    const cancelUrl = `${origin}/#/pricing?checkout=cancel`;

    const session = await createStripeSession({
      priceId,
      email: user.email,
      successUrl,
      cancelUrl,
    });

    if (!session.ok) return fail(session.error || "Stripe error", 500, "SERVER_ERROR");

    return ok({ url: session.url });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unknown error", 500, "SERVER_ERROR");
  }
});
