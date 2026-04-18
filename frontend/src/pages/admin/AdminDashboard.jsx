import React from "react";
import { Link } from "react-router-dom";
import { PawPrint, Heart } from "lucide-react";
import "../../styles/pages/admin/admin-dashboard.scss";

const AdminDashboard = () => {
  const sections = [
    {
      id: "hamsters",
      title: "Nasze Chomiki",
      desc: "Zarządzaj danymi swoich dorosłych chomików, dodawaj zdjęcia i opisy.",
      icon: <Heart size={36} />,
      link: "/admin/chomiki",
    },
    {
      id: "litters",
      title: "Nasze Mioty",
      desc: "Zarządzaj informacjami o aktualnych i planowanych miotach.",
      icon: <PawPrint size={36} />,
      link: "/admin/mioty",
    },
  ];

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__intro">
        <h1 className="cute-title">Dzień dobry!</h1>
        <p>Co dzisiaj robimy w hodowli?</p>
      </header>

      <div className="admin-dashboard__grid">
        {sections.map((section) => (
          <Link to={section.link} key={section.id} className="admin-card">
            <div className="admin-card__icon">{section.icon}</div>
            <div className="admin-card__info">
              <h2>{section.title}</h2>
              <p>{section.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
