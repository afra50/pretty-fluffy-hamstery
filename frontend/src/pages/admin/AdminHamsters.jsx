import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Info, Loader2 } from "lucide-react";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import HamsterFormModal from "../../components/admin/HamsterFormModal";
import { hamsterApi } from "../../utils/api";
import Loader from "../../components/ui/Loader";
import ErrorState from "../../components/ui/ErrorState";
import "../../styles/pages/admin/admin-hamsters.scss";

// Adres backendu potrzebny, by przeglądarka wiedziała, skąd załadować wygenerowane pliki .webp
const BACKEND_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "http://localhost:5000";

const AdminHamsters = () => {
  const [hamsters, setHamsters] = useState([]);

  // Stany odpowiadające za cykl życia danych
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [formModal, setFormModal] = useState({ isOpen: false, hamster: null });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    imie: "",
    isDeleting: false,
  });

  // --- POBIERANIE Z BAZY DANYCH ---
  useEffect(() => {
    fetchHamsters();
  }, []);

  const fetchHamsters = async () => {
    setIsLoading(true);
    setIsError(false); // Resetujemy błąd przy ponownej próbie

    try {
      const response = await hamsterApi.getAll();
      setHamsters(response.data);
    } catch (error) {
      console.error(error);
      setIsError(true); // Ustawiamy błąd w razie porażki API
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setFormModal({ isOpen: true, hamster: null });
  };

  const handleEditClick = (hamster) => {
    setFormModal({ isOpen: true, hamster: hamster });
  };

  const initiateDelete = (id, imie) => {
    setDeleteModal({ isOpen: true, id, imie, isDeleting: false });
  };

  // --- USUWANIE Z BAZY DANYCH ---
  const confirmDelete = async () => {
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      await hamsterApi.delete(deleteModal.id);
      setHamsters(hamsters.filter((h) => h.id !== deleteModal.id));
      toast.success(`${deleteModal.imie} został usunięty.`);
      setDeleteModal({ isOpen: false, id: null, imie: "", isDeleting: false });
    } catch (error) {
      console.error(error);
      toast.error("Wystąpił błąd podczas usuwania z bazy.");
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const closeDeleteDialog = () => {
    if (!deleteModal.isDeleting) {
      setDeleteModal({ isOpen: false, id: null, imie: "", isDeleting: false });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Brak danych";
    return dateString.substring(0, 10);
  };

  // ZMIANA: Zamiast "wczesnego powrotu" na wypadek błędu,
  // definiujemy funkcję renderującą tylko część pod nagłówkiem.
  const renderContent = () => {
    if (isLoading) {
      return <Loader message="Pobieranie chomików z bazy danych..." />;
    }

    if (isError) {
      return (
        <ErrorState
          title="Błąd serwera"
          message="Nie udało się załadować listy chomików z bazy danych. Sprawdź połączenie z internetem lub spróbuj ponownie."
          onRetry={fetchHamsters}
        />
      );
    }

    if (hamsters.length === 0) {
      return (
        <div className="empty-state">
          <Info size={40} />
          <p>Brak chomików w bazie. Dodaj pierwszego!</p>
        </div>
      );
    }

    return (
      <div className="hamsters-grid">
        {hamsters.map((hamster) => (
          <div key={hamster.id} className="hamster-card">
            <div className="hamster-card__image">
              {hamster.miniaturka ? (
                <img
                  src={`${BACKEND_URL}${hamster.miniaturka}`}
                  alt={hamster.imie}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#e2e8f0",
                    color: "#64748b",
                  }}
                >
                  Brak zdjęcia
                </div>
              )}

              <span className={`gender-badge ${hamster.plec}`}>
                {hamster.plec === "samiec" ? "♂ Samiec" : "♀ Samica"}
              </span>
            </div>

            <div className="hamster-card__content">
              <div className="name-wrapper">
                <h3 className="name">{hamster.imie}</h3>
                {hamster.przydomek && (
                  <span className="nickname">{hamster.przydomek}</span>
                )}
              </div>

              <ul className="details">
                <li>
                  <strong>Umaszczenie:</strong> {hamster.umaszczenie || "-"}
                </li>
                <li>
                  <strong>Data ur.:</strong>{" "}
                  {formatDate(hamster.data_urodzenia)}
                </li>
              </ul>

              <div className="description-container">
                {hamster.opis ? (
                  <p className="description">{hamster.opis}</p>
                ) : (
                  <p className="description empty">Brak opisu.</p>
                )}
              </div>

              <div className="card-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEditClick(hamster)}
                >
                  <Edit size={16} /> Edytuj
                </button>
                <button
                  className="btn-delete"
                  onClick={() => initiateDelete(hamster.id, hamster.imie)}
                >
                  <Trash2 size={16} /> Usuń
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="admin-hamsters">
      {/* 1. Niezmienny nagłówek na górze */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-title">Nasze Chomiki</h1>
          <p className="admin-desc">
            Zarządzaj danymi dorosłych osobników w hodowli.
          </p>
        </div>
        <Button onClick={handleAddClick} variant="primary" className="add-btn">
          <Plus size={20} /> Dodaj chomika
        </Button>
      </div>

      {/* 2. Zmienna zawartość (Loader LUB Błąd LUB Kafelki LUB Brak danych) */}
      {renderContent()}

      {/* 3. Niewidoczne Modale (wyświetlane tylko po kliknięciu w stanach) */}
      <HamsterFormModal
        isOpen={formModal.isOpen}
        onClose={() => setFormModal({ isOpen: false, hamster: null })}
        onSuccess={fetchHamsters}
        hamsterToEdit={formModal.hamster}
      />

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        title="Usuwanie chomika"
        message={`Czy na pewno chcesz na zawsze usunąć profil chomika ${deleteModal.imie}? Tej operacji nie można cofnąć.`}
        confirmText="Usuń profil"
        cancelText="Anuluj"
        onConfirm={confirmDelete}
        onCancel={closeDeleteDialog}
        isLoading={deleteModal.isDeleting}
      />
    </div>
  );
};

export default AdminHamsters;
