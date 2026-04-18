import React from "react";
import Button from "../ui/Button";
import "../../styles/components/home/home_hero.scss";
import heroImg from "../../assets/hero-bg.webp";

const HomeHero = () => {
	return (
		<section className="home_hero">
			<img src={heroImg} alt="Chomik dżungarski" className="home_hero_bg" />

			<div className="home_hero_overlay"></div>

			<div className="home_container">
				<div className="home_hero_content">
					<span className="home_badge">Zarejestrowana Hodowla PHC</span>
					<h1 className="home_title">
						Rodowodowe Chomiki Dżungarskie - Twoja Mała Kula Szczęścia
					</h1>
					<p className="home_desc">
						Wybierz odpowiedzialnie. Nasze maluchy dorastają w domowych
						warunkach, otoczone troską i miłością. Zdrowe, socjalizowane i
						gotowe na nowy dom.
					</p>
					<div className="home_actions">
						<Button to="/mioty" variant="primary">
							Zobacz maluchy
						</Button>
						<Button to="/o-nas" variant="secondary">
							Poznaj naszą historię
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HomeHero;
