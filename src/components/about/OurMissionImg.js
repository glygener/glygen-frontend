import React from "react";
import { styled } from '@mui/material/styles';
import PropTypes from "prop-types";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import missionBgImg from "../../images/about/about-mission.png";

const PREFIX = 'OurMissionImg';

const classes = {
    mainFeaturedCard: `${PREFIX}-mainFeaturedCard`,
    overlay: `${PREFIX}-overlay`,
    mainFeaturedCardContent: `${PREFIX}-mainFeaturedCardContent`
};

const StyledPaper = styled(Paper)((
    {
        theme
    }
) => ({
    [`&.${classes.mainFeaturedCard}`]: {
		position: "relative",
		backgroundColor: theme.palette.grey[800],
		color: theme.palette.common.white,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
	},

    [`& .${classes.overlay}`]: {
		position: "absolute",
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
		backgroundColor: "rgba(0,0,0,.3)",
	},

    [`& .${classes.mainFeaturedCardContent}`]: {
		position: "relative",
		textAlign: "center",
		padding: theme.spacing(6),
		[theme.breakpoints.up("md")]: {
			padding: theme.spacing(12),
		},
	}
}));

export default function OurMissionImg(props) {

	const { post } = props;

	return (
        <StyledPaper
			className={classes.mainFeaturedCard}
			style={{ backgroundImage: `url(${missionBgImg})` }}>
            {
				<img
					style={{ display: "none" }}
					src={missionBgImg}
					alt="our mission background img"
				/>
			}
            <div className={classes.overlay} />
            <Grid container>
				<Grid item size= {{ sm: 12, md: 12 }}>
					<div className={classes.mainFeaturedCardContent}>
						<Typography
							style={{ fontWeight: "200" }}
							component="h1"
							variant="h4"
							color="inherit"
							gutterBottom>
							Our <span style={{ fontWeight: "900" }}>Mission</span>
						</Typography>
						<br />
						<Typography component="h1" variant="h5" color="inherit" paragraph>
							{post.description}
						</Typography>
						<Typography component="h1" variant="h5" color="inherit" paragraph>
							{post.description2}
						</Typography>
						<Typography component="h1" variant="h5" color="inherit" paragraph>
							{post.description3}
						</Typography>
					</div>
				</Grid>
			</Grid>
        </StyledPaper>
    );
}

OurMissionImg.propTypes = {
	post: PropTypes.object,
};
