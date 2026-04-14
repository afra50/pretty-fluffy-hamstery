// ==========================================
// COMPONENT: FOOTER
// ==========================================
import { Link } from "react-router-dom";
import {
	FaInstagram,
	FaFacebookF,
	FaMapMarkerAlt,
	FaEnvelope,
} from "react-icons/fa";
import logo from "../assets/logo.webp";
import "../styles/components/footer.scss";

const Footer = () => {
	return (
		<footer className="footer">
			<div className="footer_container">
				{/* ========================================== */}
				{/* LEWA STRONA: LOGO I OPIS HODOWLI           */}
				{/* ========================================== */}
				<div className="footer_column footer_logo_column">
					<Link to="/" className="footer_logo">
						<span className="footer_logo_text">Pretty Fluffy Hamstery</span>
						<img src={logo} alt="Pretty Fluffy Hamstery Logo" />
					</Link>

					<p className="hodowla_rejestracja">
						Hodowla chomików rodowodowych zarejestrowana 1. Deutschen
						Hamstervereinigung e.V. nr 06-23-70 i 07-23-71 oraz Český křeččí
						klub nr 224 i nr 225
					</p>
				</div>

				{/* ========================================== */}
				{/* PRAWA STRONA: GRUPA MENU I KONTAKTU        */}
				{/* ========================================== */}
				<div className="footer_right_group">
					{/* --- SEKACJA: MENU --- */}
					<div className="footer_column">
						<h3 className="footer_title">Menu</h3>
						<ul className="footer_nav_list">
							<li className="footer_item">
								<Link to="/mioty" className="footer_link">
									Mioty
								</Link>
							</li>
							<li className="footer_item">
								<Link to="/nasze-zwierzeta" className="footer_link">
									Nasze zwierzęta
								</Link>
							</li>
							<li className="footer_item">
								<Link to="/jak-zostac-opiekunem" className="footer_link">
									Jak zostać opiekunem
								</Link>
							</li>
							<li className="footer_item">
								<Link to="/poradnik" className="footer_link">
									Poradnik
								</Link>
							</li>
							<li className="footer_item">
								<Link to="/o-nas" className="footer_link">
									O nas
								</Link>
							</li>
						</ul>
					</div>

					{/* --- SEKCJA: KONTAKT I SOCIAL MEDIA --- */}
					<div className="footer_column">
						<h3 className="footer_title">Kontakt</h3>
						<ul className="footer_contact_list">
							<li className="contact_item">
								<FaEnvelope aria-hidden="true" />
								<a
									href="mailto:kontakt@polishhamsterclub.pl"
									className="contact_link">
									kontakt@polishhamsterclub.pl
								</a>
							</li>
							<li className="contact_item">
								<FaMapMarkerAlt aria-hidden="true" />
								<span>Wrocław</span>
							</li>
						</ul>

						<div className="footer_socials_wrapper">
							<a
								href="https://www.facebook.com/prettyfluffyhamstery"
								target="_blank"
								rel="noopener noreferrer"
								className="social_link"
								aria-label="Facebook">
								<FaFacebookF />
							</a>
							<a
								href="https://www.instagram.com/prettyfluffyhamstery/"
								target="_blank"
								rel="noopener noreferrer"
								className="social_link"
								aria-label="Instagram">
								<FaInstagram />
							</a>
						</div>
					</div>
				</div>
			</div>

			{/* ========================================== */}
			{/* DOLNY PASEK: COPYRIGHT                       */}
			{/* ========================================== */}
			<div className="footer_bottom">
				<p>
					&copy; {new Date().getFullYear()} Pretty Fluffy Hamstery. Wszelkie
					prawa zastrzeżone.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
