import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// import CardActionArea from '@mui/material/CardActionArea';
import CardContent from "@mui/material/CardContent";
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
              className={classes.cardTitle}
            >
              News
              {/* {post.title} */}
            </h4>
            <section className="twitterContainer">
              <div className="twitter-embed">
                {TwitterTimelineEmbed && TwitterTimelineEmbed.length > 0 ? (
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
                    noFooter="true"
                  ></TwitterTimelineEmbed>
                ) : (
                  <p>Please make sure the Firefox browser tracking protection is disabled.</p>
                )}
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
