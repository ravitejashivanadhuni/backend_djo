import mongoose from 'mongoose';

const walkInJobSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  workMode: { type: String, enum: ['On-site', 'Remote', 'Hybrid'], default: 'On-site' },
  experienceLevel: { type: String },
  skills: [{ type: String }],
  description: { type: String },
  eligibility: { type: String },
  batch: { type: String },
  postedDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  isVerified: { type: Boolean, default: false },
  isHot: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  status: { type: String, enum: ['active', 'expired', 'draft', 'closed'], default: 'active' }
}, { timestamps: true });

walkInJobSchema.pre('save', function (next) {
  if (this.expiryDate && this.expiryDate < new Date()) {
    this.status = 'expired';
  }
  next();
});

walkInJobSchema.index({ jobTitle: 'text', companyName: 'text' });
walkInJobSchema.index({ location: 1 });
walkInJobSchema.index({ createdAt: -1 });

export default mongoose.model('WalkInJob', walkInJobSchema);
