/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useReducer } from "react";
import { getGlycanImageUrl } from "../data/glycan";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getMotifDetail } from "../data/motif";
import PaginatedTable from "../components/PaginatedTable";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Sidebar from "../components/navigation/Sidebar";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { glymagesvgInit } from "../data/motif"
import { Grid } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import { FiBookOpen } from "react-icons/fi";
import { groupEvidences } from "../data/data-format";
import EvidenceList from "../components/EvidenceList";
import "../css/detail.css";
import "../css/glymagesvg.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import DownloadButton from "../components/DownloadButton";
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
import ReactCopyClipboard from "../components/ReactCopyClipboard";
import CollapsableReference from "../components/CollapsableReference";
import LineTooltip from "../components/tooltip/LineTooltip";
import routeConstants from "../data/json/routeConstants";
import CardToggle from "../components/cards/CardToggle";
import ClientServerPaginatedTable from "../components/ClientServerPaginatedTable";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const glycanStrings = stringConstants.glycan.common;
const motifStrings = stringConstants.motif.common;
const biomarkerStrings = stringConstants.biomarker.common;

const items = [
  { label: stringConstants.sidebar.general.displayname, id: "General" },
  { label: stringConstants.sidebar.glycans.displayname, id: "Glycans-With-This-Motif" },
  {
    label: stringConstants.sidebar.biomarkers.displayname,
    id: "Biomarkers"
  },
  {
    label: stringConstants.sidebar.digital_seq.displayname,
    id: "Digital-Sequence"
  },
  {
    label: stringConstants.sidebar.cross_ref.displayname,
    id: "Cross-References"
  },
  { label: stringConstants.sidebar.history.displayname, id: "History" },
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


const getItemsCrossRef = data => {
  let itemscrossRef = [];

  //check data.
  if (data.crossref) {
    for (let crossrefitem of data.crossref) {
      let found = "";
      for (let databaseitem of itemscrossRef) {
        if (databaseitem.database === crossrefitem.database) {
          found = true;
          databaseitem.links.push({
            url: crossrefitem.url,
            id: crossrefitem.id
          });
        }
      }
      if (!found) {
        itemscrossRef.push({
          database: crossrefitem.database,
          links: [
            {
              url: crossrefitem.url,
              id: crossrefitem.id
            }
          ]
        });
      }
    }
  }
  return itemscrossRef;
};

const MotifDetail = (props) => {
  let { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState([]);
  const [publication, setPublication] = useState([]);
  const [glytoucan, setGlytoucan] = useState([]);
  const [motif, setMotif] = useState([]);
  const [biomarkers, setBiomarkers] = useState([]);
  const [mass, setMass] = useState([]);
  const [history, setHistory] = useState([]);
  const [itemsCrossRef, setItemsCrossRef] = useState([]);

  const [iupac, setIupac] = useState("");
  const [wurcs, setWurcs] = useState("");
  const [glycoct, setGlycoct] = useState("");
  const [inchi, setInchi] = useState("");
  const [glycam, setGlycam] = useState("");
  const [smiles_isomeric, setSmiles_isomeric] = useState("");
  const [motifName, setMotifName] = useState([]);
  const [motifSynonym, setMotifSynonym] = useState([]);
  const [classification, setClassification] = useState([]);
  const [motifKeywords, setMotifKeywords] = useState([]);
  const [motifDictionary, setMotifDictionary] = useState();
  const [reducingEnd, setReducingEnd] = useState([]);
  const [pagination, setPagination] = useState([]);
  // const [selectedColumns, setSelectedColumns] = useState(MOTIF_COLUMNS);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(20);
  const [totalSize, setTotalSize] = useState();
  const [pageLoading, setPageLoading] = useState(true);
  const [dataStatus, setDataStatus] = useState("Fetching Data.");
  const [motifOn, setMotifOn] = useState(true);

  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function getTimeoutValue(inpuPageSize) {
    let timeout = 2500;
    if (inpuPageSize < 50) {
      return timeout;
    } else {
      return timeout * parseInt(inpuPageSize/50);
    }
  }

  useEffect(() => {
    setPageLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    logActivity("user", id);
    const getMotifDetaildata = getMotifDetail(id);
    getMotifDetaildata.then(({ data }) => {
      if (data.code) {
        let message = "Motif Detail api call";
        logActivity("user", id, "No results. " + message);
        setPageLoading(false);
        setDataStatus("No data available.");
      } else {
        setData(data.results);
         setPublication(data.publication);
         setGlytoucan(data.glytoucan);
         setMass(data.mass);
         setMotif(data.motif);
         setBiomarkers(data.biomarkers);
         setMotifName(data.name);
         setMotifSynonym(data.synonym);
         setMotifKeywords(data.keywords);
         setReducingEnd(data.reducing_end);
         setClassification(data.classification);
         setHistory(data.history);
         setItemsCrossRef(getItemsCrossRef(data));
         setIupac(data.iupac);
         setWurcs(data.wurcs);
         if (data.glycoct) {
           setGlycoct(data.glycoct.replace(/ /g, "\n"));
         }
         setInchi(data.inchi);
         setGlycam(data.glycam);
         setSmiles_isomeric(data.smiles_isomeric);
 
         let dictionary = null;
         if (data.dictionary && data.dictionary.term){
           let temp = {term : null, url : null};
           temp.term = data.dictionary.term;
           if (data.dictionary.evidence && data.dictionary.evidence.length > 0) {
             let evidence = data.dictionary.evidence.find((item => item.database === "Glycan Structure Dictionary"));
             if (evidence){
               temp.url = evidence.url;
             }
           }
           dictionary = temp;
         }
        setMotifDictionary(dictionary);
        setPagination(data.pagination);
        const currentPage = (data.pagination.offset - 1) / sizePerPage + 1;
        setPage(currentPage);
        setTotalSize(data.pagination.total_length);
        glymagesvgInit();
        setPageLoading(false);
        setDataStatus("No data available.");
      }
      setTimeout(() => {
        const anchorElement = location.hash;
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
      setDataStatus("No data available.");
    });
  }, [id]);

  const handleTableChange = (type, changeData) => {

    if (pageLoading)
      return;

    setPage(changeData.page);
    setSizePerPage(changeData.sizePerPage);
    setPageLoading(true);

    getMotifDetail(id, (changeData.page - 1) * changeData.sizePerPage + 1, changeData.sizePerPage, changeData.sortField, changeData.sortOrder).then(
      ({ data }) => {
        // place to change values before rendering

        setData(data.results);
        setPublication(data.publication);
        setGlytoucan(data.glytoucan);
        setPagination(data.pagination);
        setMass(data.mass);
        setMotif(data.motif);
        setBiomarkers(data.biomarkers);
        setMotifName(data.name);
        setMotifSynonym(data.synonym);
        setMotifKeywords(data.keywords);
        setReducingEnd(data.reducing_end);
        setClassification(data.classification);
        setHistory(data.history);
        setItemsCrossRef(getItemsCrossRef(data));
        setIupac(data.iupac);
        setWurcs(data.wurcs);
        if (data.glycoct) {
          setGlycoct(data.glycoct.replace(/ /g, "\n"));
        }
        setInchi(data.inchi);
        setGlycam(data.glycam);
        setSmiles_isomeric(data.smiles_isomeric);

        let dictionary = null;
        if (data.dictionary && data.dictionary.term){
          let temp = {term : null, url : null};
          temp.term = data.dictionary.term;
          if (data.dictionary.evidence && data.dictionary.evidence.length > 0) {
            let evidence = data.dictionary.evidence.find((item => item.database === "Glycan Structure Dictionary"));
            if (evidence){
              temp.url = evidence.url;
            }
          }
          dictionary = temp;
        }
        setMotifDictionary(dictionary);
        setTotalSize(data.pagination.total_length);
        glymagesvgInit();
        setPageLoading(false);

        setTimeout((motifOnInput) => {
          if (!motifOnInput) {
            window.glymagesvg.reset('[glymagesvg_marker1]')
          }
        }, getTimeoutValue(sizePerPage), motifOn);
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
    history: true,
    biomarkers: true,
    digitalSeq: true,
    crossref: true,
    publication: true
  });

  function toggleCollapse(name, value) {
    setCollapsed({ [name]: !value });
  }
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
      formatter: (value, row, rowIndex) => (
        <div className="img-wrapper">
          <div className1="content-cen" 
              glymagesvg_accession={row.glytoucan_ac}
              glymagesvg_annotation = {"MotifAlignments." + id}
              glymagesvg_marker1=""
          />
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

  const biomarkerColumns = [
    {
      dataField: "evidence",
      text: motifStrings.evidence.name,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList
            key={row.biomarker_id}
            evidences={groupEvidences(cell)}
          />
        );
      }
    },
    {
      dataField: "biomarker_id",
      text: biomarkerStrings.biomarker_id.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View biomarker details">
          <Link to={routeConstants.biomarkerDetail + row.biomarker_id}>{row.biomarker_id}</Link>
        </LineTooltip>
      ),
    },
    {
      dataField: "assessed_biomarker_entity",
      text: biomarkerStrings.assessed_biomarker_entity.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
    }
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
            {window.history && window.history.length > 1 && (
              <div className="text-end gg-download-btn-width pb-3">
                <Button
                  type="button"
                  className="gg-btn-blue"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Back
                </Button>
              </div>
            )}
            <div className="text-end gg-download-btn-width">
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
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
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
                    <div className="float-end">
                      <CardToggle cardid="general" toggle={collapsed.general} eventKey="0" toggleCollapse={toggleCollapse}/>
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
                              <Link to={routeConstants.glycanDetail + motif.glytoucan_ac}>
                                {motif.glytoucan_ac}
                              </Link>
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
                        <div>
                          {motifDictionary && motifDictionary.term ? (
                            <>
                              <strong>{motifStrings.glycan_structure_dictionary.name}: </strong>
                              {motifDictionary.url ? (<a href={motifDictionary.url} target="_blank" rel="noopener noreferrer">
                              {motifDictionary.term}
                              </a>) : (<>{motifDictionary.term}</>)}
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
                id="Glycans-With-This-Motif"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
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
                    <div className="float-end">

                      <span className="gg-download-btn-width text-end">
                      <span className="text-end gg-download-btn-width pb-3">
                          <FormControlLabel
                            control={
                              <Switch
                                checked={motifOn}
                                onChange={() => {
                                  if (motifOn) {
                                    window.glymagesvg.reset('[glymagesvg_marker1]')
                                  } else {
                                    window.glymagesvg.highlight('[glymagesvg_marker1]')
                                  }
                                  setMotifOn(!motifOn);
                                }}
                                name="checkedB"
                                color="primary"
                              />
                            }
                            label="Highlight Motif"
                            classes={{
                              root:"gg-txt-blue"
                            }}
                          />
                        </span>
                        <DownloadButton
                          types={[
                            {
                              display: "Glycans With This Motif (*.csv)",
                              type: "glycans_csv",
                              format: "csv",
                              fileName: "glycans_with_this_motif",
                              data: "motif_section",
                              section: "glycans",
                            }
                          ]}
                          dataId={id}
                          itemType="motif_section"
                          showBlueBackground={true}
                          enable={selectedColumns && selectedColumns.length > 0}
                        />
                      </span>

                      <CardToggle cardid="glycans" toggle={collapsed.glycans} eventKey="0" toggleCollapse={toggleCollapse}/>
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

              {/*  Biomarkers */}
              <Accordion
                id="Biomarkers"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.motif.biomarkers.title}
                        text={DetailTooltips.motif.biomarkers.text}
                        urlText={DetailTooltips.motif.biomarkers.urlText}
                        url={DetailTooltips.motif.biomarkers.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.biomarkers.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="biomarkers" toggle={collapsed.biomarkers} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {biomarkers && biomarkers.length !== 0 && (
                        <ClientServerPaginatedTable
                          data={biomarkers}
                          columns={biomarkerColumns}
                          onClickTarget={"#biomarkers"}
                          defaultSortField={"biomarker_id"}
                          defaultSortOrder={"asc"}
                        />
                      )}
                      {biomarkers.length === 0 && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              {/* Digital Sequence */}
              <Accordion
                id="Digital-Sequence"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.motif.digital_sequence.title}
                        text={DetailTooltips.motif.digital_sequence.text}
                        urlText={DetailTooltips.motif.digital_sequence.urlText}
                        url={DetailTooltips.motif.digital_sequence.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.digital_seq.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="digitalSeq" toggle={collapsed.digitalSeq} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body className="text-responsive">
                      <div>
                        {iupac ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                {" "}
                                <strong>{glycanStrings.iupac.name}</strong>
                              </Col>{" "}
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={iupac} />
                              </Col>
                            </Row>
                            <span className="text-overflow">{iupac} </span>
                          </>
                        ) : (
                          <span> </span>
                        )}

                        {wurcs ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                {" "}
                                <strong>{glycanStrings.WURCS.name}</strong>
                              </Col>{" "}
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={wurcs} />
                              </Col>
                            </Row>
                            <span className="text-overflow">{wurcs} </span>
                          </>
                        ) : (
                          <span> </span>
                        )}

                        {glycoct ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                {" "}
                                <strong>{glycanStrings.GlycoCT.name}</strong>
                              </Col>{" "}
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={glycoct} />
                              </Col>
                            </Row>
                            <span id="text_element" className="text-overflow">
                              {glycoct}
                            </span>
                          </>
                        ) : (
                          <span> </span>
                        )}

                        {inchi ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                <strong>
                                  {glycanStrings.inchi_key.shortName}
                                </strong>
                              </Col>
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={inchi} />
                              </Col>
                            </Row>
                            <span className="text-overflow">{inchi}</span>
                          </>
                        ) : (
                          <span> </span>
                        )}

                        {glycam ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                <strong>
                                  {glycanStrings.GLYCAM_IUPAC.shortName}
                                </strong>
                              </Col>
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={glycam} />
                              </Col>
                            </Row>
                            <span className="text-overflow">{glycam}</span>
                          </>
                        ) : (
                          <span> </span>
                        )}
                        {smiles_isomeric ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                <strong>
                                  {glycanStrings.Isomeric_SMILES.shortName}
                                </strong>
                              </Col>
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={smiles_isomeric} />
                              </Col>
                            </Row>
                            <span className="text-overflow">
                              {smiles_isomeric}
                            </span>
                          </>
                        ) : (
                          <span> </span>
                        )}
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
               {/* Cross References */}
               <Accordion
                id="Cross-References"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.motif.cross_references.title}
                        text={DetailTooltips.motif.cross_references.text}
                        urlText={DetailTooltips.motif.cross_references.urlText}
                        url={DetailTooltips.motif.cross_references.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.cross_ref.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="crossref" toggle={collapsed.crossref} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {itemsCrossRef && itemsCrossRef.length ? (
                        <div>
                          <ul className="list-style-none">
                            {/* <Row> */}

                            {itemsCrossRef.map((crossRef, index) => (
                              <li key={`${crossRef.database}-${index}`}>
                                <CollapsableReference
                                  database={crossRef.database}
                                  links={crossRef.links}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <span>{dataStatus}</span>
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* history */}
              <Accordion
                id="History"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.motif.history.title}
                        text={DetailTooltips.motif.history.text}
                        urlText={DetailTooltips.motif.history.urlText}
                        url={DetailTooltips.motif.history.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.history.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="history" toggle={collapsed.history} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse
                    eventKey="0"
                    out={(collapsed.history = "false")}
                  >
                    <Card.Body>
                      {history && history.length ? (
                        <>
                          {history.map(historyItem => (
                            <ul className="pl-3" key={historyItem.description}>
                              <li>
                                {capitalizeFirstLetter(historyItem.description)}{" "}
                              </li>
                            </ul>
                          ))}
                        </>
                      ) : (
                        <span>{dataStatus}</span>
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
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
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
                    <div className="float-end">
                      <CardToggle cardid="publication" toggle={collapsed.publication} eventKey="0" toggleCollapse={toggleCollapse}/>
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
                          <p className="no-data-msg-publication">{dataStatus}</p>
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
