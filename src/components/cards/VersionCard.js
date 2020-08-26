import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { getDateMMDDYYYY } from "../../utils/common";
import { Link } from "@material-ui/core";
import CardLoader from "../load/CardLoader";

const useStyles = makeStyles((theme) => ({
	cardAction: {
		display: "inline-flex",
	},
	card: {
		// display: 'flex'
		// maxWidth: 345
		// width: '100%'
	},
	cardTitle: {
		textAlign: "center",
	},
	cardDetails: {
		flex: 1,
	},
}));

export default function VersionCard(props) {
	const classes = useStyles();
	const [versionData, setVersionData] = useState({});

	useEffect(() => {
		var verData = {};
		props.data.forEach((verObj) => {
			verData[verObj.component] = {
				// componentName: verObj.component_name,
				// url: verObj.url,
				version: verObj.version,
				releaseDate: verObj.release_date,
			};
		});
		setVersionData(verData);
	}, [props.data]);

	return (
		<Grid item xs={12} sm={6} md={12}>
			<Card className="card">
				<CardLoader pageLoading={props.pageLoading} />
				<div className={classes.cardDetails}>
					<CardContent>
						<h4 className={classes.cardTitle}>Version</h4>
						<Typography>
							<span>
								<strong>Portal:</strong>
							</span>{" "}
							<Link
								href="https://wiki.glygen.org/index.php/Portal_release_notes"
								target="_blank"
								rel="noopener noreferrer">
								{versionData.software && versionData.software.version}
							</Link>{" "}
							{versionData.software &&
								" (" + getDateMMDDYYYY(versionData.software.releaseDate) + ")"}
							<br />
							<span>
								<strong>Webservice:</strong>
							</span>{" "}
							<Link
								href="https://wiki.glygen.org/index.php/API_release_notes"
								target="_blank"
								rel="noopener noreferrer">
								{versionData.api && versionData.api.version}
							</Link>{" "}
							{versionData.api &&
								// versionData.api.version +
								" (" + getDateMMDDYYYY(versionData.api.releaseDate) + ")"}
							<br />
							<span>
								<strong>Data:</strong>
							</span>{" "}
							<Link
								href="https://wiki.glygen.org/index.php/Data_release_notes"
								target="_blank"
								rel="noopener noreferrer">
								{versionData.data && versionData.data.version}
							</Link>{" "}
							{versionData.data &&
								// versionData.data.version +
								" (" + getDateMMDDYYYY(versionData.data.releaseDate) + ")"}
						</Typography>
					</CardContent>
				</div>
			</Card>
		</Grid>
	);
}

VersionCard.propTypes = {
	data: PropTypes.object,
};
