import Achievement from "../models/Achievement.js";

// ==========================================
// GET ALL ACHIEVEMENTS
// ==========================================

export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      achievements,
    });
  } catch (error) {
    console.error(
      "Get achievements error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch achievements",
    });
  }
};

// ==========================================
// GET SINGLE ACHIEVEMENT
// ==========================================

export const getAchievement = async (req, res) => {
  try {
    const achievement =
      await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    return res.status(200).json({
      success: true,
      achievement,
    });
  } catch (error) {
    console.error(
      "Get achievement error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch achievement",
    });
  }
};

// ==========================================
// CREATE ACHIEVEMENT
// ==========================================

export const createAchievement = async (
  req,
  res
) => {
  try {
    const {
      title,
      organization,
      date,
      category,
      description,
      image,
      credentialUrl,
      credentialId,
      order,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Achievement title is required",
      });
    }

    if (!organization?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Organization is required",
      });
    }

    const achievement =
      await Achievement.create({
        title: title.trim(),
        organization: organization.trim(),
        date: date?.trim() || "",
        category:
          category?.trim() || "Achievement",
        description:
          description?.trim() || "",
        image: image?.trim() || "",
        credentialUrl:
          credentialUrl?.trim() || "",
        credentialId:
          credentialId?.trim() || "",
        order: Number(order) || 0,
      });

    return res.status(201).json({
      success: true,
      message:
        "Achievement created successfully",
      achievement,
    });
  } catch (error) {
    console.error(
      "Create achievement error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create achievement",
    });
  }
};

// ==========================================
// UPDATE ACHIEVEMENT
// ==========================================

export const updateAchievement = async (
  req,
  res
) => {
  try {
    const achievement =
      await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    const {
      title,
      organization,
      date,
      category,
      description,
      image,
      credentialUrl,
      credentialId,
      order,
    } = req.body;

    achievement.title =
      title?.trim() ||
      achievement.title;

    achievement.organization =
      organization?.trim() ||
      achievement.organization;

    achievement.date =
      date?.trim() ??
      achievement.date;

    achievement.category =
      category?.trim() ??
      achievement.category;

    achievement.description =
      description?.trim() ??
      achievement.description;

    achievement.image =
      image?.trim() ??
      achievement.image;

    achievement.credentialUrl =
      credentialUrl?.trim() ??
      achievement.credentialUrl;

    achievement.credentialId =
      credentialId?.trim() ??
      achievement.credentialId;

    if (order !== undefined) {
      achievement.order =
        Number(order) || 0;
    }

    await achievement.save();

    return res.status(200).json({
      success: true,
      message:
        "Achievement updated successfully",
      achievement,
    });
  } catch (error) {
    console.error(
      "Update achievement error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update achievement",
    });
  }
};

// ==========================================
// DELETE ACHIEVEMENT
// ==========================================

export const deleteAchievement = async (
  req,
  res
) => {
  try {
    const achievement =
      await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    await Achievement.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Achievement deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete achievement error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete achievement",
    });
  }
};