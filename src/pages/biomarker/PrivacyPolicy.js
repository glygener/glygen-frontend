import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../../utils/biomarker/head";
import CssBaseline from "@mui/material/CssBaseline";
// import Container from '@mui/material/Container';
import VerticalHeading from "../../components/headings/VerticalHeading";
import { Row, Col } from "react-bootstrap";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import SidebarPages from "../../components/sidebar/SidebarPages";
import { logActivity } from "../../data/logging";

const useStyles = makeStyles((theme) => ({
	heading: {
		color: "#2f78b7",
	},
}));
const PrivacyPolicy = (props) => {
	const vertHeadDisclaimer = {
		h5VerticalText: "to know",
		h2textTop: "Get Familiar",
		h2textBottom: "With Our",
		h2textBottomStrongAfter: "Privacy Policy",
	};

	const classes = useStyles();
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
				{/* <title>{head.privacyPolicy.title}</title>
				{getMeta(head.privacyPolicy)} */}
				{getTitle("privacyPolicy")}
				{getMeta("privacyPolicy")}
			</Helmet>

			<CssBaseline />
			{/* <Container
				maxWidth='md'
				className='card'
				style={{ marginTop: '20px', marginBottom: '20px' }}> */}
			<Row className="gg-baseline">
				<Col sm={12} md={12} lg={12} xl={3} className="sidebar-col">
					<SidebarPages />
				</Col>
				<Col sm={12} md={12} lg={12} xl={9} className="sidebarpages-page">
					<div style={{ padding: "0 20px 0 20px" }} className="card">
						<div style={{ margin: "0 20px 40px" }}>
							<VerticalHeading post={vertHeadDisclaimer} />
							<p>
								This privacy notice discloses the privacy practices for{" "}
								<strong>Biomarker Partnership </strong> data and website.
							</p>
							<h4 className={classes.heading}>
								Information collection, use, and sharing{" "}
							</h4>
							<p>
								We are the sole owners of the information collected on this site.
								We only have access to/collect information that you voluntarily
								give us via email or other direct contact from you. We will not
								sell or rent this information to anyone.
							</p>
							<p>
								We will use your information to respond to you, regarding the
								reason you contacted us. We will not share your information with
								any third party outside of our organization, other than as
								necessary to fulfill your request.
							</p>
							<p>
								Unless you ask us not to, we may contact you via email in the
								future to tell you about specials, new products or services, or
								changes to this privacy policy.
							</p>
							<h4 className={classes.heading}>User activities logging</h4>
							<p>
								We are logging user’s activities on this site. We reserve the
								right to use information about visitors (IP addresses), date/time
								visited, page visited, referring website, etc. for site usage
								statistics and to improve our services.
							</p>
							<p>
								Logging can also enable us to track and target the interests of
								our users to enhance their experience on our site. Usage of a
								logging is optional and in no way linked to any personally
								identifiable information on our site.{" "}
								<a
									href="https://github.com/glygener/glygen-frontend/wiki/Logging-user-activity"
									target="_blank"
									rel="noopener noreferrer">
									Learn more.
								</a>
							</p>
							<p>
								You can manage your privacy settings at any time on our website{" "}
								{/* <a href='/privacy-settings'> here</a>. */}
								<Navbar.Text as={Link} to="/privacy-settings">
									here
								</Navbar.Text>
								.
							</p>
							<h4 className={classes.heading}> Links</h4>
							<p>
								This website contains links to other sites. Please be aware that
								we are not responsible for the content or privacy practices of
								such other sites. We encourage our users to be aware when they
								leave our site and to read the privacy statements of any other
								site that collects personally identifiable information.
							</p>
							<h4 className={classes.heading}>Feedback</h4>
							<p>
								We would like to know your opinion about our website and services.
								Participation in this feedback is completely voluntary and you may
								choose whether or not to participate and therefore disclose this
								information. Information requested may include contact information
								(such as name and email). Feedback information will be used for
								purposes of improving the use and satisfaction of this site.
							</p>
							<p>
								<strong>Effective Date: July 1, 2024.</strong>
							</p>
						</div>
					</div>
				</Col>
			</Row>
			{/* </Container> */}
		</React.Fragment>
	);
};
export default PrivacyPolicy;
