import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import logo from "../../../images/glygen_logos/biomarker-logoW.svg";
import { Link, NavLink } from "react-router-dom";
import { NavDropdown, Navbar, Nav, Row, Col, Container as ContainerBootStrap } from "react-bootstrap";
import PersonIcon from "@mui/icons-material/Person";
import GitHubIcon from "@mui/icons-material/GitHub";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import PinterestIcon from "@mui/icons-material/Pinterest";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import GlobalSearchControl from "../../search/GlobalSearchControl";
import UserTrackingBanner from "../../alert/UserTrackingBanner";
import { useLocation } from "react-router-dom";
import { ReactComponent as MediaWikiIcon } from "../../../images/icons/mediaWikiIcon.svg";
import routeConstants from "../../../data/json/routeConstants.json";
import betaWatermarkImg from "../../../images/icons/beta-watermark.svg";
import {
  GLYGEN_API,
  GLYGEN_BETA,
  GLYGEN_DATA,
  GLYGEN_SPARQL,
  GNOME_BROWSER,
  GLYCOMOTIF_WIKI,
  GLYGEN_SANDBOX,
  GLYGEN_ENV,
  GLYCAN_SEQ_LOOKUP,
  GITHUB,
  GLYGEN_FAQ,
  GLYGEN_TUT_HOWT,
  GLYGEN_DOC,
  CFDE_GENE_PAGES,
  BIOMARKER_DATA,
  BIOMARKER_FAQ
} from "../../../envVariables";


export default function Header(props) {
  const location = useLocation();

  return (
    <React.Fragment>
      <CssBaseline />
      <UserTrackingBanner {...props} />

      <Navbar
        className="gg-top-header"
        expand="xl"
        style={
          GLYGEN_ENV === "beta"
            ? {
                backgroundImage: `url(${betaWatermarkImg})`,
                backgroundRepeat: "space",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        <Container maxWidth={false}>
          <Row className="justify-content-end text-end">
            <div className="navbar-item text-end">
              <span className="me-4">
                <Link to={routeConstants.privacySettings} className="gg-link">
                  <span>
                    <PersonIcon />
                  </span>{" "}
                  MY BIOMARKER
                </Link>
              </span>
            </div>
            <div className="navbar-item text-end">
              <span>
                <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="gg-link">
                  <GitHubIcon className="me-3" />
                </a>
              </span>
           </div>
          </Row>
        </Container>
      </Navbar>

      <Navbar className="gg-blue" style={{color:"white"}} expand="xl">
      <ContainerBootStrap maxWidth="xl" fluid>
        <Navbar.Brand as={Link} to={routeConstants.home}>
          <img src={logo} alt="Glygen" className="logo-nav" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-dark" />
        <Navbar.Collapse className="gg-blue" id="basic-navbar-nav">
          <Col xs={12} sm={12} md={12} lg={12} xl={8} className="me-5">
            <Nav>
              <Nav.Link className="gg-nav-link" as={NavLink} to={routeConstants.home}>
                HOME
              </Nav.Link>
              <NavDropdown
                className={
                  location.pathname.includes(routeConstants.biomarkerSearch)
                    ? "gg-dropdown-navbar gg-dropdown-navbar-active"
                    : "gg-dropdown-navbar"
                }
                title="EXPLORE"
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item as={NavLink} to={routeConstants.biomarkerSearch}>
                  Biomarker Search
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown className="gg-dropdown-navbar" title="DATA" id="basic-nav-dropdown">
                <NavDropdown.Item href={BIOMARKER_DATA} target="_blank" rel="noopener noreferrer">
                  Data
                </NavDropdown.Item>
                <NavDropdown.Item href={GLYGEN_API} target="_blank" rel="noopener noreferrer">
                  API
                </NavDropdown.Item>
                <NavDropdown.Item href={GLYGEN_SPARQL} target="_blank" rel="noopener noreferrer">
                  SPARQL
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                className={
                  location.pathname === routeConstants.contactUs
                    ? "gg-dropdown-navbar gg-dropdown-navbar-active"
                    : "gg-dropdown-navbar"
                }
                title="HELP"
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item href={BIOMARKER_FAQ} target="_blank" rel="noopener noreferrer">
                  FAQ
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={routeConstants.contactUs}>
                  Contact Us
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                className={
                  location.pathname === routeConstants.about ||
                  location.pathname === routeConstants.howToCite ||
                  location.pathname === routeConstants.frameworks
                    ? "gg-dropdown-navbar gg-dropdown-navbar-active"
                    : "gg-dropdown-navbar"
                }
                title="ABOUT"
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item as={NavLink} to={routeConstants.about}>
                  Our Mission
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={routeConstants.howToCite}>
                  How to Cite
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={routeConstants.frameworks}>
                  Frameworks
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Col>
        </Navbar.Collapse>
        </ContainerBootStrap>
      </Navbar>
    </React.Fragment>
  );
}