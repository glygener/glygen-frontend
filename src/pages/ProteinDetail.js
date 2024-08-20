/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useReducer } from "react";
import { getProteinDetail } from "../data/protein";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { Link } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { addIndex } from "../utils/common";
import { Grid } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import { FiBookOpen } from "react-icons/fi";
import { groupEvidences, groupOrganismEvidences } from "../data/data-format";
import EvidenceList from "../components/EvidenceList";
import ClientPaginatedTable from "../components/ClientPaginatedTable";
import ClientServerPaginatedTable from "../components/ClientServerPaginatedTable";
import ThreeDViewer from "../components/viewer/ThreeDViewer.js";
import "../css/detail.css";
import "../css/Responsive.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import CardToggle from "../components/cards/CardToggle";
import DownloadButton from "../components/DownloadButton";
import DownloadFile from "../components/DownloadFile"
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
// import PublicationsMenu from '../components/PublicationsMenu';
import DetailTooltips from "../data/json/proteinDetailTooltips.json";
import HelpTooltip from "../components/tooltip/HelpTooltip";
import FeedbackWidget from "../components/FeedbackWidget";
import { Tab, Tabs, Container, NavDropdown, Nav } from "react-bootstrap";
// import ReactCopyClipboard from'../components/ReactCopyClipboard';
import routeConstants from "../data/json/routeConstants";
import FunctionList from "../components/FunctionList";
// import GoannotationList from "../components/Goannotationlist";
import ProteinSequenceDisplay from "../components/ProteinSequenceDisplay";
import SequenceDisplay from "../components/SequenceDisplay";
import stringConstants from "../data/json/stringConstants";
import { getGlycanImageUrl } from "../data/glycan";
import Button from "react-bootstrap/Button";
import AlignmentDropdown from "../components/AlignmentDropdown";
// import ProtvistaNav from "../components/navigation/ProtvistaNav";
import { FaSearchPlus } from "react-icons/fa";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import LineTooltip from "../components/tooltip/LineTooltip";
import { Alert, AlertTitle } from "@mui/material";
import CollapsableReference from "../components/CollapsableReference";
import CollapsibleDirectSearchReference from "../components/CollapsibleDirectSearchReference"
import DirectSearch from "../components/search/DirectSearch.js";
import { getProteinSearch } from "../data/protein";
import SequenceHighlighter from "../components/sequence/SequenceHighlighter";
import SequenceViewer from "../components/sequence/SequenceViewer";
import CollapsibleText from "../components/CollapsibleText";
import { postToAndGetBlob } from "../data/api";
import CardLoader from "../components/load/CardLoader";
import PropTypes from 'prop-types';
import AccordionMUI from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SelectControl from "../components/select/SelectControl";

const SimpleHelpTooltip = (props) => {
  const { data } = props;

  return (
    <HelpTooltip
      title={data.title}
      text={data.text}
      urlText={data.urlText}
      url={data.url}
      helpIcon="gg-helpicon-detail"
    />
  );
};

const glycanStrings = stringConstants.glycan.common;
const proteinStrings = stringConstants.protein.common;
const biomarkerStrings = stringConstants.biomarker.common;
const proteinDirectSearch = stringConstants.protein.direct_search;

const items = [
  { label: stringConstants.sidebar.general.displayname, id: "General" },
  { label: stringConstants.sidebar.viewer.displayname, id: "3D-View" },
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
    label: stringConstants.sidebar.names_synonyms.displayname,
    id: "Names",
  },
  { label: stringConstants.sidebar.function.displayname, id: "Function" },
  { label: stringConstants.sidebar.sequence.displayname, id: "Sequence" },
  {
    label: stringConstants.sidebar.snv.displayname,
    id: "Single-Nucleotide-Variation",
  },
  { label: stringConstants.sidebar.mutagenesis.displayname, id: "Mutagenesis" },
  {
    label: stringConstants.sidebar.go_annotation.displayname,
    id: "GO-Annotation",
  },
  {
    label: stringConstants.sidebar.glycan_ligands.displayname,
    id: "Glycan-Ligands",
  },
  {
    label: stringConstants.sidebar.ptm_annotation.displayname,
    id: "PTM-Annotation",
  },
  {
    label: stringConstants.sidebar.pro_annotation.displayname,
    id: "Proteoform-Annotation",
  },
  { label: stringConstants.sidebar.pathway.displayname, id: "Pathway" },
  {
    label: stringConstants.sidebar.synthesized_glycans.displayname,
    id: "Synthesized-Glycans",
  },
  { label: stringConstants.sidebar.isoforms.displayname, id: "Isoforms" },
  { label: stringConstants.sidebar.homologs.displayname, id: "Homologs" },
  { label: stringConstants.sidebar.disease.displayname, id: "Disease" },
  {
    label: stringConstants.sidebar.biomarkers.displayname,
    id: "Biomarkers",
  },
  {
    label: stringConstants.sidebar.expression_Tissue.displayname,
    id: "Expression-Tissue",
  },
  {
    label: stringConstants.sidebar.expression_Disease.displayname,
    id: "Expression-Disease",
  },
  {
    label: stringConstants.sidebar.cross_ref.displayname,
    id: "Cross-References",
  },
  { label: stringConstants.sidebar.history.displayname, id: "History" },
  { label: stringConstants.sidebar.publication.displayname, id: "Publications" },
];

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

/**
 * This function opens the Sequence page.
 */
function openProtvistaPage(uniprot_canonical_ac) {
  var str = uniprot_canonical_ac;
  //    str = str.substring(0, str.length - 2);
  str = str.substring(0, str.indexOf("-"));
  var url = "https://www.uniprot.org/uniprot/" + str + "/protvista";
  window.open(url);
}
const sortByPosition = function (a, b) {
  if (a.start_pos < b.start_pos) {
    return -1;
  } else if (b.start_pos < a.start_pos) {
    return 1;
  }
  return 0;
};

const getItemsPathway = (data) => {
  let itemspathway = [];

  //check data.
  if (data.pathway) {
    for (let pathwayitem of data.pathway) {
      let found = "";
      for (let resourceitem of itemspathway) {
        if (resourceitem.resource === pathwayitem.resource) {
          found = true;
          resourceitem.links.push({
            url: pathwayitem.url,
            id: pathwayitem.id,
            name: pathwayitem.name,
          });
        }
      }
      if (!found) {
        itemspathway.push({
          resource: pathwayitem.resource,
          links: [
            {
              url: pathwayitem.url,
              id: pathwayitem.id,
              name: pathwayitem.name,
            },
          ],
        });
      }
    }
  }
  return itemspathway;
};

const getItemsCrossRefWithCategory = (data) => {
  let itemscrossRefCategory = [];
  return itemscrossRefCategory;
  //check data.
  if (data.crossref) {
    for (let crossrefitem of data.crossref) {
      for (let category of crossrefitem.categories) {
        let categoryItem = itemscrossRefCategory.filter(item => item.category === category)[0];
        if (!categoryItem) {
          categoryItem = {
            category : category,
            database : []
          }
          itemscrossRefCategory.push(categoryItem);
        }
        let databaseItem = categoryItem.database.filter(item => item.database === crossrefitem.database)[0];
        if (!databaseItem) {
          databaseItem = {
            database: crossrefitem.database,
            links: [
              {
                url: crossrefitem.url,
                id: crossrefitem.id,
              },
            ]
          }
          categoryItem.database.push(databaseItem);
        } else {
          databaseItem.links.push({
            url: crossrefitem.url,
            id: crossrefitem.id,
          });
        }
      }
    }

    for (let crossrefitem of itemscrossRefCategory) {
      crossrefitem.database.sort(function (a, b) {
          if (a.database.toLowerCase() > b.database.toLowerCase()) {
            return 1;
          }
          if (b.database.toLowerCase() > a.database.toLowerCase()) {
            return -1;
          }
          return 0;
        });
    }
    
    itemscrossRefCategory.sort(function (a, b) {
      if (a.category === "Other") return 1;
      if (b.category === "Other") return -1;
      if (a.category.toLowerCase() > b.category.toLowerCase()) {
        return 1;
      }
      if (b.category.toLowerCase() > a.category.toLowerCase()) {
        return -1;
      }
      return 0;
    });
  }

  return itemscrossRefCategory;
};

const TYPE_RECOMMENDED = "recommended";

