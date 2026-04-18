import React from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "./Button";
import "../../styles/components/ui/confirm_dialog.scss";

const ConfirmDialog = ({
	isOpen,
	title = "Czy jesteś pewien?",
	message,
	onConfirm,
	onCancel,
	confirmText = "Usuń",
	cancelText = "Anuluj",
	isLoading = false,
}) => {
	if (!isOpen) return null;

	return (
		<div className="confirm_overlay" onClick={onCancel}>
			<div className="confirm_dialog" onClick={(e) => e.stopPropagation()}>
				<button className="confirm_close" onClick={onCancel}>
					<X size={20} />
				</button>

				<div className="confirm_content">
					<div className="confirm_icon">
						<AlertTriangle size={32} />
					</div>
					<h3 className="confirm_title">{title}</h3>
					<p className="confirm_message">{message}</p>
				</div>

				<div className="confirm_actions">
					<Button
						variant="outline"
						onClick={onCancel}
						disabled={isLoading}
						className="confirm_cancel_btn" // Dodana klasa do nadpisania kolorów
					>
						{cancelText}
					</Button>
					<Button variant="primary" onClick={onConfirm} isLoading={isLoading}>
						{confirmText}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmDialog;
