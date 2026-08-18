import Certification from "../models/Certification.js";

// ==========================================
// GET ALL CERTIFICATIONS
// ==========================================

export const getCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find().sort({
      order: 1,
      issueDate: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      certifications,
    });
  } catch (error) {
    console.error(
      "Get certifications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch certifications",
    });
  }
};

// ==========================================
// GET SINGLE CERTIFICATION
// ==========================================

export const getCertification = async (req, res) => {
  try {
    const certification =
      await Certification.findById(req.params.id);

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    return res.status(200).json({
      success: true,
      certification,
    });
  } catch (error) {
    console.error(
      "Get certification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch certification",
    });
  }
};

// ==========================================
// CREATE CERTIFICATION
// ==========================================

export const createCertification = async (
  req,
  res
) => {
  try {
    const {
      title,
      issuer,
      issueDate,
      credentialId,
      credentialUrl,
      description,
      skills,
      order,
    } = req.body;

    // Required fields
    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Certification title is required",
      });
    }

    if (!issuer?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Issuing organization is required",
      });
    }

    // Skills handling
    let formattedSkills = [];

    if (Array.isArray(skills)) {
      formattedSkills = skills
        .map((skill) =>
          String(skill).trim()
        )
        .filter(Boolean);
    }

    const certification =
      await Certification.create({
        title: title.trim(),
        issuer: issuer.trim(),
        issueDate:
          issueDate?.trim() || "",
        credentialId:
          credentialId?.trim() || "",
        credentialUrl:
          credentialUrl?.trim() || "",
        description:
          description?.trim() || "",
        skills: formattedSkills,
        order: Number(order) || 0,
      });

    return res.status(201).json({
      success: true,
      message:
        "Certification created successfully",
      certification,
    });
  } catch (error) {
    console.error(
      "Create certification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create certification",
    });
  }
};

// ==========================================
// UPDATE CERTIFICATION
// ==========================================

export const updateCertification = async (
  req,
  res
) => {
  try {
    const certification =
      await Certification.findById(req.params.id);

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    const {
      title,
      issuer,
      issueDate,
      credentialId,
      credentialUrl,
      description,
      skills,
      order,
    } = req.body;

    // Update basic fields
    certification.title =
      title?.trim() ||
      certification.title;

    certification.issuer =
      issuer?.trim() ||
      certification.issuer;

    certification.issueDate =
      issueDate?.trim() ??
      certification.issueDate;

    certification.credentialId =
      credentialId?.trim() ??
      certification.credentialId;

    certification.credentialUrl =
      credentialUrl?.trim() ??
      certification.credentialUrl;

    certification.description =
      description?.trim() ??
      certification.description;

    // Update skills
    if (Array.isArray(skills)) {
      certification.skills = skills
        .map((skill) =>
          String(skill).trim()
        )
        .filter(Boolean);
    }

    // Update order
    if (order !== undefined) {
      certification.order =
        Number(order) || 0;
    }

    await certification.save();

    return res.status(200).json({
      success: true,
      message:
        "Certification updated successfully",
      certification,
    });
  } catch (error) {
    console.error(
      "Update certification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update certification",
    });
  }
};

// ==========================================
// DELETE CERTIFICATION
// ==========================================

export const deleteCertification = async (
  req,
  res
) => {
  try {
    const certification =
      await Certification.findById(req.params.id);

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    await Certification.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Certification deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete certification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete certification",
    });
  }
};