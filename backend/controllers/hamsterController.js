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

    if (!data_urodzenia) {
      return res.status(400).json({ error: "Data urodzenia jest wymagana." });
    }

    // NOWE: Limit 500 znaków dla opisu
    if (opis && opis.length > 500) {
      return res
        .status(400)
        .json({ error: "Opis może mieć maksymalnie 500 znaków." });
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
    const {
      imie,
      przydomek,
      plec,
      umaszczenie,
      data_urodzenia,
      opis,
      existingZdjecia,
    } = req.body;

    const currentHamster = await Hamster.getById(id);
    if (!currentHamster)
      return res.status(404).json({ error: "Nie znaleziono chomika." });

    // Pomocnicza funkcja do usuwania plików
    const deleteFile = async (relPath) => {
      if (!relPath) return;
      try {
        const absPath = path.join(__dirname, "../../public", relPath);
        await fs.unlink(absPath);
      } catch (err) {
        console.error("Błąd usuwania pliku:", err.message);
      }
    };

    // --- 1. OBSŁUGA MINIATURKI ---
    let miniaturkaPath = currentHamster.miniaturka;
    if (req.files && req.files.miniaturka) {
      // Jeśli jest nowa, usuwamy starą z dysku
      await deleteFile(currentHamster.miniaturka);
      const file = req.files.miniaturka[0];
      const filename = `thumb_${Date.now()}.webp`;
      miniaturkaPath = await processAndSaveImage(file.buffer, filename);
    }

    // --- 2. OBSŁUGA GALERII ZDJĘĆ ---
    // existingZdjecia przyjdzie jako string JSON z listą ścieżek, które zostały w modalu
    let photosToKeep = existingZdjecia ? JSON.parse(existingZdjecia) : [];
    let oldPhotos = currentHamster.zdjecia
      ? JSON.parse(currentHamster.zdjecia)
      : [];

    // Szukamy zdjęć do usunięcia (te, które były w bazie, a nie ma ich w nowej liście)
    const photosToDelete = oldPhotos.filter(
      (path) => !photosToKeep.includes(path),
    );
    for (const path of photosToDelete) {
      await deleteFile(path);
    }

    // Przetwarzamy NOWE zdjęcia wgrane podczas tej edycji
    let newPhotosPaths = [];
    if (req.files && req.files.zdjecia) {
      for (const file of req.files.zdjecia) {
        const filename = `img_${Date.now()}_${Math.round(Math.random() * 1e9)}.webp`;
        const savedPath = await processAndSaveImage(file.buffer, filename);
        newPhotosPaths.push(savedPath);
      }
    }

    // Finalna galeria to: te co zostały + te nowe
    const finalGallery = [...photosToKeep, ...newPhotosPaths];

    const hamsterData = {
      imie: imie.trim(),
      przydomek: przydomek ? przydomek.trim() : null,
      plec,
      umaszczenie: umaszczenie ? umaszczenie.trim() : null,
      data_urodzenia,
      opis: opis ? opis.trim() : null,
      miniaturka: miniaturkaPath,
      zdjecia: finalGallery,
    };

    await Hamster.update(id, hamsterData);
    res.json({ message: "Zaktualizowano pomyślnie!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera." });
  }
};

exports.deleteHamster = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Musimy najpierw pobrać dane chomika, żeby znać ścieżki do plików
    const hamster = await Hamster.getById(id);
    if (!hamster) {
      return res.status(404).json({ error: "Nie znaleziono chomika" });
    }

    // 2. Funkcja pomocnicza do usuwania pojedynczego pliku
    const deleteFile = async (relativePath) => {
      if (!relativePath) return;
      try {
        const absolutePath = path.join(__dirname, "../../public", relativePath);
        await fs.unlink(absolutePath);
      } catch (err) {
        console.error(
          `Błąd podczas usuwania pliku ${relativePath}:`,
          err.message,
        );
        // Nie przerywamy, jeśli pliku fizycznie nie ma (np. został już usunięty ręcznie)
      }
    };

    // 3. Usuwamy miniaturkę
    await deleteFile(hamster.miniaturka);

    // 4. Usuwamy wszystkie zdjęcia z galerii
    if (hamster.zdjecia) {
      const zdjecia = JSON.parse(hamster.zdjecia);
      for (const imgPath of zdjecia) {
        await deleteFile(imgPath);
      }
    }

    // 5. Dopiero teraz usuwamy rekord z bazy danych
    await Hamster.delete(id);

    res.json({ message: "Chomik i powiązane pliki zostały usunięte" });
  } catch (err) {
    console.error("Błąd w deleteHamster:", err);
    res.status(500).json({ error: "Błąd serwera podczas usuwania." });
  }
};
