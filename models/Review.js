const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    medicineId: { type: String, required: true, index: true, trim: true },
    userEmail: { type: String, lowercase: true, trim: true, default: '' },
    name: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, default: 'Customer Review' },
    comment: { type: String, required: true, trim: true },
    verified: { type: Boolean, default: true },
    date: { type: String, default: () => new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
