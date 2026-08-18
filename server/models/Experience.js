import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    employmentType: {
      type: String,
      default: "Full-time",
      trim: true,
    },

    startDate: {
      type: String,
      required: true,
      trim: true,
    },

    endDate: {
      type: String,
      default: "",
      trim: true,
    },

    current: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    technologies: {
      type: [String],
      default: [],
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Experience = mongoose.model(
  "Experience",
  experienceSchema
);

export default Experience;