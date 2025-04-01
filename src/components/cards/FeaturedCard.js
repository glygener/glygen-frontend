import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
// import Hidden from '@mui/material/Hidden';
import Divider from "@mui/material/Divider";
import { GLYGEN_BASENAME } from "../../envVariables";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  cardAction: {
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
        <Link
          to={post.to}
          className={classes.cardAction}
        >
          <CardFeatured />
        </Link>
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
