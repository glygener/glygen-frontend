import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { Image } from "react-bootstrap";
import { makeStyles } from "@mui/styles";
import teamBgImg from "../../images/about/team-bg.jpg";
import teamMembersData from "../../data/json/teamMembers";
import TeamMembersCard from "../about/TeamMembersCard";

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
                  Our innovative and experienced team dedicated their hard work to develop GlyGen
                  portal for glycosciences research.
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </section>
      <section className="content-box-md about-section-bg">
        <Container maxWidth="lg">
          {/* <h2 className="section-heading">{teamMembersData.pi.heading}</h2> */}
          <TeamMembersCard data={teamMembersData.pi} />
        </Container>
      </section>
      <section className="content-box-md">
        <Container maxWidth="lg">
          {/* <h2 className="section-heading">Advocates</h2> */}
          <TeamMembersCard data={teamMembersData.advocates} />
        </Container>
      </section>
      <section className="content-box-md about-section-bg">
        <Container maxWidth="lg">
          <h2 className="section-heading">{teamMembersData.collaborators.heading}</h2>
          {/* <h3>Tool Development and Data Integration</h3> */}
          <TeamMembersCard data={teamMembersData.collaborators.dataIntegration} />
          {/* <h3>Integration with EBI and NCBI</h3> */}
          <TeamMembersCard data={teamMembersData.collaborators.ebiIntegration} />
          {/* <h3>Glycan Array Database Partners</h3> */}
          {/* <TeamMembersCard data={teamMembersData.collaborators.arrayDatabase} /> */}
        </Container>
      </section>
      {/* <section className="content-box-md">
        <Container maxWidth="lg">
          <h2 className="section-heading">Data Management Team</h2>
          <TeamMembersCard data={teamMembersData.dataManagement} />
        </Container>
      </section> */}
      {/* <section className="content-box-md about-section-bg">
        <Container maxWidth="lg">
          <h2 className="section-heading">Web Developers</h2>
          <TeamMembersCard data={teamMembersData.webDevelopers} />
        </Container>
      </section> */}
      {/* <section className="content-box-md">
        <Container maxWidth="lg">
          <h2 className="section-heading">Former Members</h2>
          <TeamMembersCard data={teamMembersData.otherMembers} />
        </Container>
      </section> */}
      <section className="content-box-md">
        <Container maxWidth="lg">
          {/* <h2 className="section-heading">Former Members</h2> */}
          <TeamMembersCard formerMembers={true} data={{"heading": teamMembersData.formerMembers.heading, "people": teamMembersData.formerMembers.people.sort((obj1, obj2) => obj2.orderID - obj1.orderID)}} />
        </Container>
      </section>
    </React.Fragment>
  );
};
export default OurTeam;
