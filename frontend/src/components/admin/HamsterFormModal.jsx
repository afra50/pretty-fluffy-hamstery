import React, { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import ImageDropzone from "../ui/ImageDropzone";
import { hamsterApi } from "../../utils/api";

import Select from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import { pl } from "date-fns/locale/pl";
import "react-datepicker/dist/react-datepicker.css";

import "../../styles/forms.scss";
import "../../styles/components/admin/form-modal.scss";

registerLocale("pl", pl);

const BACKEND_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "http://localhost:5000";

const HamsterFormModal = ({ isOpen, onClose, onSuccess, hamsterToEdit }) => {
  const [formData, setFormData] = useState({
    imie: "",
    przydomek: "",
    plec: "samiec",
    umaszczenie: "",
    data_urodzenia: null,
    opis: "",
  });

  const [files, setFiles] = useState({ miniaturka: null, zdjecia: [] });
  const [previews, setPreviews] = useState({ miniaturka: [], zdjecia: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const genderOptions = [
    { value: "samiec", label: "Samiec ♂" },
    { value: "samica", label: "Samica ♀" },
  ];

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    setErrors({});
    if (hamsterToEdit) {
      setFormData({
        imie: hamsterToEdit.imie || "",
        przydomek: hamsterToEdit.przydomek || "",
        plec: hamsterToEdit.plec || "samiec",
        umaszczenie: hamsterToEdit.umaszczenie || "",
        data_urodzenia: hamsterToEdit.data_urodzenia
          ? new Date(hamsterToEdit.data_urodzenia)
          : null,
        opis: hamsterToEdit.opis || "",
      });

      setPreviews({
        miniaturka: hamsterToEdit.miniaturka
          ? [BACKEND_URL + hamsterToEdit.miniaturka]
          : [],
        zdjecia: hamsterToEdit.zdjecia
          ? hamsterToEdit.zdjecia.map((path) => BACKEND_URL + path)
          : [],
      });
    } else {
      setFormData({
        imie: "",
        przydomek: "",
        plec: "samiec",
        umaszczenie: "",
        data_urodzenia: null,
        opis: "",
      });
      setPreviews({ miniaturka: [], zdjecia: [] });
    }
    setFiles({ miniaturka: null, zdjecia: [] });
  }, [hamsterToEdit, isOpen]);

  const clearError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, plec: selectedOption.value }));
    clearError("plec");
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, data_urodzenia: date }));
    clearError("data_urodzenia");
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (!fileList || fileList.length === 0) return;

    if (name === "miniaturka") {
      const file = fileList[0];
      setFiles((prev) => ({ ...prev, miniaturka: file }));
      setPreviews((prev) => ({
        ...prev,
        miniaturka: [URL.createObjectURL(file)],
      }));
    } else if (name === "zdjecia") {
      const incomingFiles = Array.from(fileList);

      // Filtracja duplikatów
      const uniqueIncomingFiles = incomingFiles.filter((incomingFile) => {
        return !previews.zdjecia.some((p) => p.includes(incomingFile.name));
      });

      const currentTotal = previews.zdjecia.length;
      const availableSlots = 10 - currentTotal;

      if (availableSlots <= 0) {
        toast.error("Galeria jest pełna (maksymalnie 10 zdjęć).");
        e.target.value = null; // WAŻNE: Reset wejścia przed wczesnym wyjściem
        return;
      }

      // --- ZMIANA: Jeśli wybór jest za duży, nie dodajemy nic ---
      if (uniqueIncomingFiles.length > availableSlots) {
        toast.error(
          `Nie można dodać zdjęć. Masz miejsce na ${availableSlots}, a wybrałeś ${uniqueIncomingFiles.length}.`,
        );
        e.target.value = null; // WAŻNE: Reset wejścia przed wczesnym wyjściem
        return;
      }

      // Jeśli wszystko się mieści, dodajemy cały zestaw
      setFiles((prev) => ({
        ...prev,
        zdjecia: [...prev.zdjecia, ...uniqueIncomingFiles],
      }));
      const newUrls = uniqueIncomingFiles.map((f) => URL.createObjectURL(f));
      setPreviews((prev) => ({
        ...prev,
        zdjecia: [...prev.zdjecia, ...newUrls],
      }));
    }
  };

  const removeGalleryImage = (index) => {
    const urlToRemove = previews.zdjecia[index];

    setPreviews((prev) => ({
      ...prev,
      zdjecia: prev.zdjecia.filter((_, i) => i !== index),
    }));

    // Jeśli to był nowy plik (blob), usuwamy go też z tablicy files
    if (urlToRemove.startsWith("blob:")) {
      setFiles((prev) => ({
        ...prev,
        zdjecia: prev.zdjecia.filter((_, i) => {
          const blobUrl = previews.zdjecia.filter((u) => u.startsWith("blob:"))[
            i
          ];
          return previews.zdjecia[index] !== blobUrl;
        }),
      }));
      URL.revokeObjectURL(urlToRemove);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.imie.trim()) newErrors.imie = true;
    if (!formData.plec) newErrors.plec = true;
    if (!formData.data_urodzenia) newErrors.data_urodzenia = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Uzupełnij wymagane pola.");
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();

      // Filtrujemy podglądy, aby wyciągnąć tylko te zdjęcia, które już są na serwerze
      // (czyli nie zaczynają się od "blob:")
      const serverImagesLeft = previews.zdjecia
        .filter((url) => !url.startsWith("blob:"))
        .map((url) => url.replace(BACKEND_URL, "")); // Wysyłamy samą ścieżkę, np. /uploads/img...

      // Dodajemy tę listę do FormData
      data.append("existingZdjecia", JSON.stringify(serverImagesLeft));

      Object.keys(formData).forEach((key) => {
        if (key === "data_urodzenia" && formData[key]) {
          const localDate = new Date(
            formData[key].getTime() - formData[key].getTimezoneOffset() * 60000,
          )
            .toISOString()
            .split("T")[0];
          data.append(key, localDate);
        } else if (formData[key]) {
          data.append(key, formData[key].trim());
        }
      });

      // Miniaturka: wysyłamy tylko jeśli jest nowa (w files.miniaturka)
      if (files.miniaturka) data.append("miniaturka", files.miniaturka);

      // Nowe zdjęcia z galerii
      files.zdjecia.forEach((file) => data.append("zdjecia", file));

      if (hamsterToEdit) {
        await hamsterApi.update(hamsterToEdit.id, data);
        toast.success("Zapisano zmiany!");
      } else {
        await hamsterApi.create(data);
        toast.success("Dodano nowego chomika!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Błąd zapisu.");
    } finally {
      setIsLoading(false);
    }
  };

  const CustomDateInput = React.forwardRef(
    ({ value, onClick, hasError }, ref) => (
      <div className="date-wrapper" onClick={onClick}>
        <input
          className={`form-group__input ${hasError ? "has-error" : ""}`}
          value={value}
          readOnly
          ref={ref}
          placeholder="Wybierz datę"
          disabled={isLoading}
          style={{ width: "100%", cursor: "pointer" }}
        />
        <Calendar size={18} className="date-icon-trigger" />
      </div>
    ),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={hamsterToEdit ? "Edytuj chomika" : "Dodaj chomika"}
      subtitle={
        hamsterToEdit ? "Zaktualizuj profil" : "Wypełnij dane i wgraj zdjęcia"
      }
    >
      <form className="form-modal" onSubmit={handleSubmit} noValidate>
        <div className="form-modal__grid">
          <div className="form-group">
            <label className="form-group__label">Imię domowe *</label>
            <input
              type="text"
              name="imie"
              className={`form-group__input ${errors.imie ? "has-error" : ""}`}
              value={formData.imie}
              onChange={handleChange}
              disabled={isLoading}
              maxLength={50}
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
              maxLength={100}
              placeholder="Np. Pretty Fluffy"
            />
          </div>
          <div className="form-group">
            <label className="form-group__label">Płeć *</label>
            <Select
              options={genderOptions}
              value={genderOptions.find((opt) => opt.value === formData.plec)}
              onChange={handleSelectChange}
              isDisabled={isLoading}
              isSearchable={false}
              classNamePrefix="react-select"
              className={errors.plec ? "has-error" : ""}
              placeholder="Wybierz płeć..."
            />
          </div>
          <div className="form-group">
            <label className="form-group__label">Data urodzenia *</label>
            <DatePicker
              selected={formData.data_urodzenia}
              onChange={handleDateChange}
              locale="pl"
              dateFormat="dd.MM.yyyy"
              dateFormatCalendar="LLLL"
              disabled={isLoading}
              customInput={<CustomDateInput hasError={errors.data_urodzenia} />}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={20}
              maxDate={new Date()}
            />
          </div>
          <div className="form-group form-group--full">
            <label className="form-group__label">Umaszczenie</label>
            <input
              type="text"
              name="umaszczenie"
              className="form-group__input"
              value={formData.umaszczenie}
              onChange={handleChange}
              disabled={isLoading}
              maxLength={100}
              placeholder="Np. Standard (Agouti)"
            />
          </div>
          <div className="form-group form-group--full">
            <label className="form-group__label">Krótki opis</label>
            <textarea
              name="opis"
              className="form-group__input textarea-styled"
              value={formData.opis}
              onChange={handleChange}
              disabled={isLoading}
              maxLength={500}
              rows="3"
              placeholder="Opowiedz coś o tym maluchu..."
            ></textarea>
          </div>
          <ImageDropzone
            name="miniaturka"
            label="Miniaturka (Zdjęcie Główne)"
            disabled={isLoading}
            previews={previews.miniaturka}
            onFileChange={handleFileChange}
            fullWidth={false}
          />

          {/* ZMIANA: previews.zdjecia.length zamiast files.zdjecia.length */}
          <ImageDropzone
            name="zdjecia"
            label={`Galeria zdjęć (${previews.zdjecia.length}/10)`}
            multiple={true}
            disabled={isLoading}
            previews={previews.zdjecia}
            onFileChange={handleFileChange}
            onRemoveImage={removeGalleryImage}
          />
        </div>
        <div className="form-modal__actions">
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
