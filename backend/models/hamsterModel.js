const db = require("../config/db");

const Hamster = {
  getAll: async () => {
    const [rows] = await db.query(
      "SELECT * FROM chomiki ORDER BY created_at DESC",
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM chomiki WHERE id = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const {
      imie,
      przydomek,
      plec,
      umaszczenie,
      data_urodzenia,
      opis,
      miniaturka,
      zdjecia,
    } = data;
    const [result] = await db.query(
      `INSERT INTO chomiki 
      (imie, przydomek, plec, umaszczenie, data_urodzenia, opis, miniaturka, zdjecia) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        imie,
        przydomek,
        plec,
        umaszczenie,
        data_urodzenia,
        opis,
        miniaturka,
        JSON.stringify(zdjecia),
      ],
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const {
      imie,
      przydomek,
      plec,
      umaszczenie,
      data_urodzenia,
      opis,
      miniaturka,
      zdjecia,
    } = data;
    const [result] = await db.query(
      `UPDATE chomiki 
       SET imie = ?, przydomek = ?, plec = ?, umaszczenie = ?, data_urodzenia = ?, opis = ?, miniaturka = ?, zdjecia = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        imie,
        przydomek,
        plec,
        umaszczenie,
        data_urodzenia,
        opis,
        miniaturka,
        JSON.stringify(zdjecia),
        id,
      ],
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM chomiki WHERE id = ?", [id]);
    return result.affectedRows;
  },
};

module.exports = Hamster;
