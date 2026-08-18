import express from "express";

import {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// Public Routes
// ==========================================

// Get all experiences
router.get("/", getExperiences);

// Get single experience
router.get("/:id", getExperience);

// ==========================================
// Protected Admin Routes
// ==========================================

// Create experience
router.post("/", protect, createExperience);

// Update experience
router.put("/:id", protect, updateExperience);

// Delete experience
router.delete("/:id", protect, deleteExperience);

export default router;