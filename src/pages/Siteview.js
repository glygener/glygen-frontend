/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useReducer } from "react";
import { getProteinsiteDetail } from "../data/protein";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Sidebar from "../components/navigation/Sidebar";
import ClientPaginatedTable from "../components/ClientPaginatedTable";
import Helmet from "react-helmet";
import Button from "react-bootstrap/Button";
import { getTitle, getMeta } from "../utils/head";
import { Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Alert, AlertTitle } from "@material-ui/lab";
import DownloadButton from "../components/DownloadButton";
import { Tab, Tabs, Container } from "react-bootstrap";
import { groupEvidences, groupOrganismEvidences } from "../data/data-format";
import EvidenceList from "../components/EvidenceList";
import "../css/detail.css";
import "../css/siteview.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import DetailTooltips from "../data/json/detailTooltips.json";
import HelpTooltip from "../components/tooltip/HelpTooltip";
import FeedbackWidget from "../components/FeedbackWidget";
import routeConstants from "../data/json/routeConstants";
import stringConstants from "../data/json/stringConstants";
import { getGlycanImageUrl } from "../data/glycan";
import LineTooltip from "../components/tooltip/LineTooltip";

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

const proteinStrings = stringConstants.protein.common;
const glycanStrings = stringConstants.glycan.common;

const items = [
  { label: stringConstants.sidebar.general.displayname, id: "General" },
  { label: stringConstants.sidebar.sequence.displayname, id: "Sequence" },
  {
    label: stringConstants.sidebar.site_annotation.displayname,
    id: "Site-Annotation"
  }
];

const sortByPosition = function(a, b) {
  if (parseInt(a.position) < parseInt(b.position)) {
    return -1;
  } else if (parseInt(b.position) < parseInt(a.position)) {
    return 1;
  }
  return 0;
};

const sortByStartPos = function(a, b) {
  if (a.start_pos < b.start_pos) {
    return -1;
  } else if (b.start_pos < a.start_pos) {
    return 1;
  }
  return 0;
};

