import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import CssBaseline from "@mui/material/CssBaseline";
import PropTypes from "prop-types";
import Container from "@mui/material/Container";
import VerticalHeading from "../components/headings/VerticalHeading";
import { Row, Col } from "react-bootstrap";
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import { useState } from "react";
import { logActivity, isLoggingUserActivity } from "../data/logging";

const PrivacySettings = (props) => {
	const vertHeadDisclaimer = {
		h5VerticalText: "Settings",
		h2textTop: "Manage",
		h2textBottom: "Your",
		h2textBottomStrongAfter: "Privacy Settings",
	};

	const [enabled, setEnabled] = useState(props.userTrackingBannerState === "track" ? true : props.userTrackingBannerState === "donottrack" ? false : isLoggingUserActivity());
	
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
				{/* <title>{head.privacySettings.title}</title>
				{getMeta(head.privacySettings)} */}
				{getTitle("privacySettings")}
				{getMeta("privacySettings")}
			</Helmet>

			<CssBaseline />
			<Container
				maxWidth="md"
				className="card"
				style={{ marginTop: "20px", marginBottom: "20px" }}>
				<VerticalHeading post={vertHeadDisclaimer} />
				<Row>
					<Col style={{ paddingBottom: "40px" }}>
						<Col md={10} className="contact-right" style={{ margin: "0 auto" }}>
							{enabled && (
								<p>
									GlyGen is monitoring your searches to improve/streamline your
									interaction with our system.{" "}
									<a
										href="https://github.com/glygener/glygen-frontend/wiki/Logging-user-activity"
										target="_blank"
										rel="noopener noreferrer">
										Learn more.
									</a>
								</p>
							)}

							{!enabled && (
								<p>
									GlyGen is NOT currently monitoring your searches; you can
									improve/streamline your searches by allowing GlyGen to monitor
									your interaction with our system. For example, your searches
									can be recorded so you can review them at a later date.{" "}
									<a
										href="https://github.com/glygener/glygen-frontend/wiki/Logging-user-activity"
										target="_blank"
										rel="noopener noreferrer">
										Learn more.
									</a>
								</p>
							)}
							<hr />

							<Row>
								<Col sm={9} className="text-left">
									User Selection
									<br />
									{!enabled && (
										<span style={{ color: "#999999" }}>Disabled</span>
									)}
									{enabled && <span style={{ color: "#3277b7" }}>Enabled</span>}
								</Col>

								<Col sm={3} className="text-right">
									<Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
										<Typography>Off</Typography>
										<Switch defaultChecked
											checked={enabled}
											onChange={(event) => {
												setEnabled(event.target.checked);
												event.target.checked ? props.setUserTrackingBannerState("track") : props.setUserTrackingBannerState("donottrack");
											}}
										/>
										<Typography>On</Typography>
									</Stack>
								</Col>
							</Row>
						</Col>
					</Col>
				</Row>
			</Container>
		</>
	);
};
export default PrivacySettings;

PrivacySettings.propTypes = {
    userTrackingBannerState: PropTypes.string
};
