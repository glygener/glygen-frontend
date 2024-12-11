import React, { useEffect, useState, useReducer } from "react";
import { getPublicationDetail } from "../data/publication";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import CssBaseline from "@mui/material/CssBaseline";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { Row, Col } from "react-bootstrap";
import Sidebar from "../components/navigation/Sidebar";
import { logActivity } from "../data/logging";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import HelpTooltip from "../components/tooltip/HelpTooltip";
import DetailTooltips from "../data/json/pubDetailTooltips.json";
import stringConstants from "../data/json/stringConstants";
import DownloadButton from "../components/DownloadButton";
import { Grid } from "@mui/material";
import FeedbackWidget from "../components/FeedbackWidget";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import Button from "react-bootstrap/Button";
import { FiBookOpen } from "react-icons/fi";
import { Tab, Tabs, Container } from "react-bootstrap";
import ClientPaginatedTable from "../components/ClientPaginatedTable";
import ClientExpandableTable from "../components/ClientExpandableTable"
import ClientServerPaginatedTable from "../components/ClientServerPaginatedTable";
import ClientServerPaginatedTableFullScreen from "../components/ClientServerPaginatedTableFullScreen";
import "../css/detail.css";
import "../css/Responsive.css";
import { Link as LinkMUI } from "@mui/material";
import LineTooltip from "../components/tooltip/LineTooltip";
import routeConstants from "../data/json/routeConstants";
import { getGlycanImageUrl } from "../data/glycan";
import { addIndex } from "../utils/common";
import EvidenceList from "../components/EvidenceList";
import { groupEvidences, groupOrganismEvidences, groupOrganismEvidencesTableView } from "../data/data-format";
import CollapsibleText from "../components/CollapsibleText";
import CollapsibleTextTableView from "../components/CollapsibleTextTableView"
import CardToggle from "../components/cards/CardToggle";
import CardLoader from "../components/load/CardLoader";

