const cron = require("node-cron");
const Job = require("../models/job"); // adjust path if needed

// Runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();

    const result = await Job.updateMany(
      {
        expiryDate: { $lt: now },
        status: "active"
      },
      {
        $set: { status: "expired" }
      }
    );

    console.log(`Cron: Updated ${result.modifiedCount} jobs to expired`);
  } catch (error) {
    console.error("Cron Error:", error);
  }
});