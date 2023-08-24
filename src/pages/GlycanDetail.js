/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useReducer } from "react";
import { getGlycanDetail, getGlycanImageUrl } from "../data/glycan";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Sidebar from "../components/navigation/Sidebar";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { Grid } from "@mui/material";
import { Col, Row, Image } from "react-bootstrap";
import { FiBookOpen } from "react-icons/fi";
import { groupEvidences, groupOrganismEvidences } from "../data/data-format";
import EvidenceList from "../components/EvidenceList";
import ClientPaginatedTable from "../components/ClientPaginatedTable";
import ClientServerPaginatedTable from "../components/ClientServerPaginatedTable";
import "../css/detail.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import DownloadButton from "../components/DownloadButton";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import relatedGlycansIcon from "../images/icons/related-glycans-icon.svg";
import sandBox from "../images/icons/sand-box.svg";
import DetailTooltips from "../data/json/glycanDetailTooltips.json";
import HelpTooltip from "../components/tooltip/HelpTooltip";
import LineTooltip from "../components/tooltip/LineTooltip";
import FeedbackWidget from "../components/FeedbackWidget";
import ReactCopyClipboard from "../components/ReactCopyClipboard";
import routeConstants from "../data/json/routeConstants";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import Button from "react-bootstrap/Button";
import stringConstants from "../data/json/stringConstants";
import { Link } from "react-router-dom";
import { Alert, AlertTitle } from "@mui/material";
import { Tab, Tabs, Container, NavDropdown, Navbar, Nav } from "react-bootstrap";
import CollapsableReference from "../components/CollapsableReference";
import DirectSearch from "../components/search/DirectSearch.js";
import { getGlycanSearch } from "../data/glycan";
import CardToggle from "../components/cards/CardToggle";
import ThreeDViewer from "../components/viewer/ThreeDViewer.js";
import CardLoader from "../components/load/CardLoader";
import {
  GLYGEN_API,
} from "../envVariables";

const glycanStrings = stringConstants.glycan.common;
const glycanDirectSearch = stringConstants.glycan.direct_search;
const proteinStrings = stringConstants.protein.common;
const motifStrings = stringConstants.motif.common;

const items = [
  { label: stringConstants.sidebar.general.displayname, id: "General" },
  { label: stringConstants.sidebar.viewer.displayname, id: "3D-View" },
  { label: stringConstants.sidebar.organism.displayname, id: "Organism" },

  {
    label: stringConstants.sidebar.names_synonyms.displayname,
    id: "Names"
  },
  { label: stringConstants.sidebar.motifs.displayname, id: "Motifs" },
  {
    label: stringConstants.sidebar.associated_glycan.displayname,
    id: "Associated-Protein"
  },
  {
    label: stringConstants.sidebar.glycan_binding_protein.displayname,
    id: "Glycan-Binding-Protein"
  },
  {
    label: stringConstants.sidebar.bio_Enzymes.displayname,
    id: "Biosynthetic-Enzymes"
  },
  {
    label: stringConstants.sidebar.subsumption.displayname,
    id: "Subsumption"
  },
  {
    label: stringConstants.sidebar.expression.displayname,
    id: "Expression"
  },
  {
    label: stringConstants.sidebar.digital_seq.displayname,
    id: "Digital-Sequence"
  },
  {
    label: stringConstants.sidebar.cross_ref.displayname,
    id: "Cross-References"
  },
  { label: stringConstants.sidebar.history.displayname, id: "History" },

  { label: stringConstants.sidebar.publication.displayname, id: "Publications" }
];

