import React, { useState, useEffect, useRef, useReducer, createRef } from "react";
import { useParams } from "react-router-dom";
import { getProteinDetail } from "../data/protein";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import ProtvistaSidebar from "../components/navigation/ProtvistaSidebar";
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
import proteinDetailData from "../data/json/proteinDetailData.json";

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
if (!customElements.get('protvista-tooltip')) {
  window.customElements.define("protvista-tooltip", ProtvistaTooltip);
}

const domainAnnType = proteinDetailData.domain_ann_type;

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
  const [expandedMetal, setExpandedMetal] = useState(false);
  const [highlighted, setHighlighted] = useState(null);

  const nGlycanWithImage = useRef(null);
  const nGlycanWithoutImage = useRef(null);
  const oGlycanWithImage = useRef(null);
  const oGlycanWithoutImage = useRef(null);
  const nSequon = useRef(null);
  const metalArrRefs = useRef([]); 

  const metalData = useRef(null);
  const [metalTypes, setMetalTypes] = useState([{ion: "", charge: ""}])
  const domainData = useRef(null);
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

/**
 * Utility function to map string value to hex color code.
 * @param {string} str - input string.
 **/
const stringToHexColor = (str) => {
  let hash = 0;
  
  // Generate a hash code from the string
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert the hash into a 6-digit hex code
  let color = '#';
  for (let i = 0; i < 3; i++) {
    // Extract 8 bits at a time and format as a 2-digit hex
    const value = (hash >> (i * 8)) & 0xFF;
    color += value.toString(16).padStart(2, '0');
  }
  
  return color;
};
 

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

    let metalTypesTemp = [];
    if (data.binding_sites) {
      metalTypesTemp = data.binding_sites.map(site => {
        let met = site.ligand.split('(')[0];
        const openPar = site.ligand.indexOf('(');
        const closePar = site.ligand.indexOf(')');
        let supScrp = "";
        if (openPar !== -1 && closePar !== -1) {
          supScrp = site.ligand.substring(openPar + 1, closePar);
        }

        let type = site.ligand ? { ion: met, charge: supScrp } : {ion: "", charge: ""};
        return type;
      })
    }
    let uniMetTypes = [...new Map(metalTypesTemp.map(type => [type.ion, type])).values()];
    setMetalTypes(uniMetTypes);

    var metTemp = 
    {
      type: "Binding-sites",
      residues: [],
      color: "red",
      shape: "hexagon",
    };

    var metals = []
    var metalMap = new Map();
    if (uniMetTypes.length > 0) {
      uniMetTypes.forEach((type, index) => {
        let temp = JSON.parse(JSON.stringify(metTemp));
        temp.type = type.ion;
        metals.push(temp);
        metalMap.set(type.ion, index);
      })
    }

    var domainP = {
      type: "domainP",
      residues: [],
      color: "#3c8d42",
      shape: "rectangle",
    };
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

    if (data.binding_sites) {
      for (let bsites of data.binding_sites) {
        if (bsites.start_pos === undefined) continue;
        let met = bsites.ligand.split('(')[0];

        const openPar = bsites.ligand.indexOf('(');
        const closePar = bsites.ligand.indexOf(')');
        let supScrp = "";
        if (openPar !== -1 && closePar !== -1) {
          supScrp = bsites.ligand.substring(openPar + 1, closePar);
        }

        if (metalMap.has(met)) {
            metals[Number(metalMap.get(met))].residues.push({
              start: bsites.start_pos,
              end: bsites.end_pos,
              color:  stringToHexColor(bsites.ligand_label + bsites.ligand),
              shape: metals[0].shape,
              accession: data.uniprot.uniprot_canonical_ac,
              type: bsites.start_aa,
              click: "block",
              title: bsites.start_aa + "-" + bsites.start_pos,
              tooltipContent:
                "<div className=marker>Ligand: " +
                met + "<sup>" + supScrp + "</sup>" +
                "</div>" + 
                (bsites.uniprotkb_ligand_comment ? "<div className=marker>Comment: " + bsites.uniprotkb_ligand_comment + "</div>": "") +
                "",
            });
        } 
      }
    }

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

    if (data.domain_list) {
      for (let domain of data.domain_list) {
        domainP.residues.push({
          start: domain.start_pos,
          end: domain.end_pos,
          color: domainP.color,
          shape: domainP.shape,
          accession: data.uniprot.uniprot_canonical_ac,
          type: domain.residue,
          click: "block",
          title: domain.start_aa + "-" + domain.start_pos + " to " + domain.end_aa + "-" + domain.end_pos,
          tooltipContent:
            "<div className=marker>" + (domain.ann_type ? "Type: " : "") +
            (domainAnnType[domain.ann_type.toLowerCase()] ? domainAnnType[domain.ann_type.toLowerCase()] : domain.ann_type) +
            "</div>" +
            (domain.uniprotkb_annotation ? "<div className=marker>Name: " + domain.uniprotkb_annotation + "</div>": "") +
            "",
        });
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

     // TO CHECK MULTILE GLYCOSYLATION AT SAME POINT
    let metalsCombined = [];
    for (let i in metals) {
      var combinedMetalsResiduesMap = {};
      for (let v of metals[i].residues) {
        if (!combinedMetalsResiduesMap[v.start + ":" + v.end]) {
          v["count"] = 1;
          combinedMetalsResiduesMap[v.start + ":" + v.end] = v;
        } else {
          combinedMetalsResiduesMap[v.start + ":" + v.end].count += 1;
        }
      }
      metalsCombined.push(
        Object.values(combinedMetalsResiduesMap).map(function (v) {
          v["tooltipContent"] +=
            v["count"] > 1
              ? ""
              // "<div className=marker>Click marker to show " +
              //   (v["count"] - 1) +
              //   " more at this site.</div>"
              : "";
          return v;
        })
      );
    }


     // TO CHECK MULTILE DOMAIN AT SAME POINT
    let domainCombined = [];
    var combinedDomainoResiduesMap = {};
    for (let v of domainP.residues) {
      if (!combinedDomainoResiduesMap[v.start + ":" + v.end]) {
        v["count"] = 1;
        combinedDomainoResiduesMap[v.start + ":" + v.end] = v;
      } else {
      combinedDomainoResiduesMap[v.start + ":" + v.end].count += 1;
      }
    }
    domainCombined.push(
      Object.values(combinedDomainoResiduesMap).map(function (v) {
        v["tooltipContent"] +=
          v["count"] > 1
            ? ""
            // "<div className=marker>Click marker to show " +
            //   (v["count"] - 1) +
            //   " more at this site.</div>"
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
      metalCombData: metalsCombined,
      domainData: domainCombined[0],
      glycationData: glycatCombined[0],
      mutationsData: mutationsCombined[0],
      mutagenesisData: mutagenesisCombined[0],
    };
  }

  const addTooltipToReference = (ref) => {
    let currentTooltip;
    ref.current &&
      ref.current.addEventListener("change", (event) => {
        const { eventType, feature, coords } = event.detail;
        if (eventType === "click") {
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
        if (eventType === "mouseover") {
          if (currentTooltip) {
            document.body.removeChild(currentTooltip);
            currentTooltip = null;
          } 
          currentTooltip = document.createElement("protvista-tooltip");
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
        } else if (eventType === "mouseout") {
          if (currentTooltip) {
            document.body.removeChild(currentTooltip);
            currentTooltip = null;
          }
        }
      });
  };

    const addTooltipToArrayReference = (ref) => {
    let currentTooltip;
    ref &&
      ref.addEventListener("change", (event) => {
        const { eventType, feature, coords } = event.detail;
        if (eventType === "click") {
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
        if (eventType === "mouseover") {
          if (currentTooltip) {
            document.body.removeChild(currentTooltip);
            currentTooltip = null;
          } 
          currentTooltip = document.createElement("protvista-tooltip");
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
        } else if (eventType === "mouseout") {
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

    let mData = [] 
    formattedData.metalCombData.map((data) => {
      mData.push(...data)
    })

    if (metalData && metalData.current) {
      metalData.current.data = [
        ...mData
      ];
    }

    for (let i = 0; i < metalTypes.length > 0; i++) {
      if (metalArrRefs.current[i]) {
        metalArrRefs.current[i].data = formattedData.metalCombData[i];
        setTracksShown({
          [metalTypes[i].ion + "Data"]: formattedData.metalCombData[i].length > 0,
        });
        addTooltipToArrayReference(metalArrRefs.current[i]);
      }
    }

    if (domainData.current) {
      domainData.current.data = formattedData.domainData;

      setTracksShown({
        domainData: formattedData.domainData.length > 0,
      });
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
    addTooltipToReference(metalData);
    addTooltipToReference(domainData);
    addTooltipToReference(phosphorylationData);
    addTooltipToReference(glycationData);
    addTooltipToReference(mutationsData);
    addTooltipToReference(mutagenesisData);
    setPageLoading(false);

    // eslint-disable-next-line
  }, [data, expandedMetal]);

  return (
    <>
      <div className="content-box-md">
        <Grid item size= {{ xs: 12, sm: 12 }} className="text-center">
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
              metalTypes={metalTypes}
              expanded2={expandedMetal}
              handleExpand={() => setExpanded(!expanded)}
              handleExpand2={() => setExpandedMetal(!expandedMetal)}
            />
          </Col>

          <Col xs={12} sm={12} xl={10} className="prot-body-content">
            {data && data.sequence && data.sequence.length && (
              <div style={{height: expanded ? "1040px" : "740px"}}>
                <nightingale-manager
                  class={`nav-track-manager`}
                  reflected-attributes="length display-start display-end highlight-start highlight-end variantfilters"
                  id="manager"
                >
                  <nightingale-navigation
                    id="navigation"
                    class={`nav-track glycotrack`}
                    length={data.sequence.length}
                    display-start={1}
                    display-end={data.sequence.length}
                    height="60"
                  /> 
                  <nightingale-sequence
                    id="seq1"
                    class="nav-track"
                    length={data.sequence.length}
                    sequence={data.sequence.sequence}
                    height="60"
                  /> 
                  {/* Blank Track */}
                  <nightingale-track
                    class={`nav-track glycotrack emptytrack` + (expanded ? "" : " hidden")}
                    length={data.sequence.length}
                    display-start={1}
                    display-end={data.sequence.length}
                    layout="non-overlapping"
                    height="80"
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
                    height="60"
                  />
                  {/* Blank Track */}
                  <nightingale-track
                    class={`nav-track glycotrack emptytrack` + (expandedMetal ? "" : " hidden")}
                    length={data.sequence.length}
                    display-start={1}
                    display-end={data.sequence.length}
                    layout="non-overlapping"
                    height="80"
                  />
                  <nightingale-track
                    class={
                      `nav-track nav-combinetrack hover-style glycotrack1` +
                      (expandedMetal ? " hidden" : "") +
                      (highlighted === "metal_binding" ? " highlight" : "")
                    }
                    length={data.sequence.length}
                    display-start={1}
                    display-end={data.sequence.length}
                    layout="non-overlapping"
                    ref={metalData}
                    height={expandedMetal ? "0": "80"}
                    id="id-nightingale-track"
                  />

                  {metalTypes && metalTypes.length > 0 && metalTypes.map ((type, index) => 
                    <nightingale-track 
                      id={"ptrack1" + "type"}
                      class={
                        `nav-track glycotrack ` +
                        (expandedMetal ? "" : " hidden")
                      }
                      length={data.sequence.length}
                      display-start={1}
                      display-end={data.sequence.length}
                      layout="non-overlapping"
                      ref={(node) => {
                        if (node) metalArrRefs.current[index] = node;
                      }}
                      height="60"
                    />
                  )}
                  <nightingale-track
                    class={
                      `nav-track glycotrack` + (highlighted === "domain" ? " highlight" : "")
                    }
                    length={data.sequence.length}
                    display-start={1}
                    display-end={data.sequence.length}
                    layout="non-overlapping"
                    ref={domainData}
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
                    height="60"
                  />
                  <nightingale-track
                    class={`nav-track glycotrack` + (highlighted === "glycation" ? " highlight" : "")}
                    length={data.sequence.length}
                    display-start={1}
                    display-end={data.sequence.length}
                    layout="non-overlapping"
                    ref={glycationData}
                    height="60"
                  />

                  <nightingale-track
                    class={`nav-track glycotrack` + (highlighted === "mutation" ? " highlight" : "")}
                    length={data.sequence.length}
                    display-start={1}
                    display-end={data.sequence.length}
                    layout="non-overlapping"
                    ref={mutationsData}
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
                    height="60"
                  />
                </nightingale-manager>
              </div>
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
                  onMouseEnter={() => setHighlighted("metal_binding")}
              >
                <Row>
                  <Col sm={3} md={3}>
                    &#x2B21;
                    <span className="superx">
                      <>Metal Binding (different colors)</>
                    </span>
                  </Col>
                </Row>
              </span>
              <span
                  className="super11 hover"
                  onMouseEnter={() => setHighlighted("domain")}
              >
                <Row>
                  <Col sm={3} md={3}>
                    &#9646;
                    <span className="superx">
                      <>Domain</>
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
