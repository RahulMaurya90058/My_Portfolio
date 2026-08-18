import express from "express";

import {
  createContact,
  getContacts,
  getContact,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// PUBLIC
// ==========================================

// Send contact message
router.post(
  "/",
  createContact
);

// ==========================================
// ADMIN
// ==========================================

// Get all messages
router.get(
  "/",
  protect,
  getContacts
);

// Get single message
router.get(
  "/:id",
  protect,
  getContact
);

// Mark read / unread
router.put(
  "/:id/status",
  protect,
  updateContactStatus
);

// Delete message
router.delete(
  "/:id",
  protect,
  deleteContact
);

export default router;