import express from "express";

import {
  getAchievements,
  getAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../controllers/achievementController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all achievements
router.get("/", getAchievements);

// Get single achievement
router.get("/:id", getAchievement);

// ==========================================
// PROTECTED ADMIN ROUTES
// ==========================================

// Create achievement
router.post(
  "/",
  protect,
  createAchievement
);

// Update achievement
router.put(
  "/:id",
  protect,
  updateAchievement
);

// Delete achievement
router.delete(
  "/:id",
  protect,
  deleteAchievement
);

export default router;