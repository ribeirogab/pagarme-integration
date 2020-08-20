const pagarme = require('pagarme');

const { HttpError } = require('../utils/errors');
const Controller = require('./controller');

class PlansController extends Controller {
  routes() {
    this.router
      .route('/plans')
      .post(this.store)
      .get(this.list);

    this.router
      .route('/plans/:planId')
      .get(this.show)
      .put(this.update)
  }

  async store(req, res, next) {
    try {
      const { title, price_in_cents, expires_in_days, payment_methods } = req.body;

      const client = await pagarme.client.connect({ api_key: process.env.PAGARME_API_KEY });

      if (!client) throw Error('Invalid API KEY');

      const plan = await client.plans.create({
        amount: price_in_cents,
        days: expires_in_days,
        name: title,
        payment_methods,
      })

      if (!plan) throw Error('Error creating pagarme plan');

      return res.json(plan);      
    } catch (error) {
      return next(new HttpError(error.message))
    }
  }

  async list(req, res, next) {
    try {
      const client = await pagarme.client.connect({ api_key: process.env.PAGARME_API_KEY });

      const plans = await client.plans.all();

      return res.json(plans);
    } catch (error) {
      return next(new HttpError(error.message))
    }
  }

  async show(req, res, next) {
    try {
      const { planId } = req.params;

      const client = await pagarme.client.connect({ api_key: process.env.PAGARME_API_KEY });

      const plan = await client.plans.find({ id: planId });
  
      return res.json(plan);
    } catch (error) {
      return next(new HttpError(error.message))
    }
  }

  async update(req, res, next) {
    try {
      const updatedFields = req.body
      const { planId } = req.params;

      const client = await pagarme.client.connect({ api_key: process.env.PAGARME_API_KEY });

      const updatedPlan = await client.plans.update({
        id: planId,
        ...updatedFields
	    });
  
      return res.json(updatedPlan);
    } catch (error) {
      return next(new HttpError(error.message))
    }
  }
}

module.exports = new PlansController()