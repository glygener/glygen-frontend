import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import Iframe from "react-iframe";

const useStyles = makeStyles((theme) => ({
	cardDetails: {
		flex: 1,
	},
	divider: {
		margin: theme.spacing(2, 1),
	},
}));

export default function VideoCard(props) {
	const classes = useStyles();
	const { post, data } = props;

	return (
		<Grid item xs={12} sm={6} md={12}>
			<Card className="card">
				<div className={classes.cardDetails}>
					<CardContent style={{ paddingBottom: "0" }}>
						<h4 className="text-center">{post.title}</h4>
						<div className="center p-1">
							<Iframe
								width="100%"
								height="100%"
								src={data.url}
								frameBorder="0"
								scrolling="no"
								allow="encrypted-media"
								allowFullScreen={false}>
							</Iframe>
						</div>
						<Divider className={classes.divider} />
						<p
							className="text-center"
							style={{ fontWeight: "bold", color: "#2f78b7" }}>
							<a
								href="https://www.youtube.com/channel/UCqfvlu86I7n71iqCG5yx8bg"
								target="_blank"
								rel="noopener noreferrer"
							>
								{post.button}
							</a>
						</p>
					</CardContent>
				</div>
			</Card>
		</Grid>
	);
}

VideoCard.propTypes = {
	post: PropTypes.object,
};
