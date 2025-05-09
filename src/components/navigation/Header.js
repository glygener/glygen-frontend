import React, { useEffect, useContext, useState }  from "react";
import CssBaseline from "@mui/material/CssBaseline";
import logo from "../../images/glygen_logos/glygen-logoW.svg";
import { Link, NavLink } from "react-router-dom";
import { NavDropdown, Navbar, Nav, Row, Col, Container as ContainerBootStrap, Image } from "react-bootstrap";
import PersonIcon from "@mui/icons-material/Person";
import GitHubIcon from "@mui/icons-material/GitHub";
import YouTubeIcon from "@mui/icons-material/YouTube";
import BlueSkyIcon from "../../images/icons/bluesky-icon.svg";
import MSTDNIcon from "../../images/icons/mastodon-icon.svg";
import WorkIcon from '@mui/icons-material/Work';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PinterestIcon from "@mui/icons-material/Pinterest";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import Badge from '@mui/material/Badge';
import GlobalSearchControl from "../search/GlobalSearchControl";
import UserTrackingBanner from "../alert/UserTrackingBanner";
import { useLocation } from "react-router-dom";
import { ReactComponent as MediaWikiIcon } from "../../images/icons/mediaWikiIcon.svg";
import routeConstants from "../../data/json/routeConstants.json";
import betaWatermarkImg from "../../images/icons/beta-watermark.svg";
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
  CFDE_GENE_PAGES
} from "../../envVariables";
import GlyGenNotificationContext from "../../components/GlyGenNotificationContext.js";
import { getJobCompleteValue } from "../../data/jobStoreApi"
import { getCartCount } from "../../data/idCartApi.js"
import LineTooltip from "../tooltip/LineTooltip.js";
import IDCartFullScreen from "../idcart/IDCartFullScreen"
import Button from "react-bootstrap/Button";

