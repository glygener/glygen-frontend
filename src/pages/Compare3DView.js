import React, { useEffect, useState, useRef, useReducer } from "react";
import { useParams } from "react-router-dom";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from 'cytoscape';
import ListFilterWithSlider from "../components/ListFilterWithSlider.js";
import Button from "react-bootstrap/Button";
import { ReactComponent as ArrowRightIcon } from "../images/icons/arrowRightIcon.svg";
import { ReactComponent as ArrowLeftIcon } from "../images/icons/arrowLeftIcon.svg";
import glycanKnowledgegraphJSON from "../data/json/glycanKnowledgegraph.json";
import { Grid } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import SelectControl from "../components/select/SelectControl.js";
import HelpTooltip from "../components/tooltip/HelpTooltip.js";
import { getGlycanGraph } from "../data/glycan.js";
import "../css/graph.css";
import { NavLink } from "react-router-dom";
import GlycanNodeDisplay from "../components/graph/GlycanNodeDisplay.js";
import SiteNodeDisplay from "../components/graph/SiteNodeDisplay.js";
import MotifNodeDisplay from "../components/graph/MotifNodeDisplay.js";
import OrganismNodeDisplay from "../components/graph/OrganismNodeDisplay.js";
import BiomarkerNodeDisplay from "../components/graph/BiomarkerNodeDisplay.js";
import ProteinNodeDisplay from "../components/graph/ProteinNodeDisplay.js";
import { sortByWeight } from "../utils/common.js";
import { getTitle, getMeta } from "../utils/head.js";
import Helmet from "react-helmet";
import FeedbackWidget from "../components/FeedbackWidget.js";
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import { logActivity } from "../data/logging.js";
import PageLoader from "../components/load/PageLoader.js";
import DialogAlert from "../components/alert/DialogAlert.js";
import { axiosError } from "../data/axiosError.js";
import stringConstants from "../data/json/stringConstants";
import AutoTextInput from "../components/input/AutoTextInput.js";
import { getProteinDetail } from "../data/protein.js";
import { getGlycanDetail } from "../data/glycan.js"
import routeConstants from "../data/json/routeConstants";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import CardToggle from "../components/cards/CardToggle.js";
import DownloadButton from "../components/DownloadButton.js";
import DownloadFile from "../components/DownloadFile.js"
import ThreeDViewer from "../components/viewer/ThreeDViewer.js";
import proteinSearchData from '../data/json/proteinSearch';
import ExampleExploreControl from '../components/example/ExampleExploreControl.js';
import glycanSearchData from "../data/json/glycanSearch";
import { sortByOrder } from "../utils/common.js";

