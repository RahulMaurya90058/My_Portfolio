import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    organization: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      default: "Achievement",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    credentialUrl: {
      type: String,
      default: "",
      trim: true,
    },

    credentialId: {
      type: String,
      default: "",
      trim: true,
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

const Achievement = mongoose.model(
  "Achievement",
  achievementSchema
);

export default Achievement;