const CompositionDisplay = props => {
  return (
    <>
      {props.composition.map(item => (
        <React.Fragment key={item.name}>
          {item.url ? (
            <>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.name}
              </a>
              <sub>{item.count} </sub>
              {"  "}
            </>
          ) : (
            <>
              {item.name}
              <sub>{item.count}</sub>
              {"  "}
            </>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

// function capitalizeFirstLetter(string) {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }
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

const GlycanDetail = props => {
  let { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [detailData, setDetailData] = useState({});
  const [nonExistent, setNonExistent] = useState(null);
  const [itemsCrossRef, setItemsCrossRef] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [dataStatus, setDataStatus] = useState("Fetching Data.");
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  const [expressionTabSelected, setExpressionTabSelected] = useState("");
  const [expressionWithtissue, setExpressionWithtissue] = useState([]);
  const [expressionWithcell, setExpressionWithcell] = useState([]);
  const [sideBarData, setSidebarData] = useState(items);
  const [subsumptionAncestor, setSubsumptionAncestor] = useState([]);
  const [subsumptionDescendant, setSubsumptionDescendant] = useState([]);
  const [subsumptionTabSelected, setSubsumptionTabSelected] = useState([
    "ancestor"
  ]);
  const [publicationSort, setPublicationSort] = useState("date");
  const [publicationDirection, setPublicationDirection] = useState("desc");
  const [glycoproteinTotal, setGlycoproteinTotal] = useState(undefined);
  const [publicationTotal, setPublicationTotal] = useState(undefined);
  const [expressionWithtissueTotal, setExpressionWithtissueTotal] = useState(undefined);
  const [expressionWithcellTotal, setExpressionWithcellTotal] = useState(undefined);

  const [cardLoadingExp, setCardLoadingExp] = useState(false);
  const [cardLoadingPub, setCardLoadingPub] = useState(false);
  const [cardLoadingGlyc, setCardLoadingGlyc] = useState(false);


  // let history;

  useEffect(() => {
    setNonExistent(null);
    setPageLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    logActivity("user", id);
    const getGlycanDetailData = getGlycanDetail(id);

    const getCategory = (relationship) => {
      if (relationship === "composition" || relationship === "basecomposition" || relationship === "topology"){
        return "ancestor";
      }
      if (relationship === "leaf"){
        return "descendant";
      }
      if (relationship !== null){
        return "ignore";
      } 

      return null;
    }

    getGlycanDetailData.then(({ data }) => {
      if (data.code) {
        let message = "Glycan Detail api call";
        logActivity("user", id, "No results. " + message);
        setPageLoading(false);
        setDataStatus("No data available.");
      } else {
        let detailDataTemp = data;
        if (data.subsumption) {
          const mapOfSubsumptionCategories = data.subsumption.filter((val)=> val.related_accession !== id).reduce(
            (collection, item) => {
              const category = getCategory(item.relationship) || logActivity("No results. ");
              return {
                ...collection,
                [category]: [...(collection[category] || []), item]
              };
            },
            {}
          );

          const withAncestor = mapOfSubsumptionCategories.ancestor || [];
          const withDescendant = mapOfSubsumptionCategories.descendant || [];

          const selectTab = ["ancestor", "descendant"].find(
            category =>
              mapOfSubsumptionCategories[category] &&
              mapOfSubsumptionCategories[category].length > 0
          );
          setSubsumptionAncestor(withAncestor);
          setSubsumptionDescendant(withDescendant);
          setSubsumptionTabSelected(selectTab);
        }
        if (detailDataTemp.expression) {
          const WithTissue = detailDataTemp.expression.filter(
            item => item.tissue !== undefined
          );
          const WithCellline = detailDataTemp.expression.filter(
            item => item.cell_line !== undefined
          );
          setExpressionWithtissue(WithTissue);
          setExpressionWithcell(WithCellline);
          setExpressionTabSelected(
            WithTissue.length > 0 ? "with_tissue" : "with_cellline"
          );
        }

        if (detailDataTemp.mass) {
          detailDataTemp.mass = addCommas(detailDataTemp.mass);
        }
        if (detailDataTemp.mass_pme) {
          detailDataTemp.mass_pme = addCommas(detailDataTemp.mass_pme);
        }
        if (detailDataTemp.glycoct) {
          detailDataTemp.glycoct = detailDataTemp.glycoct.replace(/ /g, "\n");
        }

        if (detailDataTemp.composition) {
          detailDataTemp.composition = detailDataTemp.composition
            .map((res, ind, arr) => {
              if (glycanStrings.composition[res.residue.toLowerCase()]) {
                res.name =
                  glycanStrings.composition[
                    res.residue.toLowerCase()
                  ].shortName;
                res.orderID =
                  glycanStrings.composition[res.residue.toLowerCase()].orderID;
                return res;
              } else {
                let message = "New residue in Composition: " + res.residue;
                logActivity("error", id, message);
                res.name = res.residue;
                res.orderID =
                  parseInt(glycanStrings.composition["other"].orderID) -
                  (parseInt(arr.length) - parseInt(ind));
                return res;
              }
            })
            .sort(function(res1, res2) {
              return parseInt(res1.orderID) - parseInt(res2.orderID);
            });
        }

        if (detailDataTemp.publication) {
          detailDataTemp.publication = detailDataTemp.publication.sort(
            (a, b) => parseInt(b.date) - parseInt(a.date)
          );
        }

        if (data.section_stats) {
          let glycoProt = data.section_stats.filter(obj => obj.table_id === "glycoprotein");
          let glycoProtStat = glycoProt[0].table_stats.filter(obj => obj.field === "total");
          setGlycoproteinTotal(glycoProtStat[0].count);

          let expTiss = data.section_stats.filter(obj => obj.table_id === "expression_tissue");
          let expTissStat = expTiss[0].table_stats.filter(obj => obj.field === "total");
          setExpressionWithtissueTotal(expTissStat[0].count);

          let expCellLine = data.section_stats.filter(obj => obj.table_id === "expression_cell_line");
          let expCellLineStat = expCellLine[0].table_stats.filter(obj => obj.field === "total");
          setExpressionWithcellTotal(expCellLineStat[0].count);

          let publ = data.section_stats.filter(obj => obj.table_id === "publication");
          let publStat = publ[0].table_stats.filter(obj => obj.field === "total");
          setPublicationTotal(publStat[0].count);
        }

        setItemsCrossRef(getItemsCrossRef(detailDataTemp));
        setDetailData(detailDataTemp);
        setPageLoading(false);
        setDataStatus("No data available.");
        //new side bar
        let newSidebarData = sideBarData;
        if (
          !detailDataTemp.glytoucan ||
          detailDataTemp.glytoucan.length === 0
        ) {
          newSidebarData = setSidebarItemState(newSidebarData, "General", true);
        }
        if (!detailDataTemp.species || detailDataTemp.species.length === 0) {
          newSidebarData = setSidebarItemState(
            newSidebarData,
            "Organism",
            true
          );
        }
        if (!detailDataTemp.names || detailDataTemp.names.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Names", true);
        }
        if (!detailDataTemp.motifs || detailDataTemp.motifs.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Motifs", true);
        }

        if (
          !detailDataTemp.glycoprotein ||
          detailDataTemp.glycoprotein.length === 0
        ) {
          newSidebarData = setSidebarItemState(
            newSidebarData,
            "Associated-Protein",
            true
          );
        }
        if (
          !detailDataTemp.interactions ||
          detailDataTemp.interactions.length === 0
        ) {
          newSidebarData = setSidebarItemState(
            newSidebarData,
            "Glycan-Binding-Protein",
            true
          );
        }
        if (!detailDataTemp.enzyme || detailDataTemp.enzyme.length === 0) {
          newSidebarData = setSidebarItemState(
            newSidebarData,
            "Biosynthetic-Enzymes",
            true
          );
        }
        if (
          !detailDataTemp.subsumption ||
          detailDataTemp.subsumption.length === 0
        ) {
          newSidebarData = setSidebarItemState(
            newSidebarData,
            "Subsumption",
            true
          );
        }
        if (
          !detailDataTemp.expression ||
          detailDataTemp.expression.length === 0
        ) {
          newSidebarData = setSidebarItemState(
            newSidebarData,
            "Expression",
            true
          );
        }

        if (
          !detailDataTemp.iupac &&
          !detailDataTemp.wurcs &&
          !detailDataTemp.glycoct
        ) {
          newSidebarData = setSidebarItemState(
            newSidebarData,
            "Digital-Sequence",
            true
          );
        }
        if (!detailDataTemp.crossref || detailDataTemp.crossref.length === 0) {
          newSidebarData = setSidebarItemState(
            newSidebarData,
            "Cross-References",
            true
          );
        }
        if (!detailDataTemp.history || detailDataTemp.history.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "History", true);
        }
        if (
          !detailDataTemp.publication ||
          detailDataTemp.publication.length === 0
        ) {
          newSidebarData = setSidebarItemState(
            newSidebarData,
            "Publications",
            true
          );
        }
        setSidebarData(newSidebarData);
      }

      setTimeout(() => {
        const anchorElement = location.hash;
        if (anchorElement && document.getElementById(anchorElement.substr(1))) {
          document
            .getElementById(anchorElement.substr(1))
            .scrollIntoView({ behavior: "auto" });
        }
      }, 500);
    });
    getGlycanDetailData.catch(({ response }) => {
      if (
        response && response.data &&
        response.data.error_list &&
        response.data.error_list.length &&
        response.data.error_list[0].error_code &&
        response.data.error_list[0].error_code === "non-existent-record"
      ) {
        // history = response.data.history;
        setNonExistent({
          error_code: response.data.error_list[0].error_code,
          reason: response.data.reason,
          //history: response.data.history
        });
        setPageLoading(false);
      } else {
        let message = "Glycan Detail api call";
        axiosError(response, id, message, setPageLoading, setAlertDialogInput);
      }
      setDataStatus("No data available.");
    });
    // eslint-disable-next-line
  }, [id]);

  const {
    mass,
    glytoucan,
    inchi_key,
    species,
    composition,
    motifs,
    iupac,
    glycam,
    byonic,
    smiles_isomeric,
    inchi,
    classification,
    interactions,
    glycoct,
    publication,
    wurcs,
    enzyme,
    subsumption,
    expression,
    mass_pme,
    names,
    tool_support,
    history
  } = detailData;

  let glycoprotein = [];
  if (detailData.glycoprotein) {
    glycoprotein = detailData.glycoprotein.map((glycoprotein, index) => ({
      ...glycoprotein,
      id: `${glycoprotein.uniprot_canonical_ac}-${index}`
    }));
  }

  const setSidebarItemState = (items, itemId, disabledState) => {
    return items.map(item => {
      return {
        ...item,
        disabled: item.id === itemId ? disabledState : item.disabled
      };
    });
  };
  const organismEvidence = groupOrganismEvidences(species);
  const sortedPublication = (publication && publication.length
    ? [...publication]
    : []
  ).sort((a, b) => {
    if (a[publicationSort] < b[publicationSort])
      return publicationDirection === "asc" ? -1 : 1;
    if (b[publicationSort] < a[publicationSort])
      return publicationDirection === "asc" ? 1 : -1;
    return 0;
  });
  const glycoProtienColumns = [
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
            key={row.position + row.uniprot_canonical_ac}
            evidences={groupEvidences(cell)}
          />
        );
      }
    },
    {
      dataField: "protein_name",
      text: proteinStrings.Protein_ShortName.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      }
    },
    {
      dataField: "uniprot_canonical_ac",
      text: proteinStrings.uniprot_canonical_ac.name,
      defaultSortField: "uniprot_canonical_ac",
      sort: true,

      headerStyle: (column, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View protein details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {row.uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      )
    },

    {
      dataField: "start_pos",
      text: proteinStrings.position.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) =>
        value ? (
          <LineTooltip text="View siteview details">
            <Link to={`${routeConstants.siteview}${row.uniprot_canonical_ac}/${row.start_pos}`}>
              {row.residue}
              {row.start_pos}
              {row.start_pos !== row.end_pos && (
                <>
                  to {row.residue}
                  {row.end_pos}
                </>
              )}
            </Link>
          </LineTooltip>
        ) : (
          "Not Reported"
        )
    },

    {
      dataField: "tax_name",
      text: glycanStrings.organism.shortName,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
      },
      formatter: (value, row) => (
        <>
          {row.tax_name}
        </>
      )
    }
  ];
  const glycanBindingProteinColumns = [
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
      dataField: "interactor_name",
      text: proteinStrings.protein_name.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      }
    },
    {
      dataField: "interactor_id",
      text: proteinStrings.uniprot_canonical_ac.name,
      defaultSortField: "interactor_id",
      sort: true,

      headerStyle: (column, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View protein details">
          <Link to={routeConstants.proteinDetail + row.interactor_id}>
            {row.interactor_id}
          </Link>
        </LineTooltip>
      )
    }
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
                <Link
                  to={`${routeConstants.publicationDetail}${ref.type}/${ref.id}`}
                >
                  <>{ref.id}</>
                </Link>{" "}
                <DirectSearch
                  text={glycanDirectSearch.pmid.text}
                  searchType={"glycan"}
                  fieldType={glycanStrings.pmid.id}
                  fieldValue={ref.id}
                  executeSearch={glycanSearch}
                />
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

  const bioEnzymeColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList
            key={row.uniprot_canonical_ac}
            evidences={groupEvidences(cell)}
          />
        );
      }
    },
    {
      dataField: "uniprot_canonical_ac",
      text: proteinStrings.uniprot_canonical_ac.name,
      sort: true,

      headerStyle: () => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {row.uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      )
    },
    {
      dataField: "gene",
      text: proteinStrings.gene_name.name,
      defaultSortField: "gene",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },

      formatter: (value, row) => (
        <LineTooltip text="View details on UniProt">
          <a href={row.gene_link} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        </LineTooltip>
      )
    },

    {
      dataField: "protein_name",
      text: proteinStrings.Protein_ShortName.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      }
    },

    {
      dataField: "tax_name",
      text: glycanStrings.organism.shortName,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
      },
      formatter: (value, row) => (
        <>
          {row.tax_name} {"("}
          <span className="text-capitalize">{row.tax_common_name}</span>
          {")"}
        </>
      )
    }
  ];
  const subsumptionColumns = [
    {
      dataField: "related_accession",
      text: glycanStrings.glycan_id.shortName,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Link to={routeConstants.glycanDetail + row.related_accession}>{row.related_accession}</Link>
        </LineTooltip>
      )
    },
    {
      dataField: "image",
      text: glycanStrings.glycan_image.name,
      sort: false,
      selected: true,
      formatter: (value, row) => (
        <div className="img-wrapper">
          <img
            className="img-cartoon"
            src={getGlycanImageUrl(row.related_accession)}
            alt="Glycan img"
          />
        </div>
      ),
      headerStyle: (colum, colIndex) => {
        return {
          textAlign: "left",
          backgroundColor: "#4B85B6",
          color: "white",
          whiteSpace: "nowrap"
        };
      }
    },
    {
      dataField: "relationship",
      text: "Type",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      }
    }
    // {
    //   dataField: "relationship",
    //   text: "Relationship",
    //   sort: true,
    //   headerStyle: (colum, colIndex) => {
    //     return { backgroundColor: "#4B85B6", color: "white" };
    //   },
    // },
  ];
  const expressionCellColumns = [
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
            key={row.position + row.uniprot_canonical_ac}
            evidences={groupEvidences(cell)}
          />
        );
      }
    },

    {
      dataField: "uniprot_canonical_ac",
      text: proteinStrings.uniprot_canonical_ac.name,
      defaultSortField: "uniprot_canonical_ac",
      sort: true,

      headerStyle: (column, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View protein details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {row.uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      )
    },
    {
      dataField: "start_pos",
      text: proteinStrings.position.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) =>
        value ? (
          <LineTooltip text="View siteview details">
            <Link to={`${routeConstants.siteview}${row.uniprot_canonical_ac}/${row.start_pos}`}>
              {row.residue}
              {row.start_pos}
              {row.start_pos !== row.end_pos && (
                <>
                  to {row.residue}
                  {row.end_pos}
                </>
              )}
            </Link>
          </LineTooltip>
        ) : (
          "Not Reported"
        )
    },
    {
      dataField: "name",
      text: "Cell / Cell Line Expression",
      sort: true,
      headerStyle: (column, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <>
          {value}{" "}
          {row.cell_line && (<span className="nowrap">
            ({row.cell_line.namespace}: <LineTooltip text="View cell / cell line expression details"><a href={row.cell_line.url} target="_blank" rel="noopener noreferrer">{row.cell_line.id}</a></LineTooltip>)
          </span>)}
        </>
      ),
    }
  ];
  const expressionTissueColumns = [
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
            key={row.position + row.uniprot_canonical_ac}
            evidences={groupEvidences(cell)}
          />
        );
      }
    },

    {
      dataField: "uniprot_canonical_ac",
      text: proteinStrings.uniprot_canonical_ac.name,
      defaultSortField: "uniprot_canonical_ac",
      sort: true,

      headerStyle: (column, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View protein details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {row.uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      )
    },
    {
      dataField: "start_pos",
      text: proteinStrings.position.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) =>
        value ? (
          <LineTooltip text="View siteview details">
            <Link to={`${routeConstants.siteview}${row.uniprot_canonical_ac}/${row.start_pos}`}>
              {row.residue}
              {row.start_pos}
              {row.start_pos !== row.end_pos && (
                <>
                  to {row.residue}
                  {row.end_pos}
                </>
              )}
            </Link>
          </LineTooltip>
        ) : (
          "Not Reported"
        )
    },
    {
      dataField: "namespace",
      text: "Tissue / Bodily Fluid Expression",
      sort: true,
      headerStyle: (column, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <>
          {value}{" "}
          {row.tissue && (<span className="nowrap">
            ({row.tissue.namespace}: <LineTooltip text="View tissue / bodily fluid expression details"><a href={row.tissue.url} target="_blank" rel="noopener noreferrer">{row.tissue.id}</a></LineTooltip>)
          </span>)}
        </>
      ),
    }
  ];
  const motifColumns = [
    {
      dataField: "image",
      text: glycanStrings.glycan_image.name,
      sort: false,
      selected: true,
      formatter: (value, row) => (
        <div className="img-wrapper">
          <img
            className="img-cartoon"
            src={getGlycanImageUrl(row.id)}
            alt="Glycan img"
          />
        </div>
      ),
      headerStyle: (colum, colIndex) => {
        return {
          textAlign: "left",
          backgroundColor: "#4B85B6",
          color: "white",
          whiteSpace: "nowrap"
        };
      }
    },
    {
      dataField: "id",
      text: motifStrings.motif_id.name,
      sort: true,

      headerStyle: () => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Link to={routeConstants.motifDetail + row.id}>{row.id}</Link>
        </LineTooltip>
      )
    },
    {
      dataField: "name",
      text: motifStrings.motif_name.name,
      defaultSortField: "name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Link to={routeConstants.motifDetail + row.id}>{row.name}</Link>
        </LineTooltip>
      )
    }
  ];
  // ==================================== //
  /**
   * Adding toggle collapse arrow icon to card header individualy.
   * @param {object} glytoucan_ac- glytoucan accession ID.
   **/
  const [collapsed, setCollapsed] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      general: true,
      organism: true,
      viewer: true,
      names_synonyms: true,
      motif: true,
      glycoprotein: true,
      glycanBindingProtein: true,
      bioEnzyme: true,
      subsumption: true,
      expression: true,
      digitalSeq: true,
      crossref: true,
      publication: true,
      history: true,
      names: true
    }
  );
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  function toggleCollapse(name, value) {
    setCollapsed({ [name]: !value });
  }


  // const ToggleIcon = ({open}) => open ? <ExpandLessIcon fontSize="large" /> : <ExpandMoreIcon fontSize="large" />
  // ===================================== //

  /**
   * Redirect and opens glytoucan_ac in a subsumption browser
   * @param {object} glytoucan_ac- glytoucan accession ID.
   **/
  function handleOpenSubsumptionBrowse(glytoucan_ac) {
    var url =
      //"https://raw.githack.com/glygen-glycan-data/GNOme/GlyGen_DEV/restrictions/GNOme_GlyGen.browser.html?focus=" +
      "http://gnome.glyomics.org/restrictions/GlyGen.StructureBrowser.html?focus=" +
      glytoucan_ac;
    window.open(url);
  }

  /**
   * Redirect and opens glytoucan_ac in a sand box
   * @param {object} glytoucan_ac- glytoucan accession ID.
   **/
  function handleOpenSandbox(glytoucan_ac) {
    var url =
      "https://sandbox.glyomics.org/explore.html?" + glytoucan_ac;
    window.open(url);
  }

  /**
   * Function to handle glycan direct search.
   **/
  const glycanSearch = formObject => {
    setPageLoading(true);
    logActivity("user", id, "Performing Direct Search");
    let message = "Direct Search query=" + JSON.stringify(formObject);
    getGlycanSearch(formObject)
      .then(response => {
        if (response.data["list_id"] !== "") {
          logActivity(
            "user",
            (id || "") + ">" + response.data["list_id"],
            message
          ).finally(() => {
            navigate(
              routeConstants.glycanList + response.data["list_id"]
            );
          });
          setPageLoading(false);
        } else {
          let error = {
            response: {
              status: stringConstants.errors.defaultDialogAlert.id
            }
          };
          axiosError(
            error,
            "",
            "No results. " + message,
            setPageLoading,
            setAlertDialogInput
          );
        }
      })
      .catch(function(error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  if (nonExistent) {
    return (
      <Container className="tab-content-border2">
        <Alert className="erroralert" severity="error">
          {nonExistent.reason && nonExistent.reason.type && nonExistent.reason.type !== "invalid" ? (
            <>
              {nonExistent.reason.type !== "never_in_glygen_current_in_glytoucan" && (<AlertTitle> {id} is no longer valid Glycan Id</AlertTitle>)}
              {nonExistent.reason.type === "never_in_glygen_current_in_glytoucan" && (<AlertTitle> The GlyTouCan accession {id} does not exists in GlyGen</AlertTitle>)}
              <span>{capitalizeFirstLetter(nonExistent.reason.description)}</span>
              <ul>
                  <span>
                    {nonExistent.reason.type === "replacement_in_glygen" && nonExistent.reason.replacement_id_list && (
                      nonExistent.reason.replacement_id_list.map((repID) =>
                      <li>
                        <Link to={`${routeConstants.glycanDetail}${repID}`}>
                          {" "}
                          {"Go to Glycan: "  + repID}
                        </Link>
                      </li>
                      )
                    )}
                  </span>
              </ul>
            </>
          ) : (
            <>
              <AlertTitle>
                The accession <b>{id}</b> does not exist in GlyGen
              </AlertTitle>
            </>
          )}
        </Alert>
      </Container>
    );
  }

  return (
    <>
      {}
      <Row className="gg-baseline">
        <Col sm={12} md={12} lg={12} xl={3} className="sidebar-col">
          {/* <Sidebar items={items} /> */}
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
                        Details for Glycan
                        <strong>
                          {glytoucan && glytoucan.glytoucan_ac && (
                            <> {glytoucan.glytoucan_ac}</>
                          )}
                        </strong>
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
                    display: stringConstants.download.glycan_image.displayname,
                    type: "png",
                    data: "glycan_image"
                  },
                  {
                    display:
                      stringConstants.download.glycan_jsondata.displayname,
                    type: "json",
                    data: "glycan_detail"
                  }
                ]}
                dataType="glycan_detail"
                itemType="glycan_detail"
                dataId={id}
              />
            </div>

            <React.Fragment>
              <Helmet>
                {getTitle("glycanDetail", {
                  glytoucan_ac:
                    glytoucan && glytoucan.glytoucan_ac
                      ? glytoucan.glytoucan_ac
                      : ""
                })}
                {getMeta("glycanDetail")}
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
                        title={DetailTooltips.glycan.general.title}
                        text={DetailTooltips.glycan.general.text}
                        urlText={DetailTooltips.glycan.general.urlText}
                        url={DetailTooltips.glycan.general.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.general.displayname}
                    </h4>
                    <div className="float-end">
                      <span>
                        <Button
                          type="button"
                          className="gg-btn-blue"
                          disabled={
                            tool_support && tool_support.sandbox === "yes"
                              ? false
                              : true
                          }
                          onClick={() => {
                            handleOpenSandbox(
                              glytoucan && glytoucan.glytoucan_ac
                            );
                          }}
                        >
                          <span>
                            <Image
                              className="pe-2"
                              src={sandBox}
                              alt="Sand Box"
                            />
                          </span>
                          Sand Box
                        </Button>
                      </span>
                      {(!tool_support) || (tool_support.gnome_glygen_nglycans === "no" && tool_support.gnome_glygen_oglycans === "no") ? (<span>
                        <Button
                          type="button"
                          className="gg-btn-blue"
                          style={{
                            marginLeft: "10px"
                          }}
                          disabled={
                            tool_support && tool_support.gnome === "yes"
                              ? false
                              : true
                          }
                          onClick={() => {
                            handleOpenSubsumptionBrowse(
                              glytoucan && glytoucan.glytoucan_ac
                            );
                          }}
                        >
                          <span>
                            <Image
                              className="pe-2"
                              src={relatedGlycansIcon}
                              alt="Related glycans"
                            />
                          </span>
                          Related Glycans
                        </Button>
                      </span>) :
                      (<span>
                        <Nav className={ "gg-dropdown-nav"} style={{display:"inline-block", borderRadius:".5rem"}} >
                          <div
                            type="button"
                            className="gg-btn-blue gg-dropdown-btn"
                            style={{
                              marginLeft: "10px"
                            }}>
                              <span  style={{display:"inline-block"}}>
                                <Image
                                  style={{display:"inline-block"}}
                                  src={relatedGlycansIcon}
                                  alt="Related glycans"
                                />
                                <NavDropdown
                                  className={ "gg-dropdown-navbar gg-dropdown-navitem"}
                                  style={{display:"inline-block", padding: "0px !important"}}
                                  title="Related Glycans"
                                  id="gg-dropdown-navbar"
                                >
                                  {tool_support.gnome_glygen_nglycans === "yes" && glytoucan && <NavDropdown.Item href={"https://gnome.glyomics.org/restrictions/GlyGen_NGlycans.StructureBrowser.html?focus=" + glytoucan.glytoucan_ac} target="_blank" rel="noopener noreferrer">
                                    GlyGen N-Glycans
                                  </NavDropdown.Item>}
                                  {tool_support.gnome_glygen_oglycans === "yes" && glytoucan && <NavDropdown.Item href={"https://gnome.glyomics.org/restrictions/GlyGen_OGlycans.StructureBrowser.html?focus=" + glytoucan.glytoucan_ac} target="_blank" rel="noopener noreferrer">
                                    GlyGen O-Glycans
                                  </NavDropdown.Item>}
                                  {tool_support.gnome_glygen === "yes" && glytoucan && <NavDropdown.Item href={"http://gnome.glyomics.org/restrictions/GlyGen.StructureBrowser.html?focus=" + glytoucan.glytoucan_ac} target="_blank" rel="noopener noreferrer">
                                    GlyGen Glycans
                                  </NavDropdown.Item>}
                                </NavDropdown>
                              </span>
                          </div>
                        </Nav>
                      </span>)}
                      <CardToggle cardid="general" toggle={collapsed.general} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <div>
                        {glytoucan && glytoucan.glytoucan_ac && (
                          <>
                            <span>
                              <img
                                className="img-cartoon"
                                src={getGlycanImageUrl(glytoucan.glytoucan_ac)}
                                alt="Glycan img"
                              />
                            </span>
                            <div>
                              <strong>
                                {proteinStrings.glytoucan_ac.shortName}:{" "}
                              </strong>
                              <a
                                href={glytoucan.glytoucan_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {glytoucan.glytoucan_ac}
                              </a>
                            </div>

                            <div>
                              {mass ? (
                                <>
                                  <strong>
                                    {" "}
                                    {glycanStrings.mass.shortName}:{" "}
                                  </strong>
                                  {mass} Da{" "}
                                  <DirectSearch
                                    text={glycanDirectSearch.mass.text}
                                    searchType={"glycan"}
                                    fieldType={glycanStrings.mass.id}
                                    fieldValue={mass}
                                    executeSearch={glycanSearch}
                                  />
                                </>
                              ) : (
                                <> </>
                              )}
                            </div>
                            <div>
                              {mass_pme ? (
                                <>
                                  <strong>
                                    {" "}
                                    {glycanStrings.mass_pme.shortName}:{" "}
                                  </strong>
                                  {mass_pme} Da{" "}
                                  <DirectSearch
                                    text={glycanDirectSearch.mass_pme.text}
                                    searchType={"glycan"}
                                    fieldType={glycanStrings.mass_pme.id}
                                    fieldValue={mass_pme}
                                    executeSearch={glycanSearch}
                                  />
                                </>
                              ) : (
                                <> </>
                              )}
                            </div>
                          </>
                        )}
                        {composition && (
                          <div>
                            <strong>Composition:{" "}</strong>
                            <CompositionDisplay composition={composition} />{" "}
                            <DirectSearch
                              text={glycanDirectSearch.composition.text}
                              searchType={"glycan"}
                              fieldType={glycanStrings.composition.id}
                              fieldValue={composition}
                              executeSearch={glycanSearch}
                            />
                          </div>
                        )}

                        {byonic && byonic.length > 0 && byonic !== "%" && (
                          <div>
                            <Row>
                              <Col md="auto" className="pe-0">
                                <strong>
                                  {glycanStrings.byonic.shortName}:&nbsp;
                                </strong>
                              </Col>
                              <Col md="auto" className="ps-0 pe-0">
                                  {byonic.split('%')[0].trim()}
                              </Col>
                              <Col md="auto" className="ps-0 ms-2">
                                <ReactCopyClipboard value={"byonic"} />
                              </Col>
                            </Row>
                          </div>
                        )}

                        {classification && classification.length && (
                          <div>
                            <Row>
                              <Col md="auto" className="pe-0">
                                <strong>
                                  {glycanStrings.glycan_type.name} /{" "}
                                  {glycanStrings.glycan_subtype.name}:{" "}
                                </strong>
                              </Col>
                              <Col className="ps-0">
                                {classification.map(Formatclassification => (
                                  <React.Fragment
                                    key={`${Formatclassification.type.name}-${Formatclassification.subtype.name}`}
                                  >
                                    <span>
                                      {Formatclassification.type.url && (
                                        <a
                                          href={Formatclassification.type.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          &nbsp;{Formatclassification.type.name}
                                        </a>
                                      )}
                                      {!Formatclassification.type.url && (
                                        <>
                                          &nbsp;{Formatclassification.type.name}
                                        </>
                                      )}
                                      {Formatclassification.subtype &&
                                        Formatclassification.subtype.name !==
                                          "Other" && (
                                          <>
                                            &nbsp; <b>/</b> &nbsp;
                                            {Formatclassification.subtype
                                              .url && (
                                              <a
                                                href={
                                                  Formatclassification.subtype
                                                    .url
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                {
                                                  Formatclassification.subtype
                                                    .name
                                                }
                                              </a>
                                            )}
                                            {!Formatclassification.subtype
                                              .url && (
                                              <>
                                                {
                                                  Formatclassification.subtype
                                                    .name
                                                }
                                              </>
                                            )}
                                          </>
                                        )}
                                    </span>
                                    <span>
                                      <DirectSearch
                                        text={
                                          glycanDirectSearch.glycan_type.text
                                        }
                                        searchType={"glycan"}
                                        fieldType={glycanStrings.glycan_type.id}
                                        fieldValue={{
                                          type: Formatclassification.type.name,
                                          subtype:
                                            Formatclassification.subtype &&
                                            Formatclassification.subtype
                                              .name !== "Other"
                                              ? Formatclassification.subtype
                                                  .name
                                              : ""
                                        }}
                                        executeSearch={glycanSearch}
                                      />
                                    </span>
                                    {<br />}
                                  </React.Fragment>
                                ))}{" "}
                              </Col>
                            </Row>
                          </div>
                        )}
                        {inchi_key && inchi_key.key && (
                          <>
                            <div>
                              <strong>{glycanStrings.inchi_key.name}: </strong>
                              <a
                                href={inchi_key.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {inchi_key.key}
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              {/*  Viewer */}
              <Accordion
                id="3D-View"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.viewer.title}
                        text={DetailTooltips.glycan.viewer.text}
                        urlText={DetailTooltips.glycan.viewer.urlText}
                        url={DetailTooltips.glycan.viewer.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.viewer.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="viewer" toggle={collapsed.viewer} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <Row>
                        {tool_support && tool_support.pdb === "yes" ?
                          (<div>
                            <div style={{  height: "350px"}}>
                              <ThreeDViewer url={GLYGEN_API + "/glycan/pdb/" + id + "/"} />
                            </div>
                            <div className="text-muted mt-2">
                              <strong><sup>1</sup></strong><span> 3D structure generated by <a href={"https://glycam.org/"} target="_blank" rel="noopener noreferrer">GLYCAM</a></span>
                            </div>
                            <div className="text-muted">
                              <strong><sup>2</sup></strong><span> Displayed using <a href={"https://molstar.org/viewer-docs/"} target="_blank" rel="noopener noreferrer">Mol*</a></span>
                            </div>
                          </div>)
                          : (
                            <p className="no-data-msg">{dataStatus}</p>
                        )}
                      </Row>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              {/*  species */}
              <Accordion
                id="Organism"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.organism.title}
                        text={DetailTooltips.glycan.organism.text}
                        urlText={DetailTooltips.glycan.organism.urlText}
                        url={DetailTooltips.glycan.organism.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.organism.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="organism" toggle={collapsed.organism} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <Row>
                        {organismEvidence &&
                          // For every organism object
                          Object.keys(organismEvidence).map(orgEvi => (
                            // For every database for current organism object
                            <Col
                              xs={12}
                              sm={12}
                              md={4}
                              lg={4}
                              xl={4}
                              style={{ marginBottom: "10px" }}
                              key={orgEvi}
                            >
                              <>
                                <strong>{orgEvi}</strong> {"("}
                                <span className="text-capitalize">
                                  {organismEvidence[orgEvi].common_name}
                                </span>
                                {")"} {"["}
                                <LineTooltip text="View details on NCBI">
                                  <a
                                    href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${organismEvidence[orgEvi].taxid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {organismEvidence[orgEvi].taxid}
                                  </a>
                                </LineTooltip>
                                {"]"}{" "}
                                <DirectSearch
                                  text={glycanDirectSearch.organism.text}
                                  searchType={"glycan"}
                                  fieldType={glycanStrings.organism.id}
                                  fieldValue={{
                                    organism_list: [
                                      {
                                        name: orgEvi,
                                        id: organismEvidence[orgEvi].taxid
                                      }
                                    ],
                                    annotation_category: "",
                                    operation: "or"
                                  }}
                                  executeSearch={glycanSearch}
                                />
                                <EvidenceList
                                  evidences={organismEvidence[orgEvi].evidence}
                                />
                              </>
                            </Col>
                          ))}
                        {!species && (
                          <p className="no-data-msg">{dataStatus}</p>
                        )}
                      </Row>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/*  Names */}
              <Accordion
                id="Names"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.names_synonyms.title}
                        text={DetailTooltips.glycan.names_synonyms.text}
                        urlText={DetailTooltips.glycan.names_synonyms.urlText}
                        url={DetailTooltips.glycan.names_synonyms.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.names_synonyms.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="names_synonyms" toggle={collapsed.names_synonyms} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {names && names.length ? (
                        <ul className="list-style-none">
                          {names.map(nameObject => (
                            <li key={nameObject.domain}>
                              <b>{nameObject.domain}</b>: {nameObject.name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>{dataStatus}</p>
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Motif */}
              <Accordion
                id="Motifs"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.motifs.title}
                        text={DetailTooltips.glycan.motifs.text}
                        urlText={DetailTooltips.glycan.motifs.urlText}
                        url={DetailTooltips.glycan.motifs.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.motifs.displayname}
                    </h4>
                    <div className="float-end">
                      <span className="gg-download-btn-width text-end">
                          <DownloadButton
                            types={[
                              {
                                display: "Motif (*.csv)",
                                type: "motifs_csv",
                                format: "csv",
                                data: "glycan_section",
                                section: "motifs",
                              }
                            ]}
                            dataId={id}
                            itemType="glycan_section"
                            showBlueBackground={true}
                            enable={motifs && motifs.length > 0}
                          />
                        </span>
                      <CardToggle cardid="motif" toggle={collapsed.motif} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {motifs && motifs.length !== 0 && (
                        <ClientServerPaginatedTable
                          idField={"name"}
                          data={motifs}
                          columns={motifColumns}
                          defaultSortField={"name"}
                          onClickTarget={"#motif"}
                        />
                      )}
                      {!motifs && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Associated-Protein */}
              <Accordion
                id="Associated-Protein"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                <CardLoader pageLoading={cardLoadingGlyc} />
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.associated_protein.title}
                        text={DetailTooltips.glycan.associated_protein.text}
                        urlText={DetailTooltips.glycan.associated_protein.urlText}
                        url={DetailTooltips.glycan.associated_protein.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.associated_glycan.displayname}
                    </h4>
                    <div className="float-end">
                      <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            {
                              display: "Associated Protein (*.csv)",
                              type: "glycoprotein_csv",
                              format: "csv",
                              fileName: "associated_protein",
                              data: "glycan_section",
                              section: "glycoprotein",
                            }
                          ]}
                          dataId={id}
                          itemType="glycan_section"
                          showBlueBackground={true}
                          enable={glycoprotein && glycoprotein.length > 0}
                        />
                      </span>
                      <CardToggle cardid="glycoprotein" toggle={collapsed.glycoprotein} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {glycoprotein && glycoprotein.length !== 0 && (
                        <ClientServerPaginatedTable
                          data={glycoprotein}
                          columns={glycoProtienColumns}
                          default1SortField={"uniprot_canonical_ac"}
                          default1SortOrder="asc"
                          onClickTarget={"#glycoprotein"}
                          record_type={"glycan"}
                          table_id={"glycoprotein"}
                          record_id={id}
                          serverPagination={true}
                          totalDataSize={glycoproteinTotal}
                          setAlertDialogInput={setAlertDialogInput}
                          setCardLoading={setCardLoadingGlyc}
                        />
                      )}
                      {!glycoprotein.length && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Glycan Binding Protein */}
              <Accordion
                id="Glycan-Binding-Protein"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={
                          DetailTooltips.glycan.glycan_binding_protein.title
                        }
                        text={DetailTooltips.glycan.glycan_binding_protein.text}
                        urlText={
                          DetailTooltips.glycan.glycan_binding_protein.urlText
                        }
                        url={DetailTooltips.glycan.glycan_binding_protein.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {
                        stringConstants.sidebar.glycan_binding_protein
                          .displayname
                      }
                    </h4>
                    <div className="float-end">
                      <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            {
                              display: "Glycan Binding Protein (*.csv)",
                              type: "interactions_csv",
                              format: "csv",
                              fileName: "glycan_binding_protein",
                              data: "glycan_section",
                              section: "interactions",
                            }
                          ]}
                          dataId={id}
                          itemType="glycan_section"
                          showBlueBackground={true}
                          enable={interactions && interactions.length > 0}
                        />
                      </span>
                       <CardToggle cardid="glycanBindingProtein" toggle={collapsed.glycanBindingProtein} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {interactions && interactions.length !== 0 && (
                        <ClientServerPaginatedTable
                          idField={"interactor_id"}
                          data={interactions}
                          columns={glycanBindingProteinColumns}
                          defaultSortField={"interactor_id"}
                          onClickTarget={"#glycanBindingProtein"}
                        />
                      )}
                      {!interactions && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Biosynthetic Enzymes */}
              <Accordion
                id="Biosynthetic-Enzymes"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.biosynthetic_enzymes.title}
                        text={DetailTooltips.glycan.biosynthetic_enzymes.text}
                        urlText={
                          DetailTooltips.glycan.biosynthetic_enzymes.urlText
                        }
                        url={DetailTooltips.glycan.biosynthetic_enzymes.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.bio_Enzymes.displayname}
                    </h4>
                    <div className="float-end">
                      <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            {
                              display: "Biosynthetic Enzymes (*.csv)",
                              type: "enzyme_csv",
                              format: "csv",
                              fileName: "biosynthetic_enzymes",
                              data: "glycan_section",
                              section: "enzyme",
                            }
                          ]}
                          dataId={id}
                          itemType="glycan_section"
                          showBlueBackground={true}
                          enable={enzyme && enzyme.length > 0}
                        />
                      </span>
                      <CardToggle cardid="bioEnzyme" toggle={collapsed.bioEnzyme} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {enzyme && enzyme.length !== 0 && (
                        <ClientServerPaginatedTable
                          idField={"uniprot_canonical_ac"}
                          data={enzyme}
                          columns={bioEnzymeColumns}
                          defaultSortField={"gene"}
                          onClickTarget={"#biosyntheticenzymes"}
                        />
                      )}
                      {!enzyme && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Subsumption*/}
              <Accordion
                id="Subsumption"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.subsumption.title}
                        text={DetailTooltips.glycan.subsumption.text}
                        urlText={DetailTooltips.glycan.subsumption.urlText}
                        url={DetailTooltips.glycan.subsumption.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.subsumption.displayname}
                    </h4>
                    <div className="float-end">
                      <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            subsumptionAncestor && subsumptionAncestor.length > 0 && {
                              display: "Ancestor (*.csv)",
                              type: "subsumption_ancestor_csv",
                              format: "csv",
                              data: "glycan_section",
                              section: "subsumption_ancestor",
                            },
                            subsumptionDescendant && subsumptionDescendant.length > 0 && {
                              display: "Descendant (*.csv)",
                              type: "subsumption_descendant_csv",
                              format: "csv",
                              data: "glycan_section",
                              section: "subsumption_descendant",
                            }
                          ]}
                          dataId={id}
                          itemType="glycan_section"
                          showBlueBackground={true}
                          enable={(subsumption && subsumption.length !== 0) &&
                            ((subsumptionAncestor && subsumptionAncestor.length > 0) ||
                            (subsumptionDescendant && subsumptionDescendant.length > 0))}
                        />
                      </span>
                      <CardToggle cardid="subsumption" toggle={collapsed.subsumption} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {subsumption && subsumption.length !== 0 && (
                        <Tabs
                          activeKey={subsumptionTabSelected}
                          transition={false}
                          mountOnEnter={true}
                          unmountOnExit={true}
                          onSelect={key => {
                            setSubsumptionTabSelected(key);
                          }}
                        >
                          <Tab eventKey="ancestor" title="Ancestor"
                            tabClassName={(!subsumptionAncestor || (subsumptionAncestor.length === 0)) ? "tab-disabled" : ""}
                            disabled={(!subsumptionAncestor || (subsumptionAncestor.length === 0))}
                          >
                            <Container className="tab-content-padding">
                              {subsumptionAncestor &&
                                subsumptionAncestor.length > 0 && (
                                  <ClientServerPaginatedTable
                                    idField={"id"}
                                    data={subsumptionAncestor}
                                    columns={subsumptionColumns}
                                    defaultSortField={"id"}
                                    onClickTarget={"#subsumption"}
                                  />
                                )}
                              {!subsumptionAncestor.length && (
                                <p>{dataStatus}</p>
                              )}
                            </Container>
                          </Tab>
                          <Tab eventKey="descendant" title="Descendant"
                            tabClassName={(!subsumptionDescendant || (subsumptionDescendant.length === 0)) ? "tab-disabled" : ""}
                            disabled={(!subsumptionDescendant || (subsumptionDescendant.length === 0))}
                          >
                            <Container className="tab-content-padding">
                              {subsumptionDescendant &&
                                subsumptionDescendant.length > 0 && (
                                  <ClientServerPaginatedTable
                                    idField={"id"}
                                    data={subsumptionDescendant}
                                    columns={subsumptionColumns}
                                    defaultSortField={"id"}
                                    onClickTarget={"#subsumption"}
                                  />
                                )}
                              {!subsumptionDescendant.length && (
                                <p>{dataStatus}</p>
                              )}
                            </Container>
                          </Tab>
                        </Tabs>
                      )}
                      {!subsumption && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Expression */}
              <Accordion
                id="Expression"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <CardLoader pageLoading={cardLoadingExp} />
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.expression.title}
                        text={DetailTooltips.glycan.expression.text}
                        urlText={DetailTooltips.glycan.expression.urlText}
                        url={DetailTooltips.glycan.expression.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.expression.displayname}
                    </h4>
                    <div className="float-end">
                      <span className="gg-download-btn-width text-end">
                          <DownloadButton
                            types={[
                              expressionWithtissue && expressionWithtissue.length > 0 && {
                                display: "Tissue / Bodily Fluid Expression (*.csv)",
                                type: "expression_tissue_csv",
                                format: "csv",
                                data: "glycan_section",
                                section: "expression_tissue",
                              },
                              expressionWithcell && expressionWithcell.length > 0 && {
                                display: "Cell / Cell Line Expression (*.csv)",
                                type: "expression_cell_line_csv",
                                format: "csv",
                                data: "glycan_section",
                                section: "expression_cell_line",
                              }
                            ]}
                            dataId={id}
                            itemType="glycan_section"
                            showBlueBackground={true}
                            enable={(expression && expression.length !== 0) &&
                              ((expressionWithtissue && expressionWithtissue.length > 0) ||
                              (expressionWithcell && expressionWithcell.length > 0))}
                          />
                        </span>
                      <CardToggle cardid="expression" toggle={collapsed.expression} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {expression && expression.length !== 0 && (
                        <Tabs
                          defaultActiveKey={
                            expressionWithtissue &&
                            expressionWithtissue.length > 0
                              ? "with_tissue"
                              : "with_cellline"
                          }
                          transition={false}
                          mountOnEnter={true}
                          unmountOnExit={true}
                        >
                          <Tab
                            eventKey="with_tissue"
                            title="Tissue / Bodily Fluid Expression"
                            tabClassName={(!expressionWithtissue || (expressionWithtissue.length === 0)) ? "tab-disabled" : ""}
                            disabled={(!expressionWithtissue || (expressionWithtissue.length === 0))}
                          >
                            <Container className="tab-content-padding">
                              {expressionWithtissue &&
                                expressionWithtissue.length > 0 && (
                                  <ClientServerPaginatedTable
                                    // data={expressionWithtissue.map(data => {return {...data, tissueName: (data.tissue ? data.tissue.name : "")}})}
                                    data={expressionWithtissue}
                                    columns={expressionTissueColumns}
                                    onClickTarget={"#expression"}
                                    default1SortField="start_pos"
                                    default1SortOrder="asc"
                                    record_type={"glycan"}
                                    table_id={"expression_tissue"}
                                    record_id={id}
                                    serverPagination={true}
                                    totalDataSize={expressionWithtissueTotal}
                                    setAlertDialogInput={setAlertDialogInput}
                                    setCardLoading={setCardLoadingExp}
                                  />
                                )}
                              {!expressionWithtissue.length && (
                                <p>{dataStatus}</p>
                              )}
                            </Container>
                          </Tab>
                          <Tab
                            eventKey="with_cellline"
                            title="Cell / Cell Line Expression"
                            tabClassName={(!expressionWithcell || (expressionWithcell.length === 0)) ? "tab-disabled" : ""}
                            disabled={(!expressionWithcell || (expressionWithcell.length === 0))}
                          >
                            <Container className="tab-content-padding">
                              {expressionWithcell &&
                                expressionWithcell.length > 0 && (
                                  <ClientServerPaginatedTable
                                    // data={expressionWithcell.map(data => {return {...data, cellLineName: (data.cell_line ? data.cell_line.name : "")}})}
                                    data={expressionWithcell}
                                    columns={expressionCellColumns}
                                    onClickTarget={"#expression"}
                                    default1SortField="position"
                                    default1SortOrder="asc"
                                    record_type={"glycan"}
                                    table_id={"expression_cell_line"}
                                    record_id={id}
                                    serverPagination={true}
                                    totalDataSize={expressionWithcellTotal}
                                    setAlertDialogInput={setAlertDialogInput}
                                    setCardLoading={setCardLoadingExp}
                                  />
                                )}
                              {!expressionWithcell.length && (
                                <p>{dataStatus}</p>
                              )}
                            </Container>
                          </Tab>
                        </Tabs>
                      )}

                      {!expression && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Digital Sequence */}
              <Accordion
                id="Digital-Sequence"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.digital_sequence.title}
                        text={DetailTooltips.glycan.digital_sequence.text}
                        urlText={DetailTooltips.glycan.digital_sequence.urlText}
                        url={DetailTooltips.glycan.digital_sequence.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.digital_seq.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="digitalSeq" toggle={collapsed.digitalSeq} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body className="text-responsive">
                      <div>
                        {iupac ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                {" "}
                                <strong>{glycanStrings.iupac.name}</strong>
                              </Col>{" "}
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={iupac} />
                              </Col>
                            </Row>
                            <span className="text-overflow">{iupac} </span>
                          </>
                        ) : (
                          <span> </span>
                        )}

                        {wurcs ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                {" "}
                                <strong>{glycanStrings.WURCS.name}</strong>
                              </Col>{" "}
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={wurcs} />
                              </Col>
                            </Row>
                            <span className="text-overflow">{wurcs} </span>
                          </>
                        ) : (
                          <span> </span>
                        )}

                        {glycoct ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                {" "}
                                <strong>{glycanStrings.GlycoCT.name}</strong>
                              </Col>{" "}
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={glycoct} />
                              </Col>
                            </Row>
                            <span id="text_element" className="text-overflow">
                              {glycoct}
                            </span>
                          </>
                        ) : (
                          <span> </span>
                        )}

                        {inchi ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                <strong>
                                  {glycanStrings.inchi_key.shortName}
                                </strong>
                              </Col>
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={inchi} />
                              </Col>
                            </Row>
                            <span className="text-overflow">{inchi}</span>
                          </>
                        ) : (
                          <span> </span>
                        )}

                        {glycam ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                <strong>
                                  {glycanStrings.GLYCAM_IUPAC.shortName}
                                </strong>
                              </Col>
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={glycam} />
                              </Col>
                            </Row>
                            <span className="text-overflow">{glycam}</span>
                          </>
                        ) : (
                          <span> </span>
                        )}
                        {smiles_isomeric ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                <strong>
                                  {glycanStrings.Isomeric_SMILES.shortName}
                                </strong>
                              </Col>
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={smiles_isomeric} />
                              </Col>
                            </Row>
                            <span className="text-overflow">
                              {smiles_isomeric}
                            </span>
                          </>
                        ) : (
                          <span> </span>
                        )}
                      </div>
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
                        title={DetailTooltips.glycan.cross_references.title}
                        text={DetailTooltips.glycan.cross_references.text}
                        urlText={DetailTooltips.glycan.cross_references.urlText}
                        url={DetailTooltips.glycan.cross_references.url}
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
                            {/* <Row> */}

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
                        <span>{dataStatus}</span>
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* history */}
              <Accordion
                id="History"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.history.title}
                        text={DetailTooltips.glycan.history.text}
                        urlText={DetailTooltips.glycan.history.urlText}
                        url={DetailTooltips.glycan.history.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.history.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="history" toggle={collapsed.history} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse
                    eventKey="0"
                    out={(collapsed.history = "false")}
                  >
                    <Card.Body>
                      {history && history.length ? (
                        <>
                          {history.map(historyItem => (
                            <ul className="pl-3" key={historyItem.description}>
                              <li>
                                {capitalizeFirstLetter(historyItem.description)}{" "}
                              </li>
                            </ul>
                          ))}
                        </>
                      ) : (
                        <span>{dataStatus}</span>
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
                        title={DetailTooltips.glycan.publications.title}
                        text={DetailTooltips.glycan.publications.text}
                        urlText={DetailTooltips.glycan.publications.urlText}
                        url={DetailTooltips.glycan.publications.url}
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
                        onChange={event =>
                          setPublicationSort(event.target.value)
                        }
                      >
                        <option value="title">Title</option>
                        <option value="date">Date</option>
                        <option value="journal">Journal</option>
                        <option value="authors">Author List</option>
                      </select>{" "}
                      <select
                        className="select-dropdown pt-0"
                        value={publicationDirection}
                        onChange={event =>
                          setPublicationDirection(event.target.value)
                        }
                      >
                        <option value="asc">Asc</option>
                        <option value="desc">Desc</option>
                      </select>
                       <CardToggle cardid="publication" toggle={collapsed.publication} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse
                    eventKey="0"
                    out={(collapsed.publication = "false")}
                  >
                    <Card.Body className="card-padding-zero">

                    <div className="m-3">
                    {publication && publication.length > 0 && <ClientServerPaginatedTable
                            // idField={"interactor_id"}
                            data={publication}
                            columns={paperColumns}
                            tableHeader={'paper-table-header'}
                            wrapperClasses={"table-responsive table-height-auto"}
                            // serverPagination={false}
                            defaultSizePerPage={200}
                            defaultSortField={"date"}
                            defaultSortOrder={"desc"}
                            // defaultSortField={"interactor_id"}
                            // onClickTarget={"#glycanBindingProtein"}
                            record_type={"glycan"}
                            table_id={"publication"}
                            record_id={id}
                            serverPagination={true}
                            totalDataSize={publicationTotal}
                            currentSort={publicationSort}
                            currentSortOrder={publicationDirection}
                            setAlertDialogInput={setAlertDialogInput}
                            setCardLoading={setCardLoadingPub}
                      />}
                    </div>

                      {/* <Table hover fluid="true">
                        {sortedPublication && (
                          <tbody className="table-body">
                            {sortedPublication.map((pub, pubIndex) => (
                              <tr className="table-row">
                                <td key={pubIndex}>
                                  <div>
                                    <div>
                                      <h5 style={{ marginBottom: "3px" }}>
                                        <strong>{pub.title}</strong>{" "}
                                      </h5>
                                    </div>
                                    <div>{pub.authors}</div>
                                    <div>
                                      {pub.journal} <span>&nbsp;</span>(
                                      {pub.date})
                                    </div>
                                    <div>
                                      {pub.reference.map(ref => (
                                        <>
                                          <FiBookOpen />
                                          <span style={{ paddingLeft: "15px" }}>
                                            {ref.type}:
                                          </span>{" "}
                                          <Link
                                            to={`${routeConstants.publicationDetail}${ref.type}/${ref.id}`}
                                          >
                                            <>{ref.id}</>
                                          </Link>{" "}

                                          <DirectSearch
                                            text={glycanDirectSearch.pmid.text}
                                            searchType={"glycan"}
                                            fieldType={glycanStrings.pmid.id}
                                            fieldValue={ref.id}
                                            executeSearch={glycanSearch}
                                          />
                                        </>
                                      ))}
                                    </div>
                                    <EvidenceList
                                      inline={true}
                                      evidences={groupEvidences(pub.evidence)}
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        )}
                      </Table> */}
                      {!publication && (
                        <p className="no-data-msg-publication">
                          {dataStatus}
                        </p>
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

export default GlycanDetail;
