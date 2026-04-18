import React from "react";
import Button from "../ui/Button";
import "../../styles/components/home/home_cta.scss";
import ctaBg from "../../assets/homecta.webp";

const HomeCTA = () => {
	return (
		<section className="home_cta" style={{ backgroundImage: `url(${ctaBg})` }}>
			<div className="home_cta_overlay"></div>
			<div className="home_container">
				<div className="home_cta_content">
					<span className="home_badge">Nowy dom, nowa przyjaźń</span>
					<h2 className="home_cta_title">
						Twoja wspólna historia może zacząć się już dziś
					</h2>
					<p className="home_cta_desc">
						Sprawdź naszą procedurę adopcyjną i zobacz, jak krok po kroku zostać
						opiekunem rodowodowego chomika dżungarskiego.
					</p>
					<Button to="/jak-zostac-opiekunem" variant="primary">
						Jak wygląda procedura?
					</Button>
				</div>
			</div>
		</section>
	);
};

export default HomeCTA;
