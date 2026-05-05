import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { litterApi } from "../../utils/api";
import Loader from "../ui/Loader";
import ErrorState from "../ui/ErrorState";
import "../../styles/components/home/home_litters.scss";

const getBaseUrl = () => {
	const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
	return apiUrl.replace(/\/api$/, "");
};

const HomeLitters = () => {
	const [litter, setLitter] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [lightboxIndex, setLightboxIndex] = useState(null);

	useEffect(() => {
		const fetchCurrentLitter = async () => {
			try {
				const response = await litterApi.getAll();
				const current = response.data.find((m) => m.status === "aktualny");
				setLitter(current);
			} catch (error) {
				console.error("Błąd podczas pobierania miotów:", error);
				setError(
					"Nie udało się pobrać informacji o najnowszym miocie. Spróbuj odświeżyć stronę.",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchCurrentLitter();
	}, []);

	const allImages = litter?.zdjecia || [];

	useEffect(() => {
		if (lightboxIndex === null) return;

		const handleKeyDown = (e) => {
			if (e.key === "Escape") setLightboxIndex(null);
			if (e.key === "ArrowRight") nextImage(e);
			if (e.key === "ArrowLeft") prevImage(e);
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [lightboxIndex, allImages.length]);

	const openLightbox = (index) => setLightboxIndex(index);
	const closeLightbox = () => setLightboxIndex(null);

	const nextImage = (e) => {
		if (e) e.stopPropagation();
		setLightboxIndex((prev) => (prev + 1) % (allImages.length || 1));
	};

	const prevImage = (e) => {
		if (e) e.stopPropagation();
		const length = allImages.length || 1;
		setLightboxIndex((prev) => (prev - 1 + length) % length);
	};

	if (loading) {
		return (
			<section className="home_litters">
				<div className="home_container">
					<div className="home_litters_header">
						<h2 className="home_section_title">Ostatni miot:</h2>
					</div>
					<div className="home_litter_empty loading_state">
						<div className="home_spinner"></div>
						<p>Pobieranie najnowszych puszystych kulek...</p>
					</div>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className="home_litters">
				<div className="home_container">
					<div className="home_litters_header">
						<h2 className="home_section_title">Ostatni miot:</h2>
					</div>
					<div className="home_litter_empty error_state">
						<p>{error}</p>
					</div>
				</div>
			</section>
		);
	}

	if (!litter) {
		return (
			<section className="home_litters">
				<div className="home_container">
					<div className="home_litters_header">
						<h2 className="home_section_title">Ostatni miot:</h2>
						<Link to="/mioty" className="home_link_all">
							Wszystkie mioty &rarr;
						</Link>
					</div>
					<div className="home_litter_empty">
						<p>
							W tej chwili nie mamy dostępnych maluchów. Sprawdź planowane
							mioty!
						</p>
					</div>
				</div>
			</section>
		);
	}

	// Limitujemy widok siatki do 5 pierwszych zdjęć
	const imagesToShow = allImages.slice(0, 5);
	const extraPhotosCount = allImages.length - 5;
	const BASE_URL = getBaseUrl();

	return (
		<section className="home_litters">
			<div className="home_container">
				<div className="home_litters_header">
					<h2 className="home_section_title">Ostatni miot:</h2>
					<Link to="/mioty" className="home_link_all">
						Wszystkie mioty &rarr;
					</Link>
				</div>

				<div className="home_litter_showcase">
					<h3 className="home_litter_title">{litter.nazwa}</h3>

					{imagesToShow.length > 0 && (
						<div className={`home_litter_images count-${imagesToShow.length}`}>
							{imagesToShow.map((imgPath, index) => (
								<div
									key={index}
									className={`img_wrapper img-${index}`}
									onClick={() => openLightbox(index)}>
									<img
										src={`${BASE_URL}${imgPath}`}
										alt={`Miot ${litter.nazwa} - zdjęcie ${index + 1}`}
									/>

									{/* Nakładka z +X na ostatnim zdjęciu jeśli jest więcej niż 5 fotek */}
									{index === 4 && extraPhotosCount > 0 && (
										<div className="img_overlay_more">+{extraPhotosCount}</div>
									)}
								</div>
							))}
						</div>
					)}

					<div className="home_litter_details">
						<div className="home_litter_parents">
							<span className="parent_badge">
								<strong>Mama:</strong> {litter.matka_imie}
							</span>
							<span className="parent_badge">
								<strong>Tata:</strong> {litter.ojciec_imie}
							</span>
						</div>

						<p className="home_litter_date">
							<strong>Urodzone:</strong>{" "}
							{new Date(litter.data_urodzenia).toLocaleDateString("pl-PL", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</p>

						<p className="home_litter_description">
							{litter.opis ||
								"Maluchy z tego miotu rozwijają się świetnie i wkrótce będą gotowe na zmianę domu. Zapraszamy do kontaktu w sprawie rezerwacji."}
						</p>
					</div>
				</div>
			</div>

			{/* LIGHTBOX */}
			{lightboxIndex !== null && (
				<div className="home_lightbox_overlay" onClick={closeLightbox}>
					<button className="lightbox_close" onClick={closeLightbox}>
						✕
					</button>

					{allImages.length > 1 && (
						<button className="lightbox_nav lightbox_prev" onClick={prevImage}>
							‹
						</button>
					)}

					{/* W Lightboxie ładujemy zdjęcie z oryginalnej, pełnej tablicy allImages */}
					<img
						src={`${BASE_URL}${allImages[lightboxIndex]}`}
						alt="Powiększenie"
						className="lightbox_img"
						onClick={(e) => e.stopPropagation()}
					/>

					{allImages.length > 1 && (
						<button className="lightbox_nav lightbox_next" onClick={nextImage}>
							›
						</button>
					)}
				</div>
			)}
		</section>
	);
};

export default HomeLitters;
