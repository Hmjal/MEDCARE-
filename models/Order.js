const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, trim: true },
    userEmail: { type: String, lowercase: true, trim: true, default: '' },
    customer: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    deliveryAddress: { type: String, required: true },
    date: { type: String, default: () => new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing'
    },
    statusText: { type: String, default: 'Processing & Packed' },
    timelineIndex: { type: Number, default: 1 },
    paymentMethod: { type: String, default: 'Online Payment' },
    items: [
      {
        id: String,
        name: String,
        brand: String,
        price: Number,
        quantity: Number,
        image: String
      }
    ],
    subtotal: { type: Number, default: 0 },
    delivery: { type: Number, default: 0 },
    taxes: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
