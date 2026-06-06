const mongoose = require("mongoose");
const slug = require("slugify");

const jobSchema = new mongoose.Schema(
  {
    //company reference
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true
    },
    // 🔹 Company Info
    companyLogo: String,
    companyName: String,
    companyWebsite: String,
    companyCareersLink: String,
    aboutCompany: String,

    // 🔹 Perks (with control)
    perks: [String],
    useCompanyPerks: {
      type: Boolean,
      default: true
    },

    // 🔹 Job Basic Info
    jobTitle: { type: String, required: true },
    jobRole: String,
    jobDescription: { type: String, required: true },
    slug: { type: String, unique: true, index: true },

    // 🔹 Job Details
    salary: String,
    salaryMin: Number,
    salaryMax: Number,
    salaryUnit: String, //Lpa, Monthly, Hourly
    salaryDisclosed: {
  type: Boolean,
  default: false
},

    location: { type: String, required: true },
    city: String,
    state: String,
    country: String,

    workMode: {
      type: String,
      enum: [
        "ONSITE",
        "REMOTE",
        "HYBRID"
      ],
    },
    employmentType: {
      type: String,
      enum: [
        "FULL_TIME",
        "PART_TIME",
        "CONTRACT",
        "INTERNSHIP",
        "APPRENTICESHIP",
        "TEMPORARY",
        "FREELANCE"
      ]
    },
    jobCategory: {
      type: String,
      enum: [
        "IT",
        "NON_IT",
        "BANKING",
      ],
      required: true
    },
    experienceLevel: String,
    experienceMin: Number,
    experienceMax: Number,

    hiringType: {
      type: String,
      enum: [
        "DIRECT",
        "OFF_CAMPUS",
        "ON_CAMPUS"
      ],
    },
    // 🔹 Dates
    postedDate: Date,
    expiryDate: Date,

    // 🔥 Auto delete support
    expiresAt: {
      type: Date,
      index: true
    },

    // 🔹 Eligibility
    eligibleDegrees: [String],
    eligibleBatches: [Number],
    eligibleBranches: [String],

    // 🔹 Hiring Info
    openings: Number,

    // 🔹 Skills & Tags
    
    skills: [String],
    tags: [String],

    // 🔹 Links
    jobLink: String,

    jobSummary: String,
    selectionProcess: [String],
    applicationSteps: [String],
    highlights: [String],
    careerGrowth: String,
    importantInstructions: [String],

    // 🔹 Extra

    responsibilities: [String],
    qualifications: [String],
    verified: { type: Boolean, default: false },

    badge: {
      type: String,
      enum: ["FEATURED", "HOT", "NEW", "REMOTE", "URGENT"],
      default: null,
    },

    badgeLabel: {
      type: String,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    },

    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "DRAFT", "CLOSED"],
      default: "ACTIVE"
    },

    //analytic fields (not exposed in API)
    viewsCount: {
      type: Number,
      default: 0
    },
    applyClicks: {
      type: Number,
      default: 0
    },


  },
  { timestamps: true }
);


// 🔧 Middleware (Auto expiry + delete logic)
jobSchema.pre("save", function () {
  const now = new Date();

  // Generate slug
  if (!this.slug) {
    this.slug = slugify(
      `${this.jobTitle}-${this.companyName}-${Date.now()}`,
      { lower: true, strict: true }
    );
  }

  // If expiry date exists
  if (this.expiryDate) {
    const deleteAfter = new Date(this.expiryDate);
    deleteAfter.setDate(deleteAfter.getDate() + 1);

    this.expiresAt = deleteAfter;
  }

  // If expiry date does NOT exist
  else {
    const deleteAfter = new Date(now);
    deleteAfter.setDate(deleteAfter.getDate() + 20);

    this.expiresAt = deleteAfter;
  }
});


// 🔥 TTL Index (Auto delete after expiresAt)
jobSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

//single feild indexes for faster queries
jobSchema.index({ jobTitle: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ jobCategory: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ slug: 1 });
jobSchema.index({ eligibleDegrees: 1 });
jobSchema.index({ eligibleBranches: 1 });
jobSchema.index({ eligibleBatches: 1 });
jobSchema.index({ jobRole: 1 });
jobSchema.index({ employmentType: 1 });
jobSchema.index({ workMode: 1 });
jobSchema.index({ hiringType: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ badge: 1 });
jobSchema.index({ city: 1 });
jobSchema.index({ state: 1 });
jobSchema.index({ country: 1 });
jobSchema.index({ skills: 1 });

//compund indexes(high impact)
jobSchema.index({ jobTitle: 1, location: 1 });
jobSchema.index({ jobCategory: 1, location: 1 });

//Text search
jobSchema.index({
  jobTitle: "text",
  jobRole: "text",
  companyName: "text",
  skills: "text",
  jobDescription: "text",
});

jobSchema.index({
  jobCategory: 1,
  city: 1
});
jobSchema.index({
  employmentType: 1,
  workMode: 1
});
jobSchema.index({
  experienceMin: 1,
  experienceMax: 1
});
jobSchema.index({
  salaryMin: 1,
  salaryMax: 1
});
jobSchema.index({ viewsCount: -1 });
jobSchema.index({ applyClicks: -1 });
module.exports = mongoose.model("Job", jobSchema);