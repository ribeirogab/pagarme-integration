const pagarme = require('pagarme');

const { HttpError } = require('../utils/errors')
const Controller = require('./controller')
const { Plans } = require('../models/plans.model')

class PaymentsController extends Controller {
  routes() {
    this.router
      .route('/payments/:planName')
      .post(this.store)
  }

  async store(req, res, next) {
    try {
      const { planName } = req.params;
      const { token } = req.body;

      const selectedPlan = await Plans.findOne({ name: planName });

      if (!selectedPlan) throw Error('Plan does not exist!');

      const client = await pagarme.client.connect({
        api_key: process.env.PAGARME_API_KEY
      });

      const transaction = await client.transactions.capture({
        id: token, amount: selectedPlan.price
      });
       
      return res.json(transaction);
    } catch (error) {
      return next(new HttpError(error.message))
    }
  }
}

module.exports = new PaymentsController()