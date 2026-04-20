// src/controllers/facebookController.js
const axios = require("axios");
const NodeCache = require("node-cache");

// Cache na 10 minut (600 sekund) - żeby nie blokować limitów API Facebooka
const cache = new NodeCache({ stdTTL: 600 });

exports.getLatestPosts = async (req, res, next) => {
  try {
    // 1. Sprawdź, czy posty są w cache
    const cachedPosts = cache.get("fb_latest_posts");
    if (cachedPosts) {
      return res.json(cachedPosts);
    }

    // 2. Pobierz z FB (Zmieniłem zmienne środowiskowe na takie, jakie masz w .env)
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${process.env.FB_PAGE_ID}/posts`,
      {
        params: {
          access_token: process.env.FB_ACCESS_TOKEN,
          limit: 3,
          fields: "message,created_time,full_picture,permalink_url",
        },
      },
    );

    if (response.data && response.data.data.length > 0) {
      const latestPosts = response.data.data;

      // 3. Zapisz w cache
      cache.set("fb_latest_posts", latestPosts);
      res.json(latestPosts);
    } else {
      res.status(404).json({ error: "Brak postów do wyświetlenia." });
    }
  } catch (error) {
    console.error("Błąd FB API:", error.response?.data || error.message);
    res
      .status(500)
      .json({ error: "Wystąpił błąd podczas pobierania postów z Facebooka." });
  }
};
