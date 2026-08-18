import Education from "../models/Education.js";

// ==========================================
// GET ALL EDUCATION
// ==========================================

export const getEducations = async (req, res) => {
  try {
    const educations = await Education.find().sort({
      order: 1,
      startYear: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      educations,
    });
  } catch (error) {
    console.error("Get educations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch education",
    });
  }
};

// ==========================================
// GET SINGLE EDUCATION
// ==========================================

export const getEducation = async (req, res) => {
  try {
    const education = await Education.findById(
      req.params.id
    );

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    return res.status(200).json({
      success: true,
      education,
    });
  } catch (error) {
    console.error("Get education error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch education",
    });
  }
};

// ==========================================
// CREATE EDUCATION
// ==========================================

export const createEducation = async (req, res) => {
  try {
    const {
      degree,
      institution,
      location,
      field,
      startYear,
      endYear,
      current,
      description,
      grade,
      order,
    } = req.body;

    if (!degree?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Degree is required",
      });
    }

    if (!institution?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Institution is required",
      });
    }

    if (!startYear?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Start year is required",
      });
    }

    const education = await Education.create({
      degree: degree.trim(),
      institution: institution.trim(),
      location: location?.trim() || "",
      field: field?.trim() || "",
      startYear: startYear.trim(),
      endYear: current
        ? ""
        : endYear?.trim() || "",
      current: Boolean(current),
      description: description?.trim() || "",
      grade: grade?.trim() || "",
      order: Number(order) || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Education created successfully",
      education,
    });
  } catch (error) {
    console.error(
      "Create education error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create education",
    });
  }
};

// ==========================================
// UPDATE EDUCATION
// ==========================================

export const updateEducation = async (req, res) => {
  try {
    const education = await Education.findById(
      req.params.id
    );

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    const {
      degree,
      institution,
      location,
      field,
      startYear,
      endYear,
      current,
      description,
      grade,
      order,
    } = req.body;

    education.degree =
      degree?.trim() ||
      education.degree;

    education.institution =
      institution?.trim() ||
      education.institution;

    education.location =
      location?.trim() ??
      education.location;

    education.field =
      field?.trim() ??
      education.field;

    education.startYear =
      startYear?.trim() ||
      education.startYear;

    education.current =
      current ?? education.current;

    education.endYear = education.current
      ? ""
      : endYear?.trim() ??
        education.endYear;

    education.description =
      description?.trim() ??
      education.description;

    education.grade =
      grade?.trim() ??
      education.grade;

    education.order =
      order ?? education.order;

    await education.save();

    return res.status(200).json({
      success: true,
      message: "Education updated successfully",
      education,
    });
  } catch (error) {
    console.error(
      "Update education error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update education",
    });
  }
};

// ==========================================
// DELETE EDUCATION
// ==========================================

export const deleteEducation = async (req, res) => {
  try {
    const education = await Education.findById(
      req.params.id
    );

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    await Education.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete education error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete education",
    });
  }
};