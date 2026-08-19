import express from "express";

import {
  getResume,
  downloadResume,
  getAllResumes,
  createResume,
  updateResume,
  deleteResume,
} from "../controllers/resumeController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get active resume
router.get("/", getResume);

// Download active resume
router.get("/download", downloadResume);

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all resumes
router.get("/all", protect, getAllResumes);

// Upload resume
router.post("/", protect, createResume);

// Update resume
router.put("/:id", protect, updateResume);

// Delete resume
router.delete("/:id", protect, deleteResume);

export default router;