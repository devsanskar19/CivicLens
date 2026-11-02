import express from "express";
import Politician from "../models/Politician.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const items = await Politician.find({ status: "active" }).sort({ name: 1 });
    res.json({ success: true, items });
  } catch (error) { next(error); }
});

router.get("/admin/all", protectAdmin, async (req, res, next) => {
  try {
    const items = await Politician.find().sort({ updatedAt: -1 });
    res.json({ success: true, items });
  } catch (error) { next(error); }
});

router.post("/", protectAdmin, async (req, res, next) => {
  try {
    if (!req.body.name?.trim()) return res.status(400).json({ success: false, message: "Politician name is required." });
    const item = await Politician.create(req.body);
    res.status(201).json({ success: true, item });
  } catch (error) { next(error); }
});

router.put("/:id", protectAdmin, async (req, res, next) => {
  try {
    const item = await Politician.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: "Profile not found." });
    res.json({ success: true, item });
  } catch (error) { next(error); }
});

router.delete("/:id", protectAdmin, async (req, res, next) => {
  try {
    const item = await Politician.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Profile not found." });
    res.json({ success: true, message: "Profile deleted." });
  } catch (error) { next(error); }
});

export default router;
