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
import {
  GLYGEN_BUILD,
} from "../envVariables";

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
  { label: stringConstants.sidebar.components.displayname, id: "Components" },
  { label: stringConstants.sidebar.condition.displayname, id: "Condition" },
  { label: stringConstants.sidebar.exposure_agent.displayname, id: "Exposure-Agent" },
  { label: stringConstants.sidebar.evidence.displayname, id: "Evidence" },

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

  const [data, setData] = useState([]);
  const [publication, setPublication] = useState([]);
  const [itemsCrossRef, setItemsCrossRef] = useState([]);
  const [componentTabSelected, setComponentTabSelected] = useState("glycan");
  const [BESTBiomarkerRole, setBESTBiomarkerRole] = useState([]);
  const [components, setComponents] = useState(undefined);
  const [biomarkerId, setBiomarkerId] = useState("");
  const [biomarkerCanonicalId, setBiomarkerCanonicalId] = useState("");
  const [evidence, setEvidence] = useState("");
  const [glycanComponents, setGlycanComponents] = useState("");
  const [proteinComponents, setProteinComponents] = useState("");

  const [pageLoading, setPageLoading] = useState(true);
  const [dataStatus, setDataStatus] = useState("Fetching Data.");
  const [publicationSort, setPublicationSort] = useState("date");
  const [publicationDirection, setPublicationDirection] = useState("desc");
  const [cardLoadingPub, setCardLoadingPub] = useState(false);
  const [publicationTotal, setPublicationTotal] = useState(undefined);
  const [sideBarData, setSidebarData] = useState(items);
  const [conditionData, setConditionData] = useState([]);
  const [exposureAgentData, setExposureAgentData] = useState([]);

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
        setBESTBiomarkerRole(data.best_biomarker_role);
        setComponents(data.biomarker_component);
        setBiomarkerId(data.biomarker_id);
        setBiomarkerCanonicalId(data.biomarker_canonical_id);
        setItemsCrossRef(data.crossref);


        let glyComp = data.biomarker_component.filter(obj => obj.assessed_entity_type === "glycan").map((obj) => {return {evidence : obj.evidence_source, biomarker : obj.biomarker, assessed_biomarker_entity_id : obj.assessed_biomarker_entity_id, assessed_biomarker_entity: obj.assessed_biomarker_entity ? obj.assessed_biomarker_entity.recommended_name : "", specimen_id : obj.specimen ? obj.specimen.map(obj => obj.id).filter(obj => obj !== undefined) : [], specimen : obj.specimen}})

        let proComp = data.biomarker_component.filter(obj => obj.assessed_entity_type === "protein").map((obj) => {return {evidence : obj.evidence_source, biomarker : obj.biomarker, assessed_biomarker_entity_id : obj.assessed_biomarker_entity_id, assessed_biomarker_entity: obj.assessed_biomarker_entity ? obj.assessed_biomarker_entity.recommended_name : "", loinc_code : obj.specimen ?  obj.specimen.map(obj => obj.loinc_code).filter(obj => obj !== undefined) : [], specimen_id : obj.specimen ? obj.specimen.map(obj => obj.id).filter(obj => obj !== undefined) : [], specimen : obj.specimen}})

        setGlycanComponents(glyComp);
        setProteinComponents(proComp);

        setComponentTabSelected(glyComp && glyComp.length > 0 ? "glycan" : "protein");

        if (data.condition) {
          let conditionDataTemp = conditionDataRearrangement();
          setConditionData(conditionDataTemp);
          function conditionDataRearrangement() {
            var condition = []
            condition.push(data.condition);
            for (var i = 0; i < condition.length; i++) {
              if (condition[i].synonyms) {
                var synTemp = [];
                var synonyms = condition[i].synonyms.slice();
                for (var j = 0, k = 0; j < condition[i].synonyms.length; j++) {
                  var temp = synonyms.filter((syn) => syn.name === condition[i].synonyms[j].name);
                  if (temp && temp.length) {
                    synTemp[k] = {
                      name: condition[i].synonyms[j].name,
                      resource: temp,
                    };
                    synonyms = synonyms.filter((syn) => syn.name !== synTemp[k].name);
                    k++;
                  }
                }
                condition[i].synonyms = synTemp;
                condition[i].synShortLen = synTemp.length > 2 ? 2 : synTemp.length;
                condition[i].synLen = synTemp.length;
                condition[i].synBtnDisplay = synTemp.length <= 2 ? false : true;
                condition[i].synShowMore = true;
              }
            }
            return condition;
          }
        }

        if (data.exposure_agent) {
          var exposure_agent = []
          exposure_agent.push(data.exposure_agent);
          setExposureAgentData(exposure_agent);
        }

        let litEvidence = [];

        if (data.evidence_source) {
          for (let j  = 0; j < data.evidence_source.length; j++) {
            let eveObj = data.evidence_source[j];
            let eve = {
              id : eveObj.id,
              database : eveObj.database,
              url : eveObj.url
            };
            if (eveObj.evidence_list) {
                for (let k  = 0; k < eveObj.evidence_list.length; k++) {
                let evidence_list = [];
                evidence_list.push(eve);
                litEvidence.push({literature_evidence : eveObj.evidence_list[k].evidence, evidence : evidence_list});
              }
            }
          }
        }

        setEvidence(litEvidence);

        let newSidebarData = sideBarData;
        if (!data.biomarker_id || data.biomarker_id.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "General", true);
        }

        if ((glyComp.length === 0 && proComp.glycan === 0)) {
          newSidebarData = setSidebarItemState(newSidebarData, "Components", true);
        }
        if (!data.condition) {
          newSidebarData = setSidebarItemState(newSidebarData, "Condition", true);
        }
        if (!data.exposure_agent) {
          newSidebarData = setSidebarItemState(newSidebarData, "Exposure-Agent", true);
        }
        if (!litEvidence || litEvidence.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Evidence", true);
        }
        if (!data.crossref || data.crossref.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Cross-References", true);
        }
        if (!data.citation || data.citation.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Publications", true);
        }

        setSidebarData(newSidebarData);

        if (data.section_stats) {
          let publi = data.section_stats.filter(obj => obj.table_id === "citation");
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
    condition: true,
    exposureagent: true,
    evidence: true,
    crossref: true,
    publication: true
  });

  function toggleCollapse(name, value) {
    setCollapsed({ [name]: !value });
  }
  // ===================================== //

  function setConditionDataSynonyms(conditionName) {
    let conditionDataTemp = conditionData.map((conData) => {
      if (conData.recommended_name.name === conditionName) {
        conData.synShowMore = conData.synShowMore ? false : true;
      }
      return conData;
    });
    setConditionData(conditionDataTemp);
  }

  const proteinColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList
            key={row.position + row.assessed_biomarker_entity_id}
            evidences={groupEvidences(cell)}
          />
        );
      }
    },
    {
      dataField: "biomarker",
      text: biomarkerStrings.biomarker.name,
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
    },
    {
      dataField: "assessed_biomarker_entity",
      text: biomarkerStrings.assessed_biomarker_entity.name,
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
    },
    {
      dataField: "assessed_biomarker_entity_id",
      text: biomarkerStrings.assessed_biomarker_entity_id.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <>
          {GLYGEN_BUILD === "glygen" ? <LineTooltip text="View protein details">
            <Link to={routeConstants.proteinDetail + row.assessed_biomarker_entity_id}>{row.assessed_biomarker_entity_id}</Link>
          </LineTooltip> : <span>{row.assessed_biomarker_entity_id}</span>}
        </>
      ),
    },
    {
      dataField: "loinc_code",
      text: biomarkerStrings.loinc_code.name,
      // sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (cell, row) => {
        return (<>
        <ul style={{ marginLeft: "-40px" }}>
          <ul>
            {row && row.loinc_code && row.loinc_code.map(obj => (
              <li>{obj}</li>))}
          </ul>
        </ul>
      </>);
      }
    },
    {
      dataField: "specimen_id",
      text:  biomarkerStrings.specimen_name.name,
      // sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (cell, row) => {
        return (<>
        <ul style={{ marginLeft: "-40px" }}>
          <ul>
            {row && row.specimen && row.specimen.map(obj => (
              <li>{obj.name} ({obj.namespace}: <a href={obj.url} target="_blank" rel="noopener noreferrer">{obj.id}</a>)</li>
            ))}
          </ul>
        </ul>
      </>);
      }
    },
  ];

  const glycanColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList
            key={row.position + row.assessed_biomarker_entity_id}
            evidences={groupEvidences(cell)}
          />
        );
      }
    },
    {
      dataField: "biomarker",
      text: biomarkerStrings.biomarker.name,
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
    },
    {
      text: glycanStrings.glycan_image.name,
      formatter: (value, row) => (
        <div className="img-wrapper">
          <img className="img-cartoon" src={getGlycanImageUrl(row.assessed_biomarker_entity_id)} alt="Glycan img" />
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
    {
      dataField: "assessed_biomarker_entity",
      text: biomarkerStrings.assessed_biomarker_entity.name,
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
    },
    {
      dataField: "assessed_biomarker_entity_id",
      text: biomarkerStrings.assessed_biomarker_entity_id.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <>
          {GLYGEN_BUILD === "glygen" ? <LineTooltip text="View glycan details">
            <Link to={routeConstants.glycanDetail + row.assessed_biomarker_entity_id}>{row.assessed_biomarker_entity_id}</Link>
          </LineTooltip> : <span>{row.assessed_biomarker_entity_id}</span>}
        </>
      ),
    },
    {
      dataField: "specimen_id",
      text: biomarkerStrings.specimen_name.name,
      // sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (cell, row) => {
        return (<>
        <ul style={{ marginLeft: "-40px" }}>
          <ul>
            {row && row.specimen && row.specimen.map(obj => (
              <li>{obj.name} ({obj.namespace}: <a href={obj.url} target="_blank" rel="noopener noreferrer">{obj.id}</a>)</li>
            ))}
          </ul>
        </ul>
      </>);
      }
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
                <>
                  {GLYGEN_BUILD === "glygen" ? <><Link
                    to={`${routeConstants.publicationDetail}${ref.type}/${ref.id}`}
                  >
                    {ref.id}
                  </Link>{" "}</> :
                  <><span>{ref.id}</span>{" "}</>}
                </>
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
                                {biomarkerId}
                            </div>
                            {biomarkerCanonicalId && <div>
                              <strong>{biomarkerStrings.biomarker_canonical_id.name}: </strong>{" "}
                                {biomarkerCanonicalId}
                            </div>}
                          </>
                        )}
                      </p>
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
                            ((glycanComponents && glycanComponents.length > 0) || (proteinComponents && proteinComponents.length > 0)) && {
                              display: "Biomarker Component (*.csv)",
                              type: "biomarker_component_csv",
                              format: "csv",
                              data: "biomarker_section",
                              section: "biomarker_component",
                            }
                          ].filter(obj => obj !== undefined)}
                          dataId={id}
                          itemType="biomarker_section"
                          showBlueBackground={true}
                          enable={(glycanComponents && glycanComponents.length > 0) ||
                            (proteinComponents && proteinComponents.length > 0)}
                        />
                      </span>
                      <CardToggle cardid="components" toggle={collapsed.components} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {((glycanComponents || proteinComponents) && !(glycanComponents.length === 0 && proteinComponents.length === 0)) && (
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
                            tabClassName={((!glycanComponents) || (glycanComponents.length === 0)) ? "tab-disabled" : ""}
                            disabled={((!glycanComponents) || (glycanComponents.length === 0))}
                          >
                            <Container className="tab-content-padding">
                              {components && glycanComponents && glycanComponents.length > 0 && (
                                <ClientServerPaginatedTable
                                  data={glycanComponents}
                                  columns={glycanColumns}
                                  onClickTarget={"#components"}
                                  defaultSortField="assessed_biomarker_entity_id"
                                  defaultSortOrder="asc"
                                  record_type={"glycan"}
                                  record_id={id}
                                  serverPagination={false}
                                />
                              )}
                              {(glycanComponents === undefined || glycanComponents.length === 0) && <p>{dataStatus}</p>}
                            </Container>
                          </Tab>
                          <Tab
                            eventKey="protein"
                            className="tab-content-padding"
                            title="Protein"
                            tabClassName={((!proteinComponents) || (proteinComponents.length === 0)) ? "tab-disabled" : ""}
                            disabled={((!proteinComponents) || (proteinComponents.length === 0))}
                          >
                            <Container>
                              {proteinComponents && proteinComponents.length > 0 && (
                                <ClientServerPaginatedTable
                                  data={proteinComponents}
                                  columns={proteinColumns}
                                  onClickTarget={"#components"}
                                  defaultSortField="assessed_biomarker_entity_id"
                                  defaultSortOrder="asc"
                                  record_type={"protein"}
                                  record_id={id}
                                  serverPagination={false}
                                />
                              )}
                               {(proteinComponents === undefined || proteinComponents.length === 0) && <p>{dataStatus}</p>}
                            </Container>
                          </Tab>
                        </Tabs>
                      )}
                      {(((proteinComponents=== undefined  || proteinComponents.length === 0) && (glycanComponents === undefined || glycanComponents.length === 0))) && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              {/*  Condition */}
              <Accordion
                id="Condition"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.biomarker.condition.title}
                        text={DetailTooltips.biomarker.condition.text}
                        urlText={DetailTooltips.biomarker.condition.urlText}
                        url={DetailTooltips.biomarker.condition.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.condition.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="condition" toggle={collapsed.condition} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body className="card-padding-zero">
                      {conditionData && conditionData.length > 0 && (
                        <Table hover fluid="true">
                          <tbody className="table-body">
                            {conditionData.map((thisCondition, indDis) => (
                              <tr className="table-row" key={"dis" + indDis}>
                                <td>
                                  <div className="mb-3">
                                    <Grid item xs={12}>
                                      <div>
                                        <div className="mb-3">
                                          <strong> {proteinStrings.name.name}: </strong>{" "}
                                          {thisCondition.recommended_name.name} (
                                          <a
                                            href={thisCondition.recommended_name.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {thisCondition.recommended_name.id}
                                          </a>
                                          )
                                          <EvidenceList
                                            inline={true}
                                            evidences={groupEvidences(thisCondition.evidence)}
                                          />
                                        </div>
                                        {thisCondition.recommended_name.description && (
                                          <div className="mb-3">
                                            <strong> {proteinStrings.description.name}: </strong>
                                            {thisCondition.recommended_name.description}{" "}
                                          </div>
                                        )}
                                        {thisCondition.synonyms && thisCondition.synonyms.length > 0 && (
                                          <div className="mb-3">
                                            <strong> {proteinStrings.synonyms.name}: </strong>
                                            <ul style={{ marginLeft: "-40px" }}>
                                              <ul>
                                                {thisCondition.synonyms
                                                  .slice(
                                                    0,
                                                    thisCondition.synShowMore
                                                      ? thisCondition.synShortLen
                                                      : thisCondition.synLen
                                                  )
                                                  .map((synonyms, indSyn) => (
                                                    <li key={"syn" + indSyn}>
                                                      {" "}
                                                      {synonyms.name}{" "}
                                                      {synonyms.resource &&
                                                        synonyms.resource.length !== 0 && (
                                                          <>
                                                            {" "}
                                                            [
                                                            {synonyms.resource.map(
                                                              (res, ind, arr) => {
                                                                return (
                                                                  <span key={"spn" + ind}>
                                                                    <a
                                                                      href={res.url}
                                                                      target="_blank"
                                                                      rel="noopener noreferrer"
                                                                    >
                                                                      {res.id}
                                                                    </a>
                                                                    {ind < arr.length - 1
                                                                      ? ", "
                                                                      : ""}
                                                                  </span>
                                                                );
                                                              }
                                                            )}
                                                            ]
                                                          </>
                                                        )}
                                                    </li>
                                                  ))}
                                              </ul>
                                              {thisCondition.synBtnDisplay && (
                                                <Button
                                                  style={{
                                                    marginLeft: "20px",
                                                    marginTop: "5px",
                                                  }}
                                                  className={"lnk-btn"}
                                                  variant="link"
                                                  onClick={() => {
                                                    setConditionDataSynonyms(
                                                      thisCondition.recommended_name.name
                                                    );
                                                  }}
                                                >
                                                  {thisCondition.synShowMore
                                                    ? "Show More..."
                                                    : "Show Less..."}
                                                </Button>
                                              )}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    </Grid>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      )}

                      {BESTBiomarkerRole && BESTBiomarkerRole.length > 0 && (
                        <div style={{paddingTop: "20px", paddingBottom: "20px", paddingRight: "25px", paddingLeft: "25px"}}>
                          <Row>
                            <Col Col md="auto" className="pe-0">
                              <strong>{biomarkerStrings.best_biomarker_role.name}: </strong>
                            </Col>
                            <Col className="nowrap d-inline5 ps-1">
                              {BESTBiomarkerRole.map((obj) => (
                                <>
                                  <span>
                                    {obj.role}
                                  </span>
                                  {<br />}
                                </>
                              ))}
                            </Col>
                          </Row>
                        </div>
                      )}

                      {conditionData && conditionData.length === 0 && BESTBiomarkerRole && BESTBiomarkerRole.length === 0 && (
                        <p className="no-data-msg-publication">{dataStatus}</p>
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              {/*  exposure agent */}
              <Accordion
                id="Exposure-Agent"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.biomarker.exposure_agent.title}
                        text={DetailTooltips.biomarker.exposure_agent.text}
                        urlText={DetailTooltips.biomarker.exposure_agent.urlText}
                        url={DetailTooltips.biomarker.exposure_agent.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.exposure_agent.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="exposureagent" toggle={collapsed.exposureagent} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body className="card-padding-zero">
                      <Table hover fluid="true">
                        {exposureAgentData && exposureAgentData.length > 0 && (
                          <tbody className="table-body">
                            {exposureAgentData.map((thisExposureAgent, indDis) => (
                              <tr className="table-row" key={"dis" + indDis}>
                                <td>
                                  <div className="mb-3">
                                    <Grid item xs={12}>
                                      <div>
                                        <div className="mb-3">
                                          <strong> {proteinStrings.name.name}: </strong>{" "}
                                          {thisExposureAgent.recommended_name.name} (
                                          <a
                                            href={thisExposureAgent.recommended_name.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {thisExposureAgent.recommended_name.id}
                                          </a>
                                          )
                                          <EvidenceList
                                            inline={true}
                                            evidences={groupEvidences(thisExposureAgent.evidence)}
                                          />
                                        </div>
                                        {thisExposureAgent.recommended_name.description && (
                                          <div className="mb-3">
                                            <strong> {proteinStrings.description.name}: </strong>
                                            {thisExposureAgent.recommended_name.description}{" "}
                                          </div>
                                        )}
                                      </div>
                                    </Grid>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        )}
                      </Table>
                      {exposureAgentData && exposureAgentData.length === 0 && (
                        <p className="no-data-msg-publication">{dataStatus}</p>
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              {/* Evidence */}
              <Accordion
                id="Evidence"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.biomarker.evidence.title}
                        text={DetailTooltips.biomarker.evidence.text}
                        urlText={DetailTooltips.biomarker.evidence.urlText}
                        url={DetailTooltips.biomarker.evidence.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.evidence.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="evidence" toggle={collapsed.evidence} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body className="card-padding-zero">
                      <Table hover fluid="true">
                        {evidence && evidence.length > 0 && (
                          <tbody className="table-body">
                            {evidence.map((thisInstance) => (
                              <tr className="table-row">
                                <td>
                                  <div className="mb-3">
                                    <Grid item xs={12}>
                                      <div>
                                        <div className="mb-3">
                                          {thisInstance.literature_evidence && <div>
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
                      {evidence && evidence.length === 0 && (
                        <p className="no-data-msg-publication">{dataStatus}</p>
                      )}
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
                        <p>{dataStatus}</p>
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
                              table_id={"citation"}
                              record_id={id}
                              serverPagination={true}
                              totalDataSize={publicationTotal}
                              currentSort={publicationSort}
                              currentSortOrder={publicationDirection}
                              setAlertDialogInput={setAlertDialogInput}
                              setCardLoading={setCardLoadingPub}
                        />}
                    </div>
                      {(!publication || (publication && publication.length === 0)) && (
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
