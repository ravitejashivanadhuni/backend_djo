const Job = require("../models/job");


// Create Job
const createJob = async (req, res) => {
  try {

    const job = new Job(req.body);

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

module.exports = {
  createJob
};