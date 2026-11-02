import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").toLowerCase().trim();
    const password = String(req.body.password || "");
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required." });

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ success: false, message: "Incorrect admin email or password." });
    }
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    });
    res.json({ success: true, token, admin: { name: admin.name, email: admin.email, role: admin.role } });
  } catch (error) { next(error); }
});

router.get("/me", protectAdmin, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

export default router;
