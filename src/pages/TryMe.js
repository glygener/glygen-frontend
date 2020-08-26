import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { Row, Col } from "react-bootstrap";
import VerticalHeading from "../components/headings/VerticalHeading";
import TryMeCard from "../components/cards/TryMeCard";
import { logActivity } from "../data/logging";

const TryMe = (props) => {
	const vertHeadTryMe = {
		h5VerticalText: "Try query",
		// h5VerticalText: 'WHO WE ARE',
		h2textTop: "Ready to use queries",
		h2textBottom: "In",
		h2textBottomStrongAfter: "Try Me",
	};
	useEffect(() => {
		logActivity();
	}, []);

	return (
		<React.Fragment>
			<Helmet>
				{getTitle("tryMe")}
				{getMeta("tryMe")}
			</Helmet>

			<CssBaseline />
			<Container maxWidth="lg" className="gg-container">
				<Row>
					<Col sm={12} md={12} lg={12}>
						<VerticalHeading post={vertHeadTryMe} />
						<TryMeCard />
					</Col>
				</Row>
			</Container>
		</React.Fragment>
	);
};
export default TryMe;
