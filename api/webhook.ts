import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
export const config = { api: { bodyParser: false } };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-07-30.basil' });
async function buffer(req: VercelRequest): Promise<Buffer> { const chunks: Buffer[] = []; for await (const c of req) chunks.push(Buffer.isBuffer(c)?c:Buffer.from(c)); return Buffer.concat(chunks); }
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') { res.setHeader('Allow','POST'); return res.status(405).send('Method Not Allowed'); }
  const sig = req.headers['stripe-signature']; if (!sig) return res.status(400).send('Missing stripe-signature');
  const raw = (await buffer(req)).toString('utf8');
  try { stripe.webhooks.constructEvent(raw, sig as string, process.env.STRIPE_WEBHOOK_SECRET!); }
  catch (err: any) { return res.status(400).send(`Webhook Error: ${err.message}`); }
  return res.status(200).send('ok');
}
