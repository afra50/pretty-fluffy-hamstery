import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import "../styles/components/ui/scroll-to-top.scss";

const ScrollToTop = () => {
	const [isVisible, setIsVisible] = useState(false);
	const { pathname } = useLocation();

	// 1. Automatyczne przewijanie na górę przy zmianie podstrony
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	// 2. Pokazywanie/ukrywanie przycisku
	useEffect(() => {
		const toggleVisibility = () => {
			if (window.scrollY > 300) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", toggleVisibility);
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	// 3. Płynne przewijanie do góry po kliknięciu
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<button
			className={`scroll_to_top ${isVisible ? "visible" : ""}`}
			onClick={scrollToTop}
			aria-label="Wróć na górę">
			<FaArrowUp />
		</button>
	);
};

export default ScrollToTop;
