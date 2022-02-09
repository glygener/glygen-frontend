/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useReducer } from "react";
import { getIsoAlignment } from "../../data/protein";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Sidebar from "../navigation/Sidebar";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../../utils/head";
import { Grid, Typography } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import FormControl from "@material-ui/core/FormControl";
import Card from "react-bootstrap/Card";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import DetailTooltips from "../../data/json/algnDetailTooltips.json";
import HelpTooltip from "../tooltip/HelpTooltip";
import FeedbackWidget from "../FeedbackWidget";
import SequenceDashboard from "./SequenceDashboard";
import routeConstants from "../../data/json/routeConstants";
import stringConstants from "../../data/json/stringConstants";
import Alignment from "../Alignment";
import Button from "react-bootstrap/Button";
import { logActivity } from "../../data/logging";
import PageLoader from "../load/PageLoader";
import DialogAlert from "../alert/DialogAlert";
import { axiosError } from "../../data/axiosError";
import SequenceViewer from "./SequenceViewer";
import "../../css/proteinsequence.css";
import { GLYGEN_BASENAME } from "../../envVariables";
import SelectControl from "../select/SelectControl";
import Container from "@material-ui/core/Container";

const proteinStrings = stringConstants.protein.common;


const MultiProteinAlignment = ({algnData, proteinID, proteinIDChange}) => {

  const [data, setData] = useState({});

  const isIsoform = false;
  const [pageLoading, setPageLoading] = useState(false);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const [selectedHighlights, setSelectedHighlights] = useState({
    mutation: false,
    site_annotation: false,
    n_link_glycosylation: false,
    o_link_glycosylation: false,
    phosphorylation: false,
    glycation: false,
  });
  const [sequenceSearchText, setSequenceSearchText] = useState("");
  const [ sequences, setSequences ] = useState([]);
  const [ multiSequences, setMultiSequences ] = useState([]);
  
  const [ details, setDetails  ] = useState([]);


  useEffect(() => {
    let proData = algnData[proteinID];

    let newData = [];
    for (let i = 0; i < proData.hsp_list.length; i++) {
      newData.push({
        ...data,
        sequences: proData.hsp_list[i].sequences.filter((seq => seq.id !== "matches")).map((seq) => ({
          ...seq,
          clickThruUrl: seq.uniprot_ac === ""
            ? undefined
            : `${basename}${routeConstants.proteinDetail}${seq.id}`,
           uniprot_ac : seq.uniprot_ac === "" ? seq.id + " " + (i + 1) : seq.uniprot_ac,
           offset: seq.start_pos ? parseInt(seq.start_pos) - 1 : 0,
        })),
        consensus: proData.hsp_list[i].sequences.find(seq => seq.id === "matches").aln
      });
    }
      proData.details.uniprot_canonical_ac = proteinID;
      setDetails([proData.details]);
      setMultiSequences(newData);
      setSequences(newData[0].sequences);
  }, [algnData, proteinID]);

  const perLine = 60;
  // ==================================== //
  /**
   * Adding toggle collapse arrow icon to card header individualy.
   * @param {object} uniprot_canonical_ac- uniprot accession ID.
   **/
  const [collapsed, setCollapsed] = useReducer((state, newState) => ({ ...state, ...newState }), {
    alignment: true,
    summary: true,
  });

  function toggleCollapse(name, value) {
    setCollapsed({ [name]: !value });
  }
  const expandIcon = <ExpandMoreIcon fontSize="large" />;
  const closeIcon = <ExpandLessIcon fontSize="large" />;
  // ===================================== //
  const basename = GLYGEN_BASENAME === "/" ? "" : GLYGEN_BASENAME;

  return (
    <>
          <Container maxWidth="xl" content="center" className="gg-container">

      {/* <Row className="gg-baseline">
        <Col sm={12} md={12} lg={12} xl={9} className="sidebar-page">
          <div className="sidebar-page-mb">
            <div className="content-box-md">
              <Row>
                <Grid item xs={12} sm={12} className="text-center">
                  <div className="horizontal-heading">
                    <h5>Look At</h5>
                    <h2>
                      {" "}
                      <span>
                        {isIsoform ? "Isoform" : "Homolog"} Alignment for Protein{" "}
                        <strong className="nowrap">{"id"}</strong>
                      </span>
                    </h2>
                  </div>
                </Grid>
              </Row>
            </div> */}
            {/* <React.Fragment> */}
              {/* <SequenceDashboard
                details={details}
                sequenceObject={sequences}
                selectedHighlights={selectedHighlights}
                setSelectedHighlights={setSelectedHighlights}
                sequenceSearchText={sequenceSearchText}
                setSequenceSearchText={setSequenceSearchText}
                showNumbers={false}
              /> */}
              <PageLoader pageLoading={pageLoading} />
              <DialogAlert
                alertInput={alertDialogInput}
                setOpen={(input) => {
                  setAlertDialogInput({ show: input });
                }}
              />
              {/* Alignment */}
              {/* <Accordion
                id="Alignment"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={isIsoform ? DetailTooltips.alignment.isoalignment.title : DetailTooltips.alignment.homoalignment.title}
                        text={isIsoform ? DetailTooltips.alignment.isoalignment.text : DetailTooltips.alignment.homoalignment.text}
                        urlText={isIsoform ? DetailTooltips.alignment.isoalignment.urlText : DetailTooltips.alignment.homoalignment.urlText}
                        url={isIsoform ? DetailTooltips.alignment.isoalignment.url : DetailTooltips.alignment.homoalignment.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.alignment.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() => toggleCollapse("alignment", collapsed.alignment)}
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.alignment ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0" out={collapsed.alignment ? "false" : "true"}>
                    <Card.Body className="card-padding-zero"> */}

                <Grid
                        container
                        style={{ margin: '0  auto' }}
                        spacing={3}
                        jus1tify='center'>

                    <Grid item xs={4} sm={4} md={4}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                      >
                        <Typography className={"search-lbl"} gutterBottom>
                          <HelpTooltip
                            title={"Select Protein ID"}
                            text={"Select Protein ID"}
                          />
                          {"Select Protein ID"}
                        </Typography>
                        <SelectControl
                          inputValue={proteinID}
                          setInputValue={(val) => proteinIDChange(val)}
                          menu={algnData && Object.keys(algnData).length > 0 ? Object.keys(algnData).map(item => {return {name : item, id : item}}) : []}
                          required={true}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12}>

                     {multiSequences && multiSequences.map((multiSeque) =>  <div className="mb-3">
                        {algnData && (
                          <SequenceViewer
                            details={details}
                            sequenceObject={multiSeque.sequences}
                            consensus={multiSeque.consensus}
                            selectedHighlights={selectedHighlights}
                            sequenceSearchText={sequenceSearchText}
                            multiSequence={true}
                          />
                        )}
                      </div>)}
                      </Grid>

                    {/* </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </React.Fragment> */}
          {/* </div>
        </Col>
      </Row> */}
      </Grid>
      </Container>
    </>
  );
};

export default MultiProteinAlignment;
