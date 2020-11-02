import React, { useState, useEffect, useRef, useReducer } from "react";
import { useParams } from "react-router-dom";
import { getProteinDetail } from "../data/protein";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import ProtvistaSidebar from "../components/navigation/ProtvistaSidebar";
import "d3";
import { NavLink } from "react-router-dom";
import ProtvistaManager from "protvista-manager";
import ProtvistaTooltip from "protvista-tooltip";
import ProtvistaNavigation from "protvista-navigation";
import ProtvistaSequence from "protvista-sequence";
import ProtvistaTrack from "protvista-track";
import routeConstants from "../data/json/routeConstants";
import Button from "react-bootstrap/Button";
import { Col, Row } from "react-bootstrap";
import "../css/protvista.css";
import FeedbackWidget from "../components/FeedbackWidget";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import { display } from "@material-ui/system";
import { useHistory } from "react-router-dom";
import { Grid } from "@material-ui/core";
window.customElements.define("protvista-manager", ProtvistaManager);
window.customElements.define("protvista-navigation", ProtvistaNavigation);
window.customElements.define("protvista-sequence", ProtvistaSequence);
window.customElements.define("protvista-track", ProtvistaTrack);
window.customElements.define("protvista-tooltip", ProtvistaTooltip);

const ProtVista = () => {
  let { id, Protvistadisplay } = useParams();
  const history = useHistory();
  const [data, setData] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  function setupProtvista(data) {
    var glycos = [
      {
        type: "N-Linked-With-Image",
        residues: [],
        color: "red",
        shape: "circle"
      },
      {
        type: "N-Linked-No-Image",
        residues: [],
        color: "red",
        shape: "triangle"
      },
      {
        type: "O-Linked-With-Image",
        residues: [],
        color: "blue",
        shape: "circle"
      },
      {
        type: "O-Linked-No-Image",
        residues: [],
        color: "blue",
        shape: "triangle"
      },
      {
        type: "Annotations",
        residues: [],
        color: "orange",
        shape: "square"
      }
    ];

    var mutations = {
      type: "Mutations",
      residues: [],
      color: "green",
      shape: "diamond"
    };
    var mutagenesisS = {
      type: "MutagenesisS",
      residues: [],
      color: "purple",
      shape: "square"
    };

    if (data.glycosylation) {
      for (let glyco of data.glycosylation) {
        // $.each(data.glycosylation, function (i, glyco) {
        if (glyco.type === "N-linked") {
          if (glyco.glytoucan_ac) {
            glycos[0].residues.push({
              start: glyco.position,
              end: glyco.position,
              color: glycos[0].color,
              shape: glycos[0].shape,
              accession: data.uniprot.uniprot_canonical_ac,
              type: glyco.residue,
              title: glyco.residue + "-" + glyco.position,
              tooltipContent:
                "<img src='https://api.glygen.org/glycan/image/" +
                glyco.glytoucan_ac +
                "' /><br/></br>"
            });
          } else {
            glycos[1].residues.push({
              start: glyco.position,
              end: glyco.position,
              color: glycos[1].color,
              shape: glycos[1].shape,
              accession: data.uniprot.uniprot_canonical_ac,
              type: glyco.residue,
              title: glyco.residue + "-" + glyco.position,
              tooltipContent:
                "<span className=marker>Glycosylation site without reported glycan at " +
                glyco.position +
                "," +
                " Click to see site details. </span>"
            });
          }
        } else if (glyco.type === "O-linked") {
          if (glyco.glytoucan_ac) {
            glycos[2].residues.push({
              start: glyco.position,
              end: glyco.position,
              color: glycos[2].color,
              shape: glycos[2].shape,
              accession: data.uniprot.uniprot_canonical_ac,
              type: glyco.residue,
              title: glyco.residue + "-" + glyco.position,
              tooltipContent:
                "<img src='https://api.glygen.org/glycan/image/" +
                glyco.glytoucan_ac +
                "' /><br/><br/><span className=marker>Click marker show more</span>"
            });
          } else {
            glycos[3].residues.push({
              start: glyco.position,
              end: glyco.position,
              color: glycos[3].color,
              shape: glycos[3].shape,
              accession: data.uniprot.uniprot_canonical_ac,
              type: glyco.residue,
              title: glyco.residue + "-" + glyco.position,
              tooltipContent:
                "<span className=marker>Glycosylation site without reported glycan at " +
                glyco.position +
                "," +
                " Click to see site details. </span>"
            });
          }
        }
      } //);
    }

    if (data.snv) {
      for (let mutation of data.snv) {
        // $.each(data.mutation, function (i, mutation) {
        mutations.residues.push({
          start: mutation.start_pos,
          end: mutation.end_pos,
          color: mutations.color,
          shape: mutations.shape,
          accession: data.uniprot.uniprot_canonical_ac,
          type:
            "(" + mutation.sequence_org + " → " + mutation.sequence_mut + ")",
          title:
            "(" + mutation.sequence_org + " → " + mutation.sequence_mut + ")",
          tooltipContent:
            "<span className=marker> annotation " +
            mutation.annotation +
            "</span>"
        });
      } //);
    }

    if (data.mutagenesis) {
      for (let mutagenesis of data.mutagenesis) {
        // $.each(data.mutation, function (i, mutation) {
        mutagenesisS.residues.push({
          start: mutagenesis.start_pos,
          end: mutagenesis.end_pos,
          color: mutagenesisS.color,
          shape: mutagenesisS.shape,
          accession: data.uniprot.uniprot_canonical_ac,
          type:
            "(" +
            mutagenesis.sequence_org +
            " → " +
            mutagenesis.sequence_mut +
            ")",
          title:
            "(" +
            mutagenesis.sequence_org +
            " → " +
            mutagenesis.sequence_mut +
            ")",
          tooltipContent:
            "<span className=marker> annotation " +
            mutagenesis.annotation +
            "</span>"
        });
      } //);
    }

    if (data.site_annotation) {
      for (let site_annotation of data.site_annotation) {
        // $.each(data.site_annotation, function (i, site_annotation) {
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
            "</span>"
        });
      } //);
    }

    // tO CHECK MULTILE GLYCOSYLATION AT SAME POINT
    let glycosCombined = [];

    for (let i in glycos) {
      // $.each(glycos, function (i, v) {
      var combinedResiduesMap = {};
      for (let v of glycos[i].residues) {
        // $.each(glycos[i].residues, function (i, v) {
        if (!combinedResiduesMap[v.start + ":" + v.end]) {
          v["count"] = 1;
          combinedResiduesMap[v.start + ":" + v.end] = v;
        } else {
          combinedResiduesMap[v.start + ":" + v.end].count += 1;
        }
      } //);
      glycosCombined.push(
        Object.values(combinedResiduesMap).map(function(v) {
          v["tooltipContent"] +=
            v["count"] > 1
              ? "<span className=marker>Click marker to show " +
                (v["count"] - 1) +
                " more at this site</span>"
              : "";
          return v;
        })
      );
    }

    return {
      nGlycanWithImage: glycosCombined[0],
      nGlycanWithoutImage: glycosCombined[1],
      oGlycanWithImage: glycosCombined[2],
      oGlycanWithoutImage: glycosCombined[3],
      nSequon: glycosCombined[4],
      mutationsData: mutations,
      mutagenesisData: mutagenesisS
    };
  }

  const [expanded, setExpanded] = useState(false);
  const [highlighted, setHighlighted] = useState(null);

  const nGlycanWithImage = useRef(null);
  const nGlycanWithoutImage = useRef(null);
  const oGlycanWithImage = useRef(null);
  const oGlycanWithoutImage = useRef(null);
  const nSequon = useRef(null);
  const mutationsData = useRef(null);
  const mutagenesisData = useRef(null);
  const allTrack = useRef(null);

  const [tracksShown, setTracksShown] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState
    }),
    {
      mutation: true
    }
  );

  const addTooltipToReference = ref => {
    let currentTooltip;
    ref.current &&
      ref.current.addEventListener("change", event => {
        const { eventtype, feature, coords } = event.detail;

        if (eventtype === "click") {
          const route =
            routeConstants.siteview + id + "/" + event.detail.feature.start;
          history.push(route);
        }
        if (eventtype === "mouseover") {
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
        } else if (eventtype === "mouseout") {
          if (currentTooltip) {
            document.body.removeChild(currentTooltip);
            currentTooltip = null;
          }
        }
      });
  };

  useEffect(() => {
    setPageLoading(true);
    logActivity("user", id);
    const getData = getProteinDetail(id, Protvistadisplay);
    getData.then(({ data }) => {
      if (data.code) {
        let message = "Protvista Detail api call";
        logActivity("user", id, "No results. " + message);
        setPageLoading(false);
      } else {
        setData(data);
        setPageLoading(false);
        let formattedData = setupProtvista(data);
        if (nGlycanWithImage.current) {
          nGlycanWithImage.current.data = formattedData.nGlycanWithImage;
        }
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
            ...formattedData.nSequon
          ];
        }
        if (mutationsData.current) {
          mutationsData.current.data = formattedData.mutationsData.residues;

          setTracksShown({
            mutation: formattedData.mutationsData.residues.length > 0
          });
        }
        if (mutagenesisData.current) {
          mutagenesisData.current.data = formattedData.mutagenesisData.residues;

          setTracksShown({
            mutagenesisData: formattedData.mutagenesisData.residues.length > 0
          });
        }

        addTooltipToReference(allTrack);
        addTooltipToReference(nGlycanWithImage);
        addTooltipToReference(nGlycanWithoutImage);
        addTooltipToReference(oGlycanWithImage);
        addTooltipToReference(oGlycanWithoutImage);
        addTooltipToReference(nSequon);
        addTooltipToReference(mutationsData);
        addTooltipToReference(mutagenesisData);
      }
    });

    getData.catch(({ response }) => {
      let message = "ProtVista Detail api call";
      axiosError(response, id, message, setPageLoading, setAlertDialogInput);
    });
    // eslint-disable-next-line
  }, []);

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
                  ProtVista View of Protein{" "}
                  <strong className="nowrap">{id}</strong>
                </span>
              </h2>
            </div>
          </Grid>
        </Row>
      </div>
      <Helmet>
        {getTitle("protvista", {
          uniprot_canonical_ac: id
        })}
        {getMeta("protvista")}
      </Helmet>
      <FeedbackWidget />
      <PageLoader pageLoading={pageLoading} />
      <DialogAlert
        alertInput={alertDialogInput}
        setOpen={input => {
          setAlertDialogInput({ show: input });
        }}
      />
      <div className="gg-protvista-container">
        <div className="text-right">
          <NavLink to={`${routeConstants.proteinDetail}${id}`}>
            <Button
              type="button"
              // style={{ marginLeft: "15px", marginTop: "15px" }}
              className="gg-btn-blue"
            >
              Back To Protein Details
            </Button>
          </NavLink>
        </div>
        <Row>
          {/* <> */}
          <Col xs={12} sm={12} xl={2} className="prot-sidebar">
            <ProtvistaSidebar
              tracksShown={tracksShown}
              expanded={expanded}
              handleExpand={() => setExpanded(!expanded)}
            />
          </Col>
          {/* </> */}

          <Col xs={12} sm={12} xl={10} className="prot-body-content">
            {data && data.sequence && data.sequence.length && (
              <protvista-manager
                attributes="length displaystart displayend highlightstart highlightend variantfilters"
                id="manager"
              >
                <protvista-navigation
                  class={`nav-track glycotrack`}
                  length={data.sequence.length}
                  displaystart={1}
                  displayend={data.sequence.length}
                />

                <protvista-sequence
                  id="seq1"
                  class="nav-track"
                  length={data.sequence.length}
                  displaystart={1}
                  displayend={data.sequence.length}
                  sequence={data.sequence.sequence}
                />

                {/* Blank Track */}
                <protvista-track
                  class={
                    `nav-track glycotrack emptytrack` +
                    (expanded ? "" : " hidden")
                  }
                  length={data.sequence.length}
                  displaystart={1}
                  displayend={data.sequence.length}
                  layout="non-overlapping"
                />
                <protvista-track
                  class={
                    `nav-track nav-combinetrack hover-style glycotrack1` +
                    (expanded ? " hidden" : "")
                  }
                  length={data.sequence.length}
                  displaystart={1}
                  displayend={data.sequence.length}
                  layout="non-overlapping"
                  ref={allTrack}
                />

                <protvista-track
                  class={
                    `nav-track glycotrack ` +
                    (expanded ? "" : " hidden") +
                    (highlighted === "Ntrack_withImage" ? " highlight" : "")
                  }
                  length={data.sequence.length}
                  displaystart={1}
                  displayend={data.sequence.length}
                  layout="non-overlapping"
                  ref={nGlycanWithImage}
                />
                <protvista-track
                  class={
                    `nav-track glycotrack ` +
                    (expanded ? "" : " hidden") +
                    (highlighted === "Ntrack_withoutImage" ? " highlight" : "")
                  }
                  length={data.sequence.length}
                  displaystart={1}
                  displayend={data.sequence.length}
                  layout="non-overlapping"
                  ref={nGlycanWithoutImage}
                />
                <protvista-track
                  class={
                    `nav-track glycotrack` +
                    (expanded ? "" : " hidden") +
                    (highlighted === "Otrack_withImage" ? " highlight" : "")
                  }
                  length={data.sequence.length}
                  displaystart={1}
                  displayend={data.sequence.length}
                  layout="non-overlapping"
                  ref={oGlycanWithImage}
                />

                <protvista-track
                  class={
                    `nav-track glycotrack` +
                    (expanded ? "" : " hidden") +
                    (highlighted === "Otrack_withoutImage" ? " highlight" : "")
                  }
                  length={data.sequence.length}
                  displaystart={1}
                  displayend={data.sequence.length}
                  layout="non-overlapping"
                  ref={oGlycanWithoutImage}
                />
                <protvista-track
                  class={
                    `nav-track glycotrack` +
                    (expanded ? "" : " hidden") +
                    (highlighted === "SEQUON" ? " highlight" : "")
                  }
                  length={data.sequence.length}
                  displaystart={1}
                  displayend={data.sequence.length}
                  layout="non-overlapping"
                  ref={nSequon}
                />

                {/* {tracksShown.mutation && ( */}
                <protvista-track
                  class={
                    `nav-track glycotrack` +
                    (highlighted === "mutation" ? " highlight" : "")
                  }
                  length={data.sequence.length}
                  displaystart={1}
                  displayend={data.sequence.length}
                  layout="non-overlapping"
                  ref={mutationsData}
                />
                {/* )} */}

                <protvista-track
                  class={
                    `nav-track glycotrack` +
                    (highlighted === "mutegenesis" ? " highlight" : "")
                  }
                  length={data.sequence.length}
                  displaystart={1}
                  displayend={data.sequence.length}
                  layout="non-overlapping"
                  ref={mutagenesisData}
                />
                {/* )} */}
              </protvista-manager>
            )}
          </Col>
        </Row>
        <div className="icons-content">
          <Row>
            <Col sm={3} md={3}>
              <ol className="legendlists nowrap">
                <li>
                  <span
                    className="super1 hover"
                    onMouseEnter={() => setHighlighted("Ntrack_withImage")}
                  >
                    &#9679;
                    <span className="superx">
                      <>N-Glycan</>
                    </span>
                  </span>
                </li>
                <li>
                  <span
                    className="super2 hover"
                    onMouseEnter={() => setHighlighted("Ntrack_withoutImage")}
                  >
                    &#9650;
                    <span className="superx">
                      <>N-Glycan-Site</>
                    </span>
                  </span>
                </li>
                <li>
                  <span
                    className="super3 hover"
                    onMouseEnter={() => setHighlighted("Otrack_withImage")}
                  >
                    &#9679;
                    <span className="superx">
                      <>O-Glycan</>
                    </span>
                  </span>
                </li>
                <li>
                  <span
                    className="super4 hover"
                    onMouseEnter={() => setHighlighted("Otrack_withoutImage")}
                  >
                    &#9650;
                    <span className="superx">
                      <>O-Glycan-Site</>
                    </span>
                  </span>
                </li>
                <li>
                  <span
                    className="super6 hover"
                    onMouseEnter={() => setHighlighted("SEQUON")}
                  >
                    &#9646;
                    <span className="superx">
                      <>N-Glycan-Sequon</>
                    </span>
                  </span>
                </li>
                {/* {tracksShown && tracksShown.snv && ( */}
                <li>
                  <span
                    className="super5 hover"
                    onMouseEnter={() => setHighlighted("mutation")}
                  >
                    &#9670;
                    <span className="superx">
                      <>Single Nucleotide Variation</>
                    </span>
                  </span>
                </li>
                {/* )} */}

                <li>
                  <span
                    className="super7 hover"
                    onMouseEnter={() => setHighlighted("mutagenesis")}
                  >
                    &#9646;
                    <span className="superx">
                      <>Mutagenesis</>
                    </span>
                  </span>
                </li>
              </ol>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default ProtVista;
