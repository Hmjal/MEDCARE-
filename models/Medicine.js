const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    packSize: { type: String, default: '' },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    reviewsCount: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 25, min: 0 },
    batchNo: { type: String, default: 'MC-2026-A1', trim: true },
    expiryDate: { type: String, default: '2027-06-30', trim: true },
    isActive: { type: Boolean, default: true },
    requiresPrescription: { type: Boolean, default: false },
    dosage: { type: String, default: '' },
    composition: { type: String, default: '' },
    manufacturer: { type: String, default: '' },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    dateAdded: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Medicine', medicineSchema);
