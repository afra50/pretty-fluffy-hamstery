import React from "react";
import Button from "../ui/Button";
import Loader from "../ui/Loader";
import ErrorState from "../ui/ErrorState";
import "../../styles/components/home/home_cta.scss";

const HomeCTA = () => {
	return (
		<section className="cta-modern-minimal">
			<div className="cta-overlay"></div>
			<div className="cta-container">
				<div className="cta-content">
					<span className="cta-top-text">Świadomy start</span>
					<h2 className="cta-heading">
						Zacznijcie wspólną historię od odpowiedzialnego kroku
					</h2>
					<p>
						Nasze chomiki dorastają w domowych warunkach, otoczone najlepszą
						opieką. Dowiedz się, jak przygotować idealną wyprawkę i jak krok po
						kroku zostać właścicielem rodowodowego malucha.
					</p>
					<div className="cta-actions">
						{/* Zmieniamy wariant na secondary, żeby odbijał od różowego nagłówka */}
						<Button
							to="/jak-zostac-opiekunem"
							variant="primary"
							className="cta-btn-large">
							Jak wygląda procedura?
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HomeCTA;
