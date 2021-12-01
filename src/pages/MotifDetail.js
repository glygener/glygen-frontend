/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useReducer } from "react";
import { getGlycanImageUrl } from "../data/glycan";
import { useParams } from "react-router-dom";
import { getMotifDetail } from "../data/motif";
import PaginatedTable from "../components/PaginatedTable";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Sidebar from "../components/navigation/Sidebar";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { Grid } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import { FiBookOpen } from "react-icons/fi";
import { groupEvidences } from "../data/data-format";
import EvidenceList from "../components/EvidenceList";
import "../css/detail.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import DownloadButton from "../components/DownloadButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import DetailTooltips from "../data/json/motifDetailTooltips.json";
import HelpTooltip from "../components/tooltip/HelpTooltip";
import FeedbackWidget from "../components/FeedbackWidget";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import stringConstants from "../data/json/stringConstants";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import LineTooltip from "../components/tooltip/LineTooltip";
import routeConstants from "../data/json/routeConstants";
const glycanStrings = stringConstants.glycan.common;
const motifStrings = stringConstants.motif.common;

const items = [
  { label: stringConstants.sidebar.general.displayname, id: "General" },
  { label: stringConstants.sidebar.glycans.displayname, id: "Glycans-With-This-Motifs" },
  {
    label: stringConstants.sidebar.publication.displayname,
    id: "Publications",
  },
];

function addCommas(nStr) {
  nStr += "";
  var x = nStr.split(".");
  var x1 = x[0];
  var x2 = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;

  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
}

