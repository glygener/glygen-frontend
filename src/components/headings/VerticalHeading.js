import React from "react";
import PropTypes from "prop-types";
// import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Grid';
import { Row, Col } from "react-bootstrap";
import Container from "@mui/material/Container";

export default function VerticalHeading(props) {
	const { post } = props;

	return (
		<div
			style={{ paddingBottom: "0" }}
			className="content-box-md"
			id={props.id}>
			<Container maxWidth="xl tab-bigscreen">
				<Row>
					<Col>
						<div className="vertical-heading">
							<h5>{post.h5VerticalText}</h5>
							<h2>
								<span>
									<strong>{post.h2textTopStrongBefore}</strong>
								</span>{" "}
								{post.h2textTop}{" "}
								<span>
									<strong>{post.h2textTopStrongAfter}</strong>
								</span>{" "}
								{post.h2textTop2} <br />
								<span>
									<strong>{post.h2textBottomStrongBefore}</strong>
								</span>{" "}
								{post.h2textBottom}{" "}
								<span>
									<strong>{post.h2textBottomStrongAfter}</strong>
								</span>{" "}
								{post.h2textBottom2}
							</h2>
							<br />
							<p>{post.pText}</p>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

VerticalHeading.propTypes = {
	post: PropTypes.object,
};
