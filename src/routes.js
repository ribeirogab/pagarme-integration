const { Router } = require('express');

const paymentsRouter = Router();

paymentsRouter.post('/payments', (req, res) => {

});

paymentsRouter.get('/payments', (req, res) => {
  return res.json({ ok: true });
});

module.exports = paymentsRouter;