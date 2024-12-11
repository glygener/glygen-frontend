import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import VerticalHeading from "../components/headings/VerticalHeading";
import { Row, Col } from "react-bootstrap";
import RoomIcon from "@mui/icons-material/Room";
// import GoogleMap from "../components/contactUs/GoogleMap";
import ContactForm from "../components/contactUs/ContactForm";
import { logActivity } from "../data/logging";
import Iframe from "react-iframe";
import "../css/Responsive.css";
import {
	GLYGEN_BUILD
  } from "../envVariables";

const mapContainer = {
	position: "relative",
	overflow: "hidden",
	width: "100%",
	margin: "0 auto",
};

const univNameFooter = {
	color: "#fff",
	position: "relative",
	background: "#777",
	height: "50px",
	borderBottomLeftRadius: "8px",
	borderBottomRightRadius: "8px",
	marginBottom: "40px",
};

const ContactUs = (props) => {
	const vertHeadContactUs = {
		h5VerticalText: "MESSAGES",
		// h5VerticalText: 'WHO WE ARE',
		h2textTop: "Get",
		h2textBottom: "In",
		h2textBottomStrongAfter: "Touch",
		pText:
			"We always welcome questions, comments, and suggestions regarging our website and information we provide in general. We will make every effort to respond to you within a reasonable amount of time.",
	};
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
				{/* <title>{head.contactUs.title}</title>
				{getMeta(head.contactUs)} */}
				{getTitle("contactUs")}
				{getMeta("contactUs")}
			</Helmet>

			<CssBaseline />
			<Container maxWidth="lg" className="gg-container5 tab-bigscreen">
				<Row>
					{/* Contact Left*/}
					<Col sm={12} md={12} lg={6}>
						<VerticalHeading post={vertHeadContactUs} />
						{/* <div> */}
						{GLYGEN_BUILD === "glygen" && <Row style={{ paddingTop: "20px" }}>
							<Col sm={12} md={6} lg={6} className="contact-univ-address">
								<h3>
									<span>
										<RoomIcon style={{ fontSize: 30, color: "#444" }} />
									</span>{" "}
									UGA Location
								</h3>
								<h5>The University of Georgia</h5>
								<ul className="office-details">
									<li>
										<strong>Complex Carbohydrate Research Center</strong>
									</li>
									<li>315 Riverbend Road,</li>
									<li>Athens, Georgia 30602 USA </li>
								</ul>
							</Col>
							<Col sm={12} md={6} lg={6} className="contact-univ-address">
								<h3>
									<span>
										<RoomIcon style={{ fontSize: 30, color: "#444" }} />
									</span>{" "}
									GW Location
								</h3>
								<h5>The George Washington University</h5>
								<ul className="office-details">
									<li>
										<strong>School of Medicine and Health Sciences</strong>
									</li>
									<li>2300 Eye Street N.W.,</li>
									<li>Washington, DC 20037 USA </li>
								</ul>
							</Col>
						</Row>}
						{/* </div> */}
					</Col>
					{/* Contact Right */}
					<Col sm={12} md={12} lg={6} className="content-box-md">
						<div className="contact-right">
							<ContactForm />
						</div>
					</Col>
				</Row>
			</Container>
			{GLYGEN_BUILD === "glygen" && <Row style={mapContainer}>
				<Col xs={12} sm={6}>
					<Iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52966.457259584626!2d-83.38527272292191!3d33.93074668733138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f66c59c9de4d63%3A0xf492ef3dfc14c69d!2s315%20Riverbend%20Rd%2C%20Athens%2C%20GA%2030602!5e0!3m2!1sen!2sus!4v1595619413875!5m2!1sen!2sus"
						width="100%"
						height="350"
						frameborder="0"
						style={{ border: 0 }}
						allowfullscreen=""
						aria-hidden="false"
						tabindex="0"></Iframe>
					<div
						style={univNameFooter}
						className="gg-align-center gg-align-middle">
						<h4 className="color-white">UGA Athens Georgia</h4>
					</div>
				</Col>
				<Col sm={6}>
					<Iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24840.349784171747!2d-77.06876432640271!3d38.90011545428829!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7b7b17e2c6205%3A0x119161a44861715a!2s2300%20I%20St%20NW%2C%20Washington%2C%20DC%2020052!5e0!3m2!1sen!2sus!4v1595619835045!5m2!1sen!2sus"
						width="100%"
						height="350"
						frameborder="0"
						style={{ border: 0 }}
						allowfullscreen=""
						aria-hidden="false"
						tabindex="0"></Iframe>
					<div
						style={univNameFooter}
						className="gg-align-center gg-align-middle">
						<h4 className="color-white">GW Washington DC</h4>
					</div>
				</Col>

				{/* <GoogleMap /> */}
			</Row>}
		</React.Fragment>
	);
};
export default ContactUs;
