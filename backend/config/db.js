// src/config/db.js
const mysql = require("mysql2/promise");

// Tworzymy pulę połączeń (connection pool) do bazy MariaDB/MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Maksymalnie 10 jednoczesnych połączeń (wystarczy z zapasem)
  queueLimit: 0,
});

// Natychmiastowy test połączenia przy starcie serwera
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Baza danych 'pretty_fluffy' połączona pomyślnie!");
    conn.release(); // Ważne: oddajemy połączenie z powrotem do puli
  } catch (err) {
    console.error("❌ Błąd połączenia z bazą danych:", err.message);
    process.exit(1); // Zatrzymuje serwer, jeśli baza nie działa (bezpiecznik)
  }
})();

module.exports = pool;
