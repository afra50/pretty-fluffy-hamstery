// src/routes/facebookRoutes.js
const express = require("express");
const router = express.Router();
const facebookController = require("../controllers/facebookController");

router.get("/posts", facebookController.getLatestPosts);

module.exports = router;
