import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Frontend",
        "Backend",
        "Database",
        "Tools",
        "Other",
      ],
      default: "Other",
    },

    level: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },

    icon: {
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

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;