const SequenceLocationViewer = ({
  sequence,
  annotations,
  position,
  onSelectPosition
}) => {
  var taperlength = 3;
  var taperDelta = 9;
  var translateDelta = 7;
  var centerSize = 54;
  var translateCenter = -22;

  const [filteredAnnotations, setFilteredAnnotations] = useState([]);
  const [styledSequence, setStyledSequence] = useState([]);
  const [currentAnnotationIndex, setCurrentAnnotationIndex] = useState();

  const getHighlightClassname = (reducedAnnotations, position) => {
    const match = reducedAnnotations.find(
      annotation => parseInt(annotation.position) === parseInt(position)
    );

    if (match) {
      if (match.type === "N") {
        return "highlightN";
      } else if (match.type === "O") {
        return "highlightO";
      } else if (match.type === "M") {
        return "highlightMutate";
      } else if (match.type === "G") {
        return "highlightGlycation";
      }
    }
    return "";
  };

  useEffect(() => {
    const reducedAnnotations = annotations.reduce((all, current) => {
      const result = [...all];
      const atPosition = all.find(x => x.position === current.position);

      if (!atPosition) {
        const item = { ...current, allTypes: [current.typeAnnotate] };
        result.push(item);
      } else if (!atPosition.allTypes.includes(current.typeAnnotate)) {
        atPosition.allTypes.push(current.typeAnnotate);
      }

      return result;
    }, []);
    reducedAnnotations.sort(sortByPosition);
    setFilteredAnnotations(reducedAnnotations);

    const current = reducedAnnotations.find(
      x => parseInt(x.position, 10) === parseInt(position, 10)
      //x => x.position === parseInt(position, 10)
    );

    setCurrentAnnotationIndex(reducedAnnotations.indexOf(current));

    const baseValues = sequence.map((character, index) => {
      const currentPosition = index + 1;
      return {
        index,
        character,
        highlight: getHighlightClassname(reducedAnnotations, currentPosition),
        size: null,
        offset: null
      };
    });

    if (baseValues && baseValues.length) {
      for (var i = 1; i <= taperlength; i++) {
        const element = baseValues[position - 1 - i];
        if (element) {
          element.size = centerSize - i * taperDelta;
          element.offset = translateCenter + i * translateDelta;
        }
      }
      for (var i = 1; i <= taperlength; i++) {
        const element = baseValues[position - 1 + i];
        if (element) {
          element.size = centerSize - i * taperDelta;
          element.offset = translateCenter + i * translateDelta;
        }
      }

      const x = baseValues[position - 1];
      x.size = centerSize;
      x.offset = translateCenter;
      x.current = true;

      setTimeout(() => {
        const zoom = document.querySelector(".zoom-sequence");
        const currentElement = document.querySelector(".char-current");
        const offset =
          currentElement.offsetLeft - (zoom.offsetWidth - 100) / 2 - 50;
        zoom.scrollLeft = offset;
      }, 100);
    }

    setStyledSequence(baseValues);
  }, [sequence, annotations, position]);

  const selectPrevious = () => {
    if (currentAnnotationIndex > 0) {
      onSelectPosition(
        filteredAnnotations[currentAnnotationIndex - 1].position
      );
    }
  };

  const selectNext = () => {
    if (currentAnnotationIndex < filteredAnnotations.length - 1) {
      onSelectPosition(
        filteredAnnotations[currentAnnotationIndex + 1].position
      );
    }
  };

  return (
    <>
      <Row>
        <Grid item xs={8} sm={4}></Grid>
        <Grid item xs={6} sm={4}>
          <select
            value={position}
            onChange={event => onSelectPosition(event.target.value)}
          >
            {filteredAnnotations.sort(sortByPosition).map(annotation => (
              <option key={annotation.key} value={annotation.position}>
                {annotation.key}: {annotation.allTypes.join(", ")}
              </option>
            ))}
          </select>
        </Grid>
      </Row>
      <Row className="sequenceDisplay">
        <Grid item>
          <button onClick={selectPrevious}>{"<<"}</button>
        </Grid>
        <Grid item xs={10} sm={10} className="sequence-scroll">
          <>
            {/* <pre>{JSON.stringify(reducedAnnotations, null, 2)}</pre> */}

            <Grid className="zoom">
              <div className="zoom-sequence">
                {styledSequence.map(item => (
                  <span
                    key={item.index}
                    style={{
                      fontSize: item.size ? `${item.size}px` : "inherit",
                      transform: item.offset
                        ? `translateY(${item.offset}px)`
                        : "none"
                    }}
                    className={`${item.highlight}${
                      item.current ? " char-current" : ""
                    }`}
                  >
                    {item.character}
                  </span>
                ))}
              </div>
            </Grid>

            {/* <pre>{JSON.stringify(styledSequence, null, 2)}</pre> */}
          </>
        </Grid>
        <Grid item>
          <button onClick={selectNext}>{">>"}</button>
        </Grid>
      </Row>
    </>
  );
};

