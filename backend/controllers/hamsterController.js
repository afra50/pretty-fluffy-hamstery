const Hamster = require("../models/hamsterModel");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs/promises");

// Funkcja pomocnicza do obróbki i zapisu obrazka
const processAndSaveImage = async (buffer, filename) => {
  const uploadPath = path.join(__dirname, "../../public/uploads/hamsters");

  // Upewniamy się, że folder istnieje
  await fs.mkdir(uploadPath, { recursive: true });

  const filePath = path.join(uploadPath, filename);

  await sharp(buffer)
    .resize(800, 800, { fit: "cover" }) // Ustawienia kompresji/przycinania
    .webp({ quality: 80 }) // Zapisujemy jako nowoczesny format webp
    .toFile(filePath);

  return `/uploads/hamsters/${filename}`; // Zwracamy ścieżkę do bazy
};

exports.getAllHamsters = async (req, res) => {
  try {
    const hamsters = await Hamster.getAll();

    // Zmieniamy string ze zdjęciami z powrotem na tablicę JSON
    const parsedHamsters = hamsters.map((h) => ({
      ...h,
      zdjecia: h.zdjecia ? JSON.parse(h.zdjecia) : [],
    }));

    res.json(parsedHamsters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas pobierania chomików" });
  }
};

exports.createHamster = async (req, res) => {
  try {
    const { imie, przydomek, plec, umaszczenie, data_urodzenia, opis } =
      req.body;

    // ==========================================
    // 🛡️ WALIDACJA DANYCH WEJŚCIOWYCH (BACKEND)
    // ==========================================

    // 1. Wymagane pola i długości
    if (!imie || typeof imie !== "string" || imie.trim() === "") {
      return res
        .status(400)
        .json({ error: "Imię jest wymagane i nie może być puste." });
    }
    if (imie.length > 100) {
      return res
        .status(400)
        .json({ error: "Imię może mieć maksymalnie 100 znaków." });
    }

    // 2. ENUM dla płci
    if (!plec || !["samiec", "samica"].includes(plec)) {
      return res
        .status(400)
        .json({ error: "Płeć jest wymagana (wybierz 'samiec' lub 'samica')." });
    }

    // 3. Opcjonalne pola z limitami znaków (VARCHAR 100)
    if (przydomek && przydomek.length > 100) {
      return res
        .status(400)
        .json({ error: "Przydomek może mieć maksymalnie 100 znaków." });
    }

    if (umaszczenie && umaszczenie.length > 100) {
      return res
        .status(400)
        .json({ error: "Umaszczenie może mieć maksymalnie 100 znaków." });
    }

    // 4. Format daty (jeśli podano, sprawdzamy czy to YYYY-MM-DD)
    if (data_urodzenia) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data_urodzenia)) {
        return res.status(400).json({
          error:
            "Nieprawidłowy format daty urodzenia (oczekiwany: YYYY-MM-DD).",
        });
      }
    }

    // ==========================================
    // 💾 ZAPIS PLIKÓW I DO BAZY
    // ==========================================

    let miniaturkaPath = null;
    let zdjeciaPaths = [];

    // Przetwarzanie miniaturki
    if (req.files && req.files.miniaturka) {
      const file = req.files.miniaturka[0];
      const filename = `thumb_${Date.now()}_${Math.round(Math.random() * 1e9)}.webp`;
      miniaturkaPath = await processAndSaveImage(file.buffer, filename);
    }

    // Przetwarzanie reszty zdjęć
    if (req.files && req.files.zdjecia) {
      for (const file of req.files.zdjecia) {
        const filename = `img_${Date.now()}_${Math.round(Math.random() * 1e9)}.webp`;
        const savedPath = await processAndSaveImage(file.buffer, filename);
        zdjeciaPaths.push(savedPath);
      }
    }

    const hamsterData = {
      imie: imie.trim(),
      przydomek: przydomek ? przydomek.trim() : null,
      plec,
      umaszczenie: umaszczenie ? umaszczenie.trim() : null,
      data_urodzenia: data_urodzenia || null,
      opis: opis ? opis.trim() : null,
      miniaturka: miniaturkaPath,
      zdjecia: zdjeciaPaths,
    };

    const insertId = await Hamster.create(hamsterData);
    res.status(201).json({ message: "Chomik dodany pomyślnie!", id: insertId });
  } catch (err) {
    console.error("Błąd w createHamster:", err);
    res
      .status(500)
      .json({ error: "Błąd podczas dodawania chomika na serwerze." });
  }
};

