import React from "react";
import { Link } from "react-router-dom";
import "../../styles/components/home/home_litters.scss";

const HomeLitters = () => {
	return (
		<section className="home_litters">
			<div className="home_container">
				<div className="home_litters_header">
					<h2 className="home_section_title">Ostatnie Mioty</h2>
					<Link to="/mioty" className="home_link_all">
						Wszystkie mioty &rarr;
					</Link>
				</div>

				<div className="home_litters_grid">
					<div className="home_litter_card">
						<div className="home_litter_img_placeholder">Miot "A"</div>
						<div className="home_litter_info">
							<h3>Miot "A" - Zimowe Śnieżynki</h3>
							<span className="home_status active">Dostępne maluchy</span>
						</div>
					</div>
					<div className="home_litter_card">
						<div className="home_litter_img_placeholder">Miot "B"</div>
						<div className="home_litter_info">
							<h3>Miot "B" - Karmelowe Cuda</h3>
							<span className="home_status reserved">Rezerwacja zamknięta</span>
						</div>
					</div>
					<div className="home_litter_card">
						<div className="home_litter_img_placeholder">Miot "C"</div>
						<div className="home_litter_info">
							<h3>Miot "C" - Srebrne Obłoczki</h3>
							<span className="home_status sold">W nowych domach</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HomeLitters;
