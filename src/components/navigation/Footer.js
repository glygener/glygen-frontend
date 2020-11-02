import React from "react";
import { Link } from "react-router-dom";
import logoFooter from "../../images/glygen_logos/glygen-logoW-top.svg";
import ugaLogo from "../../images/univ_logos/logo-uga.svg";
import gwuLogo from "../../images/univ_logos/logo-gwu.svg";
import { Navbar, Col, Image, Row } from "react-bootstrap";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import "../../App.css";
import routeConstants from "../../data/json/routeConstants.json";
import GitHubIcon from "@material-ui/icons/GitHub";
import YouTubeIcon from "@material-ui/icons/YouTube";
import TwitterIcon from "@material-ui/icons/Twitter";
import { ReactComponent as MediaWikiIcon } from "../../images/icons/mediaWikiIcon.svg";
import {
  GLYGEN_API,
  GLYGEN_BETA,
  GLYGEN_DATA,
  GLYGEN_SPARQL,
  GNOME_BROWSER,
} from "../../envVariables";

const useStyles = makeStyles((theme) => ({
  navbarText: {
    color: "#fff !important",
  },
  link: {
    color: "#afd9fd !important",
    "&:hover": {
      color: "#57affa !important",
    },
  },
  univLogo: {
    padding: "10px",
  },
  footerUnivLogo: {
    padding: "20px 10px 0 10px",
  },
  icons: {
    color: "#2f78b7 !important",
    fontWeight: "600",
    "&:hover": {
      color: "#57affa !important",
    },
  },
}));

export default function Header() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <div className="footer-color gg-align-center gg-footer">
        <Container maxWidth="xl" className="justify-content-center text-center sitemap-item">
          <Row className="text-center justify-content-center">
            <Col xs={6} md={"auto"} className="text-left sitemap-item">
              <h6 className="text-uppercase">Get Started</h6>
              <div>
                <Link to={routeConstants.quickSearch}>Quick&nbsp;Search</Link>
              </div>
              <div>
                <Link to={routeConstants.tryMe}>Try&nbsp;Me</Link>
              </div>
              <div>
                <Link to={routeConstants.compositionSearch}>Composition&nbsp;Search</Link>
              </div>

              <div>
                <a href={GNOME_BROWSER} target="_blank" rel="noopener noreferrer">
                  GNOme&nbsp;Browser
                </a>
              </div>
            </Col>
            <Col xs={6} md={"auto"} className="text-left sitemap-item">
              <h6 className="text-uppercase">Explore</h6>
              <div>
                <Link to={routeConstants.glycanSearch}>Glycan Search</Link>
              </div>
              <div>
                <Link to={routeConstants.proteinSearch}>Protein&nbsp;Search</Link>
              </div>
              <div>
                <Link to={routeConstants.motifList}>List&nbsp;of&nbsp;Motifs</Link>
              </div>
            </Col>
            <Col xs={6} md={"auto"} className="text-left sitemap-item">
              <h6 className="text-uppercase">Data</h6>
              <div>
                <a href={GLYGEN_DATA} target="_blank" rel="noopener noreferrer">
                  Data
                </a>
              </div>
              <div>
                <a href={GLYGEN_API} target="_blank" rel="noopener noreferrer">
                  API
                </a>
              </div>
              <div>
                <a href={GLYGEN_SPARQL} target="_blank" rel="noopener noreferrer">
                  SPARQL
                </a>
              </div>
            </Col>
            <Col xs={6} md={"auto"} className="text-left sitemap-item">
              <h6 className="text-uppercase">My GlyGen</h6>
              <div>
                <Link to={routeConstants.privacySettings}>Privacy&nbsp;Settings</Link>
              </div>
              <div>
                <Link to={routeConstants.license}>License</Link>
              </div>
              <div>
                <Link to={routeConstants.privacyPolicy}>Privacy&nbsp;Policy</Link>
              </div>
              <div>
                <Link to={routeConstants.disclaimer}>Disclaimer</Link>
              </div>
            </Col>
            <Col xs={6} md={"auto"} className="text-left sitemap-item">
              <h6 className="text-uppercase">Help</h6>
              <div>
                <Link to={routeConstants.howToCite}>How to Cite</Link>
              </div>
              <div>
                <Link to={routeConstants.contactUs}>Contact Us</Link>
              </div>
              <div>
                <Link to={routeConstants.about}>About</Link>
              </div>
              <div>
                <Link to={routeConstants.media}>Media</Link>
              </div>
            </Col>
            <Col xs={6} md={"auto"} className="text-left sitemap-item">
              <h6 className="text-uppercase">Resources</h6>
              <div>
                <Link to={routeConstants.feedback}>Feedback</Link>
              </div>
              <div>
                <Link to={routeConstants.resources}>Resources</Link>
              </div>
              <div>
                <Link to={routeConstants.frameworks}>Frameworks</Link>
              </div>
              <div>
                <a href={GLYGEN_BETA} target="_blank" rel="noopener noreferrer">
                  Beta&nbsp;Testing
                </a>
              </div>
            </Col>
            <Col xs={12} md={"auto"} className="sitemap-item">
              <div>
                <a
                  href="https://twitter.com/gly_gen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.icons}
                >
                  <TwitterIcon className="mr-2" />
                </a>
                <a
                  href="https://www.youtube.com/channel/UCqfvlu86I7n71iqCG5yx8bg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.icons}
                >
                  <YouTubeIcon className="mr-2" />
                </a>
                <a
                  href="https://github.com/glygener"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.icons}
                >
                  <GitHubIcon className="mr-2" size="14px" />
                </a>
                <a
                  href="https://wiki.glygen.org/index.php/Main_Page"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="media-wiki-icon"
                >
                  <MediaWikiIcon />
                </a>
              </div>

              <div className="text-center">
                <a href="https://www.ccrc.uga.edu/" target="_blank" rel="noopener noreferrer">
                  <Image src={ugaLogo} className={classes.footerUnivLogo} />
                </a>
                <a href="https://smhs.gwu.edu/" target="_blank" rel="noopener noreferrer">
                  <Image src={gwuLogo} className={classes.footerUnivLogo} />
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="gg-blue gg-align-center">
        <Container maxWidth="xl" className="justify-content-center">
          <Row className="text-center justify-content-center">
            <Col md={"auto"}>
              <Navbar.Brand href={routeConstants.home}>
                <img
                  href={routeConstants.home}
                  src={logoFooter}
                  alt="Glygen"
                  className="justify-content-center"
                />
              </Navbar.Brand>
            </Col>
            <Box display="flex" alignItems="center" className="box-footer">
              <Col md={"auto"}>
                <Navbar.Text className={classes.navbarText}>
                  GlyGen is supported and funded by the{" "}
                  <a
                    href="https://commonfund.nih.gov/glycoscience"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.link}
                  >
                    NIH Glycoscience Common Fund{" "}
                  </a>
                  under the grant #{" "}
                  <a
                    href="https://projectreporter.nih.gov/project_info_details.cfm?aid=9391499&icde=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.link}
                  >
                    1U01GM125267&nbsp;-&nbsp;01
                  </a>
                </Navbar.Text>
              </Col>
            </Box>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
