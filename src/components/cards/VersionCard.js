import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { getDateMMDDYYYY } from "../../utils/common";
import { Link } from "@mui/material";
import CardLoader from "../load/CardLoader";

const PREFIX = 'VersionCard';

const classes = {
    cardAction: `${PREFIX}-cardAction`,
    card: `${PREFIX}-card`,
    cardTitle: `${PREFIX}-cardTitle`,
    cardDetails: `${PREFIX}-cardDetails`
};

const StyledGrid = styled(Grid)((
    {
        theme
    }
) => ({
    [`& .${classes.cardAction}`]: {
		display: "inline-flex",
	},

    [`& .${classes.card}`]: {
		// display: 'flex'
		// maxWidth: 345
		// width: '100%'
	},

    [`& .${classes.cardTitle}`]: {
		textAlign: "center",
	},

    [`& .${classes.cardDetails}`]: {
		flex: 1,
	}
}));

export default function VersionCard(props) {

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
        <StyledGrid item size={{ xs: 12, sm: 6, md: 12 }}>
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
        </StyledGrid>
    );
}

VersionCard.propTypes = {
	data: PropTypes.object,
};
