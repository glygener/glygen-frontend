import React, { useEffect, useState, useRef, useReducer } from "react";
import { useParams } from "react-router-dom";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from 'cytoscape';
import ListFilterWithSlider from "../components/ListFilterWithSlider";
import Button from "react-bootstrap/Button";
import { ReactComponent as ArrowRightIcon } from "../images/icons/arrowRightIcon.svg";
import { ReactComponent as ArrowLeftIcon } from "../images/icons/arrowLeftIcon.svg";
import glycanKnowledgegraphJSON from "../data/json/glycanKnowledgegraph.json";
import { Col, Row } from "react-bootstrap";
import { getGlycanGraph } from "../data/glycan";
import "../css/graph.css";
import GlycanNodeDisplay from "../components/graph/GlycanNodeDisplay";
import SiteNodeDisplay from "../components/graph/SiteNodeDisplay";
import MotifNodeDisplay from "../components/graph/MotifNodeDisplay";
import OrganismNodeDisplay from "../components/graph/OrganismNodeDisplay";
import BiomarkerNodeDisplay from "../components/graph/BiomarkerNodeDisplay";
import ProteinNodeDisplay from "../components/graph/ProteinNodeDisplay";
import { sortByWeight } from "../utils/common";
import { getTitle, getMeta } from "../utils/head";
import Helmet from "react-helmet";
import FeedbackWidget from "../components/FeedbackWidget";
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";

