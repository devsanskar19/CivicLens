import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

dotenv.config();

async function seed() {
  const { MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGO_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD ||
      ADMIN_PASSWORD === "CHANGE_THIS_TO_A_STRONG_PASSWORD") {
    throw new Error("Set MONGO_URI, ADMIN_NAME, ADMIN_EMAIL and a strong ADMIN_PASSWORD in backend/.env.");
  }
  if (ADMIN_PASSWORD.length < 12) throw new Error("Use an admin password with at least 12 characters.");
  await mongoose.connect(MONGO_URI);
  const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await Admin.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase() },
    { name: ADMIN_NAME, email: ADMIN_EMAIL.toLowerCase(), password, role: "admin" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`Admin account is ready for ${ADMIN_EMAIL}.`);
  await mongoose.disconnect();
}
seed().catch(async (error) => {
  console.error(error.message);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
