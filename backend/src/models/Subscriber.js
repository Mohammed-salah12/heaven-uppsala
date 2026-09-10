const mongoose = require('mongoose');

/** A newsletter subscriber ("Missa inget genom vårt nyhetsbrev"). */
const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    lang: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscriber', subscriberSchema);
