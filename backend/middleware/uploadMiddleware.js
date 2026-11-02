
import multer from "multer";

function imageOnly(_req, file, callback) {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif"
  ];

  if (!allowed.includes(file.mimetype)) {
    return callback(
      new Error("Please upload a JPG, PNG, WEBP or GIF image.")
    );
  }

  callback(null, true);
}

const uploadImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageOnly,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

export default uploadImage;
