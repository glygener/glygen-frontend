/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useReducer } from "react";
// import { getGlycanImageUrl } from "../data/glycan";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getBiomarkerDetail, getGlycanImageUrl } from "../data/biomarker";
import { Tab, Tabs, Container } from "react-bootstrap";
import ClientServerPaginatedTable from "../components/ClientServerPaginatedTable";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Sidebar from "../components/navigation/Sidebar";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { Grid } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import { FiBookOpen } from "react-icons/fi";
import { groupEvidences } from "../data/data-format";
import EvidenceList from "../components/EvidenceList";
import "../css/detail.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import DownloadButton from "../components/DownloadButton";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import DetailTooltips from "../data/json/biomarkerDetailTooltips.json";
import HelpTooltip from "../components/tooltip/HelpTooltip";
import FeedbackWidget from "../components/FeedbackWidget";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import stringConstants from "../data/json/stringConstants";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import CollapsableReference from "../components/CollapsableReference";
import LineTooltip from "../components/tooltip/LineTooltip";
import routeConstants from "../data/json/routeConstants";
import CardToggle from "../components/cards/CardToggle";
import CardLoader from "../components/load/CardLoader";
import CollapsibleText from "../components/CollapsibleText";

const glycanStrings = stringConstants.glycan.common;
const proteinStrings = stringConstants.protein.common;
const biomarkerStrings = stringConstants.biomarker.common;
const BESTBiomarkerType = "https://www.ncbi.nlm.nih.gov/books/n/biomarkers/";
const BESTBiomarkerTypeUrl = biomarkerStrings.best_biomarker_type_url;

function getBESTBiomarkerTypeUrl(type) {
  return BESTBiomarkerTypeUrl[type] ? BESTBiomarkerTypeUrl[type] : BESTBiomarkerType + type;
}

