import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "./Button";
import "../../styles/components/ui/error_state.scss";

const ErrorState = ({
	title = "Coś poszło nie tak",
	message = "Nie udało się załadować danych. Spróbuj odświeżyć stronę.",
	onRetry,
}) => {
	return (
		<div className="error_state">
			<div className="error_state_content">
				<div className="error_state_icon">
					<AlertTriangle size={48} />
				</div>
				<h2 className="error_state_title">{title}</h2>
				<p className="error_state_message">{message}</p>

				{onRetry && (
					<Button
						variant="primary" // ZMIANA: pełny kolor od startu
						onClick={onRetry}
						className="error_state_button">
						<RefreshCw size={18} />
						Spróbuj ponownie
					</Button>
				)}
			</div>
		</div>
	);
};

export default ErrorState;
