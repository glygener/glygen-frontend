import React from "react";
import Container from "@mui/material/Container";
import { Row, Col, Image } from "react-bootstrap";
import VerticalHeading from "../../../components/headings/VerticalHeading";
import HorizontalHeading from "../../../components/headings/HorizontalHeading";
import ugaLogo from "../../../images/about/logo_uga_about.svg";
import gwuLogo from "../../../images/about/logo_gwu_about.svg";
import missionImg from "../../../images/about/about-mission.png";
import OurMissionImg from "../../../components/about/OurMissionImg";
import nihImg from "../../../images/about/logo-NIH.svg";
import nigmsImg from "../../../images/about/logo-NIGMS.svg"
import glycosciImg from "../../../images/about/logo-Glycoscience.svg";
import cfdeIcon from "../../../images/about/logo-CFDE.svg"
import WorldMapImg from "../../about/WorldMapImg";
import { GRANT_DETAILS, GLYCOSCIENCE, CCRC_UGA, SMHS_GWU, NIH_GOV, NIGMS, GRANT_DETAILS_OLD, GRANT_DETAILS_COMMONFUND, NIH_COMMONFUND_DATAECOSYSTEM, NIH_COMMONFUND } from "../../../envVariables";

const ourMissionImd = {
  title: "Our Mission",
  description:
    "Provide computational and informatics resources and tools for biomarker research.",
  description2: "Integrate biomarker data and knowledge from diverse resources.",
  description3: "",
  image: missionImg,
  imageText: "mission image",
};

