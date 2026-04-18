const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.cookies?.auth_token;
  if (!token) return res.status(401).json({ error: "Brak tokenu dostępu" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Token wygasł lub jest nieprawidłowy" });
  }
}

function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Nieautoryzowany" });
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Brak dostępu" });
  next();
}

module.exports = { auth, adminOnly };
