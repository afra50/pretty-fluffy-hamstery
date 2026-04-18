import { Loader2 } from "lucide-react";
import "../../styles/components/ui/loader.scss";

const Loader = ({ fullPage = false, message = "Ładowanie..." }) => {
	return (
		<div className={`loader_container ${fullPage ? "loader_full" : ""}`}>
			<div className="loader_content">
				<Loader2 className="loader_spinner" size={40} />
				{message && <p className="loader_text">{message}</p>}
			</div>
		</div>
	);
};

export default Loader;
