const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const User = require('./models/User');
const Medicine = require('./models/Medicine');
const Order = require('./models/Order');
const Prescription = require('./models/Prescription');
const Review = require('./models/Review');
const Contact = require('./models/Contact');
const Subscriber = require('./models/Subscriber');
const { PHARMACY_DATA } = require('./js/data');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'medcare_jwt_secret_2026';

// Ensure uploads/prescriptions directory exists
const uploadDir = path.join(__dirname, 'uploads', 'prescriptions');
fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage & validation (.jpg, .png, .pdf up to 10MB)
const rxStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `rx-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  }
});

const uploadRx = multer({
  storage: rxStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedExt = ['.jpg', '.jpeg', '.png', '.pdf'];
    const allowedMime = ['image/jpeg', 'image/png', 'application/pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExt.includes(ext) && allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg, .png, and .pdf files are allowed (max 10MB).'));
    }
  }
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(__dirname));

// Mount Auth Routes (routes/authRoutes.js)
app.use('/api/auth', require('./routes/authRoutes'));

// Sanitize user object before sending to client
function formatUserResponse(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    gender: user.gender,
    dob: user.dob,
    avatar: user.avatar,
    role: user.role,
    memberSince: user.memberSince,
    walletBalance: user.walletBalance,
    medcareCoins: user.medcareCoins,
    cart: user.cart || [],
    wishlist: user.wishlist || [],
    addresses: user.addresses || []
  };
}

async function getAuthUser(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) return user;
    } catch (e) { /* fall through */ }
  }
  const email = (req.body && req.body.email) || (req.query && req.query.email);
  if (email) {
    return User.findOne({ email: String(email).toLowerCase().trim() });
  }
  return null;
}

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: '7d'
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    dbConnected: mongoose.connection.readyState === 1
  });
});

// ==========================================
// MEDICINE ROUTES
// ==========================================

// List medicines with optional search and category filter
app.get('/api/medicines', async (req, res) => {
  try {
    const { q, category, rx } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = { $regex: category, $options: 'i' };
    }
    if (rx === 'true') {
      filter.requiresPrescription = true;
    } else if (rx === 'false') {
      filter.requiresPrescription = false;
    }
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { composition: { $regex: q, $options: 'i' } }
      ];
    }

    const medicines = await Medicine.find(filter).sort({ createdAt: 1 });
    res.json({ medicines });
  } catch (err) {
    console.error('Fetch medicines error:', err);
    res.status(500).json({ error: 'Failed to fetch medicines.' });
  }
});

// Get single medicine by custom id or Mongo _id
app.get('/api/medicines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let medicine = await Medicine.findOne({ id });
    if (!medicine && mongoose.Types.ObjectId.isValid(id)) {
      medicine = await Medicine.findById(id);
    }
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found.' });
    }
    res.json({ medicine });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch medicine.' });
  }
});

// Create medicine
app.post('/api/medicines', async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.brand || !data.category || data.price == null || data.mrp == null) {
      return res.status(400).json({ error: 'name, brand, category, price, and mrp are required.' });
    }
    if (!data.id) {
      data.id = 'prod-' + Date.now();
    }
    const medicine = await Medicine.create(data);
    res.status(201).json({ medicine });
  } catch (err) {
    console.error('Create medicine error:', err);
    res.status(500).json({ error: 'Failed to create medicine.' });
  }
});

// Update medicine
app.put('/api/medicines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findOneAndUpdate({ id }, req.body, { returnDocument: 'after' });
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found.' });
    }
    res.json({ medicine });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update medicine.' });
  }
});

// Delete medicine
app.delete('/api/medicines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Medicine.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ error: 'Medicine not found.' });
    }
    res.json({ message: 'Medicine deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete medicine.' });
  }
});

// ==========================================
// ORDER ROUTES
// ==========================================

const ORDER_STATUS_META = {
  pending: { statusText: 'Pending Verification', timelineIndex: 0 },
  processing: { statusText: 'Processing & Packed', timelineIndex: 1 },
  shipped: { statusText: 'Shipped / Out for Delivery', timelineIndex: 3 },
  delivered: { statusText: 'Delivered', timelineIndex: 4 },
  cancelled: { statusText: 'Cancelled', timelineIndex: 0 }
};

// List orders (optionally filtered by userEmail)
app.get('/api/orders', async (req, res) => {
  try {
    const { email } = req.query;
    const filter = email ? { userEmail: email.toLowerCase().trim() } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const data = req.body;
    if (!data.customer || !data.deliveryAddress || data.total == null) {
      return res.status(400).json({ error: 'customer, deliveryAddress, and total are required.' });
    }
    if (!data.orderId) {
      data.orderId = '#MED-ORD-' + Math.floor(10000 + Math.random() * 90000);
    }
    const status = data.status || 'processing';
    const meta = ORDER_STATUS_META[status] || ORDER_STATUS_META.processing;
    data.status = status;
    data.statusText = data.statusText || meta.statusText;
    data.timelineIndex = data.timelineIndex != null ? data.timelineIndex : meta.timelineIndex;

    const order = await Order.create(data);

    // Update user's wallet, MedCare Coins, and clear synced cart if logged in
    let updatedUser = null;
    const userEmail = (data.userEmail || '').toLowerCase().trim();
    if (userEmail) {
      const user = await User.findOne({ email: userEmail });
      if (user) {
        const coinsEarned = Math.max(5, Math.round(Number(data.total || 0) * 0.05));
        const walletUsed = Number(data.walletUsed || 0);
        if (walletUsed > 0) {
          user.walletBalance = Math.max(0, (user.walletBalance || 0) - walletUsed);
        }
        user.medcareCoins = (user.medcareCoins || 0) + coinsEarned;
        user.cart = [];
        await user.save();
        updatedUser = formatUserResponse(user);
      }
    }

    res.status(201).json({ order, updatedUser });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create order.' });
  }
});

// Update order status
app.patch('/api/orders/:orderId/status', async (req, res) => {
  try {
    const rawId = decodeURIComponent(req.params.orderId);
    const { status } = req.body;
    const meta = ORDER_STATUS_META[status];
    if (!meta) {
      return res.status(400).json({ error: 'Invalid order status.' });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: rawId },
      { status, statusText: meta.statusText, timelineIndex: meta.timelineIndex },
      { returnDocument: 'after' }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json({ order });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

// ==========================================
// PRESCRIPTION UPLOAD & VERIFICATION PIPELINE
// ==========================================

async function findPrescriptionByAnyId(idParam) {
  const raw = decodeURIComponent(idParam);
  if (mongoose.Types.ObjectId.isValid(raw)) {
    const byObj = await Prescription.findById(raw);
    if (byObj) return byObj;
  }
  return Prescription.findOne({ rxId: raw });
}

// 1. Secure Multer Upload Route for Logged-In Users
app.post('/api/prescriptions/upload', async (req, res, next) => {
  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Please log in to upload a prescription.' });
  }
  req.authUser = user;
  next();
}, (req, res) => {
  uploadRx.single('prescriptionFile')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'File upload failed.' });
    }
    try {
      const { patient_name, patient_phone, notes_by_patient, doctor } = req.body;
      if (!patient_name || !patient_phone) {
        return res.status(400).json({ error: 'patient_name and patient_phone are required.' });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'Please attach a valid .jpg, .png, or .pdf prescription file.' });
      }

      const rxId = '#RX-' + Math.floor(10000 + Math.random() * 90000);
      const prescription = await Prescription.create({
        user_id: req.authUser._id,
        userEmail: req.authUser.email,
        patient_name: String(patient_name).trim(),
        patient_phone: String(patient_phone).trim(),
        file_url: `/uploads/prescriptions/${req.file.filename}`,
        notes_by_patient: notes_by_patient ? String(notes_by_patient).trim() : '',
        status: 'Pending',
        doctor: doctor ? String(doctor).trim() : 'Registered Physician',
        rxId,
        uploaded_at: new Date()
      });

      res.status(201).json({ message: 'Prescription uploaded successfully.', prescription });
    } catch (saveErr) {
      console.error('Upload prescription error:', saveErr);
      res.status(500).json({ error: 'Failed to save prescription.' });
    }
  });
});

// 2. Customer Prescriptions List (by authenticated user or email)
app.get('/api/prescriptions', async (req, res) => {
  try {
    const authUser = await getAuthUser(req);
    const { email, status } = req.query;
    const filter = {};
    if (authUser) {
      filter.$or = [{ user_id: authUser._id }, { userEmail: authUser.email }];
    } else if (email) {
      filter.userEmail = email.toLowerCase().trim();
    }
    if (status && status !== 'all') filter.status = status;

    const prescriptions = await Prescription.find(filter)
      .populate('prescribed_items.medicine_id')
      .sort({ uploaded_at: -1, createdAt: -1 });
    res.json({ prescriptions });
  } catch (err) {
    console.error('Fetch prescriptions error:', err);
    res.status(500).json({ error: 'Failed to fetch prescriptions.' });
  }
});

// Compatibility JSON upload route (used by Quick Rx modal)
app.post('/api/prescriptions', async (req, res) => {
  try {
    const data = req.body;
    const authUser = await getAuthUser(req);
    const patientName = data.patient_name || data.patient;
    const patientPhone = data.patient_phone || data.phone || '0000000000';
    if (!patientName) {
      return res.status(400).json({ error: 'patient_name is required.' });
    }

    const prescription = await Prescription.create({
      user_id: authUser ? authUser._id : undefined,
      userEmail: (data.userEmail || (authUser && authUser.email) || '').toLowerCase().trim(),
      patient_name: patientName,
      patient_phone: patientPhone,
      file_url: data.file_url || data.image || '',
      notes_by_patient: data.notes_by_patient || data.notes || '',
      status: 'Pending',
      doctor: data.doctor || 'Registered Physician',
      rxId: data.rxId || ('#RX-' + Math.floor(10000 + Math.random() * 90000)),
      uploaded_at: new Date()
    });
    res.status(201).json({ prescription });
  } catch (err) {
    console.error('Create prescription error:', err);
    res.status(500).json({ error: 'Failed to save prescription.' });
  }
});

// Role-based Authorization Middleware for Admin / Pharmacist routes
async function requireAdminOrPharmacist(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: 'Authentication required. Please log in as Admin or Pharmacist.' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User account not found.' });
    }
    if (!['admin', 'pharmacist'].includes(user.role)) {
      return res.status(403).json({ error: 'Access denied. Admin or Pharmacist role required.' });
    }
    req.adminUser = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

// 3. Admin: Overview Metrics, Critical Alerts (stock < 10 or expiring <= 30d), Recent Orders
app.get('/api/admin/overview', requireAdminOrPharmacist, async (req, res) => {
  try {
    const [orders, medicines, pendingRxCount, totalCustomers] = await Promise.all([
      Order.find().sort({ createdAt: -1 }),
      Medicine.find({ isActive: { $ne: false } }),
      Prescription.countDocuments({ status: 'Pending' }),
      User.countDocuments({ role: 'patient' })
    ]);

    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const criticalAlerts = medicines
      .filter(m => {
        const lowStock = (m.stock != null ? m.stock : 25) < 10;
        let expiringSoon = false;
        if (m.expiryDate) {
          const exp = new Date(m.expiryDate);
          if (!isNaN(exp.getTime()) && exp <= in30Days) {
            expiringSoon = true;
          }
        }
        return lowStock || expiringSoon;
      })
      .map(m => {
        const stockVal = m.stock != null ? m.stock : 25;
        const expDate = m.expiryDate ? new Date(m.expiryDate) : null;
        const isExpiring = expDate && !isNaN(expDate.getTime()) && expDate <= in30Days;
        return {
          _id: m._id,
          id: m.id,
          name: m.name,
          category: m.category,
          batchNo: m.batchNo || 'MC-2026-A1',
          expiryDate: m.expiryDate || '2027-06-30',
          stock: stockVal,
          alertType: stockVal < 10 && isExpiring ? 'Low Stock & Expiring' : stockVal < 10 ? 'Low Stock (<10)' : 'Expiring <=30d'
        };
      });

    res.json({
      metrics: {
        totalRevenue,
        totalOrders: orders.length,
        pendingPrescriptions: pendingRxCount,
        lowStockAlerts: criticalAlerts.length,
        totalCustomers,
        totalMedicines: medicines.length
      },
      criticalAlerts,
      recentOrders: orders.slice(0, 10)
    });
  } catch (err) {
    console.error('Admin overview error:', err);
    res.status(500).json({ error: 'Failed to load admin overview.' });
  }
});

// 4. Admin: Retrieve Prescriptions Filtered by Status
app.get('/api/admin/prescriptions', requireAdminOrPharmacist, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    const prescriptions = await Prescription.find(filter)
      .populate('user_id', 'name email phone')
      .populate('prescribed_items.medicine_id')
      .sort({ uploaded_at: -1, createdAt: -1 });
    res.json({ prescriptions });
  } catch (err) {
    console.error('Admin fetch prescriptions error:', err);
    res.status(500).json({ error: 'Failed to fetch admin prescriptions.' });
  }
});

// 5. Admin / Pharmacist: Review Prescription, Add Notes, Attach Inventory & Optional Convert-to-Cart
app.put('/api/admin/prescriptions/:id/review', requireAdminOrPharmacist, async (req, res) => {
  try {
    const rx = await findPrescriptionByAnyId(req.params.id);
    if (!rx) {
      return res.status(404).json({ error: 'Prescription not found.' });
    }

    const { status, pharmacist_notes, prescribed_items, approveAndConvert } = req.body;
    const allowedStatuses = ['Pending', 'Reviewed', 'Rejected', 'Converted_To_Cart'];
    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value.' });
      }
      rx.status = status;
    }
    if (pharmacist_notes !== undefined) {
      rx.pharmacist_notes = String(pharmacist_notes).trim();
    }

    // Backfill required fields on legacy documents created before schema update
    if (!rx.patient_name) rx.patient_name = rx.get('patient') || 'Patient';
    if (!rx.patient_phone) rx.patient_phone = rx.get('phone') || '0000000000';

    if (Array.isArray(prescribed_items)) {
      const resolvedItems = [];
      for (const item of prescribed_items) {
        let medObjId = item.medicine_id;
        if (medObjId && !mongoose.Types.ObjectId.isValid(medObjId)) {
          const medDoc = await Medicine.findOne({ id: String(medObjId) });
          medObjId = medDoc ? medDoc._id : null;
        }
        if (medObjId) {
          resolvedItems.push({
            medicine_id: medObjId,
            dosage: item.dosage ? String(item.dosage).trim() : '',
            quantity: Math.max(1, Number(item.quantity) || 1)
          });
        }
      }
      rx.prescribed_items = resolvedItems;
    }

    await rx.save();
    await rx.populate('prescribed_items.medicine_id');
    await rx.populate('user_id', 'name email phone');

    if (approveAndConvert && rx.prescribed_items.length > 0) {
      let patient = null;
      if (rx.user_id) patient = await User.findById(rx.user_id._id || rx.user_id);
      if (!patient && rx.userEmail) patient = await User.findOne({ email: rx.userEmail });

      if (patient) {
        const currentCart = Array.isArray(patient.cart) ? [...patient.cart] : [];
        rx.prescribed_items.forEach(it => {
          const med = it.medicine_id;
          if (!med) return;
          const ex = currentCart.find(c => c.id === med.id);
          if (ex) ex.quantity = (ex.quantity || 1) + (it.quantity || 1);
          else {
            currentCart.push({
              id: med.id,
              name: med.name,
              brand: med.brand,
              price: med.price,
              mrp: med.mrp,
              image: med.image,
              requiresPrescription: med.requiresPrescription,
              packSize: it.dosage ? `${med.packSize || ''} (${it.dosage})`.trim() : med.packSize,
              dosage: it.dosage || '',
              quantity: it.quantity || 1
            });
          }
        });
        patient.cart = currentCart;
        await patient.save();
      }
      rx.status = 'Converted_To_Cart';
      await rx.save();
    }

    res.json({ message: 'Prescription review saved.', prescription: rx });
  } catch (err) {
    console.error('Review prescription error:', err);
    res.status(500).json({ error: 'Failed to review prescription.' });
  }
});

// 6. Admin: Medicine Inventory CRUD & Stock Adjustment
app.get('/api/admin/medicines', requireAdminOrPharmacist, async (req, res) => {
  try {
    const { q, category, stockFilter, page = 1, limit = 10 } = req.query;
    const filter = { isActive: { $ne: false } };
    if (category && category !== 'all') filter.category = category;
    if (stockFilter === 'inStock') filter.stock = { $gt: 0 };
    else if (stockFilter === 'lowStock') filter.stock = { $lt: 10, $gt: 0 };
    else if (stockFilter === 'outOfStock') filter.stock = { $lte: 0 };
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { composition: { $regex: q, $options: 'i' } },
        { batchNo: { $regex: q, $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const [medicines, total] = await Promise.all([
      Medicine.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
      Medicine.countDocuments(filter)
    ]);

    res.json({ medicines, total, page: pageNum, totalPages: Math.max(1, Math.ceil(total / limitNum)) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin medicines.' });
  }
});

app.post('/api/admin/medicines', requireAdminOrPharmacist, async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.category || data.price == null || data.mrp == null) {
      return res.status(400).json({ error: 'name, category, price, and mrp are required.' });
    }
    const stockVal = data.stock != null ? Math.max(0, Number(data.stock)) : 25;
    const medicine = await Medicine.create({
      id: data.id || 'prod-' + Date.now(),
      name: data.name.trim(),
      brand: (data.brand || 'MedCare').trim(),
      composition: data.composition || '',
      category: data.category,
      packSize: data.packSize || '',
      price: Number(data.price),
      mrp: Number(data.mrp),
      discount: Number(data.mrp) > 0 ? Math.max(0, Math.round(((Number(data.mrp) - Number(data.price)) / Number(data.mrp)) * 100)) : 0,
      batchNo: data.batchNo || 'MC-2026-A1',
      expiryDate: data.expiryDate || '2027-06-30',
      stock: stockVal,
      inStock: stockVal > 0,
      isActive: true,
      requiresPrescription: !!data.requiresPrescription,
      image: data.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80'
    });
    res.status(201).json({ medicine });
  } catch (err) {
    console.error('Admin create medicine error:', err);
    res.status(500).json({ error: 'Failed to create medicine.' });
  }
});

app.put('/api/admin/medicines/:id', requireAdminOrPharmacist, async (req, res) => {
  try {
    const raw = decodeURIComponent(req.params.id);
    const query = mongoose.Types.ObjectId.isValid(raw) ? { _id: raw } : { id: raw };
    const payload = { ...req.body };
    if (payload.stock != null) {
      payload.stock = Math.max(0, Number(payload.stock));
      payload.inStock = payload.stock > 0;
    }
    if (payload.mrp != null && payload.price != null && Number(payload.mrp) > 0) {
      payload.discount = Math.max(0, Math.round(((Number(payload.mrp) - Number(payload.price)) / Number(payload.mrp)) * 100));
    }
    const medicine = await Medicine.findOneAndUpdate(query, payload, { returnDocument: 'after' });
    if (!medicine) return res.status(404).json({ error: 'Medicine not found.' });
    res.json({ medicine });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update medicine.' });
  }
});

app.patch('/api/admin/medicines/:id/stock', requireAdminOrPharmacist, async (req, res) => {
  try {
    const raw = decodeURIComponent(req.params.id);
    const query = mongoose.Types.ObjectId.isValid(raw) ? { _id: raw } : { id: raw };
    const med = await Medicine.findOne(query);
    if (!med) return res.status(404).json({ error: 'Medicine not found.' });

    const currentStock = med.stock != null ? med.stock : 25;
    let nextStock = currentStock;
    if (req.body.delta != null) nextStock = Math.max(0, currentStock + Number(req.body.delta));
    else if (req.body.stock != null) nextStock = Math.max(0, Number(req.body.stock));

    med.stock = nextStock;
    med.inStock = nextStock > 0;
    await med.save();
    res.json({ medicine: med });
  } catch (err) {
    res.status(500).json({ error: 'Failed to adjust stock.' });
  }
});

app.delete('/api/admin/medicines/:id', requireAdminOrPharmacist, async (req, res) => {
  try {
    const raw = decodeURIComponent(req.params.id);
    const query = mongoose.Types.ObjectId.isValid(raw) ? { _id: raw } : { id: raw };
    const deleted = await Medicine.findOneAndDelete(query);
    if (!deleted) return res.status(404).json({ error: 'Medicine not found.' });
    res.json({ message: 'Medicine deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete medicine.' });
  }
});

// 7. Admin: Orders & Users
app.get('/api/admin/orders', requireAdminOrPharmacist, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

app.patch('/api/admin/orders/:orderId/status', requireAdminOrPharmacist, async (req, res) => {
  try {
    const rawId = decodeURIComponent(req.params.orderId);
    const { status } = req.body;
    const meta = ORDER_STATUS_META[status];
    if (!meta) return res.status(400).json({ error: 'Invalid order status.' });

    const order = await Order.findOneAndUpdate(
      { orderId: rawId },
      { status, statusText: meta.statusText, timelineIndex: meta.timelineIndex },
      { returnDocument: 'after' }
    );
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

app.get('/api/admin/users', requireAdminOrPharmacist, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json({ users: users.map(formatUserResponse) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// 5. Convert Reviewed Prescription to Patient's Active Cart
app.post('/api/prescriptions/:id/convert-to-cart', async (req, res) => {
  try {
    const rx = await findPrescriptionByAnyId(req.params.id);
    if (!rx) {
      return res.status(404).json({ error: 'Prescription not found.' });
    }
    await rx.populate('prescribed_items.medicine_id');

    if (rx.status !== 'Reviewed' && rx.status !== 'Converted_To_Cart') {
      return res.status(400).json({ error: 'Prescription must be verified (Reviewed) before converting to cart.' });
    }
    if (!rx.prescribed_items || rx.prescribed_items.length === 0) {
      return res.status(400).json({ error: 'No medicines are attached to this prescription yet.' });
    }

    let user = await getAuthUser(req);
    if (!user && rx.user_id) user = await User.findById(rx.user_id);
    if (!user && rx.userEmail) user = await User.findOne({ email: rx.userEmail });

    const itemsToAdd = rx.prescribed_items
      .filter(it => it.medicine_id)
      .map(it => {
        const med = it.medicine_id;
        return {
          id: med.id,
          name: med.name,
          brand: med.brand,
          price: med.price,
          mrp: med.mrp,
          image: med.image,
          requiresPrescription: med.requiresPrescription,
          packSize: it.dosage ? `${med.packSize || ''} (${it.dosage})`.trim() : med.packSize,
          dosage: it.dosage || '',
          quantity: it.quantity || 1
        };
      });

    let updatedCart = itemsToAdd;
    if (user) {
      const currentCart = Array.isArray(user.cart) ? [...user.cart] : [];
      itemsToAdd.forEach(item => {
        const existing = currentCart.find(c => c.id === item.id);
        if (existing) {
          existing.quantity = (existing.quantity || 1) + item.quantity;
        } else {
          currentCart.push(item);
        }
      });
      user.cart = currentCart;
      await user.save();
      updatedCart = user.cart;
    }

    rx.status = 'Converted_To_Cart';
    await rx.save();

    res.json({
      message: 'Approved medicines added to cart.',
      cart: updatedCart,
      prescription: rx
    });
  } catch (err) {
    console.error('Convert to cart error:', err);
    res.status(500).json({ error: 'Failed to convert prescription to cart.' });
  }
});

// ==========================================
// ADMIN USERS ROUTE
// ==========================================
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json({ users: users.map(formatUserResponse) });
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// ==========================================
// USER SYNC ROUTES (Cart, Wishlist, Addresses)
// ==========================================
app.get('/api/user/sync', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }
    res.json({
      cart: user.cart || [],
      wishlist: user.wishlist || [],
      addresses: user.addresses || [],
      walletBalance: user.walletBalance,
      medcareCoins: user.medcareCoins
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to sync user data.' });
  }
});

app.put('/api/user/cart', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }
    user.cart = Array.isArray(req.body.cart) ? req.body.cart : [];
    await user.save();
    res.json({ cart: user.cart });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save cart.' });
  }
});

app.put('/api/user/wishlist', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }
    user.wishlist = Array.isArray(req.body.wishlist) ? req.body.wishlist : [];
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save wishlist.' });
  }
});

// ==========================================
// REVIEWS & RATINGS ROUTES
// ==========================================
app.get('/api/reviews/:medicineId', async (req, res) => {
  try {
    const reviews = await Review.find({ medicineId: req.params.medicineId }).sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { medicineId, name, rating, title, comment, userEmail } = req.body;
    if (!medicineId || !name || !comment || !rating) {
      return res.status(400).json({ error: 'medicineId, name, rating, and comment are required.' });
    }

    const review = await Review.create({
      medicineId,
      userEmail: userEmail || '',
      name: String(name).trim(),
      rating: Math.min(5, Math.max(1, Number(rating))),
      title: title ? String(title).trim() : 'Verified Clinical Review',
      comment: String(comment).trim(),
      verified: true
    });

    // Recalculate medicine average rating & reviewsCount
    const allReviews = await Review.find({ medicineId });
    const med = await Medicine.findOne({ id: medicineId });
    let updatedMedicine = null;
    if (med && allReviews.length > 0) {
      const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      med.rating = Math.round(avg * 10) / 10;
      med.reviewsCount = allReviews.length;
      await med.save();
      updatedMedicine = med;
    }

    res.status(201).json({ review, medicine: updatedMedicine });
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ error: 'Failed to save review.' });
  }
});

// ==========================================
// CONTACT & NEWSLETTER ROUTES
// ==========================================
app.post('/api/contact', async (req, res) => {
  try {
    const { fullName, email, phone, subject, orderId, message } = req.body;
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ error: 'fullName, email, subject, and message are required.' });
    }
    const ticketId = 'MED-TKT-' + Math.floor(10000 + Math.random() * 90000);
    const contact = await Contact.create({
      ticketId,
      fullName: String(fullName).trim(),
      email: String(email).toLowerCase().trim(),
      phone: phone ? String(phone).trim() : '',
      subject,
      orderId: orderId || '',
      message: String(message).trim()
    });
    res.status(201).json({ contact });
  } catch (err) {
    console.error('Contact save error:', err);
    res.status(500).json({ error: 'Failed to submit contact inquiry.' });
  }
});

app.post('/api/newsletter', async (req, res) => {
  try {
    const email = (req.body && req.body.email ? String(req.body.email) : '').toLowerCase().trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.json({ message: 'You are already subscribed!', subscriber: existing });
    }
    const subscriber = await Subscriber.create({ email });
    res.status(201).json({ message: 'Subscribed successfully!', subscriber });
  } catch (err) {
    console.error('Newsletter save error:', err);
    res.status(500).json({ error: 'Failed to subscribe.' });
  }
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// ==========================================
// DATABASE CONNECTION & STARTUP
// ==========================================
async function seedIfEmpty() {
  const count = await Medicine.countDocuments();
  if (count === 0 && PHARMACY_DATA && Array.isArray(PHARMACY_DATA.allProducts)) {
    await Medicine.insertMany(PHARMACY_DATA.allProducts);
    console.log(`Seeded ${PHARMACY_DATA.allProducts.length} medicines into MongoDB.`);
  }

  // Ensure default pharmacist/admin account exists for role-based /api/admin/* access
  const adminExists = await User.findOne({ role: { $in: ['admin', 'pharmacist'] } });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await User.create({
      name: 'Dr. Ananya Sen (Chief Pharmacist)',
      email: 'admin@medcare.com',
      password: hashedPassword,
      phone: '9800000001',
      role: 'pharmacist'
    });
    console.log('Seeded default pharmacist account: admin@medcare.com / Admin@123');
  }
}

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing in backend/.env');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas successfully.');

    await seedIfEmpty();

    app.listen(PORT, () => {
      console.log(`MedCare+ server running at http://localhost:${PORT}/`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();
