// src/app.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// --- IMPORT TRAS ---
const authRoutes = require("./routes/authRoutes");

// Inicjalizacja aplikacji Express
const app = express();

// --- MIDDLEWARES ---

// CORS: Kluczowe dla ciasteczek (credentials: true) i Reacta na porcie 5173
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Dodaj tu port frontendu
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser()); // Kluczowe do czytania ciasteczek!

// --- ENDPOINT TESTOWY ---
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Witaj w API Pretty Fluffy Hamstery! 🐹",
  });
});

// --- TRASY API ---
app.use("/api/auth", authRoutes);

// Obsługa 404 (nieistniejące trasy)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Błąd 404: Ścieżka ${req.originalUrl} nie istnieje.`,
  });
});

module.exports = app;
