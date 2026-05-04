const db = require("../config/db");

const Miot = {
  getAll: async () => {
    // JOIN pozwala od razu zaciągnąć podstawowe dane rodziców do wyświetlenia na karcie
    const [rows] = await db.query(
      `SELECT m.*, 
        matka.imie as matka_imie, matka.miniaturka as matka_miniaturka,
        ojciec.imie as ojciec_imie, ojciec.miniaturka as ojciec_miniaturka
       FROM mioty m
       LEFT JOIN chomiki matka ON m.matka_id = matka.id
       LEFT JOIN chomiki ojciec ON m.ojciec_id = ojciec.id
       ORDER BY m.created_at DESC`,
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM mioty WHERE id = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const {
      nazwa,
      status,
      data_urodzenia,
      spodziewany_termin,
      matka_id,
      ojciec_id,
      opis,
      miniaturka,
      zdjecia,
    } = data;
    const [result] = await db.query(
      `INSERT INTO mioty 
      (nazwa, status, data_urodzenia, spodziewany_termin, matka_id, ojciec_id, opis, miniaturka, zdjecia) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nazwa,
        status,
        data_urodzenia,
        spodziewany_termin,
        matka_id,
        ojciec_id,
        opis,
        miniaturka,
        JSON.stringify(zdjecia),
      ],
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const {
      nazwa,
      status,
      data_urodzenia,
      spodziewany_termin,
      matka_id,
      ojciec_id,
      opis,
      miniaturka,
      zdjecia,
    } = data;
    const [result] = await db.query(
      `UPDATE mioty 
       SET nazwa=?, status=?, data_urodzenia=?, spodziewany_termin=?, 
           matka_id=?, ojciec_id=?, opis=?, miniaturka=?, zdjecia=?, updated_at=CURRENT_TIMESTAMP
       WHERE id=?`,
      [
        nazwa,
        status,
        data_urodzenia,
        spodziewany_termin,
        matka_id,
        ojciec_id,
        opis,
        miniaturka,
        JSON.stringify(zdjecia),
        id,
      ],
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM mioty WHERE id = ?", [id]);
    return result.affectedRows;
  },
};

module.exports = Miot;
