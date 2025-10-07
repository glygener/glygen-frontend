import React, { useState, useEffect, useRef, useReducer, createRef } from "react";
import { useParams } from "react-router-dom";
import { getProteinDetail } from "../data/protein";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import ProtvistaSidebar from "../components/navigation/ProtvistaSidebar";
import "d3";
import { NavLink } from "react-router-dom";
import NightingaleManager from "@nightingale-elements/nightingale-manager";
import ProtvistaTooltip from "protvista-tooltip";
import NightingaleSequence from "@nightingale-elements/nightingale-sequence";
import NightingaleTrack from "@nightingale-elements/nightingale-track";
import NightingaleNavigation from "@nightingale-elements/nightingale-navigation";
import routeConstants from "../data/json/routeConstants";
import Button from "react-bootstrap/Button";
import { Col, Row } from "react-bootstrap";
import "../css/protvista.css";
import FeedbackWidget from "../components/FeedbackWidget";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";

if (!customElements.get('nightingale-manager')) {
  window.customElements.define("nightingale-manager", NightingaleManager);
}
if (!customElements.get('nightingale-navigation')) {
  window.customElements.define("nightingale-navigation", NightingaleNavigation);
}
if (!customElements.get('nightingale-sequence')) {
  window.customElements.define("nightingale-sequence", NightingaleSequence);
}
if (!customElements.get('nightingale-track')) {
  window.customElements.define("nightingale-track", NightingaleTrack);
}

const ProtVista = () => {
  let { id, Protvistadisplay } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const [nGlycanWithImageState, setNGlycanWithImageState] = useState();


  const [expanded, setExpanded] = useState(false);
  const [highlighted, setHighlighted] = useState(null);

  const nGlycanWithImage = useRef(null);
  const nGlycanWithoutImage = useRef(null);
  const oGlycanWithImage = useRef(null);
  const oGlycanWithoutImage = useRef(null);
  const nSequon = useRef(null);
  const phosphorylationData = useRef(null);
  const glycationData = useRef(null);
  const mutationsData = useRef(null);
  const mutagenesisData = useRef(null);
  const allTrack = useRef(null);

  const [tracksShown, setTracksShown] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState,
    }),
    {
      mutation: true,
    }
  );

 

