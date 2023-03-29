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
import "../css/detail.css";
import "../css/Responsive.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import CardToggle from "../components/cards/CardToggle";
import DownloadButton from "../components/DownloadButton";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
// import PublicationsMenu from '../components/PublicationsMenu';
import DetailTooltips from "../data/json/proteinDetailTooltips.json";
import HelpTooltip from "../components/tooltip/HelpTooltip";
import FeedbackWidget from "../components/FeedbackWidget";
import { Tab, Tabs, Container } from "react-bootstrap";
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
const proteinDirectSearch = stringConstants.protein.direct_search;

const items = [
  { label: stringConstants.sidebar.general.displayname, id: "General" },
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

const getItemsCrossRef = (data) => {
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
            id: crossrefitem.id,
          });
        }
      }
      if (!found) {
        itemscrossRef.push({
          database: crossrefitem.database,
          links: [
            {
              url: crossrefitem.url,
              id: crossrefitem.id,
            },
          ],
        });
      }
    }

    itemscrossRef.sort(function (a, b) {
      if (a.database.toLowerCase() > b.database.toLowerCase()) {
        return 1;
      }
      if (b.database.toLowerCase() > a.database.toLowerCase()) {
        return -1;
      }
      return 0;
    });
  }

  return itemscrossRef;
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
  const [glycosylationWithoutImage, setGlycosylationWithoutImage] = useState([]);
  const [glycosylationTabSelected, setGlycosylationTabSelected] = useState("reported_with_glycan");
  const [mutataionWithdisease, setMutataionWithdisease] = useState([]);
  const [mutataionWithoutdisease, setMutataionWithoutdisease] = useState([]);
  const [mutataionTabSelected, setMutataionTabSelected] = useState("");
  const [ptmAnnotation, setPtmAnnotation] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
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
  const [publicationSort, setPublicationSort] = useState("date");
  const [publicationDirection, setPublicationDirection] = useState("desc");
  useEffect(() => {
    setNonExistent(null);
    setPageLoading(true);
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
      } else {
        let detailDataTemp = data;
        setItemsCrossRef(getItemsCrossRef(data));
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
          newSidebarData = setSidebarItemState(newSidebarData, "Publication", true);
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
        setPageLoading(false);
      }

      // Need to call it second time due to glycosylationWithImage and glycosylationWithoutImage table loading time.
      setTimeout(() => {
        const anchorElement = location.hash;
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
              <ul key={index} className="pl-3">
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
            props.history.push(routeConstants.proteinList + response.data["list_id"]);
          });
          setPageLoading(false);
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

  if (nonExistent) {
    return (
      <Container className="tab-content-border2">
        <Alert className="erroralert" severity="error">
          {nonExistent.reason && nonExistent.reason.type && nonExistent.reason.type !== "invalid" ? (<>
            {nonExistent.reason.type !== "never_in_glygen_current_in_uniprotkb" && (<AlertTitle> {id} is no longer valid Protein Id</AlertTitle>)}
            {nonExistent.reason.type === "never_in_glygen_current_in_uniprotkb" && (<AlertTitle> The UniProtKB accession {id} does not exists in GlyGen</AlertTitle>)}
            <span>{capitalizeFirstLetter(nonExistent.reason.description)}</span>
            <ul>
              <span>
                {nonExistent.reason.type === "replacement_in_glygen" && nonExistent.reason.replacement_id_list && (
                    nonExistent.reason.replacement_id_list.map((repID) =>
                    <li>
                      <Link to={`${routeConstants.proteinDetail}${repID}`}>
                        {" "}
                        {"Go to Protein: "  + repID}
                      </Link>
                    </li>
                    )
                  )}
              </span>
            </ul>
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
                itemType="protein"
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
                        {!gene && <p className="no-data-msg-publication">No data available.</p>}
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
                              <>
                                <strong>{proteinStrings.organism.name}: </strong>
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
                                <EvidenceList evidences={organismEvidence[orgEvi].evidence} />
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
                      <CardToggle cardid="glycosylation" toggle={collapsed.glycosylation} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {glycosylation && glycosylation.length && (
                        <>
                          <div className="Glycosummary">
                            <strong>Glycosylation Summary:</strong>{" "}
                            {createGlycosylationSummary(glycosylation)}
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
                              //disabled={(!glycosylationWithImage || (glycosylationWithImage.length === 0))}
                            >
                              {glycosylationWithImage && glycosylationWithImage.length !== 0 && (
                                <div className="Glycosummary">
                                  <strong>Summary:</strong>{" "}
                                  {createGlycosylationSummary(glycosylationWithImage, true)}
                                </div>
                              )}
                              <Container className="tab-content-padding">
                                {glycosylationWithImage && glycosylationWithImage.length > 0 && (
                                  <ClientPaginatedTable
                                    data={addIndex(glycosylationWithImage)}
                                    columns={glycoSylationColumns}
                                    idField={"index"}
                                    onClickTarget={"#glycosylation"}
                                    defaultSortField="start_pos"
                                    defaultSortOrder="asc"
                                  />
                                )}
                                {!glycosylationWithImage.length && (
                                  <div className="tab-content-padding">No data available.</div>
                                )}
                              </Container>
                            </Tab>

                            <Tab
                              eventKey="reported"
                              title="Reported Sites"
                              // disabled={(!glycosylationWithoutImage || (glycosylationWithoutImage.length === 0))}
                            >
                              {glycosylationWithoutImage && glycosylationWithoutImage.length !== 0 && (
                                <div className="Glycosummary">
                                  <strong>Summary:</strong>{" "}
                                  {createGlycosylationSummary(glycosylationWithoutImage)}
                                </div>
                              )}
                              <Container className="tab-content-padding">
                                {glycosylationWithoutImage &&
                                  glycosylationWithoutImage.length > 0 && (
                                    <ClientPaginatedTable
                                      data={glycosylationWithoutImage}
                                      columns={glycoSylationColumns.filter(
                                        (column) =>
                                          column.dataField !== "image" &&
                                          column.dataField !== "glytoucan_ac"
                                      )}
                                      onClickTarget={"#glycosylation"}
                                      defaultSortField="start_pos"
                                      defaultSortOrder="asc"
                                    />
                                  )}
                                {!glycosylationWithoutImage.length && (
                                  <div className="tab-content-padding">No data available.</div>
                                )}
                              </Container>
                            </Tab>
                            <Tab
                              eventKey="predicted"
                              title="Predicted Only"
                              //disabled={(!glycosylationWithImage || (glycosylationWithImage.length === 0))}
                            >
                              {glycosylationPredicted && glycosylationPredicted.length !== 0 && (
                                <div className="Glycosummary">
                                  <strong>Summary:</strong>{" "}
                                  {createGlycosylationSummary(glycosylationPredicted)}
                                </div>
                              )}
                              <Container className="tab-content-padding">
                                {glycosylationPredicted && glycosylationPredicted.length > 0 && (
                                  <ClientPaginatedTable
                                    data={glycosylationPredicted}
                                    columns={glycoSylationColumns.filter(
                                      (column) =>
                                        column.dataField !== "image" &&
                                        column.dataField !== "glytoucan_ac"
                                    )}
                                    onClickTarget={"#glycosylation"}
                                    defaultSortField="start_pos"
                                    defaultSortOrder="asc"
                                  />
                                )}
                                {!glycosylationPredicted.length && (
                                  <div className="tab-content-padding">No data available.</div>
                                )}
                              </Container>
                            </Tab>
                            <Tab
                              eventKey="automatic_literature_mining"
                              title="Text Mining"
                              // disabled={
                              //   !glycosylationMining ||
                              //   glycosylationMining.length === 0
                              // }
                            >
                              {glycosylationMining && glycosylationMining.length !== 0 && (
                                <div className="Glycosummary">
                                  <strong>Summary:</strong>{" "}
                                  {createGlycosylationSummary(glycosylationMining)}
                                </div>
                              )}
                              <Container className="tab-content-padding">
                                {glycosylationMining && glycosylationMining.length > 0 && (
                                  <ClientPaginatedTable
                                    data={glycosylationMining}
                                    columns={glycoSylationColumns.filter(
                                      (column) =>
                                        column.dataField !== "image" &&
                                        column.dataField !== "glytoucan_ac"
                                    )}
                                    onClickTarget={"#glycosylation"}
                                    defaultSortField="start_pos"
                                    defaultSortOrder="asc"
                                  />
                                )}
                                {!glycosylationMining.length && (
                                  <div className="tab-content-padding">No data available.</div>
                                )}
                              </Container>
                            </Tab>
                          </Tabs>
                        </>
                      )}

                      {!glycosylation && <p>No data available.</p>}
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
                      <CardToggle cardid="phosphorylation" toggle={collapsed.phosphorylation} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {phosphorylation && phosphorylation.length !== 0 && (
                        <ClientPaginatedTable
                          data={phosphorylation
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
                          columns={phosphorylationColumns}
                          onClickTarget={"#phosphorylation"}
                          defaultSortField={"start_pos"}
                          defaultSortOrder="asc"
                        />
                      )}
                      {!phosphorylation && <p>No data available.</p>}
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
                      <CardToggle cardid="glycation" toggle={collapsed.glycation} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {glycation && glycation.length !== 0 && (
                        <ClientPaginatedTable
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
                      {!glycation && <p>No data available.</p>}
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
                        <ul className="list-style-none">
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
                        <p>No data available.</p>
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
                                <tr className="table-row">
                                  <td key={"td" + funIndex}>
                                    <p key={"p" + funIndex}><CollapsibleText text={group.annotation} lines={2}/></p>
                                    <EvidenceList inline={true} key={"evidence" + funIndex} evidences={groupEvidences(group.evidence)} />
                                  </td>
                                </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                      {!functions && <p className="no-data-msg-publication">No data available.</p>}
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
                            {detailData.sequence && (
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
                                    glycosylation: detailData.glycosylation,
                                    snv: detailData.snv,
                                    site_annotation: detailData.site_annotation,
                                    phosphorylation: detailData.phosphorylation,
                                    glycation: detailData.glycation,
                                  },
                                ]}
                                multiSequence={false}
                                selectedHighlights={selectedHighlights}
                                sequenceSearchText={sequenceSearchText}
                              />
                            )}
                          </div>
                        </Grid>
                        <Grid item className="content-active">
                          {detailData.sequence && (
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
                                  glycosylation: detailData.glycosylation,
                                  snv: detailData.snv,
                                  site_annotation: detailData.site_annotation,
                                  phosphorylation: detailData.phosphorylation,
                                  glycation: detailData.glycation,
                                },
                              ]}
                              showNumbers={true}
                              selectedHighlights={selectedHighlights}
                              setSelectedHighlights={setSelectedHighlights}
                              sequenceSearchText={sequenceSearchText}
                              setSequenceSearchText={setSequenceSearchText}
                            />
                          )}
                        </Grid>
                      </Grid>
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
                            //disabled={(!mutataionWithdisease || (mutataionWithdisease.length === 0))}
                          >
                            <Container className="tab-content-padding">
                              {mutataionWithdisease && mutataionWithdisease.length > 0 && (
                                <ClientPaginatedTable
                                  data={mutataionWithdisease}
                                  columns={mutationColumns}
                                  onClickTarget={"#mutation"}
                                  defaultSortField="start_pos"
                                  defaultSortOrder="asc"
                                />
                              )}
                              {!mutataionWithdisease.length && <p>No data available.</p>}
                            </Container>
                          </Tab>
                          <Tab
                            eventKey="without_disease"
                            className="tab-content-padding"
                            title="Non-disease associated
														Mutations "
                            // disabled={(!mutataionWithoutdisease || (mutataionWithoutdisease.length === 0))}
                          >
                            <Container>
                              {mutataionWithoutdisease && mutataionWithoutdisease.length > 0 && (
                                <ClientPaginatedTable
                                  data={mutataionWithoutdisease}
                                  columns={mutationColumns.filter(
                                    (column) => column.dataField !== "disease"
                                  )}
                                  onClickTarget={"#mutation"}
                                  defaultSortField="start_pos"
                                  defaultSortOrder="asc"
                                />
                              )}
                              {!mutataionWithoutdisease.length && <p>No data available.</p>}
                            </Container>
                          </Tab>
                        </Tabs>
                      )}

                      {!snv && <p>No data available.</p>}
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
                      <CardToggle cardid="mutagenesis" toggle={collapsed.mutagenesis} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {mutagenesis && mutagenesis.length !== 0 && (
                        <ClientPaginatedTable
                          data={addIndex(mutagenesis)}
                          columns={mutagenesisColumns}
                          idField={"index"}
                          onClickTarget={"#mutagenesis"}
                          defaultSortField={"start_pos"}
                          defaultSortOrder="asc"
                        />
                      )}
                      {!mutagenesis && <p>No data available.</p>}
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
                          go_annotation.categories.map((category) => (
                            <>
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
                            </>
                          ))}
                        {!go_annotation && <p className="no-data-msg">No data available.</p>}
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
                      <CardToggle cardid="glycanLigands" toggle={collapsed.glycanLigands} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {interactions && interactions.length !== 0 && (
                        <ClientPaginatedTable
                          data={interactions}
                          columns={glycanLigandsColumns}
                          defaultSortField={"interactor_id"}
                          onClickTarget={"#glycanLigands"}
                        />
                      )}
                      {!interactions && <p>No data available.</p>}
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
                      <CardToggle cardid="ptm_annotation" toggle={collapsed.ptm_annotation} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {ptm_annotation && ptm_annotation.length !== 0 && (
                        <ClientPaginatedTable
                          data={ptmAnnotation}
                          columns={ptmAnnotationColumns}
                          onClickTarget={"#ptm_annotation"}
                          // defaultSortField={"annotation"}
                        />
                      )}
                      {!ptm_annotation && <p>No data available.</p>}
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
                       <CardToggle cardid="pro_annotation" toggle={collapsed.pro_annotation} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {pro_annotation && pro_annotation.length !== 0 && (
                        <ClientPaginatedTable
                          data={pro_annotation}
                          columns={proAnnotationColumns}
                          onClickTarget={"#pro_annotation"}
                          // defaultSortField={"annotation"}
                        />
                      )}
                      {!pro_annotation && <p>No data available.</p>}
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
                        <p>No data available.</p>
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
                      <CardToggle cardid="synthesized_glycans" toggle={collapsed.synthesized_glycans} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {synthesized_glycans && synthesized_glycans.length !== 0 && (
                        <ClientPaginatedTable
                          data={synthesized_glycans}
                          columns={synthesizedGlycansColumns}
                          defaultSortField={"glytoucan_ac"}
                          onClickTarget={"#synthesized_glycans"}
                        />
                      )}
                      {!synthesized_glycans && <p>No data available.</p>}
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
                        <p classisoforms_ac="no-data-msg-publication">No data available.</p>
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
                                {orthologsS.organism}{" "}
                                <span className="text-capitalize">
                                  {"("}
                                  {orthologsS.common_name}
                                  {")"}
                                </span>
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
                        <p classorthologs_ac="no-data-msg-publication">No data available.</p>
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
                            {diseaseData.map((thisDisease) => (
                              <tr className="table-row">
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
                                                  .map((synonyms) => (
                                                    <li>
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
                                                                  <>
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
                                                                  </>
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
                        <p className="no-data-msg-publication">No data available.</p>
                      )}
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
                      <CardToggle cardid="expression_tissue" toggle={collapsed.expression_tissue} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {expression_tissue && expression_tissue.length !== 0 && (
                        <ClientPaginatedTable
                          data={expression_tissue.map(data => {return {...data, scorePresent: data.score, tissueName: (data.tissue ? data.tissue.name : "")}})}
                          columns={expressionTissueColumns}
                          onClickTarget={"#expression_tissue"}
                          defaultSortField={"tissue"}
                        />
                      )}
                      {!expression_tissue && <p>No data available.</p>}
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
                      <CardToggle cardid="expression_disease" toggle={collapsed.expression_disease} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {expression_disease && expression_disease.length !== 0 && (
                        <ClientPaginatedTable
                          data={expression_disease}
                          columns={expressionDiseaseColumns}
                          onClickTarget={"#expression_disease"}
                          defaultSortField={"disease"}
                        />
                      )}
                      {!expression_disease && <p>No data available.</p>}
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
                      <CardToggle cardid="crossref" toggle={collapsed.crossref} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {itemsCrossRef && itemsCrossRef.length ? (
                        <div className="mb-3">
                          <ul className="list-style-none">
                            {/* <Row> */}
                            {itemsCrossRef.map((crossRef, index) => (
                              <li key={index}>
                                <CollapsableReference
                                  database={crossRef.database}
                                  links={crossRef.links}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p>No data available.</p>
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
                          {history.sort(sortedHistory).map((historyItem) => (
                            <ul className="pl-3">
                              <li>{capitalizeFirstLetter(historyItem.description)} </li>
                            </ul>
                          ))}
                        </>
                      ): (
                        <span>No data available.</span>
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
                      <Table hover fluid="true">
                        {sortedPublication && (
                          <tbody className="table-body">
                            {sortedPublication.map((pub, pubIndex) => (
                              <tr className="table-row">
                                <td key={pubIndex}>
                                  <div className="mb-3">
                                    <div>
                                      <h5 style={{ marginBottom: "3px" }}>
                                        <strong>{pub.title}</strong>
                                      </h5>
                                    </div>
                                    <div>{pub.authors}</div>
                                    <div>
                                      {pub.journal} <span>&nbsp;</span>({pub.date})
                                    </div>
                                    <div>
                                      {pub.reference.map((ref) => (
                                        <>
                                          <FiBookOpen />
                                          <span style={{ paddingLeft: "15px" }}>
                                            {/* {glycanStrings.pmid.shortName}: */}
                                            {/* {glycanStrings.referenceType[ref.type].shortName}: */}
                                            {ref.type}:{" "}
                                          </span>{" "}
                                          <Link
                                            to={`${routeConstants.publicationDetail}${ref.type}/${ref.id}`}
                                          >
                                            <>{ref.id}</>
                                          </Link>
                                          {/* <a
                                            href={ref.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <>{ref.id}</>
                                          </a> */}{" "}
                                          <DirectSearch
                                            text={proteinDirectSearch.pmid.text}
                                            searchType={"protein"}
                                            fieldType={proteinStrings.pmid.id}
                                            fieldValue={ref.id}
                                            executeSearch={proteinSearch}
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
                      </Table>
                      {!publication && (
                        <p className="no-data-msg-publication">No data available.</p>
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