exports.updateHamster = async (req, res) => {
  try {
    const { id } = req.params;
    const { imie, przydomek, plec, umaszczenie, data_urodzenia, opis } =
      req.body;

    // --- WALIDACJA DANYCH ---
    if (!imie || typeof imie !== "string" || imie.trim() === "") {
      return res.status(400).json({ error: "Imię jest wymagane." });
    }
    if (imie.length > 100)
      return res.status(400).json({ error: "Imię może mieć max 100 znaków." });
    if (!plec || !["samiec", "samica"].includes(plec)) {
      return res
        .status(400)
        .json({ error: "Płeć jest wymagana (samiec/samica)." });
    }
    if (przydomek && przydomek.length > 100)
      return res.status(400).json({ error: "Przydomek max 100 znaków." });
    if (umaszczenie && umaszczenie.length > 100)
      return res.status(400).json({ error: "Umaszczenie max 100 znaków." });
    if (data_urodzenia) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data_urodzenia)) {
        return res
          .status(400)
          .json({ error: "Nieprawidłowy format daty (YYYY-MM-DD)." });
      }
    }

    // --- POBRANIE AKTUALNEGO CHOMIKA (żeby nie nadpisać zdjęć pustką) ---
    const currentHamster = await Hamster.getById(id);
    if (!currentHamster) {
      return res
        .status(404)
        .json({ error: "Nie znaleziono chomika o podanym ID." });
    }

    // Domyślnie zostawiamy stare ścieżki do plików
    let miniaturkaPath = currentHamster.miniaturka;
    let zdjeciaPaths = currentHamster.zdjecia
      ? JSON.parse(currentHamster.zdjecia)
      : [];

    // Jeśli wgrano NOWĄ miniaturkę -> nadpisujemy starą
    if (req.files && req.files.miniaturka) {
      const file = req.files.miniaturka[0];
      const filename = `thumb_${Date.now()}_${Math.round(Math.random() * 1e9)}.webp`;
      miniaturkaPath = await processAndSaveImage(file.buffer, filename);
    }

    // Jeśli wgrano NOWE zdjęcia do galerii -> nadpisujemy starą galerię
    if (req.files && req.files.zdjecia) {
      zdjeciaPaths = []; // Czyścimy starą tablicę
      for (const file of req.files.zdjecia) {
        const filename = `img_${Date.now()}_${Math.round(Math.random() * 1e9)}.webp`;
        const savedPath = await processAndSaveImage(file.buffer, filename);
        zdjeciaPaths.push(savedPath);
      }
    }

    // --- ZAPIS DO BAZY ---
    const hamsterData = {
      imie: imie.trim(),
      przydomek: przydomek ? przydomek.trim() : null,
      plec,
      umaszczenie: umaszczenie ? umaszczenie.trim() : null,
      data_urodzenia: data_urodzenia || null,
      opis: opis ? opis.trim() : null,
      miniaturka: miniaturkaPath,
      zdjecia: zdjeciaPaths,
    };

    await Hamster.update(id, hamsterData);

    res.json({ message: "Dane chomika zostały zaktualizowane pomyślnie!" });
  } catch (err) {
    console.error("Błąd w updateHamster:", err);
    res.status(500).json({ error: "Błąd serwera podczas edycji chomika." });
  }
};

exports.deleteHamster = async (req, res) => {
  try {
    const { id } = req.params;
    // Opcjonalnie: Tutaj warto dodać logikę usuwania plików z dysku za pomocą fs.unlink

    const affected = await Hamster.delete(id);
    if (affected === 0) {
      return res.status(404).json({ error: "Nie znaleziono chomika" });
    }

    res.json({ message: "Chomik usunięty" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas usuwania chomika" });
  }
};
