/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useReducer } from "react";
// import { getGlycanImageUrl } from "../data/glycan";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getDiseaseDetail, getGlycanImageUrl } from "../data/disease";
import { Tab, Tabs, Container } from "react-bootstrap";
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import ClientServerPaginatedTable from "../components/ClientServerPaginatedTable";
import ClientServerPaginatedTableFullScreen from "../components/ClientServerPaginatedTableFullScreen";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Sidebar from "../components/navigation/Sidebar";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { getTitle as getTitleBiomarker, getMeta as getMetaBiomarker } from "../utils/biomarker/head";
import { Grid } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import { FiBookOpen } from "react-icons/fi";
import { groupEvidences } from "../data/data-format";
import EvidenceList from "../components/EvidenceList";
import "../css/detail.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import DownloadButton from "../components/DownloadButton";
import { Alert, AlertTitle } from "@mui/material";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import DetailTooltips from "../data/json/diseaseDetailTooltips.json";
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
import AccordionMUI from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PrimeReactProvider } from "primereact/api";
import { usePassThrough } from "primereact/passthrough";
import { Tree } from 'primereact/tree';
import Tailwind from "primereact/passthrough/tailwind";
import {
  GLYGEN_BUILD,
} from "../envVariables";
import { hierarchy } from "d3";

const glycanStrings = stringConstants.glycan.common;
const proteinStrings = stringConstants.protein.common;
const diseaseStrings = stringConstants.disease.common;

const items = [
  { label: stringConstants.sidebar.general.displayname, id: "General" },
  { label: stringConstants.sidebar.hierarchy.displayname, id: "Hierarchy" },
  { label: stringConstants.sidebar.proteins.displayname, id: "Proteins" },
  { label: stringConstants.sidebar.glycans_disease.displayname, id: "Glycans" },
  { label: stringConstants.sidebar.biomarkers.displayname, id: "Biomarkers" },
  { label: stringConstants.sidebar.cross_ref.displayname, id: "Cross-References" }
];

