/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useReducer } from "react";
import { getProteinsiteDetail } from "../data/protein";
// import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Sidebar from "../components/navigation/Sidebar";
import ClientPaginatedTable from "../components/ClientPaginatedTable";
import ClientServerPaginatedTable from "../components/ClientServerPaginatedTable";
import Helmet from "react-helmet";
import Button from "react-bootstrap/Button";
import { getTitle, getMeta } from "../utils/head";
import { Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Alert, AlertTitle } from "@mui/material";
import DownloadButton from "../components/DownloadButton";
import { Container } from "react-bootstrap";
import { groupEvidences, groupOrganismEvidences } from "../data/data-format";
import EvidenceList from "../components/EvidenceList";
import "../css/detail.css";
import "../css/siteview.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { logActivity } from "../data/logging";
// import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import DetailTooltips from "../data/json/siteDetailTooltips.json";
import HelpTooltip from "../components/tooltip/HelpTooltip";
import FeedbackWidget from "../components/FeedbackWidget";
import PageLoader from "../components/load/PageLoader";
import routeConstants from "../data/json/routeConstants";
import stringConstants from "../data/json/stringConstants";
import { getGlycanImageUrl } from "../data/glycan";
import LineTooltip from "../components/tooltip/LineTooltip";
import CollapsibleText from "../components/CollapsibleText";
import FormControl from "@mui/material/FormControl";
import CardToggle from "../components/cards/CardToggle";

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
    label: stringConstants.sidebar.glycosylation.displayname,
    id: "Glycosylation",
  },
  {
    label: stringConstants.sidebar.phosphorylation.displayname,
    id: "Phosphorylation",
  },
  {
    label: stringConstants.sidebar.glycation.displayname,
    id: "Glycation",
  },
  {
    label: stringConstants.sidebar.snv.displayname,
    id: "Single-Nucleotide-Variation",
  },
  { 
    label: stringConstants.sidebar.mutagenesis.displayname, 
    id: "Mutagenesis" 
  },
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
      } else if (match.type === "L") {
        return "highlightMutagenesis ";
      } else if (match.type === "G") {
        return "highlightGlycation";
      } else if (match.type === "P") {
        return "highlightPhosphorylation";
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
  // React Hook useEffect has missing dependencies: 'centerSize', 'taperDelta', 'taperlength', 'translateCenter', and 'translateDelta'. Either include them or remove the dependency array
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
      <Row className="sequenceDisplay">
        <Col xs={6} sm={6}>
          <FormControl fullWidth>
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
          </FormControl>
        </Col>
      </Row>
      <Row className="sequenceDisplay ms-1 me-1">
        <Col className="text-center">
          <button onClick={selectPrevious}>{"<<"}</button>
        </Col>
        <Col xs={10} sm={10} className="sequence-scroll">
          <>
            <Col className="zoom">
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
            </Col>
          </>
        </Col>
        <Col className="text-center">
          <button onClick={selectNext}>{">>"}</button>
        </Col>
      </Row>
    </>
  );
};

