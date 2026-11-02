import express from "express";
import Statement from "../models/Statement.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const filter = { status: "published" };
    if (req.query.politician) filter.politician = req.query.politician;
    const items = await Statement.find(filter).populate("politician", "name role party").sort({ publishedOn: -1, createdAt: -1 }).limit(100);
    res.json({ success: true, items });
  } catch (error) { next(error); }
});

router.get("/admin/all", protectAdmin, async (req, res, next) => {
  try {
    const items = await Statement.find().populate("politician", "name role party").sort({ updatedAt: -1 });
    res.json({ success: true, items });
  } catch (error) { next(error); }
});

router.post("/", protectAdmin, async (req, res, next) => {
  try {
    if (!req.body.politician || !req.body.statement?.trim()) {
      return res.status(400).json({ success: false, message: "Choose a politician and enter the statement." });
    }
    const item = await Statement.create(req.body);
    res.status(201).json({ success: true, item });
  } catch (error) { next(error); }
});

router.put("/:id", protectAdmin, async (req, res, next) => {
  try {
    const item = await Statement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: "Statement not found." });
    res.json({ success: true, item });
  } catch (error) { next(error); }
});

router.delete("/:id", protectAdmin, async (req, res, next) => {
  try {
    const item = await Statement.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Statement not found." });
    res.json({ success: true, message: "Statement deleted." });
  } catch (error) { next(error); }
});

export default router;
