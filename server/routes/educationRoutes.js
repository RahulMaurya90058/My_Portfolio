import express from "express";

import {
  getEducations,
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../controllers/educationController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all education
router.get("/", getEducations);

// Get single education
router.get("/:id", getEducation);

// ==========================================
// PROTECTED ADMIN ROUTES
// ==========================================

// Create education
router.post(
  "/",
  protect,
  createEducation
);

// Update education
router.put(
  "/:id",
  protect,
  updateEducation
);

// Delete education
router.delete(
  "/:id",
  protect,
  deleteEducation
);

export default router;