const Siteview = props => {
  let { id, position } = useParams();

  const [detailData, setDetailData] = useState({});
  const [annotations, setAnnotations] = useState([]);
  const [sequence, setSequence] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(position);
  const [nonExistent, setNonExistent] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [dataStatus, setDataStatus] = useState("Fetching Data.");
  const [sideBarData, setSidebarData] = useState(items);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const navigate = useNavigate();

  useEffect(() => {
    logActivity("user", id);
    setPageLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    const getProteinsiteDetailData = getProteinsiteDetail(id, selectedPosition);
    getProteinsiteDetailData.then(({ data }) => {
      if (data.code) {
        let message = "Detail api call";
        logActivity("user", id, "No results. " + message);
        setPageLoading(false);
        setDataStatus("No data available.");
      } else {
        setDetailData(data);
        setPageLoading(false);
        setDataStatus("No data available.");
        let newSidebarData = items;
        if (!data.uniprot_canonical_ac || data.uniprot_canonical_ac.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "General", true);
        }
        if (!data.sequence || data.sequence.sequence.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Sequence", true);
        }
        if (!data.glycosylation || data.glycosylation.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Glycosylation", true);
        }
        if (!data.phosphorylation || data.phosphorylation.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Phosphorylation", true);
        }
        if (!data.glycation || data.glycation.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Glycation", true);
        }
        if (!data.snv || data.snv.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Single-Nucleotide-Variation", true);
        }
        if (!data.mutagenesis || data.mutagenesis.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Mutagenesis", true);
        }
        setSidebarData(newSidebarData);
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
        setDataStatus("No data available.");
      }
    });
  }, [id, selectedPosition]);

  useEffect(() => {
    if (detailData.glycosylation) {
      detailData.glycosylation = detailData.glycosylation.map(glycosylation => ({
          ...glycosylation,
          position: detailData.start_pos,
        }))
    }

    if (detailData.snv) {
      detailData.snv = detailData.snv.map(snv => ({
          ...snv,
          position: detailData.start_pos,
        }))
    }

    if (detailData.mutagenesis) {
      detailData.mutagenesis = detailData.mutagenesis.map(mutagenesis => ({
          ...mutagenesis,
          position: detailData.start_pos,
        }))
    }

    if (detailData.phosphorylation) {
      detailData.phosphorylation = detailData.phosphorylation.map(phosphorylation => ({
          ...phosphorylation,
          position: detailData.start_pos,
        }))
    }

    if (detailData.glycation) {
      detailData.glycation = detailData.glycation.map(glycation => ({
          ...glycation,
          position: detailData.start_pos,
        }))
    }

    const pickLabel = type => {
      switch (type) {
        case "snv":
          return "M";
        case "glycosylation":
          return "N";
        case "mutagenesis":
          return "L";
        case "glycation":
          return "G";
        case "phosphorylation":
          return "P";
        default:
      }
      return "";
    };

    if (detailData.all_sites && detailData.sequence) {
      const getSequenceCharacter = position =>
        detailData.sequence.sequence[position - 1];

      const filteredSites = detailData.all_sites.filter(
        siteType => !["site_annotation"].includes(siteType.type)
      );
      const filteredRangeSites = filteredSites.map(
        siteType => {return {"type" : siteType.type, "site_list" : siteType.site_list.filter(site => site.start_pos === site.end_pos)}}
      );
      const mappedFilterSites = filteredRangeSites.map(siteType =>
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

    if (detailData.sequence) {
      var originalSequence = detailData.sequence.sequence;
      setSequence(originalSequence.split(""));
    }
  }, [selectedPosition, detailData]);

  const selectPosition = position => {
    setSelectedPosition(position);
    window.history.pushState(
      null,
      `Selected Position ${position}`,
      `/Siteview/${id}/${position}`
    );
    // window.location = `/Siteview/${id}/${position}`;
  };

  const glycoSylationColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,

      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "25%",
        };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList key={row.start_pos + row.glytoucan_ac} evidences={groupEvidences(cell)} />
        );
      },
    },
    {
      dataField: "type",
      text: proteinStrings.type.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
        };
      },
    },
    {
      dataField: "glytoucan_ac",
      text: proteinStrings.glytoucan_ac.shortName,
      defaultSortField: "glytoucan_ac",
      sort: true,
      headerStyle: (column, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "15%",
        };
      },
      formatter: (value, row) => (
        <LineTooltip text="View glycan details">
          <Link to={routeConstants.glycanDetail + row.glytoucan_ac}>{row.glytoucan_ac}</Link>
        </LineTooltip>
      ),
      //testing
    },
    {
      dataField: "image",
      text: glycanStrings.glycan_image.name,
      sort: false,
      formatter: (value, row) => row.glytoucan_ac ? (
        <div className="img-wrapper">
          <img className="img-cartoon" src={getGlycanImageUrl(row.glytoucan_ac)} alt="Glycan img" />
        </div>) : ( <></>
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
      dataField: "position",
      text: proteinStrings.residue.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
        };
      },
      formatter: (value, row) =>
        value ? (
          <span>
              {row.residue}
              {row.position}
          </span>
        ) : (
          "Not Reported"
        ),
    },
    {
      dataField: "comment",
      text: "Note",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          width: "20%",
        };
      },
      formatter: (value, row) => <CollapsibleText text={row.comment} lines={2} />,
    },
  ];

  const phosphorylationColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      headerStyle: (colum, colIndex) => {
        return {
          // width: "15%",
        };
      },
      formatter: (cell, row) => {
        return <EvidenceList evidences={groupEvidences(cell)} />;
      },
    },
    {
      dataField: "kinase_uniprot_canonical_ac",
      text: proteinStrings.kinase_protein.name,
      sort: true,
      formatter: (value, row) =>
        value ? (
          <LineTooltip text="View protein details">
            <Link to={routeConstants.proteinDetail + row.kinase_uniprot_canonical_ac}>
              {row.kinase_uniprot_canonical_ac}
            </Link>
          </LineTooltip>
        ) : (
          "No data available"
        ),
    },
    {
      dataField: "kinase_gene_name",
      text: proteinStrings.kinase_gene_name.name,
      sort: true,
      formatter: (value, row) => (value ? <>{row.kinase_gene_name}</> : "No data available"),
    },
    {
      dataField: "position",
      text: proteinStrings.residue.name,
      sort: true,
      formatter: (value, row) =>
        value ? (
          <span>
              {row.residue}
              {row.position}
          </span>
        ) : (
          "Not Reported"
        ),
    },
    {
      dataField: "comment",
      text: "Note",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          width: "20%",
        };
      },
      formatter: (value, row) => <CollapsibleText text={row.comment} lines={2} />,
    },
  ];

  const glycationColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      headerStyle: (colum, colIndex) => {
        return {
          // width: "15%",
        };
      },
      formatter: (cell, row) => {
        return <EvidenceList evidences={groupEvidences(cell)} />;
      },
    },
    {
      dataField: "type",
      text: proteinStrings.type.name,
      sort: true,
      formatter: (value, row) => (value ? <>{row.type}</> : "No data available"),
    },
    {
      dataField: "relation",
      text: proteinStrings.relation.name,
      sort: true,
      formatter: (value, row) => (value ? <>{row.relation}</> : "No data available"),
    },
    {
      dataField: "position",
      text: proteinStrings.residue.name,
      sort: true,
      formatter: (value, row) =>
        value ? (
          <span>
              {row.residue}
              {row.position}
          </span>
        ) : (
          "Not Reported"
        ),
    },
    {
      dataField: "comment",
      text: "Note",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          width: "20%",
        };
      },
      formatter: (value, row) => <CollapsibleText text={row.comment} lines={2} />,
    },
  ];

  const mutationColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,

      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "20%",
        };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList key={`ev_${row.ref_nt}_${row.chr_pos}`} evidences={groupEvidences(cell)} />
        );
      },
    },
    {
      dataField: "comment",
      text: "Filter Annotations",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          width: "20%",
        };
      },
      formatter: (value, row) => <CollapsibleText text={row.comment} lines={2} />,
    },

    {
      dataField: "chr_id",
      text: "Genomic Locus",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "20%",
        };
      },
      formatter: (value, row) => (
        <>
          Chr{row.chr_id}:{row.chr_pos}
        </>
      ),
    },
    {
      dataField: "position",
      text: proteinStrings.position.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
        };
      },
      formatter: (value, row) =>
      value ? (
        <span>
            {row.position}
        </span>
      ) : (
        "Not Reported"
      ),
    },
    {
      dataField: "sequence",
      text: stringConstants.sidebar.sequence.displayname,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
        };
      },
      formatter: (value, row) => (
        <>
          {row.sequence_org} → {row.sequence_mut}
        </>
      ),
    },
    {
      dataField: "disease",
      text: stringConstants.sidebar.disease.displayname,
      style: { whiteSpace: "nowrap" },
      headerStyle: (column, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "25%",
        };
      },
      formatter: (value, row) => (
        <>
          {value && value.map((disease, index) => (
            <ul key={index} className="pl-3">
              <li key={disease.recommended_name.id}>
                {disease.recommended_name.name}{" "}
                <span className="nowrap">
                  (<a href={disease.recommended_name.url}>{disease.recommended_name.id}</a>){" "}
                </span>
              </li>
            </ul>
          ))}
        </>
      ),
    },
    {
      dataField: "minor_allelic_frequency",
      text: "MAF",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
        };
      },
    },
  ];

  const mutagenesisColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      headerStyle: (colum, colIndex) => {
        return {
          width: "20%",
        };
      },
      formatter: (cell, row) => {
        return <EvidenceList evidences={groupEvidences(cell)} />;
      },
    },
    {
      dataField: "position",
      text: proteinStrings.position.name,
      sort: true,
      formatter: (value, row) =>
      value ? (
        <span>
            {row.position}
        </span>
      ) : (
        "Not Reported"
      ),
    },
    {
      dataField: "sequence",
      text: stringConstants.sidebar.sequence.displayname,
      sort: true,
      formatter: (value, row) => (
        <>
          {row.sequence_org && <span className="wrapword">{row.sequence_org}</span>}
          {!row.sequence_org && <span> (insertion)</span>}
          {row.sequence_org && row.sequence_mut && <> → </>}
          {row.sequence_mut && <>{row.sequence_mut}</>}
          {!row.sequence_mut && <span> (deletion)</span>}
        </>
      ),
    },
    {
      dataField: "comment",
      text: "Note",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          width: "35%",
        };
      },
      formatter: (value, row) => <CollapsibleText text={row.comment} lines={2} />,
    },
  ];

  const {
    uniprot,
    mass,
    refseq,
    gene,
    gene_name,
    species,
    protein_names,
    glycosylation,
    snv,
    mutagenesis,
    phosphorylation,
    glycation
  } = detailData;

  const setSidebarItemState = (items, itemId, disabledState) => {
    return items.map((item) => {
      return {
        ...item,
        disabled: item.id === itemId ? disabledState : item.disabled,
      };
    });
  };

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
            {/* back button */}
            {window.history && window.history.length > 1 && (
              <div className="text-end gg-download-btn-width pb-3">
                <Link to={`${routeConstants.proteinDetail}${id}`}>
                  <Button type="button" className="gg-btn-blue me-3">
                    To Protein Details
                  </Button>
                </Link>
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
                    display:
                      stringConstants.download.proteinsite_jsondata.displayname,
                    type: "json",
                    data: "site_detail"
                  }
                ]}
                itemType="site_detail"
                dataId={`${id}.${selectedPosition}.${selectedPosition}`}
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
              <PageLoader pageLoading={pageLoading} />
              <DialogAlert
                alertInput={alertDialogInput}
                setOpen={input => {
                  setAlertDialogInput({ show: input });
                }}
              />
              {/* general */}
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
                        title={DetailTooltips.site.general.title}
                        text={DetailTooltips.site.general.text}
                        urlText={DetailTooltips.site.general.urlText}
                        url={DetailTooltips.site.general.url}
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
                            {dataStatus}
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
                            <Link to={`${routeConstants.proteinDetail}${uniprot.uniprot_canonical_ac}`}>
                              {uniprot.uniprot_canonical_ac}
                            </Link>
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
                            <div key={orgEvi}>
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
													<p className="no-data-msg">{dataStatus}</p>
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
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.site.sequence.title}
                        text={DetailTooltips.site.sequence.text}
                        urlText={DetailTooltips.site.sequence.urlText}
                        url={DetailTooltips.site.sequence.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.sequence.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="sequence" toggle={collapsed.sequence} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {sequence && sequence.length !== 0 && (
                        <Row>
                          <Col align="left">
                            <SequenceLocationViewer
                              sequence={sequence}
                              annotations={annotations}
                              position={selectedPosition}
                              onSelectPosition={selectPosition}
                            />
                          </Col>
                        </Row>
                      )}
                      {!sequence && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
                {/*  Glycosylation */}
                <Accordion
                id="Glycosylation"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">

                      <HelpTooltip
                        title={DetailTooltips.site.glycosylation.title}
                        text={DetailTooltips.site.glycosylation.text}
                        urlText={DetailTooltips.site.glycosylation.urlText}
                        url={DetailTooltips.site.glycosylation.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.glycosylation.displayname}
                    </h4>
                    <div className="float-end">

                    <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            {
                              display: "Glycosylation (*.csv)",
                              type: "glycosylation_csv",
                              format: "csv",
                              data: "site_section",
                              section: "glycosylation",
                            }  
                          ]}
                          dataId={id + "." + selectedPosition + "." + selectedPosition}
                          itemType="site_section"
                          showBlueBackground={true}
                          enable={(glycosylation && glycosylation.length > 0)}
                        />
                      </span>

                      <CardToggle cardid="glycosylation" toggle={collapsed.glycosylation} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {glycosylation && glycosylation.length > 0 && (
                          <ClientServerPaginatedTable
                            data={glycosylation}
                            columns={glycoSylationColumns}
                          />
                      )}

                      {(!glycosylation || glycosylation.length === 0) && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Phosphorylation */}
              <Accordion
                id="Phosphorylation"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.site.phosphorylation.title}
                        text={DetailTooltips.site.phosphorylation.text}
                        urlText={DetailTooltips.site.phosphorylation.urlText}
                        url={DetailTooltips.site.phosphorylation.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.phosphorylation.displayname}
                    </h4>
                    <div className="float-end">

                      <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            {
                              display: "Phosphorylation (*.csv)",
                              type: "phosphorylation_csv",
                              format: "csv",
                              data: "site_section",
                              section: "phosphorylation",
                            }  
                          ]}
                          dataId={id + "." + selectedPosition + "." + selectedPosition}
                          itemType="site_section"
                          showBlueBackground={true}
                          enable={(phosphorylation && phosphorylation.length > 0)}
                        />
                      </span>

                      <CardToggle cardid="phosphorylation" toggle={collapsed.phosphorylation} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {phosphorylation && phosphorylation.length !== 0 && (
                        <ClientServerPaginatedTable
                          data={phosphorylation}
                          columns={phosphorylationColumns}
                        />
                      )}
                      {(!phosphorylation || phosphorylation.length === 0) && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Glycation */}
              <Accordion
                id="Glycation"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.site.glycation.title}
                        text={DetailTooltips.site.glycation.text}
                        urlText={DetailTooltips.site.glycation.urlText}
                        url={DetailTooltips.site.glycation.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.glycation.displayname}
                    </h4>
                    <div className="float-end">

                      <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                          {
                              display: "Glycation (*.csv)",
                              type: "glycation_csv",
                              format: "csv",
                              data: "site_section",
                              section: "glycation",
                            }  
                          ]}
                          dataId={id + "." + selectedPosition + "." + selectedPosition}
                          itemType="site_section"
                          showBlueBackground={true}
                          enable={(glycation && glycation.length > 0)}
                        />
                      </span>

                      <CardToggle cardid="glycation" toggle={collapsed.glycation} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {glycation && glycation.length !== 0 && (
                        <ClientServerPaginatedTable
                          data={glycation}
                          columns={glycationColumns}
                        />
                      )}
                      {(!glycation || glycation.length === 0) && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
               {/*  SNV (Single-Nucleotide-Variation)*/}
               <Accordion
                id="Single-Nucleotide-Variation"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.site.snv.title}
                        text={DetailTooltips.site.snv.text}
                        urlText={DetailTooltips.site.snv.urlText}
                        url={DetailTooltips.site.snv.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">{stringConstants.sidebar.snv.displayname}</h4>

                    <div className="float-end">
                      <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            {
                              display: "Single Nucleotide Variation (*.csv)",
                              type: "snv_mutations_csv",
                              format: "csv",
                              data: "site_section",
                              section: "snv_mutations",
                            }
                          ]}
                          dataId={id + "." + selectedPosition + "." + selectedPosition}
                          itemType="site_section"
                          showBlueBackground={true}
                          enable={(snv && snv.length > 0)}
                        />
                      </span>
                      <CardToggle cardid="mutation" toggle={collapsed.mutation} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {snv && snv.length !== 0 && (
                          <ClientServerPaginatedTable
                              data={snv}
                              columns={mutationColumns}
                            />
                      )}

                      {(!snv || snv.length === 0) && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              {/*  Mutagenesis */}
              <Accordion
                id="Mutagenesis"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.site.mutagenesis.title}
                        text={DetailTooltips.site.mutagenesis.text}
                        urlText={DetailTooltips.site.mutagenesis.urlText}
                        url={DetailTooltips.site.mutagenesis.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {" "}
                      {stringConstants.sidebar.mutagenesis.displayname}
                    </h4>
                    <div className="float-end">

                      <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            {
                              display: "Mutagenesis (*.csv)",
                              type: "mutagenesis_csv",
                              format: "csv",
                              data: "site_section",
                              section: "mutagenesis",
                            }
                          ]}
                          dataId={id + "." + selectedPosition + "." + selectedPosition}
                          itemType="site_section"
                          showBlueBackground={true}
                          enable={(mutagenesis && mutagenesis.length > 0)}
                        />
                      </span>

                      <CardToggle cardid="mutagenesis" toggle={collapsed.mutagenesis} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {mutagenesis && mutagenesis.length !== 0 && (
                        <ClientServerPaginatedTable
                          data={mutagenesis}
                          columns={mutagenesisColumns}
                        />
                      )}
                      {(!mutagenesis || mutagenesis.length === 0) && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* back button */}
              {window.history && window.history.length > 1 && (
                <div className="text-end gg-download-btn-width pb-3">
                  <Link to={`${routeConstants.proteinDetail}${id}`}>
                    <Button type="button" className="gg-btn-blue me-3">
                      To Protein Details
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    className="gg-btn-blue"
                    onClick={() => {
                      navigate(-1)
                    }}
                  >
                    Back
                  </Button>
                </div>
              )}
            </React.Fragment>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Siteview;
