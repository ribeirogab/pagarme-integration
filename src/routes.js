const { Router } = require('express');

const paymentsRouter = Router();

paymentsRouter.post('/payments', async (req, res) => {
  const client = await pagarme.client.connect({ api_key: process.env.PAGARME_API_KEY });

  const transactions = await client.capture({ id: '1627822' });

  return res.json(transactions);
});

paymentsRouter.get('/payments', (req, res) => {
  return res.json({ 
    PAGARME_API_KEY: process.env.PAGARME_API_KEY,
    PAGARME_ENCRYPTION_KEY: process.env.PAGARME_ENCRYPTION_KEY,
  });
});

module.exports = paymentsRouter;