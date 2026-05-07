const express = require("express");
const router = express.Router();

const { SitemapStream, streamToPromise } = require("sitemap");

const Job = require("../models/job");
const Walkin = require("../models/walkin");
const Exam = require("../models/Exams");

router.get("/sitemap.xml", async (req, res) => {
  try {

    res.header("Content-Type", "application/xml");

    const sitemap = new SitemapStream({
      hostname: "https://dailyjobopenings.online",
    });

    // ─────────────────────────────
    // STATIC PAGES
    // ─────────────────────────────

    const staticPages = [
      {
        url: "/",
        changefreq: "hourly",
        priority: 1.0,
      },
      {
        url: "/about-us",
        changefreq: "monthly",
        priority: 0.7,
      },
      {
        url: "/contact-us",
        changefreq: "monthly",
        priority: 0.7,
      },
      {
        url: "/privacy",
        changefreq: "yearly",
        priority: 0.5,
      },
      {
        url: "/advertise-with-us",
        changefreq: "monthly",
        priority: 0.6,
      },
      {
        url: "/resources",
        changefreq: "weekly",
        priority: 0.8,
      },
      {
        url: "/walk-in-drive",
        changefreq: "daily",
        priority: 0.9,
      },
      {
        url: "/user/view-exams",
        changefreq: "daily",
        priority: 0.8,
      },
    ];

    staticPages.forEach((page) => sitemap.write(page));

    // ─────────────────────────────
    // JOB PAGES
    // ─────────────────────────────

const jobs = await Job.find({}, "slug updatedAt");

const uniqueJobs = Array.from(
  new Map(jobs.map(job => [job.slug, job])).values()
);

    uniqueJobs.forEach((job) => {
      sitemap.write({
        url: `/jobs/${job.slug}`,
        changefreq: "daily",
        priority: 0.9,
        lastmod: job.updatedAt,
      });
    });

    // ─────────────────────────────
    // WALKIN PAGES
    // ─────────────────────────────

    const walkins = await Walkin.find({}, "walkinslug updatedAt");

    const uniqueWalkins = Array.from(
      new Map(walkins.map(walkin => [walkin.walkinslug, walkin])).values()
    );

    uniqueWalkins.forEach((walkin) => {
      sitemap.write({
        url: `/user/walkins/view-walkin/${walkin.walkinslug}`,
        changefreq: "daily",
        priority: 0.8,
        lastmod: walkin.updatedAt,
      });
    });

    // ─────────────────────────────
    // EXAM PAGES
    // ─────────────────────────────

    const exams = await Exam.find({}, "slug updatedAt");

    const uniqueExams = Array.from(
      new Map(exams.map(exam => [exam.slug, exam])).values()
    );

    uniqueExams.forEach((exam) => {
      sitemap.write({
        url: `/user/view-exams/${exam.slug}`,
        changefreq: "weekly",
        priority: 0.7,
        lastmod: exam.updatedAt,
      });
    });

    sitemap.end();

    const xmlData = await streamToPromise(sitemap);

    res.send(xmlData.toString());

  } catch (error) {

    console.error("Sitemap Error:", error);

    res.status(500).send("Error generating sitemap");

  }
});

module.exports = router;