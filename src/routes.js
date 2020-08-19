const { Router } = require('express');

const paymentsRouter = Router();

paymentsRouter.post('/payments', async (req, res) => {
  try {
    const client = await pagarme.client.connect({ api_key: process.env.PAGARME_API_KEY });

    const transactions = await client.capture({ id: '1627822' });
  
    return res.json(transactions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

paymentsRouter.get('/payments', (req, res) => {
  return res.json({});
});

module.exports = paymentsRouter;