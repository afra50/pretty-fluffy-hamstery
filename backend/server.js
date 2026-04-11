// src/server.js

// 1. Ładowanie zmiennych środowiskowych z pliku .env (Zawsze na samej górze!)
require("dotenv").config();

// 2. Importy
const app = require("./app");
const db = require("./config/db"); // Samo zaimportowanie tego pliku odpali jego kod i przetestuje bazę!

// 3. Ustawienie portu (bierze z .env, a jak nie ma, to domyślnie 5000)
const PORT = process.env.PORT || 5000;

// 4. Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`\n=========================================`);
  console.log(`🚀 Serwer uruchomiony na porcie ${PORT}`);
  console.log(`🌍 Endpoint testowy: http://localhost:${PORT}/`);
  console.log(`=========================================\n`);
});
