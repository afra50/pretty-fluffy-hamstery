import React, { useState } from "react";
import { Plus, Edit, Trash2, Info } from "lucide-react";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/ui/ConfirmDialog"; // Import Twojego okienka!
import "../../styles/pages/admin/admin-hamsters.scss";

// Importy Twoich lokalnych zdjęć z folderu assets
import hamster1 from "../../assets/hamsters/1.jpg";
import hamster2 from "../../assets/hamsters/2.jpg";
import hamster3 from "../../assets/hamsters/3.jpg";
import hamster4 from "../../assets/hamsters/4.jpg";

// --- MOCK DATA ---
const mockHamsters = [
  {
    id: 1,
    imie: "Puszek",
    przydomek: "z Doliny Mgieł",
    plec: "samiec",
    umaszczenie: "Standard (Agouti)",
    data_urodzenia: "2023-05-12",
    opis: "Bardzo spokojny i łagodny chomik. Uwielbia pestki dyni i drzemki w swoim wielkim drewnianym domku.",
    miniaturka: hamster1, // Używamy zaimportowanego obrazka
    zdjecia: ["url1", "url2"],
    created_at: "2023-06-01",
    updated_at: "2023-06-01",
  },
  {
    id: 2,
    imie: "Kulka",
    przydomek: "Fluffy Dream",
    plec: "samica",
    umaszczenie: "Pearl",
    data_urodzenia: "2024-01-20",
    opis: "Energiczna samiczka, potrafi biegać w kołowrotku całą noc. Bardzo ciekawska, zawsze pierwsza przy drzwiczkach terrarium. Lubi biegać na wybiegu.",
    miniaturka: hamster2,
    zdjecia: [],
    created_at: "2024-02-15",
    updated_at: "2024-02-15",
  },
  {
    id: 3,
    imie: "Bandzior",
    przydomek: "Pretty Fluffy",
    plec: "samiec",
    umaszczenie: "Sapphire",
    data_urodzenia: "2024-03-05",
    opis: "", // Brak opisu
    miniaturka: hamster3,
    zdjecia: [],
    created_at: "2024-03-10",
    updated_at: "2024-03-10",
  },
  {
    id: 4,
    imie: "Arielka",
    przydomek: "z Kryształowej Polany",
    plec: "samica",
    umaszczenie: "Mandarina",
    data_urodzenia: "2023-11-18",
    opis: "Prawdziwa księżniczka. Bardzo lubi kopać głębokie tunele w ściółce bawełnianej. Uwielbia suszone zioła z płatkami nagietka, ale gardzi suszonym mniszkiem.",
    miniaturka: hamster4,
    zdjecia: [],
    created_at: "2024-01-05",
    updated_at: "2024-01-05",
  },
];

const AdminHamsters = () => {
  const [hamsters, setHamsters] = useState(mockHamsters);

  // Stan dla ConfirmDialog
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    imie: "",
  });

  const handleAddClick = () => {
    toast("Otwieram formularz dodawania chomika!", {
      icon: "🐹",
    });
  };

  const handleEditClick = (imie) => {
    toast.success(`Edycja profilu: ${imie}`);
  };

  // Zamiast kasować od razu, otwieramy dialog
  const initiateDelete = (id, imie) => {
    setDeleteModal({ isOpen: true, id, imie });
  };

  // Wykonanie usunięcia po potwierdzeniu w dialogu
  const confirmDelete = () => {
    setHamsters(hamsters.filter((h) => h.id !== deleteModal.id));
    toast.success(`${deleteModal.imie} został pomyślnie usunięty.`);

    // Zamykamy dialog
    setDeleteModal({ isOpen: false, id: null, imie: "" });
  };

  const closeDeleteDialog = () => {
    setDeleteModal({ isOpen: false, id: null, imie: "" });
  };

  return (
    <div className="admin-hamsters">
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

      <div className="hamsters-grid">
        {hamsters.length === 0 ? (
          <div className="empty-state">
            <Info size={40} />
            <p>Brak chomików w bazie. Dodaj pierwszego!</p>
          </div>
        ) : (
          hamsters.map((hamster) => (
            <div key={hamster.id} className="hamster-card">
              <div className="hamster-card__image">
                <img src={hamster.miniaturka} alt={hamster.imie} />
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
                    <strong>Umaszczenie:</strong> {hamster.umaszczenie}
                  </li>
                  <li>
                    <strong>Data ur.:</strong> {hamster.data_urodzenia}
                  </li>
                </ul>

                <div className="description-container">
                  {hamster.opis ? (
                    // Brak ucinania tekstu
                    <p className="description">{hamster.opis}</p>
                  ) : (
                    <p className="description empty">Brak opisu.</p>
                  )}
                </div>

                <div className="card-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditClick(hamster.imie)}
                  >
                    <Edit size={16} /> Edytuj
                  </button>
                  <button
                    className="btn-delete"
                    // Wywołanie okienka zamiast systemowego alertu
                    onClick={() => initiateDelete(hamster.id, hamster.imie)}
                  >
                    <Trash2 size={16} /> Usuń
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Wyświetlanie naszego okna dialogowego */}
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        title="Usuwanie chomika"
        message={`Czy na pewno chcesz na zawsze usunąć profil chomika ${deleteModal.imie}? Tej operacji nie można cofnąć.`}
        confirmText="Usuń profil"
        cancelText="Anuluj"
        onConfirm={confirmDelete}
        onCancel={closeDeleteDialog}
      />
    </div>
  );
};

export default AdminHamsters;
