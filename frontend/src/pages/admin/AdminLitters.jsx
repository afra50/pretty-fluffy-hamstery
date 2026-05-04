import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Heart,
  CalendarClock,
  Archive,
  Info,
} from "lucide-react";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import LitterFormModal from "../../components/admin/LitterFormModal"; // Zwróć uwagę na import
import { litterApi } from "../../utils/api";
import Loader from "../../components/ui/Loader";
import ErrorState from "../../components/ui/ErrorState";
import "../../styles/pages/admin/admin-litters.scss";

const BACKEND_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "http://localhost:5000";

const AdminLitters = () => {
  const [litters, setLitters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState("aktualny"); // 'aktualny', 'planowany', 'archiwum'

  // Stany Modali
  const [formModal, setFormModal] = useState({ isOpen: false, litter: null });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    nazwa: "",
    isDeleting: false,
  });

  // Pobieranie danych
  useEffect(() => {
    fetchLitters();
  }, []);

  const fetchLitters = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await litterApi.getAll();
      setLitters(response.data);
    } catch (error) {
      console.error("Błąd podczas pobierania miotów:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Akcje
  const handleAddClick = () => setFormModal({ isOpen: true, litter: null });
  const handleEditClick = (litter) =>
    setFormModal({ isOpen: true, litter: litter });
  const initiateDelete = (id, nazwa) =>
    setDeleteModal({ isOpen: true, id, nazwa, isDeleting: false });

  const confirmDelete = async () => {
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      await litterApi.delete(deleteModal.id);
      setLitters(litters.filter((l) => l.id !== deleteModal.id));
      toast.success(`${deleteModal.nazwa} został usunięty.`);
      setDeleteModal({ isOpen: false, id: null, nazwa: "", isDeleting: false });
    } catch (error) {
      toast.error("Błąd podczas usuwania.");
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const closeDeleteDialog = () => {
    if (!deleteModal.isDeleting) {
      setDeleteModal({ isOpen: false, id: null, nazwa: "", isDeleting: false });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Brak danych";
    return dateString.substring(0, 10);
  };

  const truncateText = (text, maxLength = 110) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength).trim() + "..."
      : text;
  };

  // --- Renderowanie zawartości w zależności od stanu i zakładki ---
  const renderContent = () => {
    if (isLoading) return <Loader message="Pobieranie miotów..." />;
    if (isError)
      return (
        <ErrorState
          title="Błąd"
          message="Nie udało się załadować listy miotów."
          onRetry={fetchLitters}
        />
      );

    // Filtrowanie danych wg aktualnej zakładki
    const filteredLitters = litters.filter((l) => l.status === activeTab);

    if (filteredLitters.length === 0) {
      return (
        <div className="empty-state">
          <Info size={40} />
          <p>Brak miotów w tej kategorii. Dodaj nowy!</p>
        </div>
      );
    }

    return (
      <div className="litters-grid">
        {filteredLitters.map((miot) => (
          <div key={miot.id} className="litter-card">
            {/* ZDJĘCIE LUB NAGŁÓWEK DLA PLANOWANYCH */}
            {(activeTab === "aktualny" || activeTab === "archiwum") && (
              <div className="litter-card__image">
                {miot.miniaturka ? (
                  <img
                    src={`${BACKEND_URL}${miot.miniaturka}`}
                    alt={miot.nazwa}
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
                <span className={`status-badge ${activeTab}`}>
                  {activeTab === "aktualny"
                    ? "Obecnie w hodowli"
                    : "W nowych domach"}
                </span>
              </div>
            )}

            {activeTab === "planowany" && (
              <div className="litter-card__planned-header">
                {/* MATKA */}
                <div className="parent-circle">
                  {miot.matka_miniaturka ? (
                    <div className="avatar">
                      <img
                        src={`${BACKEND_URL}${miot.matka_miniaturka}`}
                        alt={miot.matka_imie}
                      />
                    </div>
                  ) : (
                    <div className="avatar fallback-mom">♀</div>
                  )}
                  <span className="name-label mom">
                    {miot.matka_imie || "Nieznana"}
                  </span>
                </div>

                {/* SERDUSZKO */}
                <div className="heart-icon">
                  <Heart size={24} fill="#fd79a8" color="#fd79a8" />
                </div>

                {/* OJCIEC */}
                <div className="parent-circle">
                  {miot.ojciec_miniaturka ? (
                    <div className="avatar">
                      <img
                        src={`${BACKEND_URL}${miot.ojciec_miniaturka}`}
                        alt={miot.ojciec_imie}
                      />
                    </div>
                  ) : (
                    <div className="avatar fallback-dad">♂</div>
                  )}
                  <span className="name-label dad">
                    {miot.ojciec_imie || "Nieznany"}
                  </span>
                </div>
              </div>
            )}

            <div className="litter-card__content">
              <div className="name-wrapper">
                <h3 className="name">{miot.nazwa}</h3>
              </div>

              <ul className="details">
                {activeTab === "planowany" ? (
                  <li>
                    <strong>Spodziewany termin:</strong>{" "}
                    {miot.spodziewany_termin || "Brak danych"}
                  </li>
                ) : (
                  <>
                    <li>
                      <strong>Data ur.:</strong>{" "}
                      {formatDate(miot.data_urodzenia)}
                    </li>
                    <li>
                      <strong>Rodzice:</strong> ♀ {miot.matka_imie || "?"} x ♂{" "}
                      {miot.ojciec_imie || "?"}
                    </li>
                  </>
                )}
              </ul>

              <div className="description-container">
                {miot.opis ? (
                  <p className="description" title={miot.opis}>
                    {truncateText(miot.opis, 110)}
                  </p>
                ) : (
                  <p className="description empty">Brak opisu.</p>
                )}
              </div>

              <div className="card-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEditClick(miot)}
                >
                  <Edit size={16} /> Edytuj
                </button>
                <button
                  className="btn-delete"
                  onClick={() => initiateDelete(miot.id, miot.nazwa)}
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
    <div className="admin-litters">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-title">Zarządzanie Miotami</h1>
          <p className="admin-desc">
            Aktualne maluchy, planowane łączenia i historia.
          </p>
        </div>
        <Button onClick={handleAddClick} variant="primary" className="add-btn">
          <Plus size={20} /> Dodaj miot
        </Button>
      </div>

      <div className="litters-tabs">
        <button
          className={`tab-btn ${activeTab === "aktualny" ? "active" : ""}`}
          onClick={() => setActiveTab("aktualny")}
        >
          <Heart size={18} /> Aktualne
        </button>
        <button
          className={`tab-btn ${activeTab === "planowany" ? "active" : ""}`}
          onClick={() => setActiveTab("planowany")}
        >
          <CalendarClock size={18} /> Planowane
        </button>
        <button
          className={`tab-btn ${activeTab === "archiwum" ? "active" : ""}`}
          onClick={() => setActiveTab("archiwum")}
        >
          <Archive size={18} /> Archiwum
        </button>
      </div>

      {renderContent()}

      <LitterFormModal
        isOpen={formModal.isOpen}
        onClose={() => setFormModal({ isOpen: false, litter: null })}
        onSuccess={fetchLitters}
        litterToEdit={formModal.litter}
      />

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        title="Usuwanie miotu"
        message={`Czy na pewno chcesz usunąć profil ${deleteModal.nazwa}? Tej operacji nie można cofnąć.`}
        confirmText="Usuń profil"
        cancelText="Anuluj"
        onConfirm={confirmDelete}
        onCancel={closeDeleteDialog}
        isLoading={deleteModal.isDeleting}
      />
    </div>
  );
};

export default AdminLitters;
