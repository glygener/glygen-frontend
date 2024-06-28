import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../../utils/biomarker/head";
import CssBaseline from "@mui/material/CssBaseline";
import StoryAboutUs from "../../components/about/biomarker/StoryAboutUs";
import OurTeam from "../../components/about/biomarker/OurTeam";
import { logActivity } from "../../data/logging";
// import "../css/About-map.css";

const About = (props) => {
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
		logActivity();
	}, []);

	return (
		<React.Fragment>
			<Helmet>
				{getTitle("about")}
				{getMeta("about")}
			</Helmet>

			<CssBaseline />
			<div style={{ backgroundColor: "#fff" }}>
				<StoryAboutUs />
				<OurTeam />
			</div>
		</React.Fragment>
	);
};
export default About;
