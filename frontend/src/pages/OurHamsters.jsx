import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- DODANY IMPORT
import { hamsterApi } from "../utils/api";
import Button from "../components/ui/Button";
import "../styles/pages/our-hamsters.scss";

const IMAGE_BASE_URL = (
	import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace("/api", "");

const OurHamsters = () => {
	const [hamsters, setHamsters] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate(); // <-- INICJALIZACJA NAWIGACJI

	useEffect(() => {
		const fetchHamsters = async () => {
			try {
				const response = await hamsterApi.getAll();
				setHamsters(response.data);
				setIsLoading(false);
			} catch (err) {
				console.error("Błąd pobierania chomików:", err);
				setError(
					"Nie udało się załadować zwierzaków. Spróbuj ponownie później.",
				);
				setIsLoading(false);
			}
		};

		fetchHamsters();
	}, []);

	const females = hamsters.filter(
		(h) => h.plec && h.plec.toLowerCase() === "samica",
	);
	const males = hamsters.filter(
		(h) => h.plec && h.plec.toLowerCase() === "samiec",
	);

	const renderHamsterGrid = (hamsterList) => (
		<div className="our_hamsters_grid">
			{hamsterList.map((hamster) => (
				<div
					className="our_hamsters_card"
					key={hamster.id}
					onClick={() => navigate(`/chomik/${hamster.id}`)} // <-- CAŁA KARTA JEST KLIKALNA
				>
					<div className="our_hamsters_image_box">
						<span className="our_hamsters_badge">
							{hamster.plec || "Nieznana"}
						</span>
						<img
							src={
								hamster.miniaturka
									? `${IMAGE_BASE_URL}${hamster.miniaturka}`
									: "/placeholder.jpg"
							}
							alt={hamster.imie}
							className="our_hamsters_img"
						/>
					</div>
					<div className="our_hamsters_content">
						<h2 className="our_hamsters_card_title">
							{/* <-- ODDZIELONY PRZYDOMEK Z NOWĄ KLASĄ */}
							<span className="our_hamsters_prefix">
								{hamster.przydomek}
							</span>{" "}
							{hamster.imie}
						</h2>

						<div className="our_hamsters_details">
							<p>
								<strong>Data urodzenia:</strong>{" "}
								{hamster.data_urodzenia
									? new Date(hamster.data_urodzenia).toLocaleDateString("pl-PL")
									: "Brak danych"}
							</p>
							<p>
								<strong>Umaszczenie:</strong> {hamster.umaszczenie || "Brak"}
							</p>
						</div>

						{/* Button zostaje wizualnie, ale nawigację i tak łapie główny div */}
						<Button
							variant="outline"
							to={`/chomik/${hamster.id}`}
							className="our_hamsters_btn">
							Zobacz szczegóły
						</Button>
					</div>
				</div>
			))}
		</div>
	);

	return (
		<section className="our_hamsters">
			<div className="our_hamsters_header">
				<h1 className="our_hamsters_title">Nasze Zwierzęta</h1>
				<p className="our_hamsters_subtitle">
					Poznaj maluchy oraz dorosłe osobniki z naszej hodowli.
				</p>
			</div>

			<div className="our_hamsters_container">
				{isLoading && <div className="our_hamsters_loader">Wczytywanie...</div>}

				{error && <div className="our_hamsters_error">{error}</div>}

				{!isLoading && !error && hamsters.length === 0 && (
					<div className="our_hamsters_empty">
						Obecnie nie mamy żadnych chomików do wyświetlenia. Wróć tu wkrótce!
					</div>
				)}

				{!isLoading && !error && hamsters.length > 0 && (
					<>
						{females.length > 0 && (
							<div className="our_hamsters_group">
								<h2 className="our_hamsters_group_title">Samice</h2>
								{renderHamsterGrid(females)}
							</div>
						)}

						{males.length > 0 && (
							<div className="our_hamsters_group">
								<h2 className="our_hamsters_group_title">Samce</h2>
								{renderHamsterGrid(males)}
							</div>
						)}
					</>
				)}
			</div>
		</section>
	);
};

export default OurHamsters;
