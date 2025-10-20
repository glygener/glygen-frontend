import React from "react";
import Container from "@mui/material/Container";
import { Row, Col, Image } from "react-bootstrap";
import VerticalHeading from "../../components/headings/VerticalHeading";
import HorizontalHeading from "../../components/headings/HorizontalHeading";
import ugaLogo from "../../images/about/logo_uga_about.svg";
import gwuLogo from "../../images/about/logo_gwu_about.svg";
import missionImg from "../../images/about/about-mission.png";
import OurMissionImg from "../../components/about/OurMissionImg";
import nihImg from "../../images/about/logo-NIH.svg";
import nigmsImg from "../../images/about/logo-NIGMS.svg"
import glycosciImg from "../../images/about/logo-Glycoscience.svg";
import cfdeIcon from "../../images/about/logo-CFDE.svg"
import WorldMapImg from "../about/WorldMapImg";
import Box from '@mui/material/Box';
import { GRANT_DETAILS, GLYCOSCIENCE, CCRC_UGA, SMHS_GWU, NIH_GOV, NIGMS, GRANT_DETAILS_OLD, GRANT_DETAILS_COMMONFUND, NIH_COMMONFUND_DATAECOSYSTEM } from "../../envVariables";

const ourMissionImd = {
  title: "Our Mission",
  description:
    "Provide computational and informatics resources and tools for glycosciences research.",
  description2: "Integrate data and knowledge from diverse disciplines relevant to glycobiology.",
  description3: "Address needs inside and outside glycoscience community.",
  image: missionImg,
  imageText: "mission image",
};

