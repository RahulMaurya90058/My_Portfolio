import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Rahul Maurya Resume",
      trim: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      required: true,
      trim: true,
    },

    fileType: {
      type: String,
      default: "application/pdf",
    },

    fileSize: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;