const ProteinDetail = (props) => {
  let { id } = useParams();
  let { select } = useParams();
  const navigate = useNavigate();
  const location = useLocation();


  const [detailData, setDetailData] = useState({});
  const [itemsCrossRef, setItemsCrossRef] = useState([]);
  const [nonExistent, setNonExistent] = useState(null);
  const [itemsPathway, setItemsPathway] = useState([]);
  const [showIsoformSequences, setShowIsoformSequences] = useState(false);
  const [showhomologSequences, setShowhomologSequences] = useState(false);
  const [diseaseData, setDiseaseData] = useState([]);
  const [sideBarData, setSidebarData] = useState(items);
  const [glycosylationPredicted, setGlycosylationPredicted] = useState([]);
  const [glycosylationMining, setGlycosylationMining] = useState([]);
  const [glycosylationWithImage, setGlycosylationWithImage] = useState([]);
  const [glycosylationWithImageTotal, setGlycosylationWithImageTotal] = useState(undefined);
  const [glycosylationWithoutImageTotal, setGlycosylationWithoutImageTotal] = useState(undefined);
  const [glycosylationPredictedTotal, setGlycosylationPredictedTotal] = useState(undefined);
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
  const [glycosylationPredictedSectStat, setGlycosylationPredictedSectStat] = useState({
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
  const [publicationTotal, setPublicationTotal] = useState(undefined);
  const [phosphorylationTotal, setPhosphorylationTotal] = useState(undefined);
  const [glycosylationWithoutImage, setGlycosylationWithoutImage] = useState([]);
  const [glycosylationTabSelected, setGlycosylationTabSelected] = useState("reported_with_glycan");
  const [mutataionWithdisease, setMutataionWithdisease] = useState([]);
  const [mutataionWithoutdisease, setMutataionWithoutdisease] = useState([]);
  const [mutataionWithdiseaseTotal, setMutataionWithdiseaseTotal] = useState([]);
  const [mutataionWithoutdiseaseTotal, setMutataionWithoutdiseaseTotal] = useState([]);
  const [mutataionTabSelected, setMutataionTabSelected] = useState("");
  const [ptmAnnotation, setPtmAnnotation] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [cardLoadingGly, setCardLoadingGly] = useState(false);
  const [cardLoadingPho, setCardLoadingPho] = useState(false);
  const [cardLoadingSnv, setCardLoadingSnv] = useState(false);
  const [cardLoadingPub, setCardLoadingPub] = useState(false);
  const [dataStatus, setDataStatus] = useState("Fetching Data.");
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const [selectedHighlights, setSelectedHighlights] = useState({
    mutation: false,
    site_annotation: false,
    n_link_glycosylation: false,
    o_link_glycosylation: false,
    phosphorylation: false,
    glycation: false,
    text_search: false,
  });
  const [geneNames, setGeneNames] = useState([]);
  const [recommendedGeneRows, setRecommendedGeneRows] = useState([]);
  const [synonymGeneRows, setSynonymGeneRows] = useState([]);
  const [proteinNames, setProteinNames] = useState([]);
  const [recommendedProteinRows, setRecommendedProteinRows] = useState([]);
  const [synonymProteinRows, setSynonymProteinRows] = useState([]);
  const [sequenceSearchText, setSequenceSearchText] = useState("");
  const [sequenceTemplateText, setSequenceTemplateText] = useState("");
  const [consensusMenu, setConsesusMenu] = useState(
    [
      { id: "NX[ST]", name: "N-Glycan Sequon - NX[ST]" },
      { id: "CXXXX[ST]C", name: "O-Fucose - CXXXX[ST]C" },
      { id: "CXX[ST]CXXG", name: "O-Fucose - CXX[ST]CXXG" },
      { id: "CXSX[PA]C", name: "O-Glucose - CXSX[PA]C" },
      { id: "CXNTXGSFXC", name: "O-Glucose - CXNTXGSFXC"},
      { id: "CXXXX[ST]GXXC", name:"O-GlcNAc (external) - CXXXX[ST]GXXC"},
      { id: "CXX[ST]C", name:"O-Fucose - CXX[ST]C"},
      { id: "WXX[WC]", name:"C-Mannose - WXX[WC]"},
      { id: "WXXWXXW", name:"C-Mannose - WXXWXXW"},
      { id: "WXXWXXWXXC", name:"C-Mannose - WXXWXXWXXC"},
    ]
  )
  const [structure, setStructure] = useState("");
  const [structureUrl, setStructureUrl] = useState("");
  const [structureType, setStructureType] = useState("");
  const [structureMenu, setStructureMenu] = useState([]);
  const [structureMap, setStructureMap] = useState(new Map());
  const [publicationSort, setPublicationSort] = useState("date");
  const [publicationDirection, setPublicationDirection] = useState("desc");
  const [showCategories, setShowCategories] = useState(false);
  const [expandedCategories, setExpandedCategories] = useReducer(
    (state, newState) => ({
      ...state, 
      ...newState,
    }),{
      catInd: [0]
    }
    );
  const [sequenceFeatures, setSequenceFeatures] = useState(undefined);


  useEffect(() => {
    setNonExistent(null);
    setPageLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    logActivity("user", id);
    setSelectedHighlights({
      mutation: "mutation" === select,
      site_annotation: "site_annotation" === select,
      n_link_glycosylation: "n_link_glycosylation" === select,
      o_link_glycosylation: "o_link_glycosylation" === select,
      phosphorylation: "phosphorylation" === select,
      glycation: "glycation" === select,
      text_search: false,
    });

    const getProteinDetailData = getProteinDetail(id);

    getProteinDetailData.then(({ data }) => {
      if (data.code) {
        let message = "Detail api call";
        logActivity("user", id, "No results. " + message);
        setPageLoading(false);
        setDataStatus("No data available.");
      } else {
        let detailDataTemp = data;
        setItemsCrossRef(getItemsCrossRefWithCategory(data));
        setItemsPathway(getItemsPathway(data));
        setDetailData(data);

        if (detailDataTemp.protein_names && detailDataTemp.protein_names.length > 1) {
          let recommendedNames = detailDataTemp.protein_names.filter((x) => x.type === "recommended");
          if (recommendedNames && recommendedNames.length > 1) {
            let names = recommendedNames.map((x) => x.name).join("; ");
            logActivity("error", id, "More than one recommended protein name. Detail api call. Recommended names : " + names);
          }
        }

        let newSidebarData = sideBarData;
        if (!detailDataTemp.uniprot || detailDataTemp.uniprot.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "General", true);
        }
        if (!detailDataTemp.structures || detailDataTemp.structures.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "3D-View", true);
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
        if (!detailDataTemp.gene || detailDataTemp.gene.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Names", true);
        }
        if (!detailDataTemp.protein_names || detailDataTemp.protein_names.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Names", true);
        }
        if (!detailDataTemp.function || detailDataTemp.function.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Function", true);
        }
        if (!detailDataTemp.sequence || detailDataTemp.sequence.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Sequence", true);
        }
        if (!detailDataTemp.snv || detailDataTemp.snv.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Single-Nucleotide-Variation", true);
        }
        if (!detailDataTemp.mutagenesis || detailDataTemp.mutagenesis.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Mutagenesis", true);
        }
        if (!detailDataTemp.go_annotation || detailDataTemp.go_annotation.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "GO-Annotation", true);
        }
        if (!detailDataTemp.interactions || detailDataTemp.interactions.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Glycan-Ligands", true);
        }
        if (!detailDataTemp.ptm_annotation || detailDataTemp.ptm_annotation.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "PTM-Annotation", true);
        }
        if (!detailDataTemp.pro_annotation || detailDataTemp.pro_annotation.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Proteoform-Annotation", true);
        }
        if (!detailDataTemp.pathway || detailDataTemp.pathway.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Pathway", true);
        }
        if (
          !detailDataTemp.synthesized_glycans ||
          detailDataTemp.synthesized_glycans.length === 0
        ) {
          newSidebarData = setSidebarItemState(newSidebarData, "Synthesized-Glycans", true);
        }
        if (!detailDataTemp.isoforms || detailDataTemp.isoforms.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Isoforms", true);
        }
        // if (!detailDataTemp.homologs || detailDataTemp.homologs.length === 0) {
        //   newSidebarData = setSidebarItemState(
        //     newSidebarData,
        //     "Homologs",
        //     true
        //   );
        // }
        if (!detailDataTemp.orthologs || detailDataTemp.orthologs.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Homologs", true);
        }
        if (!detailDataTemp.disease || detailDataTemp.disease.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Disease", true);
        }
        if (!detailDataTemp.biomarkers || detailDataTemp.biomarkers.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Biomarkers", true);
        }
        if (!detailDataTemp.expression_tissue || detailDataTemp.expression_tissue.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Expression-Tissue", true);
        }
        if (!detailDataTemp.expression_disease || detailDataTemp.expression_disease.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Expression-Disease", true);
        }
        if (!detailDataTemp.crossref || detailDataTemp.crossref.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Cross-References", true);
        }
        if (!detailDataTemp.history || detailDataTemp.history.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "History", true);
        }
        if (!detailDataTemp.publication || detailDataTemp.publication.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Publications", true);
        }
        setSidebarData(newSidebarData);
        if (data.disease) {
          let diseaseDataTemp = diseaseDataRearrangement();
          setDiseaseData(diseaseDataTemp);
          function diseaseDataRearrangement() {
            var disease = data.disease.slice();
            for (var i = 0; i < disease.length; i++) {
              if (disease[i].synonyms) {
                var synTemp = [];
                var synonyms = disease[i].synonyms.slice();
                for (var j = 0, k = 0; j < disease[i].synonyms.length; j++) {
                  var temp = synonyms.filter((syn) => syn.name === disease[i].synonyms[j].name);
                  if (temp && temp.length) {
                    synTemp[k] = {
                      name: disease[i].synonyms[j].name,
                      resource: temp,
                    };
                    synonyms = synonyms.filter((syn) => syn.name !== synTemp[k].name);
                    k++;
                  }
                }
                disease[i].synonyms = synTemp;
                disease[i].synShortLen = synTemp.length > 2 ? 2 : synTemp.length;
                disease[i].synLen = synTemp.length;
                disease[i].synBtnDisplay = synTemp.length <= 2 ? false : true;
                disease[i].synShowMore = true;
              }
            }
            return disease;
          }
        }

        if (data.publication) {
          data.publication = data.publication.sort((a, b) => parseInt(b.date) - parseInt(a.date));
        }

        if (data.gene_names) {
          let geneNamesTemp = formatNamesData(data.gene_names);
          setGeneNames(geneNamesTemp);
          setRecommendedGeneRows(
            geneNamesTemp.map(getRecommendedRows).filter((arg) => arg !== null)
          );
          setSynonymGeneRows(geneNamesTemp.map(getSynonymRows).filter((arg) => arg !== null));
        }

        if (data.protein_names) {
          let proteinNamesTemp = formatNamesData(data.protein_names);
          setProteinNames(proteinNamesTemp);
          setRecommendedProteinRows(
            proteinNamesTemp.map(getRecommendedRows).filter((arg) => arg !== null)
          );
          setSynonymProteinRows(proteinNamesTemp.map(getSynonymRows).filter((arg) => arg !== null));
        }

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
          const predicted = mapOfGlycosylationCategories.predicted || [];
          const mining = mapOfGlycosylationCategories.automatic_literature_mining || [];

          const selectTab = [
            "reported_with_glycan",
            "reported",
            "predicted",
            "automatic_literature_mining",
          ].find(
            (category) =>
              mapOfGlycosylationCategories[category] &&
              mapOfGlycosylationCategories[category].length > 0
          );
          // debugger;
          setGlycosylationWithImage(withImage);
          setGlycosylationWithoutImage(withoutImage);
          setGlycosylationPredicted(predicted);
          setGlycosylationMining(mining);
          setGlycosylationTabSelected(selectTab);
          
        }

        if (data.section_stats) {

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

          let glyPred = data.section_stats.filter(obj => obj.table_id === "glycosylation_predicted");
          let glyPredStat = glyPred[0].table_stats.filter(obj => obj.field === "total");
          setGlycosylationPredictedTotal(glyPredStat[0].count);

          let temp3 = {
            "total_sites": glyPred[0].table_stats.filter(obj => obj.field === "total_sites")[0].count,
            "Nlinked": {
              "count": glyPred[0].table_stats.filter(obj => obj.field === "n_linked_glycans")[0].count,
              "sites": glyPred[0].table_stats.filter(obj => obj.field === "n_linked_glycan_sites")[0].count,
            },
            "Olinked": {
              "count": glyPred[0].table_stats.filter(obj => obj.field === "o_linked_glycans")[0].count,
              "sites": glyPred[0].table_stats.filter(obj => obj.field === "o_linked_glycan_sites")[0].count,
            }
          };

          setGlycosylationPredictedSectStat(temp3);

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
  
          let publi = data.section_stats.filter(obj => obj.table_id === "publication");
          let publiStat = publi[0].table_stats.filter(obj => obj.field === "total");
          setPublicationTotal(publiStat[0].count);  
          
          let mutaDis = data.section_stats.filter(obj => obj.table_id === "snv_disease");
          let mutaDisStat = mutaDis[0].table_stats.filter(obj => obj.field === "total");
          setMutataionWithdiseaseTotal(mutaDisStat[0].count);
  
          let mutaWithoutDis = data.section_stats.filter(obj => obj.table_id === "snv_non_disease");
          let mutaWithoutDisStat = mutaWithoutDis[0].table_stats.filter(obj => obj.field === "total");
          setMutataionWithoutdiseaseTotal(mutaWithoutDisStat[0].count);
        }

        if (data.snv) {
          const WithDisease = data.snv.filter((item) => item.keywords.includes("disease"));
          const Withoutdisease = data.snv.filter((item) => !item.keywords.includes("disease"));
          setMutataionWithdisease(WithDisease);
          setMutataionWithoutdisease(Withoutdisease);
          setMutataionTabSelected(WithDisease.length > 0 ? "with_disease" : "without_disease");
        }

        if (data.ptm_annotation) {
          const ptmEvidence = data.ptm_annotation.filter((item) => item.annotation);
          setPtmAnnotation(ptmEvidence);
        }

        if (data.sequence_features) {
          setSequenceFeatures(data.sequence_features)
        }

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
          let menu = data.structures.sort(sortMenu).map(item => {return {id: item.pdb_id, name: `${item.type === "experimental" ? "PDB ID" : "AlphaFold ID"}: ${item.pdb_id.toUpperCase()} (Amino acid: ${item.start_pos} - ${item.end_pos})`}});
          setStructureMenu(menu);

          let structureMap = new Map();
          for (let i = 0; i < data.structures.length; i++) {
            structureMap.set(data.structures[i].pdb_id, {type: data.structures[i].type, url: data.structures[i].url});
          }
          structureMap.set("", {type: "", url: ""});
          setStructureMap(structureMap);

          if (menu.length > 0) {
            setStructure(menu[0].id);
            setStructureType(structureMap.get(menu[0].id).type);
            setStructureUrl(structureMap.get(menu[0].id).url);
          }
        } else {
          let menu = []
          menu.push({id: "", name: "No structure"});
          setStructureMenu(menu);
          setStructureUrl("");
          setStructureType("");
          structureMap.set("", {type: "", url: ""});
          setStructureMap(structureMap);
        }

        setPageLoading(false);
        setDataStatus("No data available.");
      }

      // Need to call it second time due to glycosylationWithImage and glycosylationWithoutImage table loading time.
      setTimeout(() => {
        let anchorElement = location.hash;
        if (anchorElement && document.getElementById(anchorElement.substr(1))) {
          document.getElementById(anchorElement.substr(1)).scrollIntoView({ behavior: "auto" });
        }
      }, 1000);
    });

    getProteinDetailData.catch(({ response }) => {
      if (
        response.data &&
        response.data.error_list &&
        response.data.error_list.length &&
        response.data.error_list[0].error_code &&
        response.data.error_list[0].error_code === "non-existent-record"
      ) {
        // history = response.data.history;
        setNonExistent({
          error_code: response.data.error_list[0].error_code,
          reason: response.data.reason,
        });
        setPageLoading(false);
      } else {
        let message = "Protein Detail api call";
        axiosError(response, id, message, setPageLoading, setAlertDialogInput);
      }
      setDataStatus("No data available.");
    });
  }, [id]);

  const {
    mass,
    uniprot,
    gene,
    species,
    publication,
    isoforms,
    orthologs,
    glycosylation,
    interactions,
    biomarkers,
    expression_tissue,
    expression_disease,
    snv,
    refseq,
    mutagenesis,
    phosphorylation,
    glycation,
    disease,
    sequence,
    go_annotation,
    ptm_annotation,
    pro_annotation,
    synthesized_glycans,
    site_annotation,
    protein_names,
    keywords,
    function: functions,
    cluster_types,
    history,
  } = detailData;
  // alert(detailData.sequence)
  const setSidebarItemState = (items, itemId, disabledState) => {
    return items.map((item) => {
      return {
        ...item,
        disabled: item.id === itemId ? disabledState : item.disabled,
      };
    });
  };
  const sortedPublication = (publication && publication.length ? [...publication] : []).sort(
    (a, b) => {
      // if (publicationSort === 'reference')
      //   return sortReference(a,b)

      if (a[publicationSort] < b[publicationSort]) return publicationDirection === "asc" ? -1 : 1;
      if (b[publicationSort] < a[publicationSort]) return publicationDirection === "asc" ? 1 : -1;
      return 0;
    }
  );

  const uniprotNames = (protein_names || [])
    .filter((x) => x.type === "recommended")
    .map((x) => x.name).join("; ");

  const clusterType = (cluster_types || []).filter((x) => x.name !== "isoformset.uniprotkb");

  function formatNamesData(data) {
    let items = [];
    data.forEach(({ resource, name, type, url }) => {
      let found = false;
      for (let resourceItem of items) {
        if (resourceItem.resource === resource) {
          found = true;
          resourceItem.links.push({ name, type, url });
        }
      }
      if (!found) {
        items.push({
          resource,
          url,
          links: [{ name, type, url }],
        });
      }
    });
    return items;
  }

  function getRecommendedRows({ links, resource }) {
    const name = links.filter(({ type }) => type === TYPE_RECOMMENDED);
    if (!name || name.length === 0) return null;
    return name.map(({ name, url }, index) => (
      <li key={index}>
        <span>{resource}:</span>{" "}
        <a href={url} target="_blank" rel="noopener noreferrer">
          {name}
        </a>
      </li>
    ));
  }

  function getSynonymRows({ links, resource, url }, index) {
    const name = links
      .filter(({ type }) => type !== TYPE_RECOMMENDED)
      .map(({ name }) => name)
      .join("; ");
    if (!name) return null;
    return (
      <li key={index}>
        <span>{resource}:</span>{" "}
        <a href={url} target="_blank" rel="noopener noreferrer">
          {name}
        </a>
      </li>
    );
  }

  function setDiseaseDataSynonyms(diseaseName) {
    let diseaseDataTemp = diseaseData.map((disData) => {
      if (disData.recommended_name.name === diseaseName) {
        disData.synShowMore = disData.synShowMore ? false : true;
      }
      return disData;
    });
    setDiseaseData(diseaseDataTemp);
  }

  const organismEvidence = groupOrganismEvidences(species);
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
        ) : (<LineTooltip text="View siteview details">
              <Link to={`${routeConstants.siteview}${id}/${row.start_pos}`}>
                {row.residue}
                {row.start_pos}
              </Link>
            </LineTooltip>)
        ) : (
          "Not Reported"
        ),
      // formatter: (value, row) => (
      //   <LineTooltip text="View siteview details">
      //     <Link to={`${routeConstants.siteview}${id}/${row.start_pos}`}>
      //       {row.residue} {row.start_pos}
      //     </Link>
      //   </LineTooltip>
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
  const glycanLigandsColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },
      formatter: (cell, row) => {
        return <EvidenceList key={row.interactor_id} evidences={groupEvidences(cell)} />;
      },
    },
    {
      dataField: "interactor_id",
      text: proteinStrings.glytoucan_ac.shortName,
      defaultSortField: "interactor_id",
      sort: true,

      headerStyle: (column, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View glycan details">
          <Link to={routeConstants.glycanDetail + row.interactor_id}>{row.interactor_id}</Link>
        </LineTooltip>
      ),
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
            src={getGlycanImageUrl(row.interactor_id)}
            alt="Glycan img"
          />
        </div>
      ),
      headerStyle: (colum, colIndex) => {
        return {
          width: "35%",
          textAlign: "left",
          backgroundColor: "#4B85B6",
          color: "white",
          whiteSpace: "nowrap",
        };
      },
    },
  ];
  const synthesizedGlycansColumns = [
    {
      dataField: "glytoucan_ac",
      text: proteinStrings.glytoucan_ac.shortName,
      defaultSortField: "glytoucan_ac",
      sort: true,

      headerStyle: (column, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View glycan details">
          <Link to={routeConstants.glycanDetail + row.glytoucan_ac}>{row.glytoucan_ac}</Link>
        </LineTooltip>
      ),
    },
    {
      dataField: "glytoucan_ac",
      text: glycanStrings.glycan_image.name,
      sort: false,
      selected: true,
      formatter: (value, row) => (
        <div className="img-wrapper">
          <img className="img-cartoon" src={getGlycanImageUrl(row.glytoucan_ac)} alt="Glycan img" />
        </div>
      ),
      headerStyle: (colum, colIndex) => {
        return {
          width: "35%",
          textAlign: "left",
          backgroundColor: "#4B85B6",
          color: "white",
          whiteSpace: "nowrap",
        };
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
      dataField: "subtype",
      text: proteinStrings.subtype.name,
      sort: true,
      formatter: (value, row) => <span className="text-capitalize"> {row.subtype}</span>,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
        };
      },
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
          <Link to={`${routeConstants.siteview}${id}/${row.start_pos}`}>{row.start_pos}</Link>
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
          <Link to={`${routeConstants.siteview}${id}/${row.end_pos}`}>{row.end_pos}</Link>
        </LineTooltip>
      ),
    },

    {
      dataField: "sequence_org",
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
      // formatter: (value, row) => (
      //   <LineTooltip text="View siteview details">
      //     <Link to={`${routeConstants.siteview}${id}/${row.start_pos}`}>
      //       {row.start_pos}
      //     </Link>
      //   </LineTooltip>
      // )
    },
    {
      dataField: "end_pos",
      text: proteinStrings.endpos.name,
      sort: true,
      // formatter: (value, row) => (
      //   <LineTooltip text="View siteview details">
      //     <Link to={`${routeConstants.siteview}${id}/${row.end_pos}`}>
      //       {row.end_pos}
      //     </Link>
      //   </LineTooltip>
      // )
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
  const expressionTissueColumns = [
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
        return <EvidenceList key={row.tissue.uberon} evidences={groupEvidences(cell)} />;
      },
    },

    {
      dataField: "tissueName",
      text: proteinStrings.tissue.name,
      sort: true,
      headerStyle: (column, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
        };
      },
      formatter: (value, row) => (
        <>
          {value}{" "}
          {row.tissue && (<span className="nowrap">
            ({row.tissue.namespace}: <LineTooltip text="View tissue details"><a href={row.tissue.url} target="_blank" rel="noopener noreferrer">{row.tissue.id}</a></LineTooltip>)
          </span>)}
        </>
      ),
    },

    {
      dataField: "scorePresent",
      text: "Expression Relative",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "15%",
        };
      },
      formatter: (cell, row) => {
        return <span>{row.present}</span>;
      },
    },
    {
      dataField: "score",
      text: "Expression Score",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "15%",
        };
      },
    },
  ];
  const expressionDiseaseColumns = [
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
        return <EvidenceList key={row.disease} evidences={groupEvidences(cell)} />;
      },
    },
    {
      dataField: "disease",
      text: stringConstants.sidebar.disease.displayname,
      defaultSortField: "disease",
      headerStyle: (column, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "16%",
        };
      },

      formatter: (value, row) =>
        value ? (
          <>
            {value.map((disease, index) => (
              <ul key={index} className="ps-3">
                <li key={disease.recommended_name.id}>
                  {disease.recommended_name.name}{" "}
                  <span className="nowrap">
                    (<a href={disease.recommended_name.url} target="_blank" rel="noopener noreferrer">{disease.recommended_name.id}</a>){" "}
                  </span>
                </li>
              </ul>
            ))}
          </>
        ) : (
          "N/A"
        ),
    },

    {
      dataField: "trend",
      text: proteinStrings.expression_trend.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "15%",
        };
      },
    },
    {
      dataField: "significant",
      text: proteinStrings.significantt.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "15%",
        };
      },
    },
  ];
  const ptmAnnotationColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      headerStyle: (colum, colIndex) => {
        return {
          width: "20%",
        };
      },
      formatter: (cell, row) => {
        return <EvidenceList key={row.annotation} evidences={groupEvidences(cell)} />;
      },
    },
    {
      dataField: "annotation",
      text: proteinStrings.annotation_site.shortName,
      sort: true,
      formatter: (value, row) => <CollapsibleText text={row.annotation} lines={2} />,
    },
  ];
  const proAnnotationColumns = [
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
        return <EvidenceList key={row.annotation} evidences={groupEvidences(cell)} />;
      },
    },
    {
      dataField: "name",
      text: "Proteoform/Glycoform",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
        };
      },
    },
    {
      dataField: "definition",
      text: "Description",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
        };
      },
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
      dataField: "start_pos",
      text: proteinStrings.residue.name,
      sort: true,
      formatter: (value, row) =>
        value ? (
          <LineTooltip text="View siteview details">
            <Link to={`${routeConstants.siteview}${id}/${row.start_pos}`}>
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
      dataField: "start_pos",
      text: proteinStrings.residue.name,
      sort: true,
      formatter: (value, row) =>
        value ? (
          <LineTooltip text="View siteview details">
            <Link to={`${routeConstants.siteview}${id}/${row.start_pos}`}>
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
          width: "20%",
        };
      },
      formatter: (value, row) => <CollapsibleText text={row.comment} lines={2} />,
    },
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
            {row.reference.map((ref, ind) => (
              <div key={ind}>
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
                  text={proteinDirectSearch.pmid.text}
                  searchType={"protein"}
                  fieldType={proteinStrings.pmid.id}
                  fieldValue={ref.id}
                  executeSearch={proteinSearch}
                />
              </div>
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

  const biomarkerColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList
            key={row.biomarker_id}
            evidences={groupEvidences(cell)}
          />
        );
      }
    },
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
      dataField: "assessed_biomarker_entity",
      text: biomarkerStrings.assessed_biomarker_entity.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
    }
  ];

  // ==================================== //
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
      names_synonyms: true,
      phosphorylation: true,
      glycation: true,
      function: true,
      glycanLigands: true,
      mutagenesis: true,
      go_annotation: true,
      ptm_annotation: true,
      pro_annotation: true,
      glycosylation: true,
      sequence: true,
      pathway: true,
      synthesized_glycans: true,
      isoforms: true,
      homologs: true,
      disease: true,
      mutation: true,
      biomarkers: true,
      expression_tissue: true,
      expression_disease: true,
      crossref: true,
      history: true,
      publication: true,
    }
  );

  const sortedHistory = (a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  };

  function toggleCollapse(name, value) {
    setCollapsed({ [name]: !value });
  }

  // ===================================== //

  /**
   * Redirect and opens uniprot_canonical_ac in a GO Term List Page
   * @param {object} uniprot_canonical_ac- uniprot accession ID.
   **/
  function handleOpenGOTermListPage(uniprot_canonical_ac) {
    var url = "https://www.ebi.ac.uk/QuickGO/annotations?geneProductId=" + uniprot_canonical_ac;
    window.open(url);
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const showAlignmentOptions = detailData.orthologs
    ? detailData.orthologs.find((orth) =>
        orth.evidence.find((evid) => ["MGI", "OMA"].includes(evid.database))
      )
    : false;

  /**
   * Function to handle protein direct search.
   **/
  const proteinSearch = (formObject) => {
    setPageLoading(true);
    logActivity("user", id, "Performing Direct Search");
    let message = "Direct Search query=" + JSON.stringify(formObject);
    getProteinSearch(formObject)
      .then((response) => {
        if (response.data["list_id"] !== "") {
          logActivity("user", (id || "") + ">" + response.data["list_id"], message).finally(() => {
            setPageLoading(false);
            navigate(routeConstants.proteinList + response.data["list_id"]);
          });
        } else {
          let error = {
            response: {
              status: stringConstants.errors.defaultDialogAlert.id,
            },
          };
          axiosError(error, "", "No results. " + message, setPageLoading, setAlertDialogInput);
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  function handleCategories(event, expanded, catInd) {
    let catArr = expandedCategories;
    if (expanded) {
      catArr.catInd.push(catInd);
    } else {
      const ind = catArr.catInd.indexOf(catInd);
      if (ind > -1) {
        catArr.catInd.splice(ind, 1);
      }
    }
    setExpandedCategories(catArr)
  }

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

  if (nonExistent) {
    return (
      <Container className="tab-content-border2">
        <Alert className="erroralert" severity="error">
          {nonExistent.reason && nonExistent.reason.type && nonExistent.reason.type !== "invalid" ? (<>
            {(nonExistent.reason.type !== "never_in_glygen_current_in_uniprotkb" && nonExistent.reason.type !== "discontinued_in_glygen") && (<AlertTitle> {id} is no longer valid Protein ID</AlertTitle>)}
            {(nonExistent.reason.type === "discontinued_in_glygen") && (<AlertTitle> The UniProtKB accession {id} is discontinued in GlyGen</AlertTitle>)}
            {(nonExistent.reason.type === "never_in_glygen_current_in_uniprotkb") && (<AlertTitle> The UniProtKB accession {id} does not exists in GlyGen</AlertTitle>)}
            {(nonExistent.reason.type === "never_in_glygen_current_in_uniprotkb" || nonExistent.reason.type === "discontinued_in_glygen") && (<div>{"Valid ID in UniProtKB: "} 
              <a href={"https://www.uniprot.org/uniprotkb/" + id} target="_blank" rel="noopener noreferrer">
                {id}
              </a>
            </div>)}
            {(nonExistent.reason.type !== "never_in_glygen_current_in_uniprotkb") && (<div>{capitalizeFirstLetter(nonExistent.reason.description)}</div>)}
            {nonExistent.reason.type === "replacement_in_glygen" && <ul>
              <span>
                {nonExistent.reason.replacement_id_list && (
                    nonExistent.reason.replacement_id_list.map((repID) =>
                    <li>
                      {" "}{"Go to Protein: "}
                      <Link to={`${routeConstants.proteinDetail}${repID}`}>
                        {repID}
                      </Link>
                    </li>
                    )
                  )}
              </span>
            </ul>}
            {nonExistent.reason.type === "replacement_not_in_glygen" && <ul>
                <span>
                  {nonExistent.reason.replacement_id_list && (
                    nonExistent.reason.replacement_id_list.map((repID) =>
                    <li>
                      {" "}{"Go to replacement ID in UniProtKB: "}
                      <a href={"https://www.uniprot.org/uniprotkb/" + repID} target="_blank" rel="noopener noreferrer">
                        {repID}
                      </a>
                    </li>
                    )
                  )}
                </span>
              </ul>}
            </>
          )
          : (
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
                        Details for <span>{keywords ? "Glycoprotein" : "Protein"}</span>
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
            <div className="gg-download-btn-width text-end">
              <DownloadButton
                types={[
                  {
                    display: stringConstants.download.protein_jsondata.displayname,
                    type: "json",
                    data: "protein_detail",
                  },
                  {
                    display: stringConstants.download.protein_fastadata.displayname,
                    type: "fasta",
                    data: "protein_detail",
                  },
                ]}
                dataId={id}
                itemType="protein_detail"
              />
            </div>
            <React.Fragment>
              <Helmet>
                {getTitle("proteinDetail", {
                  uniprot_canonical_ac:
                    uniprot && uniprot.uniprot_canonical_ac ? uniprot.uniprot_canonical_ac : "",
                })}
                {getMeta("proteinDetail")}
              </Helmet>
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
                    <div className="float-end">
                      <CardToggle cardid="general" toggle={collapsed.general} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <div
                        style={{
                          marginBottom: "5px",
                        }}
                      >
                        {gene && gene.length > 0 && (
                          <>
                            {gene.map((genes, genesname) => (
                              <span key={genesname}>
                                <div>
                                  <strong>{proteinStrings.gene_name.name}:</strong>{" "}
                                  <a href={genes.url} target="_blank" rel="noopener noreferrer">
                                    {genes.name}
                                  </a>
                                </div>
                                <div>
                                  <strong>{proteinStrings.gene_location.name}:</strong>{" "}
                                  {proteinStrings.chromosome.name}: {""}
                                  {genes.locus ? genes.locus.chromosome : "NA"} {""}(
                                  {genes.locus ? addCommas(genes.locus.start_pos) : "NA"} -{" "}
                                  {genes.locus ? addCommas(genes.locus.end_pos) : "NA"})
                                </div>
                                <EvidenceList
                                  evidences={groupEvidences(
                                    genes.locus ? genes.locus.evidence : []
                                  )}
                                />
                              </span>
                            ))}
                          </>
                        )}
                        {!gene && <p className="no-data-msg-publication">{dataStatus}</p>}
                      </div>

                      {uniprot && uniprot.uniprot_canonical_ac && (
                        <>
                          <div>
                            <strong>{proteinStrings.uniprot_id.name}: </strong>
                            <a href={uniprot.url} target="_blank" rel="noopener noreferrer">
                              {uniprot.uniprot_id}{" "}
                            </a>
                          </div>
                          <div>
                            <strong>{proteinStrings.uniprot_accession.name}: </strong>
                            <a href={uniprot.url} target="_blank" rel="noopener noreferrer">
                              {uniprot.uniprot_canonical_ac}
                            </a>
                          </div>
                          <div>
                            <strong>{proteinStrings.sequence_length.name}: </strong>
                            <a
                              href={`https://www.uniprot.org/uniprot/${uniprot.uniprot_canonical_ac}/#sequences`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {uniprot.length}
                            </a>
                          </div>
                          <div>
                            <strong>{proteinStrings.recommendedname.name}: </strong>{" "}
                            {/* {proteinStrings.protein_names_uniprotkb.shortName} */}
                            {uniprotNames}
                          </div>
                          <div>
                            <strong>{proteinStrings.chemical_mass.name}: </strong>
                            {addCommas(mass.chemical_mass)} Da{" "}
                            <DirectSearch
                              text={proteinDirectSearch.chemical_mass.text}
                              searchType={"protein"}
                              fieldType={proteinStrings.chemical_mass.id}
                              fieldValue={mass.chemical_mass}
                              executeSearch={proteinSearch}
                            />
                          </div>

                          {refseq && (
                            <div>
                              <>
                                <strong>{proteinStrings.refseq_ac.name}: </strong>{" "}
                                <a href={refseq.url} target="_blank" rel="noopener noreferrer">
                                  {" "}
                                  {refseq.ac}{" "}
                                </a>{" "}
                                <div>
                                  {" "}
                                  <strong>{proteinStrings.refSeq_name.name}: </strong> {refseq.name}{" "}
                                </div>{" "}
                              </>
                            </div>
                          )}
                        </>
                      )}
                      <div>
                        {organismEvidence &&
                          // For every organism object
                          Object.keys(organismEvidence).map((orgEvi) => (
                            // For every database for current organism object
                            <div key={organismEvidence[orgEvi].taxid}>
                              <div>
                                <strong>{proteinStrings.organism.name}: </strong>
                                {organismEvidence[orgEvi].glygen_name}
                              </div>
                              <div>
                                  <strong>{proteinStrings.reference_species.name}: </strong>
                                  {orgEvi} {"["}
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
                                  <EvidenceList evidences={organismEvidence[orgEvi].evidence} />
                              </div>
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
                        title={DetailTooltips.protein.viewer.title}
                        text={DetailTooltips.protein.viewer.text}
                        urlText={DetailTooltips.protein.viewer.urlText}
                        url={DetailTooltips.protein.viewer.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.viewer.displayname}
                    </h4>
    
                    <div className="float-end">
                    <span>
                        <SelectControl
                          inputValue={structure}
                          menu={structureMenu}
                          disabled={structureUrl === ""}
                          sortFunction={(a, b) => {return 0 }}
                          setInputValue={(value) => {
                            setStructure(value);
                            setStructureType(structureMap.get(value).type);
                            setStructureUrl(structureMap.get(value).url);
                          }}
                        />
                      </span>
                      <span className="gg-download-btn-width text-end">
                        <DownloadFile
                          id={id}
                          url={structureUrl}
                          enable={structureUrl !== ""}
                          mimeType={"text/plain"}
                          itemType={"url_file_download"}
                          fileName={structure +".pdb"}
                        />
                      </span>
                      <CardToggle cardid="viewer" toggle={collapsed.viewer} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <Row>
                        {structureUrl !== "" ?
                          (<div>
                            <div style={{  height: "350px"}}>
                              {structureUrl && <ThreeDViewer url={structureUrl} />}
                            </div>
                            <div className="text-muted mt-2">
                              <strong><sup>1</sup></strong><span> 3D structure provided by {structureType === "experimental" ? <a href={"https://www.rcsb.org/"} target="_blank" rel="noopener noreferrer">PDB</a>:<a href={"https://alphafold.ebi.ac.uk/"} target="_blank" rel="noopener noreferrer">AlphaFold</a> }</span>
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

              {/*  Glycosylation */}
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
                        title={DetailTooltips.protein.glycosylation.title}
                        text={DetailTooltips.protein.glycosylation.text}
                        urlText={DetailTooltips.protein.glycosylation.urlText}
                        url={DetailTooltips.protein.glycosylation.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.glycosylation.displayname}
                    </h4>
                    <div className="float-end">
                      <span>
                        <Link to={`${routeConstants.protVista}${id}`}>
                          <Button
                            type="button"
                            style={{ marginLeft: "5px" }}
                            className="gg-btn-blue"
                          >
                            <FaSearchPlus /> ProtVista
                          </Button>
                        </Link>
                      </span>

                      <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            glycosylationWithImage && glycosylationWithImage.length > 0  && {
                              display: "Reported Sites with Glycan (*.csv)",
                              type: "glycosylation_reported_with_glycans_csv",
                              format: "csv",
                              data: "protein_section",
                              section: "glycosylation_reported_with_glycans",
                            },
                            glycosylationWithoutImage && glycosylationWithoutImage.length > 0 && {
                              display: "Reported Sites (*.csv)",
                              type: "glycosylation_reported_csv",
                              format: "csv",
                              data: "protein_section",
                              section: "glycosylation_reported",
                            },
                            glycosylationPredicted && glycosylationPredicted.length > 0 && {
                              display: "Predicted Only (*.csv)",
                              type: "glycosylation_predicted_csv",
                              format: "csv",
                              data: "protein_section",
                              section: "glycosylation_predicted",
                            },
                            glycosylationMining && glycosylationMining.length > 0 && {
                              display: "Text Mining (*.csv)",
                              type: "glycosylation_automatic_literature_mining_csv",
                              format: "csv",
                              data: "protein_section",
                              section: "glycosylation_automatic_literature_mining",
                            }
                          ]}
                          dataId={id}
                          itemType="protein_section"
                          showBlueBackground={true}
                          enable={(glycosylationWithImage && glycosylationWithImage.length > 0) ||
                            (glycosylationWithoutImage && glycosylationWithoutImage.length > 0) ||
                            (glycosylationPredicted && glycosylationPredicted.length > 0) ||
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
                            className="Tabcss"
                            activeKey={glycosylationTabSelected}
                            // defaultActiveKey={glycosylationTabSelected}
                            transition={false}
                            mountOnEnter={true}
                            unmountOnExit={true}
                            onSelect={(key) => {
                              setGlycosylationTabSelected(key);
                            }}
                          >
                            <Tab
                              eventKey="reported_with_glycan"
                              title="Reported Sites with Glycan"
                              tabClassName={(!glycosylationWithImage || (glycosylationWithImage.length === 0)) ? "tab-disabled" : ""}
                              disabled={(!glycosylationWithImage || (glycosylationWithImage.length === 0))}
                            >
                              {glycosylationWithImage && glycosylationWithImage.length !== 0 && (
                                <div className="Glycosummary">
                                  <strong>Summary:</strong>{" "}
                                  {createGlycosylationSummaryFromSectionStat(glycosylationWithImageSectStat, true)}
                                </div>
                              )}
                              <Container className="tab-content-padding">
                                {glycosylationWithImageTotal !== undefined && glycosylationWithImage && glycosylationWithImage.length > 0 && (
                                  <ClientServerPaginatedTable
                                    data={glycosylationWithImage}
                                    columns={glycoSylationColumns}
                                    onClickTarget={"#glycosylation"}
                                    defaultSortField="start_pos"
                                    defaultSortOrder="asc"
                                    record_type={"protein"}
                                    table_id={"glycosylation_reported_with_glycan"}
                                    record_id={id}
                                    serverPagination={true}
                                    totalDataSize={glycosylationWithImageTotal}
                                    setAlertDialogInput={setAlertDialogInput}
                                    setCardLoading={setCardLoadingGly}
                                  />
                                )}
                                {!glycosylationWithImage.length && (
                                  <div className="tab-content-padding">{dataStatus}</div>
                                )}
                              </Container>
                            </Tab>

                            <Tab
                              eventKey="reported"
                              title="Reported Sites"
                              tabClassName={(!glycosylationWithoutImage || (glycosylationWithoutImage.length === 0)) ? "tab-disabled" : ""}
                              disabled={(!glycosylationWithoutImage || (glycosylationWithoutImage.length === 0))}
                            >
                              {glycosylationWithoutImage && glycosylationWithoutImage.length !== 0 && (
                                <div className="Glycosummary">
                                  <strong>Summary:</strong>{" "}
                                  {createGlycosylationSummaryFromSectionStat(glycosylationWithoutImageSectStat)}
                                </div>
                              )}
                              <Container className="tab-content-padding">
                                {glycosylationWithoutImageTotal !== undefined && glycosylationWithoutImage &&
                                  glycosylationWithoutImage.length > 0 && (
                                    <ClientServerPaginatedTable
                                      data={glycosylationWithoutImage}
                                      columns={glycoSylationColumns.filter(
                                        (column) =>
                                          column.dataField !== "image" &&
                                          column.dataField !== "glytoucan_ac"
                                      )}
                                      onClickTarget={"#glycosylation"}
                                      defaultSortField="start_pos"
                                      defaultSortOrder="asc"
                                      record_type={"protein"}
                                      table_id={"glycosylation_reported"}
                                      record_id={id}
                                      serverPagination={true}
                                      totalDataSize={glycosylationWithoutImageTotal}
                                      setAlertDialogInput={setAlertDialogInput}
                                      setCardLoading={setCardLoadingGly}
                                    />
                                  )}
                                {!glycosylationWithoutImage.length && (
                                  <div className="tab-content-padding">{dataStatus}</div>
                                )}
                              </Container>
                            </Tab>
                            <Tab
                              eventKey="predicted"
                              title="Predicted Only"
                              tabClassName={(!glycosylationPredicted || (glycosylationPredicted.length === 0)) ? "tab-disabled" : ""}
                              disabled={(!glycosylationPredicted || (glycosylationPredicted.length === 0))}
                            >
                              {glycosylationPredicted && glycosylationPredicted.length !== 0 && (
                                <div className="Glycosummary">
                                  <strong>Summary:</strong>{" "}
                                  {createGlycosylationSummaryFromSectionStat(glycosylationPredictedSectStat)}
                                </div>
                              )}
                              <Container className="tab-content-padding">
                                {glycosylationPredictedTotal !== undefined && glycosylationPredicted && glycosylationPredicted.length > 0 && (
                                  <ClientServerPaginatedTable
                                    data={glycosylationPredicted}
                                    columns={glycoSylationColumns.filter(
                                      (column) =>
                                        column.dataField !== "image" &&
                                        column.dataField !== "glytoucan_ac"
                                    )}
                                    onClickTarget={"#glycosylation"}
                                    defaultSortField="start_pos"
                                    defaultSortOrder="asc"
                                    record_type={"protein"}
                                    table_id={"glycosylation_predicted"}
                                    record_id={id}
                                    serverPagination={true}
                                    totalDataSize={glycosylationPredictedTotal}
                                    setAlertDialogInput={setAlertDialogInput}
                                    setCardLoading={setCardLoadingGly}
                                  />
                                )}
                                {!glycosylationPredicted.length && (
                                  <div className="tab-content-padding">{dataStatus}</div>
                                )}
                              </Container>
                            </Tab>
                            <Tab
                              eventKey="automatic_literature_mining"
                              title="Text Mining"
                              tabClassName={(!glycosylationMining ||
                                glycosylationMining.length === 0) ? "tab-disabled" : ""}
                              disabled={
                                !glycosylationMining ||
                                glycosylationMining.length === 0
                              }
                            >
                              {glycosylationMining && glycosylationMining.length !== 0 && (
                                <div className="Glycosummary">
                                  <strong>Summary:</strong>{" "}
                                  {createGlycosylationSummaryFromSectionStat(glycosylationAutoLitMinSectStat)}
                                </div>
                              )}
                              <Container className="tab-content-padding">
                                {glycosylationAutoLitMinTotal !== undefined && glycosylationMining && glycosylationMining.length > 0 && (
                                  <ClientServerPaginatedTable
                                    data={glycosylationMining}
                                    columns={glycoSylationColumns.filter(
                                      (column) =>
                                        column.dataField !== "image" &&
                                        column.dataField !== "glytoucan_ac"
                                    )}
                                    onClickTarget={"#glycosylation"}
                                    defaultSortField="start_pos"
                                    defaultSortOrder="asc"
                                    record_type={"protein"}
                                    table_id={"glycosylation_automatic_literature_mining"}
                                    record_id={id}
                                    serverPagination={true}
                                    totalDataSize={glycosylationAutoLitMinTotal}
                                    setAlertDialogInput={setAlertDialogInput}
                                    setCardLoading={setCardLoadingGly}
                                  />
                                )}
                                {!glycosylationMining.length && (
                                  <div className="tab-content-padding">{dataStatus}</div>
                                )}
                              </Container>
                            </Tab>
                          </Tabs>
                        </>
                      )}

                      {!glycosylation && <p>{dataStatus}</p>}
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
                        title={DetailTooltips.protein.phosphorylation.title}
                        text={DetailTooltips.protein.phosphorylation.text}
                        urlText={DetailTooltips.protein.phosphorylation.urlText}
                        url={DetailTooltips.protein.phosphorylation.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.phosphorylation.displayname}
                    </h4>
                    <div className="float-end">
                      <span>
                        <Link to={`${routeConstants.protVista}${id}`}>
                          <Button
                            type="button"
                            style={{ marginLeft: "5px" }}
                            className="gg-btn-blue"
                          >
                            <FaSearchPlus /> ProtVista
                          </Button>
                        </Link>
                      </span>

                      <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            {
                              display: "Phosphorylation (*.csv)",
                              type: "phosphorylation_csv",
                              format: "csv",
                              data: "protein_section",
                              section: "phosphorylation",
                            }
                          ]}
                          dataId={id}
                          itemType="protein_section"
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
                        <ClientServerPaginatedTable
                        data={phosphorylation}                        
                        columns={phosphorylationColumns}
                        onClickTarget={"#phosphorylation"}
                        defaultSortField={"start_pos"}
                        defaultSortOrder="asc"
                        record_type={"protein"}
                        table_id={"phosphorylation"}
                        record_id={id}
                        serverPagination={true}
                        totalDataSize={phosphorylationTotal}
                        setAlertDialogInput={setAlertDialogInput}
                        setCardLoading={setCardLoadingPho}
                        />
                      )}
                      {!phosphorylation && <p>{dataStatus}</p>}
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
                        title={DetailTooltips.protein.glycation.title}
                        text={DetailTooltips.protein.glycation.text}
                        urlText={DetailTooltips.protein.glycation.urlText}
                        url={DetailTooltips.protein.glycation.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.glycation.displayname}
                    </h4>
                    <div className="float-end">
                      <span>
                        <Link to={`${routeConstants.protVista}${id}`}>
                          <Button
                            type="button"
                            style={{ marginLeft: "5px" }}
                            className="gg-btn-blue"
                          >
                            <FaSearchPlus /> ProtVista
                          </Button>
                        </Link>
                      </span>

                      <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            {
                              display: "Glycation (*.csv)",
                              type: "glycation_csv",
                              format: "csv",
                              data: "protein_section",
                              section: "glycation",
                            }
                          ]}
                          dataId={id}
                          itemType="protein_section"
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
                        <ClientServerPaginatedTable
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
                        />
                      )}
                      {!glycation && <p>{dataStatus}</p>}
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
                        title={DetailTooltips.protein.names_synonyms.title}
                        text={DetailTooltips.protein.names_synonyms.text}
                        urlText={DetailTooltips.protein.names_synonyms.urlText}
                        url={DetailTooltips.protein.names_synonyms.url}
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
                      {(geneNames && geneNames.length) || (proteinNames && proteinNames.length) ? (
                        <ul className="list-style-none mb-0">
                          {geneNames && geneNames.length ? (
                            <>
                              {recommendedGeneRows && recommendedGeneRows.length > 0 && (
                                <li>
                                  <strong>{proteinStrings.gene_name_recommended.name}</strong>
                                  <ul>{recommendedGeneRows}</ul>
                                </li>
                              )}
                              {synonymGeneRows && synonymGeneRows.length > 0 && (
                                <li>
                                  <strong>{proteinStrings.gene_name_synonym.name}</strong>
                                  <ul>{synonymGeneRows}</ul>
                                </li>
                              )}
                            </>
                          ) : (
                            <> {""}</>
                          )}
                          {proteinNames && proteinNames.length ? (
                            <>
                              {recommendedProteinRows && recommendedProteinRows.length > 0 && (
                                <li>
                                  <strong>{proteinStrings.protein_name_recommended.name}</strong>
                                  <ul>{recommendedProteinRows}</ul>
                                </li>
                              )}
                              {synonymProteinRows && synonymProteinRows.length > 0 && (
                                <li>
                                  <strong>{proteinStrings.protein_name_synonym.name}</strong>
                                  <ul>{synonymProteinRows}</ul>
                                </li>
                              )}
                            </>
                          ) : (
                            <> {""}</>
                          )}
                        </ul>
                      ) : (
                        <p>{dataStatus}</p>
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/*  Function */}
              <Accordion
                id="Function"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.protein.function.title}
                        text={DetailTooltips.protein.function.text}
                        urlText={DetailTooltips.protein.function.urlText}
                        url={DetailTooltips.protein.function.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.function.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="function" toggle={collapsed.function} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body className="card-padding-zero">
                      <div hover="true" fluid="true">
                        <Table hover fluid="true">
                          <tbody key={"body"} className="table-body">
                            {functions && functions.map((group, funIndex) => (
                                <tr className="table-row"  key={"tr" + funIndex}>
                                  <td key={"td" + funIndex}>
                                    <p key={"p" + funIndex}><CollapsibleText text={group.annotation} lines={2}/></p>
                                    <EvidenceList inline={true} key={"evidence" + funIndex} evidences={groupEvidences(group.evidence)} />
                                  </td>
                                </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                      {!functions && <p className="no-data-msg-publication">{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/*  Sequence */}
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
                    <div className="float-end">
                      <span>
                        <Link to={`${routeConstants.protVista}${id}`}>
                          <Button
                            type="button"
                            style={{ marginLeft: "5px" }}
                            className="gg-btn-blue"
                          >
                            <FaSearchPlus /> ProtVista
                          </Button>
                        </Link>
                      </span>
                      <CardToggle cardid="sequence" toggle={collapsed.sequence} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <Grid container className="content-box">
                        <Grid item>
                          <div>
                            {detailData.sequence && sequenceFeatures && (
                              <SequenceViewer
                                sequenceObject={[
                                  {
                                    aln: sequence.sequence,
                                    uniprot_ac: uniprot.uniprot_canonical_ac,
                                    uniprot_id: "",
                                  },
                                ]}
                                details={[
                                  {
                                    uniprot_canonical_ac: uniprot.uniprot_canonical_ac,
                                    n_glycosylation: sequenceFeatures.n_linked_sites,
                                    o_glycosylation: sequenceFeatures.o_linked_sites,
                                    snv: sequenceFeatures.snv_sites,
                                    // site_annotation: sequenceFeatures.sequon_annotation_sites,
                                    phosphorylation: sequenceFeatures.phosphorylation_sites,
                                    glycation: sequenceFeatures.glycation_sites,
                                  },
                                ]}
                                flatDataStructure={true}
                                multiSequence={false}
                                selectedHighlights={selectedHighlights}
                                sequenceSearchText={sequenceSearchText}
                                />
                            )}
                          </div>
                        </Grid>
                        <Grid item className="content-active">
                          {detailData.sequence && sequenceFeatures && (
                            <SequenceHighlighter
                              sequenceObject={[
                                {
                                  aln: sequence.sequence,
                                  uniprot_ac: uniprot.uniprot_canonical_ac,
                                  uniprot_id: "",
                                },
                              ]}
                              details={[
                                {
                                  uniprot_canonical_ac: uniprot.uniprot_canonical_ac,
                                  n_glycosylation: sequenceFeatures.n_linked_sites,
                                  o_glycosylation: sequenceFeatures.o_linked_sites,
                                  snv: sequenceFeatures.snv_sites,
                                  // site_annotation: sequenceFeatures.sequon_annotation_sites,
                                  phosphorylation: sequenceFeatures.phosphorylation_sites,
                                  glycation: sequenceFeatures.glycation_sites,
                                },
                              ]}
                              flatDataStructure={true}
                              showNumbers={true}
                              selectedHighlights={selectedHighlights}
                              setSelectedHighlights={setSelectedHighlights}
                              sequenceSearchText={sequenceSearchText}
                              setSequenceSearchText={setSequenceSearchText}
                              sequenceTemplateText={sequenceTemplateText}
                              setSequenceTemplateText={setSequenceTemplateText}
                              consensusMenu={consensusMenu}
                            />
                          )}
                        </Grid>
                      </Grid>
                      {!detailData.sequence && <p>{dataStatus}</p>}
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
                <CardLoader pageLoading={cardLoadingSnv} />
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.protein.snv.title}
                        text={DetailTooltips.protein.snv.text}
                        urlText={DetailTooltips.protein.snv.urlText}
                        url={DetailTooltips.protein.snv.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">{stringConstants.sidebar.snv.displayname}</h4>

                    <div className="float-end">
                      <span>
                        <Link to={`${routeConstants.protVista}${id}`}>
                          <Button
                            type="button"
                            style={{ marginLeft: "5px" }}
                            className="gg-btn-blue"
                          >
                            <FaSearchPlus /> ProtVista
                          </Button>
                        </Link>
                      </span>

                      <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            mutataionWithdisease && mutataionWithdisease.length > 0 && {
                              display: "Disease Associated Mutations (*.csv)",
                              type: "snv_disease_associated_mutations_csv",
                              format: "csv",
                              data: "protein_section",
                              section: "snv_disease_associated_mutations",
                            },
                            mutataionWithoutdisease && mutataionWithoutdisease.length > 0 && {
                              display: "Non-disease Associated Mutations (*.csv)",
                              type: "snv_non_disease_associated_mutations_csv",
                              format: "csv",
                              data: "protein_section",
                              section: "snv_non_disease_associated_mutations",
                            }
                          ]}
                          dataId={id}
                          itemType="protein_section"
                          showBlueBackground={true}
                          enable={(mutataionWithdisease && mutataionWithdisease.length > 0) ||
                            (mutataionWithoutdisease && mutataionWithoutdisease.length > 0)}
                        />
                      </span>

                      <CardToggle cardid="mutation" toggle={collapsed.mutation} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {snv && snv.length !== 0 && (
                        <Tabs
                          activeKey={mutataionTabSelected}
                          onSelect={(key) => {
                            setMutataionTabSelected(key);
                          }}
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
                            <Container className="tab-content-padding">
                              {mutataionWithdiseaseTotal !== undefined && mutataionWithdisease && mutataionWithdisease.length > 0 && (
                                <ClientServerPaginatedTable
                                  data={mutataionWithdisease}
                                  columns={mutationColumns}
                                  onClickTarget={"#mutation"}
                                  defaultSortField="start_pos"
                                  defaultSortOrder="asc"
                                  record_type={"protein"}
                                  table_id={"snv_disease"}
                                  record_id={id}
                                  serverPagination={true}
                                  totalDataSize={mutataionWithdiseaseTotal}
                                  setAlertDialogInput={setAlertDialogInput}
                                  setCardLoading={setCardLoadingSnv}
                                />
                              )}
                              {!mutataionWithdisease.length && <p>{dataStatus}</p>}
                            </Container>
                          </Tab>
                          <Tab
                            eventKey="without_disease"
                            className="tab-content-padding"
                            title="Non-disease associated
														Mutations "
                            tabClassName={(!mutataionWithoutdisease || (mutataionWithoutdisease.length === 0)) ? "tab-disabled" : ""}
                            disabled={(!mutataionWithoutdisease || (mutataionWithoutdisease.length === 0))}
                          >
                            <Container>
                              {mutataionWithoutdiseaseTotal !== undefined && mutataionWithoutdisease && mutataionWithoutdisease.length > 0 && (
                                <ClientServerPaginatedTable
                                  data={mutataionWithoutdisease}
                                  columns={mutationColumns.filter(
                                    (column) => column.dataField !== "disease"
                                  )}
                                  onClickTarget={"#mutation"}
                                  defaultSortField="start_pos"
                                  defaultSortOrder="asc"
                                  record_type={"protein"}
                                  table_id={"snv_non_disease"}
                                  record_id={id}
                                  serverPagination={true}
                                  totalDataSize={mutataionWithoutdiseaseTotal}
                                  setAlertDialogInput={setAlertDialogInput}
                                  setCardLoading={setCardLoadingSnv}
                                />
                              )}
                              {!mutataionWithoutdisease.length && <p>{dataStatus}</p>}
                            </Container>
                          </Tab>
                        </Tabs>
                      )}

                      {!snv && <p>{dataStatus}</p>}
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
                        title={DetailTooltips.protein.mutagenesis.title}
                        text={DetailTooltips.protein.mutagenesis.text}
                        urlText={DetailTooltips.protein.mutagenesis.urlText}
                        url={DetailTooltips.protein.mutagenesis.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {" "}
                      {stringConstants.sidebar.mutagenesis.displayname}
                    </h4>
                    <div className="float-end">
                      <span>
                        <Link to={`${routeConstants.protVista}${id}`}>
                          <Button
                            type="button"
                            style={{ marginLeft: "5px" }}
                            className="gg-btn-blue"
                          >
                            <FaSearchPlus /> ProtVista
                          </Button>
                        </Link>
                      </span>

                      <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            {
                              display: "Mutagenesis (*.csv)",
                              type: "mutagenesis_csv",
                              format: "csv",
                              data: "protein_section",
                              section: "mutagenesis",
                            }
                          ]}
                          dataId={id}
                          itemType="protein_section"
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
                        <ClientServerPaginatedTable
                          data={addIndex(mutagenesis)}
                          columns={mutagenesisColumns}
                          idField={"index"}
                          onClickTarget={"#mutagenesis"}
                          defaultSortField={"start_pos"}
                          defaultSortOrder="asc"
                        />
                      )}
                      {!mutagenesis && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/*  GO annotation */}
              <Accordion
                id="GO-Annotation"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.protein.goannotation.title}
                        text={DetailTooltips.protein.goannotation.text}
                        urlText={DetailTooltips.protein.goannotation.urlText}
                        url={DetailTooltips.protein.goannotation.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.go_annotation.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="go_annotation" toggle={collapsed.go_annotation} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body style={{ paddingBottom: "0" }}>
                      <div>
                        {go_annotation &&
                          go_annotation.categories &&
                          go_annotation.categories.map((category, ind) => (
                            <div key={ind}>
                              <b>
                                <h5
                                  style={{
                                    fontWeight: "700",
                                    marginBottom: "0",
                                  }}
                                >
                                  {category.name}
                                </h5>
                              </b>
                              {category.go_terms &&
                                category.go_terms.map((term, index) => (
                                  <Row key={index}>
                                    <Col sm={9} md={9} style={{ paddingTop: "15px" }}>
                                      <a href={term.url} target="_blank" rel="noopener noreferrer">
                                        {term.name} ({term.id})
                                      </a>
                                      <DirectSearch
                                        text={proteinDirectSearch.go_id.text}
                                        searchType={"protein"}
                                        fieldType={proteinStrings.go_id.id}
                                        fieldValue={term.id}
                                        executeSearch={proteinSearch}
                                      />
                                    </Col>
                                    <Col sm={3} md={3}>
                                      <EvidenceList evidences={groupEvidences(term.evidence)} />
                                    </Col>
                                  </Row>
                                ))}
                              <strong>
                                <p
                                  className="go-annotation-total"
                                  style={{
                                    fontWeight: "600",
                                    paddingBottom: "10px",
                                  }}
                                >
                                  Total{" "}
                                  <a
                                    style={{ cursor: "pointer" }}
                                    // eslint-disable-next-line
                                    onClick={() => {
                                      handleOpenGOTermListPage(
                                        uniprot && uniprot.uniprot_canonical_ac.split("-")[0]
                                      );
                                    }}
                                    // onclick="openGOTermListPage()"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {category.total} in {category.name}
                                  </a>{" "}
                                  category.
                                </p>
                              </strong>
                            </div>
                          ))}
                        {!go_annotation && <p className="no-data-msg">{dataStatus}</p>}
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Glycan Ligands */}
              <Accordion
                id="Glycan-Ligands"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.protein.glycan_ligands.title}
                        text={DetailTooltips.protein.glycan_ligands.text}
                        urlText={DetailTooltips.protein.glycan_ligands.urlText}
                        url={DetailTooltips.protein.glycan_ligands.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.glycan_ligands.displayname}
                    </h4>
                    <div className="float-end">

                    <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            {
                              display: "Glycan Ligands (*.csv)",
                              type: "interactions_csv",
                              format: "csv",
                              fileName: "glycan_ligands",
                              data: "protein_section",
                              section: "interactions",
                            }
                          ]}
                          dataId={id}
                          itemType="protein_section"
                          showBlueBackground={true}
                          enable={interactions && interactions.length > 0}
                        />
                      </span>

                      <CardToggle cardid="glycanLigands" toggle={collapsed.glycanLigands} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {interactions && interactions.length !== 0 && (
                        <ClientServerPaginatedTable
                          data={interactions}
                          columns={glycanLigandsColumns}
                          defaultSortField={"interactor_id"}
                          onClickTarget={"#glycanLigands"}
                        />
                      )}
                      {!interactions && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/*  PTM annotation */}
              <Accordion
                id="PTM-Annotation"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.protein.ptmannotation.title}
                        text={DetailTooltips.protein.ptmannotation.text}
                        urlText={DetailTooltips.protein.ptmannotation.urlText}
                        url={DetailTooltips.protein.ptmannotation.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.ptm_annotation.displayname}
                    </h4>
                    <div className="float-end">
                      <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            {
                              display: "PTM Annotation (*.csv)",
                              type: "ptm_annotation_csv",
                              format: "csv",
                              data: "protein_section",
                              section: "ptm_annotation",
                            }
                          ]}
                          dataId={id}
                          itemType="protein_section"
                          showBlueBackground={true}
                          enable={ptm_annotation && ptm_annotation.length > 0}
                        />
                      </span>
                      <CardToggle cardid="ptm_annotation" toggle={collapsed.ptm_annotation} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {ptm_annotation && ptm_annotation.length !== 0 && (
                        <ClientServerPaginatedTable
                          data={ptmAnnotation}
                          columns={ptmAnnotationColumns}
                          onClickTarget={"#ptm_annotation"}
                          // defaultSortField={"annotation"}
                        />
                      )}
                      {!ptm_annotation && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/*  Proteoform-Annotation */}
              <Accordion
                id="Proteoform-Annotation"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.protein.proannotation.title}
                        text={DetailTooltips.protein.proannotation.text}
                        urlText={DetailTooltips.protein.proannotation.urlText}
                        url={DetailTooltips.protein.proannotation.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.pro_annotation.displayname}
                    </h4>
                    <div className="float-end">

                    <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            {
                              display: "Proteoform Annotation (*.csv)",
                              type: "pro_annotation_csv",
                              format: "csv",
                              data: "protein_section",
                              section: "pro_annotation",
                            }
                          ]}
                          dataId={id}
                          itemType="protein_section"
                          showBlueBackground={true}
                          enable={pro_annotation && pro_annotation.length > 0}
                        />
                      </span>

                       <CardToggle cardid="pro_annotation" toggle={collapsed.pro_annotation} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {pro_annotation && pro_annotation.length !== 0 && (
                        <ClientServerPaginatedTable
                          data={pro_annotation}
                          columns={proAnnotationColumns}
                          onClickTarget={"#pro_annotation"}
                          // defaultSortField={"annotation"}
                        />
                      )}
                      {!pro_annotation && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/*  Pathway */}
              <Accordion
                id="Pathway"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.protein.pathway.title}
                        text={DetailTooltips.protein.pathway.text}
                        urlText={DetailTooltips.protein.pathway.urlText}
                        url={DetailTooltips.protein.pathway.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.pathway.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="pathway" toggle={collapsed.pathway} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {itemsPathway && itemsPathway.length ? (
                        <ul className="list-style-none">
                          {itemsPathway.map((pathway, pathIndex) => (
                            <li key={pathIndex}>
                              <CollapsibleDirectSearchReference
                                resource={pathway.resource}
                                links={pathway.links}
                                text={proteinDirectSearch.pathway_id.text}
                                searchType={"protein"}
                                fieldType={proteinStrings.pathway_id.id}
                                executeSearch={proteinSearch}
                              />
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
              {/*  synthesized glycans */}
              <Accordion
                id="Synthesized-Glycans"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.protein.synthesized_glycans.title}
                        text={DetailTooltips.protein.synthesized_glycans.text}
                        urlText={DetailTooltips.protein.synthesized_glycans.urlText}
                        url={DetailTooltips.protein.synthesized_glycans.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.synthesized_glycans.displayname}
                    </h4>
                    <div className="float-end">

                      <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            {
                              display: "Synthesized Glycans (*.csv)",
                              type: "synthesized_glycans_csv",
                              format: "csv",
                              data: "protein_section",
                              section: "synthesized_glycans",
                            }
                          ]}
                          dataId={id}
                          itemType="protein_section"
                          showBlueBackground={true}
                          enable={synthesized_glycans && synthesized_glycans.length > 0}
                        />
                      </span>

                      <CardToggle cardid="synthesized_glycans" toggle={collapsed.synthesized_glycans} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {synthesized_glycans && synthesized_glycans.length !== 0 && (
                        <ClientServerPaginatedTable
                          data={synthesized_glycans}
                          columns={synthesizedGlycansColumns}
                          defaultSortField={"glytoucan_ac"}
                          onClickTarget={"#synthesized_glycans"}
                        />
                      )}
                      {!synthesized_glycans && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/*  isoforms */}
              <Accordion
                id="Isoforms"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.protein.isoforms.title}
                        text={DetailTooltips.protein.isoforms.text}
                        urlText={DetailTooltips.protein.isoforms.urlText}
                        url={DetailTooltips.protein.isoforms.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.isoforms.displayname}
                    </h4>
                    <div className="float-end">
                      <Link to={`${routeConstants.isoAlignment}${id}/isoformset.uniprotkb`}>
                        <Button
                          type="button"
                          className="gg-btn-blue"
                          disabled={!isoforms || (isoforms && isoforms.length <= 1)}
                        >
                          Alignment
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        style={{
                          marginLeft: "10px",
                        }}
                        className="gg-btn-blue"
                        onClick={() => setShowIsoformSequences(!showIsoformSequences)}
                      >
                        {showIsoformSequences ? "Hide Sequences" : "Show  Sequences"}
                      </Button>
                      <CardToggle cardid="isoforms" toggle={collapsed.isoforms} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <div className="mb-3">
                        {isoforms && (
                          <Grid container className="table-body">
                            {isoforms.map((isoformsS, isoformIndex) => (
                              <Grid item xs={12} key={isoformIndex}>
                                <div>
                                  <strong>{proteinStrings.isoform_acc.name}: </strong>

                                  <a href={isoformsS.url} target="_blank" rel="noopener noreferrer">
                                    {isoformsS.isoform_ac}
                                  </a>
                                </div>
                                {isoformsS.sequence && isoformsS.sequence.length && (
                                  <div>
                                    <strong> {proteinStrings.isoform_length.name}: </strong>
                                    {isoformsS.sequence.length}
                                  </div>
                                )}
                                {isoformsS.locus && (
                                  <div>
                                    {proteinStrings.chromosome.name}: {""}
                                    {isoformsS.locus ? isoformsS.locus.chromosome : "NA"} {""}(
                                    {isoformsS.locus ? isoformsS.locus.start_pos : "NA"} -{" "}
                                    {isoformsS.locus ? isoformsS.locus.end_pos : "NA"})
                                  </div>
                                )}
                                <Grid item className="badge-grid" xs={12}>
                                  <EvidenceList
                                    inline={true}
                                    evidences={groupEvidences(
                                      isoformsS.locus ? isoformsS.locus.evidence : []
                                    )}
                                  />
                                </Grid>
                                {showIsoformSequences && (
                                  <Grid item style={{ paddingBottom: "40px" }}>
                                    {/* <IsoformSequenceDisplay
                                    sequenceData={isoformsS.sequence}
                                  /> */}
                                    <div className="sequnce_highlight">
                                      {" "}
                                      <SequenceDisplay
                                        sequenceData={isoformsS.sequence.sequence
                                          .split("")
                                          .map((a) => ({
                                            character: a,
                                          }))}
                                      />
                                    </div>
                                  </Grid>
                                )}
                              </Grid>
                            ))}
                          </Grid>
                        )}
                      </div>
                      {!isoforms && (
                        <p classisoforms_ac="no-data-msg-publication">{dataStatus}</p>
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Homologs / orthologs */}
              <Accordion
                id="Homologs"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.protein.homologs.title}
                        text={DetailTooltips.protein.homologs.text}
                        urlText={DetailTooltips.protein.homologs.urlText}
                        url={DetailTooltips.protein.homologs.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.homologs.displayname}
                    </h4>
                    <div className="float-end">
                      {orthologs && orthologs.length && (
                        <>
                          {showAlignmentOptions && (
                            <AlignmentDropdown
                              types={clusterType}
                              dataType="protein_detail"
                              dataId={id}
                            />
                          )}

                          <Button
                            style={{
                              marginLeft: "10px",
                            }}
                            type="button"
                            className="gg-btn-blue"
                            onClick={() => setShowhomologSequences(!showhomologSequences)}
                          >
                            {showhomologSequences ? "Hide Sequences" : "Show  Sequences"}
                          </Button>
                        </>
                      )}
                      <CardToggle cardid="homologs" toggle={collapsed.homologs} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {orthologs && (
                        <Grid container classorthologs_ac="table-body">
                          {orthologs.map((orthologsS, orthologsSuniprot_canonical_ac) => (
                            <Grid item xs={12} key={orthologsSuniprot_canonical_ac}>
                              <div>
                                <strong>UniProtKB Homolog Accession: </strong>
                                <Link
                                  to={
                                    routeConstants.proteinDetail + orthologsS.uniprot_canonical_ac
                                  }
                                >
                                  {orthologsS.uniprot_canonical_ac}
                                </Link>
                              </div>
                              <div>
                                <strong>Protein Name: </strong>
                                {orthologsS.protein_name}
                              </div>
                              <div>
                                <strong>Gene Name: </strong>
                                {orthologsS.gene_name}
                              </div>
                              <div>
                                <strong>{glycanStrings.organism.name}: </strong>
                                <span className="text-capitalize">
                                  {orthologsS.glygen_name}
                                </span>
                              </div>
                              <div>
                                <strong>{proteinStrings.reference_species.name}: </strong>
                                  {orthologsS.organism} {"["}
                                  {/* <LineTooltip text="View details on NCBI"> */}
                                  <a
                                    href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${orthologsS.tax_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {orthologsS.tax_id}
                                  </a>
                                  {/* </LineTooltip> */}
                                  {"]"}
                              </div>
                              <Grid item className="badge-grid" xs={12}>
                                <EvidenceList
                                  inline={true}
                                  evidences={groupEvidences(orthologsS.evidence)}
                                />
                              </Grid>
                              {showhomologSequences && (
                                <Grid item style={{ paddingBottom: "40px" }}>
                                  <div className="sequnce_highlight">
                                    {" "}
                                    <SequenceDisplay
                                      sequenceData={orthologsS.sequence.sequence
                                        .split("")
                                        .map((a) => ({
                                          character: a,
                                        }))}
                                    />
                                  </div>
                                </Grid>
                              )}
                            </Grid>
                          ))}
                        </Grid>
                      )}

                      {!orthologs && (
                        <p classorthologs_ac="no-data-msg-publication">{dataStatus}</p>
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/*  disease */}
              <Accordion
                id="Disease"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.protein.disease.title}
                        text={DetailTooltips.protein.disease.text}
                        urlText={DetailTooltips.protein.disease.urlText}
                        url={DetailTooltips.protein.disease.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.disease.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="disease" toggle={collapsed.disease} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body className="card-padding-zero">
                      <Table hover fluid="true">
                        {diseaseData && diseaseData.length > 0 && (
                          <tbody className="table-body">
                            {diseaseData.map((thisDisease, indDis) => (
                              <tr className="table-row" key={"dis" + indDis}>
                                <td>
                                  <div className="mb-3">
                                    <Grid item xs={12}>
                                      <div>
                                        <div className="mb-3">
                                          <strong> {proteinStrings.name.name}: </strong>{" "}
                                          {thisDisease.recommended_name.name} (
                                          <a
                                            href={thisDisease.recommended_name.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {thisDisease.recommended_name.id}
                                          </a>
                                          )
                                          <DirectSearch
                                            text={proteinDirectSearch.disease_id.text}
                                            searchType={"protein"}
                                            fieldType={proteinStrings.disease_id.id}
                                            fieldValue={thisDisease.recommended_name.id}
                                            executeSearch={proteinSearch}
                                          />
                                          <EvidenceList
                                            inline={true}
                                            evidences={groupEvidences(thisDisease.evidence)}
                                          />
                                        </div>
                                        {thisDisease.recommended_name.description && (
                                          <div className="mb-3">
                                            <strong> {proteinStrings.description.name}: </strong>
                                            {thisDisease.recommended_name.description}{" "}
                                          </div>
                                        )}
                                        {thisDisease.synonyms && thisDisease.synonyms.length && (
                                          <div className="mb-3">
                                            <strong> {proteinStrings.synonyms.name}: </strong>
                                            <ul style={{ marginLeft: "-40px" }}>
                                              <ul>
                                                {thisDisease.synonyms
                                                  .slice(
                                                    0,
                                                    thisDisease.synShowMore
                                                      ? thisDisease.synShortLen
                                                      : thisDisease.synLen
                                                  )
                                                  .map((synonyms, indSyn) => (
                                                    <li key={"syn" + indSyn}>
                                                      {" "}
                                                      {synonyms.name}{" "}
                                                      {synonyms.resource &&
                                                        synonyms.resource.length !== 0 && (
                                                          <>
                                                            {" "}
                                                            [
                                                            {synonyms.resource.map(
                                                              (res, ind, arr) => {
                                                                return (
                                                                  <span key={"spn" + ind}>
                                                                    <a
                                                                      href={res.url}
                                                                      target="_blank"
                                                                      rel="noopener noreferrer"
                                                                    >
                                                                      {res.id}
                                                                    </a>
                                                                    {ind < arr.length - 1
                                                                      ? ", "
                                                                      : ""}
                                                                  </span>
                                                                );
                                                              }
                                                            )}
                                                            ]
                                                          </>
                                                        )}
                                                    </li>
                                                  ))}
                                              </ul>
                                              {thisDisease.synBtnDisplay && (
                                                <Button
                                                  style={{
                                                    marginLeft: "20px",
                                                    marginTop: "5px",
                                                  }}
                                                  className={"lnk-btn"}
                                                  variant="link"
                                                  onClick={() => {
                                                    setDiseaseDataSynonyms(
                                                      thisDisease.recommended_name.name
                                                    );
                                                  }}
                                                >
                                                  {thisDisease.synShowMore
                                                    ? "Show More..."
                                                    : "Show Less..."}
                                                </Button>
                                              )}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    </Grid>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        )}
                      </Table>
                      {diseaseData && diseaseData.length === 0 && (
                        <p className="no-data-msg-publication">{dataStatus}</p>
                      )}
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
                        title={DetailTooltips.protein.biomarkers.title}
                        text={DetailTooltips.protein.biomarkers.text}
                        urlText={DetailTooltips.protein.biomarkers.urlText}
                        url={DetailTooltips.protein.biomarkers.url}
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
                              data: "protein_section",
                              section: "biomarkers",
                            }
                          ]}
                          dataId={id}
                          itemType="protein_section"
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
                        <ClientServerPaginatedTable
                          data={biomarkers}
                          columns={biomarkerColumns}
                          onClickTarget={"#biomarkers"}
                          defaultSortField={"biomarker_id"}
                          defaultSortOrder={"asc"}
                        />
                      )}
                      {!biomarkers && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              {/*  Expression Tissue */}
              <Accordion
                id="Expression-Tissue"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.protein.expression_tissue.title}
                        text={DetailTooltips.protein.expression_tissue.text}
                        urlText={DetailTooltips.protein.expression_tissue.urlText}
                        url={DetailTooltips.protein.expression_tissue.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.expression_Tissue.displayname}
                    </h4>
                    <div className="float-end">

                      <span className="gg-download-btn-width text-end">
                        <DownloadButton
                          types={[
                            {
                              display: "Expression Tissue (*.csv)",
                              type: "expression_tissue_csv",
                              format: "csv",
                              data: "protein_section",
                              section: "expression_tissue",
                            }
                          ]}
                          dataId={id}
                          itemType="protein_section"
                          showBlueBackground={true}
                          enable={expression_tissue && expression_tissue.length > 0}
                        />
                      </span>

                      <CardToggle cardid="expression_tissue" toggle={collapsed.expression_tissue} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {expression_tissue && expression_tissue.length !== 0 && (
                        <ClientServerPaginatedTable
                          data={expression_tissue.map(data => {return {...data, scorePresent: data.score, tissueName: (data.tissue ? data.tissue.name : "")}})}
                          columns={expressionTissueColumns}
                          onClickTarget={"#expression_tissue"}
                          defaultSortField={"tissue"}
                        />
                      )}
                      {!expression_tissue && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/*  Expression Disease */}
              <Accordion
                id="Expression-Disease"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.protein.expression_disease.title}
                        text={DetailTooltips.protein.expression_disease.text}
                        urlText={DetailTooltips.protein.expression_disease.urlText}
                        url={DetailTooltips.protein.expression_disease.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {" "}
                      {stringConstants.sidebar.expression_Disease.displayname}
                    </h4>
                    <div className="float-end">

                      <span className="gg-download-btn-width text-end">
                          <DownloadButton
                            types={[
                              {
                                display: "Expression Disease (*.csv)",
                                type: "expression_disease_csv",
                                format: "csv",
                                data: "protein_section",
                                section: "expression_disease",
                              }
                            ]}
                            dataId={id}
                            itemType="protein_section"
                            showBlueBackground={true}
                            enable={expression_disease && expression_disease.length > 0}
                          />
                        </span>

                      <CardToggle cardid="expression_disease" toggle={collapsed.expression_disease} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {expression_disease && expression_disease.length !== 0 && (
                        <ClientServerPaginatedTable
                          data={expression_disease}
                          columns={expressionDiseaseColumns}
                          onClickTarget={"#expression_disease"}
                          defaultSortField={"disease"}
                        />
                      )}
                      {!expression_disease && <p>{dataStatus}</p>}
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
                        title={DetailTooltips.protein.cross_references.title}
                        text={DetailTooltips.protein.cross_references.text}
                        urlText={DetailTooltips.protein.cross_references.urlText}
                        url={DetailTooltips.protein.cross_references.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.cross_ref.displayname}
                    </h4>
                    <div className="float-end">
                      <Button
                        style={{
                          marginLeft: "10px",
                        }}
                        type="button"
                        className="gg-btn-blue"
                        onClick={() => {setShowCategories(!showCategories); setExpandedCategories({catInd:[]})}}
                      >
                        {showCategories ? "Hide All" : "Show All"}
                      </Button>
                      <CardToggle cardid="crossref" toggle={collapsed.crossref} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {itemsCrossRef && itemsCrossRef.length ? (
                        <div>
                          {itemsCrossRef.map((dbItem, catInd) => (
                            <AccordionMUI disableGutters={true} 
                              key={catInd}
                              expanded={showCategories ? !expandedCategories.catInd.includes(catInd) : expandedCategories.catInd.includes(catInd)} 
                              onChange={(event, expanded) => handleCategories(event, showCategories ? !expanded : expanded, catInd)}
                            >
                              <AccordionSummary
                                style={{backgroundColor: "#f5f8fa", height: "50px"}}
                                expandIcon={<ExpandMoreIcon className="gg-blue-color"/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                              >
                                <Typography className="gg-blue-color">{dbItem.category}</Typography>
                              </AccordionSummary>
                              <AccordionDetails style={{paddingBottom: "0px"}}>
                                <ul className="list-style-none">
                                  {dbItem.database.map((crossRef, dbInd) => (
                                    <li key={dbInd}>
                                      <CollapsableReference
                                        database={crossRef.database}
                                        links={crossRef.links}
                                      />
                                    </li>
                                  ))}
                                </ul>
                              </AccordionDetails>
                            </AccordionMUI>
                          ))}
                        </div>
                      ) : (
                        <p>{dataStatus}</p>
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
                        title={DetailTooltips.protein.history.title}
                        text={DetailTooltips.protein.history.text}
                        urlText={DetailTooltips.protein.history.urlText}
                        url={DetailTooltips.protein.history.url}
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
                  <Accordion.Collapse eventKey="0" out={collapsed.history ? "false" : "true"}>
                    <Card.Body>
                      {history && history.length ? (
                        <>
                          {history.sort(sortedHistory).map((historyItem, ind) => (
                            <ul className="ps-3" key={ind}>
                              <li>{capitalizeFirstLetter(historyItem.description)} </li>
                            </ul>
                          ))}
                        </>
                      ): (
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
                        title={DetailTooltips.protein.publications.title}
                        text={DetailTooltips.protein.publications.text}
                        urlText={DetailTooltips.protein.publications.urlText}
                        url={DetailTooltips.protein.publications.url}
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
                        onChange={(event) => setPublicationSort(event.target.value)}
                      >
                        <option value="title">Title</option>
                        <option value="date">Date</option>
                        <option value="journal">Journal</option>
                        <option value="authors">Author List</option>
                      </select>{" "}
                      <select
                        className="select-dropdown pt-0"
                        value={publicationDirection}
                        onChange={(event) => setPublicationDirection(event.target.value)}
                      >
                        <option value="asc">Asc</option>
                        <option value="desc">Desc</option>
                      </select>
                      <CardToggle cardid="publication" toggle={collapsed.publication} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0" out={collapsed.publication ? "false" : "true"}>
                    <Card.Body className="card-padding-zero">
                    <div className="m-3">
                      {publicationTotal !== undefined && publication && publication.length > 0 && <ClientServerPaginatedTable
                              data={publication}
                              columns={paperColumns}
                              tableHeader={'paper-table-header'}
                              wrapperClasses={"table-responsive table-height-auto"}
                              defaultSizePerPage={200}
                              defaultSortField={"date"}
                              defaultSortOrder={"desc"}
                              onClickTarget={"#publication"}
                              record_type={"protein"}
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
                      {!publication && (
                        <p className="no-data-msg-publication">{dataStatus}</p>
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

export default ProteinDetail;

// ProteinDetail.propTypes = {
// 	setAlertDialogInput: PropTypes.func,
// 	setCardLoading: PropTypes.func
// };