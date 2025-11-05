import Stripe from 'stripe';

export const config = { api: { bodyParser: false } };

async function rawBody(req) {
  const chunks = [];
  for await (const ch of req) chunks.push(Buffer.isBuffer(ch) ? ch : Buffer.from(ch));
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow','POST'); return res.status(405).send('Method Not Allowed'); }
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(500).send('Stripe env missing');

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-07-30.basil' });
    const sig = req.headers['stripe-signature'];
    if (!sig) return res.status(400).send('Missing stripe-signature');

    const raw = (await rawBody(req)).toString('utf8');
    stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
    return res.status(200).send('ok');
  } catch (e) {
    return res.status(400).send(`Webhook Error: ${e?.message || e}`);
  }
}
