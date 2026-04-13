import React from "react";
import { Navigate } from "react-router-dom";

import PurchaseProcess from "./pages/PurchaseProcess";

// import ProtectedRoute from "./components/ProtectedRoute";

const routes = [
  // ==========================================
  // 🌍 CZĘŚĆ PUBLICZNA
  // ==========================================
  //   { path: "/", element: <Home /> },
  { path: "/jak-zostac-opiekunem", element: <PurchaseProcess /> },
  //   { path: "*", element: <NotFound /> },
  // ==========================================
  // 🔐 CZĘŚĆ ADMINA
  // ==========================================
  //   { path: "/admin/login", element: <Login /> },
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
