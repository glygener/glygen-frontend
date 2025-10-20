import React from "react";
import { styled } from '@mui/material/styles';
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
// import Hidden from '@mui/material/Hidden';
import Divider from "@mui/material/Divider";
import { GLYGEN_BASENAME } from "../../envVariables";
import { Link } from "react-router-dom";

const PREFIX = 'FeaturedCard';

const classes = {
  cardAction: `${PREFIX}-cardAction`,
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

  [`& .${classes.cardDetails}`]: {
    flex: 4,
  },

  [`& .${classes.cardMedia}`]: {
    margin: "0 auto",
  },

  [`& .${classes.divider}`]: {
    margin: theme.spacing(2, 1),
  }
}));

export default function FeaturedCard(props) {

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
    <StyledGrid item size={{ xs: 12, sm: 6, lg:4 }}>
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
    </StyledGrid>
  );
}

FeaturedCard.propTypes = {
  post: PropTypes.object,
};
