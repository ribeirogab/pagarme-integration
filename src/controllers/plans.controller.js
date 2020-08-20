const { HttpError } = require('../utils/errors')
const Controller = require('./controller')
const { Plans } = require('../models/plans.model')

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
      .delete(this.destroy);
  }

  async store(req, res, next) {
    try {
      const { title, name, price_in_cents, expires_in_days } = req.body;

      const plan = await Plans.create({ 
        title, name, price_in_cents, expires_in_days
      });

      return res.json(plan);      
    } catch (error) {
      return next(new HttpError(error.message))
    }
  }

  async list(req, res, next) {
    const plans = await Plans.find();

    return res.json(plans);
  }

  async show(req, res, next) {
    try {
      const { planId } = req.params
      const plan = await Plans.findOne({ name: planId });
  
      return res.json(plan)
    } catch (error) {
      return next(new HttpError(error.message))
    }
  }

  async update(req, res, next) {
    try {
      const updatedFields = req.body
      const { planId } = req.params;

      await Plans.findByIdAndUpdate(planId, { ...updatedFields })
  
      const plan = await Plans.findById(planId)
  
      return res.json(plan);
    } catch (error) {
      return next(new HttpError(error.message))
    }
  }

  async destroy(req, res, next) {
    try {
      const { planId } = req.params;
      await Plans.findByIdAndDelete(planId);
  
      return res.status(200).json({});
    } catch (error) {
      return next(new HttpError(error.message))
    }
  }
}

module.exports = new PlansController()