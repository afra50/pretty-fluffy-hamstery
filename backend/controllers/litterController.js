const Miot = require("../models/litterModel");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs/promises");

const processAndSaveImage = async (buffer, filename) => {
  const uploadPath = path.join(__dirname, "../../public/uploads/mioty");
  await fs.mkdir(uploadPath, { recursive: true });
  const filePath = path.join(uploadPath, filename);

  await sharp(buffer)
    .resize(800, 800, { fit: "cover" })
    .webp({ quality: 80 })
    .toFile(filePath);

  return `/uploads/mioty/${filename}`;
};

const deleteFile = async (relativePath) => {
  if (!relativePath) return;
  try {
    const absolutePath = path.join(__dirname, "../../public", relativePath);
    await fs.unlink(absolutePath);
  } catch (err) {
    console.error(`Błąd usuwania pliku ${relativePath}:`, err.message);
  }
};

exports.getAllLitters = async (req, res) => {
  try {
    const litters = await Miot.getAll();
    const parsedLitters = litters.map((m) => ({
      ...m,
      zdjecia: m.zdjecia ? JSON.parse(m.zdjecia) : [],
    }));
    res.json(parsedLitters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas pobierania miotów." });
  }
};

exports.createLitter = async (req, res) => {
  try {
    let {
      nazwa,
      status,
      data_urodzenia,
      spodziewany_termin,
      matka_id,
      ojciec_id,
      opis,
    } = req.body;

    // --- WALIDACJA ---
    if (!nazwa || typeof nazwa !== "string" || nazwa.trim() === "") {
      return res.status(400).json({ error: "Nazwa miotu jest wymagana." });
    }
    if (nazwa.length > 100)
      return res.status(400).json({ error: "Nazwa max 100 znaków." });

    if (!status || !["planowany", "aktualny", "archiwum"].includes(status)) {
      status = "aktualny"; // Domyślny fallback
    }

    if (opis && opis.length > 2000)
      return res.status(400).json({ error: "Opis max 2000 znaków." });
    if (spodziewany_termin && spodziewany_termin.length > 100)
      return res
        .status(400)
        .json({ error: "Spodziewany termin max 100 znaków." });

    if (data_urodzenia) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(data_urodzenia)) {
        return res
          .status(400)
          .json({ error: "Format daty musi być YYYY-MM-DD." });
      }
    } else {
      data_urodzenia = null; // Dla planowanych miotów
    }

    // Parsowanie IDków (by nie weszły pusty stringi)
    matka_id = matka_id ? parseInt(matka_id, 10) : null;
    ojciec_id = ojciec_id ? parseInt(ojciec_id, 10) : null;

    // --- PLIKI ---
    let miniaturkaPath = null;
    let zdjeciaPaths = [];

    if (req.files && req.files.miniaturka) {
      const filename = `thumb_miot_${Date.now()}_${Math.round(Math.random() * 1e9)}.webp`;
      miniaturkaPath = await processAndSaveImage(
        req.files.miniaturka[0].buffer,
        filename,
      );
    }

    if (req.files && req.files.zdjecia) {
      for (const file of req.files.zdjecia) {
        const filename = `img_miot_${Date.now()}_${Math.round(Math.random() * 1e9)}.webp`;
        zdjeciaPaths.push(await processAndSaveImage(file.buffer, filename));
      }
    }

    const miotData = {
      nazwa: nazwa.trim(),
      status,
      data_urodzenia,
      spodziewany_termin: spodziewany_termin ? spodziewany_termin.trim() : null,
      matka_id,
      ojciec_id,
      opis: opis ? opis.trim() : null,
      miniaturka: miniaturkaPath,
      zdjecia: zdjeciaPaths,
    };

    const insertId = await Miot.create(miotData);
    res.status(201).json({ message: "Miot dodany!", id: insertId });
  } catch (err) {
    console.error("Błąd w createLitter:", err);
    res.status(500).json({ error: "Błąd serwera." });
  }
};

exports.updateLitter = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      nazwa,
      status,
      data_urodzenia,
      spodziewany_termin,
      matka_id,
      ojciec_id,
      opis,
      existingZdjecia,
    } = req.body;

    // --- WALIDACJA ---
    if (!nazwa || typeof nazwa !== "string" || nazwa.trim() === "") {
      return res.status(400).json({ error: "Nazwa miotu jest wymagana." });
    }
    if (!status || !["planowany", "aktualny", "archiwum"].includes(status))
      status = "aktualny";
    if (data_urodzenia && !/^\d{4}-\d{2}-\d{2}$/.test(data_urodzenia)) {
      return res
        .status(400)
        .json({ error: "Format daty musi być YYYY-MM-DD." });
    }

    data_urodzenia = data_urodzenia || null;
    matka_id = matka_id ? parseInt(matka_id, 10) : null;
    ojciec_id = ojciec_id ? parseInt(ojciec_id, 10) : null;

    const currentMiot = await Miot.getById(id);
    if (!currentMiot)
      return res.status(404).json({ error: "Nie znaleziono miotu." });

    // --- PLIKI ---
    let miniaturkaPath = currentMiot.miniaturka;
    if (req.files && req.files.miniaturka) {
      await deleteFile(currentMiot.miniaturka);
      const filename = `thumb_miot_${Date.now()}_${Math.round(Math.random() * 1e9)}.webp`;
      miniaturkaPath = await processAndSaveImage(
        req.files.miniaturka[0].buffer,
        filename,
      );
    }

    let photosToKeep = existingZdjecia ? JSON.parse(existingZdjecia) : [];
    let oldPhotos = currentMiot.zdjecia ? JSON.parse(currentMiot.zdjecia) : [];

    // Usuwanie usuniętych zdjęć
    const photosToDelete = oldPhotos.filter(
      (path) => !photosToKeep.includes(path),
    );
    for (const path of photosToDelete) await deleteFile(path);

    // Nowe zdjęcia
    let newPhotosPaths = [];
    if (req.files && req.files.zdjecia) {
      for (const file of req.files.zdjecia) {
        const filename = `img_miot_${Date.now()}_${Math.round(Math.random() * 1e9)}.webp`;
        newPhotosPaths.push(await processAndSaveImage(file.buffer, filename));
      }
    }

    const miotData = {
      nazwa: nazwa.trim(),
      status,
      data_urodzenia,
      spodziewany_termin: spodziewany_termin ? spodziewany_termin.trim() : null,
      matka_id,
      ojciec_id,
      opis: opis ? opis.trim() : null,
      miniaturka: miniaturkaPath,
      zdjecia: [...photosToKeep, ...newPhotosPaths],
    };

    await Miot.update(id, miotData);
    res.json({ message: "Zaktualizowano pomyślnie!" });
  } catch (err) {
    console.error("Błąd w updateLitter:", err);
    res.status(500).json({ error: "Błąd serwera podczas edycji." });
  }
};

exports.deleteLitter = async (req, res) => {
  try {
    const { id } = req.params;
    const miot = await Miot.getById(id);
    if (!miot) return res.status(404).json({ error: "Nie znaleziono miotu." });

    await deleteFile(miot.miniaturka);
    if (miot.zdjecia) {
      for (const imgPath of JSON.parse(miot.zdjecia)) {
        await deleteFile(imgPath);
      }
    }

    await Miot.delete(id);
    res.json({ message: "Miot i jego zdjęcia zostały usunięte." });
  } catch (err) {
    console.error("Błąd w deleteLitter:", err);
    res.status(500).json({ error: "Błąd serwera." });
  }
};
