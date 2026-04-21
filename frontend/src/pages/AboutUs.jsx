import React, { useState, useEffect, useRef } from "react";
// ==========================================
// === IMPORTY ZDJĘĆ (Podmień na swoje ścieżki!)
// ==========================================
import heroImage from "../assets/4.jpg";
import imgKlementyna from "../assets/klementyna-dyplom.jpg";
import imgKrokiet from "../assets/krokiet.jpg";
import imgChomikarium from "../assets/chomikarium.jpg";
import imgJedzenie from "../assets/5.jpg";
import imgWroclaw from "../assets/wroclaw.webp";

import "../styles/pages/about-us.scss";

// ==========================================
// === DANE OPOWIEŚCI
// ==========================================
const storySections = [
	{
		id: 0,
		title: "Początki z Wysokiego C",
		content:
			"Wystartowaliśmy w 2021 roku we Wrocławiu i od razu zawiesiliśmy poprzeczkę najwyżej, jak się dało. Zamiast cichego debiutu, nasza samica – RHS Clementine – zdobyła drugie miejsce na 14. Międzynarodowej Wystawie Český křeččí klub w Pradze. Od początku wiedzieliśmy, że nie interesuje nas bylejakość.",
		image: imgKlementyna,
		placeholder: "Zdjęcie Klementyny z dyplomem",
	},
	{
		id: 1,
		title: "Europejska Elita",
		content:
			"Nie rozmnażamy zwierząt z przypadku. Nasze linie genetyczne to efekt selekcji i importu od najlepszych hodowców z Europy (m.in. trasy z zachodnich Niemiec po 900 km). Jesteśmy dumnym członkiem 1. Deutschen Hamstervereinigung e.V. oraz Český křeččí klub. Gwarantujemy czystość linii, żelazne zdrowie i udokumentowane rodowody.",
		image: imgKrokiet,
		placeholder: "Zdjęcie chomika z importu",
	},
	{
		id: 2,
		title: "Chomikaria, nie Klatki",
		content:
			"U nas nie uświadczysz plastikowych klatek z zoologicznego. Zbudowaliśmy potężne, modułowe wieże. Jedno lokum to 1,1 m² powierzchni i ponad 260 litrów ściółki ułożonej na 27 centymetrów grubości. Dajemy im gigantyczną przestrzeń, wielokomorowe podziemne domki i potężne kołowrotki, aby mogły realizować swoje naturalne instynkty.",
		image: imgChomikarium,
		placeholder: "Wielkie drewniane chomikarium",
	},
	{
		id: 3,
		title: "Charakter to Podstawa",
		content:
			"Genetyka i standardy to jedno, ale na koniec dnia to wciąż członkowie naszej rodziny. Pielęgnujemy ich indywidualne cechy – od spokojnych 'inżynierów' drążących niekończące się tunele, po bystre, asertywne manipulatorki, które potrafią wyciągnąć od nas ostatniego orzeszka. Znamy na wylot każdego malucha, który opuszcza nasz dom.",
		image: imgJedzenie,
		placeholder: "Słodkie zdjęcie przy jedzeniu",
	},
	{
		id: 4,
		title: "Znajdź nas we Wrocławiu",
		content:
			"Nasza hodowla mieści się w sercu Dolnego Śląska. Choć nie jesteśmy sklepem zoologicznym, do którego można po prostu wejść z ulicy, z radością witamy przyszłych opiekunów po wcześniejszym, dokładnym wywiadzie i umówieniu wizyty. Zawsze służymy radą, pomocą w kompletowaniu wyprawki i wsparciem na każdym etapie życia zwierzaka.",
		image: imgWroclaw,
		placeholder: "Zdjęcie Wrocławia lub wspólne z opiekunami",
	},
];

// ==========================================
// === GŁÓWNY KOMPONENT
// ==========================================
const AboutUs = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const textRefs = useRef([]);

	// ==========================================
	// === OBSERWATOR SCROLLA
	// ==========================================
	useEffect(() => {
		const observerOptions = {
			root: null,
			rootMargin: "-40% 0px -40% 0px",
			threshold: 0,
		};

		const observerCallback = (entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const index = parseInt(entry.target.getAttribute("data-index"));
					setActiveIndex(index);
				}
			});
		};

		const observer = new IntersectionObserver(
			observerCallback,
			observerOptions,
		);

		textRefs.current.forEach((ref) => {
			if (ref) observer.observe(ref);
		});

		return () => {
			textRefs.current.forEach((ref) => {
				if (ref) observer.unobserve(ref);
			});
		};
	}, []);

	// ==========================================
	// === RENDER STRONY
	// ==========================================
	return (
		<section className="about_us_cinematic">
			{/* --- HERO SEKACJA (Teraz ze zdjęciem w tle) --- */}
			<div className="cinematic_hero">
				{/* Zaimportowane zdjęcie tła */}
				<img
					src={heroImage}
					alt="Nasza Hodowla"
					className="cinematic_hero_bg"
				/>
				<div className="cinematic_hero_overlay"></div>

				<div className="cinematic_hero_content">
					<h1 className="cinematic_hero_title">Pretty Fluffy Hamstery</h1>
					<p className="cinematic_hero_subtitle">
						Zarejestrowana Hodowla Chomików Rodowodowych • Wrocław
					</p>
					<div className="cinematic_scroll_indicator">
						↓ Poznaj nasze zasady ↓
					</div>
				</div>
			</div>

			{/* --- KONTENER STORYTELLINGU --- */}
			<div className="cinematic_story_container">
				{/* LEWA STRONA: Scrollujący się tekst */}
				<div className="cinematic_text_side">
					{storySections.map((section, index) => (
						<div
							key={section.id}
							className={`cinematic_text_block ${activeIndex === index ? "active" : ""}`}
							ref={(el) => (textRefs.current[index] = el)}
							data-index={index}>
							<h2 className="cinematic_text_title">{section.title}</h2>
							<p className="cinematic_text_desc">{section.content}</p>
						</div>
					))}
				</div>

				{/* PRAWA STRONA: Przyklejone zdjęcie (zmieniające się) */}
				<div className="cinematic_visual_side">
					{storySections.map((section, index) => (
						<div
							key={`img-${section.id}`}
							className={`cinematic_image_wrapper ${activeIndex === index ? "active" : ""}`}>
							{section.image ? (
								<img
									src={section.image}
									alt={section.title}
									className="cinematic_img"
								/>
							) : (
								<div className="cinematic_image_placeholder">
									<span>{section.placeholder}</span>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default AboutUs;
