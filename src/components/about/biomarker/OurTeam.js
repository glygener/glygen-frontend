import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { Image } from "react-bootstrap";
import { makeStyles } from "@mui/styles";
import teamBgImg from "../../../images/about/team-bg.jpg";
import teamMembersData from "../../../data/json/biomarker/teamMembers";
import TeamMembersCard from "./TeamMembersCard";

const useStyles = makeStyles((theme) => ({
  mainFeaturedCard: {
    position: "relative",
    backgroundColor: theme.palette.grey[800],
    color: "white",
    backgroundSize: "cover",
    background: "no-repeat fixed center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(94, 144, 186, 0.5)",
  },
  mainFeaturedCardContent: {
    position: "relative",
    textAlign: "center",
    padding: theme.spacing(6),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(8),
    },
  },
}));

const OurTeam = (props) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      {/* Team members image-background  */}
      <section>
        <Paper
          className={classes.mainFeaturedCard}
          style={{ backgroundImage: `url(${teamBgImg})` }}
        >
          {<Image style={{ display: "none" }} src={teamBgImg} alt="team background image" />}
          <div className={classes.overlay} />
          <Grid container>
            <Grid item sm={12} md={12}>
              <div className={classes.mainFeaturedCardContent}>
                <Typography
                  style={{ fontWeight: "200" }}
                  component="h1"
                  variant="h4"
                  color="inherit"
                  gutterBottom
                >
                  MEET OUR
                </Typography>
                <Typography
                  style={{ fontWeight: "200" }}
                  component="h1"
                  variant="h4"
                  color="inherit"
                  gutterBottom
                >
                  TALENTED <span style={{ fontWeight: "900" }}>TEAM</span>
                </Typography>
                <br />
                <Typography component="h1" variant="h5" color="inherit" paragraph>
                  Our innovative and experienced team dedicated their hard work to develop Biomarker Partnership
                  portal for biomarker research.
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </section>
      <section className="content-box-md">
        <Container maxWidth="lg">
          <TeamMembersCard data={teamMembersData.pi} />
        </Container>
      </section>
      <section className="content-box-md about-section-bg">
        <Container maxWidth="lg">
          <TeamMembersCard data={teamMembersData.project_managers} />
        </Container>
      </section>
      <section className="content-box-md">
        <Container maxWidth="lg">
          <TeamMembersCard data={teamMembersData.consultants} />
        </Container>
      </section>
      
    </React.Fragment>
  );
};
export default OurTeam;
