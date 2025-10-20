import React from "react";
import { styled } from '@mui/material/styles';
import PropTypes from "prop-types";
// import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
// import Hidden from "@mui/material/Hidden";
import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";

const PREFIX = 'InfoCard';

const classes = {
    cardAction: `${PREFIX}-cardAction`,
    cardTitle: `${PREFIX}-cardTitle`,
    cardDetails: `${PREFIX}-cardDetails`,
    cardMedia: `${PREFIX}-cardMedia`,
    divider: `${PREFIX}-divider`
};

const StyledGrid = styled(Grid)((
    {
        theme
    }
) => ({
    [`& .${classes.cardAction}`]: {
		cursor: "pointer !important",
	},

    [`& .${classes.cardTitle}`]: {
		textAlign: "center",
	},

    [`& .${classes.cardDetails}`]: {
		flex: 1,
	},

    [`& .${classes.cardMedia}`]: {
		margin: "0 auto",
	},

    [`& .${classes.divider}`]: {
		margin: theme.spacing(2, 1),
	}
}));

export default function InfoCard(props) {

	const { post } = props;

	return (
        <StyledGrid item size= {{ xs: 12, sm: 6, md: 12 }}>
            {/* <Card className={classes.card}> */}
            <Link to={post.to} className={classes.cardAction}>
				{/* <CardActionArea> */}
				<Card className="card">
					<div className={classes.cardDetails}>
						<CardContent style={{ paddingBottom: "0" }}>
							<h4 className="text-center">{post.title}</h4>
							{/* <Hidden xsDown> */}
							<CardMedia
								component="img"
								className={classes.cardMedia}
								image={post.image}
								title={post.imageTitle}
							/>
							{/* </Hidden> */}
							<p>{post.description}</p>
							<Divider className={classes.divider} />
							<p
								className="text-center"
								style={{ fontWeight: "bold", color: "#2f78b7" }}>
								{post.button}
							</p>
						</CardContent>
					</div>
				</Card>
				{/* </CardActionArea> */}
				{/* </Card> */}
			</Link>
        </StyledGrid>
    );
}

InfoCard.propTypes = {
	post: PropTypes.object,
};
