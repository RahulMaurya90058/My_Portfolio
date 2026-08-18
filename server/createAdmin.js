import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "./models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const email = "admin@portfolio.com";
    const password = "Admin@12345";

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await Admin.create({
      name: "Rahul Maurya",
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created successfully");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin:");
    console.error(error.message);

    process.exit(1);
  }
};

createAdmin();