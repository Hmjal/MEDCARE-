const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const mongoose = require('mongoose');
const Medicine = require('./models/Medicine');
const { PHARMACY_DATA } = require('./js/data');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const products = PHARMACY_DATA.allProducts || [];
    for (const item of products) {
      await Medicine.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
    }

    console.log(`Synced ${products.length} medicines into MongoDB.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
