import React from "react";
import { Navigate } from "react-router-dom";

import PurchaseProcess from "./pages/PurchaseProcess";
import GuidePage from "./pages/GuidePage";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";

import Login from "./pages/admin/Login";

// import ProtectedRoute from "./components/ProtectedRoute";

const routes = [
	// ==========================================
	// 🌍 CZĘŚĆ PUBLICZNA
	// ==========================================
	//   { path: "/", element: <Home /> },
	{ path: "/jak-zostac-opiekunem", element: <PurchaseProcess /> },
	{ path: "/poradnik", element: <GuidePage /> },
	{ path: "/o-nas", element: <AboutUs /> },
	{ path: "*", element: <NotFound /> },
	// ==========================================
	// 🔐 CZĘŚĆ ADMINA
	// ==========================================
	{ path: "/admin/login", element: <Login /> },
	//   {
	//     path: "/admin",
	//     element: (
	//       <ProtectedRoute>
	//         <AdminLayout />
	//       </ProtectedRoute>
	//     ),
	//     children: [
	//       { index: true, element: <AdminDashboard /> },
	//       { path: "*", element: <NotFound /> },
	//     ],
	//   },
];

export default routes;
