import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import CssBaseline from "@mui/material/CssBaseline";
// import Container from '@mui/material/Container';
import VerticalHeading from "../components/headings/VerticalHeading";
import { Row, Col } from "react-bootstrap";
import { makeStyles } from "@mui/styles";
import SidebarPages from "../components/sidebar/SidebarPages";
import { logActivity } from "../data/logging";

const useStyles = makeStyles((theme) => ({
	heading: {
		color: "#2f78b7",
	},
}));
const Disclaimer = (props) => {
	const vertHeadDisclaimer = {
		h5VerticalText: "to know",
		h2textTop: "Get Familiar",
		h2textBottom: "With",
		h2textBottomStrongAfter: "Disclaimer",
	};
	const classes = useStyles();
	useEffect(() => {
		logActivity();
	}, []);

	return (
		<>
			<Helmet>
				{/* <title>{head.disclaimer.title}</title>
				{getMeta(head.disclaimer)} */}
				{getTitle("disclaimer")}
				{getMeta("disclaimer")}
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
				<Col sm={12} md={12} lg={12} xl={9} className="sidebarpages-page card">
					<div style={{ margin: "0 20px 40px" }}>
						<VerticalHeading post={vertHeadDisclaimer} />
						<h4 className={classes.heading}>No warranties </h4>
						<p>
							This website is provided “as is” without any representations or
							warranties, express or implied. GlyGen makes no warranties
							regarding the correctness of the data, and disclaim liability for
							damages resulting from its use.
						</p>
						<p paragraph color="textSecondary">
							GlyGen cannot provide unrestricted permission regarding the use of
							the data, as some data may be covered by patents or other rights.
						</p>
						<h4 className={classes.heading}>Limitations of liability </h4>
						<p paragraph color="textSecondary">
							In no event shall GlyGen be liable for any special, direct,
							indirect, consequential, or incidental damages or any damages
							whatsoever, whether in an action of contract, negligence or other
							tort, arising out of or in connection with the use of the Service
							or the contents of the Service.
						</p>
						<p paragraph color="textSecondary">
							GlyGen reserves the right to make additions, deletions, or
							modification to the contents on the Service at any time without
							prior notice. GlyGen does not warrant that the website is free of
							viruses or other harmful components.
						</p>
						<p paragraph color="textSecondary">
							These limitations of liability apply even if GlyGen has been
							expressly advised of the potential loss.
						</p>
						<h4 className={classes.heading}>External links disclaimer </h4>
						<p paragraph color="textSecondary">
							GlyGen website may contain links to external websites that are not
							provided or maintained by or in any way affiliated with GlyGen.
							Please note that the GlyGen does not guarantee the accuracy,
							relevance, timeliness, or completeness of any information on these
							external websites.
						</p>
						<h4 className={classes.heading}>Reasonableness </h4>
						<p paragraph color="textSecondary">
							By using this website, you agree that the exclusions and
							limitations of liability set out in this website disclaimer are
							reasonable.
						</p>
						<p paragraph color="textSecondary">
							If you do not think they are reasonable, you must not use this
							website.
						</p>
						<p>
							<strong>Effective Date: September 1, 2018.</strong>
						</p>
					</div>
				</Col>
			</Row>
			{/* </Container> */}
		</>
	);
};
export default Disclaimer;
