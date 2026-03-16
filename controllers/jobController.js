const Job = require("../models/job");
const slugify = require("slugify");


// CREATE JOB
const createJob = async (req, res) => {
  try {

    const { companyName, jobTitle, location } = req.body;

    const slug = slugify(`${companyName}-${jobTitle}-${location}`, {
      lower: true,
      strict: true
    });

    const job = new Job({
      ...req.body,
      slug
    });

    const savedJob = await job.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: savedJob
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error creating job",
      error: error.message
    });

  }
};



// GET ALL JOBS + FILTER
const getJobs = async (req, res) => {
  try {

    const query = {};

    if (req.query.experienceLevel) {
      query.experienceLevel = req.query.experienceLevel;
    }

    if (req.query.jobType) {
      query.jobType = req.query.jobType;
    }

    if (req.query.jobCategory) {
      query.jobCategory = req.query.jobCategory;
    }

    if (req.query.workMode) {
      query.workMode = req.query.workMode;
    }

    if (req.query.location) {
      query.location = req.query.location;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      results: jobs.length,
      data: jobs
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error fetching jobs",
      error: error.message
    });

  }
};



// GET JOB BY SLUG
const getJobBySlug = async (req, res) => {
  try {

    const job = await Job.findOne({ slug: req.params.slug });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error fetching job",
      error: error.message
    });

  }
};


module.exports = {
  createJob,
  getJobs,
  getJobBySlug
};