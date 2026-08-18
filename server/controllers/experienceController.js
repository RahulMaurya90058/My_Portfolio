import Experience from "../models/Experience.js";

// ==========================================
// Get All Experiences
// ==========================================

export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({
      order: 1,
      startDate: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      experiences,
    });
  } catch (error) {
    console.error("Get experiences error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch experiences",
    });
  }
};

// ==========================================
// Get Single Experience
// ==========================================

export const getExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(
      req.params.id
    );

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    return res.status(200).json({
      success: true,
      experience,
    });
  } catch (error) {
    console.error("Get experience error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch experience",
    });
  }
};

// ==========================================
// Create Experience
// ==========================================

export const createExperience = async (req, res) => {
  try {
    const {
      jobTitle,
      company,
      location,
      employmentType,
      startDate,
      endDate,
      current,
      description,
      technologies,
      order,
    } = req.body;

    if (!jobTitle?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job title is required",
      });
    }

    if (!company?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    if (!startDate?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Start date is required",
      });
    }

    const experience = await Experience.create({
      jobTitle: jobTitle.trim(),
      company: company.trim(),
      location: location?.trim() || "",
      employmentType:
        employmentType?.trim() || "Full-time",
      startDate: startDate.trim(),
      endDate: current
        ? ""
        : endDate?.trim() || "",
      current: Boolean(current),
      description: description?.trim() || "",
      technologies: Array.isArray(technologies)
        ? technologies
        : [],
      order: order ?? 0,
    });

    return res.status(201).json({
      success: true,
      message: "Experience created successfully",
      experience,
    });
  } catch (error) {
    console.error("Create experience error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create experience",
    });
  }
};

// ==========================================
// Update Experience
// ==========================================

export const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(
      req.params.id
    );

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    const {
      jobTitle,
      company,
      location,
      employmentType,
      startDate,
      endDate,
      current,
      description,
      technologies,
      order,
    } = req.body;

    experience.jobTitle =
      jobTitle?.trim() || experience.jobTitle;

    experience.company =
      company?.trim() || experience.company;

    experience.location =
      location?.trim() ?? experience.location;

    experience.employmentType =
      employmentType?.trim() ||
      experience.employmentType;

    experience.startDate =
      startDate?.trim() || experience.startDate;

    experience.current =
      current ?? experience.current;

    experience.endDate = experience.current
      ? ""
      : endDate?.trim() ?? experience.endDate;

    experience.description =
      description?.trim() ??
      experience.description;

    if (Array.isArray(technologies)) {
      experience.technologies = technologies;
    }

    experience.order =
      order ?? experience.order;

    await experience.save();

    return res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      experience,
    });
  } catch (error) {
    console.error("Update experience error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update experience",
    });
  }
};

// ==========================================
// Delete Experience
// ==========================================

export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(
      req.params.id
    );

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    await Experience.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("Delete experience error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete experience",
    });
  }
};