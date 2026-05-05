import React, { useState, useEffect } from "react";
import { litterApi } from "../utils/api";
import { ZoomIn, CalendarDays, Users } from "lucide-react";
import ErrorState from "../components/ui/ErrorState";
import Loader from "../components/ui/Loader";
import Lightbox from "../components/ui/Lightbox"; // <-- IMPORT NASZEGO KOMPONENTU
import "../styles/pages/litters.scss";

const IMAGE_BASE_URL = (
	import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace("/api", "");

const Litters = () => {
	const [litters, setLitters] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const [activeTab, setActiveTab] = useState("aktualny");

	// Skrocony stan dla Lightboxa
	const [lightbox, setLightbox] = useState({
		isOpen: false,
		images: [],
		currentIndex: 0,
	});

	useEffect(() => {
		const fetchLitters = async () => {
			try {
				const response = await litterApi.getAll();
				const data = response.data;
				setLitters(data);

				const hasCurrent = data.some(
					(l) => l.status && l.status.toLowerCase() === "aktualny",
				);
				const hasPlanned = data.some(
					(l) => l.status && l.status.toLowerCase() === "planowany",
				);

				if (hasCurrent) {
					setActiveTab("aktualny");
				} else if (hasPlanned) {
					setActiveTab("planowany");
				} else {
					setActiveTab("archiwum");
				}

				setIsLoading(false);
			} catch (err) {
				console.error("Blad pobierania miotow:", err);
				setError("Nie udalo sie zaladowac miotow. Sprobuj ponownie pozniej.");
				setIsLoading(false);
			}
		};
		fetchLitters();
	}, []);

	const currentLitters = litters.filter(
		(l) => l.status && l.status.toLowerCase() === "aktualny",
	);
	const plannedLitters = litters.filter(
		(l) => l.status && l.status.toLowerCase() === "planowany",
	);
	const archiveLitters = litters.filter(
		(l) => l.status && l.status.toLowerCase() === "archiwum",
	);

	// --- FUNKCJE DLA KOMPONENTU LIGHTBOX ---
	const openLightbox = (litter, startIndex) => {
		const allImages = [];
		if (litter.miniaturka) allImages.push(litter.miniaturka);
		if (litter.zdjecia && litter.zdjecia.length > 0) {
			allImages.push(...litter.zdjecia);
		}

		setLightbox({
			isOpen: true,
			images: allImages.map((img) => `${IMAGE_BASE_URL}${img}`),
			currentIndex: startIndex,
		});
	};

	const closeLightbox = () => setLightbox({ ...lightbox, isOpen: false });

	const nextImage = () => {
		setLightbox((prev) => ({
			...prev,
			currentIndex: (prev.currentIndex + 1) % prev.images.length,
		}));
	};

	const prevImage = () => {
		setLightbox((prev) => ({
			...prev,
			currentIndex:
				(prev.currentIndex - 1 + prev.images.length) % prev.images.length,
		}));
	};

	// --- RENDEROWANIE MIOTOW ---
	const renderEditorialList = (litterList) => (
		<div className="litter_editorial_list">
			{litterList.map((litter) => {
				const galleryImages = litter.zdjecia || [];

				return (
					<div className="litter_editorial_block" key={litter.id}>
						<div
							className="editorial_visual"
							onClick={() => openLightbox(litter, 0)}>
							<div className="main_image_wrapper">
								<img
									src={
										litter.miniaturka
											? `${IMAGE_BASE_URL}${litter.miniaturka}`
											: "/placeholder.jpg"
									}
									alt={litter.nazwa}
								/>
								<div className="zoom_overlay">
									<ZoomIn size={32} />
									<span>Powieksz zdjecia</span>
								</div>
							</div>
						</div>

						<div className="editorial_content">
							<div className="editorial_header">
								<span className="prefix">Pretty Fluffy</span>
								<h2>{litter.nazwa}</h2>
							</div>

							<div className="editorial_badges">
								<span
									className={`badge_status badge_${litter.status?.toLowerCase()}`}>
									{litter.status || "Nieznany"}
								</span>

								<span className="badge_outline">
									<Users size={16} className="badge_icon" />
									{litter.matka_imie || "?"} x {litter.ojciec_imie || "?"}
								</span>

								<span className="badge_outline badge_date">
									<CalendarDays size={16} className="badge_icon" />
									{litter.status?.toLowerCase() === "planowany"
										? `Spodziewane: ${litter.spodziewany_termin || "Brak"}`
										: `Urodzone: ${litter.data_urodzenia ? new Date(litter.data_urodzenia).toLocaleDateString("pl-PL") : "Brak"}`}
								</span>
							</div>

							{litter.opis && <p className="editorial_desc">{litter.opis}</p>}

							{galleryImages.length > 0 && (
								<div className="editorial_mini_gallery">
									{galleryImages.slice(0, 4).map((img, idx) => (
										<div
											key={idx}
											className="mini_gallery_item"
											onClick={() => openLightbox(litter, idx + 1)}>
											<img src={`${IMAGE_BASE_URL}${img}`} alt="Galeria" />
											{idx === 3 && galleryImages.length > 4 && (
												<div className="more_overlay">
													+{galleryImages.length - 3}
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);

	return (
		<>
			<section className="litters_page">
				<div className="page_header">
					<h1>Nasze Mioty</h1>
					<p>
						Poznaj aktualne i planowane polaczenia w naszej hodowli, a takze
						przejrzyj archiwum poprzednich miotow.
					</p>
				</div>

				<div className="page_container">
					{isLoading && <Loader />}
					{error && <ErrorState message={error} />}

					{!isLoading && !error && litters.length === 0 && (
						<div className="empty_state">
							Obecnie nie mamy zadnych miotow do wyswietlenia.
						</div>
					)}

					{!isLoading && !error && litters.length > 0 && (
						<div className="tabs_container">
							<div className="category_tabs">
								{currentLitters.length > 0 && (
									<button
										className={`tab_btn tab_current ${activeTab === "aktualny" ? "active" : ""}`}
										onClick={() => setActiveTab("aktualny")}>
										Aktualne
									</button>
								)}
								{plannedLitters.length > 0 && (
									<button
										className={`tab_btn tab_planned ${activeTab === "planowany" ? "active" : ""}`}
										onClick={() => setActiveTab("planowany")}>
										Planowane
									</button>
								)}
								{archiveLitters.length > 0 && (
									<button
										className={`tab_btn tab_archive ${activeTab === "archiwum" ? "active" : ""}`}
										onClick={() => setActiveTab("archiwum")}>
										Archiwum
									</button>
								)}
							</div>

							<div className="tab_content">
								{activeTab === "aktualny" &&
									renderEditorialList(currentLitters)}
								{activeTab === "planowany" &&
									renderEditorialList(plannedLitters)}
								{activeTab === "archiwum" &&
									renderEditorialList(archiveLitters)}
							</div>
						</div>
					)}
				</div>
			</section>

			{/* --- CZYSTY, REUZYWALNY KOMPONENT LIGHTBOXA --- */}
			<Lightbox
				isOpen={lightbox.isOpen}
				images={lightbox.images}
				currentIndex={lightbox.currentIndex}
				onClose={closeLightbox}
				onNext={nextImage}
				onPrev={prevImage}
			/>
		</>
	);
};

export default Litters;
