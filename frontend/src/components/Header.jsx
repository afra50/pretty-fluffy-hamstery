import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

import logo from "../assets/logo.webp";
import "../styles/components/header.scss";

const Header = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const location = useLocation();

	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
	}, [isMobileMenuOpen]);

	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [location]);

	return (
		<header className="header">
			<div className="header_container">
				<Link to="/" className="header_logo">
					<img src={logo} alt="Pretty Fluffy Hamstery Logo" />
					<span className="header_logo_text">Pretty Fluffy Hamstery</span>
				</Link>

				<nav
					className={`header_nav ${isMobileMenuOpen ? "header_nav_active" : ""}`}>
					<ul className="header_menu">
						<li className="header_item">
							<NavLink to="/mioty" className="header_link">
								Mioty
							</NavLink>
						</li>
						<li className="header_item">
							<NavLink to="/nasze-zwierzeta" className="header_link">
								Nasze zwierzęta
							</NavLink>
						</li>
						<li className="header_item">
							<NavLink to="/jak-zostac-opiekunem" className="header_link">
								Jak zostać opiekunem
							</NavLink>
						</li>
						<li className="header_item">
							<NavLink to="/poradnik" className="header_link">
								Poradnik
							</NavLink>
						</li>
						<li className="header_item">
							<NavLink to="/o-nas" className="header_link">
								O nas
							</NavLink>
						</li>
					</ul>
				</nav>

				<button
					className="header_burger"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					aria-label="Menu">
					{isMobileMenuOpen ? <FaTimes /> : <FaBars />}
				</button>
			</div>
		</header>
	);
};

export default Header;
