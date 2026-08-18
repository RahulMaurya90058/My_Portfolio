import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import Resume from "../models/Resume.js";

// ==========================================
// CLOUDINARY CONFIG
// ==========================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================================
// CLOUDINARY PDF UPLOAD
// ==========================================

const uploadPdfToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: "portfolio/resumes",
          resource_type: "raw",
          type: "upload",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

// ==========================================
// DELETE PDF FROM CLOUDINARY
// ==========================================

const deletePdfFromCloudinary = async (
  publicId
) => {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "raw",
        type: "upload",
      }
    );
  } catch (error) {
    console.error(
      "Cloudinary delete error:",
      error
    );
  }
};

// ==========================================
// GET ACTIVE RESUME
// ==========================================

export const getResume = async (req, res) => {
  try {
    // First try to find active resume
    let resume = await Resume.findOne({
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    // Fallback: if no active resume,
    // return latest uploaded resume
    if (!resume) {
      resume = await Resume.findOne().sort({
        createdAt: -1,
      });
    }

    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error(
      "Get resume error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
    });
  }
};

// ==========================================
// GET ALL RESUMES - ADMIN
// ==========================================

export const getAllResumes = async (
  req,
  res
) => {
  try {
    const resumes = await Resume.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error(
      "Get all resumes error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resumes",
    });
  }
};

// ==========================================
// CREATE / UPLOAD RESUME
// ==========================================

export const createResume = async (
  req,
  res
) => {
  try {
    // Check PDF
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    // Upload PDF to Cloudinary
    const uploadedFile =
      await uploadPdfToCloudinary(
        req.file.buffer
      );

    // Deactivate all previous resumes
    await Resume.updateMany(
      {},
      {
        $set: {
          isActive: false,
        },
      }
    );

    // Create new active resume
    const resume = await Resume.create({
      title:
        req.body.title?.trim() ||
        "Rahul Maurya Resume",

      fileName:
        req.file.originalname,

      fileUrl:
        uploadedFile.secure_url,

      publicId:
        uploadedFile.public_id,

      fileType:
        req.file.mimetype ||
        "application/pdf",

      fileSize:
        req.file.size || 0,

      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message:
        "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    console.error(
      "Create resume error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to upload resume",
    });
  }
};

// ==========================================
// UPDATE / REPLACE RESUME
// ==========================================

export const updateResume = async (
  req,
  res
) => {
  try {
    const resume =
      await Resume.findById(
        req.params.id
      );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const oldPublicId =
      resume.publicId;

    // ======================================
    // NEW PDF UPLOADED
    // ======================================

    if (req.file) {
      const uploadedFile =
        await uploadPdfToCloudinary(
          req.file.buffer
        );

      resume.fileName =
        req.file.originalname;

      resume.fileUrl =
        uploadedFile.secure_url;

      resume.publicId =
        uploadedFile.public_id;

      resume.fileType =
        req.file.mimetype ||
        "application/pdf";

      resume.fileSize =
        req.file.size || 0;

      // Delete old Cloudinary PDF
      if (
        oldPublicId &&
        oldPublicId !==
          uploadedFile.public_id
      ) {
        await deletePdfFromCloudinary(
          oldPublicId
        );
      }
    }

    // ======================================
    // UPDATE TITLE
    // ======================================

    if (
      req.body.title !== undefined
    ) {
      resume.title =
        req.body.title.trim();
    }

    // ======================================
    // ALWAYS KEEP RESUME ACTIVE
    // ======================================

    resume.isActive = true;

    // Save
    await resume.save();

    return res.status(200).json({
      success: true,
      message:
        "Resume updated successfully",
      resume,
    });
  } catch (error) {
    console.error(
      "Update resume error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update resume",
    });
  }
};

// ==========================================
// DELETE RESUME
// ==========================================

export const deleteResume = async (
  req,
  res
) => {
  try {
    const resume =
      await Resume.findById(
        req.params.id
      );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Delete PDF from Cloudinary
    await deletePdfFromCloudinary(
      resume.publicId
    );

    // Delete from MongoDB
    await Resume.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Resume deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete resume error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete resume",
    });
  }
};