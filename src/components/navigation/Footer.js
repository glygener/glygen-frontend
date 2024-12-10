import React from "react";
import { Link } from "react-router-dom";
import logoFooter from "../../images/glygen_logos/glygen-logoW-top.svg";
import ugaLogo from "../../images/univ_logos/logo-uga.svg";
import gwuLogo from "../../images/univ_logos/logo-gwu.svg";
import { Navbar, Col, Image, Row, Container as ContainerBootStrap } from "react-bootstrap";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import "../../App.css";
import routeConstants from "../../data/json/routeConstants.json";
import GitHubIcon from "@mui/icons-material/GitHub";
import YouTubeIcon from "@mui/icons-material/YouTube";
import XIcon from '@mui/icons-material/X';
import BlueSkyIcon from "../../images/icons/bluesky-icon.svg";
import MSTDNIcon from "../../images/icons/mastodon-icon.svg";
import PinterestIcon from "@mui/icons-material/Pinterest";
import { ReactComponent as MediaWikiIcon } from "../../images/icons/mediaWikiIcon.svg";
import {
  GLYGEN_API,
  GLYGEN_BETA,
  GLYGEN_DATA,
  GLYGEN_SPARQL,
  GNOME_BROWSER,
  GLYCOMOTIF_WIKI,
  GLYGEN_SANDBOX,
  GLYCAN_SEQ_LOOKUP,
  GRANT_DETAILS,
  NIGMS,
  CCRC_UGA,
  SMHS_GWU,
  BLUESKY,
  XUrl,
  MSTDN,
  YOUTUBE,
  GITHUB,
  WIKI,
  PINTEREST,
  GLYGEN_GSD,
  GLYGEN_FAQ,
  GLYGEN_TUT_HOWT,
  GLYGEN_DOC,
  GRANT_DETAILS_COMMONFUND,
  NIH_COMMONFUND
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
}));

