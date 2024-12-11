import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import HorizontalHeading from "../components/headings/HorizontalHeading";
import { Col } from "react-bootstrap";
import Iframe from "react-iframe";
import { logActivity } from "../data/logging";

export default function Feedback() {
	const horizontalHeadingFeedback = {
		h5VerticalText: "feedback",
		h2textTop: "Your Opinion Matters",
		h2textBottom: "Leave",
		h2textBottomStrongAfter: "Feedback",
	};
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
		logActivity();
	}, []);

	return (
		<>
			<Helmet>
				{/* <title>{head.feedback.title}</title>
				{getMeta(head.feedback)} */}
				{getTitle("feedback")}
				{getMeta("feedback")}
			</Helmet>

			<CssBaseline />
			<Container maxWidth="xl" className="gg-container tab-bigscreen">
				<HorizontalHeading post={horizontalHeadingFeedback} />
				<Col>
					<Iframe
						src="https://docs.google.com/forms/d/e/1FAIpQLSehYoalCh_Q9fonINNpWpONDKjQnmO0d3meyJYiZyTqmCxPbQ/viewform?embedded=true"
						width="100%"
						height="1700"
						frameborder="0"
						marginheight="0"
						marginwidth="0"
						frameBorder="0">
						Loading...
					</Iframe>
				</Col>
			</Container>
		</>
	);
}
