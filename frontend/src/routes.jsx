import React from "react";
import { Navigate } from "react-router-dom";

// --- Importy stron publicznych ---
import PurchaseProcess from "./pages/PurchaseProcess";
import GuidePage from "./pages/GuidePage";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import OurHamsters from "./pages/OurHamsters";
import Home from "./pages/Home";

// --- Importy Admina ---
import Login from "./pages/admin/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHamsters from "./pages/admin/AdminHamsters";

const routes = [
	// ==========================================
	// 🌍 CZĘŚĆ PUBLICZNA
	// ==========================================
	{ path: "/jak-zostac-opiekunem", element: <PurchaseProcess /> },
	{ path: "/poradnik", element: <GuidePage /> },
	{ path: "/o-nas", element: <AboutUs /> },
	{ path: "/nasze-chomiki", element: <OurHamsters /> },
	{ path: "/", element: <Home /> },
	{ path: "*", element: <NotFound /> },
	// ==========================================
	// 🔐 CZĘŚĆ ADMINA
	// ==========================================
	{ path: "/admin/login", element: <Login /> },

	{
		path: "/admin",
		element: (
			// ProtectedRoute blokuje dostęp niepowołanym
			<ProtectedRoute>
				{/* AdminLayout to wrapper, np. navbar + sidebar + <Outlet /> */}
				<AdminLayout />
			</ProtectedRoute>
		),
		children: [
			// Domyślny widok po wejściu na "/admin"
			{ index: true, element: <AdminDashboard /> },

			// { path: "mioty", element: <AdminLitters /> },
			{ path: "chomiki", element: <AdminHamsters /> },

			// Zabezpieczenie przed wpisaniem np. /admin/niewiadomoco
			{ path: "*", element: <NotFound /> },
		],
	},
];

export default routes;
