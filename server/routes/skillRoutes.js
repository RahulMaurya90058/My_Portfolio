import express from "express";

import {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ===============================
// Public Routes
// ===============================

// Get all skills
router.get("/", getSkills);

// Get single skill
router.get("/:id", getSkill);


// ===============================
// Protected Admin Routes
// ===============================

// Create skill
router.post("/", protect, createSkill);

// Update skill
router.put("/:id", protect, updateSkill);

// Delete skill
router.delete("/:id", protect, deleteSkill);

export default router;