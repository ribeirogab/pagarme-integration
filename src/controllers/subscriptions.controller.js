const pagarme = require('pagarme');

const { HttpError } = require('../utils/errors');
const Controller = require('./controller');

class PaymentsController extends Controller {
  routes() {
    this.router
      .route('/subscriptions/:planId')
      .post(this.store)
  }

  async store(req, res, next) {
    try {
      const { planId } = req.params;
      const { token, userToken } = req.body;

      const client = await pagarme.client.connect({ api_key: process.env.PAGARME_API_KEY });

      const selectedPlan = await client.plans.find({ id: planId });

      if (!selectedPlan) throw Error('Plan does not exist!');

      const transaction = await client.transactions.capture({
        id: token, amount: selectedPlan.amount,
      });

      if (!transaction) throw Error('Transaction does not exist!');

      let paymentWithCreditCard = {};

      if (transaction.payment_method === 'credit_card') {
        const client_encrypt = pagarme.client.connect({ encryption_key: process.env.PAGARME_ENCRYPTION_KEY });

        const card_hash = client_encrypt.security.encrypt({
          // card_number: transaction.card.holder_name,
          card_holder_name: transaction.card.holder_name,
          card_expiration_date: transaction.card.expiration_date,
          // card_cvv: transaction.card.holder_name,
        });
      }

      const subscription = await client.subscriptions.create({
        plan_id: planId,
        payment_method: transaction.payment_method,
        ...paymentWithCreditCard,
        customer: {
          email: 'someone@somewhere.com',
          document_number: '30621143049'
        }
      });
       
      return res.json(subscription);
    } catch (error) {
      return next(new HttpError(error.message))
    }
  }
}

module.exports = new PaymentsController()