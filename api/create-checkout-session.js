import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow','POST'); return res.status(405).json({ error:'Method Not Allowed' }); }
  if (!process.env.STRIPE_SECRET_KEY) return res.status(500).json({ error:'STRIPE_SECRET_KEY missing' });

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-07-30.basil' });

    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch {} }
    const { priceId, lookupKey, quantity = 1, successUrl, cancelUrl } = body || {};

    let price;
    if (lookupKey) {
      const list = await stripe.prices.list({ active:true, lookup_keys:[lookupKey], limit:1, expand:['data.product'] });
      price = list.data[0];
      if (!price) return res.status(404).json({ error:'Price by lookup_key not found' });
    } else if (priceId) {
      price = await stripe.prices.retrieve(String(priceId), { expand:['product'] });
      if (!price || !price.active) return res.status(404).json({ error:'Price not found or inactive', priceId });
    } else {
      return res.status(400).json({ error:'Provide priceId or lookupKey' });
    }

    const mode = price.recurring ? 'subscription' : 'payment';
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: price.id, quantity }],
      success_url: successUrl || 'https://bmcore-bolt1.vercel.app/success',
      cancel_url:  cancelUrl  || 'https://bmcore-bolt1.vercel.app/cancel'
    });

    return res.status(200).json({ url: session.url, price: price.id, mode });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
