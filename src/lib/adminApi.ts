import { supabase } from "./supabase";

type AdminAction = "insert" | "update" | "upsert" | "delete";

export async function adminDb<T = any>(params: {
  table: string;
  action: AdminAction;
  data?: T | T[];
  match?: Record<string, any>;
  onConflict?: string;
}) {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) {
    return { ok: false, error: "Authentication required" };
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const res = await fetch(`${supabaseUrl}/functions/v1/admin-db`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok || json?.ok === false) {
    return { ok: false, error: json?.error || `HTTP ${res.status}`, code: json?.code };
  }

  return { ok: true, data: json?.data ?? json };
}
