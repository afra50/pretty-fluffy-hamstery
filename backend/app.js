// src/app.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path"); // <-- DODANE: Potrzebne do ścieżek plików

// --- IMPORT TRAS ---
const authRoutes = require("./routes/authRoutes");
const hamsterRoutes = require("./routes/hamsterRoutes"); // <-- DODANE
const facebookRoutes = require("./routes/facebookRoutes");
const litterRoutes = require("./routes/litterRoutes");

// Inicjalizacja aplikacji Express
const app = express();

// --- MIDDLEWARES ---

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// --- SERWOWANIE PLIKÓW STATYCZNYCH (ZDJĘĆ) ---
// Gdy frontend zapyta o "http://localhost:5000/uploads/...", Express wyda mu plik z folderu public/uploads
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// --- ENDPOINT TESTOWY ---
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Witaj w API Pretty Fluffy Hamstery! 🐹",
  });
});

// --- TRAS API ---
app.use("/api/auth", authRoutes);
app.use("/api/chomiki", hamsterRoutes); // <-- DODANE
app.use("/api/mioty", litterRoutes);
app.use("/api/facebook", facebookRoutes);

// Obsługa 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Błąd 404: Ścieżka ${req.originalUrl} nie istnieje.`,
  });
});

module.exports = app;
