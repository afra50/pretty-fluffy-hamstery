import React from "react";
import HomeHero from "../components/home/HomeHero";
import HomeFeatures from "../components/home/HomeFeatures";
import HomeLitters from "../components/home/HomeLitters";
import HomeFacebookFeed from "../components/home/HomeFacebookFeed";
import HomeGuide from "../components/home/HomeGuide";
import HomeCTA from "../components/home/HomeCTA";

const Home = () => {
  return (
    <div className="home_page">
      <HomeHero />
      <HomeFeatures />
      <HomeLitters />
      <HomeFacebookFeed /> {/* <-- DODANE TUTAJ */}
      <HomeGuide />
      <HomeCTA />
    </div>
  );
};

export default Home;
