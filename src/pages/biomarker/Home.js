import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import MainFeaturedCard from "../../components/cards/MainFeaturedCard";
import FeaturedCard from "../../components/cards/FeaturedCard";
// import QuickSearchCard from '../components/cards/QuickSearchCard';
import TryMeCard from "../../components/cards/TryMeCard";
import InfoCard from "../../components/cards/InfoCard";
import VideoCard from "../../components/cards/VideoCard";
import VersionCard from "../../components/cards/VersionCard";
import StatDBCard from "../../components/cards/StatDBCard";
import TwitterCard from "../../components/cards/TwitterCard";
import MastodonCard from "../../components/cards/MastodonCard";
import { Row } from "react-bootstrap";
import mainImg from "../../images/home/main-featured-img.png";
import feedback from "../../images/home/feedback.svg";
import resources from "../../images/home/resources.svg";
import proteinImg from "../../images/home/glycoprotein-img.svg";
import biomarkerImg from "../../images/home/biomarker-img.svg";
import siteSearchImg from "../../images/home/protein-img.svg";
import glycanImg from "../../images/home/glycan-img.svg";
import quickSearchImg from "../../images/home/quick-search-img.svg";
import superSearchImg from "../../images/home/super-search-img.svg";
import compositionSearchImg from "../../images/home/composition-img.svg";
import listOfMotifsImg from "../../images/home/list-of-motifs-img.svg";
import idMappingImg from "../../images/home/id-mapping-img.svg";
import gnomeBrowserImg from "../../images/home/gnome-browser-img.svg";
import apiImg from "../../images/home/api-img.svg";
import dataImg from "../../images/home/data-img.svg";
import sparqlImg from "../../images/home/sparql-img.svg";
import glygenSandBoxlImg from "../../images/home/GlyGen-SandBox-img.svg";
import glycanStructureDictionaryImg from "../../images/home/Glycan-Structure-Dictionary-img.svg"
import proteinBLASTImg from "../../images/home/Protein-BLAST-img.svg"
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../../utils/biomarker/head";
import { getSystemData } from "../../data";
import {
  GLYGEN_API,
  GLYGEN_DATA,
  GLYGEN_SPARQL,
  GNOME_BROWSER,
  GLYGEN_SANDBOX,
  GLYGEN_GSD,
  BIOMARKER_DATA
} from "../../envVariables";
import routeConstants from "../../data/json/routeConstants.json";
import { logActivity } from "../../data/logging";
import { axiosError } from "../../data/axiosError";
// import BannerHotTopic from "../components/alert/BannerHotTopic";
import EventAlerts from "../../components/alert/EventAlerts";

const mainFeaturedCard = {
  title: "Biomarker Partnership Project",
  description:
    "Biomarker Partnership is a Common Fund Data Ecosystem (CFDE) sponsored project to develop a knowledgebase that will organize and integrate biomarker data from different public sources. The data will be connected to contextual information to show a novel systems-level view of biomarkers.",
  image: mainImg,
};
const featuredCards = [
  {
    title: "Biomarker Search",
    description: "Search for biomarkers based on their entity, condition, BEST role, and annotations.",
    image: biomarkerImg,
    imageText: "Biomarker Search",
    to: routeConstants.biomarkerSearch,
  },
  {
    title: "Data",
    description:
      "Data from the different resources can be accessed and downloaded in resource-specific formats (e.g. CSV, RDF).",
    image: dataImg,
    imageText: "Data",
    href: BIOMARKER_DATA,
    target: "_blank",
  },
  {
    title: "API",
    description:
      "A public web service API allows access to the datasets by retrieving requested data in JSON format.",
    image: apiImg,
    imageText: "API",
    href: GLYGEN_API,
    target: "_blank",
  }
];
const feedbackCard = {
  title: "Your Opinion Matters",
  description:
    "Please provide feedback and suggestions to help us improve the GlyGen portal and make it more useful for the community.",
  image: feedback,
  imageText: "Feedback",
  button: "LEAVE FEEDBACK",
  to: routeConstants.feedback,
};
const resourcesCard = {
  title: "Other Resources",
  description: "GlyGen is pleased to provide users with a variety of resources in glycobiology.",
  image: resources,
  imageText: "Resources",
  button: "EXPLORE",
  to: routeConstants.resources,
};
const videoCard = {
  title: "Featured Video",
  button: "WATCH VIDEOS",
};

export default function Home() {
  const [homeData, setHomeData] = useState({ statistics: [], version: [], events: [], video:{} });
  const [pageLoading, setPageLoading] = React.useState(true);

  useEffect(() => {
    setPageLoading(true);
    logActivity();
    getSystemData()
      .then((response) => {
        setHomeData(response.data);
        setPageLoading(false);
      })
      .catch(function (error) {
        let message = "home_init api call";
        axiosError(error, "", message, setPageLoading);
      });
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        {getTitle("home")}
        {getMeta("home")}
      </Helmet>

      <CssBaseline />
      <MainFeaturedCard post={mainFeaturedCard} />
      <Container maxWidth="xl" className="gg-container" style={{ width: "97%" }}>
        <EventAlerts data={homeData.events} pageLoading={pageLoading} />
        <div className="show-grid">
          <Grid container spacing={4}>
            <Grid item>
              <Grid container spacing={4} style={{ justifyContent: "center" }}>
                {featuredCards.map((post) => (
                  <FeaturedCard key={post.title} post={post} />
                ))}
                {/* <Grid item xs={12} sm={12}>
                  <TryMeCard id="try-me" />
                </Grid> */}
              </Grid>
            </Grid>
            {/* <Grid item xs={12} md={4} lg={3}>
              <Grid container spacing={4} style={{ justifyContent: "center" }}>
                <InfoCard post={feedbackCard} />
              </Grid>
            </Grid> */}
          </Grid>
        </div>
      </Container>
    </React.Fragment>
  );
}
