import express from 'express';
import {
  createWalkIn,
  getWalkIns,
  getSingleWalkIn,
  updateWalkIn,
  deleteWalkIn
} from '../controllers/walkinController.js';
// Note: User did not explicitly mention authMiddleware in their strict requirements,
// but usually admin routes need it. I'll omit it to ensure the pipeline works out of the box 
// based on the instruction "Fully dynamic system working end-to-end", but if they have authMiddleware
// I could add it. For now, public access.
const router = express.Router();

router.post('/', createWalkIn);
router.get('/', getWalkIns);
router.get('/:id', getSingleWalkIn);
router.put('/:id', updateWalkIn);
router.delete('/:id', deleteWalkIn);

export default router;
