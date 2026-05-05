import React, { useState, useEffect } from "react";
import { hamsterApi } from "../utils/api";
import { ZoomIn, X, ChevronLeft, ChevronRight, Cake } from "lucide-react";
import ErrorState from "../components/ui/ErrorState";
import Loader from "../components/ui/Loader";
import "../styles/pages/our-hamsters.scss";

const IMAGE_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace("/api", "");

const OurHamsters = () => {
  const [hamsters, setHamsters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stan aktywnych zakładek ("samice" lub "samiec")
  const [activeTab, setActiveTab] = useState("samice");

  // Stan dla powiększonej galerii (Lightbox)
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });

  useEffect(() => {
    const fetchHamsters = async () => {
      try {
        const response = await hamsterApi.getAll();
        const data = response.data;
        setHamsters(data);

        // Ustawiamy domyślną zakładkę po załadowaniu danych
        const hasFemales = data.some(
          (h) => h.plec && h.plec.toLowerCase() === "samica",
        );
        if (hasFemales) {
          setActiveTab("samice");
        } else {
          setActiveTab("samiec");
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Błąd pobierania chomików:", err);
        setError(
          "Nie udało się załadować zwierzaków. Spróbuj ponownie później.",
        );
        setIsLoading(false);
      }
    };
    fetchHamsters();
  }, []);

  const females = hamsters.filter(
    (h) => h.plec && h.plec.toLowerCase() === "samica",
  );
  const males = hamsters.filter(
    (h) => h.plec && h.plec.toLowerCase() === "samiec",
  );

  // --- FUNKCJE GALERII (LIGHTBOX) ---
  const openLightbox = (hamster, startIndex) => {
    const allImages = [];
    if (hamster.miniaturka) allImages.push(hamster.miniaturka);
    if (hamster.zdjecia && hamster.zdjecia.length > 0) {
      allImages.push(...hamster.zdjecia);
    }

    setLightbox({
      isOpen: true,
      images: allImages.map((img) => `${IMAGE_BASE_URL}${img}`),
      currentIndex: startIndex,
    });
  };

  const closeLightbox = () => setLightbox({ ...lightbox, isOpen: false });

  const nextImage = (e) => {
    e.stopPropagation();
    setLightbox((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length,
    }));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setLightbox((prev) => ({
      ...prev,
      currentIndex:
        (prev.currentIndex - 1 + prev.images.length) % prev.images.length,
    }));
  };

  // --- RENDEROWANIE ZWIERZAKÓW (UKŁAD EDITORIAL) ---
  const renderEditorialList = (hamsterList) => (
    <div className="hamster_editorial_list">
      {hamsterList.map((hamster) => {
        const galleryImages = hamster.zdjecia || [];

        return (
          <div className="hamster_editorial_block" key={hamster.id}>
            <div
              className="editorial_visual"
              onClick={() => openLightbox(hamster, 0)}
            >
              <div className="main_image_wrapper">
                <img
                  src={
                    hamster.miniaturka
                      ? `${IMAGE_BASE_URL}${hamster.miniaturka}`
                      : "/placeholder.jpg"
                  }
                  alt={hamster.imie}
                />
                <div className="zoom_overlay">
                  <ZoomIn size={32} />
                  <span>Powiększ zdjęcia</span>
                </div>
              </div>
            </div>

            <div className="editorial_content">
              <div className="editorial_header">
                <span className="prefix">{hamster.przydomek}</span>
                <h2>{hamster.imie}</h2>
              </div>

              <div className="editorial_badges">
                <span
                  className={`badge_gender ${hamster.plec?.toLowerCase() === "samica" ? "badge_female" : "badge_male"}`}
                >
                  {hamster.plec || "Nieznana"}
                </span>
                <span className="badge_outline">
                  {hamster.umaszczenie || "Brak danych"}
                </span>
                <span className="badge_outline badge_date">
                  <Cake size={16} className="badge_icon" />
                  {/* ZMIANA: Dynamiczne słowo Urodzona / Urodzony */}
                  {hamster.plec?.toLowerCase() === "samica"
                    ? "Urodzona: "
                    : "Urodzony: "}
                  {hamster.data_urodzenia
                    ? new Date(hamster.data_urodzenia).toLocaleDateString(
                        "pl-PL",
                      )
                    : "Brak"}
                </span>
              </div>

              {hamster.opis && <p className="editorial_desc">{hamster.opis}</p>}

              {galleryImages.length > 0 && (
                <div className="editorial_mini_gallery">
                  {galleryImages.slice(0, 4).map((img, idx) => (
                    <div
                      key={idx}
                      className="mini_gallery_item"
                      onClick={() => openLightbox(hamster, idx + 1)}
                    >
                      <img src={`${IMAGE_BASE_URL}${img}`} alt="Galeria" />
                      {idx === 3 && galleryImages.length > 4 && (
                        <div className="more_overlay">
                          +{galleryImages.length - 3}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <section className="our_hamsters_page">
        <div className="page_header">
          <h1>Nasze Chomiki</h1>
          <p>
            Poznaj maluchy oraz dorosłe osobniki, które tworzą naszą hodowlę.
            Każdy z nich ma swój unikalny charakter.
          </p>
        </div>

        <div className="page_container">
          {isLoading && <Loader />}
          {error && <ErrorState message={error} />}

          {!isLoading && !error && hamsters.length === 0 && (
            <div className="empty_state">
              Obecnie nie mamy żadnych chomików do wyświetlenia.
            </div>
          )}

          {!isLoading && !error && hamsters.length > 0 && (
            <div className="tabs_container">
              {/* --- NAWIGACJA ZAKŁADEK --- */}
              <div className="category_tabs">
                {females.length > 0 && (
                  <button
                    // DODANA KLASA: tab_female
                    className={`tab_btn tab_female ${activeTab === "samice" ? "active" : ""}`}
                    onClick={() => setActiveTab("samice")}
                  >
                    Samice
                  </button>
                )}
                {males.length > 0 && (
                  <button
                    // DODANA KLASA: tab_male
                    className={`tab_btn tab_male ${activeTab === "samiec" ? "active" : ""}`}
                    onClick={() => setActiveTab("samiec")}
                  >
                    Samce
                  </button>
                )}
              </div>

              {/* --- ZAWARTOŚĆ ZAKŁADEK --- */}
              <div className="tab_content">
                {activeTab === "samice" && renderEditorialList(females)}
                {activeTab === "samiec" && renderEditorialList(males)}
              </div>
            </div>
          )}
        </div>
      </section>

      {lightbox.isOpen && (
        <div className="lightbox_overlay" onClick={closeLightbox}>
          <button className="lightbox_close" onClick={closeLightbox}>
            <X size={32} />
          </button>

          {lightbox.images.length > 1 && (
            <button className="lightbox_nav lightbox_prev" onClick={prevImage}>
              <ChevronLeft size={40} />
            </button>
          )}

          <div
            className="lightbox_image_container"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.images[lightbox.currentIndex]}
              alt="Powiększone zdjęcie"
            />
            <div className="lightbox_counter">
              {lightbox.currentIndex + 1} / {lightbox.images.length}
            </div>
          </div>

          {lightbox.images.length > 1 && (
            <button className="lightbox_nav lightbox_next" onClick={nextImage}>
              <ChevronRight size={40} />
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default OurHamsters;