export default function Footer() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <div className="footer-color gg-align-center gg-footer">
        <ContainerBootStrap maxWidth="xl" className="justify-content-center text-center sitemap-item">
          <Row className="text-center justify-content-center">
            <Col xs={6} md={"auto"} className="text-start sitemap-item">
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
            </Col>
            <Col xs={6} md={"auto"} className="text-start sitemap-item">
              <h6 className="text-uppercase">Explore</h6>
              <div>
                <Link to={routeConstants.glycanSearch}>Glycan Search</Link>
              </div>
              <div>
                <Link to={routeConstants.proteinSearch}>Protein&nbsp;Search</Link>
              </div>
              <div>
                <Link to={routeConstants.biomarkerSearch}>Biomarker&nbsp;Search</Link>
              </div>
              <div>
                <Link to={routeConstants.siteSearch}>Site&nbsp;Search</Link>
              </div>
              <div>
                <Link to={routeConstants.superSearch}>Super&nbsp;Search</Link>
              </div>
              <div>
                <Link to={routeConstants.motifList}>List&nbsp;of&nbsp;Motifs</Link>
              </div>
            </Col>
            <Col xs={6} md={"auto"} className="text-start sitemap-item">
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
            <Col xs={6} md={"auto"} className="text-start sitemap-item">
              <h6 className="text-uppercase">Tools</h6>
              <div>
                <a href={GLYCAN_SEQ_LOOKUP} target="_blank" rel="noopener noreferrer">
                  Glycan Sequence Lookup
                </a>
              </div>
              <div>
                <a href={GLYGEN_GSD} target="_blank" rel="noopener noreferrer">
                Glycan Structure Dictionary
                </a>
              </div>
              <div>
                <a href={GLYCOMOTIF_WIKI} target="_blank" rel="noopener noreferrer">
                  GlycoMotif&nbsp;Wiki
                </a>
              </div>
              <div>
                <Link to={routeConstants.blastSearch}>GlyGen&nbsp;BLAST</Link>
              </div>
              <div>
                <Link to={routeConstants.idMapping}>GlyGen&nbsp;Mapper</Link>
              </div>
              <div>
                <Link to={routeConstants.isoformMapping}>GlyGen&nbsp;Isoform&nbsp;Mapper</Link>
              </div>
              <div>
                <a href={GLYGEN_SANDBOX} target="_blank" rel="noopener noreferrer">
                  GlyGen&nbsp;Sand Box
                </a>
              </div>
              <div>
                <a href={GNOME_BROWSER} target="_blank" rel="noopener noreferrer">
                  Structure&nbsp;Browser
                </a>
              </div>
              <div>
                <Link to={routeConstants.resources}>Other Resources</Link>
              </div>
            </Col>
            <Col xs={6} md={"auto"} className="text-start sitemap-item">
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
            <Col xs={6} md={"auto"} className="text-start sitemap-item">
              <h6 className="text-uppercase">Help</h6>
              <div>
                <a href={GLYGEN_FAQ} target="_blank" rel="noopener noreferrer">
                  FAQ
                </a>
              </div>
              <div>
                <a href={GLYGEN_TUT_HOWT} target="_blank" rel="noopener noreferrer">
                  Tutorials and How to
                </a>
              </div>
              <div>
                <a href={GLYGEN_DOC} target="_blank" rel="noopener noreferrer">
                  Documentation
                </a>
              </div>
              <div>
                <Link to={routeConstants.contactUs}>Contact Us</Link>
              </div>
              <div>
                <Link to={routeConstants.feedback}>Feedback</Link>
              </div>
            </Col>
            <Col xs={6} md={"auto"} className="text-start sitemap-item">
              <h6 className="text-uppercase">About</h6>
              <div>
                <Link to={routeConstants.about}>We are GlyGen</Link>
              </div>
              <div>
                <Link to={routeConstants.howToCite}>How to Cite</Link>
              </div>
              <div>
                <Link to={routeConstants.outreach}>Outreach</Link>
              </div>
              <div>
                <Link to={routeConstants.media}>Media</Link>
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
            <Col xs={6} md={"auto"} className="text-start sitemap-item">
              <div>
                <a href={BLUESKY} target="_blank" rel="noopener noreferrer" className="gg-link">
                  <Image src={BlueSkyIcon} className="me-2" style={{height:"22px", width:"22px"}}/>
                </a>
                <a href={MSTDN} target="_blank" rel="noopener noreferrer" className="gg-link">
                  <Image src={MSTDNIcon} className="me-2" style={{height:"22px", width:"22px"}}/>
                </a>
                <a href={XUrl} target="_blank" rel="noopener noreferrer" className="gg-link">
                  <XIcon className="me-2" style={{height:"22px", width:"22px"}}/>
                </a>
                <a href={YOUTUBE} target="_blank" rel="noopener noreferrer" className="gg-link">
                  <YouTubeIcon className="me-2" />
                </a>
                <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="gg-link">
                  <GitHubIcon className="me-2" size="14px" />
                </a>
                <a
                  href={WIKI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="media-wiki-icon"
                >
                  <MediaWikiIcon className="me-2" />
                </a>
                <a href={PINTEREST} target="_blank" rel="noopener noreferrer" className="gg-link">
                  <PinterestIcon />
                </a>
              </div>

              <div className="text-center5">
                <a href={CCRC_UGA} target="_blank" rel="noopener noreferrer">
                  <Image src={ugaLogo} className={classes.footerUnivLogo} />
                </a>
                <a href={SMHS_GWU} target="_blank" rel="noopener noreferrer">
                  <Image src={gwuLogo} className={classes.footerUnivLogo} />
                </a>
              </div>
            </Col>
          </Row>
        </ContainerBootStrap>
      </div>
      <div className="gg-blue gg-align-center">
        <ContainerBootStrap maxWidth="xl" className="justify-content-center text-center">
          <Row className="justify-content-center mt-1 mb-1">
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
              <Col md={"auto"}>
                <Box display="flex" className="box-footer">
                  <Navbar.Text className={classes.navbarText}>
                    GlyGen is supported and funded by the{" "}
                    <a
                      href={NIGMS}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.link}
                    >
                      National Institute of General Medical Sciences{" "}
                    </a>
                    under the grant #{" "}
                    <a
                      href={GRANT_DETAILS}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.link}
                    >
                      1R24GM146616&nbsp;-&nbsp;01
                    </a>{" "}
                    and the {" "}
                    <a
                      href={NIH_COMMONFUND}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.link}
                    >
                      National Institutes of Health Office of Strategic Coordination - The Common Fund{" "}
                    </a>
                    under the grant #{" "}
                    <a
                      href={GRANT_DETAILS_COMMONFUND}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.link}
                    >
                      1OT2OD032092
                    </a>
                    .
                  </Navbar.Text>
                </Box>
              </Col>
          </Row>
        </ContainerBootStrap>
      </div>
    </React.Fragment>
  );
}