const DiseaseDetail = (props) => {
  let { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState([]);
  const [publication, setPublication] = useState([]);
  const [itemsCrossRef, setItemsCrossRef] = useState([]);  
  const [diseaseId, setDiseaseId] = useState([]);
  const [recommendedName, setRecommendedName] = useState([]);
  const [synonyms, setSynonyms] = useState({});
  const [proteins, setProteins] = useState([]);
  const [glycans, setGlycans] = useState([]);
  const [biomarkers, setBiomarkers] = useState([]);
  const [componentTabSelected, setComponentTabSelected] = useState("glycan");
  const [BESTBiomarkerRole, setBESTBiomarkerRole] = useState([]);
  const [components, setComponents] = useState(undefined);
  const [biomarkerId, setBiomarkerId] = useState("");
  const [biomarkerCanonicalId, setBiomarkerCanonicalId] = useState("");
  const [evidence, setEvidence] = useState("");
  const [glycanComponents, setGlycanComponents] = useState("");
  const [proteinComponents, setProteinComponents] = useState("");
  const [biomarkerComponents, setBiomarkerComponents] = useState("");
  const [nonExistent, setNonExistent] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [dataStatus, setDataStatus] = useState("Fetching Data.");
  const [publicationSort, setPublicationSort] = useState("date");
  const [publicationDirection, setPublicationDirection] = useState("desc");
  const [cardLoadingPub, setCardLoadingPub] = useState(false);
  const [publicationTotal, setPublicationTotal] = useState(undefined);
  const [sideBarData, setSidebarData] = useState(items);
  const [conditionData, setConditionData] = useState([]);
  const [exposureAgentData, setExposureAgentData] = useState([]);

  const [nodes, setNodes] = useState();
	const [expandedKeys, setExpandedKeys] = useState();
	const [selectedNodeKey, setSelectedNodeKey] = useState('');
	const [metadata, setMetadata] = useState();
	const [currentNode, setCurrentNode] = useState();

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
  
      const onSelect = (event) => {
		setMetadata(event.node.data);
		setCurrentNode({ 'id': event.node.key, 'label': event.node.label })
	};

	const onUnselect = (event) => {
		setMetadata();
		setCurrentNode();
	};

	const CustomTailwind = usePassThrough(
		Tailwind,
		{
			panel: {
				title: {
					className: 'leading-none font-light text-2xl'
				}
			}
		}
	);

  useEffect(() => {
    setNonExistent(null);
    setPageLoading(true);
    setNodes();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    logActivity("user", id);
    let idLet = id.replace(":", ".").toLocaleLowerCase();
    const getDiseaseDetaildata = getDiseaseDetail(idLet);
    getDiseaseDetaildata.then(({ data }) => {
      if (data.code) {
        let message = "Biomarker Detail api call";
        logActivity("user", id, "No results. " + message);
        setPageLoading(false);
        setDataStatus("No data available.");
      } else {
        setData(data);

        setItemsCrossRef(getItemsCrossRef(data));
        setDiseaseId(data.disease_id);
        setRecommendedName(data.recommended_name);
        setProteins(data.proteins);
        setGlycans(data.glycans);
        setBiomarkers(data.biomarkers);
        setPublication(data.citation);
        setBESTBiomarkerRole(data.best_biomarker_role);
        setComponents(data.biomarker_component);
        setBiomarkerId(data.biomarker_id);
        setBiomarkerCanonicalId(data.biomarker_canonical_id);


        	function mapData(response) {
						let obj = {
							key: response.id,
              name: response.label,
              label: response.label + " (" + response.id + ")",
							url: routeConstants.diseaseDetail + response.id,
              link_status: response.link_status,
							children: null,
							style: { "padding": ".005rem !important", "paddingLeft": "1.05rem !important" }
						};

						if (response.children) {
							obj.children = []
							for (let i = 0; i < response.children.length; i++) {
								let child = mapData(response.children[i]);
								obj.children.push(child);
							}
						}
						return obj;
					}

        if (data.disease_id && data.children &&  data.children.length > 0) {
					let dataNodes = [];
          let obj = {
            key: data.disease_id,
            name: data.recommended_name.name,
            label: data.recommended_name.name + " (" + data.disease_id + ")",
            url: routeConstants.diseaseDetail + data.disease_id,
            link_status: data.link_status,
            children: [],
            style: { "padding": ".005rem !important", "paddingLeft": "1.05rem !important" }
          };
          dataNodes.push(obj);
          let expandKeys = {};
          expandKeys[dataNodes[0].key] = true;

          for (let i = 0; i < data.children.length; i++) {
            if (data.children[i].id && data.children[i].id !== null) {
              let obj = mapData(data.children[i]);
              dataNodes[0].children.push(obj)
            }
          }
          setExpandedKeys(expandKeys);
					setNodes(dataNodes);
        }

        if (data.synonyms && data.synonyms.length > 0) {
          let synonymsDataTemp = synonymsDataRearrangement();
          setSynonyms([synonymsDataTemp]);
          function synonymsDataRearrangement() {
            var disease = {};
            var synonyms = data.synonyms;
            var synTemp = []
              for (var k = 0; synonyms.length > 0;) {
                var temp = synonyms.filter((syn) => syn.name === synonyms[0].name);
                if (temp && temp.length > 0) {
                  synTemp[k] = {
                    name: synonyms[0].name,
                    resource: temp,
                  };
                  synonyms = synonyms.filter((syn) => syn.name !== synTemp[k].name);
                  k++;
                }
              }
              disease.synonyms = synTemp;
              disease.recommended_name = data.recommended_name;
              disease.synShortLen = synTemp.length > 2 ? 2 : synTemp.length;
              disease.synLen = synTemp.length;
              disease.synBtnDisplay = synTemp.length <= 2 ? false : true;
              disease.synShowMore = true;
              return disease;
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
        if (!data.disease_id || data.disease_id === "") {
          newSidebarData = setSidebarItemState(newSidebarData, "General", true);
        }
        if (!data.children  || data.children.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Hierarchy", true);
        }
        if (!data.proteins || data.proteins.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Proteins", true);
        }
        if (!data.glycans || data.glycans.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Glycans", true);
        }
        if (!data.biomarkers || data.biomarkers.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Biomarkers", true);
        }
        if (!data.crossref || data.crossref.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Cross-References", true);
        }

        setSidebarData(newSidebarData);

        if (data.section_stats) {
          let publi = data.section_stats.filter(obj => obj.table_id === "citation");
          let publiStat = publi[0].table_stats.filter(obj => obj.field === "total");
          setPublicationTotal(publiStat[0]?.count);  
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
    getDiseaseDetaildata.catch(({ response }) => {
      if (
          response.data &&
          response.data.error_list &&
          response.data.error_list.length &&
          response.data.error_list[0].error_code &&
          response.data.error_list[0].error_code === "non-existent-record"
        ) {
          setNonExistent(
            response.data
          );
        } else {
          let message = "disease api call";
          axiosError(response, id, message, setPageLoading, setAlertDialogInput);
          setDataStatus("No data available.");
        }
    });
  }, [id]);

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

const nodeTemplate = (node, options) => {
  let label = <>{node.name}</>;
  let link = undefined;
  if (node.url && node.link_status) {
      link = <Link to={node.url} className="text-700 hover:text-primary">{node.key}</Link>;
  } else {
      link = <span>{node.key}</span>;
  }

  return <span className={options.className}>{label} {" "} ({link})</span>;
}

  function rowStyleFormat(row, rowIdx) {
    return { backgroundColor: rowIdx % 2 === 0 ? "red" : "blue" };
  }

  // ==================================== //
  /**
   * Adding toggle collapse arrow icon to card header individualy.
   * @param {object} glytoucan_ac- glytoucan accession ID.
   **/
  const [collapsed, setCollapsed] = useReducer((state, newState) => ({ ...state, ...newState }), {
    general: true,
    hierarchy: true,
    proteins: true,
    glycans: true,
    biomarkers: true,
    crossref: true
  });

  function toggleCollapse(name, value) {
    setCollapsed({ [name]: !value });
  }
  // ===================================== //

  function setConditionDataSynonyms(name) {
    let diseaseDataTemp = synonyms.map((disData) => {
      if (disData.recommended_name.name === name) {
        disData.synShowMore = disData.synShowMore ? false : true;
      }
      return disData;
    });

    setSynonyms(diseaseDataTemp);
  }

  const proteinColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList
            key={row.interactor_id}
            evidences={groupEvidences(cell)}
          />
        );
      }
    },
    {
      dataField: "uniprot_canonical_ac",
      text: "UniProtKB Accession",
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <>
          <LineTooltip text="View protein details">
            <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>{row.uniprot_canonical_ac}</Link>
          </LineTooltip>
        </>
      ),
    },
    {
      dataField: "glycoprotein",
      text: "Glycoprotein",
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
    },
    {
      dataField: "species",
      text: "Organism",
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
      <>
        {value && value.map(val => (
          <Col className="nowrap ps-0">
            <div>
              {val.name}
            </div>
          </Col>
        ))}
      </>
    )
    },
    {
      dataField: "protein_names",
      text: "Protein Names",
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
      <>
        {value && value.map(val => (
          val.type === "recommended" && <Col className="nowrap ps-0">
            <div>
              {val.name}
            </div>
          </Col>
        ))}
      </>
    )
    },
    {
      dataField: "gene_names",
      text: "Gene Names",
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
      <>
        {value && value.map(val => (
          val.type === "recommended" && <Col className="pre ps-0">
            <div>
              {val.name}
            </div>
          </Col>
        ))}
      </>
    )
    },
  ];

  const biomarkerColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList
            key={row.interactor_id}
            evidences={groupEvidences(cell)}
          />
        );
      }
    },
    {
      dataField: "biomarker_id",
      text: "Biomarker Id",
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <>
          <LineTooltip text="View biomarker details">
            <Link to={routeConstants.biomarkerDetail + row.biomarker_id}>{row.biomarker_id}</Link>
          </LineTooltip>
        </>
      ),
    },
    {
      dataField: "biomarker_canonical_id	",
      text: "Biomarker Canonical Id",
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <>
          <LineTooltip text="View biomarker details">
            <Link to={routeConstants.biomarkerDetail + row.biomarker_id}>{row.biomarker_canonical_id	}</Link>
          </LineTooltip>
        </>
      ),
    },
     {
      dataField: "best_biomarker_role",
      text: "Best Biomarker Role	",
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
      <>
        {value && value.map(val => (
          <Col className="pre ps-0">
            <div>
              {val.role}
            </div>
          </Col>
        ))}
      </>
    )
    },
  ];

  const glycanColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList
            key={row.interactor_id}
            evidences={groupEvidences(cell)}
          />
        );
      }
    },
    {
      dataField: "glytoucan_ac",
      text: "Glycan ID",
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <>
          <LineTooltip text="View glycan details">
            <Link to={routeConstants.glycanDetail + row.glytoucan_ac}>{row.glytoucan_ac}</Link>
          </LineTooltip>
        </>
      ),
    },
    {
        dataField: "glytoucan_ac",
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
            width: "35%",
            textAlign: "left",
            backgroundColor: "#4B85B6",
            color: "white",
            whiteSpace: "nowrap",
          };
        },
      },
      {
      dataField: "species",
      text: "Organism",
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
      <>
        {value && value.map(val => (
          <Col className="pre ps-0">
            <div>
              {val.name}
            </div>
          </Col>
        ))}
      </>
    )
    },
  ];

    if (nonExistent) {
      return (
        <Container className="tab-content-border2">
          <Alert className="erroralert" severity="error">
            {nonExistent.recommended_id_list || nonExistent.unlinked_id_in ? (
              <>

                {nonExistent.unlinked_id_in && <div>{<AlertTitle> The disease ID: {id} is a valid ID in GlyGen but does not have any associated data. The associated IDs are listed below,</AlertTitle>}</div>}
                {nonExistent.unlinked_id_in && <ul>
                  <span>
                    {nonExistent.unlinked_id_in.map((repID) =>
                      <li>
                        {" "}{"Go to Disease ID: "}
                        <Link to={`${routeConstants.diseaseDetail}${repID}`}>
                          {repID}
                        </Link>
                      </li>
                    )}
                  </span>
                </ul>}

                {nonExistent.recommended_id_list && <div>{<AlertTitle> The disease ID: {id} is a synonym of IDs in GlyGen. The recommended IDs are listed below,</AlertTitle>}</div>}
                {nonExistent.recommended_id_list && <ul>
                  <span>
                    {nonExistent.recommended_id_list.map((repID) =>
                      <li>
                        {" "}{"Go to Disease ID: "}
                        <Link to={`${routeConstants.diseaseDetail}${repID}`}>
                          {repID}
                        </Link>
                      </li>
                    )}
                  </span>
                </ul>}
              </>
              ) : (
              <>
                <AlertTitle>
                  The Disease ID: <b>{id} </b> does not exist in GlyGen
                </AlertTitle>
              </>
            )}
          </Alert>
        </Container>
      );
    }

  return (
    <>
      <Row className="gg-baseline">
        <Col sm={12} md={12} lg={12} xl={3} className="sidebar-col">
          <Sidebar items={sideBarData} />
        </Col>

        <Col sm={12} md={12} lg={12} xl={9} className="sidebar-page">
          <div className="sidebar-page-mb">
            <div className="content-box-md">
              <Grid item size= {{ xs: 12, sm: 12 }} className="text-center">
                <div className="horizontal-heading">
                  <h5>Look At</h5>
                  <h2>
                    {" "}
                    <span>
                      Disease Details for
                      <strong>{id && <> {id}</>}</strong>
                    </span>
                  </h2>
                </div>
              </Grid>
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
                    display: "Disease data (*.json)",
                    type: "json",
                    data: "disease_detail",
                  }
                ]}
                dataId={id}
                dataType="disease_detail"
                itemType="disease_detail"
              />
            </div>
            <React.Fragment>
              <Helmet>
                {GLYGEN_BUILD === "glygen" ? getTitle("diseaseDetail", {
                  biomarker_id: biomarkerId ? biomarkerId : "",
                }) :
                getTitleBiomarker("diseaseDetail", {
                  biomarker_id: biomarkerId ? biomarkerId : "",
                })}

                {GLYGEN_BUILD === "glygen" ? getMeta("diseaseDetail") :
                getMetaBiomarker("diseaseDetail")}
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
                        title={DetailTooltips.disease.general.title}
                        text={DetailTooltips.disease.general.text}
                        urlText={DetailTooltips.disease.general.urlText}
                        url={DetailTooltips.disease.general.url}
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
                        {diseaseId ? (
                          <>
                            <div>
                              <strong>{diseaseStrings.disease_id.name}: </strong>{" "}
                                <a
                                href={recommendedName.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {diseaseId}
                              </a>
                            </div>
                            {recommendedName && <div>
                              <strong>{diseaseStrings.recommended_name.name}: </strong>{" "}
                                {recommendedName.name}
                            </div>}

                            {recommendedName && <div>
                              <strong>{diseaseStrings.description.name}: </strong>{" "}
                                {recommendedName.description}
                            </div>}

                             {synonyms && synonyms.length > 0 && (
                                  <div className="mb-3">
                                    <Grid item size= {{ xs: 12 }}>
                                      <div>
                                        {synonyms.map((thisDisease, indDis) => (
                                          <div className="mb-3">
                                            <strong> {proteinStrings.synonyms.name}: </strong>
                                            <ul style={{ marginLeft: "-40px" }}>
                                              <ul>
                                                {thisDisease.synonyms
                                                  .slice(
                                                    0,
                                                    thisDisease.synShowMore
                                                      ? thisDisease.synShortLen
                                                      : thisDisease.synLen
                                                  )
                                                  .map((synms, indSyn) => (
                                                    <li key={"syn" + indSyn}>
                                                      {" "}
                                                      {synms.name}{" "}
                                                      {synms.resource &&
                                                        synms.resource.length !== 0 && (
                                                          <>
                                                            {" "}
                                                            [
                                                            {synms.resource.map(
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
                                              {thisDisease.synBtnDisplay && (
                                                <Button
                                                  style={{
                                                    marginLeft: "20px",
                                                    marginTop: "5px",
                                                  }}
                                                  className={"lnk-btn"}
                                                  variant="link"
                                                  onClick={() => {
                                                    setConditionDataSynonyms(
                                                      thisDisease.recommended_name.name
                                                    );
                                                  }}
                                                >
                                                  {thisDisease.synShowMore
                                                    ? "Show More..."
                                                    : "Show Less..."}
                                                </Button>
                                              )}
                                            </ul>
                                          </div>
                                        ))}
                                      </div>
                                    </Grid>
                                  </div>
                                )}
                          </>
                        ) : (
                          <p>{dataStatus}</p>
                        )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              {/*  Hierarchy */}
              <Accordion
                id="Hierarchy"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.disease.hierarchy.title}
                        text={DetailTooltips.disease.hierarchy.text}
                        urlText={DetailTooltips.disease.hierarchy.urlText}
                        url={DetailTooltips.disease.hierarchy.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">{stringConstants.sidebar.hierarchy.displayname}</h4>

                    <div className="float-end">
                      <CardToggle cardid="hierarchy" toggle={collapsed.hierarchy} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                          {(nodes && nodes.length > 0) && <Row>
                            <Col>
                              <div className="ontology-treeview text-center flex1 flex-wrap justify-content-center">
                                <PrimeReactProvider value={{ unstyled: false, pt: CustomTailwind }}>
                                  <Tree value={nodes} selectionMode="single" selectionKeys={selectedNodeKey} nodeTemplate={nodeTemplate}
                                    onSelect={onSelect} onUnselect={onUnselect} onSelectionChange={(e) => setSelectedNodeKey(e.value)}
                                    expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)} filter filterMode="strict"
                                    filterPlaceholder="Search" className="w-full md:w-30rem ontology-tree"
                                  />
                                </PrimeReactProvider>
                              </div>
                            </Col>
                          </Row>}
                          {(nodes === undefined || nodes.length === 0) && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              {/*  Proteins */}
              <Accordion
                id="Proteins"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.disease.proteins.title}
                        text={DetailTooltips.disease.proteins.text}
                        urlText={DetailTooltips.disease.proteins.urlText}
                        url={DetailTooltips.disease.proteins.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">{stringConstants.sidebar.proteins.displayname}</h4>

                    <div className="float-end">
                    <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            (proteins && proteins.length > 0) && {
                              display: "Proteins (*.csv)",
                              type: "protein_component_csv",
                              format: "csv",
                              data: "disease_section",
                              section: "proteins",
                            }
                          ].filter(obj => obj !== undefined)}
                          dataId={id}
                          itemType="disease_section"
                          showBlueBackground={true}
                          enable={(proteins && proteins.length > 0)}
                        />
                      </span>
                      <CardToggle cardid="proteins" toggle={collapsed.proteins} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {proteins && proteins.length > 0 && (
                        <ClientServerPaginatedTableFullScreen
                          data={proteins}
                          columns={proteinColumns}
                          onClickTarget={"#proteins"}
                          defaultSortField="assessed_biomarker_entity_id"
                          defaultSortOrder="asc"
                          record_type={"protein"}
                          record_id={id}
                          serverPagination={false}
                          viewPort={true}
                          title="Disease Component - Proteins"
                          download={
                            {
                                types:[
                                  {
                                    display: "Proteins (*.csv)",
                                    type: "protein_component_csv",
                                    format: "csv",
                                    data: "disease_section",
                                    section: "proteins",
                                  }
                                ],
                              dataId:id,
                              itemType:"disease_section"
                            }
                          }
                        />
                      )}
                      {(proteins === undefined || proteins.length === 0) && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>


              {/*  Glycans */}
              <Accordion
                id="Glycans"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.disease.glycans.title}
                        text={DetailTooltips.disease.glycans.text}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">{stringConstants.sidebar.glycans_disease.displayname}</h4>

                    <div className="float-end">
                    <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            (glycans && glycans.length > 0) && {
                              display: "Glycans (*.csv)",
                              type: "glycans_component_csv",
                              format: "csv",
                              data: "disease_section",
                              section: "glycans",
                            }
                          ].filter(obj => obj !== undefined)}
                          dataId={id}
                          itemType="disease_section"
                          showBlueBackground={true}
                          enable={(glycans && glycans.length > 0)}
                        />
                      </span>
                      <CardToggle cardid="glycans" toggle={collapsed.glycans} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {glycans && glycans.length > 0 && (
                        <ClientServerPaginatedTableFullScreen
                          data={glycans}
                          columns={glycanColumns}
                          onClickTarget={"#glycans"}
                          defaultSortField="assessed_biomarker_entity_id"
                          defaultSortOrder="asc"
                          record_type={"glycan"}
                          record_id={id}
                          serverPagination={false}
                          viewPort={true}
                          title="Disease Component - Glycans"
                          download={
                            {
                                types:[
                                  {
                                    display: "Glycans (*.csv)",
                                    type: "glycans_component_csv",
                                    format: "csv",
                                    data: "disease_section",
                                    section: "glycans",
                                  }
                                ],
                              dataId:id,
                              itemType:"disease_section"
                            }
                          }
                        />
                      )}
                      {(glycans === undefined || glycans.length === 0) && <p>{dataStatus}</p>}
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
                        title={DetailTooltips.disease.biomarkers.title}
                        text={DetailTooltips.disease.biomarkers.text}
                        urlText={DetailTooltips.disease.biomarkers.urlText}
                        url={DetailTooltips.disease.biomarkers.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">{stringConstants.sidebar.biomarkers.displayname}</h4>

                    <div className="float-end">
                    <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            (biomarkers && biomarkers.length > 0) && {
                              display: "Biomarkers (*.csv)",
                              type: "biomarker_component_csv",
                              format: "csv",
                              data: "disease_section",
                              section: "biomarkers",
                            }
                          ].filter(obj => obj !== undefined)}
                          dataId={id}
                          itemType="disease_section"
                          showBlueBackground={true}
                          enable={(biomarkers && biomarkers.length > 0)}
                        />
                      </span>
                      <CardToggle cardid="biomarkers" toggle={collapsed.biomarkers} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {biomarkers && biomarkers.length > 0 && (
                        <ClientServerPaginatedTableFullScreen
                          data={biomarkers}
                          columns={biomarkerColumns}
                          onClickTarget={"#biomarkers"}
                          defaultSortField="assessed_biomarker_entity_id"
                          defaultSortOrder="asc"
                          record_type={"biomarker"}
                          record_id={id}
                          serverPagination={false}
                          viewPort={true}
                          title="Disease Component - Biomarkers"
                          download={
                            {
                                types:[
                                  {
                                    display: "Biomarkers (*.csv)",
                                    type: "biomarker_component_csv",
                                    format: "csv",
                                    data: "disease_section",
                                    section: "biomarkers",
                                  }
                                ],
                              dataId:id,
                              itemType:"disease_section"
                            }
                          }
                        />
                      )}
                      {(biomarkers === undefined || biomarkers.length === 0) && <p>{dataStatus}</p>}
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
                        title={DetailTooltips.disease.cross_references.title}
                        text={DetailTooltips.disease.cross_references.text}
                        urlText={DetailTooltips.disease.cross_references.urlText}
                        url={DetailTooltips.disease.cross_references.url}
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
            </React.Fragment>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default DiseaseDetail;
