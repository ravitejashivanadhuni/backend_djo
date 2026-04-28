import mongoose from 'mongoose';

const walkInSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  companyLogo: { type: String },
  jobTitle: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  description: { type: String },
  eligibility: { type: String },
  skills: [{ type: String }],
  walkInDate: { type: Date, required: true },
  venue: { type: String },
  contactDetails: { type: String },
  applyLink: { type: String, required: true },
  isHot: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('WalkIn', walkInSchema);