export default function Header(props) {
  const location = useLocation();
  const { jobComplete, totalJobs, totalCartIds, showTotalCartIdsNotification } = useContext(GlyGenNotificationContext);
  const [jobCompleteStatus, setJobCompleteStatus] = useState(jobComplete);

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    setJobCompleteStatus(getJobCompleteValue());
  }, [jobComplete]);

  useEffect(() => {
    showTotalCartIdsNotification(getCartCount());
  }, []);

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
                  MY GLYGEN
                </Link>
              </span>
              {GLYGEN_ENV !== "beta" && (
                <span className="me-4">
                  <a href={GLYGEN_BETA} target="_blank" rel="noopener noreferrer" className="gg-link">
                    <span>
                      <DeveloperBoardIcon />
                    </span>{" "}
                    BETA TESTING
                  </a>{" "}
                </span>
              )}
            </div>
            <div className="navbar-item text-end">
              <span>
                <a href={BLUESKY} target="_blank" rel="noopener noreferrer" className="gg-link">
                  <Image src={BlueSkyIcon} className="me-3" style={{height:"22px", width:"22px"}}/>
                </a>
                <a href={MSTDN} target="_blank" rel="noopener noreferrer" className="gg-link">
                  <Image src={MSTDNIcon} className="me-3" style={{height:"22px", width:"22px"}}/>
                </a>
                <a href={YOUTUBE} target="_blank" rel="noopener noreferrer" className="gg-link">
                  <YouTubeIcon className="me-3" />
                </a>
                <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="gg-link">
                  <GitHubIcon className="me-3" />
                </a>
                <a href={WIKI} target="_blank" rel="noopener noreferrer" className="media-wiki-icon">
                  <MediaWikiIcon className="me-3" />
                </a>
                <a href={PINTEREST} target="_blank" rel="noopener noreferrer" className="gg-link">
                  <PinterestIcon className="me-3" />
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
          <Col xs={12} sm={12} md={12} lg={12} xl={8} className="me-3">
            <Nav>
              <Nav.Link className="gg-nav-link" as={NavLink} to={routeConstants.home}>
                HOME
              </Nav.Link>
              <NavDropdown
                className={
                  location.pathname.includes(routeConstants.glycanSearch) ||
                  location.pathname.includes(routeConstants.proteinSearch) ||
                  location.pathname.includes(routeConstants.biomarkerSearch) ||
                  location.pathname.includes(routeConstants.siteSearch) ||
                  location.pathname.includes(routeConstants.superSearch) ||
                  location.pathname === routeConstants.motifList
                    ? "gg-dropdown-navbar gg-dropdown-navbar-active"
                    : "gg-dropdown-navbar"
                }
                title="EXPLORE"
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item as={NavLink} to={routeConstants.glycanSearch}>
                  Glycan Search
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={routeConstants.proteinSearch}>
                  Protein Search
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={routeConstants.biomarkerSearch}>
                  Biomarker Search
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={routeConstants.siteSearch}>
                  Site Search
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={routeConstants.superSearch}>
                  Super Search
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={routeConstants.motifList}>
                  List of Motifs
                </NavDropdown.Item>
                {/* <NavDropdown.Item as={NavLink} to={routeConstants.publication}>
                  Publication{" "}
                  <span className="gg-new-feature ml-1">
                    <strong>NEW</strong>
                  </span>
                </NavDropdown.Item> */}
              </NavDropdown>
              <Nav.Link className="gg-nav-link" as={NavLink} to={routeConstants.quickSearch}>
                QUICK&nbsp;SEARCH
              </Nav.Link>
              <Nav.Link className="gg-nav-link" as={NavLink} to={routeConstants.tryMe}>
                TRY&nbsp;ME
              </Nav.Link>
              <NavDropdown className="gg-dropdown-navbar" title="DATA" id="basic-nav-dropdown">
                <NavDropdown.Item href={GLYGEN_DATA} target="_blank" rel="noopener noreferrer">
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
                  location.pathname === routeConstants.resources ||
                  location.pathname === routeConstants.blastSearch ||
                  location.pathname === routeConstants.idMapping ||
                  location.pathname === routeConstants.isoformMapping
                    ? "gg-dropdown-navbar gg-dropdown-navbar-active"
                    : "gg-dropdown-navbar"
                }
                title="TOOLS"
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item
                  href={GLYCAN_SEQ_LOOKUP}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Glycan Sequence Lookup
                </NavDropdown.Item>
                <NavDropdown.Item href={GLYGEN_GSD} target="_blank" rel="noopener noreferrer">
                  Glycan Structure Dictionary
                </NavDropdown.Item>
                <NavDropdown.Item href={GLYCOMOTIF_WIKI} target="_blank" rel="noopener noreferrer">
                  GlycoMotif Wiki
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={routeConstants.blastSearch}>
                  GlyGen BLAST 
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={routeConstants.idMapping}>
                  GlyGen Mapper
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={routeConstants.isoformMapping}>
                  GlyGen Isoform Mapper
                </NavDropdown.Item>
                <NavDropdown.Item href={GLYGEN_SANDBOX} target="_blank" rel="noopener noreferrer">
                  GlyGen Sand Box
                </NavDropdown.Item>
                <NavDropdown.Item href={GNOME_BROWSER} target="_blank" rel="noopener noreferrer">
                  Structure Browser
                </NavDropdown.Item>
                <NavDropdown.Divider className="ms-2 me-2" style={{backgroundColor:"#eff1f4"}}/>
                <NavDropdown className={"dropdown-navbar-submenu gg-dropdown-navbar-submenu dropend"} id="basic-nav-dropdown" title="Third Party Tools">
                  <NavDropdown.Item href={CFDE_GENE_PAGES} target="_blank" rel="noopener noreferrer">
                    Gene and Drug Landing Page Aggregator
                  </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown.Divider className="ms-2 me-2" style={{backgroundColor:"#eff1f4"}}/>
              <NavDropdown.Item as={NavLink} to={routeConstants.resources}>
                  Other Resources
              </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                className={
                  location.pathname === routeConstants.contactUs ||
                  location.pathname === routeConstants.feedback
                    ? "gg-dropdown-navbar gg-dropdown-navbar-active"
                    : "gg-dropdown-navbar"
                }
                title="HELP"
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item href={GLYGEN_FAQ} target="_blank" rel="noopener noreferrer">
                  FAQ
                </NavDropdown.Item>
                <NavDropdown.Item href={WIKI} target="_blank" rel="noopener noreferrer">
                  GlyGen Wiki
                </NavDropdown.Item>
                <NavDropdown.Item href={GLYGEN_TUT_HOWT} target="_blank" rel="noopener noreferrer">
                  Tutorials and How to
                </NavDropdown.Item>
                <NavDropdown.Item href={GLYGEN_DOC} target="_blank" rel="noopener noreferrer">
                  Documentation
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={routeConstants.contactUs}>
                  Contact Us
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={routeConstants.feedback}>
                  Feedback
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                className={
                  location.pathname === routeConstants.about ||
                  location.pathname === routeConstants.howToCite ||
                  location.pathname === routeConstants.outreach ||
                  location.pathname === routeConstants.media ||
                  location.pathname === routeConstants.frameworks
                    ? "gg-dropdown-navbar gg-dropdown-navbar-active"
                    : "gg-dropdown-navbar"
                }
                title="ABOUT"
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item as={NavLink} to={routeConstants.about}>
                  We are GlyGen
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={routeConstants.howToCite}>
                  How to Cite
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={routeConstants.outreach}>
                  Outreach
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={routeConstants.media}>
                  Media
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to={routeConstants.frameworks}>
                  Frameworks
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={3}>
              <GlobalSearchControl />
          </Col>
          <Col xs={4} sm={4} md={4} lg={4} xl={1}>
            <div style={{paddingTop:"10px", paddingLeft:"5px"}}>
              <LineTooltip text={"View Job status"}>
                <Link className="ms-2" to={routeConstants.jobStatus}>
                  <Badge color={"error"} overlap1="circular" badgeContent="" variant="dot" invisible={!jobCompleteStatus} anchorOrigin={{ vertical: 'top',horizontal: 'left' }}>
                    <Badge color={"success"} badgeContent={totalJobs} max={99}>
                      <WorkIcon sx={{ color: "white", paddingLeft1: "20px" }}/>
                    </Badge>
                  </Badge>
                </Link>
              </LineTooltip>
              <LineTooltip text={open ? "" : "View ID cart"}>
                <Button className="btn-white ms-3" onClick={toggleDrawer(true)}>
                  <Badge color={"success"} badgeContent={totalCartIds} max={99}>
                    <ShoppingCartIcon sx={{ color: "white", paddingLeft1: "20px" }}/>
                  </Badge>
                  </Button>
                  {open && <IDCartFullScreen open={open} setOpen={setOpen} />}
              </LineTooltip>
            </div>
          </Col>
        </Navbar.Collapse>
        </ContainerBootStrap>
      </Navbar>
    </React.Fragment>
  );
}