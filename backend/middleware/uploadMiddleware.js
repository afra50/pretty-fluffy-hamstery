// src/middleware/uploadMiddleware.js
const multer = require("multer");

const storage = multer.memoryStorage(); // Pliki trafiają do RAMu pod Sharpa

const limits = {
  fileSize: 5 * 1024 * 1024, // Max 5 MB na plik
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Dozwolone są tylko zdjęcia! (JPEG, PNG, WEBP)"), false);
  }
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

module.exports = upload;
