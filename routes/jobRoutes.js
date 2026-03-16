const express = require("express");
const router = express.Router();

const {
  createJob,
  getJobs,
  getJobBySlug
} = require("../controllers/jobController");


// POST job
router.post("/jobs", createJob);


// GET jobs (with filters)
router.get("/jobs", getJobs);


// GET job details
router.get("/job/:slug", getJobBySlug);


module.exports = router;