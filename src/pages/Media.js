import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { Row, Col } from "react-bootstrap";
import OurTalks from "../components/media/OurTalks";
import Portfolio from "../components/media/Portfolio";
import ForMembers from "../components/media/ForMembers";
import { logActivity } from "../data/logging";

const Media = (props) => {
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
				{getTitle("media")}
				{getMeta("media")}
			</Helmet>
			<Row className="gg-baseline-page">
				<Col xs={12} sm={12} md={12} lg={12}>
					<OurTalks />
					<Portfolio />
					<ForMembers />
				</Col>
			</Row>
		</React.Fragment>
	);
};
export default Media;
