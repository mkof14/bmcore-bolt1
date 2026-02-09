import { supabase } from "./supabase";

export async function startCheckout(priceId: string) {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) {
    throw new Error("Authentication required");
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const r = await fetch(`${supabaseUrl}/functions/v1/create-checkout-session`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ priceId }),
  });
  const data = await r.json();
  if (!r.ok || data?.ok === false) throw new Error(data?.error || "Checkout failed");
  const url = data?.data?.url || data?.url;
  if (!url) throw new Error("Checkout URL missing");
  window.location.href = url;
}
