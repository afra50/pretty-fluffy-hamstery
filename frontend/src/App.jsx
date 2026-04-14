import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"; // <-- Wraca na swoje miejsce
import routes from "./routes";

import "./styles/components/ui/toast.scss";

function AppRoutes() {
	const element = useRoutes(routes);
	return element;
}

export default function App() {
	return (
		<Router>
			{/* Nasz nowy, mądry ScrollToTop */}
			<ScrollToTop />

			{/* GLOBALNY KONTENER POWIADOMIEŃ */}
			<Toaster
				position="top-center"
				toastOptions={{
					className: "hamstery_toast",
					duration: 3000,
					style: {
						maxWidth: "500px",
					},
					success: {
						className: "hamstery_toast hamstery_toast_success",
						iconTheme: {
							primary: "#4e8588",
							secondary: "#fdfbf7",
						},
					},
					error: {
						className: "hamstery_toast hamstery_toast_error",
						iconTheme: {
							primary: "#cc8da0",
							secondary: "#fdfbf7",
						},
					},
				}}
			/>

			<div className="App">
				<Header />
				<AppRoutes />
				<Footer />
			</div>
		</Router>
	);
}
