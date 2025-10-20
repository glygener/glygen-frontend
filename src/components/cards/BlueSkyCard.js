import { useEffect } from "react";
import { styled } from '@mui/material/styles';
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import React from "react";
import "../../css/mastodon-timeline.css";
import BlueSkyTimeline from "../timeline/BlueSkyTimeline";

const PREFIX = 'BlueSkyCard';

const classes = {
  cardAction: `${PREFIX}-cardAction`,
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
    backgroundColor: "transperent",
  },

  [`& .${classes.cardTitle}`]: {
    textAlign: "center",
  },

  [`& .${classes.cardDetails}`]: {
    flex: 1,
  }
}));

export default function BlueSkyCard(props) {


  return (
    <StyledGrid item size= {{ xs: 12, sm: 6, md: 12 }}>
      <Card className="card">
        <div className={classes.cardDetails}>
          <CardContent>
            <h4
              className={classes.cardTitle}
            >
              News
            </h4>
            <section className="twitterContainer">
              <div className="twitter-embed">
                <div className="dummy-container">
                  <div className="bsky-timeline">
                    <div class="bsky-body" role="feed">
                      <BlueSkyTimeline />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </CardContent>
        </div>
      </Card>
    </StyledGrid>
  );
}