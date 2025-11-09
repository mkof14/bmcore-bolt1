import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
const secret = process.env.STRIPE_SECRET_KEY;
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  if (!secret) return res.status(500).json({ error: 'Stripe not configured' });
  const stripe = new Stripe(secret as string, { apiVersion: '2024-11-20.acacia' });
  try {
    const { priceId, quantity = 1, successUrl, cancelUrl } = (req.body ?? {}) as {
      priceId?: string; quantity?: number; successUrl?: string; cancelUrl?: string;
    };
    if (!priceId) return res.status(400).json({ error: 'Missing priceId' });
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity }],
      success_url: successUrl || 'http://localhost:3000/success',
      cancel_url: cancelUrl || 'http://localhost:3000/cancel',
      allow_promotion_codes: true,
      billing_address_collection: 'auto'
    });
    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe checkout error:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Checkout failed' });
  }
}
