import React from "react";
import { BookOpen } from "lucide-react";
import Button from "../ui/Button";
import "../../styles/components/home/home_guide.scss";
import guideImg from "../../assets/guide-home.jpg";

const HomeGuide = () => {
	return (
		<section className="home_guide">
			<div className="home_container">
				<div className="home_guide_wrapper">
					<div className="home_guide_text">
						<div className="home_guide_icon">
							<BookOpen size={40} />
						</div>
						<h2>Zanim kupisz – przeczytaj!</h2>
						<p>
							Chomik to żywe stworzenie, a nie zabawka. Wymaga odpowiedniej
							klatki, kołowrotka i diety. Zanim zdecydujesz się na rezerwację,
							sprawdź nasze kompendium wiedzy o dżungarkach.
						</p>
						<Button to="/poradnik" variant="outline">
							Przejdź do poradnika
						</Button>
					</div>
					<div className="home_guide_image">
						{/* PRAWDZIWE ZDJĘCIE ZAMIAST DIVA */}
						<img
							src={guideImg}
							alt="Prawidłowa klatka dla chomika"
							className="home_guide_img_real"
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HomeGuide;
