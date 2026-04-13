import React from "react";
import "../../styles/components/ui/hero-banner.scss";

const HeroBanner = ({ title, subtitle, image }) => {
  return (
    <section className="hero-banner">
      <div className="banner-overlay"></div>
      <img className="banner-img" src={image} alt={title} />
      <div className="banner-content">
        <h1 className="title">{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>
    </section>
  );
};

export default HeroBanner;
