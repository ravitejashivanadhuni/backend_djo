require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const jobRoutes = require("./routes/jobRoutes");
const jobAlertRoutes = require("./routes/jobalertroutes");

require("./cron/jobstatusupdater"); //this is related to cron job status updater which will automatically update the status of jobs to "expired" when their expiry date has passed. It runs a scheduled task every day at midnight to check for expired jobs and update their status accordingly.


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

app.use("/api", jobRoutes);
app.use("/api/job-alerts", jobAlertRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("Daily Job Openings API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});