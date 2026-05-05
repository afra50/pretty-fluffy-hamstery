import React from "react";
import { ShieldCheck, Baby, Heart } from "lucide-react";
import Loader from "../ui/Loader";
import ErrorState from "../ui/ErrorState";
import "../../styles/components/home/home_features.scss";

const HomeFeatures = () => {
	return (
		<section className="home_features">
			<div className="home_container">
				<h2 className="home_section_title">Dlaczego Pretty Fluffy?</h2>
				<div className="home_features_grid">
					<div className="home_feature_card">
						<div className="home_feature_icon">
							<ShieldCheck size={32} />
						</div>
						<h3>Czysta Genetyka</h3>
						<p>
							Przynależymy do Polish Hamster Club. Rozmnażamy tylko zdrowe,
							niespokrewnione osobniki z udokumentowanym pochodzeniem.
						</p>
					</div>
					<div className="home_feature_card">
						<div className="home_feature_icon">
							<Baby size={32} />
						</div>
						<h3>Domowa Socjalizacja</h3>
						<p>
							Maluchy od pierwszych dni mają kontakt z człowiekiem, zapachami i
							dźwiękami domu. Nie są dzikie ani agresywne.
						</p>
					</div>
					<div className="home_feature_card">
						<div className="home_feature_icon">
							<Heart size={32} />
						</div>
						<h3>Wsparcie po Adopcji</h3>
						<p>
							Nie zostawiamy Cię samego. Zawsze służymy radą w kwestii żywienia,
							zdrowia czy oswajania w nowym miejscu.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HomeFeatures;
