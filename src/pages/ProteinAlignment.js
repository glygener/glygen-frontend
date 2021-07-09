/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useReducer } from "react";
import { getIsoAlignment } from "../data/protein";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { Grid } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import DetailTooltips from "../data/json/detailTooltips.json";
import HelpTooltip from "../components/tooltip/HelpTooltip";
import FeedbackWidget from "../components/FeedbackWidget";
import SequenceDashboard from "../components/sequence/SequenceDashboard";
import routeConstants from "../data/json/routeConstants";
import stringConstants from "../data/json/stringConstants";
import Alignment from "../components/Alignment";
import Button from "react-bootstrap/Button";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import SequenceViewer from "../components/sequence/SequenceViewer";
import "../css/proteinsequence.css";

const proteinStrings = stringConstants.protein.common;

const items = [
  { label: stringConstants.sidebar.alignment.displayname, id: "Alignment" },
  { label: stringConstants.sidebar.summary.displayname, id: "Summary" },
];

const ProteinAlignment = () => {
  let { id, alignment } = useParams();

  const [data, setData] = useState({});

  const isIsoform = alignment === "isoformset.uniprotkb";
  const [pageLoading, setPageLoading] = useState(true);
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

  useEffect(() => {
    setPageLoading(true);
    logActivity("user", id);
    const getData = getIsoAlignment(id, alignment);
    getData.then(({ data }) => {
      if (data.code) {
        let message = "Alignment api call";
        logActivity("user", id, "No results. " + message);
        setPageLoading(false);
      } else {
        setData(data);
        setPageLoading(false);
      }
    });

    getData.catch(({ response }) => {
      let message = "Alignment api call";
      axiosError(response, id, message, setPageLoading, setAlertDialogInput);
    });
    // eslint-disable-next-line
  }, []);

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

  let newData = {};
  if (data && data.sequences) {
    newData = {
      ...data,
      sequences: data.sequences.map((seq) => ({
        ...seq,
        clickThruUrl: isIsoform
          ? `${routeConstants.proteinDetail}${id}#Isoforms`
          : `${routeConstants.proteinDetail}${seq.id}`,
      })),
    };
  }

  const { sequences, details, consensus } = newData;

  return (
    <>
      <Row className="gg-baseline">
        <Col sm={12} md={12} lg={12} xl={3} className="sidebar-col">
          <Sidebar items={items} />
        </Col>

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
                        <strong className="nowrap">{id}</strong>
                      </span>
                    </h2>
                  </div>
                </Grid>
              </Row>
            </div>
            <React.Fragment>
              <Helmet>
                {getTitle("proteinAlignment", {
                  uniprot_canonical_ac: id && id ? id : "",
                })}
                {getMeta("proteinAlignment")}
              </Helmet>
              <FeedbackWidget />
              <SequenceDashboard
                details={details}
                sequenceObject={sequences}
                selectedHighlights={selectedHighlights}
                setSelectedHighlights={setSelectedHighlights}
                sequenceSearchText={sequenceSearchText}
                setSequenceSearchText={setSequenceSearchText}
                showNumbers={isIsoform}
              />
              <PageLoader pageLoading={pageLoading} />
              <DialogAlert
                alertInput={alertDialogInput}
                setOpen={(input) => {
                  setAlertDialogInput({ show: input });
                }}
              />
              {/* Button */}
              <div className="text-right gg-download-btn-width">
                <Link to={`${routeConstants.proteinDetail}${id}`}>
                  <Button type="button" style={{ marginLeft: "5px" }} className="gg-btn-blue">
                    Back To Protein Details
                  </Button>
                </Link>
              </div>
              {/* Alignment */}
              <Accordion
                id="Alignment"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.alignment.Isoalignment.title}
                        text={DetailTooltips.alignment.Isoalignment.text}
                        urlText={DetailTooltips.alignment.Isoalignment.urlText}
                        url={DetailTooltips.alignment.Isoalignment.url}
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
                    <Card.Body className="card-padding-zero">
                      <div className="m-3">
                        {newData && (
                          <SequenceViewer
                            details={details}
                            consensus={consensus}
                            sequenceObject={sequences}
                            selectedHighlights={selectedHighlights}
                            sequenceSearchText={sequenceSearchText}
                            multiSequence={true}
                          />
                        )}
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Summary */}
              <Accordion
                id="Summary"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.alignment.summary.title}
                        text={DetailTooltips.alignment.summary.text}
                        urlText={DetailTooltips.alignment.summary.urlText}
                        url={DetailTooltips.alignment.summary.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.summary.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() => toggleCollapse("summary", collapsed.summary)}
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.summary ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0" out={collapsed.summary ? "false" : "true"}>
                    <Card.Body className="card-padding-zero">
                      <Table hover>
                        <tbody className="table-body">
                          <tr className="table-row">
                            <td className="trclass">
                              <strong>{proteinStrings.date.name}: </strong>
                              {data.date}
                            </td>
                          </tr>
                          {data && data.algorithm && (
                            <tr className="table-row">
                              <td className="trclass">
                                <strong>{proteinStrings.algorithm.name}: </strong>
                                <a
                                  href={data.algorithm.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {data.algorithm.name}
                                </a>
                              </td>
                            </tr>
                          )}
                          <tr className="table-row">
                            <td className="trclass">
                              <strong> {proteinStrings.identical_positions.name}:</strong>{" "}
                              {data.identical_positions}
                            </td>
                          </tr>
                          <tr className="table-row">
                            <td className="trclass">
                              <strong> {proteinStrings.similar_positions.name}:</strong>{" "}
                              {data.similar_positions}
                            </td>
                          </tr>
                          <tr className="table-row">
                            <td className="trclass">
                              <strong> {proteinStrings.cluster_id.name}:</strong> {data.cls_id}
                            </td>
                          </tr>
                          <tr className="table-row">
                            <td className="trclass">
                              <strong>{proteinStrings.identity.name}:</strong> {data.identity}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Button */}
              <div className="text-right gg-download-btn-width">
                <Link to={`${routeConstants.proteinDetail}${id}`}>
                  <Button type="button" style={{ marginLeft: "5px" }} className="gg-btn-blue">
                    Back To Protein Details
                  </Button>
                </Link>
              </div>
            </React.Fragment>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ProteinAlignment;
