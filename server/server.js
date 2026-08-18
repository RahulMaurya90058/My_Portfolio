import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import certificationRoutes from "./routes/certificationRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";


dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// ================================
// Middleware
// ================================

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ================================
// Health Check
// ================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio API is running successfully",
  });
});

// ================================
// Auth Routes
// IMPORTANT: Must be BEFORE 404
// ================================

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/education",educationRoutes);
app.use("/api/certifications",certificationRoutes);
app.use("/api/achievements",achievementRoutes);
app.use("/api/resume",resumeRoutes);
app.use("/api/contact",contactRoutes);


// ================================
// 404 Handler
// IMPORTANT: Keep this LAST
// ================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ================================
// Database + Server
// ================================

await connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});