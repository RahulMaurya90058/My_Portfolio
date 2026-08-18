import express from "express";

import {
  getProfile,
  updateProfile,
} from "../controllers/profileController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getProfile);

// Admin protected
router.put("/", protect, updateProfile);

export default router;