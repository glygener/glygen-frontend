import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import MainFeaturedCard from "../components/cards/MainFeaturedCard";
import FeaturedCard from "../components/cards/FeaturedCard";
// import QuickSearchCard from '../components/cards/QuickSearchCard';
import TryMeCard from "../components/cards/TryMeCard";
import InfoCard from "../components/cards/InfoCard";
import VersionCard from "../components/cards/VersionCard";
import StatDBCard from "../components/cards/StatDBCard";
import TwitterCard from "../components/cards/TwitterCard";
import { Row } from "react-bootstrap";
import mainImg from "../images/home/main-featured-img.png";
import feedback from "../images/home/feedback.svg";
import resources from "../images/home/resources.svg";
import proteinImg from "../images/home/glycoprotein-img.svg";
import glycanImg from "../images/home/glycan-img.svg";
import quickSearchImg from "../images/home/quick-search-img.svg";
import compositionSearchImg from "../images/home/composition-img.svg";
import gnomeBrowserImg from "../images/home/gnome-browser-img.svg";
import apiImg from "../images/home/api-img.svg";
import dataImg from "../images/home/data-img.svg";
import sparqlImg from "../images/home/sparql-img.svg";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { getSystemData } from "../data";
import { GLYGEN_API, GLYGEN_DATA, GLYGEN_SPARQL, GNOME_BROWSER } from "../envVariables";
import routeConstants from "../data/json/routeConstants.json";
import { logActivity } from "../data/logging";
import { axiosError } from "../data/axiosError";
// import BannerHotTopic from "../components/alert/BannerHotTopic";

const mainFeaturedCard = {
  title: "GlyGen: Computational and Informatics Resources for Glycoscience",
  description:
    "GlyGen is a data integration and dissemination project for carbohydrate and glycoconjugate related data. GlyGen retrieves information from multiple international data sources and integrates and harmonizes this data. This web portal allows exploring this data and performing unique searches that cannot be executed in any of the integrated databases alone.",
  image: mainImg,
};
const featuredCards = [
  {
    title: "Glycan Search",
    description: "Search for glycan structures based on their chemical and structural properties.",
    image: glycanImg,
    imageText: "Glycan Search",
    to: routeConstants.glycanSearch,
  },
  {
    title: "Protein Search",
    description: "Search for proteins based on their sequences, accessions, and annotations.",
    image: proteinImg,
    imageText: "Protein Search",
    to: routeConstants.proteinSearch,
  },
  {
    title: "Quick Search",
    description: "Quick Search provides multi-domain queries that are based on user requests.",
    image: quickSearchImg,
    imageText: "Quick Search",
    to: routeConstants.quickSearch,
  },
  {
    title: "Composition Search",
    description: "A search to find glycan(s) with specific monosaccharide composition in GlyGen.",
    image: compositionSearchImg,
    imageText: "Composition Search",
    to: routeConstants.compositionSearch,
  },
  {
    title: "Structure Browser",
    description: "Find glycan structures interactively by composition and topology via GNOme.",
    image: gnomeBrowserImg,
    imageText: "GNOme Browser",
    href: GNOME_BROWSER,
    target: "_blank",
  },
  {
    title: "Data",
    description:
      "Data from the different resources can be accessed and downloaded in resource-specific formats (e.g. CSV, RDF).",
    image: dataImg,
    imageText: "Data",
    href: GLYGEN_DATA,
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
  },
  {
    title: "SPARQL",
    description:
      "All datasets are RDFized using standard ontologies and made accessible via a SPARQL Endpoint.",
    image: sparqlImg,
    imageText: "SPARQL",
    href: GLYGEN_SPARQL,
    target: "_blank",
  },
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
  title: "Explore Other Resources",
  description: "GlyGen is pleased to provide users with a variety of resources in glycobiology.",
  image: resources,
  imageText: "Resources",
  button: "EXPLORE",
  to: routeConstants.resources,
};

export default function Home() {
  const [homeData, setHomeData] = useState({ statistics: [], version: [] });
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
      {/* <BannerHotTopic /> */}
      <MainFeaturedCard post={mainFeaturedCard} />
      {/* <Container maxWidth="xl">
				<BannerHotTopic />
			</Container> */}
      <Container maxWidth="xl" className="gg-container" style={{ width: "97%" }}>
        {/* <BannerHotTopic /> */}
        <Row className="show-grid">
          <Grid container spacing={4}>
            <Grid item xs={12} md={8} lg={9}>
              <Grid container spacing={4} style={{ justifyContent: "center" }}>
                {featuredCards.map((post) => (
                  <FeaturedCard key={post.title} post={post} />
                ))}
                <Grid item xs={12} sm={12}>
                  <TryMeCard id="try-me" />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Grid container spacing={4} style={{ justifyContent: "center" }}>
                <VersionCard data={homeData.version} pageLoading={pageLoading} />
                <InfoCard post={feedbackCard} />
                <StatDBCard data={homeData.statistics} pageLoading={pageLoading} />
                <InfoCard post={resourcesCard} />
                <TwitterCard />
              </Grid>
            </Grid>
          </Grid>
        </Row>
      </Container>
    </React.Fragment>
  );
}
