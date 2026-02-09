import { supabase } from "./supabase";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  provider?: string;
  error?: string;
}

async function getAuthHeader(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? `Bearer ${token}` : null;
}

export async function sendEmail(payload: EmailPayload): Promise<EmailResponse> {
  const auth = await getAuthHeader();
  if (!auth) {
    return { success: false, error: "Not authenticated" };
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    return { success: false, error: "Supabase URL not configured" };
  }

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/email-send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify({
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || data?.ok === false) {
      return { success: false, error: data?.error || `HTTP ${res.status}` };
    }

    const responsePayload = data?.data || data;
    return {
      success: true,
      messageId: responsePayload?.messageId,
      provider: responsePayload?.provider,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Email rendering utility
export function renderTemplate(html: string, variables: Record<string, any>): string {
  let rendered = html;

  // Simple variable replacement: {{variableName}}
  Object.keys(variables).forEach((key) => {
    const value = variables[key];
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    rendered = rendered.replace(regex, String(value));
  });

  return rendered;
}

// Convert HTML to plain text (basic implementation)
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, "")
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();
}
