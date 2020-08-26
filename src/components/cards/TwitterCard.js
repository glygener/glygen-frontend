import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
// import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from "@material-ui/core/CardContent";
import { TwitterTimelineEmbed } from "react-twitter-embed";

const useStyles = makeStyles((theme) => ({
	cardAction: {
		display: "inline-flex",
		backgroundColor: "transperent",
	},
	cardTitle: {
		textAlign: "center",
	},
	cardDetails: {
		flex: 1,
	},
}));

export default function TwitterCard(props) {
	const classes = useStyles();
	// const { post } = props;

	return (
		<Grid item xs={12} sm={6} md={12}>
			{/* <Card className={classes.card}> */}
			{/* <CardActionArea className={classes.cardAction} component='a' href='#'> */}
			<Card className="card">
				<div className={classes.cardDetails}>
					<CardContent>
						<h4
							// gutterBottom
							// variant='h5'
							// component='h2'
							className={classes.cardTitle}>
							News
							{/* {post.title} */}
						</h4>
						<section className="twitterContainer">
							<div className="twitter-embed">
								<TwitterTimelineEmbed
									sourceType="profile"
									screenName="gly_gen"
									options={{
										// tweetLimit: '3',
										width: "100%",
										height: 500,
										fontSize: "16px !important",
									}}
									// theme='dark'
									noHeader="true"
									noBorders="true"
									noFooter="true"></TwitterTimelineEmbed>
							</div>
						</section>
					</CardContent>
				</div>
			</Card>
			{/* </CardActionArea> */}
			{/* </Card> */}
		</Grid>
	);
}

TwitterCard.propTypes = {
	post: PropTypes.object,
};
