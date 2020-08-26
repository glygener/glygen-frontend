import React from "react";
// import MuiAlert from "@material-ui/lab/Alert";
// import { makeStyles } from "@material-ui/core/styles";
// import { Link } from "@material-ui/core";
import { Col, Navbar } from "react-bootstrap";
import { ReactComponent as AlertIcon } from "../../images/icons/clarity-alert-line.svg";

// const useStyles = makeStyles((theme) => ({
// 	root: {
// 		width: "100%",
// 		"& > * + *": {
// 			marginTop: theme.spacing(2),
// 			marginBottom: theme.spacing(2),
// 		},
// 	},
// }));

// function Alert(props) {
// 	return <MuiAlert elevation={6} variant="filled" {...props} />;
// }
const link = (
	<a
		href="https://wiki.glygen.org/index.php/Main_Page"
		target="_blank"
		rel="noopener noreferrer">
		{" "}
		Read more...
	</a>
);

export default function BunnerHotTopic() {
	// const classes = useStyles();

	return (
		<div
		// className={ classes.root }
		>
			{/* <Alert
				severity="error"
				classes={{
					message: "alert-banner-message",
					icon: "alert-banner-icon gg-align-middle",
				}}>
				<h4>Alert Title</h4>
				This is a message of type red!
				{link}
			</Alert>
			<Alert
				severity="warning"
				classes={{
					message: "alert-banner-message",
					icon: "alert-banner-icon gg-align-middle",
				}}>
				<h4>Alert Title</h4>
				This is a message of type yellow!
				{link}
			</Alert>
			<Alert
				severity="info"
				classes={{
					message: "alert-banner-message",
					icon: "alert-banner-icon gg-align-middle",
				}}>
				<h4>Alert Title</h4>
				This is a message of type blue!
				{link}
			</Alert>
			<Alert
				severity="success"
				classes={{
					message: "alert-banner-message",
					icon: "alert-banner-icon gg-align-middle",
				}}>
				<h4>Alert Title</h4>
				This is a message of type green!
				{link}
			</Alert> */}
			{/* <Alert
				icon={false}
				className="alert-banner-darkgrey"
				classes={{ message: "alert-banner-message" }}>
				<h4>Alert Title</h4>
				This is a message of type darkgrey!
				{link}
			</Alert> */}
			<Navbar className="banner-bg" expand="xl">
				{/* <Row className="banner-bg" style={{ width: "100%" }}> */}
				<Col xs={1} sm={1} className="gg-align-middle gg-align-center">
					<AlertIcon />
				</Col>
				<Col xs={12} sm={"auto"} className="banner-info">
					<h5>Banner Title</h5>
					<p>This is a bunner message of type info 1.</p>
					{link}
				</Col>
				<Col xs={12} sm={"auto"} className="banner-info">
					<h5>Banner Title</h5>
					<p>This is a bunner message of type info 2.</p>
					{link}
				</Col>
				<Col xs={12} sm={"auto"} className="banner-info">
					<h5>Banner Title</h5>
					<p>This is a bunner message of type info 3.</p>
					{link}
				</Col>
				{/* </Row> */}
			</Navbar>
		</div>
	);
}
