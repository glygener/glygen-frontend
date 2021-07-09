import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
// import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
// import Hidden from '@material-ui/core/Hidden';
import Divider from "@material-ui/core/Divider";
import { GLYGEN_BASENAME } from "../../envVariables";

const useStyles = makeStyles((theme) => ({
  cardAction: {
    display: "inline-flex",
    cursor: "pointer !important",
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

export default function FeaturedCard(props) {
  const classes = useStyles();
  const { post } = props;

  function CardFeatured(props) {
    return (
      <Card className="card">
        {/* <Hidden xsDown> */}
        <CardMedia
          component="img"
          className={classes.cardMedia}
          image={post.image}
          title={post.imageText}
        />
        {/* </Hidden> */}
        <div className={classes.cardDetails}>
          <CardContent style={{ paddingBottom: "0" }}>
            <h4>{post.title}</h4>
            <p>{post.description}</p>
            <Divider className={classes.divider} />
            <p className="text-center" style={{ fontWeight: "bold", color: "#2f78b7" }}>
              EXPLORE
            </p>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Grid item xs={12} sm={6} md={6} lg={4}>
      {post.to && (
        <a
          href={GLYGEN_BASENAME === "/" ? post.to : GLYGEN_BASENAME + post.to}
          className={classes.cardAction}
        >
          {/* <CardActionArea> */}
          <CardFeatured />
          {/* </CardActionArea> */}
        </a>
      )}
      {post.href && (
        <a
          className={classes.cardAction}
          href={post.href}
          target={post.target}
          rel="noopener noreferrer"
        >
          <CardFeatured />
        </a>
      )}
    </Grid>
  );
}

FeaturedCard.propTypes = {
  post: PropTypes.object,
};
