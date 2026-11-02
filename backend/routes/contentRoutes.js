
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import Content from "../models/Content.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import uploadImage from "../middleware/uploadMiddleware.js";
import slugifyUnique from "../utils/slugifyUnique.js";

const router = express.Router();



const allowedTypes = ["factcheck", "media-analysis", "research"];
const allowedVerdicts = ["True", "False", "Misleading", "Unverified", "Satire", ""];

function validateBody(body) {
  if (!allowedTypes.includes(body.type)) return "Choose a valid content type.";

  if (!body.title?.trim() || !body.summary?.trim() || !body.body?.trim()) {
    return "Title, summary and full content are required.";
  }

  if (body.verdict && !allowedVerdicts.includes(body.verdict)) {
    return "Invalid verdict.";
  }

  if (body.type === "factcheck" && !body.verdict) {
    return "Select a verdict for a fact-check.";
  }

  if (body.sources && !Array.isArray(body.sources)) {
    return "Sources must be a list.";
  }

  return null;
}

// Upload an image buffer to Cloudinary and return its secure URL.
function uploadToCloudinary(fileBuffer) {
  // Load credentials when an image is actually uploaded.
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "civiclens",
        resource_type: "image"
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result.secure_url);
      }
    );

    stream.end(fileBuffer);
  });
}

router.get("/", async (req, res, next) => {
  try {
    const filter = { status: "published" };

    if (req.query.type && allowedTypes.includes(req.query.type)) {
      filter.type = req.query.type;
    }

    if (req.query.search) {
      filter.$text = { $search: String(req.query.search).slice(0, 100) };
    }

    const items = await Content.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(100);

    res.json({ success: true, items });
  } catch (error) {
    next(error);
  }
});

router.get("/admin/all", protectAdmin, async (req, res, next) => {
  try {
    const items = await Content.find().sort({ updatedAt: -1 }).limit(200);
    res.json({ success: true, items });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const item = await Content.findOne({
      slug: req.params.slug,
      status: "published"
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Article not found."
      });
    }

    res.json({ success: true, item });
  } catch (error) {
    next(error);
  }
});

// Create new content with an optional Cloudinary image upload.
router.post(
  "/",
  protectAdmin,
  uploadImage.single("image"),
  async (req, res, next) => {
    try {
      const body = { ...req.body };

      if (body.sources) {
        try {
          body.sources = JSON.parse(body.sources);
        } catch {
          return res.status(400).json({
            success: false,
            message: "Invalid sources format."
          });
        }
      }

      const error = validateBody(body);

      if (error) {
        return res.status(400).json({ success: false, message: error });
      }

      const status = body.status === "published" ? "published" : "draft";
      const slug = await slugifyUnique(body.title);

      const imageUrl = req.file
        ? await uploadToCloudinary(req.file.buffer)
        : "";

      const item = await Content.create({
        ...body,
        imageUrl,
        slug,
        status,
        publishedAt: status === "published" ? new Date() : null,
        author: req.admin.name
      });

      res.status(201).json({ success: true, item });
    } catch (error) {
      next(error);
    }
  }
);

// Edit existing content and optionally replace its image.
router.put(
  "/:id",
  protectAdmin,
  uploadImage.single("image"),
  async (req, res, next) => {
    try {
      const body = { ...req.body };

      if (body.sources) {
        try {
          body.sources = JSON.parse(body.sources);
        } catch {
          return res.status(400).json({
            success: false,
            message: "Invalid sources format."
          });
        }
      }

      const error = validateBody(body);

      if (error) {
        return res.status(400).json({ success: false, message: error });
      }

      const existing = await Content.findById(req.params.id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Content not found."
        });
      }

      const status = body.status === "published" ? "published" : "draft";
      const slug = await slugifyUnique(body.title, existing._id);

      Object.assign(existing, body, {
        slug,
        status
      });

      // Replace the image only when a new image is uploaded.
      if (req.file) {
        existing.imageUrl = await uploadToCloudinary(req.file.buffer);
      }

      if (status === "published" && !existing.publishedAt) {
        existing.publishedAt = new Date();
      }

      if (status === "draft") {
        existing.publishedAt = null;
      }

      await existing.save();

      res.json({ success: true, item: existing });
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id", protectAdmin, async (req, res, next) => {
  try {
    const item = await Content.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Content not found."
      });
    }

    res.json({ success: true, message: "Content deleted." });
  } catch (error) {
    next(error);
  }
});

export default router;
