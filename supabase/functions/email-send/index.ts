import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, fail, ok } from "../_shared/response.ts";

async function sendViaResend(payload: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from: string;
  replyTo?: string;
}) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return { ok: false, error: "RESEND_API_KEY not configured" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      reply_to: payload.replyTo,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, error: data?.message || `Resend HTTP ${res.status}` };
  }

  return { ok: true, messageId: data?.id, provider: "resend" };
}

async function sendViaSendGrid(payload: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from: string;
  replyTo?: string;
}) {
  const key = Deno.env.get("SENDGRID_API_KEY");
  if (!key) return { ok: false, error: "SENDGRID_API_KEY not configured" };

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: payload.to }] }],
      from: { email: payload.from },
      reply_to: payload.replyTo ? { email: payload.replyTo } : undefined,
      subject: payload.subject,
      content: [
        { type: "text/html", value: payload.html },
        ...(payload.text ? [{ type: "text/plain", value: payload.text }] : []),
      ],
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data?.errors?.[0]?.message || `SendGrid HTTP ${res.status}` };
  }

  return { ok: true, messageId: res.headers.get("x-message-id") || undefined, provider: "sendgrid" };
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
    const user = await getUserFromRequest(req);
    if (!user) return fail("Unauthorized", 401, "UNAUTHORIZED");

    const body = await req.json().catch(() => null);
    if (!body?.to || !body?.subject || !body?.html) {
      return fail("Missing required fields", 400, "BAD_REQUEST");
    }

    const admin = await isAdmin(user.id);
    if (!admin && body.to !== user.email) {
      return fail("Forbidden", 403, "FORBIDDEN");
    }

    const from = Deno.env.get("EMAIL_FROM") || "BioMath Core <no-reply@biomathcore.com>";
    const replyTo = Deno.env.get("EMAIL_REPLY_TO") || "support@biomathcore.com";

    const payload = {
      to: body.to,
      subject: body.subject,
      html: body.html,
      text: body.text,
      from,
      replyTo,
    };

    const resend = await sendViaResend(payload);
    if (resend.ok) return ok({ messageId: resend.messageId, provider: resend.provider });

    const sendgrid = await sendViaSendGrid(payload);
    if (sendgrid.ok) return ok({ messageId: sendgrid.messageId, provider: sendgrid.provider });

    return fail(resend.error || sendgrid.error || "Email provider not configured", 503, "SERVER_ERROR");
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unknown error", 500, "SERVER_ERROR");
  }
});
