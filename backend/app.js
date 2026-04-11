// src/app.js
const express = require("express");
const cors = require("cors");

// Inicjalizacja aplikacji Express
const app = express();

// --- MIDDLEWARES ---
// Pozwala na komunikację z frontendem (React na porcie 5173 będzie mógł wysyłać zapytania)
app.use(cors());

// Pozwala backendowi automatycznie odczytywać dane w formacie JSON (np. z formularzy od Juli)
app.use(express.json());

// --- ENDPOINT TESTOWY ---
// Żebyśmy mogli łatwo sprawdzić w przeglądarce, czy backend odpowiada
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Witaj w API Pretty Fluffy Hamstery! 🐹",
  });
});

// --- TWOJE ŚCIEŻKI (ROUTES) - Miejsce na przyszłość ---
// Tutaj niedługo podepniemy trasy dla miotów, zwierząt i autoryzacji, np.:
// const miotyRoutes = require('./routes/miotyRoutes');
// app.use('/api/mioty', miotyRoutes);

// Eksportujemy skonfigurowaną aplikację, ale JESZCZE jej nie uruchamiamy
module.exports = app;
