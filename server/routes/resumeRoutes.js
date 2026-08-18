import express from "express";

import {
  getResume,
  getAllResumes,
  createResume,
  updateResume,
  deleteResume,
} from "../controllers/resumeController.js";

import protect from "../middleware/authMiddleware.js";

import uploadResume from "../middleware/resumeUpload.js";

const router = express.Router();

// ==========================================
// PUBLIC
// ==========================================

// Get active resume
router.get("/", getResume);

// ==========================================
// ADMIN
// ==========================================

// Get all resumes
router.get(
  "/admin/all",
  protect,
  getAllResumes
);

// Upload resume
router.post(
  "/",
  protect,
  uploadResume.single("resume"),
  createResume
);

// Update resume
router.put(
  "/:id",
  protect,
  uploadResume.single("resume"),
  updateResume
);

// Delete resume
router.delete(
  "/:id",
  protect,
  deleteResume
);

export default router;