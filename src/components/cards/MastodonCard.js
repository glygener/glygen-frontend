import { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// import CardActionArea from '@mui/material/CardActionArea';
import CardContent from "@mui/material/CardContent";
import {
  GLYGEN_BASENAME
} from "../../envVariables";
import React from "react";
import "../../css/mastodon-timeline.css";
import JSFileLoad  from "../../utils/JSFileLoad";

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

export default function MastodonCard(props) {
  const classes = useStyles();
  JSFileLoad(window.location.origin + (GLYGEN_BASENAME === "/" ? "" : GLYGEN_BASENAME) + '/libs/mastodon-timeline.js');

  return (
    <Grid item xs={12} sm={6} md={12}>
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
                  <div className="mt-timeline">
                    <div id="mt-body" class="mt-body" role="feed">
                      <div className="loading-spinner"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </CardContent>
        </div>
      </Card>
    </Grid>
  );
}