const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    patient_name: { type: String, required: true, trim: true },
    patient_phone: { type: String, required: true, trim: true },
    file_url: { type: String, default: '' },
    notes_by_patient: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Rejected', 'Converted_To_Cart'],
      default: 'Pending'
    },
    pharmacist_notes: { type: String, default: '' },
    prescribed_items: [
      {
        medicine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
        dosage: { type: String, default: '' },
        quantity: { type: Number, default: 1, min: 1 }
      }
    ],
    uploaded_at: { type: Date, default: Date.now },

    // Compatibility metadata for legacy views
    rxId: { type: String, unique: true, sparse: true, trim: true },
    userEmail: { type: String, lowercase: true, trim: true, default: '' },
    doctor: { type: String, default: 'Registered Physician' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
