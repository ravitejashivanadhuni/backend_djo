import express from 'express';
const router = express.Router();

import {
  getWalkInJobs,
  getWalkInJobById,
  createWalkInJob,
  updateWalkInJob,
  deleteWalkInJob,
  getAdminWalkInJobs
} from '../controllers/walkInJobController.js';

import authMiddleware from '../middlewares/authmiddleware.js';

// Public User Routes
router.get("/", getWalkInJobs);
router.get("/:id", getWalkInJobById);

// Protected Admin Routes
// Note: assuming authMiddleware is sufficient for admin based on other admin routes.
router.post("/", authMiddleware, createWalkInJob);
router.get("/admin/all", authMiddleware, getAdminWalkInJobs);
router.put("/:id", authMiddleware, updateWalkInJob);
router.delete("/:id", authMiddleware, deleteWalkInJob);

export default router;
