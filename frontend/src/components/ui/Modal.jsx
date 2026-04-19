import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import "../../styles/components/ui/modal.scss"; // Zmieniamy nazwę pliku ze stylami

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "800px", // Domyślna szerokość, którą można nadpisać
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>

        {/* Tutaj wpadnie cała zawartość, np. formularz chomika lub miotu */}
        <div className="modal-content">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
