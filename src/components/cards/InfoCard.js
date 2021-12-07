import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
// import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
// import Hidden from "@material-ui/core/Hidden";
import Divider from "@material-ui/core/Divider";
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
