import Skill from "../models/Skill.js";

// ===============================
// Get All Skills
// ===============================

export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      skills,
    });
  } catch (error) {
    console.error("Get skills error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch skills",
    });
  }
};

// ===============================
// Get Single Skill
// ===============================

export const getSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    return res.status(200).json({
      success: true,
      skill,
    });
  } catch (error) {
    console.error("Get skill error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch skill",
    });
  }
};

// ===============================
// Create Skill
// ===============================

export const createSkill = async (req, res) => {
  try {
    const {
      name,
      category,
      level,
      icon,
      order,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Skill name is required",
      });
    }

    const skill = await Skill.create({
      name,
      category: category || "Other",
      level: level ?? 50,
      icon: icon || "",
      order: order ?? 0,
    });

    return res.status(201).json({
      success: true,
      message: "Skill created successfully",
      skill,
    });
  } catch (error) {
    console.error("Create skill error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create skill",
    });
  }
};

// ===============================
// Update Skill
// ===============================

export const updateSkill = async (req, res) => {
  try {
    const {
      name,
      category,
      level,
      icon,
      order,
    } = req.body;

    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    skill.name = name ?? skill.name;
    skill.category = category ?? skill.category;
    skill.level = level ?? skill.level;
    skill.icon = icon ?? skill.icon;
    skill.order = order ?? skill.order;

    await skill.save();

    return res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    console.error("Update skill error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update skill",
    });
  }
};

// ===============================
// Delete Skill
// ===============================

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    await Skill.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Delete skill error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete skill",
    });
  }
};