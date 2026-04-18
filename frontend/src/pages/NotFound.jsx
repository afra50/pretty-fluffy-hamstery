import React from "react";
import Button from "../components/ui/Button";
import "../styles/pages/not_found.scss";

// Upewnij się, że struktura folderów się zgadza
import notFoundImage from "../assets/404new.webp";

const NotFound = () => {
	return (
		<div className="not_found">
			<div className="not_found_container">
				<div className="not_found_image_box">
					<img
						src={notFoundImage}
						alt="Błąd 404 - Nie znaleziono strony"
						className="not_found_image"
					/>
				</div>
				<div className="not_found_text">
					<span className="not_found_label">BŁĄD 404</span>
					<h1 className="not_found_title">Nie znaleźliśmy tej strony</h1>
					<p className="not_found_desc">
						Ups! Wygląda na to, że nasze chomiki zjadły ten link. Adres nie
						istnieje lub strona została przeniesiona.
					</p>
					<Button to="/" variant="primary">
						Wróć do strony głównej
					</Button>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
