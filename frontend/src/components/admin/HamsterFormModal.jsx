import React, { useState, useEffect } from "react";
import { UploadCloud } from "lucide-react";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import { hamsterApi } from "../../utils/api";
import "../../styles/forms.scss";

const HamsterFormModal = ({ isOpen, onClose, onSuccess, hamsterToEdit }) => {
  const [formData, setFormData] = useState({
    imie: "",
    przydomek: "",
    plec: "samiec",
    umaszczenie: "",
    data_urodzenia: "",
    opis: "",
  });

  const [files, setFiles] = useState({ miniaturka: null, zdjecia: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (hamsterToEdit) {
      setFormData({
        imie: hamsterToEdit.imie || "",
        przydomek: hamsterToEdit.przydomek || "",
        plec: hamsterToEdit.plec || "samiec",
        umaszczenie: hamsterToEdit.umaszczenie || "",
        data_urodzenia: hamsterToEdit.data_urodzenia
          ? hamsterToEdit.data_urodzenia.substring(0, 10)
          : "",
        opis: hamsterToEdit.opis || "",
      });
    } else {
      setFormData({
        imie: "",
        przydomek: "",
        plec: "samiec",
        umaszczenie: "",
        data_urodzenia: "",
        opis: "",
      });
    }
    setFiles({ miniaturka: null, zdjecia: [] });
  }, [hamsterToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (name === "miniaturka")
      setFiles((prev) => ({ ...prev, miniaturka: selectedFiles[0] }));
    else if (name === "zdjecia")
      setFiles((prev) => ({ ...prev, zdjecia: Array.from(selectedFiles) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });
      if (files.miniaturka) data.append("miniaturka", files.miniaturka);
      if (files.zdjecia.length > 0)
        files.zdjecia.forEach((file) => data.append("zdjecia", file));

      if (hamsterToEdit) {
        await hamsterApi.update(hamsterToEdit.id, data);
        toast.success("Profil chomika został zaktualizowany!");
      } else {
        await hamsterApi.create(data);
        toast.success("Nowy chomik został dodany do hodowli!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error || "Wystąpił błąd podczas zapisywania.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={hamsterToEdit ? "Edytuj profil chomika" : "Dodaj nowego chomika"}
      subtitle={
        hamsterToEdit
          ? "Zaktualizuj dane, wymień zdjęcia."
          : "Wprowadź dane i wgraj zdjęcia."
      }
    >
      <form className="modal-form-content" onSubmit={handleSubmit}>
        <div
          style={{
            padding: "30px 40px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 20px",
          }}
        >
          <div className="form-group">
            <label className="form-group__label">Imię domowe *</label>
            <input
              type="text"
              name="imie"
              className="form-group__input"
              value={formData.imie}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Np. Puszek"
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">Przydomek hodowlany</label>
            <input
              type="text"
              name="przydomek"
              className="form-group__input"
              value={formData.przydomek}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Np. Pretty Fluffy"
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">Płeć *</label>
            <select
              name="plec"
              className="form-group__input"
              value={formData.plec}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              <option value="samiec">Samiec ♂</option>
              <option value="samica">Samica ♀</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-group__label">Data urodzenia</label>
            <input
              type="date"
              name="data_urodzenia"
              className="form-group__input"
              value={formData.data_urodzenia}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-group__label">Umaszczenie</label>
            <input
              type="text"
              name="umaszczenie"
              className="form-group__input"
              value={formData.umaszczenie}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Np. Standard (Agouti)"
            />
          </div>

          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-group__label">Krótki opis</label>
            <textarea
              name="opis"
              className="form-group__input"
              value={formData.opis}
              onChange={handleChange}
              disabled={isLoading}
              rows="3"
              style={{ resize: "vertical", minHeight: "100px" }}
            ></textarea>
          </div>

          {/* NOWE STYLE DLA PRZYCISKÓW WGRYWANIA */}
          <div className="form-group file-group">
            <label className="form-group__label">Miniaturka</label>
            <input
              type="file"
              name="miniaturka"
              id="miniaturka"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isLoading}
            />
            <label htmlFor="miniaturka" className="file-label">
              <UploadCloud size={20} />{" "}
              {files.miniaturka ? files.miniaturka.name : "Wybierz plik..."}
            </label>
          </div>

          <div className="form-group file-group">
            <label className="form-group__label">Galeria zdjęć</label>
            <input
              type="file"
              name="zdjecia"
              id="zdjecia"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={isLoading}
            />
            <label htmlFor="zdjecia" className="file-label">
              <UploadCloud size={20} />{" "}
              {files.zdjecia.length > 0
                ? `Wybrano plików: ${files.zdjecia.length}`
                : "Wybierz pliki..."}
            </label>
          </div>
        </div>

        <div
          style={{
            padding: "20px 40px 30px",
            borderTop: "1px solid rgba(183, 221, 224, 0.3)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "15px",
          }}
        >
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            type="button"
          >
            Anuluj
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            {hamsterToEdit ? "Zapisz zmiany" : "Dodaj chomika"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default HamsterFormModal;
