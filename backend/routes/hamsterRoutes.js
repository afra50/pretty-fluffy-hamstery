const express = require("express");
const router = express.Router();
const hamsterController = require("../controllers/hamsterController");
const { auth } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Pobieranie wszystkich (publiczne)
router.get("/", hamsterController.getAllHamsters);

// Dodawanie chomika (Chronione + Upload plików)
// Oczekujemy max 1 pliku w polu 'miniaturka' i do 10 w polu 'zdjecia'
router.post(
  "/",
  auth,
  upload.fields([
    { name: "miniaturka", maxCount: 1 },
    { name: "zdjecia", maxCount: 10 },
  ]),
  hamsterController.createHamster,
);

// Edycja
router.put(
  "/:id",
  auth,
  upload.fields([
    { name: "miniaturka", maxCount: 1 },
    { name: "zdjecia", maxCount: 10 },
  ]),
  hamsterController.updateHamster,
);

// Usuwanie chomika (Chronione)
router.delete("/:id", auth, hamsterController.deleteHamster);

module.exports = router;
