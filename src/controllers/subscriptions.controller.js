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
        paymentWithCreditCard.card_hash = transaction.card.id;
        paymentWithCreditCard.card_number = Number(
          `${transaction.card.first_digits}${transaction.card.last_digits}`
          );
        paymentWithCreditCard.card_cvv = 783;
        paymentWithCreditCard.card_holder_name = transaction.card.holder_name;
        paymentWithCreditCard.expiration_date = transaction.card.expiration_date;
        paymentWithCreditCard.card_id = transaction.card.id;
      }

      const subscription = await client.subscriptions.create({
        plan_id: planId,
        payment_method: transaction.payment_method,
        ...paymentWithCreditCard,
        customer: {
          name: transaction.customer.name,
          email: transaction.customer.email,
          document_number: transaction.customer.document_number,
          address: {
            street: transaction.billing.address.street,
            street_number: transaction.billing.address.street_number,
            complementary: transaction.billing.address.complementary,
            neighborhood: transaction.billing.address.neighborhood,
            zipcode: transaction.billing.address.zipcode,
          },
        }
      });
       
      return res.json(subscription);
    } catch (error) {
      return next(new HttpError(error.message))
    }
  }
}

module.exports = new PaymentsController()