const MotifDetail = (props) => {
  let { id } = useParams();
  // let { namespace } = useParams();
  // let { ac } = useParams();
  // const id = namespace + "." + ac;

  const [data, setData] = useState([]);
  const [publication, setPublication] = useState([]);
  const [glytoucan, setGlytoucan] = useState([]);
  const [motif, setMotif] = useState([]);
  const [mass, setMass] = useState([]);
  const [motifName, setMotifName] = useState([]);
  const [motifSynonym, setMotifSynonym] = useState([]);
  const [classification, setClassification] = useState([]);
  const [motifKeywords, setMotifKeywords] = useState([]);
  const [reducingEnd, setReducingEnd] = useState([]);
  const [pagination, setPagination] = useState([]);
  // const [selectedColumns, setSelectedColumns] = useState(MOTIF_COLUMNS);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(20);
  const [totalSize, setTotalSize] = useState();
  const [pageLoading, setPageLoading] = useState(true);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  useEffect(() => {
    setPageLoading(true);
    logActivity("user", id);
    const getMotifDetaildata = getMotifDetail(id);
    getMotifDetaildata.then(({ data }) => {
      if (data.code) {
        let message = "Motif Detail api call";
        logActivity("user", id, "No results. " + message);
        setPageLoading(false);
      } else {
        setData(data.results);
        setPagination(data.pagination);
        const currentPage = (data.pagination.offset - 1) / sizePerPage + 1;
        setPage(currentPage);
        //   setSizePerPage()
        setTotalSize(data.pagination.total_length);
        setPageLoading(false);
      }
      setTimeout(() => {
        const anchorElement = props.history.location.hash;
        if (anchorElement && document.getElementById(anchorElement.substr(1))) {
          document
            .getElementById(anchorElement.substr(1))
            .scrollIntoView({ behavior: "auto" });
        }
      }, 1000);
    });
    getMotifDetaildata.catch(({ response }) => {
      let message = "motif api call";
      axiosError(response, id, message, setPageLoading, setAlertDialogInput);
    });
  }, [id, sizePerPage]);

  const handleTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    setPage(page);
    setSizePerPage(sizePerPage);

    getMotifDetail(id, (page - 1) * sizePerPage + 1, sizePerPage, sortField, sortOrder).then(
      ({ data }) => {
        // place to change values before rendering

        setData(data.results);
        setPublication(data.publication);
        setGlytoucan(data.glytoucan);
        setPagination(data.pagination);
        setMass(data.mass);
        setMotif(data.motif);
        setMotifName(data.name);
        setMotifSynonym(data.synonym);
        setMotifKeywords(data.keywords);
        setReducingEnd(data.reducing_end);
        setClassification(data.classification);
        // setClassification(
        //   data.classification.filter(
        //     classif =>
        //       !(classif.type.name === "Other" && classif.subtype.name === "Other")
        //   )
        // );

        //   setSizePerPage()
        setTotalSize(data.pagination.total_length);
      }
    );
  };
  function rowStyleFormat(row, rowIdx) {
    return { backgroundColor: rowIdx % 2 === 0 ? "red" : "blue" };
  }
  if (data.mass) {
    data.mass = addCommas(data.mass);
  }

  // ==================================== //
  /**
   * Adding toggle collapse arrow icon to card header individualy.
   * @param {object} glytoucan_ac- glytoucan accession ID.
   **/
  const [collapsed, setCollapsed] = useReducer((state, newState) => ({ ...state, ...newState }), {
    general: true,
    glycans: true,
    publication: true,
  });

  function toggleCollapse(name, value) {
    setCollapsed({ [name]: !value });
  }
  const expandIcon = <ExpandMoreIcon fontSize="large" />;
  const closeIcon = <ExpandLessIcon fontSize="large" />;
  // ===================================== //

  const selectedColumns = [
    {
      dataField: glycanStrings.glycan_id.id,
      text: glycanStrings.glycan_id.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View glycan details">
          <Link to={routeConstants.glycanDetail + row.glytoucan_ac}>{row.glytoucan_ac}</Link>
        </LineTooltip>
      ),
    },
    {
      text: glycanStrings.glycan_image.name,
      sort: false,
      selected: true,
      formatter: (value, row) => (
        <div className="img-wrapper">
          <img className="img-cartoon" src={getGlycanImageUrl(row.glytoucan_ac)} alt="Glycan img" />
        </div>
      ),
      headerStyle: (colum, colIndex) => {
        return {
          textAlign: "left",
          backgroundColor: "#4B85B6",
          color: "white",
          whiteSpace: "nowrap",
        };
      },
    },
  ];

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
                        Motif Details for
                        <strong>{motif && motif.accession && <> {motif.accession}</>}</strong>
                      </span>
                    </h2>
                  </div>
                </Grid>
              </Row>
            </div>
            {props.history && props.history.length > 1 && (
              <div className="text-right gg-download-btn-width pb-3">
                <Button
                  type="button"
                  className="gg-btn-blue"
                  onClick={() => {
                    props.history.goBack();
                  }}
                >
                  Back
                </Button>
              </div>
            )}
            <div className="gg-download-btn-width">
              <DownloadButton
                types={[
                  {
                    display: stringConstants.download.motif_image.displayname,
                    type: "png",
                    data: "glycan_image",
                  },
                  {
                    display: stringConstants.download.motif_jsondata.displayname,
                    type: "json",
                    data: "motif_detail",
                  },
                  {
                    display: stringConstants.download.motif_csvdata.displayname,
                    type: "csv",
                    data: "motif_detail",
                  },
                ]}
                dataId={id}
                dataType="motif_detail"
              />
            </div>
            <React.Fragment>
              <Helmet>
                {getTitle("motifDetail", {
                  glytoucan_ac: glytoucan && glytoucan.glytoucan_ac ? glytoucan.glytoucan_ac : "",
                })}

                {getMeta("motifDetail")}
              </Helmet>
              <FeedbackWidget />
              <PageLoader pageLoading={pageLoading} />
              <DialogAlert
                alertInput={alertDialogInput}
                setOpen={(input) => {
                  setAlertDialogInput({ show: input });
                }}
              />
              {/* General */}
              <Accordion
                id="General"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.motif.general.title}
                        text={DetailTooltips.motif.general.text}
                        urlText={DetailTooltips.motif.general.urlText}
                        url={DetailTooltips.motif.general.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.general.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() => toggleCollapse("general", collapsed.general)}
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.general ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <p>
                        {motif && motif.accession && (
                          <>
                            <p>
                              <img
                                className="img-cartoon"
                                src={getGlycanImageUrl(motif.accession)}
                                alt="Cartoon"
                              />
                            </p>
                            <div>
                              <strong>{motifStrings.motif_id.name}: </strong>
                              <a href={motif.url} target="_blank" rel="noopener noreferrer">
                                {motif.accession}
                              </a>
                            </div>
                            <div>
                              <strong>{motifStrings.motif_name.name}: </strong>
                              <a href={motif.url} target="_blank" rel="noopener noreferrer">
                                {motifName}
                              </a>
                            </div>
                            <div>
                              {motifSynonym && motifSynonym.length > 0 ? (
                                <>
                                  <Row>
                                    <Col Col md="auto" className="pr-0">
                                      <strong>{motifStrings.motif_synonym.synonym}: </strong>
                                    </Col>
                                    <Col className="nowrap d-inline5 pl-1">
                                      {motifSynonym.map((synonym) => (
                                        // <Col className="nowrap5 d-inline5 pl-0">
                                        <>
                                          <span>
                                            <a
                                              href={motif.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              {synonym}
                                            </a>
                                          </span>
                                          {<br />}
                                        </>
                                      ))}
                                    </Col>
                                  </Row>
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                            <div>
                              <strong>{motifStrings.glytoucan_ac.name}: </strong>
                              <a href={motif.url} target="_blank" rel="noopener noreferrer">
                                {motif.glytoucan_ac}
                              </a>
                            </div>
                            <div>
                              <strong>{glycanStrings.mass.shortName}: </strong>
                              {mass} Da
                            </div>
                          </>
                        )}
                        {classification &&
                          classification.length > 0 &&
                          classification[0].type.name !== "Other" && (
                            <div>
                              <strong>
                                {glycanStrings.glycan_type.name} /{" "}
                                {glycanStrings.glycan_subtype.name}:{" "}
                              </strong>

                              {classification.map((Formatclassification) => (
                                <>
                                  <a
                                    href={Formatclassification.type.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {Formatclassification.type.name}
                                  </a>
                                  &nbsp; <b>/</b> &nbsp;
                                  <a
                                    href={Formatclassification.subtype.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {Formatclassification.subtype.name}
                                  </a>
                                </>
                              ))}
                            </div>
                          )}
                        <div>
                          {motifKeywords && motifKeywords.length > 0 ? (
                            <>
                              <Row>
                                <Col Col md="auto" className="pr-0">
                                  <strong>{motifStrings.motif_keywords.name}: </strong>
                                </Col>
                                <Col className="nowrap d-inline5 pl-1">
                                  {motifKeywords.map((keywords) => (
                                    <>
                                      <span>
                                        <a
                                          href={keywords.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {keywords.label}
                                        </a>
                                      </span>
                                      {<br />}
                                    </>
                                  ))}
                                </Col>
                              </Row>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div>
                          {reducingEnd && reducingEnd.length > 0 ? (
                            <>
                              <strong>{motifStrings.reducing_end.name}: </strong>
                              {/* <a href={motif.url} target="_blank" rel="noopener noreferrer"> */}
                              {reducingEnd}
                              {/* </a> */}
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </p>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Glycans Containing This Motif */}
              <Accordion
                id="Glycans-With-This-Motifs"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.motif.glycans.title}
                        text={DetailTooltips.motif.glycans.text}
                        urlText={DetailTooltips.motif.glycans.urlText}
                        url={DetailTooltips.motif.glycans.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.glycans.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() => toggleCollapse("glycans", collapsed.glycans)}
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.glycans ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {selectedColumns && selectedColumns.length !== 0 && (
                        <PaginatedTable
                          trStyle={rowStyleFormat}
                          data={data}
                          columns={selectedColumns}
                          page={page}
                          pagination={pagination}
                          sizePerPage={sizePerPage}
                          totalSize={totalSize}
                          onTableChange={handleTableChange}
                          defaultSortField="glytoucan_ac"
                          idField="glytoucan_ac"
                        />
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* publication */}
              <Accordion
                id="Publications"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.motif.publications.title}
                        text={DetailTooltips.motif.publications.text}
                        urlText={DetailTooltips.motif.publications.urlText}
                        url={DetailTooltips.motif.publications.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.publication.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        // as={Card.Header}
                        eventKey="0"
                        onClick={() => toggleCollapse("publication", collapsed.publication)}
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.publication ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0" out={!collapsed.publication}>
                    <Card.Body className="card-padding-zero">
                      <Table hover fluid>
                        {publication && publication.length > 0 ? (
                          <tbody className="table-body">
                            {publication.map((pub, pubIndex) => (
                              <tr className="table-row">
                                <td key={pubIndex}>
                                  <p>
                                    <div>
                                      <h5 style={{ marginBottom: "3px" }}>
                                        <strong>{pub.title}</strong>
                                      </h5>
                                    </div>
                                    <div>{pub.authors}</div>
                                    <div>
                                      {pub.journal} <span>&nbsp;</span>({pub.date})
                                    </div>
                                    <div>
                                      {pub.reference.map((ref) => (
                                        <>
                                          <FiBookOpen />
                                          <span style={{ paddingLeft: "15px" }}>
                                            {/* {glycanStrings.pmid.shortName}: */}
                                            {ref.type}:
                                          </span>{" "}
                                          <Link
                                            to={`${routeConstants.publicationDetail}${ref.type}/${ref.id}`}
                                          >
                                            <>{ref.id}</>
                                          </Link>{" "}
                                          {/* <a
                                            href={ref.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <>{ref.id}</>
                                          </a> */}
                                        </>
                                      ))}
                                    </div>
                                    <EvidenceList evidences={groupEvidences(pub.evidence)} />
                                  </p>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        ) : (
                          <p className="no-data-msg-publication">No data available.</p>
                        )}
                      </Table>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </React.Fragment>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default MotifDetail;
