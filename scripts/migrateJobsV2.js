require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const Job = require("../models/Job");

mongoose.connect(process.env.MONGO_URI);

const CITY_STATE_MAP = {
  Hyderabad: { state: "Telangana", country: "India" },
  Bengaluru: { state: "Karnataka", country: "India" },
  Bangalore: { state: "Karnataka", country: "India" },
  Pune: { state: "Maharashtra", country: "India" },
  Chennai: { state: "Tamil Nadu", country: "India" },
  Mumbai: { state: "Maharashtra", country: "India" },
  Noida: { state: "Uttar Pradesh", country: "India" },
  Gurugram: { state: "Haryana", country: "India" },
  Gurgaon: { state: "Haryana", country: "India" },
  Delhi: { state: "Delhi", country: "India" },
};

function normalizeSalary(salary = "") {
  const result = {
    salaryMin: null,
    salaryMax: null,
    salaryUnit: null,
    salaryDisclosed: true,
  };

  const text = salary.toLowerCase();

  if (
    text.includes("not disclosed") ||
    text.includes("not specified")
  ) {
    result.salaryDisclosed = false;
    return result;
  }

  // ₹5 LPA – ₹9 LPA
  let lpaMatch = salary.match(
    /(\d+(\.\d+)?)\s*lpa.*?(\d+(\.\d+)?)\s*lpa/i
  );

  if (lpaMatch) {
    result.salaryMin = Number(lpaMatch[1]);
    result.salaryMax = Number(lpaMatch[3]);
    result.salaryUnit = "LPA";
    return result;
  }

  // Single LPA
  let singleLpa = salary.match(/(\d+(\.\d+)?)\s*lpa/i);

  if (singleLpa) {
    result.salaryMin = Number(singleLpa[1]);
    result.salaryMax = Number(singleLpa[1]);
    result.salaryUnit = "LPA";
    return result;
  }

  // Monthly
  let monthlyMatch = salary.match(
    /([\d,]+).*?([\d,]+).*?(month|monthly|stipend)/i
  );

  if (monthlyMatch) {
    result.salaryMin = Number(
      monthlyMatch[1].replace(/,/g, "")
    );

    result.salaryMax = Number(
      monthlyMatch[2].replace(/,/g, "")
    );

    result.salaryUnit = "MONTHLY";
  }

  return result;
}

function normalizeExperience(experience = "") {
  const result = {
    experienceMin: null,
    experienceMax: null,
  };

  const text = experience.toLowerCase();

  if (
    text.includes("fresher") ||
    text.includes("entry level")
  ) {
    result.experienceMin = 0;
    result.experienceMax = 0;
    return result;
  }

  const rangeMatch = text.match(/(\d+)\s*[-–]\s*(\d+)/);

  if (rangeMatch) {
    result.experienceMin = Number(rangeMatch[1]);
    result.experienceMax = Number(rangeMatch[2]);
    return result;
  }

  const plusMatch = text.match(/(\d+)\+/);

  if (plusMatch) {
    result.experienceMin = Number(plusMatch[1]);
    result.experienceMax = Number(plusMatch[1]);
  }

  return result;
}

function normalizeLocation(location = "") {
  const result = {
    city: null,
    state: null,
    country: "India",
  };

  if (
    location.toLowerCase().includes("remote")
  ) {
    result.city = "Remote";
    return result;
  }

  const city = location.split(",")[0].trim();

  result.city = city;

  if (CITY_STATE_MAP[city]) {
    result.state = CITY_STATE_MAP[city].state;
    result.country = CITY_STATE_MAP[city].country;
  }

  return result;
}

function normalizeWorkMode(workMode = "") {
  const value = workMode.toLowerCase();

  let normalizedWorkMode = null;
  let employmentType = null;

  if (value.includes("remote")) {
    normalizedWorkMode = "REMOTE";
  } else if (value.includes("hybrid")) {
    normalizedWorkMode = "HYBRID";
  } else {
    normalizedWorkMode = "ONSITE";
  }

  if (value.includes("intern")) {
    employmentType = "INTERNSHIP";
  } else if (value.includes("apprentice")) {
    employmentType = "APPRENTICESHIP";
  } else if (value.includes("part time")) {
    employmentType = "PART_TIME";
  } else if (value.includes("contract")) {
    employmentType = "CONTRACT";
  } else {
    employmentType = "FULL_TIME";
  }

  return {
    workMode: normalizedWorkMode,
    employmentType,
  };
}

function normalizeEligibleBranches(department = "") {
  if (!department) return [];

  return department
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function normalizeEligibleDegrees(education = "") {
  if (!education) return [];

  return [education];
}

function normalizeEligibleBatches(batchText = "") {
  const years = String(batchText).match(/\b20\d{2}\b/g);

  if (!years) return [];

  return [...new Set(years.map(Number))];
}

function normalizeJobCategory(job) {
  const oldType = (job.jobType || "").toLowerCase();

  if (
    oldType === "non_it" ||
    oldType === "non it"
  ) {
    return "NON_IT";
  }

  return "IT";
}

async function migrate() {
  try {
    const jobs = await Job.find().lean();

    console.log(`Found ${jobs.length} jobs`);

    let success = 0;
    let failed = 0;

    for (const job of jobs) {
      try {
        const salaryData = normalizeSalary(
          job.salary
        );

        const experienceData =
          normalizeExperience(
            job.experienceLevel
          );

        const locationData =
          normalizeLocation(job.location);

        const workModeData =
          normalizeWorkMode(job.workMode);

        const updateData = {
          ...salaryData,
          ...experienceData,
          ...locationData,
          ...workModeData,

          eligibleBranches:
            normalizeEligibleBranches(
              job.department
            ),

          eligibleDegrees:
            normalizeEligibleDegrees(
              job.education
            ),

          eligibleBatches:
            normalizeEligibleBatches(
              job.eligibleBatches
            ),

          jobCategory:
            normalizeJobCategory(job),

          badge: job.badge
            ? job.badge.toUpperCase()
            : null,

          status: job.status
            ? job.status.toUpperCase()
            : "ACTIVE",
        };

        await Job.updateOne(
          { _id: job._id },
          {
            $set: updateData,
          },
          {
            runValidators: false,
          }
        );

        success++;

        console.log(
          `✓ ${job.companyName} - ${job.jobTitle}`
        );
      } catch (err) {
        failed++;

        console.error(
          `✗ Failed: ${job._id}`,
          err.message
        );
      }
    }

    console.log("\n==========");
    console.log("Migration Complete");
    console.log("==========");

    console.log(`Success: ${success}`);
    console.log(`Failed : ${failed}`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();