const StoryAboutUs = (props) => {
  const vertHeadAboutUs = {
    h5VerticalText: "WHO WE ARE",
    h2textTop: "A Story",
    h2textBottomStrongBefore: "About",
    h2textBottom: "Biomarker Partnership",
  };
  const vertHeadOurStory = {
    h5VerticalText: "what we do",
    h2textTop: "Get to know",
    h2textBottom: "Our",
    h2textBottomStrongAfter: "Story",
  };
  const shorHeadOurGoal = {
    h5VerticalText: "discover",
    h2textTop: "Our",
    h2textTopStrongAfter: "Goals",
  };
  const shorHeadResource = {
    h5VerticalText: "what we do",
    h2textTop: "Biomarker Partnership as",
    h2textBottom: "the",
    h2textBottomStrongAfter: "Resource",
  };
  const vertHeadFunding = {
    h5VerticalText: "find out",
    h2textTop: "Biomarker Partnership",
    h2textBottomStrongBefore: "Funding",
    h2textBottom: "and Support",
  };

  return (
    <React.Fragment>
      {/* Top header with univ logos */}
      <section>
        <Container maxWidth="lg">
          <Row className="content-box-md">
            <Col>
              <VerticalHeading post={vertHeadAboutUs} logo={false} />
            </Col>
            <Col md={"auto"} className="gg-align-middle gg-align-center">
              <Col className="ps-3 pe-3">
                <a href={CCRC_UGA} target="_blank" rel="noopener noreferrer">
                  <Image src={ugaLogo} alt="uga logo" />
                </a>
              </Col>
              <Col className="ps-3 pe-3">
                <a href={SMHS_GWU} target="_blank" rel="noopener noreferrer">
                  <Image src={gwuLogo} alt="gw logo" />
                </a>
              </Col>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Our Mission */}
      <section>
        <OurMissionImg post={ourMissionImd} />
      </section>
      {/* Our Story */}
      <section className="content-box-md">
        <Container maxWidth="lg" className="gg-container">
          <Row>
            <Col sm={12} md={12} lg={12}>
              <VerticalHeading post={vertHeadOurStory} />
              <Row>
                <Col xs={12} md={6}>
                  <p>
                  Biomarker Partnership is a Common Fund Data Ecosystem (CFDE) sponsored project to 
                  develop a knowledgebase that will organize and integrate biomarker data from different 
                  public sources. The data will be connected to contextual information to show a novel
                  systems-level view of biomarkers.
                  </p>
                </Col>
                <Col xs={12} md={6}>
                  <p>
                  The motivation for this project is to improve the harmonization and organization of
                  biomarker data. This will be done by mapping biomarkers from public sources to, and 
                  across, CF data elements. This mapping will bridge knowledge across multiple Data 
                  Coordinating Centers (DCCs) and biomedical disciplines.
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Our Goal */}
      <section className="content-box-md about-section-bg">
        <Container maxWidth="lg" className="gg-container">
          <HorizontalHeading post={shorHeadOurGoal} />
          <Row>
            <Col xs={12} lg={4}>
              {/* Goal item 01 */}
              <div className="about-item card text-center mb-2">
                <p>
                Mapping biomarkers from public sources to relevant data elements.
                </p>
              </div>
            </Col>
            <Col xs={12} lg={4}>
              {/* Goal item 02 */}
              <div class="about-item card text-center mb-2">
                <p>
                Mapping contextual data from participating DCCs.
                </p>
              </div>
            </Col>
            <Col xs={12} lg={4}>
              {/* Goal item 03 */}
              <div class="about-item card text-center mb-2">
                <p>
                Developing a framework for organizing biomarker data.
                </p>
              </div>
            </Col>
            <Col xs={12} lg={4}>
              {/* Goal item 02 */}
              <div class="about-item card text-center mb-2">
                <p>
                Creating tools for querying and exploring biomarker data.
                </p>
              </div>
            </Col>
            <Col xs={12} lg={4}>
              {/* Goal item 03 */}
              <div class="about-item card text-center mb-2">
                <p>
                Disseminating the results of this project to the research community.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
     
      {/* Resource */}
      <section className="content-box-md about-section-bg">
        <Container maxWidth="lg" className="gg-container">
          <HorizontalHeading post={shorHeadResource} />
          <Row>
            <Col sm={6}>
              {/* Resource item 01 */}
              <div className="about-item card text-center mb-3 border-blue">
                <p>
                  Improved access to biomarker data.
                </p>
              </div>
            </Col>
            <Col sm={6}>
              {/* Resource item 02 */}
              <div class="about-item card text-center mb-3 text-blue">
                <p>
                  Increased understanding of the relationships between biomarkers and disease.
                </p>
              </div>
            </Col>
            <Col sm={6}>
              {/* Resource item 03 */}
              <div class="about-item card text-center mb-3 text-blue">
                <p>
                  Facilitated drug development and clinical trials.
                </p>
              </div>
            </Col>
            <Col sm={6}>
              {/* Resource item 04 */}
              <div class="about-item card text-center mb-3 border-blue">
                <p>
                  Improved personalized medicine.
                </p>
              </div>
            </Col>
            <Col sm={6}>
              {/* Resource item 04 */}
              <div class="about-item card text-center mb-3 border-blue">
                <p>
                Improved searching and filtering for biomarker data.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Funding */}
      <section className="content-box-md" style={{ paddingTop: "20px", paddingBottom: "60px" }}>
        <Container maxWidth="lg" className="gg-container5">
          <VerticalHeading post={vertHeadFunding} />
          <Row>
            <Col md={"auto"} xl={6}>
            <p>
                The{" "}
                <a href={NIH_COMMONFUND_DATAECOSYSTEM} target="_blank" rel="noopener noreferrer">
                  CFDE
                </a>{" "}
                Biomarker Partnership is funded by the{" "}
                <a href={NIH_COMMONFUND} target="_blank" rel="noopener noreferrer">
                National Institutes of Health Office of Strategic Corrdination - The Common Fund (NIH)
                </a>{" "}
                under the grant #{" "}
                <a href={GRANT_DETAILS_COMMONFUND} target="_blank" rel="noopener noreferrer">
                  1OT2OD032092
                </a>
                .
              </p>
            </Col>
            <Col className="gg-align-middle gg-align-center">
              <a href={NIH_GOV} target="_blank" rel="noopener noreferrer" className="me-4">
                <Image src={nihImg} />
              </a>
              <a href={NIH_COMMONFUND_DATAECOSYSTEM} target="_blank" rel="noopener noreferrer" className="me-4">
                <Image src={cfdeIcon} />
              </a>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};
export default StoryAboutUs;
