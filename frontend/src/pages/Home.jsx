import React from "react";
import HomeHero from "../components/home/HomeHero";
import HomeFeatures from "../components/home/HomeFeatures";
import HomeLitters from "../components/home/HomeLitters";
import HomeGuide from "../components/home/HomeGuide";
import HomeCTA from "../components/home/HomeCTA";

const Home = () => {
	return (
		<div className="home_page">
			<HomeHero />
			<HomeFeatures />
			<HomeLitters />
			<HomeGuide />
			<HomeCTA />
		</div>
	);
};

export default Home;
