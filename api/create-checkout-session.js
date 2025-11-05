const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-07-30.basil' });
module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow','POST'); return res.status(405).json({ error:'Method Not Allowed' }); }
  try {
    const { priceId, quantity = 1, successUrl, cancelUrl } = req.body || {};
    if (!priceId) return res.status(400).json({ error:'Missing priceId' });
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity }],
      success_url: successUrl || 'https://bmcore-bolt1.vercel.app/success',
      cancel_url:  cancelUrl  || 'https://bmcore-bolt1.vercel.app/cancel'
    });
    return res.status(200).json({ url: session.url });
  } catch { return res.status(500).json({ error:'Internal Server Error' }); }
};
