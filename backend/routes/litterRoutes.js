const express = require("express");
const router = express.Router();
const litterController = require("../controllers/litterController");
const { auth } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Pobieranie wszystkich miotów (publiczne)
router.get("/", litterController.getAllLitters);

// Dodawanie miotu
router.post(
  "/",
  auth,
  upload.fields([
    { name: "miniaturka", maxCount: 1 },
    { name: "zdjecia", maxCount: 15 },
  ]),
  litterController.createLitter,
);

// Edycja miotu
router.put(
  "/:id",
  auth,
  upload.fields([
    { name: "miniaturka", maxCount: 1 },
    { name: "zdjecia", maxCount: 15 },
  ]),
  litterController.updateLitter,
);

// Usuwanie miotu
router.delete("/:id", auth, litterController.deleteLitter);

module.exports = router;
