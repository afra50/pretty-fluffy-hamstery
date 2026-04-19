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
					<span className="home_badge">świadomy start </span>
					<h2 className="home_cta_title">
						Zacznijcie wspólną historię od odpowiedzialnego kroku
					</h2>
					<p className="home_cta_desc">
						Nasze chomiki dorastają w domowych warunkach, otoczone najlepszą
						opieką. Dowiedz się, jak przygotować idealną wyprawkę i jak krok po
						kroku zostać właścicielem rodowodowego malucha.
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
