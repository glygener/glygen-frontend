import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { useLocation } from "react-router-dom";
import { getTitle, getMeta } from "../../utils/biomarker/head";
import CssBaseline from "@mui/material/CssBaseline";
import VerticalHeadingLogo from "../../components/headings/VerticalHeadingLogo";
import PanelHowToCite from "../../components/PanelHowToCite";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import howToCiteData from "../../data/json/biomarker/howToCiteData";
import { Row, Col } from "react-bootstrap";
import Sidebar from "../../components/navigation/Sidebar";
import { logActivity } from "../../data/logging";
// https://zbib.org/   to generate .RIS file

const HowToCite = (props) => {
  const location = useLocation();

  const vertHeadHowToCite = {
    h5VerticalText: "Citations",
    h2textTop: "",
    h2textBottomStrongBefore: "Relevant Publications",
  };

  const items = [
    { label: "Relevant Papers", id: "Relevant-Papers" },
  ];
  useEffect(() => {

    let anchorElement = location.hash;
    if (anchorElement === undefined || anchorElement === null || anchorElement === "") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    logActivity();
  }, []);

  return (
    <>
      <Helmet>
        {getTitle("howToCite")}
        {getMeta("howToCite")}
      </Helmet>
      <CssBaseline />
      <Row className="gg-baseline">
        <Col sm={12} md={12} lg={12} xl={3} className="sidebar-col">
          <Sidebar items={items} />
        </Col>
        <Col sm={12} md={12} lg={12} xl={9} className="sidebar-page">
          <div className="sidebar-page-mb">
            <VerticalHeadingLogo post={vertHeadHowToCite} logo={false}/>
            <PanelHowToCite id="Relevant-Papers" data={howToCiteData.relevantPapers} />
          </div>
        </Col>
      </Row>
    </>
  );
};
export default HowToCite;
