import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { litterApi } from "../utils/api";
import Button from "../components/ui/Button";
import ErrorState from "../components/ui/ErrorState";
import Loader from "../components/ui/Loader";
import "../styles/pages/litters.scss";

const IMAGE_BASE_URL = (
	import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace("/api", "");

const Litters = () => {
	const [litters, setLitters] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchLitters = async () => {
			try {
				const response = await litterApi.getAll();
				setLitters(response.data);
				setIsLoading(false);
			} catch (err) {
				console.error("Blad pobierania miotow:", err);
				setError(
					"Nie udalo sie zaladowac informacji o miotach. Sprobuj ponownie pozniej.",
				);
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

	const renderLitterGrid = (litterList) => (
		<div className="litters_grid">
			{litterList.map((litter) => (
				<div
					className="litters_card"
					key={litter.id}
					onClick={() => navigate(`/miot/${litter.id}`)}>
					<div className="litters_image_box">
						<span className={`litters_badge badge_${litter.status}`}>
							{litter.status}
						</span>
						<img
							src={
								litter.miniaturka
									? `${IMAGE_BASE_URL}${litter.miniaturka}`
									: "/placeholder.jpg"
							}
							alt={litter.nazwa}
							className="litters_img"
						/>
					</div>
					<div className="litters_content">
						<h2 className="litters_card_title">
							<span className="litters_prefix">Miot</span> {litter.nazwa}
						</h2>
						<div className="litters_details">
							{litter.status === "planowany" ? (
								<p>
									<strong>Spodziewany termin:</strong>{" "}
									{litter.spodziewany_termin || "Brak danych"}
								</p>
							) : (
								<p>
									<strong>Data urodzenia:</strong>{" "}
									{litter.data_urodzenia
										? new Date(litter.data_urodzenia).toLocaleDateString(
												"pl-PL",
											)
										: "Brak danych"}
								</p>
							)}
							<p>
								<strong>Rodzice:</strong> {litter.matka_imie || "?"} x{" "}
								{litter.ojciec_imie || "?"}
							</p>
						</div>
						<Button
							variant="outline"
							to={`/miot/${litter.id}`}
							className="litters_btn">
							Zobacz szczegoly
						</Button>
					</div>
				</div>
			))}
		</div>
	);

	return (
		<section className="litters">
			<div className="litters_header">
				<h1 className="litters_title">Mioty</h1>
				<p className="litters_subtitle">
					Przegladaj aktualne, planowane oraz archiwalne mioty z naszej hodowli.
				</p>
			</div>

			<div className="litters_container">
				{isLoading && <Loader />}
				{error && <ErrorState message={error} />}
				{!isLoading && !error && litters.length === 0 && (
					<div className="litters_empty">Obecnie nie mamy zadnych miotow.</div>
				)}
				{!isLoading && !error && litters.length > 0 && (
					<>
						{currentLitters.length > 0 && (
							<div className="litters_group">
								<h2 className="litters_group_title group_current">
									Aktualne Mioty
								</h2>
								{renderLitterGrid(currentLitters)}
							</div>
						)}
						{plannedLitters.length > 0 && (
							<div className="litters_group">
								<h2 className="litters_group_title group_planned">
									Planowane Mioty
								</h2>
								{renderLitterGrid(plannedLitters)}
							</div>
						)}
						{archiveLitters.length > 0 && (
							<div className="litters_group">
								<h2 className="litters_group_title group_archive">
									Archiwum Miotow
								</h2>
								{renderLitterGrid(archiveLitters)}
							</div>
						)}
					</>
				)}
			</div>
		</section>
	);
};

export default Litters;
