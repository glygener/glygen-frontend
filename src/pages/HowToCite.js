import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import CssBaseline from "@material-ui/core/CssBaseline";
import VerticalHeadingLogo from "../components/headings/VerticalHeadingLogo";
import PanelHowToCite from "../components/PanelHowToCite";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import howToCiteData from "../data/json/howToCiteData";
import { Row, Col } from "react-bootstrap";
import Sidebar from "../components/navigation/Sidebar";
import { logActivity } from "../data/logging";
// https://zbib.org/   to generate .RIS file

const HowToCite = (props) => {
  const vertHeadHowToCite = {
    h5VerticalText: "Citations",
    h2textTop: "Our",
    h2textBottomStrongBefore: "Publications & Citations",
  };

  const items = [
    { label: "How To Cite", id: "How-To-Cite" },
    { label: "Our Papers", id: "Our-Papers" },
    { label: "Related Papers", id: "Related-Papers" },
    { label: "Website Citation", id: "Website-Citation" },
  ];
  useEffect(() => {
    logActivity();
  }, []);

  return (
    <>
      <Helmet>
        {getTitle("howToCite")}
        {getMeta("howToCite")}
      </Helmet>
      <CssBaseline />
      <div id="top-heading"></div>
      <Row className="gg-baseline">
        <Col sm={12} md={12} lg={12} xl={3} className="sidebar-col">
          <Sidebar items={items} />
        </Col>
        <Col sm={12} md={12} lg={12} xl={9} className="sidebar-page">
          <div className="sidebar-page-mb">
            <VerticalHeadingLogo post={vertHeadHowToCite} />
            <PanelHowToCite id="How-to-Cite" data={howToCiteData.howToCite} />
            <PanelHowToCite id="Our-Papers" data={howToCiteData.ourPapers} />
            <PanelHowToCite id="Related-Papers" data={howToCiteData.relatedPapers} />
            <PanelHowToCite id="Website-Citation" data={howToCiteData.websiteCitation} />
          </div>
        </Col>
      </Row>
    </>
  );
};
export default HowToCite;