export function Compare3DView() {
  let { type, id1, id2 } = useParams();

  let commonProteinData = stringConstants.protein.common;
  let advancedSearch = proteinSearchData.advanced_search;
  let commonGlycanData = stringConstants.glycan.common;
  let advancedSearchGL = glycanSearchData.advanced_search;


  const [appliedFilters, setAppliedFilters] = useState([]);
  const [availableFilters, setAvailableFilters] = useState([]);
  const [defaultKnowGraphData, setDefaultKnowGraphData] = useState(undefined);
  const [defaultAppliedFilters, setDefaultAppliedFilters] = useState([]);
  const [elements, setElements] = useState(undefined);
  const [nodeData, setNodeData] = useState(undefined);
  const [nodeType, setNodeType] = useState("");
  const [inputValueSlider, setInputValueSlider] = useState(50);
  const [maxValueSlider, setMaxValueSlider] = useState(50);

  const [sidebar, setSidebar] = useState(true);
  const [outreachItemsArray, setOutreachItemsArray] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [filterReset, setFilterReset] = useState(0);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  const [structure1, setStructure1] = useState("");
  const [structureUrl1, setStructureUrl1] = useState("");
  const [structureExternalUrl1, setStructureExternalUrl1] = useState("");
  const [structureType1, setStructureType1] = useState("experimental");
  const [structureMenu1, setStructureMenu1] = useState([]);
  const [structureMap1, setStructureMap1] = useState(new Map());
  const [dataStatus1, setDataStatus1] = useState("No Data Available.");
  const [tool_support1, setTool_support1] = useState({ "pdb": "yes" });
  const [inputValue1, setInputValue1] = useState("");
  const [proteinID1, setProteinID1] = useState("");
  const [glycanID1, setGlycanID1] = useState("");


  const [structure2, setStructure2] = useState("");
  const [structureUrl2, setStructureUrl2] = useState("");
  const [structureExternalUrl2, setStructureExternalUrl2] = useState("");
  const [structureType2, setStructureType2] = useState("");
  const [structureMenu2, setStructureMenu2] = useState([]);
  const [structureMap2, setStructureMap2] = useState(new Map());
  const [dataStatus2, setDataStatus2] = useState("No Data Available.");
  const [tool_support2, setTool_support2] = useState({ "pdb": "yes" });
  const [inputValue2, setInputValue2] = useState("");
  const [proteinID2, setProteinID2] = useState("");
  const [glycanID2, setGlycanID2] = useState("");

  const [moleculeType, setMoleculeType] = useState("glycan");


  const myCyRef = useRef();


  const [width, setWith] = useState("1000px");
  const [height, setHeight] = useState("600px");

  const layout = {
    name: "concentric",
    randomize: false,
    fit: true,
    circle: true,
    padding: 10,
    linkDistance: 10,
    centerGraph: true,
    equidistant: false,
    clockwise: true,
    spacingFactor: 3,
    animate: true,
    animationDuration: 1000,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: false,
  };

  /**
 * Function to set protein id value.
 * @param {string} inputProteinId - input protein id value.
 **/
  function proteinIdChange1(inputProteinId) {
    setInputValue1(inputProteinId)
    if (inputProteinId === "") {
      setProteinID1(inputProteinId)
    }
  }

  /**
* Function to set protein id value.
* @param {string} inputProteinId - input protein id value.
**/
  function proteinIdChange2(inputProteinId) {
    setInputValue2(inputProteinId)
    if (inputProteinId === "") {
      setProteinID2(inputProteinId)
    }
  }

  /**
* Function to set protein id value.
**/
  function proteinIdOnChange1(event, newValue, reason) {
    setProteinID1(newValue)
  }

  /**
* Function to set protein id value.
**/
  function proteinIdOnChange2(event, newValue, reason) {
    setProteinID2(newValue)
  }

  /**
 * Function to set glycan id value.
 * @param {string} inputGlycanId - input glycan id value.
 **/
  function glycanIdChange1(inputGlycanId) {
    setInputValue1(inputGlycanId)
    if (inputGlycanId === "") {
      setGlycanID1(inputGlycanId)
    }
  }

  /**
* Function to set glycan id value.
* @param {string} inputGlycanId - input glycan id value.
**/
  function glycanIdChange2(inputGlycanId) {
    setInputValue2(inputGlycanId)
    if (inputGlycanId === "") {
      setGlycanID2(inputGlycanId)
    }
  }

  /**
   * Function to set glycan id value.
   **/
  function glycanIdOnChange1(event, newValue, reason) {
    setGlycanID1(newValue)
  }

  /**
   * Function to set glycan id value.
   **/
  function glycanIdOnChange2(event, newValue, reason) {
    setGlycanID2(newValue)
  }


  // Use effect to update based on params
  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setMoleculeType(type ? type : "glycan");
    id1 ? setInputValue1(id1) : setInputValue1("");
    id2 ? setInputValue2(id2) : setInputValue2("")

    if (type === "protein") {
      setGlycanID1("");
      setGlycanID2("");
      id1 ? setProteinID1(id1) : setProteinID1("");
      id2 ? setProteinID2(id2) : setProteinID2("");
    } else if (type === "glycan") {
      setProteinID1("");
      setProteinID2("");
      id1 ? setGlycanID1(id1) : setGlycanID1("");
      id2 ? setGlycanID2(id2) : setGlycanID2("");
    } else {
      setProteinID1("");
      setProteinID2("");
      setGlycanID1("");
      setGlycanID2("");
    }

  }, [id1, id2, type]);

  //proteinID1
  useEffect(() => {

    //invalid id case
    let menu = []
    let structureMap1 = new Map();
    menu.push({ id: "", name: "No 3D model available" });
    setStructureMenu1(menu);
    setStructureUrl1("");
    setStructureExternalUrl1("");
    setStructureType1("");
    structureMap1.set("", { type: "", url: "", url_external: "" });
    setStructureMap1(structureMap1);
    setStructure1("");

    if (proteinID1 === "" || proteinID1 === undefined || proteinID1 === null) return;
    setPageLoading(true);
    logActivity("user", proteinID1);

    getProteinDetail(proteinID1).then(({ data }) => {
      if (data.code) {
        let message = "Glycan Knowledge Graph api call";
        logActivity("user", proteinID1, "No results. " + message);
        setPageLoading(false);
      } else {
        if (data) {

          function sortMenu(first, second) {
            let ret = 0;
            if (first.type === "experimental" && second.type === "alphafold") {
              ret = -1;
            } else if (first.type === "alphafold" && second.type === "experimental") {
              ret = 1;
            } else {
              if (first.start_pos < second.start_pos) {
                ret = -1;
              } else if (second.start_pos < first.start_pos) {
                ret = 1;
              } else {
                if (first.end_pos > second.end_pos) {
                  ret = -1;
                } else if (second.end_pos > first.end_pos) {
                  ret = 1;
                }
              }
            }
            return ret;
          }


          if (data.structures && data.structures.length > 0) {
            let menu = data.structures.sort(sortMenu).map(item => { return { id: item.pdb_id, name: `${item.type === "experimental" ? "PDB ID" : "AlphaFold ID"}: ${item.pdb_id.toUpperCase()} (Amino acid: ${item.start_pos} - ${item.end_pos})` } });
            setStructureMenu1(menu);

            let structureMap1 = new Map();
            for (let i = 0; i < data.structures.length; i++) {
              structureMap1.set(data.structures[i].pdb_id, { type: data.structures[i].type, url: data.structures[i].url, url_external: data.structures[i].url_external });
            }
            structureMap1.set("", { type: "", url: "", url_external: "" });
            setStructureMap1(structureMap1);

            if (menu.length > 0) {
              setStructure1(menu[0].id);
              setStructureType1(structureMap1.get(menu[0].id).type);
              setStructureUrl1(structureMap1.get(menu[0].id).url);
              setStructureExternalUrl1(structureMap1.get(menu[0].id).url_external);
            }
          } else {
            let menu = []
            menu.push({ id: "", name: "No 3D model available" });
            setStructureMenu1(menu);
            setStructureUrl1("");
            setStructureExternalUrl1("");
            setStructureType1("");
            structureMap1.set("", { type: "", url: "", url_external: "" });
            setStructureMap1(structureMap1);
            setStructure1("");
          }

          setPageLoading(false);
        }
      }
    })
      .catch(function ({ response }) {
        let message = "Glycan Knowledge Graph api call";
        axiosError(response, proteinID1, message, setPageLoading, setAlertDialogInput);
      });

  }, [proteinID1]);

  //proteinID2
  useEffect(() => {

    //invalid id case
    let menu = []
    let structureMap2 = new Map();
    menu.push({ id: "", name: "No 3D model available" });
    setStructureMenu2(menu);
    setStructureUrl2("");
    setStructureExternalUrl2("");
    setStructureType2("");
    structureMap2.set("", { type: "", url: "", url_external: "" });
    setStructureMap2(structureMap2);
    setStructure2("");

    if (proteinID2 === "" || proteinID2 === undefined || proteinID2 === null) return;

    setPageLoading(true);
    logActivity("user", proteinID2);

    getProteinDetail(proteinID2).then(({ data }) => {
      if (data.code) {
        let message = "Glycan Knowledge Graph api call";
        logActivity("user", proteinID2, "No results. " + message);
        setPageLoading(false);
      } else {
        if (data) {

          function sortMenu(first, second) {
            let ret = 0;
            if (first.type === "experimental" && second.type === "alphafold") {
              ret = -1;
            } else if (first.type === "alphafold" && second.type === "experimental") {
              ret = 1;
            } else {
              if (first.start_pos < second.start_pos) {
                ret = -1;
              } else if (second.start_pos < first.start_pos) {
                ret = 1;
              } else {
                if (first.end_pos > second.end_pos) {
                  ret = -1;
                } else if (second.end_pos > first.end_pos) {
                  ret = 1;
                }
              }
            }
            return ret;
          }


          if (data.structures && data.structures.length > 0) {
            let menu = data.structures.sort(sortMenu).map(item => { return { id: item.pdb_id, name: `${item.type === "experimental" ? "PDB ID" : "AlphaFold ID"}: ${item.pdb_id.toUpperCase()} (Amino acid: ${item.start_pos} - ${item.end_pos})` } });
            setStructureMenu2(menu);

            let structureMap2 = new Map();
            for (let i = 0; i < data.structures.length; i++) {
              structureMap2.set(data.structures[i].pdb_id, { type: data.structures[i].type, url: data.structures[i].url, url_external: data.structures[i].url_external });
            }
            structureMap2.set("", { type: "", url: "", url_external: "" });
            setStructureMap2(structureMap2);

            if (menu.length > 0) {
              let i = 0;
              if (proteinID1 === proteinID2)
                i = menu.length > 1 ? 1 : 0;
              setStructure2(menu[i].id);
              setStructureType2(structureMap2.get(menu[i].id).type);
              setStructureUrl2(structureMap2.get(menu[i].id).url);
              setStructureExternalUrl2(structureMap2.get(menu[i].id).url_external);
            }
          } else {
            let menu = []
            menu.push({ id: "", name: "No 3D model available" });
            setStructureMenu2(menu);
            setStructureUrl2("");
            setStructureExternalUrl2("");
            setStructureType2("");
            structureMap2.set("", { type: "", url: "", url_external: "" });
            setStructureMap2(structureMap2);
            setStructure2("");
          }

          setPageLoading(false);
        }
      }
    })
      .catch(function ({ response }) {
        let message = "Glycan Knowledge Graph api call";
        axiosError(response, proteinID2, message, setPageLoading, setAlertDialogInput);
      });

  }, [proteinID2]);

  //glycanID1
  useEffect(() => {

    //invalid id case
    let structureMap1 = new Map();
    let menu = []
    menu.push({ id: "", name: "No 3D model available" });
    setStructureMenu1(menu);
    setStructureUrl1("");
    setStructureExternalUrl1("");
    setStructureType1("");
    structureMap1.set("", { type: "", url: "", url_external: "" });
    setStructureMap1(structureMap1);
    setStructure1("");

    if (glycanID1 === "" || glycanID1 === undefined || glycanID1 === null) return;
    setPageLoading(true);
    logActivity("user", glycanID1);

    getGlycanDetail(glycanID1).then(({ data }) => {
      if (data.code) {
        let message = "Glycan Knowledge Graph api call";
        logActivity("user", glycanID1, "No results. " + message);
        setPageLoading(false);
      } else {
        if (data) {

          if (data.structures && data.structures.length > 0) {
            let structures = data.structures[0];
            if (structures.length > 0) {
              let menu = structures.sort(sortByOrder).map(item => { return { id: item.type + "_" + item.structure_id, name: `${item.method} (${item.structure_id})` } });
              setStructureMenu1(menu);

              let structureMap1 = new Map();
              for (let i = 0; i < structures.length; i++) {
                structureMap1.set(structures[i].type + "_" + structures[i].structure_id, { type: structures[i].type, url: structures[i].url, url_external: structures[i].url_external });
              }
              structureMap1.set("", { type: "", url: "", url_external: "" });
              setStructureMap1(structureMap1);

              if (menu.length > 0) {
                setStructure1(menu[0].id);
                setStructureType1(structureMap1.get(menu[0].id).type);
                setStructureUrl1(structureMap1.get(menu[0].id).url);
                setStructureExternalUrl1(structureMap1.get(menu[0].id).url_external);
              }
            }
          } else {
            let menu = []
            menu.push({ id: "", name: "No 3D model available" });
            setStructureMenu1(menu);
            setStructureUrl1("");
            setStructureExternalUrl1("");
            setStructureType1("");
            structureMap1.set("", { type: "", url: "", url_external: "" });
            setStructureMap1(structureMap1);
            setStructure1("");
          }

          setPageLoading(false);
        }
      }
    })
      .catch(function ({ response }) {
        let message = "Glycan Knowledge Graph api call";
        axiosError(response, glycanID1, message, setPageLoading, setAlertDialogInput);
      });

  }, [glycanID1]);

  //glycanID2
  useEffect(() => {

    // invalid id case
    let menu = []
    let structureMap2 = new Map();
    menu.push({ id: "", name: "No 3D model available" });
    setStructureMenu2(menu);
    setStructureUrl2("");
    setStructureExternalUrl2("");
    setStructureType2("");
    structureMap2.set("", { type: "", url: "", url_external: "" });
    setStructureMap2(structureMap2);
    setStructure2("");

    if (glycanID2 === "" || glycanID2 === undefined || glycanID2 === null) return;
    setPageLoading(true);
    logActivity("user", glycanID2);

    getGlycanDetail(glycanID2).then(({ data }) => {
      if (data.code) {
        let message = "Glycan Knowledge Graph api call";
        logActivity("user", glycanID2, "No results. " + message);
        setPageLoading(false);
      } else {
        if (data) {

          if (data.structures && data.structures.length > 0) {
            let structures = data.structures[0];
            if (structures.length > 0) {
              let menu = structures.sort(sortByOrder).map(item => { return { id: item.type + "_" + item.structure_id, name: `${item.method} (${item.structure_id})` } });
              setStructureMenu2(menu);

              let structureMap2 = new Map();
              for (let i = 0; i < structures.length; i++) {
                structureMap2.set(structures[i].type + "_" + structures[i].structure_id, { type: structures[i].type, url: structures[i].url, url_external: structures[i].url_external });
              }
              structureMap2.set("", { type: "", url: "", url_external: "" });
              setStructureMap2(structureMap2);

              if (menu.length > 0) {
                let i = 0;
                if (glycanID1 === glycanID2)
                  i = menu.length > 1 ? 1 : 0;

                setStructure2(menu[i].id);
                setStructureType2(structureMap2.get(menu[i].id).type);
                setStructureUrl2(structureMap2.get(menu[i].id).url);
                setStructureExternalUrl2(structureMap2.get(menu[i].id).url_external);
              }
            }
          } else {
            let menu = []
            menu.push({ id: "", name: "No 3D model available" });
            setStructureMenu2(menu);
            setStructureUrl2("");
            setStructureExternalUrl2("");
            setStructureType2("");
            structureMap2.set("", { type: "", url: "", url_external: "" });
            setStructureMap2(structureMap2);
            setStructure2("");
          }

          setPageLoading(false);
        }
      }
    })
      .catch(function ({ response }) {
        let message = "Glycan Knowledge Graph api call";
        axiosError(response, glycanID2, message, setPageLoading, setAlertDialogInput);
      });

  }, [glycanID2]);

  return (
    <>
      <div className="pt-2">
        <div className="horizontal-heading text-center pt-2">
          <h5>Look At</h5>
          <h2>
            {" "}
            <span>
              3D View comparison
            </span>
          </h2>
        </div>
        <Helmet>
          {getTitle("compare3DView")}
          {getMeta("compare3DView")}
        </Helmet>
        <FeedbackWidget />
        <PageLoader pageLoading={pageLoading} />
        <DialogAlert
          alertInput={alertDialogInput}
          setOpen={(input) => {
            setAlertDialogInput({ show: input });
          }}
        />
        <div className="gg-baseline list-page-container">
          <div className="sidebar-page-outreach p-4">
            <div
              style={{
                border: "1px solid",
                backgroundColor: "#fff",
                overflow: "auto"
              }}
              className="pt-3 pb-3"
            >

              <Grid
                container
                style={{ margin: "0 0 0 0" }}
                spacing={6}
                justifyContent='center'>
                {/* Buttons Top */}

                {/* Protein Id */}
                <Grid item size={{ xs: 5.6, sm: 5.6 }}>
                  {moleculeType === "protein" && <div className="pb-2">
                    <div className="text-end">
                      <NavLink to={`${routeConstants.proteinDetail}${inputValue1}`}
                        style={inputValue1 === "" ? { pointerEvents: 'none' } : {}}>
                        <Button
                          type="button"
                          className="gg-btn-blue"
                          disabled={inputValue1 === ""}
                        >
                          Protein Details
                        </Button>
                      </NavLink>
                    </div>
                    <Grid item>
                      <FormControl fullWidth variant='outlined'>
                        <Typography className={'search-lbl'} gutterBottom>
                          <HelpTooltip
                            title={commonProteinData.uniprot_canonical_ac.tooltip.title}
                          />
                          {commonProteinData.uniprot_canonical_ac.name}
                        </Typography>
                        <AutoTextInput
                          fullWidth
                          inputValue={inputValue1}
                          setInputValue={proteinIdChange1}
                          onChange={proteinIdOnChange1}
                          placeholder={advancedSearchGL.protein_identifier.placeholder}
                          typeahedID={advancedSearchGL.protein_identifier.typeahedID}
                          length={advancedSearchGL.protein_identifier.length}
                          errorText={advancedSearchGL.protein_identifier.errorText}
                        />
                        <ExampleExploreControl
                          setInputValue={(val) => { proteinIdChange1(val); setProteinID1(val) }}
                          inputValue={advancedSearch.uniprot_canonical_ac.examples1}
                        />
                      </FormControl>
                    </Grid>
                  </div>}

                  {moleculeType === "glycan" && <div className="pb-2">
                    <div className="text-end">
                      <NavLink to={`${routeConstants.glycanDetail}${inputValue1}`}
                        style={inputValue1 === "" ? { pointerEvents: 'none' } : {}}>
                        <Button
                          type="button"
                          className="gg-btn-blue"
                          disabled={inputValue1 === ""}
                        >
                          Glycan Details
                        </Button>
                      </NavLink>
                    </div>
                    <Grid item>
                      <FormControl fullWidth variant='outlined'>
                        <Typography className={'search-lbl'} gutterBottom>
                          <HelpTooltip
                            title={commonGlycanData.glycan_id.tooltip.title}
                          />
                          {commonGlycanData.glycan_id.name}
                        </Typography>
                        <AutoTextInput
                          fullWidth
                          inputValue={inputValue1}
                          setInputValue={glycanIdChange1}
                          onChange={glycanIdOnChange1}
                          placeholder={advancedSearch.attached_glycan_id.placeholder}
                          typeahedID={advancedSearch.attached_glycan_id.typeahedID}
                          length={advancedSearch.attached_glycan_id.length}
                          errorText={advancedSearch.attached_glycan_id.errorText}
                        />
                        <ExampleExploreControl
                          setInputValue={(val) => { glycanIdChange1(val); setGlycanID1(val) }}
                          inputValue={advancedSearchGL.glycan_identifier.examples}
                        />
                      </FormControl>
                    </Grid>
                  </div>}

                  <div className="pb-4">
                    <Grid item>
                      <FormControl fullWidth variant='outlined'>
                        <Typography className={'search-lbl'} gutterBottom>
                          <HelpTooltip
                            title={"3D Model"}
                          />
                          {"3D Model"}
                        </Typography>
                        <SelectControl
                          inputValue={structure1}
                          menu={structureMenu1}
                          disabled={structureUrl1 === ""}
                          sortFunction={(a, b) => { return 0 }}
                          setInputValue={(value) => {
                            setStructure1(value);
                            setStructureType1(structureMap1.get(value).type);
                            setStructureUrl1(structureMap1.get(value).url);
                            setStructureExternalUrl1(structureMap1.get(value).url_external);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </div>
                  <Grid item>
                    {moleculeType === "protein" && <Row>
                      {tool_support1 && tool_support1.pdb === "yes" && structureUrl1 ?
                        (<div>
                          <div style={{ width: "100%", minWidth: "150px", aspectRatio: "1 / 1" }}>
                            {structureUrl1 && <ThreeDViewer url={structureUrl1} />}
                          </div>
                          <div className="text-muted mt-2">
                            <strong><sup>1</sup></strong><span> 3D structure provided by {structureType1 === "experimental" ? "PDB (View on PDB: " : "AlphaFold (View on AlphaFold: "}<a href={structureExternalUrl1} target="_blank" rel="noopener noreferrer">{structure1}</a>)</span>
                          </div>
                          <div className="text-muted">
                            <strong><sup>2</sup></strong><span> Displayed using <a href={"https://molstar.org/viewer-docs/"} target="_blank" rel="noopener noreferrer">Mol*</a></span>
                          </div>
                        </div>)
                        : (
                          <p>{dataStatus1}</p>
                        )}
                    </Row>}

                    {moleculeType === "glycan" && <Row>
                      {tool_support1 && tool_support1.pdb === "yes" && structureUrl1 ?
                        (<div>
                          <div style={{ width: "100%", minWidth: "150px", aspectRatio: "1 / 1" }}>
                            {structureUrl1 && <ThreeDViewer url={structureUrl1} />}
                          </div>
                          <div className="text-muted mt-2">
                            <strong><sup>1</sup></strong><span> 3D structure generated by <a href={structureExternalUrl1} target="_blank" rel="noopener noreferrer">{structureType1 === "glycam" ? "GLYCAM" : "Glycoshape"}</a></span>
                          </div>
                          <div className="text-muted">
                            <strong><sup>2</sup></strong><span> Displayed using <a href={"https://molstar.org/viewer-docs/"} target="_blank" rel="noopener noreferrer">Mol*</a></span>
                          </div>
                        </div>)
                        : (
                          <p>{dataStatus1}</p>
                        )}
                    </Row>}
                  </Grid>

                </Grid>


                {/* Protein Id */}
                <Grid item size={{ xs: 5.6, sm: 5.6 }}>
                  {moleculeType === "protein" && <div className="pb-2">
                    <div className="text-end">
                      <NavLink to={`${routeConstants.proteinDetail}${inputValue2}`}
                        style={inputValue2 === "" ? { pointerEvents: 'none' } : {}}>
                        <Button
                          type="button"
                          className="gg-btn-blue"
                          disabled={inputValue2 === ""}
                        >
                          Protein Details
                        </Button>
                      </NavLink>
                    </div>
                    <FormControl fullWidth variant='outlined'>
                      <Typography className={'search-lbl'} gutterBottom>
                        <HelpTooltip
                          title={commonProteinData.uniprot_canonical_ac.tooltip.title}
                        />
                        {commonProteinData.uniprot_canonical_ac.name}
                      </Typography>
                      <AutoTextInput
                        fullWidth
                        inputValue={inputValue2}
                        setInputValue={proteinIdChange2}
                        onChange={proteinIdOnChange2}
                        placeholder={advancedSearchGL.protein_identifier.placeholder}
                        typeahedID={advancedSearchGL.protein_identifier.typeahedID}
                        length={advancedSearchGL.protein_identifier.length}
                        errorText={advancedSearchGL.protein_identifier.errorText}
                      />
                      <ExampleExploreControl
                        setInputValue={(val) => { proteinIdChange2(val); setProteinID2(val) }}
                        inputValue={advancedSearch.uniprot_canonical_ac.examples2}
                      />
                    </FormControl>
                  </div>}
                  {moleculeType === "glycan" && <div className="pb-2">
                    <div className="text-end">
                      <NavLink to={`${routeConstants.glycanDetail}${inputValue2}`}
                        style={inputValue2 === "" ? { pointerEvents: 'none' } : {}}>
                        <Button
                          type="button"
                          className="gg-btn-blue"
                          disabled={inputValue2 === ""}
                        >
                          Glycan Details
                        </Button>
                      </NavLink>
                    </div>
                    <Grid item>
                      <FormControl fullWidth variant='outlined'>
                        <Typography className={'search-lbl'} gutterBottom>
                          <HelpTooltip
                            title={commonGlycanData.glycan_id.tooltip.title}
                          />
                          {commonGlycanData.glycan_id.name}
                        </Typography>
                        <AutoTextInput
                          fullWidth
                          inputValue={inputValue2}
                          setInputValue={glycanIdChange2}
                          onChange={glycanIdOnChange2}
                          placeholder={advancedSearch.attached_glycan_id.placeholder}
                          typeahedID={advancedSearch.attached_glycan_id.typeahedID}
                          length={advancedSearch.attached_glycan_id.length}
                          errorText={advancedSearch.attached_glycan_id.errorText}
                        />
                        <ExampleExploreControl
                          setInputValue={(val) => { glycanIdChange2(val); setGlycanID2(val) }}
                          inputValue={advancedSearchGL.glycan_identifier.examples1}
                        />
                      </FormControl>
                    </Grid>
                  </div>}
                  <div className="pb-4">
                    <FormControl fullWidth variant='outlined'>
                      <Typography className={'search-lbl'} gutterBottom>
                        <HelpTooltip
                          title={"3D Model"}
                        />
                        {"3D Model"}
                      </Typography>
                      <SelectControl
                        inputValue={structure2}
                        menu={structureMenu2}
                        disabled={structureUrl2 === ""}
                        sortFunction={(a, b) => { return 0 }}
                        setInputValue={(value) => {
                          setStructure2(value);
                          setStructureType2(structureMap2.get(value).type);
                          setStructureUrl2(structureMap2.get(value).url);
                          setStructureExternalUrl2(structureMap2.get(value).url_external);
                        }}
                      />
                    </FormControl>
                  </div>
                  {moleculeType === "protein" && <Row>
                    {tool_support2 && tool_support2.pdb === "yes" && structureUrl2 ?
                      (<div>
                        <div style={{ width: "100%", minWidth: "150px", aspectRatio: "1 / 1" }}>
                          {structureUrl2 && <ThreeDViewer url={structureUrl2} />}
                        </div>
                        <div className="text-muted mt-2">
                          <strong><sup>1</sup></strong><span> 3D structure provided by {structureType2 === "experimental" ? "PDB (View on PDB: " : "AlphaFold (View on AlphaFold: "}<a href={structureExternalUrl2} target="_blank" rel="noopener noreferrer">{structure2}</a>)</span>
                        </div>
                        <div className="text-muted">
                          <strong><sup>2</sup></strong><span> Displayed using <a href={"https://molstar.org/viewer-docs/"} target="_blank" rel="noopener noreferrer">Mol*</a></span>
                        </div>
                      </div>)
                      : (
                        <p>{dataStatus2}</p>
                      )}
                  </Row>}

                  {moleculeType === "glycan" && <Row>
                    {tool_support2 && tool_support2.pdb === "yes" && structureUrl2 ?
                      (<div>
                        <div style={{ width: "100%", minWidth: "150px", aspectRatio: "1 / 1" }}>
                          {structureUrl2 && <ThreeDViewer url={structureUrl2} />}
                        </div>
                        <div className="text-muted mt-2">
                          <strong><sup>1</sup></strong><span> 3D structure generated by <a href={structureExternalUrl2} target="_blank" rel="noopener noreferrer">{structureType2 === "glycam" ? "GLYCAM" : "Glycoshape"}</a></span>
                        </div>
                        <div className="text-muted">
                          <strong><sup>2</sup></strong><span> Displayed using <a href={"https://molstar.org/viewer-docs/"} target="_blank" rel="noopener noreferrer">Mol*</a></span>
                        </div>
                      </div>)
                      : (
                        <p>{dataStatus2}</p>
                      )}
                  </Row>}

                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Compare3DView;
