import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import "../../styles/components/ui/lightbox.scss";

const Lightbox = ({
	isOpen,
	images,
	currentIndex,
	onClose,
	onNext,
	onPrev,
}) => {
	// Obsluga klawiatury (Escape i strzalki)
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowRight") onNext();
			if (e.key === "ArrowLeft") onPrev();
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose, onNext, onPrev]);

	if (!isOpen || !images || images.length === 0) return null;

	// Zatrzymujemy propagacje klikniecia, zeby nie zamykalo lightboxa przy klikaniu w strzalki
	const handleNext = (e) => {
		e.stopPropagation();
		onNext();
	};

	const handlePrev = (e) => {
		e.stopPropagation();
		onPrev();
	};

	return (
		<div className="global_lightbox_overlay" onClick={onClose}>
			<button className="lightbox_close" onClick={onClose}>
				<X size={36} />
			</button>

			{images.length > 1 && (
				<button className="lightbox_nav lightbox_prev" onClick={handlePrev}>
					<ChevronLeft size={48} />
				</button>
			)}

			<div
				className="lightbox_image_container"
				onClick={(e) => e.stopPropagation()}>
				<img
					src={images[currentIndex]}
					alt={`Powiekszenie ${currentIndex + 1}`}
					className="lightbox_img"
				/>
				<div className="lightbox_counter">
					{currentIndex + 1} / {images.length}
				</div>
			</div>

			{images.length > 1 && (
				<button className="lightbox_nav lightbox_next" onClick={handleNext}>
					<ChevronRight size={48} />
				</button>
			)}
		</div>
	);
};

export default Lightbox;
