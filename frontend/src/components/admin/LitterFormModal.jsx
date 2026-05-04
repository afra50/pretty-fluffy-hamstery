import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import ImageDropzone from "../ui/ImageDropzone";
import { hamsterApi, litterApi } from "../../utils/api";
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

const LitterFormModal = ({ isOpen, onClose, onSuccess, litterToEdit }) => {
  const [formData, setFormData] = useState({
    nazwa: "",
    status: "aktualny",
    data_urodzenia: null,
    spodziewany_termin: "",
    matka_id: null,
    ojciec_id: null,
    opis: "",
  });

  const [files, setFiles] = useState({ miniaturka: null, zdjecia: [] });
  const [previews, setPreviews] = useState({ miniaturka: [], zdjecia: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [hamsters, setHamsters] = useState({ samice: [], samce: [] });

  const statusOptions = [
    { value: "aktualny", label: "Aktualny (Obecnie w hodowli)" },
    { value: "planowany", label: "Planowany" },
    { value: "archiwum", label: "Archiwum (W nowych domach)" },
  ];

  // Pobieranie listy chomików do wyboru rodziców
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const response = await hamsterApi.getAll();
        const samice = response.data
          .filter((h) => h.plec === "samica")
          .map((h) => ({ value: h.id, label: h.imie }));
        const samce = response.data
          .filter((h) => h.plec === "samiec")
          .map((h) => ({ value: h.id, label: h.imie }));
        setHamsters({ samice, samce });
      } catch (error) {
        console.error("Błąd ładowania chomików:", error);
      }
    };
    if (isOpen) fetchParents();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    setErrors({});
    if (litterToEdit) {
      setFormData({
        nazwa: litterToEdit.nazwa || "",
        status: litterToEdit.status || "aktualny",
        data_urodzenia: litterToEdit.data_urodzenia
          ? new Date(litterToEdit.data_urodzenia)
          : null,
        spodziewany_termin: litterToEdit.spodziewany_termin || "",
        matka_id: litterToEdit.matka_id || null,
        ojciec_id: litterToEdit.ojciec_id || null,
        opis: litterToEdit.opis || "",
      });

      setPreviews({
        miniaturka: litterToEdit.miniaturka
          ? [BACKEND_URL + litterToEdit.miniaturka]
          : [],
        zdjecia: litterToEdit.zdjecia
          ? litterToEdit.zdjecia.map((path) => BACKEND_URL + path)
          : [],
      });
    } else {
      setFormData({
        nazwa: "",
        status: "aktualny",
        data_urodzenia: null,
        spodziewany_termin: "",
        matka_id: null,
        ojciec_id: null,
        opis: "",
      });
      setPreviews({ miniaturka: [], zdjecia: [] });
    }
    setFiles({ miniaturka: null, zdjecia: [] });
  }, [litterToEdit, isOpen]);

  useEffect(() => {
    return () => {
      if (previews.miniaturka[0]?.startsWith("blob:"))
        URL.revokeObjectURL(previews.miniaturka[0]);
      previews.zdjecia.forEach((url) => {
        if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

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

  const handleSelectChange = (name, selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : null,
    }));
    clearError(name);
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
      const uniqueIncomingFiles = incomingFiles.filter((incomingFile) => {
        return !previews.zdjecia.some((p) => p.includes(incomingFile.name));
      });

      const currentTotal = previews.zdjecia.length;
      const availableSlots = 15 - currentTotal; // Zwiększono limit do 15 zgodnie z backendem

      if (availableSlots <= 0) {
        toast.error("Galeria jest pełna (maksymalnie 15 zdjęć).");
        return;
      }

      if (uniqueIncomingFiles.length > availableSlots) {
        toast.error(
          `Nie można dodać zdjęć. Masz miejsce na ${availableSlots}, a wybrałeś ${uniqueIncomingFiles.length}.`,
        );
        return;
      }

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

    if (!formData.nazwa.trim()) newErrors.nazwa = true;

    // Walidacja warunkowa w zależności od statusu
    if (
      formData.status === "planowany" &&
      !formData.spodziewany_termin.trim()
    ) {
      newErrors.spodziewany_termin = true;
    }
    if (
      (formData.status === "aktualny" || formData.status === "archiwum") &&
      !formData.data_urodzenia
    ) {
      newErrors.data_urodzenia = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Uzupełnij wymagane pola zaznaczone na czerwono.");
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();

      const serverImagesLeft = previews.zdjecia
        .filter((url) => !url.startsWith("blob:"))
        .map((url) => url.replace(BACKEND_URL, ""));
      data.append("existingZdjecia", JSON.stringify(serverImagesLeft));

      Object.keys(formData).forEach((key) => {
        if (key === "data_urodzenia" && formData[key]) {
          const localDate = new Date(
            formData[key].getTime() - formData[key].getTimezoneOffset() * 60000,
          )
            .toISOString()
            .split("T")[0];
          data.append(key, localDate);
        } else if (formData[key] !== null) {
          data.append(
            key,
            typeof formData[key] === "string"
              ? formData[key].trim()
              : formData[key],
          );
        }
      });

      if (files.miniaturka) data.append("miniaturka", files.miniaturka);
      files.zdjecia.forEach((file) => data.append("zdjecia", file));

      if (litterToEdit) {
        await litterApi.update(litterToEdit.id, data);
        toast.success("Zapisano zmiany miotu!");
      } else {
        await litterApi.create(data);
        toast.success("Dodano nowy miot!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Błąd zapisu.");
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
      title={litterToEdit ? "Edytuj miot" : "Dodaj nowy miot"}
      subtitle={
        litterToEdit
          ? "Zaktualizuj informacje"
          : "Wypełnij dane i wgraj zdjęcia"
      }
    >
      <form className="form-modal" onSubmit={handleSubmit} noValidate>
        <div className="form-modal__grid">
          <div className="form-group form-group--full">
            <label className="form-group__label">Nazwa Miotu *</label>
            <input
              type="text"
              name="nazwa"
              className={`form-group__input ${errors.nazwa ? "has-error" : ""}`}
              value={formData.nazwa}
              onChange={handleChange}
              disabled={isLoading}
              maxLength={100}
              placeholder="Np. Miot A - Wiosna 2024"
            />
          </div>

          <div className="form-group form-group--full">
            <label className="form-group__label">Status Miotu *</label>
            <Select
              options={statusOptions}
              value={statusOptions.find((opt) => opt.value === formData.status)}
              onChange={(opt) => handleSelectChange("status", opt)}
              isDisabled={isLoading}
              isSearchable={false}
              classNamePrefix="react-select"
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">Matka (opcjonalnie)</label>
            <Select
              options={hamsters.samice}
              value={hamsters.samice.find(
                (opt) => opt.value === formData.matka_id,
              )}
              onChange={(opt) => handleSelectChange("matka_id", opt)}
              isDisabled={isLoading}
              isClearable
              placeholder="Wybierz samicę..."
              classNamePrefix="react-select"
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">Ojciec (opcjonalnie)</label>
            <Select
              options={hamsters.samce}
              value={hamsters.samce.find(
                (opt) => opt.value === formData.ojciec_id,
              )}
              onChange={(opt) => handleSelectChange("ojciec_id", opt)}
              isDisabled={isLoading}
              isClearable
              placeholder="Wybierz samca..."
              classNamePrefix="react-select"
            />
          </div>

          {/* Pola zależne od statusu */}
          {formData.status === "planowany" ? (
            <div className="form-group form-group--full">
              <label className="form-group__label">Spodziewany termin *</label>
              <input
                type="text"
                name="spodziewany_termin"
                className={`form-group__input ${errors.spodziewany_termin ? "has-error" : ""}`}
                value={formData.spodziewany_termin}
                onChange={handleChange}
                disabled={isLoading}
                maxLength={100}
                placeholder="Np. Jesień 2025"
              />
            </div>
          ) : (
            <div className="form-group form-group--full">
              <label className="form-group__label">Data urodzenia *</label>
              <DatePicker
                selected={formData.data_urodzenia}
                onChange={handleDateChange}
                locale="pl"
                dateFormat="dd.MM.yyyy"
                disabled={isLoading}
                customInput={
                  <CustomDateInput hasError={errors.data_urodzenia} />
                }
                maxDate={new Date()}
              />
            </div>
          )}

          <div className="form-group form-group--full">
            <label className="form-group__label">Krótki opis</label>
            <textarea
              name="opis"
              className="form-group__input textarea-styled"
              value={formData.opis}
              onChange={handleChange}
              disabled={isLoading}
              maxLength={2000}
              rows="4"
              placeholder="Opisz miot, umaszczenia, charaktery..."
            ></textarea>
          </div>

          <ImageDropzone
            name="miniaturka"
            label={
              formData.status === "planowany"
                ? "Zdjęcie poglądowe (Opcjonalnie)"
                : "Miniaturka (Zdjęcie Główne)"
            }
            disabled={isLoading}
            previews={previews.miniaturka}
            onFileChange={handleFileChange}
            fullWidth={false}
          />

          <ImageDropzone
            name="zdjecia"
            label={`Galeria zdjęć (${previews.zdjecia.length}/15)`}
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
            {litterToEdit ? "Zapisz zmiany" : "Dodaj miot"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LitterFormModal;