const StoryAboutUs = (props) => {
  const vertHeadAboutUs = {
    h5VerticalText: "WHO WE ARE",
    h2textTop: "A Story",
    h2textBottomStrongBefore: "About",
    h2textBottom: "GlyGen",
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
  const vertHeadEffort = {
    h5VerticalText: "who we are",
    h2textTop: "The GlyGen",
    h2textBottom: "Global",
    h2textBottomStrongAfter: "Effort",
  };
  const shorHeadResource = {
    h5VerticalText: "what we do",
    h2textTop: "GlyGen as",
    h2textBottom: "the",
    h2textBottomStrongAfter: "Resource",
  };
  const vertHeadFunding = {
    h5VerticalText: "find out",
    h2textTop: "GlyGen",
    h2textBottomStrongBefore: "Funding",
    h2textBottom: "and Support",
  };

  return (
    <React.Fragment>
      {/* Top header with univ logos */}
      <section>
        <Container maxWidth="lg" className="tab-bigscreen">
          <Row className="content-box-md">
            <Col>
              <VerticalHeading post={vertHeadAboutUs} />
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
                  GlyGen is an international project funded by The National Institutes of Health (NIH) and 
                  The National Institute of General Medical Sciences (NIGMS) to facilitate glycoscience 
                  research by integrating diverse kinds of information related to glycoscience, including 
                  glycomics, genomics, proteomics (including glycoproteomics), cell biology, developmental 
                  biology and biochemistry.
                  </p>
                </Col>
                <Col xs={12} md={6}>
                  <p>
                  GlyGen retrieves information from multiple international data sources and integrates and 
                  harmonizes this data into a single resource. GlyGen allows for exploring this data by 
                  performing unique searches that cannot be executed in any of the existing databases alone. 
                  Information is provided in user friendly graphical web interfaces as well as machine-readable APIs.
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
                The major goal of GlyGen is to develop an integrated, extendable, and cross-disciplinary 
                resource to address specific questions in glycoscience.​
                </p>
              </div>
            </Col>
            <Col xs={12} lg={4}>
              {/* Goal item 02 */}
              <div class="about-item card text-center mb-2">
                <p>
                To provide standardized data under open license allowing sharing and reuse of data 
                with proper attribution that can be manually and programmatically accessed.​
                </p>
              </div>
            </Col>
            <Col xs={12} lg={4}>
              {/* Goal item 03 */}
              <div class="about-item card text-center mb-2">
                <p>
                To develop and integrate new glycoinformatics tools allowing further 
                exploration of glycoscience data.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Effort and worldMap img */}
      <section className="content-box-md">
        <Container maxWidth="lg" className="gg-container">
          <Row>
            <Col xs={12} md={12} xl={6}>
              <VerticalHeading post={vertHeadEffort} />
              <p>GlyGen is a cooperative, global, community-driven project.</p>
              <p>
                An open, standardized environment for independent development and integration of
                additional research tools by other investigators.
              </p>
              <p>GlyGen is an international effort involving core collaborators from Europe 
                as well as many collaborators and data providers from around the world.</p>
              <p>
              Two years of organized discussion and planning involving nearly 100 
              investigators was used to define the scope and use cases for GlyGen prior to 
              the inception in 2017.​ 
              </p>
            </Col>
            <Col xs={12} md={12} xl={6} className="gg-align-middle gg-align-center">
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <WorldMapImg />
              </Box>
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
                  Ongoing technical advances are accelerating the pace and sophistication of
                  glycoscience data acquisition, the transformation of data to glycobiology
                  knowledge, and insight.
                </p>
              </div>
            </Col>
            <Col sm={6}>
              {/* Resource item 02 */}
              <div class="about-item card text-center mb-3 text-blue">
                <p>
                  Understanding is compromised by the lack of glycoinformatics databases and tools
                  to combine information from related disciplines.
                </p>
              </div>
            </Col>
            <Col sm={6}>
              {/* Resource item 03 */}
              <div class="about-item card text-center mb-3 text-blue">
                <p>
                  Functional and biomedical interpretation of glycobiology data is slowed by our
                  limited ability to integrate it with biological knowledge from diverse
                  disciplines.
                </p>
              </div>
            </Col>
            <Col sm={6}>
              {/* Resource item 04 */}
              <div class="about-item card text-center mb-3 border-blue">
                <p>
                  GlyGen addresses these needs as a broadly relevant and sustainable
                  glycoinformatics resource that provides a roadmap to explore data from diverse
                  domains in the context of glycoscience.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Funding */}
      <section className="content-box-md" style={{ paddingTop: "20px", paddingBottom: "60px" }}>
        <Container maxWidth="lg" className="gg-container5 tab-bigscreen">
          <VerticalHeading post={vertHeadFunding} />
          <Row>
            <Col md={"auto"} xl={6}>
            <p>
                From 2022 onward GlyGen is supported and funded by the{" "}
                <a href={NIGMS} target="_blank" rel="noopener noreferrer">
                  National Institute of General Medical Sciences
                </a>{" "}
                at{" "}
                <a href={NIH_GOV} target="_blank" rel="noopener noreferrer">
                  National Institute of Health (NIH)
                </a>{" "}
                under the grant{" "}
                <a href={GRANT_DETAILS} target="_blank" rel="noopener noreferrer">
                  1R24GM146616-01
                </a>{" "}
                and the {" "}
                <a href={NIH_COMMONFUND_DATAECOSYSTEM} target="_blank" rel="noopener noreferrer">
                  National Institutes of Health Office of Strategic Coordination - The Common Fund{" "}
                </a>
                under the grant #{" "}
                <a href={GRANT_DETAILS_COMMONFUND} target="_blank" rel="noopener noreferrer">
                  1OT2OD032092
                </a>
                .
              </p>
              <p>
                Between 2017 and 2022 GlyGen was funded by the{" "}
                <a href={GLYCOSCIENCE} target="_blank" rel="noopener noreferrer">
                  NIH Glycoscience Common Fund Program
                </a>{" "}
                managed by the{" "}
                <a
                  href="https://commonfund.nih.gov/about/osc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Office of Strategic Coordination
                </a>{" "}
                at{" "}
                <a href={NIH_GOV} target="_blank" rel="noopener noreferrer">
                  National Institute of Health (NIH)
                </a>{" "}
                under the grant{" "}
                <a href={GRANT_DETAILS_OLD} target="_blank" rel="noopener noreferrer">
                  1U01GM125267-01
                </a>
                .
              </p>
            </Col>
            <Col className="gg-align-middle gg-align-center">
              <a href={NIH_GOV} target="_blank" rel="noopener noreferrer" className="me-4">
                <Image src={nihImg} />
              </a>
              <a href={GLYCOSCIENCE} target="_blank" rel="noopener noreferrer" className="me-4">
                <Image src={glycosciImg} />
              </a>
              <a href={NIGMS} target="_blank" rel="noopener noreferrer" className="me-4">
                <Image src={nigmsImg} />
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
