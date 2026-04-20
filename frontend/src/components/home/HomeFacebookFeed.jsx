import React, { useEffect, useState, useCallback } from "react";
import { Image as ImageIcon } from "lucide-react"; // Importujemy defaultową ikonę zdjęcia
import api from "../../utils/api";
import Loader from "../ui/Loader"; // <-- Zakładam taką ścieżkę do Twojego loadera
import ErrorState from "../ui/ErrorState"; // <-- Zakładam taką ścieżkę do Twojego error state
import "../../styles/components/home/home-facebook-feed.scss";

const HomeFacebookFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CHARACTER_LIMIT = 180;

  const truncateText = (text, limit) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.substring(0, limit).trim() + "...";
  };

  const fetchLatestPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/facebook/posts");

      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (err) {
      console.error("Błąd pobierania postów:", err);
      setError("Nie udało się pobrać aktualności z Facebooka.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestPosts();
  }, [fetchLatestPosts]);

  return (
    <section className="facebook-feed-section">
      {/* Dodaliśmy kontener, by sekcja mogła mieć tło na pełną szerokość */}
      <div className="feed-container">
        {/* Nagłówek wyświetla się zawsze */}
        <div className="feed-header">
          <h2>Z życia hodowli</h2>
          <p>Najnowsze wieści prosto z naszego Facebooka</p>
        </div>

        {/* Logika wyświetlania zawartości pod nagłówkiem */}
        {loading ? (
          <Loader message="Pobieranie najnowszych postów..." />
        ) : error ? (
          <ErrorState
            title="Błąd ładowania"
            message={error}
            onRetry={fetchLatestPosts}
          />
        ) : posts.length === 0 ? (
          <ErrorState
            title="Brak postów"
            message="Nie znaleźliśmy aktualnie żadnych postów do wyświetlenia."
            onRetry={fetchLatestPosts}
          />
        ) : (
          <div className="feed-grid">
            {posts.map((post) => (
              <div className="fb-post-card" key={post.id}>
                <a
                  href={post.permalink_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`post-image-link ${!post.full_picture ? "has-no-image" : ""}`}
                >
                  {post.full_picture ? (
                    <img
                      src={post.full_picture}
                      alt="Post z Facebooka"
                      className="post-image"
                    />
                  ) : (
                    <div className="post-placeholder">
                      {/* Czysta, defaultowa ikona z Lucide, bez tekstu */}
                      <ImageIcon
                        size={48}
                        className="placeholder-icon"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                </a>

                <div className="post-content">
                  <span className="post-date">
                    {new Date(post.created_time).toLocaleDateString("pl-PL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>

                  <p className="post-message">
                    {truncateText(post.message, CHARACTER_LIMIT)}
                  </p>

                  <a
                    href={post.permalink_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="post-read-more"
                  >
                    Czytaj na Facebooku &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeFacebookFeed;
