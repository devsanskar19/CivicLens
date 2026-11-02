import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export async function protectAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Admin login required." });
    }
    const token = header.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("_id name email role");
    if (!admin || admin.role !== "admin") {
      return res.status(401).json({ success: false, message: "Admin account not found." });
    }
    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired login token." });
  }
}
