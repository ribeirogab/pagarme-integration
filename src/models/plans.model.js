const mongoose = require('mongoose');

const PlansSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    name: { type: String, required: true },
    price_in_cents: { type: Number, required: true },
    expires_in_days: { type: Number, required: true },
  }
);

const Plans = mongoose.model('Plans', PlansSchema);

module.exports = {
  PlansSchema,
  Plans,
}