export function KnowledgeGraphGlycan() {
  let { id } = useParams();

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
  const [pageLoading, setPageLoading] = useState(true);
  const [filterReset, setFilterReset] = useState(0);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
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

  useEffect(() => {
    setPageLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    logActivity("user", id);

    getGlycanGraph(id).then(({ data }) => {
      if (data.code) {
        let message = "Glycan Knowledge Graph api call";
        logActivity("user", id, "No results. " + message);
        setPageLoading(false);
      } else {
        let api_response = data;
        if (api_response) {
          let graphData = { nodes: [], edges: [] };
          setInputValueSlider(maxValueSlider);
          let centralNodeId = api_response.glytoucan_ac;
          // adding central glycan node.
          let glNode = {
            data: {
              id: api_response.glytoucan_ac, label: api_response.glytoucan_ac, type: "glycan",
              details: {
                glytoucan_ac: api_response.glytoucan_ac,
                mass: api_response.mass,
                species: api_response.species,
                classification: api_response.classification,
                composition: api_response.composition,
              }
            }
          }
          graphData.nodes.push(glNode);

          let nodeTypeArray = [];
          let outreachTypes = glycanKnowledgegraphJSON.node_type;
          let applFilters = [{ "id": "node_type", "operator": "OR", "selected": [] }];
          let maxNodeCount = 0;
          let siteNodeCount = 0;

          // adding site nodes.
          // adding edges between site node and central glycan nodes.

          api_response.sites = api_response.sites.sort(sortByWeight);
          for (let i = 0; i < api_response.sites.length; i++) {
            let siteN = api_response.sites[i];
            let siteNodeId = siteN.site_lbl + "-" + siteN.uniprot_canonical_ac;
            let siteNode = {
              data: {
                id: siteN.site_lbl + "-" + siteN.uniprot_canonical_ac, label: siteN.site_lbl + "-" + siteN.uniprot_canonical_ac, type: "site",
                weight: siteN.weight,
                order: i + 1,
                details: siteN,
              }
            }

            graphData.nodes.push(siteNode);

            if (siteN.glycoprotein && siteN.glycoprotein.length > 0) {
              let glyToSi = { data: { source: centralNodeId, target: siteNodeId, label: "Found on glycosylates", type: "site" } }
              graphData.edges.push(glyToSi);
            }

            if (siteN.snv && siteN.snv.length > 0) {
              let glyToSi = { data: { source: centralNodeId, target: siteNodeId, label: "SNV", type: "site" } }
              graphData.edges.push(glyToSi);
            }

            if (siteN.phosphorylation && siteN.phosphorylation.length > 0) {
              let glyToSi = { data: { source: centralNodeId, target: siteNodeId, label: "Phosphorylation", type: "site" } }
              graphData.edges.push(glyToSi);
            }

            if (siteN.mutagenesis && siteN.mutagenesis.length > 0) {
              let glyToSi = { data: { source: centralNodeId, target: siteNodeId, label: "Mutagenesis", type: "site" } }
              graphData.edges.push(glyToSi);
            }
          }

          if (api_response.sites.length > maxNodeCount) {
            maxNodeCount = api_response.sites.length;
          }

          if (api_response.sites.length > 0) {
            let filterOp = outreachTypes["site"];
            filterOp.count = api_response.sites.length;
            nodeTypeArray.push(filterOp);
            applFilters[0].selected.push("site");
          }

          // adding enzyme/protein nodes.
          // adding edges between enzyme/protein nodes and central glycan nodes.

          api_response.enzyme = api_response.enzyme.sort(sortByWeight);
          for (let i = 0; i < api_response.enzyme.length; i++) {
            let enzN = api_response.enzyme[i];
            let enzymeNodeId = enzN.uniprot_canonical_ac;
            let enzymeNode = {
              data: {
                id: enzN.uniprot_canonical_ac, label: enzN.uniprot_canonical_ac, type: "enzyme",
                weight: enzN.weight,
                order: i + 1,
                details: enzN
              }
            }
            graphData.nodes.push(enzymeNode);
            let glyToSi = { data: { source: centralNodeId, target: enzymeNodeId, label: "synthesized_by", type: "enzyme" } }
            graphData.edges.push(glyToSi);
          }

          if (api_response.enzyme.length > maxNodeCount) {
            maxNodeCount = api_response.enzyme.length;
          }

          if (api_response.enzyme.length > 0) {
            let filterOp = outreachTypes["enzyme"];
            filterOp.count = api_response.enzyme.length;
            nodeTypeArray.push(filterOp);
            applFilters[0].selected.push("enzyme");
          }

          // adding binding protein nodes.
          // adding edges between binding protein nodes and central glycan nodes.

          api_response.binding_proteins = api_response.binding_proteins.sort(sortByWeight);
          for (let i = 0; i < api_response.binding_proteins.length; i++) {
            let binN = api_response.binding_proteins[i];
            let binNodeId = binN.uniprot_canonical_ac;
            let enzymeNode = {
              data: {
                id: binN.uniprot_canonical_ac, label: binN.uniprot_canonical_ac, type: "binding-protein",
                weight: binN.weight,
                order: i + 1,
                details: binN,
              }
            }
            graphData.nodes.push(enzymeNode);
            let glyToBin = { data: { source: centralNodeId, target: binNodeId, label: "bound_to", type: "binding-protein" } }
            graphData.edges.push(glyToBin);
          }

          if (api_response.binding_proteins.length > maxNodeCount) {
            maxNodeCount = api_response.binding_proteins.length;
          }

          if (api_response.binding_proteins.length > 0) {
            let filterOp = outreachTypes["binding-protein"];
            filterOp.count = api_response.binding_proteins.length;
            nodeTypeArray.push(filterOp);
            applFilters[0].selected.push("binding-protein");
          }

          // adding organism nodes.
          // adding edges between organism nodes and central glycan nodes.

          api_response.species = api_response.species.sort(sortByWeight);
          for (let i = 0; i < api_response.species.length; i++) {
            let orgN = api_response.species[i];
            let orgNodeId = orgN.glygen_name;
            let orgNode = {
              data: {
                id: orgN.glygen_name, label: orgN.glygen_name, type: "organism",
                weight: orgN.weight,
                order: i + 1,
                details: orgN,
              }
            }
            graphData.nodes.push(orgNode);
            let glyToOrg = { data: { source: centralNodeId, target: orgNodeId, label: "has_taxon", type: "organism" } }
            graphData.edges.push(glyToOrg);
          }

          if (api_response.species.length > maxNodeCount) {
            maxNodeCount = api_response.species.length;
          }

          if (api_response.species.length > 0) {
            let filterOp = outreachTypes["organism"];
            filterOp.count = api_response.species.length;
            nodeTypeArray.push(filterOp);
            applFilters[0].selected.push("organism");
          }

          // adding motif nodes.
          // adding edges between motif nodes and central glycan nodes.

          api_response.motifs = api_response.motifs.sort(sortByWeight);
          for (let i = 0; i < api_response.motifs.length; i++) {
            let motN = api_response.motifs[i];
            let motNodeId = motN.id;
            let motNode = {
              data: {
                id: motN.id, label: motN.name, type: "motif",
                weight: motN.weight,
                order: i + 1,
                details: motN,
              }
            }
            graphData.nodes.push(motNode);
            let glyToMot = { data: { source: centralNodeId, target: motNodeId, label: "has_motif", type: "motif" } }
            graphData.edges.push(glyToMot);
          }

          if (api_response.motifs.length > maxNodeCount) {
            maxNodeCount = api_response.motifs.length;
          }

          if (api_response.motifs.length > 0) {
            let filterOp = outreachTypes["motif"];
            filterOp.count = api_response.motifs.length;
            nodeTypeArray.push(filterOp);
            applFilters[0].selected.push("motif");
          }

          // adding biomarker nodes.
          // adding edges between biomarker nodes and central glycan nodes.
          api_response.biomarkers = api_response.biomarkers.sort(sortByWeight);
          for (let i = 0; i < api_response.biomarkers.length; i++) {
            let bioN = api_response.biomarkers[i];
            let bioNodeId = bioN.biomarker_id;
            let bioNode = {
              data: {
                id: bioN.biomarker_id, label: bioN.biomarker_id, type: "biomarker",
                weight: bioN.weight,
                order: i + 1,
                details: bioN,
              }
            }
            graphData.nodes.push(bioNode);
            let glyToBio = { data: { source: centralNodeId, target: bioNodeId, label: "biomarker_in", type: "biomarker" } }
            graphData.edges.push(glyToBio);
          }

          if (api_response.biomarkers.length > maxNodeCount) {
            maxNodeCount = api_response.biomarkers.length;
          }

          if (api_response.biomarkers.length > 0) {
            let filterOp = outreachTypes["biomarker"];
            filterOp.count = api_response.biomarkers.length;
            nodeTypeArray.push(filterOp);
            applFilters[0].selected.push("biomarker");
          }

          let elements = CytoscapeComponent.normalizeElements(graphData)
          setElements(elements);

          setDefaultKnowGraphData(graphData);

          // filters
          let fl = glycanKnowledgegraphJSON.filters;


          let temp3 = fl.filter(obj => obj.id === "node_type")[0];
          if (temp3) {
            temp3.options = [];
            temp3.options.push(...nodeTypeArray);
          }

          setAvailableFilters(fl);
          setAppliedFilters(applFilters);

          setDefaultAppliedFilters(applFilters);

          if (maxNodeCount > 0 && maxNodeCount < maxValueSlider) {
            setMaxValueSlider(maxNodeCount);
            setInputValueSlider(maxNodeCount);
          }
          setPageLoading(false);
        }
      }
    })
      .catch(({ response }) => {
        if (
          response && response.data &&
          response.data.error_list &&
          response.data.error_list.length &&
          response.data.error_list[0].error_code &&
          response.data.error_list[0].error_code === "non-existent-record"
        ) {

          setPageLoading(false);
        } else {
          let message = "Knowledge Graph api call";
          axiosError(response, id, message, setPageLoading, setAlertDialogInput);
        }
      });

  }, []);


  useEffect(() => {
    let graphData = { nodes: [], edges: [] };

    if (defaultKnowGraphData === undefined || defaultKnowGraphData.nodes.length === 0)
      return;

    let nodes = defaultKnowGraphData.nodes.filter(node => node.data.type === "glycan")
    graphData.nodes.push(nodes[0])
    let byOrderKnowGraphData = JSON.parse(JSON.stringify(defaultKnowGraphData));

    byOrderKnowGraphData.nodes = byOrderKnowGraphData.nodes.filter(node => node.data.order <= inputValueSlider || inputValueSlider === maxValueSlider)
    for (let i = 0; i < appliedFilters.length; i++) {
      if (appliedFilters[i] && appliedFilters[i].selected && appliedFilters[i].selected.length > 0) {
        for (let j = 0; j < appliedFilters[i].selected.length; j++) {
          let nodes = byOrderKnowGraphData.nodes.filter(node => node.data.type === appliedFilters[i].selected[j])
          graphData.nodes.push(...nodes)
        }
      }
    }

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

    graphData.nodes = graphData.nodes.filter(node => checkEdgeExists(graphData.edges, node.data.id) || node.data.type === "glycan")
    graphData.edges.push(...edges)

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
      const otherFilters = appliedFilters.filter(
        filter => filter.id !== newFilter.id
      );

      if (newFilter.selected.length) {
        setAppliedFilters(JSON.parse(JSON.stringify([...otherFilters, newFilter])));
      } else {
        setAppliedFilters(JSON.parse(JSON.stringify(otherFilters)));
      }
    } else if (newFilter.selected.length) {
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
        //text props
        "text-outline-color": "#4a56a6",
        "text-outline-width": "1px",
        color: "white",
        fontSize: 10,
      },
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
      selector: "node[type='protein10']",
      style: {
        backgroundColor: "#c91e9f",
      }
    },
    {
      selector: "node[type='enzyme']",
      style: {
        backgroundColor: "#8834a7",
      }
    },
    {
      selector: "node[type='binding-protein']",
      style: {
        backgroundColor: "#08552f",
      }
    },
    {
      selector: "node[type='organism']",
      style: {
        backgroundColor: "#4aa683",
      }
    },
    {
      selector: "node[type='motif']",
      style: {
        backgroundColor: "#76a64a",
      }
    },
    {
      selector: "node[type='biomarker']",
      style: {
        backgroundColor: "#a6644a",
      }
    },
    {
      selector: "edge",
      style: {
        width: 2,
        // "line-color": "#6774cb",
        "line-color": "#AAD8FF",
        "target-arrow-color": "#6774cb",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        // 'label': 'data(label)',
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
              Glycan Knowledge Graph For
              <strong className="nowrap">
                {id && (
                  <> {id}</>
                )}
              </strong>
            </span>
          </h2>
        </div>
        <Helmet>
          {getTitle("glycanKnowledgeGraph", {
            glytoucan_ac:
              id ? id : "",
          })}
          {getMeta("glycanKnowledgeGraph")}
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
                maxHeight: "600px",
                overflow: "auto"
              }}
            >
              <GlycanNodeDisplay
                nodeData={nodeData}
                nodeType={nodeType}
                graphType={"glycan"}
                setNodeType={setNodeType}
              />
              <SiteNodeDisplay
                nodeData={nodeData}
                nodeType={nodeType}
                graphType={"glycan"}
                setNodeType={setNodeType}
              />
              <MotifNodeDisplay
                nodeData={nodeData}
                nodeType={nodeType}
                graphType={"glycan"}
                setNodeType={setNodeType}
              />
              <OrganismNodeDisplay
                nodeData={nodeData}
                nodeType={nodeType}
                graphType={"glycan"}
                setNodeType={setNodeType}
              />
              <BiomarkerNodeDisplay
                nodeData={nodeData}
                nodeType={nodeType}
                graphType={"glycan"}
                setNodeType={setNodeType}
              />
              <ProteinNodeDisplay
                nodeData={nodeData}
                nodeType={nodeType}
                graphType={"glycan"}
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
                              setInputValueSlider(maxValueSlider);
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
                              setInputValueSlider(maxValueSlider);
                              setFilterReset(1);
                            }}
                          >
                            Reset
                          </Button>
                        </div>
                      </div>
                      <div
                        className="list-sidebar-opener-with-slider-glycan sidebar-arrow-center"
                        onClick={() => setSidebar(!sidebar)}
                      >
                        {sidebar ? <ArrowLeftIcon /> : <ArrowRightIcon />}
                      </div>
                    </div>
                  )}
                </Col>
                <Col sm={6} md={6} style={{ flexDirection: "column", overflow: "scroll !important" }}>
                  <div className="sidebar-page-outreach">
                    <div class="list-mainpage-container">
                      {elements && <CytoscapeComponent
                        elements={elements}
                        pan={{ x: 200, y: 200 }}
                        style={{ width: "100%", height: height }}
                        zoomingEnabled={true}
                        maxZoom={3}
                        minZoom={0.01}
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
                        className="motif"
                      >
                        <Row>
                          <Col sm={2} md={2}>
                            &#9679;
                            <span className="superx">
                              <>
                                Motif</>
                            </span>
                          </Col>
                        </Row>
                      </span>
                      <span
                        className="organism"
                      >
                        <Row>
                          <Col sm={2} md={2}>
                            &#9679;
                            <span className="superx">
                              <>Organism</>
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
                      <span className="bound_protein">
                        <Row>
                          <Col sm={2} md={2}>
                            &#9679;
                            <span className="superx">
                              <>Bound Protein</>
                            </span>
                          </Col>
                        </Row>
                      </span>
                      <span
                        className="synthesizing_enzyme"
                      >
                        <Row>
                          <Col sm={2} md={2}>
                            &#9679;
                            <span className="superx">
                              <>Synthesizing Enzyme</>
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

export default KnowledgeGraphGlycan;
