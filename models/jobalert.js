const mongoose = require("mongoose");

const jobAlertSchema = new mongoose.Schema({
  email: { type: String, required: true },

  jobCategory: [String],
  jobRole: [String],
  location: [String],
  workMode: [String],
  eligibleBatches: [String],

}, { timestamps: true });

jobAlertSchema.index({ email: 1 });

module.exports = mongoose.model("JobAlert", jobAlertSchema);