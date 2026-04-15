import React, { useState } from "react";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Pagination from "../components/ui/Pagination";
import "../styles/pages/about_us.scss";

const AboutUs = () => {
	// ----------------------------------------------------
	// STANY DO TESTÓW UI
	// ----------------------------------------------------
	const [isLoading, setIsLoading] = useState(false);
	const [hasError, setHasError] = useState(false);

	// Stany dla Confirm Dialog
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [isConfirmLoading, setIsConfirmLoading] = useState(false);

	// Stan dla Paginacji
	const [page, setPage] = useState(1);

	// ----------------------------------------------------
	// FUNKCJE TESTOWE
	// ----------------------------------------------------
	const handleSuccessLoad = () => {
		setIsLoading(true);
		setHasError(false);
		setTimeout(() => setIsLoading(false), 2000);
	};

	const handleErrorLoad = () => {
		setIsLoading(true);
		setHasError(false);
		setTimeout(() => {
			setIsLoading(false);
			setHasError(true);
		}, 2000);
	};

	const handleRetry = () => {
		setHasError(false);
		handleSuccessLoad();
	};

	// Funkcje dla Confirm Dialog
	const handleOpenConfirm = () => setIsConfirmOpen(true);
	const handleCloseConfirm = () => setIsConfirmOpen(false);

	const handleExecuteAction = () => {
		setIsConfirmLoading(true);
		setTimeout(() => {
			setIsConfirmLoading(false);
			setIsConfirmOpen(false);
			console.log("Akcja wykonana pomyślnie!");
		}, 2000);
	};

	// ----------------------------------------------------
	// RENDER: STAN BŁĘDU
	// ----------------------------------------------------
	if (hasError) {
		return (
			<div
				className="about_us"
				style={{ display: "flex", alignItems: "center", minHeight: "70vh" }}>
				<div
					className="about_us_container"
					style={{ display: "flex", justifyContent: "center" }}>
					<ErrorState
						title="Ups, brak połączenia z bazą"
						message="Chomiki przegryzły kable od serwera. Nie udało się załadować danych o hodowli."
						onRetry={handleRetry}
					/>
				</div>
			</div>
		);
	}

	// ----------------------------------------------------
	// RENDER: NORMALNA STRONA
	// ----------------------------------------------------
	return (
		<div className="about_us">
			{/* 1. Nasz pełnoekranowy loader */}
			{isLoading && <Loader fullPage={true} message="Pobieranie danych..." />}

			{/* 2. Nasz Confirm Dialog */}
			<ConfirmDialog
				isOpen={isConfirmOpen}
				title="Usunąć ten wpis?"
				message="Ta akcja jest nieodwracalna. Czy na pewno chcesz trwale usunąć ten element z bazy danych?"
				confirmText="Tak, usuń"
				cancelText="Anuluj"
				onConfirm={handleExecuteAction}
				onCancel={handleCloseConfirm}
				isLoading={isConfirmLoading}
			/>

			<section className="about_us_hero">
				<div className="about_us_container">
					<div className="about_us_hero_content">
						<span className="about_us_label">Poznaj nas bliżej</span>
						<h1 className="about_us_title">
							Z miłości do małych puszystych stworzeń
						</h1>
						<p className="about_us_desc">
							Pretty Fluffy Hamstery to nie tylko hodowla, to nasza pasja i dom
							pełen radosnego chrupania. Poznaj naszą historię i zobacz, jak
							dbamy o naszych podopiecznych.
						</p>

						{/* PRZYCISKI DO TESTOWANIA LOGIKI */}
						<div
							style={{
								display: "flex",
								gap: "15px",
								flexWrap: "wrap",
								marginTop: "2rem",
								padding: "20px",
								backgroundColor: "rgba(0,0,0,0.03)",
								borderRadius: "10px",
							}}>
							<Button variant="outline" onClick={handleSuccessLoad}>
								Test: Loader
							</Button>

							<Button variant="outline" onClick={handleErrorLoad}>
								Test: Error State
							</Button>

							<Button variant="primary" onClick={handleOpenConfirm}>
								Test: Confirm Dialog
							</Button>
						</div>
					</div>
				</div>
			</section>

			<section className="about_us_story">
				<div className="about_us_container">
					<div className="about_us_story_grid">
						<div className="about_us_story_image">
							<div className="about_us_img_placeholder"></div>
						</div>
						<div className="about_us_story_text">
							<h2 className="about_us_subtitle">Nasza Historia</h2>
							<p className="about_us_text">
								Wszystko zaczęło się od jednego marzenia o stworzeniu miejsca,
								gdzie chomiki rodowodowe będą dorastać w najlepszych możliwych
								warunkach. Dziś jesteśmy dumnymi członkami Polish Hamster Club,
								a nasze zwierzęta znajdują kochające domy w całym kraju.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* 3. Nasza Paginacja */}
			<div
				style={{
					marginTop: "2rem",
					paddingBottom: "4rem",
					textAlign: "center",
				}}>
				<p
					style={{
						marginBottom: "10px",
						fontFamily: "var(--font-heading)",
						color: "var(--color-secondary)",
					}}>
					Aktualna strona: {page}
				</p>
				<Pagination
					currentPage={page}
					totalPages={5}
					onPageChange={(newPage) => setPage(newPage)}
				/>
			</div>
		</div>
	);
};

export default AboutUs;
