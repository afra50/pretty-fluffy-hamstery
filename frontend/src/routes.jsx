import React from "react";
import { Navigate } from "react-router-dom";

// --- Importy stron publicznych ---
import PurchaseProcess from "./pages/PurchaseProcess";
import GuidePage from "./pages/GuidePage";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";

// --- Importy Admina ---
import Login from "./pages/admin/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

const routes = [
  // ==========================================
  // 🌍 CZĘŚĆ PUBLICZNA
  // ==========================================
  { path: "/jak-zostac-opiekunem", element: <PurchaseProcess /> },
  { path: "/poradnik", element: <GuidePage /> },
  { path: "/o-nas", element: <AboutUs /> },
  { path: "*", element: <NotFound /> }, // Fallback dla nieistniejących stron publicznych

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

      // Miejsce na przyszłe widoki, np.:
      // { path: "mioty", element: <AdminLitters /> },
      // { path: "zwierzeta", element: <AdminAnimals /> },

      // Zabezpieczenie przed wpisaniem np. /admin/niewiadomoco
      { path: "*", element: <NotFound /> },
    ],
  },
];

export default routes;