const items = [
  { label: stringConstants.sidebar.general.displayname, id: "General" },

  { label: stringConstants.sidebar.organism.displayname, id: "Organism" },
  {
    label: stringConstants.sidebar.referenced_proteins.displayname,
    id: "Referenced-Proteins",
  },
  {
    label: stringConstants.sidebar.referenced_glycans.displayname,
    id: "Referenced-Glycans",
  },
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
  { label: stringConstants.sidebar.mutagenesis.displayname, id: "Mutagenesis" },
  {
    label: stringConstants.sidebar.biomarkers.displayname,
    id: "Biomarkers",
  },
  {
    label: stringConstants.sidebar.expression.displayname,
    id: "Expression",
  },
];
const PublicationDetail = (props) => {
  let { id } = useParams();
  let { publType } = useParams();
  let { doi } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const proteinStrings = stringConstants.protein.common;
  const glycanStrings = stringConstants.glycan.common;
  const biomarkerStrings = stringConstants.biomarker.common;

  const [expressionTabSelected, setExpressionTabSelected] = useState("");
  const [expressionWithtissue, setExpressionWithtissue] = useState([]);
  const [expressionWithcell, setExpressionWithcell] = useState([]);
  const [detailData, setDetailData] = useState({});
  const [glycosylationMining, setGlycosylationMining] = useState([]);
  const [glycosylationWithImage, setGlycosylationWithImage] = useState([]);
  const [glycosylationWithoutImage, setGlycosylationWithoutImage] = useState([]);
  const [glycosylationTabSelected, setGlycosylationTabSelected] = useState("reported_with_glycan");

  const [mutataionWithdisease, setMutataionWithdisease] = useState([]);
  const [mutataionWithoutdisease, setMutataionWithoutdisease] = useState([]);
  const [mutataionTabSelected, setMutataionTabSelected] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [dataStatus, setDataStatus] = useState("Fetching Data.");
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const [sideBarData, setSidebarData] = useState(items);
  const [refProTotal, setRefProTotal] = useState(undefined);
  const [refGlyTotal, setRefGlyTotal] = useState(undefined);
  const [phosphorylationTotal, setPhosphorylationTotal] = useState(undefined);
  const [glycosylationWithImageTotal, setGlycosylationWithImageTotal] = useState(undefined);
  const [glycosylationWithoutImageTotal, setGlycosylationWithoutImageTotal] = useState(undefined);
  const [glycosylationAutoLitMinTotal, setGlycosylationAutoLitMinTotal] = useState(undefined);
  const [glycosylatioSectStat, setGlycosylationSectStat] = useState({
    "total_sites": 0,
    "Nlinked": {
      "count": 0,
      "sites": 0
    },
    "Olinked": {
      "count": 0,
      "sites": 0
    }
  });
  const [glycosylationWithImageSectStat, setGlycosylationWithImageSectStat] = useState({
    "total_sites": 0,
    "Nlinked": {
      "count": 0,
      "sites": 0
    },
    "Olinked": {
      "count": 0,
      "sites": 0
    }
  });
  const [glycosylationWithoutImageSectStat, setGlycosylationWithoutImageSectStat] = useState({
    "total_sites": 0,
    "Nlinked": {
      "count": 0,
      "sites": 0
    },
    "Olinked": {
      "count": 0,
      "sites": 0
    }
  });
  const [glycosylationAutoLitMinSectStat, setGlycosylationAutoLitMinSectStat] = useState({
    "total_sites": 0,
    "Nlinked": {
      "count": 0,
      "sites": 0
    },
    "Olinked": {
      "count": 0,
      "sites": 0
    }
  });
  const [cardLoadingGly, setCardLoadingGly] = useState(false);
  const [cardLoadingPho, setCardLoadingPho] = useState(false);
  const [cardLoadingRefPro, setCardLoadingRefPro] = useState(false);
  const [cardLoadingRefGly, setCardLoadingRefGly] = useState(false);

  const maxItems = 30;
  const maxCellItems = 9;
  const [allItems, setAllItems] = useState([]);
  const [cellLineItems, setCellLineItems] = useState([]);
  // alert(JSON.stringify(allItems, null, 2));
  const [open, setOpen] = useState(false);
  const displayedItems = open ? allItems : allItems?.slice(0, maxItems);
  const displayedCellLineItems = open ? cellLineItems : cellLineItems?.slice(0, maxCellItems);

  const [downloadId, setDownloadId] = useState("");
  const [orgExpandedRow, setOrgExpandedRow] = useReducer(
    (state, newState) => ({
      ...state, 
      ...newState,
    }),{
      orgArr: []
    }
    );

  useEffect(() => {
    setPageLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    let publId = "";
    if (id && doi && publType) {
      publId = `${id}/${doi}`;
      setDownloadId("doi." + id + "." + doi);
    } else {
      publId = id;
      setDownloadId("pubmed." + id);
    }

    logActivity("user", publId);

    const getPublData = getPublicationDetail(publId, publType);

    getPublData.then(({ data }) => {
      if (data.code) {
        let message = "Publication api call";
        logActivity("user", id, "No results. " + message);
        setPageLoading(false);
        setDataStatus("No data available.");
      } else {
        setDetailData(data);
        setAllItems(data.referenced_proteins);
        setCellLineItems(data.cell_line);
        setPageLoading(false);
        setDataStatus("No data available.");
        if (data.glycosylation) {
          const mapOfGlycosylationCategories = data.glycosylation.reduce((collection, item) => {
            const category = item.site_category || logActivity("No results. ");
            return {
              ...collection,
              [category]: [...(collection[category] || []), item],
            };
          }, {});

          const withImage = mapOfGlycosylationCategories.reported_with_glycan || [];
          const withoutImage = mapOfGlycosylationCategories.reported || [];
          const mining = mapOfGlycosylationCategories.automatic_literature_mining || [];

          const selectTab = [
            "reported_with_glycan",
            "reported",
            "automatic_literature_mining",
          ].find(
            (category) =>
              mapOfGlycosylationCategories[category] &&
              mapOfGlycosylationCategories[category].length > 0
          );
          setGlycosylationWithImage(withImage);
          setGlycosylationWithoutImage(withoutImage);
          setGlycosylationMining(mining);
          setGlycosylationTabSelected(selectTab);
        }

        if (data.glycan_expression) {
          const WithTissue = data.glycan_expression.filter((item) => item.tissue !== undefined);
          const WithCellline = data.glycan_expression.filter((item) => item.cell_line !== undefined);
          setExpressionWithtissue(WithTissue);
          setExpressionWithcell(WithCellline);
          setExpressionTabSelected(WithTissue.length > 0 ? "with_tissue" : "with_cellline");
        }

        let detailDataTemp = data;
        //new side bar
        let newSidebarData = sideBarData;
        if (!detailDataTemp.title || detailDataTemp.title.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "General", true);
        }
        if (!detailDataTemp.species || detailDataTemp.species.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Organism", true);
        }
        if (!detailDataTemp.glycosylation || detailDataTemp.glycosylation.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Glycosylation", true);
        }
        if (!detailDataTemp.phosphorylation || detailDataTemp.phosphorylation.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Phosphorylation", true);
        }
        if (!detailDataTemp.glycation || detailDataTemp.glycation.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Glycation", true);
        }
        if (!detailDataTemp.snv || detailDataTemp.snv.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Single-Nucleotide-Variation", true);
        }
        if (!detailDataTemp.mutagenesis || detailDataTemp.mutagenesis.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Mutagenesis", true);
        }

        if (!detailDataTemp.glycan_expression || detailDataTemp.glycan_expression.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Expression", true);
        }

        if (!detailDataTemp.biomarkers || detailDataTemp.biomarkers.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Biomarkers", true);
        }

        if (
          !detailDataTemp.referenced_proteins ||
          detailDataTemp.referenced_proteins.length === 0
        ) {
          newSidebarData = setSidebarItemState(newSidebarData, "Referenced-Proteins", true);
        }
        if (!detailDataTemp.referenced_glycans || detailDataTemp.referenced_glycans.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Referenced-Glycans", true);
        }

        setSidebarData(newSidebarData);
        if (data.snv) {
          const WithDisease = data.snv.filter((item) => item.keywords.includes("disease"));
          const Withoutdisease = data.snv.filter((item) => !item.keywords.includes("disease"));
          setMutataionWithdisease(WithDisease);
          setMutataionWithoutdisease(Withoutdisease);
          setMutataionTabSelected(WithDisease.length > 0 ? "with_disease" : "without_disease");
        }

        if (data.section_stats) {

          let refProt = data.section_stats.filter(obj => obj.table_id === "referenced_proteins");
          let refProtStat = refProt[0].table_stats.filter(obj => obj.field === "total");

          setRefProTotal(refProtStat[0].count);

          let refGly = data.section_stats.filter(obj => obj.table_id === "referenced_glycans");
          let refGlyStat = refGly[0].table_stats.filter(obj => obj.field === "total");

          setRefGlyTotal(refGlyStat[0].count);

          let glycosylation = data.section_stats.filter(obj => obj.table_id === "glycosylation");

          let temp = {
            "total_sites": glycosylation[0].table_stats.filter(obj => obj.field === "total_sites")[0].count,
            "Nlinked": {
              "count": glycosylation[0].table_stats.filter(obj => obj.field === "n_linked_glycans")[0].count,
              "sites": glycosylation[0].table_stats.filter(obj => obj.field === "n_linked_glycan_sites")[0].count,
            },
            "Olinked": {
              "count": glycosylation[0].table_stats.filter(obj => obj.field === "o_linked_glycans")[0].count,
              "sites": glycosylation[0].table_stats.filter(obj => obj.field === "o_linked_glycan_sites")[0].count,
            }
          };

          setGlycosylationSectStat(temp);


          let glyWithImage = data.section_stats.filter(obj => obj.table_id === "glycosylation_reported_with_glycan");
          let glyWithImageStat = glyWithImage[0].table_stats.filter(obj => obj.field === "total");

          setGlycosylationWithImageTotal(glyWithImageStat[0].count);

          let temp1 = {
            "total_sites": glyWithImage[0].table_stats.filter(obj => obj.field === "total_sites")[0].count,
            "Nlinked": {
              "count": glyWithImage[0].table_stats.filter(obj => obj.field === "n_linked_glycans")[0].count,
              "sites": glyWithImage[0].table_stats.filter(obj => obj.field === "n_linked_glycan_sites")[0].count,
            },
            "Olinked": {
              "count": glyWithImage[0].table_stats.filter(obj => obj.field === "o_linked_glycans")[0].count,
              "sites": glyWithImage[0].table_stats.filter(obj => obj.field === "o_linked_glycan_sites")[0].count,
            }
          };

          setGlycosylationWithImageSectStat(temp1);


          let glyWithoutImage = data.section_stats.filter(obj => obj.table_id === "glycosylation_reported");
          let glyWithoutImageStat = glyWithoutImage[0].table_stats.filter(obj => obj.field === "total");
          setGlycosylationWithoutImageTotal(glyWithoutImageStat[0].count);

          let temp2 = {
            "total_sites": glyWithoutImage[0].table_stats.filter(obj => obj.field === "total_sites")[0].count,
            "Nlinked": {
              "count": glyWithoutImage[0].table_stats.filter(obj => obj.field === "n_linked_glycans")[0].count,
              "sites": glyWithoutImage[0].table_stats.filter(obj => obj.field === "n_linked_glycan_sites")[0].count,
            },
            "Olinked": {
              "count": glyWithoutImage[0].table_stats.filter(obj => obj.field === "o_linked_glycans")[0].count,
              "sites": glyWithoutImage[0].table_stats.filter(obj => obj.field === "o_linked_glycan_sites")[0].count,
            }
          };

          setGlycosylationWithoutImageSectStat(temp2);

          let glyAutoLitMin = data.section_stats.filter(obj => obj.table_id === "glycosylation_automatic_literature_mining");
          let glyAutoLitMinStat = glyAutoLitMin[0].table_stats.filter(obj => obj.field === "total");
          setGlycosylationAutoLitMinTotal(glyAutoLitMinStat[0].count);

          let temp4 = {
            "total_sites": glyAutoLitMin[0].table_stats.filter(obj => obj.field === "total_sites")[0].count,
            "Nlinked": {
              "count": glyAutoLitMin[0].table_stats.filter(obj => obj.field === "n_linked_glycans")[0].count,
              "sites": glyAutoLitMin[0].table_stats.filter(obj => obj.field === "n_linked_glycan_sites")[0].count,
            },
            "Olinked": {
              "count": glyAutoLitMin[0].table_stats.filter(obj => obj.field === "o_linked_glycans")[0].count,
              "sites": glyAutoLitMin[0].table_stats.filter(obj => obj.field === "o_linked_glycan_sites")[0].count,
            }
          };

          setGlycosylationAutoLitMinSectStat(temp4);
        
          let phosphoryl = data.section_stats.filter(obj => obj.table_id === "phosphorylation");
          let phosphorylStat = phosphoryl[0].table_stats.filter(obj => obj.field === "total");
          setPhosphorylationTotal(phosphorylStat[0].count); 
          
        }
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

    getPublData.catch(({ response }) => {
      let message = "Publication api call";
      axiosError(response, id, message, setPageLoading, setAlertDialogInput);
      setDataStatus("No data available.");
    });
    // eslint-disable-next-line
  }, [id, doi, publType]);

  const {
    date,
    title,
    journal,
    reference,
    authors,
    abstract,
    species,
    glycosylation,
    phosphorylation,
    glycation,
    snv,
    mutagenesis,
    glycan_expression,
    referenced_proteins,
    referenced_glycans,
    biomarkers
  } = detailData;

  const organismEvidence = groupOrganismEvidencesTableView(species);

  const createGlycosylationSummary = (data, glycan = false) => {
    const info = {};
    // console.table(data);

    // debugger

    for (let x = 0; x < data.length; x++) {
      if (!info[data[x].type]) {
        info[data[x].type] = {
          count: 0,
          sites: [],
          glycans: []
        };
      }
      info[data[x].type].count = info[data[x].type].count + 1;

       // count sites
      if (info[data[x].type].sites.indexOf(data[x].start_pos) < 0) {
        info[data[x].type].sites.push(data[x].start_pos);
      }
     
      // count glycans
      if (glycan && info[data[x].type].glycans.indexOf(data[x].glytoucan_ac) < 0) {
        info[data[x].type].glycans.push(data[x].glytoucan_ac);
      }

    }

    const totalSites = Object.keys(info).reduce((total, key) => {
      return total + info[key].sites.length;
    }, 0);

    let glycans = (glycan ? 'glycan(s)' : 'annotation(s)');
    // use info to make a string
    return [`${totalSites} site(s) total`]
      .concat(
        Object.keys(info).sort((a, b) => a.localeCompare(b)).map(
          (key) => `${glycan ? info[key].glycans.length : info[key].count} ${key} ${glycans} at ${info[key].sites.length} site(s)`
        )
      )
      .join(", ");

    //15 sites, 31 N-linked glycans (14 sites), 1 O-linked glycan (1 site)
  };

  const createGlycosylationSummaryFromSectionStat = (sectStat, glycan = false) => {
    
    let totalSites = sectStat.total_sites;
    let info = {};

    if (sectStat.Nlinked.count > 0 || sectStat.Nlinked.sites > 0) {
      info["N-linked"] = {
        count: sectStat.Nlinked.count,
        sites: sectStat.Nlinked.sites
      }
    }

    if (sectStat.Olinked.count > 0 || sectStat.Olinked.sites > 0) {
      info["O-linked"] = {
        count: sectStat.Olinked.count,
        sites: sectStat.Olinked.sites
      }
    }

    let glycans = (glycan ? 'glycan(s)' : 'annotation(s)');

    return [`${totalSites} site(s) total`]
      .concat(
        Object.keys(info).sort((a, b) => a.localeCompare(b)).map(
          (key) => glycan ? `${info[key].count} ${key} ${glycans} at ${info[key].sites} site(s)` : `${info[key].sites} ${key} site(s)`
        )
      )
      .join(", ");

    //15 sites, 31 N-linked glycans (14 sites), 1 O-linked glycan (1 site)
  };

  /**
   * Adding toggle collapse arrow icon to card header individualy.
   * @param {object} uniprot_canonical_ac- uniprot accession ID.
   **/
  const [collapsed, setCollapsed] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState,
    }),
    {
      general: true,
      organism: true,
      glycosylation: true,
      phosphorylation: true,
      glycation: true,
      snv: true,
      expression: true,
      mutagenesis: true,
      cell_line: true,
      referenced_proteins: true,
      referenced_glycans: true,
      biomarkers: true
    }
  );
  /**
   * Adding toggle collapse arrow icon to card header individualy.
   * @param {object} name
   *  * @param {object} value
   **/
  function toggleCollapse(name, value) {
    setCollapsed({ [name]: !value });
  }

  function expandCloseTableRow(id, expand) {
    let orgExp = orgExpandedRow;
    if (expand) {
      orgExp.orgArr.push(id);
      setOrgExpandedRow(orgExp)
    } else {
      orgExp.orgArr = orgExp.orgArr.filter(org => org !== id);
      setOrgExpandedRow(orgExp)
    }  
  }

  const glycoOrganismColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      // sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList
            key={row.position + row.uniprot_canonical_ac}
            evidences={cell}
          />
        );
      }
    },
    {
      dataField: "common_name",
      text: glycanStrings.organism.shortName,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
      },
      formatter: (value, row) => (
        <>
          {row.common_name}
        </>
      )
    },
    {
      dataField: "details",
      text: glycanStrings.details.name,
      // sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "35%" };
      },
      formatter: (value, row) => (<>
          {row.annotation_count && row.species_count && <CollapsibleTextTableView text={`${row.annotation_count} annotations and ${row.species_count} Species`} id={row.common_name} handleCallback={expandCloseTableRow} />}
        </>)
    }
  ];

  const glycoOrganismExpandedColumns = [
    {
      dataField: "database",
      text: proteinStrings.evidence.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
      },
      formatter: (value, row) => (
        <>
          {value}
        </>
      )
    },
    {
      dataField: "id",
      text: glycanStrings.id.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
      },
      formatter: (value, row) => (
        <>
          {row.url ? <LinkMUI href={row.url} target="_blank" rel="noopener noreferrer">
                {value}
              </LinkMUI> : 
          <span>{value}</span>}
        </>
      )
    },
    {
      dataField: "name",
      text: glycanStrings.species_name.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
      },
      formatter: (value, row) => (
        <>
          {value}
        </>
      )
    },
    {
      dataField: "common_name",
      text: glycanStrings.organism.shortName,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
      },
      formatter: (value, row) => (
        <>
          {value}
        </>
      )
    },
    {
      dataField: "taxid",
      text: proteinStrings.tax_id.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
      },
      formatter: (value, row) => (
        <>
          {value && <LineTooltip text="View details on NCBI">
            <a
              href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${value}`}
              target="_blank"
              rel="noopener noreferrer"
            >
            {value}
            </a>
          </LineTooltip>}
        </>
      )
    },
  ];

  const refProtienColumns = [
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
      dataField: "gene_name",
      text: proteinStrings.gene_name.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
      },
      formatter: (value, row) => (
        <>
          {row.gene_name}
        </>
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

  const expressionTissueColumns = [
    {
      dataField: "uniprot_canonical_ac",
      text: proteinStrings.uniprot_canonical_ac.name,
      defaultSortField: "uniprot_canonical_ac",
      sort: true,
      headerStyle: (column, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) =>
        value ? (
          <LineTooltip text="View protein details">
            <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
              <>{row.uniprot_canonical_ac}</>
            </Link>
          </LineTooltip>
        ) : (
          "Not Reported"
        ),
    },

    {
      dataField: "glytoucan_ac",
      text: proteinStrings.glytoucan_ac.shortName,
      defaultSortField: "glytoucan_ac",
      sort: true,
      headerStyle: (column, colIndex) => {
        return {
          width: "15%",
        };
      },
      formatter: (value, row) =>
        value ? (
          <LineTooltip text="View glycan details">
            <Link to={routeConstants.glycanDetail + row.glytoucan_ac}>
              <>{row.glytoucan_ac}</>
            </Link>
          </LineTooltip>
        ) : (
          "Not Reported"
        ),
    },
    {
      dataField: "image",
      text: glycanStrings.glycan_image.name,
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          textAlign: "left",
          backgroundColor: "#4B85B6",
          color: "white",
          whiteSpace: "nowrap",
        };
      },
      formatter: (value, row) =>
       row && row.glytoucan_ac ? (
          <div className="img-wrapper">
            <>
              <img
                className="img-cartoon"
                src={getGlycanImageUrl(row.glytoucan_ac)}
                alt="Glycan img"
              />
            </>
          </div>
        ) : (
          "Not Reported"
        ),
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
        ),
    },
    {
      dataField: "tissueName",
      text: "Tissue / Bodily Fluid Expression",
      defaultSortField: "tissue",
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
    },
    {
      dataField: "abundance",
      text: "Abundance",
      defaultSortField: "abundance",
      sort: true,
      headerStyle: (column, colIndex) => {
        return {
          width: "15%",
        };
      },
    },
  ];

  const expressionCellColumns = [
    {
      dataField: "uniprot_canonical_ac",
      text: proteinStrings.uniprot_canonical_ac.name,
      defaultSortField: "uniprot_canonical_ac",
      sort: true,

      headerStyle: (column, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) =>
        value ? (
          <LineTooltip text="View protein details">
            <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
              <> {row.uniprot_canonical_ac}</>
            </Link>
          </LineTooltip>
        ) : (
          "Not Reported"
        ),
    },

    {
      dataField: "glytoucan_ac",
      text: proteinStrings.glytoucan_ac.shortName,
      defaultSortField: "glytoucan_ac",
      sort: true,
      headerStyle: (column, colIndex) => {
        return {
          width: "15%",
        };
      },
      formatter: (value, row) =>
        value ? (
          <LineTooltip text="View glycan details">
            <Link to={routeConstants.glycanDetail + row.glytoucan_ac}>
              <>{row.glytoucan_ac}</>
            </Link>
          </LineTooltip>
        ) : (
          "Not Reported"
        ),
    },
    {
      dataField: "image",
      text: glycanStrings.glycan_image.name,
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          textAlign: "left",
          backgroundColor: "#4B85B6",
          color: "white",
          whiteSpace: "nowrap",
        };
      },
      formatter: (value, row) =>
        row && row.glytoucan_ac ? (
          <div className="img-wrapper">
            <>
              <img
                className="img-cartoon"
                src={getGlycanImageUrl(row.glytoucan_ac)}
                alt="Glycan img"
              />
            </>
          </div>
        ) : (
          "Not Reported"
        ),
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
        ),
    },
    {
      dataField: "cellLineName",
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
    },
    {
      dataField: "abundance",
      text: "Abundance",
      defaultSortField: "abundance",
      sort: true,
      headerStyle: (column, colIndex) => {
        return {
          width: "15%",
        };
      },
    },
  ];

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
      dataField: "uniprot_canonical_ac",
      text: proteinStrings.uniprot_accession.name,
      // defaultSortField: "uniprot_canonical_ac",
      sort: true,
      headerStyle: (column, colIndex) => {
        return {
          width: "15%",
        };
      },
      formatter: (value, row) => 
        value ? (
        <LineTooltip text="View protein details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {row.uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      ) : (
        "Not Reported"
      ),
    },
    {
      dataField: "type",
      text: proteinStrings.type.name,
      sort: true,
    },
    {
      dataField: "glytoucan_ac",
      text: proteinStrings.glytoucan_ac.shortName,
      defaultSortField: "glytoucan_ac",
      sort: true,
      headerStyle: (column, colIndex) => {
        return {
          width: "15%",
        };
      },
      formatter: (value, row) => 
        value ? (
        <LineTooltip text="View glycan details">
          <Link to={routeConstants.glycanDetail + row.glytoucan_ac}>{row.glytoucan_ac}</Link>
        </LineTooltip>
      ) : (
        "Not Reported"
      ),
    },
    {
      dataField: "image",
      text: glycanStrings.glycan_image.name,
      sort: false,
      formatter: (value, row) => (
        <div className="img-wrapper">
          <img className="img-cartoon" src={getGlycanImageUrl(row.glytoucan_ac)} alt="Glycan img" />
        </div>
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
      dataField: "start_pos",
      text: proteinStrings.residue.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
        };
      },
      formatter: (value, row) =>
        value ? (row.start_pos !== row.end_pos ? (
          <span>
            {row.start_aa}
            {row.start_pos}
            {" to "}
            {row.end_aa}
            {row.end_pos}
          </span>
        ) : (
          <LineTooltip text="View siteview details">
            <Link to={`${routeConstants.siteview}${row.uniprot_canonical_ac}/${row.start_pos}`}>
              {row.residue}
              {row.start_pos}
            </Link>
          </LineTooltip>)
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
          width: "35%",
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
      dataField: "uniprot_canonical_ac",
      text: proteinStrings.uniprot_accession.name,
      // defaultSortField: "uniprot_canonical_ac",
      sort: true,
      headerStyle: (column, colIndex) => {
        return {
          // width: "25%",
        };
      },
      formatter: (value, row) => (
        <LineTooltip text="View protein details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {row.uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      ),
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
      dataField: "start_pos",
      text: proteinStrings.residue.name,
      sort: true,
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
        ),
    },
    {
      dataField: "comment",
      text: "Note",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          width: "30%",
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
      dataField: "uniprot_canonical_ac",
      text: proteinStrings.uniprot_accession.name,
      // defaultSortField: "uniprot_canonical_ac",
      sort: true,
      headerStyle: (column, colIndex) => {
        return {
          // width: "25%",
        };
      },
      formatter: (value, row) => (
        <LineTooltip text="View protein details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {row.uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      ),
    },
    {
      dataField: "comment",
      text: "Filter Annotations",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          width: "30%",
        };
      },
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
      dataField: "start_pos",
      text: proteinStrings.startpos.name,

      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
        };
      },
      formatter: (value, row) => (
        <LineTooltip text="View siteview details">
          <Link to={`${routeConstants.siteview}${row.uniprot_canonical_ac}/${row.start_pos}`}>
            {row.start_pos}
          </Link>
          {/* <Link to={`${routeConstants.siteview}${id}/${row.start_pos}`}>{row.start_pos}</Link> */}
        </LineTooltip>
      ),
    },
    {
      dataField: "end_pos",
      text: proteinStrings.endpos.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
        };
      },
      formatter: (value, row) => (
        <LineTooltip text="View siteview details">
          <Link to={`${routeConstants.siteview}${row.uniprot_canonical_ac}/${row.end_pos}`}>
            {row.end_pos}
          </Link>
          {/* <Link to={`${routeConstants.siteview}${id}/${row.end_pos}`}>{row.end_pos}</Link> */}
        </LineTooltip>
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
          {value.map((disease, index) => (
            <ul key={index} className="ps-3">
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
      dataField: "start_pos",
      text: proteinStrings.residue.name,
      sort: true,
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
      dataField: "uniprot_canonical_ac",
      text: proteinStrings.uniprot_accession.name,
      // defaultSortField: "uniprot_canonical_ac",
      sort: true,
      headerStyle: (column, colIndex) => {
        return {
          // width: "25%",
        };
      },
      formatter: (value, row) => (
        <LineTooltip text="View protein details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {row.uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      ),
    },
    {
      dataField: "start_pos",
      text: proteinStrings.startpos.name,
      sort: true,
      defaultSortField: "start_pos",
      sortFunc: (a, b, order, start_pos) => {
        if (order === "asc") {
          return b - a;
        }
        return a - b; // desc
      },
    },
    {
      dataField: "end_pos",
      text: proteinStrings.endpos.name,
      sort: true,
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
  const refGlycansColumns = [
    {
      dataField: "glytoucan_ac",
      text: proteinStrings.glytoucan_ac.shortName,
      defaultSortField: "glytoucan_ac",
      sort: true,
      headerStyle: (column, colIndex) => {
        return {
          width: "30%",
          whiteSpace: "nowrap",
        };
      },
      formatter: (value, row) => (
        <LineTooltip text="View glycan details">
          <Link to={`${routeConstants.glycanDetail}${value}`}>{value}</Link>
        </LineTooltip>
      ),
    },
    {
      dataField: "image",
      text: glycanStrings.glycan_image.name,
      sort: false,
      formatter: (value, row) => (
        <div className="img-wrapper">
          <img className="img-cartoon" src={getGlycanImageUrl(row.glytoucan_ac)} alt="Glycan img" />
        </div>
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
  ];

  const biomarkerColumns = [
    {
      dataField: "biomarker_id",
      text: biomarkerStrings.biomarker_id.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View biomarker details">
          <Link to={routeConstants.biomarkerDetail + row.biomarker_id}>{row.biomarker_id}</Link>
        </LineTooltip>
      ),
    },
    {
      dataField: "biomarker",
      text: biomarkerStrings.biomarker.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
    },
    {
      dataField: "assessed_biomarker_entity",
      text: biomarkerStrings.assessed_biomarker_entity.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
    }
  ];

  const setSidebarItemState = (items, itemId, disabledState) => {
    return items.map((item) => {
      return {
        ...item,
        disabled: item.id === itemId ? disabledState : item.disabled,
      };
    });
  };
  function sortIgnoreCase(a, b) {
    if (a.toLowerCase() > b.toLowerCase()) {
      return 1;
    }
    if (b.toLowerCase() > a.toLowerCase()) {
      return -1;
    }
    return 0;
  }

  return (
    <>
      <Helmet>
        {getTitle("publicationDetail", {
          id:
            reference && `${reference.id}/${reference.type}`
              ? `${reference.id}/${reference.type}`
              : "",
        })}
        {getMeta("publicationDetail")}
      </Helmet>
      <CssBaseline />
      <div id="top-heading"></div>
      <Row className="gg-baseline">
        <Col sm={12} md={12} lg={12} xl={3} className="sidebar-col">
          <Sidebar items={sideBarData} />
        </Col>
        <Col sm={12} md={12} lg={12} xl={9} className="sidebar-page">
          <div className="sidebar-page-mb">
            <div>
              <Row>
                <Grid item xs={12} sm={12} className="text-center mt-4">
                  <div className="horizontal-heading">
                    <h5>Look At</h5>
                    <h2>
                      <span>
                        <strong className="nowrap">Publication</strong> Specific Detail for
                        {reference && (
                          <div>
                            <strong className="nowrap">
                              {reference.type}: {reference.id}
                            </strong>
                          </div>
                        )}
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
                    display: stringConstants.download.publication_jsondata.displayname,
                    type: "json",
                    data: "publication_detail",
                  },
                ]}
                dataId={id}
                itemType="publication_detail"
              />
            </div>
            <FeedbackWidget />
            <PageLoader pageLoading={pageLoading} />
            <DialogAlert
              alertInput={alertDialogInput}
              setOpen={(input) => {
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
                      title={DetailTooltips.publication.general.title}
                      text={DetailTooltips.publication.general.text}
                      urlText={DetailTooltips.publication.general.urlText}
                      url={DetailTooltips.publication.general.url}
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
                    {title && (
                      <div>
                        <h5 style={{ marginBottom: "3px" }}>
                          <strong>{title}</strong>
                        </h5>
                      </div>
                    )}
                    {authors && <div>{authors}</div>}
                    {journal && (
                      <div>
                        {journal} <span>&nbsp;</span>
                        {"("}
                        {date}
                        {")"}
                      </div>
                    )}
                    {reference && (
                      <div>
                        <FiBookOpen />
                        <span style={{ paddingLeft: "15px" }}>{reference.type}:</span>{" "}
                        <a href={reference.url} target="_blank" rel="noopener noreferrer">
                          <>{reference.id}</>
                        </a>{" "}
                      </div>
                    )}
                    {abstract && (
                      <div className={"mt-2"}>
                        <strong>Abstract:</strong>
                        <CollapsibleText text={abstract} />
                      </div>
                    )}
                    {!title && <span>{dataStatus}</span>}
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
                      title={DetailTooltips.publication.organism.title}
                      text={DetailTooltips.publication.organism.text}
                      urlText={DetailTooltips.publication.organism.urlText}
                      url={DetailTooltips.publication.organism.url}
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
                        {organismEvidence && organismEvidence.length > 0 && <ClientExpandableTable
                          data={organismEvidence}
                          orgExpandedRow={orgExpandedRow}
                          columns={glycoOrganismColumns}
                          expandableTableColumns={glycoOrganismExpandedColumns}
                          defaultSortField={"common_name"}
                          onClickTarget={"#publication"} 
                        /> }
                      {!species && (
                        <p className="no-data-msg">{dataStatus}</p>
                      )}
                    </Row>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
             {/* Referenced-Proteins */}
             <Accordion
              id="Referenced-Proteins"
              defaultActiveKey="0"
              className="panel-width"
              style={{ padding: "20px 0" }}
            >
              <Card>
                <CardLoader pageLoading={cardLoadingRefPro} />
                <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                  <span className="gg-green d-inline">
                    <HelpTooltip
                      title={DetailTooltips.publication.referenced_proteins.title}
                      text={DetailTooltips.publication.referenced_proteins.text}
                      urlText={DetailTooltips.publication.referenced_proteins.urlText}
                      url={DetailTooltips.publication.referenced_proteins.url}
                      helpIcon="gg-helpicon-detail"
                    />
                  </span>
                  <h4 className="gg-green d-inline">
                    {stringConstants.sidebar.referenced_proteins.displayname}
                  </h4>
                  <div className="float-end">
                    <span className="gg-download-btn-width text-end">
                      <DownloadButton
                        types={[
                          {
                            display: "Referenced Proteins (*.csv)",
                            type: "publication_section_csv",
                            format: "csv",   
                            data: "publication_section",
                            section: "referenced_proteins",
                          }
                        ]}
                        dataId={downloadId}
                        itemType="publication_section"
                        showBlueBackground={true}
                        enable={referenced_proteins && referenced_proteins.length > 0}
                      />
                    </span>

                    <CardToggle cardid="referenced_proteins" toggle={collapsed.referenced_proteins} eventKey="0" toggleCollapse={toggleCollapse}/>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>               
                    {refProTotal !== undefined && referenced_proteins && referenced_proteins.length > 0 && (
                      <ClientServerPaginatedTableFullScreen
                        data={referenced_proteins}
                        columns={refProtienColumns}
                        onClickTarget={"#referenced_proteins"}
                        defaultSortField="uniprot_canonical_ac"
                        defaultSortOrder="asc"
                        record_type={"publication"}
                        table_id={"referenced_proteins"}
                        record_id={id}
                        serverPagination={true}
                        totalDataSize={refProTotal}
                        setAlertDialogInput={setAlertDialogInput}
                        setCardLoading={setCardLoadingRefPro}
                        setPageLoading={setPageLoading}
                        viewPort={true}
                        title="Referenced Proteins"
                        download={
                          {
                              types:[
                                {
                                  display: "Referenced Proteins (*.csv)",
                                  type: "publication_section_csv",
                                  format: "csv",   
                                  data: "publication_section",
                                  section: "referenced_proteins",
                                }
                              ],
                             dataId:downloadId,
                             itemType:"publication_section"
                          }
                        }
                      />
                    )}
                    {!referenced_proteins && <span>{dataStatus}</span>}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            {/* Referenced-Glycans */}
            <Accordion
              id="Referenced-Glycans"
              defaultActiveKey="0"
              className="panel-width"
              style={{ padding: "20px 0" }}
            >
              <Card>
                <CardLoader pageLoading={cardLoadingRefGly} />
                <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                  <span className="gg-green d-inline">
                    <HelpTooltip
                      title={DetailTooltips.publication.referenced_glycans.title}
                      text={DetailTooltips.publication.referenced_glycans.text}
                      urlText={DetailTooltips.publication.referenced_glycans.urlText}
                      url={DetailTooltips.publication.referenced_glycans.url}
                      helpIcon="gg-helpicon-detail"
                    />
                  </span>
                  <h4 className="gg-green d-inline">
                    {stringConstants.sidebar.referenced_glycans.displayname}
                  </h4>
                  <div className="float-end">
                    
                    <span className="gg-download-btn-width text-end">
                      <DownloadButton
                        types={[
                          {
                            display: "Referenced Glycans (*.csv)",
                            type: "publication_section_csv",
                            format: "csv",   
                            data: "publication_section",
                            section: "referenced_glycans",
                          }
                        ]}
                        dataId={downloadId}
                        itemType="publication_section"
                        showBlueBackground={true}
                        enable={referenced_glycans && referenced_glycans.length > 0}
                      />
                    </span>

                    <CardToggle cardid="referenced_glycans" toggle={collapsed.referenced_glycans} eventKey="0" toggleCollapse={toggleCollapse}/>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    {refGlyTotal !== undefined && referenced_glycans && (
                      <ClientServerPaginatedTableFullScreen
                        data={referenced_glycans}
                        columns={refGlycansColumns}
                        onClickTarget={"#referenced-glycans"}
                        defaultSortField="glytoucan_ac"
                        defaultSortOrder="asc"
                        idField={"glytoucan_ac"}
                        record_type={"publication"}
                        table_id={"referenced_glycans"}
                        record_id={id}
                        serverPagination={true}
                        totalDataSize={refGlyTotal}
                        setAlertDialogInput={setAlertDialogInput}
                        setCardLoading={setCardLoadingRefGly}
                        setPageLoading={setPageLoading}
                        viewPort={true}
                        title="Referenced Glycans"
                        download={
                          {
                              types:[
                                {
                                  display: "Referenced Glycans (*.csv)",
                                  type: "publication_section_csv",
                                  format: "csv",   
                                  data: "publication_section",
                                  section: "referenced_glycans",
                                }
                              ],
                             dataId:downloadId,
                             itemType:"publication_section"
                          }
                        }
                      />
                    )}
                    {!referenced_glycans && <span>{dataStatus}</span>}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            {/* glycosylation */}
            <Accordion
              id="Glycosylation"
              defaultActiveKey="0"
              className="panel-width"
              style={{ padding: "20px 0" }}
            >
              <Card>
                <CardLoader pageLoading={cardLoadingGly} />
                <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                  <span className="gg-green d-inline">
                    <HelpTooltip
                      title={DetailTooltips.publication.glycosylation.title}
                      text={DetailTooltips.publication.glycosylation.text}
                      urlText={DetailTooltips.publication.glycosylation.urlText}
                      url={DetailTooltips.publication.glycosylation.url}
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
                          glycosylationWithImage && glycosylationWithImage.length > 0  && {
                            display: "Reported Sites with Glycan (*.csv)",
                            type: "glycosylation_reported_with_glycans_csv",
                            format: "csv",
                            data: "publication_section",
                            section: "glycosylation_reported_with_glycans",
                          },
                          glycosylationWithoutImage && glycosylationWithoutImage.length > 0 && {
                            display: "Reported Sites (*.csv)",
                            type: "glycosylation_reported_csv",
                            format: "csv",
                            data: "publication_section",
                            section: "glycosylation_reported",
                          },
                          glycosylationMining && glycosylationMining.length > 0 && {
                            display: "Text Mining (*.csv)",
                            type: "glycosylation_automatic_literature_mining_csv",
                            format: "csv",
                            data: "publication_section",
                            section: "glycosylation_automatic_literature_mining",
                          }
                        ]}
                        dataId={downloadId}
                        itemType="publication_section"
                        showBlueBackground={true}
                        enable={(glycosylationWithImage && glycosylationWithImage.length > 0) ||
                          (glycosylationWithoutImage && glycosylationWithoutImage.length > 0) ||
                          (glycosylationMining && glycosylationMining.length > 0)}
                      />
                    </span>
                    <CardToggle cardid="glycosylation" toggle={collapsed.glycosylation} eventKey="0" toggleCollapse={toggleCollapse}/>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    {glycosylation && glycosylation.length && (
                      <>
                        <div className="Glycosummary">
                          <strong>Glycosylation Summary:</strong>{" "}
                          {createGlycosylationSummaryFromSectionStat(glycosylatioSectStat)}
                        </div>
                        <Tabs
                          activeKey={glycosylationTabSelected}
                          transition={false}
                          mountOnEnter={true}
                          unmountOnExit={true}
                          onSelect={(key) => {
                            setGlycosylationTabSelected(key);
                          }}
                        >
                          <Tab eventKey="reported_with_glycan" title="Reported Sites with Glycan"
                            tabClassName={(!glycosylationWithImage || (glycosylationWithImage.length === 0)) ? "tab-disabled" : ""}
                            disabled={(!glycosylationWithImage || (glycosylationWithImage.length === 0))}
                          >
                            {glycosylationWithImage && glycosylationWithImage.length > 0 && (
                              <div className="Glycosummary">
                                <strong>Summary:</strong>{" "}
                                {createGlycosylationSummaryFromSectionStat(glycosylationWithImageSectStat, true)}
                              </div>
                            )}

                            <Container className="tab-content-padding tab-bigscreen">
                              {glycosylationWithImageTotal !== undefined && glycosylationWithImage && glycosylationWithImage.length > 0 && (
                                <ClientServerPaginatedTableFullScreen
                                  data={glycosylationWithImage}
                                  columns={glycoSylationColumns}
                                  onClickTarget={"#glycosylation"}
                                  defaultSortField="start_pos"
                                  defaultSortOrder="asc"
                                  record_type={"publication"}
                                  table_id={"glycosylation_reported_with_glycan"}
                                  record_id={id}
                                  serverPagination={true}
                                  totalDataSize={glycosylationWithImageTotal}
                                  setAlertDialogInput={setAlertDialogInput}
                                  setCardLoading={setCardLoadingGly}
                                  setPageLoading={setPageLoading}
                                  viewPort={true}
                                  title="Glycosylation - Reported Sites with Glycan"
                                  download={
                                    {
                                        types:[
                                          {
                                            display: "Reported Sites with Glycan (*.csv)",
                                            type: "glycosylation_reported_with_glycans_csv",
                                            format: "csv",
                                            data: "publication_section",
                                            section: "glycosylation_reported_with_glycans",
                                          }
                                        ],
                                       dataId:downloadId,
                                       itemType:"publication_section"
                                    }
                                  }
                                />
                              )}
                              {!glycosylationWithImage.length && (
                                <div className="tab-content-padding tab-bigscreen">{dataStatus}</div>
                              )}
                            </Container>
                          </Tab>
                          <Tab eventKey="reported" title="Reported Sites"
                            tabClassName={(!glycosylationWithoutImage || (glycosylationWithoutImage.length === 0)) ? "tab-disabled" : ""}
                            disabled={(!glycosylationWithoutImage || (glycosylationWithoutImage.length === 0))}
                          >
                            {glycosylationWithoutImage && glycosylationWithoutImage.length !== 0 && (
                              <div className="Glycosummary">
                                <strong>Summary:</strong>{" "}
                                {createGlycosylationSummaryFromSectionStat(glycosylationWithoutImageSectStat)}
                              </div>
                            )}
                            <Container className="tab-content-padding tab-bigscreen">
                              {glycosylationWithoutImageTotal !== undefined && glycosylationWithoutImage &&
                                glycosylationWithoutImage.length > 0 && (
                                  <ClientServerPaginatedTableFullScreen
                                    data={glycosylationWithoutImage}
                                    columns={glycoSylationColumns.filter(
                                      (column) =>
                                        column.dataField !== "glytoucan_ac" &&
                                        column.dataField !== "image"
                                    )}
                                    onClickTarget={"#glycosylation"}
                                    defaultSortField="start_pos"
                                    defaultSortOrder="asc"
                                    record_type={"publication"}
                                    table_id={"glycosylation_reported"}
                                    record_id={id}
                                    serverPagination={true}
                                    totalDataSize={glycosylationWithoutImageTotal}
                                    setAlertDialogInput={setAlertDialogInput}
                                    setCardLoading={setCardLoadingGly}
                                    setPageLoading={setPageLoading}
                                    viewPort={true}
                                    title="Glycosylation - Reported Sites"
                                    download={
                                      {
                                          types:[
                                            {
                                              display: "Reported Sites (*.csv)",
                                              type: "glycosylation_reported_csv",
                                              format: "csv",
                                              data: "publication_section",
                                              section: "glycosylation_reported",
                                            }
                                          ],
                                         dataId:downloadId,
                                         itemType:"publication_section"
                                      }
                                    }
                                  />
                                )}
                              {!glycosylationWithoutImage.length && (
                                <div className="tab-content-padding tab-bigscreen">{dataStatus}</div>
                              )}
                            </Container>
                          </Tab>
                          <Tab eventKey="automatic_literature_mining" title="Text Mining"
                            tabClassName={(!glycosylationMining || (glycosylationMining.length === 0)) ? "tab-disabled" : ""}
                            disabled={(!glycosylationMining || (glycosylationMining.length === 0))}
                          >
                            {glycosylationMining && glycosylationMining.length !== 0 && (
                              <div className="Glycosummary">
                                <strong>Summary:</strong>{" "}
                                {createGlycosylationSummaryFromSectionStat(glycosylationAutoLitMinSectStat)}
                              </div>
                            )}
                            <Container className="tab-content-padding tab-bigscreen">
                              {glycosylationAutoLitMinTotal !== undefined && glycosylationMining && glycosylationMining.length > 0 && (
                                <ClientServerPaginatedTableFullScreen
                                  data={glycosylationMining}
                                  columns={glycoSylationColumns.filter(
                                    (column) =>
                                      column.dataField !== "glytoucan_ac" &&
                                      column.dataField !== "image"
                                  )}
                                  onClickTarget={"#glycosylation"}
                                  defaultSortField="start_pos"
                                  defaultSortOrder="asc"
                                  record_type={"publication"}
                                  table_id={"glycosylation_automatic_literature_mining"}
                                  record_id={id}
                                  serverPagination={true}
                                  totalDataSize={glycosylationAutoLitMinTotal}
                                  setAlertDialogInput={setAlertDialogInput}
                                  setCardLoading={setCardLoadingGly}
                                  setPageLoading={setPageLoading}
                                  viewPort={true}
                                  title="Glycosylation - Text Mining"
                                  download={
                                    {
                                        types:[
                                          {
                                            display: "Text Mining (*.csv)",
                                            type: "glycosylation_automatic_literature_mining_csv",
                                            format: "csv",
                                            data: "publication_section",
                                            section: "glycosylation_automatic_literature_mining",
                                          }
                                        ],
                                       dataId:downloadId,
                                       itemType:"publication_section"
                                    }
                                  }
                                />
                              )}
                              {!glycosylationMining.length && (
                                <div className="tab-content-padding tab-bigscreen">{dataStatus}</div>
                              )}
                            </Container>
                          </Tab>
                        </Tabs>
                      </>
                    )}
                    {!glycosylation && <span>{dataStatus}</span>}
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
                <CardLoader pageLoading={cardLoadingPho} />
                <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                  <span className="gg-green d-inline">
                    <HelpTooltip
                      title={DetailTooltips.publication.phosphorylation.title}
                      text={DetailTooltips.publication.phosphorylation.text}
                      urlText={DetailTooltips.publication.phosphorylation.urlText}
                      url={DetailTooltips.publication.phosphorylation.url}
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
                          data: "publication_section",
                          section: "phosphorylation",
                        }
                      ]}
                      dataId={downloadId}
                      itemType="publication_section"
                      showBlueBackground={true}
                      enable={phosphorylation && phosphorylation.length > 0}
                    />
                  </span>

                    <CardToggle cardid="phosphorylation" toggle={collapsed.phosphorylation} eventKey="0" toggleCollapse={toggleCollapse}/>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    {phosphorylationTotal !== undefined && phosphorylation && phosphorylation.length !== 0 && (
                      <ClientServerPaginatedTableFullScreen
                        data={phosphorylation}
                        columns={phosphorylationColumns}
                        onClickTarget={"#phosphorylation"}
                        defaultSortField={"start_pos"}
                        defaultSortOrder="asc"
                        record_type={"publication"}
                        table_id={"phosphorylation"}
                        record_id={id}
                        serverPagination={true}
                        totalDataSize={phosphorylationTotal}
                        setAlertDialogInput={setAlertDialogInput}
                        setCardLoading={setCardLoadingPho}
                        setPageLoading={setPageLoading}
                        viewPort={true}
                        title="Phosphorylation"
                        download={
                          {
                              types:[
                                {
                                  display: "Phosphorylation (*.csv)",
                                  type: "phosphorylation_csv",
                                  format: "csv",
                                  data: "publication_section",
                                  section: "phosphorylation",
                                }
                              ],
                             dataId:downloadId,
                             itemType:"publication_section"
                          }
                        }
                      />
                    )}
                    {!phosphorylation && <span>{dataStatus}</span>}
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
                      title={DetailTooltips.publication.glycation.title}
                      text={DetailTooltips.publication.glycation.text}
                      urlText={DetailTooltips.publication.glycation.urlText}
                      url={DetailTooltips.publication.glycation.url}
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
                            data: "publication_section",
                            section: "glycation",
                          }
                        ]}
                        dataId={downloadId}
                        itemType="publication_section"
                        showBlueBackground={true}
                        enable={glycation && glycation.length > 0}
                      />
                    </span>

                    <CardToggle cardid="glycation" toggle={collapsed.glycation} eventKey="0" toggleCollapse={toggleCollapse}/>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    {glycation && glycation.length !== 0 && (
                      <ClientServerPaginatedTableFullScreen
                        data={glycation
                          .map((x) => ({
                            ...x,
                            start_pos: parseInt(x.start_pos),
                            end_pos: parseInt(x.end_pos),
                          }))
                          .sort((a, b) => {
                            if (a.start_pos < b.start_pos) return -1;
                            if (b.start_pos < a.start_pos) return 1;
                            return 0;
                          })}
                        columns={glycationColumns}
                        onClickTarget={"#glycation"}
                        defaultSortField={"start_pos"}
                        defaultSortOrder="asc"
                        viewPort={true}
                        title="Glycation"
                        download={
                          {
                              types:[
                                {
                                  display: "Glycation (*.csv)",
                                  type: "glycation_csv",
                                  format: "csv",
                                  data: "publication_section",
                                  section: "glycation",
                                }
                              ],
                             dataId:downloadId,
                             itemType:"publication_section"
                          }
                        }
                      />
                    )}
                    {!glycation && <span>{dataStatus}</span>}
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
                      title={DetailTooltips.publication.snv.title}
                      text={DetailTooltips.publication.snv.text}
                      urlText={DetailTooltips.publication.snv.urlText}
                      url={DetailTooltips.publication.snv.url}
                      helpIcon="gg-helpicon-detail"
                    />
                  </span>
                  <h4 className="gg-green d-inline">{stringConstants.sidebar.snv.displayname}</h4>

                  <div className="float-end">
                  <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            mutataionWithdisease && mutataionWithdisease.length > 0 && {
                              display: "Disease Associated Mutations (*.csv)",
                              type: "snv_disease_associated_mutations_csv",
                              format: "csv",
                              data: "publication_section",
                              section: "snv_disease_associated_mutations",
                            },
                            mutataionWithoutdisease && mutataionWithoutdisease.length > 0 && {
                              display: "Non-disease Associated Mutations (*.csv)",
                              type: "snv_non_disease_associated_mutations_csv",
                              format: "csv",
                              data: "publication_section",
                              section: "snv_non_disease_associated_mutations",
                            }
                          ]}
                          dataId={downloadId}
                          itemType="publication_section"
                          showBlueBackground={true}
                          enable={(mutataionWithdisease && mutataionWithdisease.length > 0) ||
                            (mutataionWithoutdisease && mutataionWithoutdisease.length > 0)}
                        />
                      </span>
                    <CardToggle cardid="snv" toggle={collapsed.snv} eventKey="0" toggleCollapse={toggleCollapse}/>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    {snv && snv.length !== 0 && (
                      <Tabs
                        // activeKey={mutataionTabSelected}
                        defaultActiveKey={
                          mutataionWithdisease && mutataionWithdisease.length > 0
                            ? "without_disease"
                            : "with_disease"
                        }
                        transition={false}
                        mountOnEnter={true}
                        unmountOnExit={true}
                      >
                        <Tab
                          eventKey="with_disease"
                          title="Disease associated
														Mutations"
                          tabClassName={(!mutataionWithdisease || (mutataionWithdisease.length === 0)) ? "tab-disabled" : ""}
                          disabled={(!mutataionWithdisease || (mutataionWithdisease.length === 0))}
                        >
                          <Container className="tab-content-padding tab-bigscreen">
                            {mutataionWithdisease && mutataionWithdisease.length > 0 && (
                              <ClientServerPaginatedTableFullScreen
                                data={mutataionWithdisease}
                                columns={mutationColumns}
                                onClickTarget={"#mutation"}
                                defaultSortField="start_pos"
                                defaultSortOrder="asc"
                                viewPort={true}
                                title="Disease Associated Mutations"
                                download={
                                  {
                                      types:[
                                        {
                                          display: "Disease Associated Mutations (*.csv)",
                                          type: "snv_disease_associated_mutations_csv",
                                          format: "csv",
                                          data: "publication_section",
                                          section: "snv_disease_associated_mutations",
                                        }
                                      ],
                                     dataId:downloadId,
                                     itemType:"publication_section"
                                  }
                                }
                              />
                            )}
                            {!mutataionWithdisease.length && <span>{dataStatus}</span>}
                          </Container>
                        </Tab>
                        <Tab
                          eventKey="without_disease"
                          title="Non-disease associated
														Mutations "
                          tabClassName={(!mutataionWithoutdisease || (mutataionWithoutdisease.length === 0)) ? "tab-disabled" : ""}
                          disabled={(!mutataionWithoutdisease || (mutataionWithoutdisease.length === 0))}
                        >
                          <Container className="tab-content-padding tab-bigscreen">
                            {mutataionWithoutdisease && mutataionWithoutdisease.length > 0 && (
                              <ClientServerPaginatedTableFullScreen
                                data={mutataionWithoutdisease}
                                columns={mutationColumns.filter(
                                  (column) => column.dataField !== "disease"
                                )}
                                onClickTarget={"#mutation"}
                                defaultSortField="start_pos"
                                defaultSortOrder="asc"
                                viewPort={true}
                                title="Non-disease Associated Mutations"
                                download={
                                  {
                                      types:[
                                        {
                                          display: "Non-disease Associated Mutations (*.csv)",
                                          type: "snv_non_disease_associated_mutations_csv",
                                          format: "csv",
                                          data: "publication_section",
                                          section: "snv_non_disease_associated_mutations",
                                        }
                                      ],
                                     dataId:downloadId,
                                     itemType:"publication_section"
                                  }
                                }
                              />
                            )}
                            {!mutataionWithoutdisease.length && <span>{dataStatus}</span>}
                          </Container>
                        </Tab>
                      </Tabs>
                    )}

                    {!snv && <span>{dataStatus}</span>}
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
                      title={DetailTooltips.publication.mutagenesis.title}
                      text={DetailTooltips.publication.mutagenesis.text}
                      urlText={DetailTooltips.publication.mutagenesis.urlText}
                      url={DetailTooltips.publication.mutagenesis.url}
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
                              data: "publication_section",
                              section: "mutagenesis",
                            }
                          ]}
                          dataId={downloadId}
                          itemType="publication_section"
                          showBlueBackground={true}
                          enable={mutagenesis && mutagenesis.length > 0}
                        />
                      </span>
                    <CardToggle cardid="mutagenesis" toggle={collapsed.mutagenesis} eventKey="0" toggleCollapse={toggleCollapse}/>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    {mutagenesis && mutagenesis.length !== 0 && (
                      <ClientServerPaginatedTableFullScreen
                        data={addIndex(mutagenesis)}
                        columns={mutagenesisColumns}
                        idField={"index"}
                        onClickTarget={"#mutagenesis"}
                        defaultSortField={"start_pos"}
                        defaultSortOrder="asc"
                        viewPort={true}
                        title="Mutagenesis"
                        download={
                          {
                              types:[
                                {
                                  display: "Mutagenesis (*.csv)",
                                  type: "mutagenesis_csv",
                                  format: "csv",
                                  data: "publication_section",
                                  section: "mutagenesis",
                                }
                              ],
                             dataId:downloadId,
                             itemType:"publication_section"
                          }
                        }
                      />
                    )}
                    {!mutagenesis && <span>{dataStatus}</span>}
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
                      title={DetailTooltips.publication.biomarkers.title}
                      text={DetailTooltips.publication.biomarkers.text}
                      urlText={DetailTooltips.publication.biomarkers.urlText}
                      url={DetailTooltips.publication.biomarkers.url}
                      helpIcon="gg-helpicon-detail"
                    />
                  </span>
                  <h4 className="gg-green d-inline">
                    {stringConstants.sidebar.biomarkers.displayname}
                  </h4>
                  <div className="float-end">
                    <span className="gg-download-btn-width text-end">
                      <DownloadButton
                        types={[
                          {
                            display: "Biomarkers (*.csv)",
                            type: "biomarkers_csv",
                            format: "csv",
                            data: "publication_section",
                            section: "biomarkers",
                          }
                        ]}
                        dataId={id}
                        itemType="publication_section"
                        showBlueBackground={true}
                        enable={biomarkers && biomarkers.length > 0}
                      />
                    </span>
                    <CardToggle cardid="biomarkers" toggle={collapsed.biomarkers} eventKey="0" toggleCollapse={toggleCollapse}/>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    {biomarkers && biomarkers.length !== 0 && (
                      <ClientServerPaginatedTableFullScreen
                        data={biomarkers}
                        columns={biomarkerColumns}
                        onClickTarget={"#biomarkers"}
                        defaultSortField={"biomarker_id"}
                        defaultSortOrder={"asc"}
                        viewPort={true}
                        title="Biomarkers"
                        download={
                          {
                              types:[
                                {
                                  display: "Biomarkers (*.csv)",
                                  type: "biomarkers_csv",
                                  format: "csv",
                                  data: "publication_section",
                                  section: "biomarkers",
                                }
                              ],
                             dataId:id,
                             itemType:"publication_section"
                          }
                        }
                      />
                    )}
                    {!biomarkers && <p>{dataStatus}</p>}
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
                <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                  <span className="gg-green d-inline">
                    <HelpTooltip
                      title={DetailTooltips.publication.expression.title}
                      text={DetailTooltips.publication.expression.text}
                      urlText={DetailTooltips.publication.expression.urlText}
                      url={DetailTooltips.publication.expression.url}
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
                              data: "publication_section",
                              section: "expression_tissue",
                            },
                            expressionWithcell && expressionWithcell.length > 0 && {
                              display: "Cell / Cell Line Expression (*.csv)",
                              type: "expression_cell_line_csv",
                              format: "csv",
                              data: "publication_section",
                              section: "expression_cell_line",
                            }
                          ]}
                          dataId={downloadId}
                          itemType="publication_section"
                          showBlueBackground={true}
                          enable={(expressionWithtissue && expressionWithtissue.length > 0) ||
                            (expressionWithcell && expressionWithcell.length > 0)}
                        />
                      </span>
                    <CardToggle cardid="expression" toggle={collapsed.expression} eventKey="0" toggleCollapse={toggleCollapse}/>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    {glycan_expression && glycan_expression.length > 0 && (
                      <Tabs
                        activeKey={expressionTabSelected}
                        onSelect={(key) => {
                          setExpressionTabSelected(key);
                        }}
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
                          <Container className="tab-content-padding tab-bigscreen">
                            {expressionWithtissue && expressionWithtissue.length > 0 && (
                              <ClientServerPaginatedTableFullScreen
                                data={expressionWithtissue.map(data => {return {...data, tissueName: (data.tissue ? data.tissue.name : "")}})}
                                columns={expressionTissueColumns}
                                onClickTarget={"#expression"}
                                defaultSortField="start_pos"
                                viewPort={true}
                                title="Expression - Tissue / Bodily Fluid Expression"
                                download={
                                  {
                                      types:[
                                        {
                                          display: "Tissue / Bodily Fluid Expression (*.csv)",
                                          type: "expression_tissue_csv",
                                          format: "csv",
                                          data: "publication_section",
                                          section: "expression_tissue",
                                        }
                                      ],
                                     dataId:downloadId,
                                     itemType:"publication_section"
                                  }
                                }
                              />
                            )}
                            {!expressionWithtissue.length && <p>{dataStatus}</p>}
                          </Container>
                        </Tab>
                        <Tab eventKey="with_cellline" title="Cell / Cell Line Expression "
                          tabClassName={(!expressionWithcell || (expressionWithcell.length === 0)) ? "tab-disabled" : ""}
                          disabled={(!expressionWithcell || (expressionWithcell.length === 0))}
                        >
                          <Container className="tab-content-padding tab-bigscreen">
                            {expressionWithcell && expressionWithcell.length > 0 && (
                              <ClientServerPaginatedTableFullScreen
                                data={expressionWithcell.map(data => {return {...data, cellLineName: (data.cell_line ? data.cell_line.name : "")}})}
                                columns={expressionCellColumns}
                                onClickTarget={"#expression"}
                                defaultSortField="position"
                                viewPort={true}
                                title="Expression - Cell / Cell Line Expression"
                                download={
                                  {
                                      types:[
                                        {
                                          display: "Cell / Cell Line Expression (*.csv)",
                                          type: "expression_cell_line_csv",
                                          format: "csv",
                                          data: "publication_section",
                                          section: "expression_cell_line",
                                        }
                                      ],
                                     dataId:downloadId,
                                     itemType:"publication_section"
                                  }
                                }
                              />
                            )}
                            {!expressionWithcell.length && <p>{dataStatus}</p>}
                          </Container>
                        </Tab>
                      </Tabs>
                    )}

                    {!glycan_expression && <p>{dataStatus}</p>}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
        </Col>
      </Row>
    </>
  );
};
export default PublicationDetail;
