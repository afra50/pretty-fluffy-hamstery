const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const isProd = process.env.NODE_ENV === "production";

const ms = (str) => {
  const n = parseInt(str, 10);
  if (str.endsWith("m")) return n * 60 * 1000;
  if (str.endsWith("h")) return n * 60 * 60 * 1000;
  if (str.endsWith("d")) return n * 24 * 60 * 60 * 1000;
  return n;
};

const cookieBaseConfig = {
  httpOnly: true,
  secure: isProd,
  sameSite: "Lax",
};

const setAccessCookie = (res, token) => {
  res.cookie("auth_token", token, {
    ...cookieBaseConfig,
    path: "/",
    maxAge: ms(process.env.JWT_EXPIRES || "15m"),
  });
};

const setRefreshCookie = (res, token) => {
  res.cookie("refresh_token", token, {
    ...cookieBaseConfig,
    path: "/api/auth/refresh",
    maxAge: ms(process.env.JWT_REFRESH_EXPIRES || "14d"),
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM admin WHERE username = ?", [
      username,
    ]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Nieprawidłowe dane logowania" });
    }

    const payload = { sub: user.id, role: "admin" };

    const access = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || "15m",
    });
    const refresh = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES || "14d",
    });

    setAccessCookie(res, access);
    setRefreshCookie(res, refresh);

    res.json({
      message: "Zalogowano pomyślnie",
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error("Błąd logowania:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
};

exports.refresh = async (req, res) => {
  const rt = req.cookies?.refresh_token;
  if (!rt) return res.status(401).json({ error: "Brak tokenu odświeżania" });

  try {
    const payload = jwt.verify(rt, process.env.JWT_REFRESH_SECRET);

    const newAccess = jwt.sign(
      { sub: payload.sub, role: payload.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "15m" },
    );

    setAccessCookie(res, newAccess);
    res.status(204).send();
  } catch (err) {
    res.clearCookie("refresh_token", { path: "/api/auth/refresh" });
    return res
      .status(401)
      .json({ error: "Sesja wygasła. Zaloguj się ponownie." });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("auth_token", { path: "/" });
  res.clearCookie("refresh_token", { path: "/api/auth/refresh" });
  res.json({ message: "Wylogowano pomyślnie" });
};

exports.checkAuth = (req, res) => {
  res.json({
    authenticated: true,
    user: req.user,
  });
};