const Siteview = ({ position }) => {
  let { id } = useParams();

  const [detailData, setDetailData] = useState({});
  const [annotations, setAnnotations] = useState([]);
  const [allAnnotations, setAllAnnotations] = useState([]);
  const [sequence, setSequence] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(position);
  const [positionData, setPositionData] = useState([]);
  const [nonExistent, setNonExistent] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  useEffect(() => {
    logActivity("user", id);
    const getProteinsiteDetailData = getProteinsiteDetail(id, selectedPosition);
    getProteinsiteDetailData.then(({ data }) => {
      if (data.code) {
        let message = "Detail api call";
        logActivity("user", id, "No results. " + message);
        setPageLoading(false);
      } else {
        setDetailData(data);
        setPageLoading(false);
      }
    });

    getProteinsiteDetailData.catch(({ response }) => {
      if (
        response.data &&
        response.data.error_list &&
        response.data.error_list.length &&
        response.data.error_list[0].error_code &&
        response.data.error_list[0].error_code === "non-existent-record"
      ) {
        setNonExistent({
          error_code: response.data.error_list[0].error_code,
          history: response.data.history
        });
      } else {
        let message = "Site Detail api call";
        axiosError(response, id, message, setPageLoading, setAlertDialogInput);
      }
    });
  }, [selectedPosition]);

  useEffect(() => {
    let dataAnnotations = [];
    /**
     *  The map() method calls the provided function once for each element in a glycosylation array, in order.
     *  and sorting with respect to position
     */
    if (detailData.glycosylation) {
      dataAnnotations = [
        ...dataAnnotations,
        ...detailData.glycosylation.sort(sortByStartPos).map(glycosylation => ({
          position: detailData.start_pos,
          type: glycosylation.type.split("-")[0],
          label: glycosylation.residue + "Glycosylation",
          glytoucan_ac: glycosylation.glytoucan_ac,
          evidence: glycosylation.evidence,
          residue: glycosylation.residue,
          typeAnnotate: glycosylation.type.split("-")[0] + "-" + "Glycosylation"
        }))
      ];
    }

    /**
     *  The map() method calls the provided function once for each element in a detailData.site_annotation array, in order.
     *  and sorting with respect to start_pos
     */
    if (detailData.site_annotation) {
      dataAnnotations = [
        ...dataAnnotations,
        ...detailData.site_annotation
          .sort(sortByStartPos)
          .map(site_annotation => ({
            position: detailData.start_pos,
            type: site_annotation.annotation.split("-")[0].toUpperCase(),
            typeAnnotate: "Sequon",
            residue: site_annotation.residue
          }))
      ];
    }

    /**
     *  The map() method calls the provided function once for each element in a detailData.mutation array, in order.
     *  and sorting with respect to start_pos
     */
    if (detailData.snv) {
      dataAnnotations = [
        ...dataAnnotations,
        ...detailData.snv.sort(sortByStartPos).map(snv => ({
          position: detailData.start_pos,
          label: "SNV",
          evidence: snv.evidence,
          residue: snv.residue,
          typeAnnotate: "SNV"
        }))
      ];
    }

    if (detailData.mutagenesis) {
      dataAnnotations = [
        ...dataAnnotations,
        ...detailData.mutagenesis.sort(sortByStartPos).map(mutagenesis => ({
          position: mutagenesis.start_pos,
          label: "Mutagenesis",
          evidence: mutagenesis.evidence,
          typeAnnotate: "Mutagenesis"
        }))
      ];
    }

    const allDataAnnotations = dataAnnotations.map((annotation, index) => ({
      ...annotation,
      key: `${annotation.type}-${annotation.position}`,
      id: `${annotation.type}-${annotation.position}-${index}`
    }));

    const pickLabel = type => {
      switch (type) {
        case "snv":
          return "M";
        case "glycosylation":
          return "N";
        // case "mutagenesis":
        //   return "L";
        case "glycation":
          return "G";
        default:
      }
      return "";
    };

    if (detailData.all_sites && detailData.sequence) {
      const getSequenceCharacter = position =>
        detailData.sequence.sequence[position - 1];

      const filteredSites = detailData.all_sites.filter(
        siteType => !["mutagenesis", "site_annotation"].includes(siteType.type)
      );
      const mappedFilterSites = filteredSites.map(siteType =>
        siteType.site_list.map(site => ({
          position: site.start_pos,
          type: pickLabel(siteType.type),
          typeAnnotate: siteType.type,

          key: `${getSequenceCharacter(site.start_pos)}-${site.start_pos}`,
          character: getSequenceCharacter(site.start_pos)
        }))
      );
      const uniquePositions = mappedFilterSites.flat();

      setAnnotations(uniquePositions);

      if (uniquePositions.length && !selectedPosition) {
        setSelectedPosition(uniquePositions[0].position);
      }
    }

    setAllAnnotations(allDataAnnotations);

    if (detailData.sequence) {
      var originalSequence = detailData.sequence.sequence;
      setSequence(originalSequence.split(""));
    }
  }, [detailData]);

  const updateTableData = (annotations, position) => {
    setPositionData(
      annotations.filter(
        annotation => annotation.position === parseInt(position, 10)
      )
    );
  };

  const selectPosition = position => {
    setSelectedPosition(position);
    window.history.pushState(
      null,
      `Selected Position ${position}`,
      `/Siteview/${id}/${position}`
    );
    // window.location = `/Siteview/${id}/${position}`;
  };

  useEffect(() => {
    updateTableData(allAnnotations, selectedPosition);
  }, [allAnnotations, selectedPosition]);

  const annotationColumns = [
    {
      dataField: "typeAnnotate",
      text: proteinStrings.annotation_site.name,
      sort: true,
      style: { whiteSpace: "nowrap" },
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white"
        };
      }
    },
    {
      dataField: "glytoucan_ac",
      text: glycanStrings.glycan_id.name,
      sort: true,
      style: { whiteSpace: "nowrap" },
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white"
        };
      },

      formatter: (value, row) => (
        <LineTooltip text="View glycan details">
          <Link to={routeConstants.glycanDetail + row.glytoucan_ac}>
            {row.glytoucan_ac}
          </Link>
        </LineTooltip>
      )
    },
    {
      dataField: "position",
      text: proteinStrings.position.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "12%"
        };
      },
      formatter: (value, row) =>
        value ? (
          <LineTooltip text="View siteview details">
            <Link to={`${routeConstants.siteview}${id}/${row.position}`}>
              {row.residue}
              {row.position}
            </Link>
          </LineTooltip>
        ) : (
          "Not Reported"
        )
    },
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,

      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "23%"
        };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList
            key={row.position + row.glytoucan_ac}
            evidences={groupEvidences(cell)}
          />
        );
      }
    },
    {
      dataField: "glytoucan_ac",
      text: "Additional Information",
      sort: false,
      selected: true,
      formatter: (value, row) => (
        <div className="img-wrapper">
          {row.glytoucan_ac && (
            <img
              className="img-cartoon"
              src={getGlycanImageUrl(row.glytoucan_ac)}
              alt="Glycan img"
            />
          )}
        </div>
      ),
      headerStyle: (colum, colIndex) => {
        return {
          width: "30%",
          textAlign: "left",
          backgroundColor: "#4B85B6",
          color: "white"
        };
      }
    }
  ];

  const {
    uniprot,
    mass,
    refseq,
    gene,
    gene_name,
    species,
    protein_names
  } = detailData;
  const uniprotNames = (protein_names || [])
    .filter(x => x.type === "recommended")
    .map(x => x.name);

  const organismEvidence = groupOrganismEvidences(species);
  // ==================================== //
  /**
   * Adding toggle collapse arrow icon to card header individualy.
   * @param {object} uniprot_canonical_ac- uniprot accession ID.
   **/
  const [collapsed, setCollapsed] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState
    }),
    {
      general: true,
      annotation: true,
      sequence: true
    }
  );

  function toggleCollapse(name, value) {
    setCollapsed({ [name]: !value });
  }
  const expandIcon = <ExpandMoreIcon fontSize="large" />;
  const closeIcon = <ExpandLessIcon fontSize="large" />;
  // ===================================== //

  if (nonExistent) {
    return (
      <Container className="tab-content-border2">
        <Alert className="erroralert" severity="error">
          {nonExistent.history && nonExistent.history.length ? (
            <>
              <AlertTitle>
                This Protein <b>{id} </b>Record is Nonexistent
              </AlertTitle>
              <ul>
                {nonExistent.history.map(item => (
                  <span className="recordInfo">
                    <li>{item.description}</li>
                  </span>
                ))}
              </ul>
            </>
          ) : (
            <>
              <AlertTitle>
                This Protein <b>{id} </b> Record is not valid
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
                        Siteview for Protein
                        <strong className="nowrap">
                          {uniprot && uniprot.uniprot_canonical_ac && (
                            <> {uniprot.uniprot_canonical_ac}</>
                          )}
                        </strong>
                      </span>
                    </h2>
                  </div>
                </Grid>
              </Row>
            </div>
            {position.history && position.history.length > 1 && (
              <div className="text-right gg-download-btn-width pb-3">
                <Button
                  type="button"
                  className="gg-btn-blue"
                  onClick={() => {
                    position.history.goBack();
                  }}
                >
                  Back
                </Button>
              </div>
            )}
            <div className="gg-download-btn-width">
              <DownloadButton
                types={[
                  {
                    display:
                      stringConstants.download.proteinsite_jsondata.displayname,
                    type: "json",
                    data: "site_detail"
                  }
                ]}
                dataType="site_detail"
                dataId={`${id}.${position}.${position}`}
              />
            </div>

            <React.Fragment>
              <Helmet>
                {getTitle("siteView", {
                  uniprot_canonical_ac:
                    uniprot && uniprot.uniprot_canonical_ac
                      ? uniprot.uniprot_canonical_ac
                      : ""
                })}
                {getMeta("siteView")}
              </Helmet>
              <FeedbackWidget />
              {/* <PageLoader pageLoading={pageLoading} /> */}
              <DialogAlert
                alertInput={alertDialogInput}
                setOpen={input => {
                  setAlertDialogInput({ show: input });
                }}
              />
              {/* Button */}
              <div className="text-right gg-download-btn-width">
                <Link to={`${routeConstants.proteinDetail}${id}`}>
                  <Button type="button" className="gg-btn-blue">
                    Back To Protein Details
                  </Button>
                </Link>
              </div>
              {/* general */}
              <Accordion
                id="General"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.protein.general.title}
                        text={DetailTooltips.protein.general.text}
                        urlText={DetailTooltips.protein.general.urlText}
                        url={DetailTooltips.protein.general.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.general.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() =>
                          toggleCollapse("general", collapsed.general)
                        }
                        className="gg-green arrow-btn"
                      >
                        <span>
                          {collapsed.general ? closeIcon : expandIcon}
                        </span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <div
                        style={{
                          marginBottom: "5px"
                        }}
                      >
                        {gene && (
                          <>
                            {gene.map((genes, genesname) => (
                              <span key={genesname}>
                                <div>
                                  <strong>
                                    {proteinStrings.gene_name.name}:
                                  </strong>{" "}
                                  <a
                                    href={genes.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {genes.name}
                                  </a>
                                </div>

                                {gene.locus && (
                                  <div>
                                    <strong>
                                      {proteinStrings.gene_location.name}:
                                    </strong>{" "}
                                    {proteinStrings.chromosome.name}: {""}
                                    {genes.locus
                                      ? genes.locus.chromosome
                                      : "NA"}{" "}
                                    {""}(
                                    {genes.locus
                                      ? addCommas(genes.locus.start_pos)
                                      : "NA"}{" "}
                                    -{" "}
                                    {genes.locus
                                      ? addCommas(genes.locus.end_pos)
                                      : "NA"}
                                    )
                                  </div>
                                )}

                                <EvidenceList
                                  evidences={groupEvidences(
                                    genes.locus ? genes.locus.evidence : []
                                  )}
                                />
                              </span>
                            ))}
                          </>
                        )}
                        {!gene && (
                          <p className="no-data-msg-publication">
                            No data available.
                          </p>
                        )}
                      </div>

                      {uniprot && uniprot.uniprot_canonical_ac && (
                        <>
                          <div>
                            <strong>{proteinStrings.uniprot_id.name}: </strong>
                            <a
                              href={uniprot.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {uniprot.uniprot_id}{" "}
                            </a>
                          </div>
                          <div>
                            <strong>
                              {proteinStrings.uniprot_accession.name}:{" "}
                            </strong>
                            <a
                              href={uniprot.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {uniprot.uniprot_canonical_ac}
                            </a>
                          </div>
                          <div>
                            <strong>
                              {proteinStrings.sequence_length.name}:{" "}
                            </strong>
                            <a
                              href={`https://www.uniprot.org/uniprot/${uniprot.uniprot_canonical_ac}/#sequences`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {uniprot.length}
                            </a>
                          </div>
                          <div>
                            <strong>
                              {proteinStrings.recommendedname.name}:{" "}
                            </strong>{" "}
                            {/* {proteinStrings.protein_names_uniprotkb.shortName} */}
                            {uniprotNames}
                          </div>
                          <div>
                            <strong>
                              {proteinStrings.chemical_mass.name}:{" "}
                            </strong>
                            {addCommas(mass.chemical_mass)} Da
                          </div>

                          {refseq && (
                            <div>
                              <>
                                <strong>
                                  {proteinStrings.refseq_ac.name}:{" "}
                                </strong>{" "}
                                <a
                                  href={refseq.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {" "}
                                  {refseq.ac}{" "}
                                </a>{" "}
                                <div>
                                  {" "}
                                  <strong>
                                    {proteinStrings.refSeq_name.name}:{" "}
                                  </strong>{" "}
                                  {refseq.name}{" "}
                                </div>{" "}
                              </>
                            </div>
                          )}
                        </>
                      )}
                      <div>
                        {organismEvidence &&
                          // For every organism object
                          Object.keys(organismEvidence).map(orgEvi => (
                            // For every database for current organism object
                            <div>
                              <>
                                <strong>
                                  {proteinStrings.organism.name}:{" "}
                                </strong>
                                {orgEvi} {"("}
                                <span className="text-capitalize">
                                  {organismEvidence[orgEvi].common_name}
                                </span>
                                {")"} {"["}
                                {/* <LineTooltip text="View details on NCBI"> */}
                                <a
                                  href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${organismEvidence[orgEvi].taxid}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {organismEvidence[orgEvi].taxid}
                                </a>
                                {/* </LineTooltip> */}
                                {"]"}
                                <EvidenceList
                                  evidences={organismEvidence[orgEvi].evidence}
                                />
                              </>
                            </div>
                          ))}
                        {/* {!species && (
													<p className="no-data-msg">No data available.</p>
												)} */}
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Sequence */}
              <Accordion
                id="Sequence"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.protein.sequence.title}
                        text={DetailTooltips.protein.sequence.text}
                        urlText={DetailTooltips.protein.sequence.urlText}
                        url={DetailTooltips.protein.sequence.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.sequence.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() =>
                          toggleCollapse("sequence", collapsed.sequence)
                        }
                        className="gg-green arrow-btn"
                      >
                        <span>
                          {collapsed.sequence ? closeIcon : expandIcon}
                        </span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <Row>
                        <Col align="left">
                          <SequenceLocationViewer
                            sequence={sequence}
                            annotations={annotations}
                            position={selectedPosition}
                            onSelectPosition={selectPosition}
                          />

                          {/* <pre>{JSON.stringify(positionData, null, 2)}</pre> */}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Site-Annotation */}
              <Accordion
                id="Site-Annotation"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.protein.annotation.title}
                        text={DetailTooltips.protein.annotation.text}
                        urlText={DetailTooltips.protein.annotation.urlText}
                        url={DetailTooltips.protein.annotation.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.site_annotation.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() =>
                          toggleCollapse("annotation", collapsed.annotation)
                        }
                        className="gg-green arrow-btn"
                      >
                        <span>
                          {collapsed.annotation ? closeIcon : expandIcon}
                        </span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {positionData && positionData.length !== 0 && (
                        <ClientPaginatedTable
                          data={positionData}
                          columns={annotationColumns}
                        />
                      )}
                      {!positionData && <p>No data available.</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Button */}
              <div className="text-right gg-download-btn-width">
                <Link to={`${routeConstants.proteinDetail}${id}`}>
                  <Button type="button" className="gg-btn-blue">
                    Back To Protein Details
                  </Button>
                </Link>
              </div>
            </React.Fragment>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Siteview;
