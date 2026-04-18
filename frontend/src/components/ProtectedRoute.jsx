import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import Loader from "./ui/Loader"; // Upewnij się, że masz ten komponent!

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // "checking" - sprawdzamy z backendem, "authed" - zalogowany, "guest" - brak uprawnień
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let alive = true;

    const checkSession = async () => {
      try {
        // Nasz api.js automatycznie dołączy ciastka dzięki { withCredentials: true }
        await api.get("/auth/me");
        if (alive) setStatus("authed");
      } catch (err) {
        if (alive) {
          setStatus("guest");
          // Jeśli brak uprawnień, przekieruj do logowania,
          // ale zapamiętaj gdzie admin chciał wejść (state: { from: location })
          navigate("/admin/login", {
            state: { from: location },
            replace: true,
          });
        }
      }
    };

    checkSession();

    return () => {
      alive = false;
    };
  }, [navigate, location]);

  if (status === "checking") {
    // Pokazujemy loader na czas zapytania do backendu
    return <Loader fullPage={true} message="Weryfikacja uprawnień..." />;
  }

  if (status === "guest") {
    return null; // Zabezpieczenie wizualne - przekierowanie dzieje się w useEffect
  }

  // Jeśli "authed", renderujemy zawartość admina
  return children;
}
