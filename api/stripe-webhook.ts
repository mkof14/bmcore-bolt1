import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
export const config = { api: { bodyParser: false } };
function buffer(req: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    req.on('data', (c: any) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  const sig = req.headers['stripe-signature'] as string;
  const whsec = process.env.STRIPE_WEBHOOK_SECRET;
  const sk = process.env.STRIPE_SECRET_KEY;
  if (!whsec || !sk) return res.status(500).send('Webhook not configured');
  const stripe = new Stripe(sk as string, { apiVersion: '2024-11-20.acacia' });
  try {
    const buf = await buffer(req);
    const event = stripe.webhooks.constructEvent(buf, sig, whsec);
    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err?.message || err);
    return res.status(400).send(`Webhook Error: ${err?.message || 'Unknown error'}`);
  }
}
