const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '', trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ['customer', 'pharmacist', 'admin', 'patient'],
      default: 'customer'
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    },
    gender: { type: String, default: 'Not Specified' },
    dob: { type: String, default: '' },
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        pincode: String,
        name: String,
        phone: String,
        addressLine: String
      }
    ],
    cart: { type: Array, default: [] },
    wishlist: { type: Array, default: [] },
    memberSince: {
      type: String,
      default: () => new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    },
    walletBalance: { type: Number, default: 350 },
    medcareCoins: { type: Number, default: 700 },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Hash password using bcrypt (10 salt rounds) before saving if modified
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare candidate password against hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
