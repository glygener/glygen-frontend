import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
// import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
// import Hidden from "@mui/material/Hidden";
import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	cardAction: {
		cursor: "pointer !important",
	},
	cardTitle: {
		textAlign: "center",
	},
	cardDetails: {
		flex: 1,
	},
	cardMedia: {
		margin: "0 auto",
	},
	divider: {
		margin: theme.spacing(2, 1),
	},
}));

export default function InfoCard(props) {
	const classes = useStyles();
	const { post } = props;

	return (
		<Grid item xs={12} sm={6} md={12}>
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
		</Grid>
	);
}

InfoCard.propTypes = {
	post: PropTypes.object,
};