useEffect(() => {
    setPageLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    logActivity("user", id);
    const getData = getProteinDetail(id, true);
    getData.then(({ data }) => {
      if (data.code) {
        let message = "Protvista Detail api call";
        logActivity("user", id, "No results. " + message);
        setPageLoading(false);
      } else { 
        setData(data);
        setPageLoading(false);
      }
    });

    getData.catch(({ response }) => {
      let message = "ProtVista Detail api call";
      axiosError(response, id, message, setPageLoading, setAlertDialogInput);
    });

    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
  function setupProtvista(data) {
    var glycos = [
      {
        type: "N-Linked-With-Image",
        residues: [],
        color: "red",
        shape: "circle",
      },
      {
        type: "N-Linked-No-Image",
        residues: [],
        color: "red",
        shape: "triangle",
      },
      {
        type: "O-Linked-With-Image",
        residues: [],
        color: "blue",
        shape: "circle",
      },
      {
        type: "O-Linked-No-Image",
        residues: [],
        color: "blue",
        shape: "triangle",
      },
      {
        type: "Annotations",
        residues: [],
        color: "orange",
        shape: "square",
      },
      {
        type: "N-Linked-Range",
        residues: [],
        color: "red",
        shape: "bridge",
      },
      {
        type: "O-Linked-Range",
        residues: [],
        color: "blue",
        shape: "bridge",
      },
    ];
    var phosphorylationP = {
      type: "PhosphorylationP",
      residues: [],
      color: "#8480F3",
      shape: "circle",
    };
    var glycationG = {
      type: "GlycationG",
      residues: [],
      color: "#42C2C2",
      shape: "circle",
    };
    var mutations = {
      type: "Mutations",
      residues: [],
      color: "green",
      shape: "diamond",
    };
    var mutagenesisS = {
      type: "MutagenesisS",
      residues: [],
      color: "purple",
      shape: "bridge",
    };

    if (data.glycosylation) {
      for (let glyco of data.glycosylation) {
        if (glyco.start_pos === undefined) continue;
        if (glyco.type === "N-linked") {
          if (glyco.glytoucan_ac) {
            if (glyco.start_pos === glyco.end_pos) {
              glycos[0].residues.push({
                start: glyco.start_pos,
                end: glyco.start_pos,
                color: glycos[0].color,
                shape: glycos[0].shape,
                accession: data.uniprot.uniprot_canonical_ac,
                type: glyco.residue,
                title: glyco.residue + "-" + glyco.start_pos,
                tooltipContent:
                  "<img src='https://api.glygen.org/glycan/image/" +
                  glyco.glytoucan_ac +
                  "' /><br/></br>",
              });
          } else {
              glycos[0].residues.push({
                start: glyco.start_pos,
                end: glyco.end_pos,
                color: glycos[5].color,
                shape: glycos[5].shape,
                accession: data.uniprot.uniprot_canonical_ac,
                type: glyco.start_aa,
                click: "block",
                title: glyco.start_aa + "-" + glyco.start_pos + " to " + glyco.end_aa + "-" + glyco.end_pos,
                tooltipContent:
                  "<img src='https://api.glygen.org/glycan/image/" +
                  glyco.glytoucan_ac +
                  "' /><br/></br>" +
                  "<span className=marker>Glycosylation site with reported glycan from " +
                  glyco.start_aa + "-" + glyco.start_pos + " to " + glyco.end_aa + "-" + glyco.end_pos +
                  "." +
                  "</span>",
              });
            }
          } else if (glyco.start_pos === glyco.end_pos) {
            glycos[1].residues.push({
              start: glyco.start_pos,
              end: glyco.start_pos,
              color: glycos[1].color,
              shape: glycos[1].shape,
              accession: data.uniprot.uniprot_canonical_ac,
              type: glyco.residue,
              title: glyco.residue + "-" + glyco.start_pos,
              tooltipContent:
                "<span className=marker>Glycosylation site without reported glycan at " +
                glyco.start_pos +
                "." +
                "</br>Click on the Node to see site details. </span>",
            });
          } else {
            glycos[1].residues.push({
              start: glyco.start_pos,
              end: glyco.end_pos,
              color: glycos[5].color,
              shape: glycos[5].shape,
              accession: data.uniprot.uniprot_canonical_ac,
              type: glyco.start_aa,
              click: "block",
              title: glyco.start_aa + "-" + glyco.start_pos + " to " + glyco.end_aa + "-" + glyco.end_pos,
              tooltipContent:
                "<span className=marker>Glycosylation site without reported glycan from " +
                glyco.start_aa + "-" + glyco.start_pos + " to " + glyco.end_aa + "-" + glyco.end_pos +
                "." +
                "</span>",
            });
          }
        } else if (glyco.type === "O-linked") {
          if (glyco.glytoucan_ac) {
            if (glyco.start_pos === glyco.end_pos) {
              glycos[2].residues.push({
                start: glyco.start_pos,
                end: glyco.start_pos,
                color: glycos[2].color,
                shape: glycos[2].shape,
                accession: data.uniprot.uniprot_canonical_ac,
                type: glyco.residue,
                title: glyco.residue + "-" + glyco.start_pos,
                tooltipContent:
                  "<img src='https://api.glygen.org/glycan/image/" +
                  glyco.glytoucan_ac +
                  "' /><br/><br/><span className=marker>Click marker show more</span>",
              });
            } else { 
              glycos[2].residues.push({
                start: glyco.start_pos,
                end: glyco.end_pos,
                color: glycos[6].color,
                shape: glycos[6].shape,
                accession: data.uniprot.uniprot_canonical_ac,
                type: glyco.start_aa,
                click: "block",
                title: glyco.start_aa + "-" + glyco.start_pos + " to " + glyco.end_aa + "-" + glyco.end_pos,
                tooltipContent:
                  "<img src='https://api.glygen.org/glycan/image/" +
                  glyco.glytoucan_ac +
                  "' /><br/></br>" +
                  "<span className=marker>Glycosylation site with reported glycan from " +
                  glyco.start_aa + "-" + glyco.start_pos + " to " + glyco.end_aa + "-" + glyco.end_pos +
                  "." +
                  "</span>",
              });
            }
          } else if (glyco.start_pos === glyco.end_pos) {
            glycos[3].residues.push({
              start: glyco.start_pos,
              end: glyco.start_pos,
              color: glycos[3].color,
              shape: glycos[3].shape,
              accession: data.uniprot.uniprot_canonical_ac,
              type: glyco.residue,
              title: glyco.residue + "-" + glyco.start_pos,
              tooltipContent:
                "<span className=marker>Glycosylation site without reported glycan at " +
                glyco.start_pos +
                "." +
                "</br>Click on the Node to see site details. </span>",
            });
          } else {
            glycos[3].residues.push({
              start: glyco.start_pos,
              end: glyco.end_pos,
              color: glycos[6].color,
              shape: glycos[6].shape,
              accession: data.uniprot.uniprot_canonical_ac,
              type: glyco.start_aa,
              click: "block",
              title: glyco.start_aa + "-" + glyco.start_pos + " to " + glyco.end_aa + "-" + glyco.end_pos,
              tooltipContent:
                "<span className=marker>Glycosylation site without reported glycan from " +
                glyco.start_aa + "-" + glyco.start_pos + " to " + glyco.end_aa + "-" + glyco.end_pos +
                "." +
                "</span>",
            });
          }
        } 
      }
    }

    if (data.phosphorylation) {
      for (let phosphorylation of data.phosphorylation) {
        phosphorylationP.residues.push({
          start: phosphorylation.start_pos,
          end: phosphorylation.end_pos,
          color: phosphorylationP.color,
          shape: phosphorylationP.shape,
          accession: data.uniprot.uniprot_canonical_ac,
          type: phosphorylation.residue,
          click: phosphorylation.start_pos === phosphorylation.end_pos ? undefined : "block",
          title: phosphorylation.residue + "-" + phosphorylation.start_pos,
          tooltipContent:
            "<div className=marker>Phosphorylation site without reported glycan at " +
            phosphorylation.start_pos +
            "." +
            "</div><div>Click on the Node to see site details. </div>",
        });
      }
    }

    if (data.glycation) {
      for (let glycation of data.glycation) {
        glycationG.residues.push({
          start: glycation.start_pos,
          end: glycation.end_pos,
          color: glycationG.color,
          shape: glycationG.shape,
          accession: data.uniprot.uniprot_canonical_ac,
          type: glycation.residue,
          click: glycation.start_pos === glycation.end_pos ? undefined : "block",
          title: glycation.residue + "-" + glycation.start_pos,
          tooltipContent:
            "<div className=marker>Glycation site without reported glycan at " +
            glycation.start_pos +
            "." +
            "</div><div>Click on the Node to see site details. </div>",
        });
      }
    }

    if (data.snv) {
      for (let mutation of data.snv) {
        mutations.residues.push({
          start: mutation.start_pos,
          end: mutation.end_pos,
          color: mutations.color,
          shape: mutations.shape,
          accession: data.uniprot.uniprot_canonical_ac,
          type: "(" + mutation.sequence_org + " → " + mutation.sequence_mut + ")",
          click: mutation.start_pos === mutation.end_pos ? undefined : "block",
          title: mutation.sequence_org + "-" + mutation.start_pos,
          tooltipContent: "<div><strong>" + mutation.sequence_org + " → " + mutation.sequence_mut +"</strong></div><span className=marker> Annotation: " + mutation.comment + "</span>",
        });
      }
    }

    if (data.mutagenesis) {
      for (let mutagenesis of data.mutagenesis) {
        mutagenesisS.residues.push({
          start: mutagenesis.start_pos,
          end: mutagenesis.end_pos,
          color: mutagenesisS.color,
          shape: mutagenesisS.shape,
          accession: data.uniprot.uniprot_canonical_ac,
          type: "(" + mutagenesis.sequence_org + " → " + mutagenesis.sequence_mut + ")",
          click: mutagenesis.start_pos === mutagenesis.end_pos ? undefined : "block",
          title:
             (mutagenesis.start_pos ? mutagenesis.start_pos : "") +
             (mutagenesis.end_pos !== mutagenesis.start_pos ? "-" + mutagenesis.end_pos : ""),
          tooltipContent: 
          "<div> <div style=overflow-wrap:break-word className=marker>" +
            (mutagenesis.sequence_org ? mutagenesis.sequence_org : "") +
            " → " +
            (mutagenesis.sequence_mut ? mutagenesis.sequence_mut : "deleted")
            + "</div>" +
          "<div className=marker> Annotation: " + mutagenesis.comment + "</div></div>",
        });
      }
    }

    if (data.site_annotation) {
      for (let site_annotation of data.site_annotation) {
        glycos[4].residues.push({
          start: site_annotation.start_pos,
          end: site_annotation.end_pos,
          color: glycos[4].color,
          shape: glycos[4].shape,
          accession: data.uniprot.uniprot_canonical_ac,
          type: "N-Glycan-Sequon",
          title: site_annotation.start_pos + "-" + site_annotation.end_pos,
          tooltipContent:
            "<span className=marker>" +
            "N-Sequon at " +
            site_annotation.start_pos +
            "-" +
            site_annotation.end_pos +
            "</span>",
        });
      }
    }

    // TO CHECK MULTILE GLYCOSYLATION AT SAME POINT
    let glycosCombined = [];
    for (let i in glycos) {
      var combinedResiduesMap = {};
      for (let v of glycos[i].residues) {
        if (!combinedResiduesMap[v.start + ":" + v.end]) {
          v["count"] = 1;
          combinedResiduesMap[v.start + ":" + v.end] = v;
        } else {
          combinedResiduesMap[v.start + ":" + v.end].count += 1;
        }
      }
      glycosCombined.push(
        Object.values(combinedResiduesMap).map(function (v) {
          v["tooltipContent"] +=
            v["count"] > 1
              ? "<span className=marker>Click marker to show " +
                (v["count"] - 1) +
                " more at this site.</span>"
              : "";
          return v;
        })
      );
    }

     // TO CHECK MULTILE PHOSPHORYLATION AT SAME POINT
    let phosphoCombined = [];
    var combinedPhosphoResiduesMap = {};
    for (let v of phosphorylationP.residues) {
      if (!combinedPhosphoResiduesMap[v.start + ":" + v.end]) {
        v["count"] = 1;
        combinedPhosphoResiduesMap[v.start + ":" + v.end] = v;
      } else {
      combinedPhosphoResiduesMap[v.start + ":" + v.end].count += 1;
      }
    }
    phosphoCombined.push(
      Object.values(combinedPhosphoResiduesMap).map(function (v) {
        v["tooltipContent"] +=
          v["count"] > 1
            ? "<div className=marker>Click marker to show " +
              (v["count"] - 1) +
              " more at this site.</div>"
            : "";
        return v;
      })
    );

    // TO CHECK MULTILE GLYCATION AT SAME POINT
    let glycatCombined = [];
    var combinedGlycatResiduesMap = {};
    for (let v of glycationG.residues) {
      if (!combinedGlycatResiduesMap[v.start + ":" + v.end]) {
        v["count"] = 1;
        combinedGlycatResiduesMap[v.start + ":" + v.end] = v;
      } else {
        combinedGlycatResiduesMap[v.start + ":" + v.end].count += 1;
      }
    }
    glycatCombined.push(
      Object.values(combinedGlycatResiduesMap).map(function (v) {
        v["tooltipContent"] +=
          v["count"] > 1
            ? "<div className=marker>Click marker to show " +
              (v["count"] - 1) +
              " more at this site.</div>"
            : "";
        return v;
      })
    );

     // TO CHECK MULTILE MUTATIONS AT SAME POINT
     let mutationsCombined = [];
      var combinedMutationsResiduesMap = {};
      for (let v of mutations.residues) {
        if (!combinedMutationsResiduesMap[v.start + ":" + v.end]) {
          v["count"] = 1;
          combinedMutationsResiduesMap[v.start + ":" + v.end] = v;
        } else {
          combinedMutationsResiduesMap[v.start + ":" + v.end].count += 1;
        }
      }
      mutationsCombined.push(
        Object.values(combinedMutationsResiduesMap).map(function (v) {
          v["tooltipContent"] +=
            v["count"] > 1
              ? "<div className=marker>Click marker to show " +
                (v["count"] - 1) +
                " more SNV at this site.</div>"
              : "";
          return v;
        })
      );

      // TO CHECK MULTILE MUTAGENESIS AT SAME POINT
      let mutagenesisCombined = [];
      var combinedMutagenesisResiduesMap = {};
      for (let v of mutagenesisS.residues) {
        if (!combinedMutagenesisResiduesMap[v.start + ":" + v.end]) { 
          v["count"] = 1;
          combinedMutagenesisResiduesMap[v.start + ":" + v.end] = v;
        } else {
          combinedMutagenesisResiduesMap[v.start + ":" + v.end].count += 1;
        }
      }
      mutagenesisCombined.push(
        Object.values(combinedMutagenesisResiduesMap).map(function (v) {
          v["tooltipContent"] +=
            v["count"] > 1
              ? "<div className=marker>Click marker to show " +
                (v["count"] - 1) +
                " more at this site.</div>"
              : "";
          return v;
        })
      );

    return {
      nGlycanWithImage: glycosCombined[0],
      nGlycanWithoutImage: glycosCombined[1],
      oGlycanWithImage: glycosCombined[2],
      oGlycanWithoutImage: glycosCombined[3],
      nSequon: glycosCombined[4],
      phosphorylationData: phosphoCombined[0],
      glycationData: glycatCombined[0],
      mutationsData: mutationsCombined[0],
      mutagenesisData: mutagenesisCombined[0],
    };
  }

  const addTooltipToReference = (ref) => {
    let currentTooltip;
    ref.current &&
      ref.current.addEventListener("change", (event) => {
        const { eventtype, feature, coords } = event.detail;

        if (eventtype === "click") {
          if (event.detail.feature.click !== "block") {
            if (currentTooltip) {
              document.body.removeChild(currentTooltip);
              currentTooltip = null; 
            }
            const route = routeConstants.siteview + id + "/" + event.detail.feature.start;
            navigate(route);
          } else {
            return;
          } 
        } 
        if (eventtype === "mouseover") {
          if (currentTooltip) {
            document.body.removeChild(currentTooltip);
            currentTooltip = null;
          } 
          currentTooltip = document.createElement("div");
          // set attributes
          currentTooltip.title = feature.title;
          currentTooltip.visible = true;
          const [x, y] = coords;
          currentTooltip.x = x;
          currentTooltip.y = y;
          currentTooltip.innerHTML = feature.tooltipContent;
          // add the component to the document
          document.body.appendChild(currentTooltip);
          const closeButton = document.createElement("button");
          closeButton.innerHTML = "X";
          closeButton.className = "tooltip-close";

          const onCloseButton = () => {
            // remove the click listener
            closeButton.removeEventListener("click", onCloseButton);

            //cleanup tooltip
            if (currentTooltip) {
              document.body.removeChild(currentTooltip);
              currentTooltip = null;
            }
          };

          closeButton.addEventListener("click", onCloseButton);
          currentTooltip.appendChild(closeButton);
        } else if (eventtype === "mouseout") {
          if (currentTooltip) {
            document.body.removeChild(currentTooltip);
            currentTooltip = null;
          }
        }
      });
  };

    setPageLoading(true);
    let formattedData = setupProtvista(data);

    if (nGlycanWithImage.current) {
      nGlycanWithImage.current.data = formattedData.nGlycanWithImage;
    }

    setNGlycanWithImageState(formattedData.nGlycanWithImage);

    if (nGlycanWithoutImage.current) {
      nGlycanWithoutImage.current.data = formattedData.nGlycanWithoutImage;
    }
    if (oGlycanWithImage.current) {
      oGlycanWithImage.current.data = formattedData.oGlycanWithImage;
    }
    if (oGlycanWithoutImage.current) {
      oGlycanWithoutImage.current.data = formattedData.oGlycanWithoutImage;
    }
    if (nSequon.current) {
      nSequon.current.data = formattedData.nSequon;
    }

    if (allTrack && allTrack.current) {
      allTrack.current.data = [
        ...formattedData.nGlycanWithImage,
        ...formattedData.nGlycanWithoutImage,
        ...formattedData.oGlycanWithImage,
        ...formattedData.oGlycanWithoutImage,
        ...formattedData.nSequon,
      ];
    }

    if (phosphorylationData.current) {
      phosphorylationData.current.data = formattedData.phosphorylationData;

      setTracksShown({
        phosphorylationData: formattedData.phosphorylationData.length > 0,
      });
    }
    if (glycationData.current) {
      glycationData.current.data = formattedData.glycationData;

      setTracksShown({
        glycationData: formattedData.glycationData.length > 0,
      });
    }
    if (mutationsData.current) {
      mutationsData.current.data = formattedData.mutationsData;

      setTracksShown({
        mutation: formattedData.mutationsData.length > 0,
      });
    }
    if (mutagenesisData.current) {
      mutagenesisData.current.data = formattedData.mutagenesisData;

      setTracksShown({
        mutagenesisData: formattedData.mutagenesisData.length > 0,
      });
    }

    addTooltipToReference(allTrack);
    addTooltipToReference(nGlycanWithImage);
    addTooltipToReference(nGlycanWithoutImage);
    addTooltipToReference(oGlycanWithImage);
    addTooltipToReference(oGlycanWithoutImage);
    addTooltipToReference(nSequon);
    addTooltipToReference(phosphorylationData);
    addTooltipToReference(glycationData);
    addTooltipToReference(mutationsData);
    addTooltipToReference(mutagenesisData);
    setPageLoading(false);

    // eslint-disable-next-line
  }, [data]);

  return (
    <>
      <div className="content-box-md">
        <Row>
          <Grid item xs={12} sm={12} className="text-center">
            <div className="horizontal-heading">
              <h5>Look At</h5>
              <h2>
                {" "}
                <span>
                  ProtVista View of Protein <strong className="nowrap">{id}</strong>
                </span>
              </h2>
            </div>
          </Grid>
        </Row>
      </div>
      <Helmet>
        {getTitle("protvista", {
          uniprot_canonical_ac: id,
        })}
        {getMeta("protvista")}
      </Helmet>
      <FeedbackWidget />
      <PageLoader pageLoading={pageLoading} />
      <DialogAlert
        alertInput={alertDialogInput}
        setOpen={(input) => {
          setAlertDialogInput({ show: input });
        }}
      />
      <div className="gg-protvista-container">
        <div className="text-end">
          <NavLink to={`${routeConstants.proteinDetail}${id}`}>
            <Button
              type="button"
              className="gg-btn-blue"
            >
              Back To Protein Details
            </Button>
          </NavLink>
        </div>
        <Row>
          <Col xs={12} sm={12} xl={2} className="prot-sidebar">
            <ProtvistaSidebar
              tracksShown={tracksShown}
              expanded={expanded}
              handleExpand={() => setExpanded(!expanded)}
            />
          </Col>

          <Col xs={12} sm={12} xl={10} className="prot-body-content">
            {data && data.sequence && data.sequence.length && (
              <nightingale-manager
                width={"800"}
                reflected-attributes="length display-start display-end highlight-start highlight-end variantfilters"
                id="manager"
              >
                <nightingale-navigation
                  id="navigation"
                  class={`nav-track glycotrack`}
                  length={data.sequence.length}
                  display-start={1}
                  display-end={data.sequence.length}
                  highlightStart={1}
                  highlightEnd={data.sequence.length}
                  ruler-start={1}
                  show-highlight
                  width={"800"}
                  height="60"
                /> 
                <nightingale-sequence
                  id="seq1"
                  class="nav-track"
                  length={data.sequence.length}
                  sequence={data.sequence.sequence}
                  width={"800"}
                  height="60"
                /> 
                {/* Blank Track */}
                 <nightingale-track
                  class={`nav-track glycotrack emptytrack` + (expanded ? "" : " hidden")}
                  length={data.sequence.length}
                  display-start={1}
                  display-end={data.sequence.length}
                  layout="non-overlapping"
                  width={"800"}
                  height="60"
                />
                <nightingale-track
                  class={
                    `nav-track nav-combinetrack hover-style glycotrack1` +
                    (expanded ? " hidden" : "")
                  }
                  length={data.sequence.length}
                  display-start={1}
                  display-end={data.sequence.length}
                  layout="non-overlapping"
                  ref={allTrack}
                  width={"800"}
                  height={expanded ? "0": "80"}
                  id="id-nightingale-track"
                />
              <nightingale-overlay for="root"></nightingale-overlay> 
                <nightingale-track 
                  id="ptrack1"
                  class={
                    `nav-track glycotrack ` +
                    (expanded ? "" : " hidden") +
                    (highlighted === "Ntrack_withImage" ? " highlight" : "")
                  }
                  length={data.sequence.length}
                  display-start={1}
                  display-end={data.sequence.length}
                  layout="non-overlapping"
                  ref={nGlycanWithImage}
                  width={"800"}
                  height="60"
                />
                <nightingale-track
                  class={
                    `nav-track glycotrack ` +
                    (expanded ? "" : " hidden") +
                    (highlighted === "Ntrack_withoutImage" ? " highlight" : "")
                  }
                  length={data.sequence.length}
                  display-start={1}
                  display-end={data.sequence.length}
                  layout="non-overlapping"
                  ref={nGlycanWithoutImage}
                  width={"800"}
                  height="60"
                />
                <nightingale-track
                  class={
                    `nav-track glycotrack` +
                    (expanded ? "" : " hidden") +
                    (highlighted === "Otrack_withImage" ? " highlight" : "")
                  }
                  length={data.sequence.length}
                  display-start={1}
                  display-end={data.sequence.length}
                  layout="non-overlapping"
                  ref={oGlycanWithImage}
                  width={"800"}
                  height="60"
                />
                <nightingale-track
                  class={
                    `nav-track glycotrack` +
                    (expanded ? "" : " hidden") +
                    (highlighted === "Otrack_withoutImage" ? " highlight" : "")
                  }
                  length={data.sequence.length}
                  display-start={1}
                  display-end={data.sequence.length}
                  layout="non-overlapping"
                  ref={oGlycanWithoutImage}
                  width={"800"}
                  height="60"
                />
                <nightingale-track
                  class={
                    `nav-track glycotrack` +
                    (expanded ? "" : " hidden") +
                    (highlighted === "SEQUON" ? " highlight" : "")
                  }
                  length={data.sequence.length}
                  display-start={1}
                  display-end={data.sequence.length}
                  layout="non-overlapping"
                  ref={nSequon}
                  width={"800"}
                  height="60"
                />
                <nightingale-track
                  class={
                    `nav-track glycotrack` + (highlighted === "phosphorylation" ? " highlight" : "")
                  }
                  length={data.sequence.length}
                  display-start={1}
                  display-end={data.sequence.length}
                  layout="non-overlapping"
                  ref={phosphorylationData}
                  width={"800"}
                  height="60"
                />
                <nightingale-track
                  class={`nav-track glycotrack` + (highlighted === "glycation" ? " highlight" : "")}
                  length={data.sequence.length}
                  display-start={1}
                  display-end={data.sequence.length}
                  layout="non-overlapping"
                  ref={glycationData}
                  width={"800"}
                  height="60"
                />

                <nightingale-track
                  class={`nav-track glycotrack` + (highlighted === "mutation" ? " highlight" : "")}
                  length={data.sequence.length}
                  display-start={1}
                  display-end={data.sequence.length}
                  layout="non-overlapping"
                  ref={mutationsData}
                  width={"800"}
                  height="60"
                />
                <nightingale-track
                  class={
                    `nav-track glycotrack` + (highlighted === "mutagenesis" ? " highlight" : "")
                  }
                  length={data.sequence.length}
                  display-start={1}
                  display-end={data.sequence.length}
                  layout="non-overlapping"
                  ref={mutagenesisData}
                  width={"800"}
                  height="60"
                />
              </nightingale-manager>
            )}
          </Col>
        </Row>
        <div className="icons-content">
          <ol className="legendlists nowrap">
            <span
              className="super1 hover"
              onMouseEnter={() => setHighlighted("Ntrack_withImage")}
            >
              <Row> 
                <Col sm={3} md={3}>
                  &#9679;
                  <span className="superx">
                    <>N-Glycan</>
                  </span>
                </Col>
                <Col sm={3} md={3}>
                  &#9646;
                  <span className="superx">
                    <>N-Glycan with range (peptide)</>
                  </span>
                </Col>
              </Row>
            </span>
            <span
              className="super2 hover"
              onMouseEnter={() => setHighlighted("Ntrack_withoutImage")}
            >
              <Row>
                <Col sm={3} md={3}>
                  &#9650;
                  <span className="superx">
                    <>N-Glycan-Site</>
                  </span>
                </Col>
                <Col sm={3} md={3}>
                  &#9646;
                  <span className="superx">
                    <>N-Glycan-Site with range (peptide)</>
                  </span>
                </Col>
              </Row>
            </span>
            <span
                className="super3 hover"
                onMouseEnter={() => setHighlighted("Otrack_withImage")}
            >
              <Row>
                <Col sm={3} md={3}>
                  &#9679;
                  <span className="superx">
                    <>O-Glycan</>
                  </span>
                  </Col>
                  <Col sm={3} md={3}>
                  &#9646;
                  <span className="superx">
                    <>O-Glycan with range (peptide)</>
                  </span>
                </Col>
              </Row>
            </span>
            <span
              className="super4 hover"
              onMouseEnter={() => setHighlighted("Otrack_withoutImage")}
            >
              <Row>
                <Col sm={3} md={3}>
                  &#9650;
                  <span className="superx">
                    <>O-Glycan-Site</>
                  </span>
                  </Col>
                  <Col sm={3} md={3}>
                  &#9646;
                  <span className="superx">
                    <>O-Glycan-Site with range (peptide)</>
                  </span>
                </Col>
              </Row>
            </span>
            <span className="super6 hover" onMouseEnter={() => setHighlighted("SEQUON")}>
              <Row>
                <Col sm={3} md={3}>
                  &#9646;
                  <span className="superx">
                    <>N-Glycan-Sequon</>
                  </span>
                </Col>
              </Row>
            </span>
            <span
                className="super8 hover"
                onMouseEnter={() => setHighlighted("phosphorylation")}
            >
              <Row>
                <Col sm={3} md={3}>
                  &#9679;
                  <span className="superx">
                    <>Phosphorylation</>
                  </span>
                </Col>
              </Row>
            </span>
            <span className="super9 hover" onMouseEnter={() => setHighlighted("glycation")}>
              <Row>
                <Col sm={3} md={3}>
                  &#9679;
                  <span className="superx">
                    <>Glycation</>
                  </span>
                </Col>
              </Row>
            </span>
            <span className="super5 hover" onMouseEnter={() => setHighlighted("mutation")}>
              <Row>
                <Col sm={3} md={3}>
                  &#9670;
                  <span className="superx">
                    <>Single Nucleotide Variation</>
                  </span>
                </Col>
              </Row>
            </span>
            <span className="super7 hover" onMouseEnter={() => setHighlighted("mutagenesis")}>
              <Row>
                <Col sm={3} md={3}>
                  &#9646;
                  <span className="superx">
                    <>Mutagenesis</>
                  </span>
                </Col>
              </Row>
            </span>
          </ol>
        </div>
      </div>
    </>
  );
};

export default ProtVista;
