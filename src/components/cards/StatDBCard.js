import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// import CardActionArea from '@mui/material/CardActionArea';
import CardContent from "@mui/material/CardContent";
import { Row } from "react-bootstrap";
import CardLoader from "../load/CardLoader";

const useStyles = makeStyles((theme) => ({
  cardAction: {
    display: "inline-flex",
  },
  card: {
    // display: 'flex'
    // maxWidth: 345
  },
  cardTitle: {
    textAlign: "center",
  },
  cardDetails: {
    flex: 1,
    paddingLeft: "15px",
    paddingRight: "15px",
  },
}));

export default function StatDBCard(props) {
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={6} md={12}>
      {/* <Card className={classes.card}> */}
      {/* <CardActionArea className={classes.cardAction} component='a' href='#'> */}
      <Card className="card">
        <CardLoader pageLoading={props.pageLoading} />
        <div className={classes.cardDetails}>
          <CardContent>
            <h4
              // gutterBottom
              // variant='h5'
              // component='h2'
              className={classes.cardTitle}
            >
              Database Statistics
            </h4>
            {props.data
              .sort((a, b) => (a.glycans < b.glycans ? 1 : -1))
              .map((obj) => (
                <>
                  <Row style={{ padding: "0px !important", marginLeft: "-15px", marginRight: "-15px" }}>
                    <Typography style={{ padding: "0px !important", marginLeft: "-15px", marginRight: "-15px" }}>
                      <strong>{obj.species}</strong>
                    </Typography>
                  </Row>
                  <Typography>
                    <Row style={{ padding: "0px !important", marginLeft: "-15px", marginRight: "-15px" }}>
                      <Grid xs={9} sm={9} style={{ paddingLeft: "15px !important", paddingRight: "0px !important" }}>
                        Glycans
                      </Grid>
                      <Grid className="grid-item" xs={3} sm={3}>
                        {obj.glycans}
                      </Grid>
                    </Row>
                    <Row style={{ padding: "0px !important", marginLeft: "-15px", marginRight: "-15px" }}>
                      <Grid xs={9} sm={9} style={{ paddingLeft: "15px !important", paddingRight: "0px !important" }}>
                        Proteins
                      </Grid>
                      <Grid className="grid-item" xs={3} md={3} lg={3}>
                        {obj.proteins}
                      </Grid>
                    </Row>
                    <Row style={{ padding: "0px !important", marginLeft: "-15px", marginRight: "-15px" }}>
                      <Grid xs={9} sm={9} style={{ paddingLeft: "15px !important", paddingRight: "0px !important" }}>
                        Glycoproteins
                      </Grid>
                      <Grid className="grid-item" xs={3} md={3} lg={3}>
                        {obj.glycoproteins}
                      </Grid>
                    </Row>
                  </Typography>
                </>
              ))}
          </CardContent>
        </div>
      </Card>
      {/* </CardActionArea> */}
      {/* </Card> */}
    </Grid>
  );
}

StatDBCard.propTypes = {
  data: PropTypes.object,
};
