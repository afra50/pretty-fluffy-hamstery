import React from "react";
import { UploadCloud, X } from "lucide-react";
import "../../styles/forms.scss";

const ImageDropzone = ({
  name,
  label,
  accept = "image/*",
  multiple = false,
  disabled = false,
  previews = [],
  onFileChange,
  onRemoveImage,
  fullWidth = true,
}) => {
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    onFileChange({ target: { name, files: e.dataTransfer.files } });
  };

  // --- ZMIANA: Przechwytywanie zdarzenia i resetowanie inputa ---
  const handleInternalChange = (e) => {
    if (disabled) return;

    // Przekazujemy zdarzenie do rodzica (tak jak do tej pory)
    onFileChange(e);

    // RESETUJEMY wartość inputa. Dzięki temu przeglądarka zapomni,
    // że dodaliśmy przed chwilą plik "chomik.jpg" i pozwoli nam
    // dodać go ponownie, jeśli go usuniemy z podglądu.
    e.target.value = null;
  };

  return (
    <div className={`form-group ${fullWidth ? "form-group--full" : ""}`}>
      <label className="form-group__label">{label}</label>

      <div
        className={`dropzone ${!multiple && previews.length > 0 ? "has-image" : ""}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          name={name}
          id={name}
          accept={accept}
          multiple={multiple}
          onChange={handleInternalChange} // <--- Używamy naszej nowej, wbudowanej funkcji!
          disabled={disabled}
          className="dropzone__input"
        />

        {!multiple ? (
          previews.length > 0 ? (
            <div className="dropzone__preview-single">
              <img src={previews[0]} alt="Podgląd" />
              <label htmlFor={name} className="dropzone__change-btn">
                Zmień zdjęcie
              </label>
            </div>
          ) : (
            <label htmlFor={name} className="dropzone__label">
              <UploadCloud size={28} />
              <span>Kliknij lub upuść zdjęcie</span>
            </label>
          )
        ) : (
          <label htmlFor={name} className="dropzone__label">
            <UploadCloud size={28} />
            <span>Wybierz lub upuść zdjęcia do galerii</span>
          </label>
        )}
      </div>

      {multiple && previews.length > 0 && (
        <div className="gallery-preview">
          {previews.map((url, index) => (
            <div key={index} className="gallery-preview__item">
              <img src={url} alt={`Preview ${index}`} />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="gallery-preview__remove"
                title="Usuń zdjęcie"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
