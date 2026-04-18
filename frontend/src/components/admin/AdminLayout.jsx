import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { authApi } from "../../utils/api";
import toast from "react-hot-toast";
import Loader from "../ui/Loader";
import {
  LayoutDashboard,
  PawPrint,
  LogOut,
  ArrowLeft,
  Heart,
} from "lucide-react";
import "../../styles/components/admin/admin-layout.scss";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await authApi.logout();

      toast.success("Wylogowano pomyślnie!");
      navigate("/admin/login");
    } catch (error) {
      console.error("Błąd podczas wylogowywania", error);
      toast.error("Wystąpił błąd podczas wylogowywania.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { path: "/admin", Icon: LayoutDashboard, label: "Pulpit", end: true },
    { path: "/admin/chomiki", Icon: Heart, label: "Nasze Chomiki" },
    { path: "/admin/mioty", Icon: PawPrint, label: "Nasze Mioty" },
  ];

  const isDashboard = location.pathname === "/admin";

  return (
    <div className="admin-layout">
      {isLoggingOut && (
        <Loader fullPage={true} message="Trwa wylogowywanie..." />
      )}

      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <h2>
            Pretty <span>Fluffy</span>
          </h2>
          <p className="admin-subtitle">Panel Hodowcy</p>
        </div>

        <nav className="admin-sidebar__nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <item.Icon size={20} className="nav-icon" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar__footer">
          {!isDashboard ? (
            <button
              onClick={() => navigate("/admin")}
              className="mobile-back-btn"
              title="Wróć do Pulpitu"
            >
              <ArrowLeft size={20} />
              <span className="btn-text">Wstecz</span>
            </button>
          ) : (
            <div className="mobile-placeholder"></div>
          )}

          <button
            onClick={handleLogout}
            className="logout-btn"
            disabled={isLoggingOut}
          >
            <LogOut size={20} className="nav-icon" />
            <span className="btn-text">Wyloguj</span>
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <div className="admin-page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
