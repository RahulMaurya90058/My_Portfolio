import express from "express";

import {
  getCertifications,
  getCertification,
  createCertification,
  updateCertification,
  deleteCertification,
} from "../controllers/certificationController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all certifications
router.get("/", getCertifications);

// Get single certification
router.get("/:id", getCertification);

// ==========================================
// PROTECTED ADMIN ROUTES
// ==========================================

// Create certification
router.post(
  "/",
  protect,
  createCertification
);

// Update certification
router.put(
  "/:id",
  protect,
  updateCertification
);

// Delete certification
router.delete(
  "/:id",
  protect,
  deleteCertification
);

export default router;