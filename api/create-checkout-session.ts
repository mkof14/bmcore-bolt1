import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-07-30.basil',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { priceId, quantity = 1, successUrl, cancelUrl } =
      typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    if (!priceId && !req.body?.lookupKey) {
      return res.status(400).json({ error: 'Provide priceId or lookupKey' });
    }

    let price = null as null | { id: string; recurring?: unknown };
    if (priceId) {
      const p = await stripe.prices.retrieve(String(priceId));
      price = { id: p.id, recurring: p.recurring };
    } else {
      const prices = await stripe.prices.list({ lookup_keys: [String(req.body.lookupKey)], expand: ['data.product'] });
      if (!prices.data.length) return res.status(400).json({ error: 'Price not found by lookupKey' });
      const p = prices.data[0];
      price = { id: p.id, recurring: p.recurring };
    }

    const mode = price?.recurring ? 'subscription' : 'payment';

    const session = await stripe.checkout.sessions.create({
      mode: mode as 'subscription' | 'payment',
      line_items: [{ price: price!.id, quantity }],
      success_url: successUrl || 'https://bmcore-bolt1.vercel.app/success',
      cancel_url: cancelUrl || 'https://bmcore-bolt1.vercel.app/cancel',
    });

    return res.status(200).json({ url: session.url, price: price!.id, mode });
  } catch (e: any) {
    return res.status(500).json({ error: e?.raw?.message || e?.message || String(e) });
  }
}
