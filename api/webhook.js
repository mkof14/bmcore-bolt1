const Stripe = require('stripe');
exports.config = { api: { bodyParser: false } };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-07-30.basil' });
async function rawBody(req){const c=[];for await (const ch of req){c.push(Buffer.isBuffer(ch)?ch:Buffer.from(ch));}return Buffer.concat(c);}
module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow','POST'); return res.status(405).send('Method Not Allowed'); }
  const sig = req.headers['stripe-signature']; if (!sig) return res.status(400).send('Missing stripe-signature');
  const raw = (await rawBody(req)).toString('utf8');
  try { stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET); }
  catch (e){ return res.status(400).send(`Webhook Error: ${e.message}`); }
  return res.status(200).send('ok');
};