const items = [
  { label: stringConstants.sidebar.general.displayname, id: "General" },
  { label: stringConstants.sidebar.biomarker_description.displayname, id: "Biomarker-Description" },
  { label: stringConstants.sidebar.components.displayname, id: "Components" },
  {
    label: stringConstants.sidebar.cross_ref.displayname,
    id: "Cross-References"
  },
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

const BiomarkerDetail = (props) => {
  let { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // let { namespace } = useParams();
  // let { ac } = useParams();
  // const id = namespace + "." + ac;

  const [data, setData] = useState([]);
  const [publication, setPublication] = useState([]);
  const [itemsCrossRef, setItemsCrossRef] = useState([]);
  const [componentTabSelected, setComponentTabSelected] = useState("glycan");
  const [asseBiomarkerEntity, setAsseBiomarkerEntity] = useState("");
  const [components, setComponents] = useState("");
  const [instances, setInstances] = useState("");
  const [biomarkerId, setBiomarkerId] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [dataStatus, setDataStatus] = useState("Fetching Data.");
  const [publicationSort, setPublicationSort] = useState("date");
  const [publicationDirection, setPublicationDirection] = useState("desc");
  const [cardLoadingPub, setCardLoadingPub] = useState(false);
  const [publicationTotal, setPublicationTotal] = useState(undefined);
  const [sideBarData, setSidebarData] = useState(items);


  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const setSidebarItemState = (items, itemId, disabledState) => {
    return items.map((item) => {
      return {
        ...item,
        disabled: item.id === itemId ? disabledState : item.disabled,
      };
    });
  };

  useEffect(() => {
    setPageLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    logActivity("user", id);
    const getBiomarkerDetaildata = getBiomarkerDetail(id);
    getBiomarkerDetaildata.then(({ data }) => {
      if (data.code) {
        let message = "Biomarker Detail api call";
        logActivity("user", id, "No results. " + message);
        setPageLoading(false);
        setDataStatus("No data available.");
      } else {
        setData(data);

        setPublication(data.citation);
        setAsseBiomarkerEntity(data.assessed_biomarker_entity);
        setComponents(data.biomarker_component);
        setInstances(data.instances);
        setBiomarkerId(data.biomarker_id);
        setItemsCrossRef(data.crossref);

        setComponentTabSelected(data.components && data.components.glycan && data.components.glycan.length > 0 ? "glycan" : "protein");

        let newSidebarData = sideBarData;
        if (!data.biomarker_id || data.biomarker_id.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "General", true);
        }

        if (!data.instances || data.instances.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Biomarker-Description", true);
        }

        if (!data.components || (!data.components.protein && !data.components.glycan)) {
          newSidebarData = setSidebarItemState(newSidebarData, "Components", true);
        }
        if (!data.crossref || data.crossref.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Cross-References", true);
        }
        if (!data.publication || data.publication.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Publication", true);
        }

        setSidebarData(newSidebarData);

        if (data.section_stats) {
          let publi = data.section_stats.filter(obj => obj.table_id === "publication");
          let publiStat = publi[0].table_stats.filter(obj => obj.field === "total");
          setPublicationTotal(publiStat[0].count);  
        }

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
    getBiomarkerDetaildata.catch(({ response }) => {
      let message = "biomarker api call";
      axiosError(response, id, message, setPageLoading, setAlertDialogInput);
      setDataStatus("No data available.");
    });
  }, [id]);


    
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
    components: true,
    instances: true,
    crossref: true,
    publication: true
  });

  function toggleCollapse(name, value) {
    setCollapsed({ [name]: !value });
  }
  // ===================================== //

  const glycanColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList
            key={row.position + row.uniprot_canonical_ac}
            evidences={groupEvidences(cell)}
          />
        );
      }
    },
    {
      dataField: "accession",
      text: glycanStrings.glycan_id.name,
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View glycan details">
          <Link to={routeConstants.glycanDetail + row.accession}>{row.accession}</Link>
        </LineTooltip>
      ),
    },
    {
      text: glycanStrings.glycan_image.name,
      formatter: (value, row) => (
        <div className="img-wrapper">
          <img className="img-cartoon" src={getGlycanImageUrl(row.accession)} alt="Glycan img" />
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

  const proteinColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList
            key={row.position + row.uniprot_canonical_ac}
            evidences={groupEvidences(cell)}
          />
        );
      }
    },
    {
      dataField: "name",
      text: proteinStrings.protein_name.name,
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
    },
    {
      dataField: "accession",
      text: proteinStrings.uniprot_canonical_ac.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View protein details">
          <Link to={routeConstants.proteinDetail + row.accession}>{row.accession}</Link>
        </LineTooltip>
      ),
    },
  ];

  const paperColumns = [
    {
      headerStyle: (colum, colIndex) => {
        return { display: "none" };
      },
      formatter: (cell, row) => {
        return (
          <div>
          <div>
            <h5 style={{ marginBottom: "3px" }}>
              <strong>{row.title}</strong>{" "}
            </h5>
          </div>
          <div>{row.authors}</div>
          <div>
            {row.journal} <span>&nbsp;</span>(
            {row.date})
          </div>
          <div>
            {row.reference.map(ref => (
              <>
                <FiBookOpen />
                <span style={{ paddingLeft: "15px" }}>
                  {ref.type}:
                </span>{" "}
                <Link
                  to={`${routeConstants.publicationDetail}${ref.type}/${ref.id}`}
                >
                  <>{ref.id}</>
                </Link>{" "}
              </>
            ))}
          </div>
          <EvidenceList
            inline={true}
            evidences={groupEvidences(row.evidence)}
          />
        </div>
        );
      }
    }
  ];

  return (
    <>
      <Row className="gg-baseline">
        <Col sm={12} md={12} lg={12} xl={3} className="sidebar-col">
          <Sidebar items={sideBarData} />
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
                        Biomarker Details for
                        <strong>{id && <> {id}</>}</strong>
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
                    display: "Biomarker data (*.json)",
                    type: "json",
                    data: "biomarker_detail",
                  }
                ]}
                dataId={id}
                dataType="biomarker_detail"
                itemType="biomarker_detail"
              />
            </div>
            <React.Fragment>
              <Helmet>
                {getTitle("biomarkerDetail", {
                  biomarker_id: biomarkerId ? biomarkerId : "",
                })}

                {getMeta("biomarkerDetail")}
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
                        title={DetailTooltips.biomarker.general.title}
                        text={DetailTooltips.biomarker.general.text}
                        urlText={DetailTooltips.biomarker.general.urlText}
                        url={DetailTooltips.biomarker.general.url}
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
                        {biomarkerId && (
                          <>
                            <div>
                              <strong>{biomarkerStrings.biomarker_id.name}: </strong>{" "}
                              {/* <a href={motif.url} target="_blank" rel="noopener noreferrer"> */}
                                {biomarkerId}
                              {/* </a> */}
                            </div>
                            {asseBiomarkerEntity && <div>
                              <strong>{biomarkerStrings.assessed_biomarker_entity.name}: </strong>{" "}
                              {/* <a href={motif.url} target="_blank" rel="noopener noreferrer"> */}
                                {asseBiomarkerEntity}
                              {/* </a> */}
                            </div>}
                          </>
                        )}
                      </p>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              {/* Biomarker Description */}
              <Accordion
                id="Biomarker-Description"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.biomarker.biomarker_description.title}
                        text={DetailTooltips.biomarker.biomarker_description.text}
                        urlText={DetailTooltips.biomarker.biomarker_description.urlText}
                        url={DetailTooltips.biomarker.biomarker_description.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.biomarker_description.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="instances" toggle={collapsed.instances} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body className="card-padding-zero">
                      <Table hover fluid="true">
                        {instances && instances.length > 0 && (
                          <tbody className="table-body">
                            {instances.map((thisInstance) => (
                              <tr className="table-row">
                                <td>
                                  <div className="mb-3">
                                    <Grid item xs={12}>
                                      <div>
                                        <div className="mb-3">
                                        {thisInstance.status && <div>
                                        <strong> {biomarkerStrings.biomarker_status.name}: </strong>{" "}
                                          {thisInstance.status} 
                                          </div>}
                                          {thisInstance.best_biomarker_type && <div>
                                          <strong> {biomarkerStrings.best_biomarker_type.name}: </strong>{" "}
                                          <a href={getBESTBiomarkerTypeUrl(thisInstance.best_biomarker_type)} target="_blank" rel="noopener noreferrer">
                                            {thisInstance.best_biomarker_type}
                                          </a>
                                          </div>}
                                          {thisInstance.tissue && <div>
                                          <strong> {biomarkerStrings.specimen_type.name}: </strong>{" "}
                                          {thisInstance.tissue.name} (
                                          {thisInstance.tissue.namespace}{": "}
                                          <a
                                            href={thisInstance.tissue.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {thisInstance.tissue.id}
                                          </a>
                                          )
                                          </div>}
                                          {thisInstance.loinc_code && <div>
                                          <strong> {biomarkerStrings.loinc_code.name}: </strong>{" "}
                                          {thisInstance.loinc_code}
                                          </div>}
                                          {thisInstance.disease && <div>
                                          <strong> {biomarkerStrings.disease_name.name}: </strong>{" "}
                                          {thisInstance.disease.recommended_name.name} (
                                          <a
                                            href={thisInstance.disease.recommended_name.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {thisInstance.disease.recommended_name.id}
                                          </a>
                                          )
                                          </div>}
                                          {thisInstance.literature_evidence && <div>
                                           <strong> {biomarkerStrings.literature_evidence.name}: </strong>{" "}
                                            <CollapsibleText text={thisInstance.literature_evidence} lines={2} />
                                          </div>}
                                          <div>
                                            <EvidenceList
                                              inline={true}
                                              evidences={groupEvidences(thisInstance.evidence)}
                                            />
                                          </div>
                                        </div>                                   
                                      </div>
                                    </Grid>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        )}
                      </Table>
                      {instances && instances.length === 0 && (
                        <p className="no-data-msg-publication">{dataStatus}</p>
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              {/*  Components */}
              <Accordion
                id="Components"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.biomarker.components.title}
                        text={DetailTooltips.biomarker.components.text}
                        urlText={DetailTooltips.biomarker.components.urlText}
                        url={DetailTooltips.biomarker.components.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">{stringConstants.sidebar.components.displayname}</h4>

                    <div className="float-end">
                    <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            components && components.glycan && components.glycan.length > 0  && {
                              display: "Glycan (*.csv)",
                              type: "component_glycan_csv",
                              format: "csv",
                              data: "biomarker_section",
                              section: "component_glycan",
                            },
                            components && components.protein && components.protein.length > 0 && {
                              display: "Protein (*.csv)",
                              type: "component_protein_csv",
                              format: "csv",
                              data: "biomarker_section",
                              section: "component_protein",
                            }
                          ].filter(obj => obj !== undefined)}
                          dataId={id}
                          itemType="biomarker_section"
                          showBlueBackground={true}
                          enable={(components && components.glycan && components.glycan.length > 0) ||
                            (components && components.protein && components.protein.length > 0)}
                        />
                      </span>
                      <CardToggle cardid="components" toggle={collapsed.components} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {components && ((components.glycan || components.protein) || (components.glycan.length !== 0 || components.protein.length !== 0 )) && (
                        <Tabs
                          activeKey={componentTabSelected}
                          onSelect={(key) => {
                            setComponentTabSelected(key);
                          }}
                          transition={false}
                          mountOnEnter={true}
                          unmountOnExit={true}
                        >
                          <Tab
                            eventKey="glycan"
                            title="Glycan"
                            tabClassName={(components && ((!components.glycan) || (components.glycan.length === 0))) ? "tab-disabled" : ""}
                            disabled={(components && ((!components.glycan) || (components.glycan.length === 0)))}
                          >
                            <Container className="tab-content-padding">
                              {components && components.glycan && components.glycan.length > 0 && (
                                <ClientServerPaginatedTable
                                  data={components.glycan}
                                  columns={glycanColumns}
                                  onClickTarget={"#components"}
                                  defaultSortField="accession"
                                  defaultSortOrder="asc"
                                  record_type={"protein"}
                                  record_id={id}
                                  serverPagination={false}
                                />
                              )}
                              {(components && (components.glycan === undefined || components.glycan.length === 0)) && <p>{dataStatus}</p>}
                            </Container>
                          </Tab>
                          <Tab
                            eventKey="protein"
                            className="tab-content-padding"
                            title="Protein"
                            tabClassName={(components && ((!components.protein) || (components.protein.length === 0))) ? "tab-disabled" : ""}
                            disabled={(components && ((!components.protein) || (components.protein.length === 0)))}
                          >
                            <Container>
                              {components && components.protein && components.protein.length > 0 && (
                                <ClientServerPaginatedTable
                                  data={components.protein}
                                  columns={proteinColumns}
                                  onClickTarget={"#components"}
                                  default1SortField="start_pos"
                                  default1SortOrder="asc"
                                  record_type={"protein"}
                                  record_id={id}
                                  serverPagination={false}
                                />
                              )}
                               {(components && (components.protein === undefined || components.protein.length === 0))  && <p>{dataStatus}</p>}
                            </Container>
                          </Tab>
                        </Tabs>
                      )}
                      {(!components || ((components.protein === undefined  || components.protein.length === 0) && (components.glycan === undefined || components.glycan.length === 0))) && <p>{dataStatus}</p>}
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
                        title={DetailTooltips.biomarker.cross_references.title}
                        text={DetailTooltips.biomarker.cross_references.text}
                        urlText={DetailTooltips.biomarker.cross_references.urlText}
                        url={DetailTooltips.biomarker.cross_references.url}
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

              {/* publication */}
              <Accordion
                id="Publications"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <CardLoader pageLoading={cardLoadingPub} />
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.biomarker.publications.title}
                        text={DetailTooltips.biomarker.publications.text}
                        urlText={DetailTooltips.biomarker.publications.urlText}
                        url={DetailTooltips.biomarker.publications.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.publication.displayname}
                    </h4>
                    <div className="float-end">
                    <span className="Sorted">Sort By</span>
                      <select
                        className="select-dropdown pt-0 pubselect"
                        value={publicationSort}
                        onChange={(event) => setPublicationSort(event.target.value)}
                      >
                        <option value="title">Title</option>
                        <option value="date">Date</option>
                        <option value="journal">Journal</option>
                        <option value="authors">Author List</option>
                      </select>{" "}
                      <select
                        className="select-dropdown pt-0"
                        value={publicationDirection}
                        onChange={(event) => setPublicationDirection(event.target.value)}
                      >
                        <option value="asc">Asc</option>
                        <option value="desc">Desc</option>
                      </select>
                      <CardToggle cardid="publication" toggle={collapsed.publication} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0" out={!collapsed.publication}>
                    <Card.Body className="card-padding-zero">
                    <div className="m-3">
                      {publicationTotal !== undefined && publication && publication.length > 0 && <ClientServerPaginatedTable
                              // idField={"interactor_id"}
                              data={publication}
                              columns={paperColumns}
                              tableHeader={'paper-table-header'}
                              wrapperClasses={"table-responsive table-height-auto"}
                              defaultSizePerPage={200}
                              default1SortField={"date"}
                              default1SortOrder={"desc"}
                              record_type={"biomarker"}
                              table_id={"publication"}
                              record_id={id}
                              serverPagination={true}
                              totalDataSize={publicationTotal}
                              currentSort={publicationSort}
                              currentSortOrder={publicationDirection}
                              setAlertDialogInput={setAlertDialogInput}
                              setCardLoading={setCardLoadingPub}
                        />}
                    </div>
                      {!publication && (
                        <p className="no-data-msg-publication">{dataStatus}</p>
                      )}
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

export default BiomarkerDetail;
