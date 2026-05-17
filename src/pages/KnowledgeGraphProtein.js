import React, { useEffect, useState, useRef, useReducer } from "react";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from 'cytoscape';
import ListFilterWithSlider from "../components/ListFilterWithSlider";
import Button from "react-bootstrap/Button";
import { ReactComponent as ArrowRightIcon } from "../images/icons/arrowRightIcon.svg";
import { ReactComponent as ArrowLeftIcon } from "../images/icons/arrowLeftIcon.svg";
import proteinKnowledgegraphJSON from "../data/json/proteinKnowledgegraph.json";
import { Col, Row } from "react-bootstrap";
import { getProteinGraph } from "../data/protein";
import "../css/graph.css";
import MolecularFunctionNodeDisplay from "../components/graph/MolecularFunctionNodeDisplay";
import CellularLocationNodeDisplay from "../components/graph/CellularComponentNodeDisplay";
import BiologicalProcessNodeDisplay from "../components/graph/BiologicalProcessNodeDisplay";
import DiseaseNodeDisplay from "../components/graph/DiseaseNodeDisplay";
import GlycanNodeDisplay from "../components/graph/GlycanNodeDisplay";
import SiteNodeDisplay from "../components/graph/SiteNodeDisplay";
import MotifNodeDisplay from "../components/graph/MotifNodeDisplay";
import OrganismNodeDisplay from "../components/graph/OrganismNodeDisplay";
import BiomarkerNodeDisplay from "../components/graph/BiomarkerNodeDisplay";
import ProteinNodeDisplay from "../components/graph/ProteinNodeDisplay";
import { sortByOrder, sortByWeight } from "../utils/common";
import { getTitle, getMeta } from "../utils/head";
import Helmet from "react-helmet";
import FeedbackWidget from "../components/FeedbackWidget";
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";

