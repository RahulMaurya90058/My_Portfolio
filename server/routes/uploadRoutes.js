import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.post(
  "/image",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select an image",
        });
      }

      const folder =
        req.body.folder === "profile"
          ? "my-portfolio/profile"
          : "my-portfolio/projects";

      const result = await new Promise(
        (resolve, reject) => {
          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder,
                resource_type: "image",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );

          stream.end(req.file.buffer);
        }
      );

      return res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        imageUrl: result.secure_url,
      });
    } catch (error) {
      console.error(
        "Cloudinary upload error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }
  }
);

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Image size must be less than 5MB",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next();
});

export default router;