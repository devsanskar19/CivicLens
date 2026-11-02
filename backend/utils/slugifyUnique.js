import slugify from "slugify";
import Content from "../models/Content.js";

export default async function slugifyUnique(title, excludeId = null) {
  const base = slugify(title, { lower: true, strict: true }) || "article";
  let candidate = base;
  let count = 1;
  while (await Content.exists({ slug: candidate, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    count += 1;
    candidate = `${base}-${count}`;
  }
  return candidate;
}
