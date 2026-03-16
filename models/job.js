const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
{
  companyLogo: {
    type: String,
    required: true
  },

  companyName: {
    type: String,
    required: true
  },

  jobTitle: {
    type: String,
    required: true
  },

  jobRole: {
    type: String,
    required: true
  },

  jobDescription: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    unique: true
  },

  jobType: {
    type: String,
    // enum: ["Full Time", "Internship", "Contract", "Part Time"]
  },

  experienceLevel: {
    type: String,
    // enum: ["Fresher", "1-3 Years", "3-5 Years", "Senior"]
  },

  jobCategory: {
    type: String,
    // enum: ["Private", "Government"]
  },

  workMode: {
    type: String,
    // enum: ["Remote", "Hybrid", "Onsite"]
  },

  salary: {
    type: String
  },

  location: {
    type: String
  },

  jobLink: {
    type: String,
  },

  expiryDate: {
    type: Date
  },

  tags: [
    {
      type: String
    }
  ]

},
{ timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);