export function KnowledgeGraphProtein() {
  let { id } = useParams();
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [availableFilters, setAvailableFilters] = useState([]);
  const [inputValueSlider, setInputValueSlider] = useState(50);
  const [maxValueSlider, setMaxValueSlider] = useState(50);

  const [defaultKnowGraphData, setDefaultKnowGraphData] = useState(undefined);
  const [defaultAppliedFilters, setDefaultAppliedFilters] = useState([]);
  const [defaultAvailableFilters, setDefaultAvailableFilters] = useState([]);
  const [elements, setElements] = useState(undefined);
  const [nodeData, setNodeData] = useState(undefined);
  const [nodeType, setNodeType] = useState("");

  const [sidebar, setSidebar] = useState(true);
  const [outreachItemsArray, setOutreachItemsArray] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [filterReset, setFilterReset] = useState(0);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const myCyRef = useRef();

  const [width, setWith] = useState("1000px");
  const [height, setHeight] = useState("700px");

  const layout = {
    name: "concentric",
    concentric: function (node) { return node.data('level'); },
    levelWidth: function () {
      return 3;
    },
    randomize: false,
    fit: true,
    circle: true,
    padding: 10,
    linkDistance: 30,
    centerGraph: true,
    equidistant: false,
    clockwise: true,
    spacingFactor: 3,
    animate: true,
    animationDuration: 1000,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: false,
  };

  useEffect(() => {

    setPageLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    logActivity("user", id);

    getProteinGraph(id).then(({ data }) => {
      if (data.code) {
        let message = "Protein Knowledge Graph api call";
        logActivity("user", id, "No results. " + message);
        setPageLoading(false);
      } else {
        let api_response = data;
        if (api_response) {
          let graphData = { nodes: [], edges: [] };
          setInputValueSlider(maxValueSlider);
          let centralNodeId = api_response.uniprot_canonical_ac;
          // adding central glycan node.
          let plNode = {
            data: {
              id: api_response.uniprot_canonical_ac, label: api_response.uniprot_canonical_ac, type: "protein", "level": 300,
              details: {
                uniprot_canonical_ac: api_response.uniprot_canonical_ac,
                length: api_response.length,
                chemical_mass: api_response.chemical_mass,
                gene_names: api_response.gene_names,
                protein_name: api_response.protein_name,
                species: api_response.species
              }
            }
          }
          graphData.nodes.push(plNode);

          let nodeTypeArray = [];
          let nodeTypes = proteinKnowledgegraphJSON.node_type;
          let applFilters = [{ "id": "node_type", "operator": "OR", "selected": [] }, { "id": "site_type", "operator": "OR", "selected": [] }];

          let siteTypeArray = [];
          let siteTypes = proteinKnowledgegraphJSON.site_type;

          // adding site nodes.
          // adding edges between site node and central glycan nodes.

          let glycanCount = 0;
          let glycosylationCount = 0;
          let mutagenesisCount = 0;
          let phosphorylationCount = 0
          let snvCount = 0
          let maxNodeCount = 0;
          const glSet = new Set();

          if (api_response.sites) {
            api_response.sites = api_response.sites.sort(sortByWeight);
            for (let i = 0; i < api_response.sites.length; i++) {
              let siteN = api_response.sites[i];
              let siteNodeId = siteN.site_lbl + "-" + siteN.uniprot_canonical_ac;
              let siteFilters = [];

              if (siteN.glycosylation && siteN.glycosylation.length > 0) {
                let glyToSi = { data: { source: centralNodeId, target: siteNodeId, label: "Found on glycosylates", type: "site" } }
                graphData.edges.push(glyToSi);
                glycosylationCount += 1;
                siteFilters.push("glycosylation")
              }

              if (siteN.mutagenesis && siteN.mutagenesis.length > 0) {
                let glyToSi = { data: { source: centralNodeId, target: siteNodeId, label: "Mutagenesis", type: "site" } }
                graphData.edges.push(glyToSi);
                mutagenesisCount += 1;
                siteFilters.push("mutagenesis")
              }

              if (siteN.phosphorylation && siteN.phosphorylation.length > 0) {
                let glyToSi = { data: { source: centralNodeId, target: siteNodeId, label: "Phosphorylation", type: "site" } }
                graphData.edges.push(glyToSi);
                phosphorylationCount += 1;
                siteFilters.push("phosphorylation")
              }

              if (siteN.snv && siteN.snv.length > 0) {
                let glyToSi = { data: { source: centralNodeId, target: siteNodeId, label: "SNV", type: "site" } }
                graphData.edges.push(glyToSi);
                snvCount += 1;
                siteFilters.push("snv")
              }

              let siteNode = {
                data: {
                  id: siteN.site_lbl + "-" + siteN.uniprot_canonical_ac, label: siteN.site_lbl + "-" + siteN.uniprot_canonical_ac, type: "site", site: siteFilters, "level": 150,
                  weight: siteN.weight,
                  order: i + 1,
                  details: siteN,
                  proteinData: {
                    uniprot_canonical_ac: siteN.uniprot_canonical_ac,
                  }
                }
              }
              graphData.nodes.push(siteNode);

              if (siteN.glycans) {
                siteN.glycans = siteN.glycans.sort(sortByWeight);
                for (let i = 0; i < siteN.glycans.length; i++) {
                  let glycan = siteN.glycans[i];
                  let glyNodeId = glycan.glytoucan_ac;
                  let glyNode = {
                    data: {
                      id: glycan.glytoucan_ac, label: glycan.glytoucan_ac, type: "glycan", "level": 100,
                      weight: glycan.weight,
                      order: i + 1,
                      details: glycan
                    }
                  }
                  if (!glSet.has(glyNodeId)){
                    graphData.nodes.push(glyNode);
                    glSet.add(glyNodeId);
                  }
                  let glyToSi = { data: { source: siteNodeId, target: glyNodeId, label: "has_saccharide", type: "glycan" } }
                  graphData.edges.push(glyToSi);
                }
              }
            }
            glycanCount += glSet.size;
            if (glycanCount > 0) {
              let filterOp = nodeTypes["glycan"];
              filterOp.count = glycanCount;
              nodeTypeArray.push(filterOp);
              applFilters[0].selected.push("glycan");
            }

            if (glycanCount > maxNodeCount) {
              maxNodeCount = glycanCount;
            }

            if (api_response.sites.length > 0) {
              let filterOp = nodeTypes["site"];
              filterOp.count = api_response.sites.length;
              nodeTypeArray.push(filterOp);
              applFilters[0].selected.push("site");
            }

            if (api_response.sites.length > maxNodeCount) {
              maxNodeCount = api_response.sites.length;
            }

            if (glycosylationCount > 0) {
              let filterOp = siteTypes["glycosylation"];
              filterOp.count = glycosylationCount;
              siteTypeArray.push(filterOp);
              applFilters[1].selected.push("glycosylation");
            }

            if (mutagenesisCount > 0) {
              let filterOp = siteTypes["mutagenesis"];
              filterOp.count = mutagenesisCount;
              siteTypeArray.push(filterOp);
              applFilters[1].selected.push("mutagenesis");
            }

            if (phosphorylationCount > 0) {
              let filterOp = siteTypes["phosphorylation"];
              filterOp.count = phosphorylationCount;
              siteTypeArray.push(filterOp);
              applFilters[1].selected.push("phosphorylation");
            }

            if (snvCount > 0) {
              let filterOp = siteTypes["snv"];
              filterOp.count = snvCount;
              siteTypeArray.push(filterOp);
              applFilters[1].selected.push("snv");
            }
          }

          // adding enzyme/protein nodes.
          // adding edges between enzyme/protein nodes and central glycan nodes.

          if (api_response.binding_glycans) {
            api_response.binding_glycans = api_response.binding_glycans.sort(sortByWeight);
            for (let i = 0; i < api_response.binding_glycans.length; i++) {
              let glycan = api_response.binding_glycans[i];
              let glyNodeId = glycan.interactor_id;
              let glyNode = {
                data: {
                  id: glycan.interactor_id, label: glycan.interactor_id, type: "binding-glycan", "level": 200,
                  weight: glycan.weight,
                  order: i + 1,
                  details: glycan
                }
              }
              graphData.nodes.push(glyNode);
              let proToGly = { data: { source: centralNodeId, target: glyNodeId, label: "bound_to", type: "binding-glycan" } }
              graphData.edges.push(proToGly);
            }

            if (api_response.binding_glycans.length > maxNodeCount) {
              maxNodeCount = api_response.binding_glycans.length;
            }

            if (api_response.binding_glycans.length > 0) {
              let filterOp = nodeTypes["binding-glycan"];
              filterOp.count = api_response.binding_glycans.length;
              nodeTypeArray.push(filterOp);
              applFilters[0].selected.push("binding-glycan");
            }
          }

          // adding molecular function nodes.
          // adding edges between molecular function nodes and central protein nodes.

          if (api_response.molecular_function) {
            api_response.molecular_function = api_response.molecular_function.sort(sortByWeight);
            for (let i = 0; i < api_response.molecular_function.length; i++) {
              let molF = api_response.molecular_function[i];
              let molFNodeId = molF.id;
              let molFNode = {
                data: {
                  id: molF.id, label: molF.name, type: "molecular-function", "level": 200,
                  weight: molF.weight,
                  order: i + 1,
                  details: molF,
                }
              }
              graphData.nodes.push(molFNode);
              let proToMolF = { data: { source: centralNodeId, target: molFNodeId, label: "enables", type: "molecular-function" } }
              graphData.edges.push(proToMolF);
            }

            if (api_response.molecular_function.length > maxNodeCount) {
              maxNodeCount = api_response.molecular_function.length;
            }

            if (api_response.molecular_function.length > 0) {
              let filterOp = nodeTypes["molecular-function"];
              filterOp.count = api_response.molecular_function.length;
              nodeTypeArray.push(filterOp);
              applFilters[0].selected.push("molecular-function");
            }
          }

          // adding cellular function nodes.
          // adding edges between cellular function nodes and central protein nodes.

          if (api_response.cellular_component) {
            api_response.cellular_component = api_response.cellular_component.sort(sortByWeight);
            for (let i = 0; i < api_response.cellular_component.length; i++) {
              let celC = api_response.cellular_component[i];
              let celCNodeId = celC.id;
              let celCNode = {
                data: {
                  id: celC.id, label: celC.name, type: "cellular-component", "level": 200,
                  weight: celC.weight,
                  order: i + 1,
                  details: celC,
                }
              }
              graphData.nodes.push(celCNode);
              let proToCelC = { data: { source: centralNodeId, target: celCNodeId, label: "located_in", type: "cellular-component" } }
              graphData.edges.push(proToCelC);
            }

            if (api_response.cellular_component.length > maxNodeCount) {
              maxNodeCount = api_response.cellular_component.length;
            }

            if (api_response.cellular_component.length > 0) {
              let filterOp = nodeTypes["cellular-component"];
              filterOp.count = api_response.cellular_component.length;
              nodeTypeArray.push(filterOp);
              applFilters[0].selected.push("cellular-component");
            }
          }

          // adding organism nodes.
          // adding edges between organism nodes and central glycan nodes.

          if (api_response.biological_process) {
            api_response.biological_process = api_response.biological_process.sort(sortByWeight);
            for (let i = 0; i < api_response.biological_process.length; i++) {
              let bioP = api_response.biological_process[i];
              let bioPNodeId = bioP.id;
              let bioPNode = {
                data: {
                  id: bioP.id, label: bioP.name, type: "biological-process", "level": 200,
                  weight: bioP.weight,
                  order: i + 1,
                  details: bioP,
                }
              }
              graphData.nodes.push(bioPNode);
              let glyToBioP = { data: { source: centralNodeId, target: bioPNodeId, label: "involved_in", type: "biological-process" } }
              graphData.edges.push(glyToBioP);
            }

            if (api_response.biological_process.length > maxNodeCount) {
              maxNodeCount = api_response.biological_process.length;
            }

            if (api_response.biological_process.length > 0) {
              let filterOp = nodeTypes["biological-process"];
              filterOp.count = api_response.biological_process.length;
              nodeTypeArray.push(filterOp);
              applFilters[0].selected.push("biological-process");
            }
          }

          // adding disease nodes.
          // adding edges between disease nodes and central glycan nodes.

          if (api_response.disease) {
            api_response.disease = api_response.disease.sort(sortByWeight);
            for (let i = 0; i < api_response.disease.length; i++) {
              let disease = api_response.disease[i];
              let disNodeId = disease.disease_id;
              let disNode = {
                data: {
                  id: disease.disease_id, label: disease.name, type: "disease", "level": 200,
                  weight: disease.weight,
                  order: i + 1,
                  details: disease,
                }
              }
              graphData.nodes.push(disNode);
              let proToDis = { data: { source: centralNodeId, target: disNodeId, label: "is_marker_for", type: "disease" } }
              graphData.edges.push(proToDis);
            }

            if (api_response.disease.length > maxNodeCount) {
              maxNodeCount = api_response.disease.length;
            }

            if (api_response.disease.length > 0) {
              let filterOp = nodeTypes["disease"];
              filterOp.count = api_response.disease.length;
              nodeTypeArray.push(filterOp);
              applFilters[0].selected.push("disease");
            }
          }

          // adding biomarker nodes.
          // adding edges between biomarker nodes and central glycan nodes.

          if (api_response.biomarkers) {
            api_response.biomarkers = api_response.biomarkers.sort(sortByWeight);
            for (let i = 0; i < api_response.biomarkers.length; i++) {
              let bioN = api_response.biomarkers[i];
              let bioNodeId = bioN.biomarker_id;
              let bioNode = {
                data: {
                  id: bioN.biomarker_id, label: bioN.biomarker_id, type: "biomarker", "level": 200,
                  weight: bioN.weight,
                  order: i + 1,
                  details: bioN,
                }
              }
              graphData.nodes.push(bioNode);
              let proToBio = { data: { source: centralNodeId, target: bioNodeId, label: "biomarker_in", type: "biomarker" } }
              graphData.edges.push(proToBio);
            }

            if (api_response.biomarkers.length > maxNodeCount) {
              maxNodeCount = api_response.biomarkers.length;
            }

            if (api_response.biomarkers.length > 0) {
              let filterOp = nodeTypes["biomarker"];
              filterOp.count = api_response.biomarkers.length;
              nodeTypeArray.push(filterOp);
              applFilters[0].selected.push("biomarker");
            }
          }

          let elements = CytoscapeComponent.normalizeElements(graphData)
          setElements(elements);
          setDefaultKnowGraphData(graphData);

          // filters
          let fl = proteinKnowledgegraphJSON.filters;
          let temp3 = fl.filter(obj => obj.id === "node_type")[0];
          if (temp3) {
            temp3.options = [];
            temp3.options.push(...nodeTypeArray);
          }

          let temp2 = fl.filter(obj => obj.id === "site_type")[0];
          if (temp2) {
            temp2.options = [];
            temp2.options.push(...siteTypeArray);
          }

          setAvailableFilters(JSON.parse(JSON.stringify(fl)));

          setAppliedFilters(JSON.parse(JSON.stringify(applFilters)));

          if (maxNodeCount > 0 && maxNodeCount < maxValueSlider) {
            setMaxValueSlider(maxNodeCount);
            setInputValueSlider(maxNodeCount);
          }

          setDefaultAvailableFilters(JSON.parse(JSON.stringify(fl)))
          setDefaultAppliedFilters(JSON.parse(JSON.stringify(applFilters)));
          setPageLoading(false);
        }
      }
    })
      .catch(function (error) {
        let message = "Protein Knowledge Graph api call";
        axiosError(error, id, message, setPageLoading, setAlertDialogInput);
      });

  }, []);


  useEffect(() => {
    let graphData = { nodes: [], edges: [] };

    if (defaultKnowGraphData === undefined || defaultKnowGraphData.nodes.length === 0)
      return;

    let nodes = defaultKnowGraphData.nodes.filter(node => node.data.type === "protein")
    graphData.nodes.push(nodes[0])
    let byOrderKnowGraphData = JSON.parse(JSON.stringify(defaultKnowGraphData));
    let nodeFlNodes = [];

    for (let i = 0; i < appliedFilters.length; i++) {
      if (appliedFilters[i] && appliedFilters[i].selected && appliedFilters[i].selected.length > 0) {
        if (appliedFilters[i].id === "node_type") {
          for (let j = 0; j < appliedFilters[i].selected.length; j++) {
            let nodes = byOrderKnowGraphData.nodes.filter(node => node.data.type === appliedFilters[i].selected[j])
            nodeFlNodes.push(...nodes)
          }
        }
      }
    }

    let siteFlNodes = [];
    let nonSiteNodes = nodeFlNodes.filter(node => node.data.type !== "site")
    // reordering non site nodes and filtering them based on slider value.
    nonSiteNodes = nonSiteNodes.filter(node => node.data.order <= inputValueSlider || inputValueSlider === maxValueSlider)
    graphData.nodes.push(...nonSiteNodes)    
    let siteNodes = nodeFlNodes.filter(node => node.data.type === "site")
    for (let i = 0; i < appliedFilters.length; i++) {
      if (appliedFilters[i] && appliedFilters[i].selected && appliedFilters[i].selected.length > 0) {
        if (appliedFilters[i].id === "site_type") {
          for (let j = 0; j < appliedFilters[i].selected.length; j++) {
            let nodes = siteNodes.filter(node => node.data.site.includes(appliedFilters[i].selected[j]))
            siteFlNodes.push(...nodes)
          }
        }
      }
    }
    // removing duplicate site nodes.
    siteFlNodes = siteFlNodes.filter((node, index, self) => index === self.findIndex((nd) => nd.data.id === node.data.id));
    // reordering site nodes and filtering them based on slider value.
    siteFlNodes = siteFlNodes.sort(sortByOrder).filter((node, index) => (index + 1) <= inputValueSlider || inputValueSlider === maxValueSlider)
    graphData.nodes.push(...siteFlNodes)

    function checkEdgeNodes(nodes, sourceId, targetId) {
      let src = nodes.find(node => node.data.id === sourceId);
      let trg = nodes.find(node => node.data.id === targetId);
      return src !== undefined && trg !== undefined;
    }

    function checkEdgeExists(edges, targetId, type) {
      let ed = edges.find(edge => edge.data.target === targetId);
      return ed !== undefined;
    }

    let edges = defaultKnowGraphData.edges.filter(edge => checkEdgeNodes(graphData.nodes, edge.data.source, edge.data.target))
    graphData.edges.push(...edges)

    graphData.nodes = graphData.nodes.filter(node => checkEdgeExists(graphData.edges, node.data.id) || node.data.type === "protein")

    let elements = CytoscapeComponent.normalizeElements(graphData)
    setElements(elements);

    const cy = myCyRef.current;
    if (cy) {
      cy.elements().remove()
      cy.add(elements)
      const layoutCurrent = cy.layout(layout);
      layoutCurrent.run();

    }
  }, [appliedFilters, inputValueSlider]);

  const disableSiteNodeDependentFilters = disable => {
    let avaFilters = JSON.parse(JSON.stringify(availableFilters));
    for (let i = 0; i < avaFilters.length; i++) {
      let filters = avaFilters[i];
      if (filters.options) {
        for (let j = 0; j < filters.options.length; j++) {
          if (filters.options[j].id === "glycan" || filters.options[j].id === "glycosylation"
            || filters.options[j].id === "mutagenesis" || filters.options[j].id === "phosphorylation"
            || filters.options[j].id === "snv"
          ) {
            filters.options[j].disabled = disable;
          }
        }
      }
    }
    setAvailableFilters(JSON.parse(JSON.stringify(avaFilters)));
  }

  const handleFilterChange = newFilter => {

    const existingFilter = appliedFilters.find(
      filter => filter.id === newFilter.id
    );

    if (
      existingFilter &&
      existingFilter.selected &&
      newFilter &&
      newFilter.selected &&
      (newFilter.selected.length || existingFilter.selected.length)
    ) {
      if (newFilter.id === "node_type" && !newFilter.selected.includes("site") && existingFilter.selected.includes("site")) {
        disableSiteNodeDependentFilters(true);
      }

      if (newFilter.id === "node_type" && newFilter.selected.includes("site") && !existingFilter.selected.includes("site")) {
        disableSiteNodeDependentFilters(false);
      }

      const otherFilters = appliedFilters.filter(
        filter => filter.id !== newFilter.id
      );
      if (newFilter.selected.length) {
        setAppliedFilters(JSON.parse(JSON.stringify([...otherFilters, newFilter])));
      } else {
        setAppliedFilters(JSON.parse(JSON.stringify(otherFilters)));
      }
    } else if (newFilter.selected.length) {
      if (newFilter.id === "node_type" && newFilter.selected.includes("site")) {
        disableSiteNodeDependentFilters(false);
      }

      setAppliedFilters(JSON.parse(JSON.stringify([...appliedFilters, newFilter])));
    }
  };


  const styleSheet = [
    {
      selector: "node",
      style: {
        backgroundColor: "#4a56a6",
        width: 20,
        height: 20,
        label: "data(label)",
        "overlay-padding": "6px",
        "z-index": "10",
        "text-outline-color": "#4a56a6",
        "text-outline-width": "1px",
        color: "white",
        fontSize: 10
      }
    },
    {
      selector: "node[type='glycan']",
      style: {
        backgroundColor: "#ee1144",
      }
    },
    {
      selector: "node[type='site']",
      style: {
        backgroundColor: "#d15c94",
      }
    },
    {
      selector: "node[type='protein']",
      style: {
        backgroundColor: "#c91e9f",
      }
    },
    {
      selector: "node[type='binding-glycan']",
      style: {
        backgroundColor: "#08552f",
      }
    },
    {
      selector: "node[type='biomarker']",
      style: {
        backgroundColor: "#a6644a",
      }
    },
    {
      selector: "node[type='disease']",
      style: {
        backgroundColor: "#c84714",
      }
    },
    {
      selector: "node[type='cellular-component']",
      style: {
        backgroundColor: "#8834a7",
      }
    },
    {
      selector: "node[type='molecular-function']",
      style: {
        backgroundColor: "#76a64a",
      }
    },
    {
      selector: "node[type='biological-process']",
      style: {
        backgroundColor: "#b085bf",
      }
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "line-color": "#AAD8FF",
        "target-arrow-color": "#6774cb",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        // 'label': nodeType === "" ? 'data(label)' : "",
        'fontSize': 10,
        'control-point-step-size': 40,
        "text-rotation": "autorotate",
        "text-margin-y": "-6px",
      }
    }

  ];


  return (
    <>
      <div className="pt-2">
        <div className="horizontal-heading text-center pt-2">
          <h5>Look At</h5>
          <h2>
            {" "}
            <span>
              Protein Knowledge Graph For
              <strong className="nowrap">
                {id && (
                  <> {id}</>
                )}
              </strong>
            </span>
          </h2>
        </div>
        <Helmet>
          {getTitle("proteinKnowledgeGraph", {
            uniprot_canonical_ac:
              id ? id : "",
          })}
          {getMeta("proteinKnowledgeGraph")}
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
                maxHeight: "700px",
                overflow: "auto"
              }}
            >
              <MolecularFunctionNodeDisplay
                nodeData={nodeData}
                nodeType={nodeType}
                graphType={"protein"}
                setNodeType={setNodeType}
              />
              <CellularLocationNodeDisplay
                nodeData={nodeData}
                nodeType={nodeType}
                graphType={"protein"}
                setNodeType={setNodeType}
              />
              <BiologicalProcessNodeDisplay
                nodeData={nodeData}
                nodeType={nodeType}
                graphType={"protein"}
                setNodeType={setNodeType}
              />
              <GlycanNodeDisplay
                nodeData={nodeData}
                nodeType={nodeType}
                graphType={"protein"}
                setNodeType={setNodeType}
              />
              <SiteNodeDisplay
                nodeData={nodeData}
                nodeType={nodeType}
                graphType={"protein"}
                setNodeType={setNodeType}
              />
              <DiseaseNodeDisplay
                nodeData={nodeData}
                nodeType={nodeType}
                graphType={"protein"}
                setNodeType={setNodeType}
              />
              <OrganismNodeDisplay
                nodeData={nodeData}
                nodeType={nodeType}
                graphType={"protein"}
                setNodeType={setNodeType}
              />
              <BiomarkerNodeDisplay
                nodeData={nodeData}
                nodeType={nodeType}
                graphType={"protein"}
                setNodeType={setNodeType}
              />
              <ProteinNodeDisplay
                nodeData={nodeData}
                nodeType={nodeType}
                graphType={"protein"}
                setNodeType={setNodeType}
              />
              <Row>
                <Col sm={3} md={3}>
                  {availableFilters && availableFilters.length !== 0 && (
                    <div className="list-sidebar-container">
                      <div className={"list-sidebar-with-slider" + (sidebar ? "" : " closed")}>
                        <div className="reset-filter-btn-container">
                          <Button
                            type="button"
                            className="gg-btn-blue reset-filter-btn"
                            onClick={() => {
                              setAppliedFilters(JSON.parse(JSON.stringify(defaultAppliedFilters)));
                              setAvailableFilters(JSON.parse(JSON.stringify(defaultAvailableFilters)))
                              setInputValueSlider(maxValueSlider);
                              setFilterReset(1);
                            }}
                          >
                            Reset
                          </Button>
                        </div>
                        <ListFilterWithSlider
                          availableOptions={availableFilters}
                          selectedOptions={appliedFilters}
                          onFilterChange={handleFilterChange}
                          filterOperations={false}
                          filterReset={filterReset}
                          setFilterReset={setFilterReset}
                          maxValueSlider={maxValueSlider}
                          inputValueSlider={inputValueSlider}
                          setInputValueSlider={setInputValueSlider}
                        />
                        <div className="reset-filter-btn-container ">
                          <Button
                            type="button"
                            className="gg-btn-blue reset-filter-btn"
                            onClick={() => {
                              setAppliedFilters(JSON.parse(JSON.stringify(defaultAppliedFilters)));
                              setAvailableFilters(JSON.parse(JSON.stringify(defaultAvailableFilters)))
                              setInputValueSlider(maxValueSlider);
                              setFilterReset(1);
                            }}
                          >
                            Reset
                          </Button>
                        </div>
                      </div>
                      <div
                        className="list-sidebar-opener-with-slider-protein sidebar-arrow-center"
                        onClick={() => setSidebar(!sidebar)}
                      >
                        {sidebar ? <ArrowLeftIcon /> : <ArrowRightIcon />}
                      </div>
                    </div>
                  )}
                </Col>

                <Col sm={6} md={6} style={{ flexDirection: "column", overflow: "scroll !important" }}>
                  <div className="sidebar-page-outreach">
                    <div className="list-mainpage-container">
                      {elements && <CytoscapeComponent
                        elements={elements}
                        style={{ width: "100%", height: height }}
                        zoomingEnabled={true}
                        maxZoom={3}
                        minZoom={0.1}
                        autounselectify={false}
                        boxSelectionEnabled={true}
                        layout={layout}
                        stylesheet={styleSheet}
                        cy={cy => {
                          myCyRef.current = cy;

                          cy.on("tap", "node", evt => {
                            var node = evt.target;
                            setNodeData(node.data())
                            setNodeType(node.data().type)
                          });

                          cy.on('mouseover', 'node', function (evt) {
                            evt.cy.container().style.cursor = 'pointer';
                          });

                          // Reset cursor 
                          cy.on('mouseout', 'node', function (evt) {
                            evt.cy.container().style.cursor = 'default';
                          });

                        }}
                      />}

                    </div>
                  </div>
                </Col>

                <Col sm={2} md={2}>
                  <div className="icons-content pt-1">
                    <ol className="legendlists nowrap">
                      <span
                        className="protein"
                      >
                        <Row>
                          <Col sm={2} md={2}>
                            &#9679;
                            <span className="superx">
                              <>
                                Protein</>
                            </span>
                          </Col>
                        </Row>
                      </span>
                      <span
                        className="organism"
                      ></span>
                      <span
                        className="site"
                      >
                        <Row>
                          <Col sm={2} md={2}>
                            &#9679;
                            <span className="superx">
                              <>Site</>
                            </span>
                          </Col>
                        </Row>
                      </span>
                      <span
                        className="glycan"
                      >
                        <Row>
                          <Col sm={2} md={2}>
                            &#9679;
                            <span className="superx">
                              <>
                                Glycan</>
                            </span>
                          </Col>
                        </Row>
                      </span>
                      <span
                        className="disease"
                      >
                        <Row>
                          <Col sm={2} md={2}>
                            &#9679;
                            <span className="superx">
                              <>Disease</>
                            </span>
                          </Col>
                        </Row>
                      </span>
                      <span
                        className="biomarker"
                      >
                        <Row>
                          <Col sm={2} md={2}>
                            &#9679;
                            <span className="superx">
                              <>Biomarker</>
                            </span>
                          </Col>
                        </Row>
                      </span>
                      <span className="binding_glycan">
                        <Row>
                          <Col sm={2} md={2}>
                            &#9679;
                            <span className="superx">
                              <>Bound Glycan</>
                            </span>
                          </Col>
                        </Row>
                      </span>
                      <span
                        className="molecular_function"
                      >
                        <Row>
                          <Col sm={2} md={2}>
                            &#9679;
                            <span className="superx">
                              <>Molecular Function</>
                            </span>
                          </Col>
                        </Row>
                      </span>
                      <span
                        className="cellular_component"
                      >
                        <Row>
                          <Col sm={2} md={2}>
                            &#9679;
                            <span className="superx">
                              <>Cellular Component</>
                            </span>
                          </Col>
                        </Row>
                      </span>
                      <span
                        className="biological_process"
                      >
                        <Row>
                          <Col sm={2} md={2}>
                            &#9679;
                            <span className="superx">
                              <>Biological Process</>
                            </span>
                          </Col>
                        </Row>
                      </span>
                    </ol>
                  </div>
                  <div>
                    <ol className="legendlists nowrap">
                      <Row>
                        <Col sm={2} md={2}>
                          <Button
                            className='gg-btn-outline'
                            onClick={() => {
                              const cy = myCyRef.current;
                              if (cy) {
                                const layoutCurrent = cy.layout(layout);
                                layoutCurrent.run();
                              }
                            }}
                          >
                            Reset&nbsp;Zoom&nbsp;<RestartAltOutlinedIcon sx={{ color: 'text.primary' }} />
                          </Button>
                        </Col>
                      </Row>
                    </ol>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default KnowledgeGraphProtein;
