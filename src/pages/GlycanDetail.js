/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useReducer, useContext } from "react";
import { getGlycanDetail, getGlycanImageUrl, getGlycanJson } from "../data/glycan";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Sidebar from "../components/navigation/Sidebar";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { Grid } from "@mui/material";
import { Col, Row, Image } from "react-bootstrap";
import { FiBookOpen } from "react-icons/fi";
import { groupEvidences, groupOrganismEvidences, groupOrganismEvidencesTableView } from "../data/data-format";
import EvidenceList from "../components/EvidenceList";
import ClientPaginatedTable from "../components/ClientPaginatedTable";
import ClientServerPaginatedTable from "../components/ClientServerPaginatedTable";
import ClientServerPaginatedTableFullScreen from "../components/ClientServerPaginatedTableFullScreen";
import ClientExpandableTable from "../components/ClientExpandableTable"
import CollapsibleTextTableView from "../components/CollapsibleTextTableView"
import "../css/detail.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import DownloadButton from "../components/DownloadButton";
import DownloadFile from "../components/DownloadFile"
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
import { Alert, AlertTitle, Link as LinkMUI } from "@mui/material";
import { Tab, Tabs, Container, NavDropdown, Navbar, Nav } from "react-bootstrap";
import CollapsableReference from "../components/CollapsableReference";
import DirectSearch from "../components/search/DirectSearch.js";
import { getGlycanSearch } from "../data/glycan";
import CardToggle from "../components/cards/CardToggle";
import ThreeDViewer from "../components/viewer/ThreeDViewer.js";
import GlycanViewer from "../components/viewer/GlycanViewer.js";
import CardLoader from "../components/load/CardLoader";
import AccordionMUI from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  GLYGEN_API,
} from "../envVariables";
import IUPACresJson from "../data/json/glycan-viewer-residues";
import motifListJson from "../data/json/motif_mapping";
import enzymeJson from "../data/json/enzyme_mapping";
import GlyGenNotificationContext from "../components/GlyGenNotificationContext.js";
import { addIDsToStore } from "../data/idCartApi"
import CollapsableTextArray from "../components/CollapsableTextArray";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const glycanStrings = stringConstants.glycan.common;
const glycanDirectSearch = stringConstants.glycan.direct_search;
const proteinStrings = stringConstants.protein.common;
const motifStrings = stringConstants.motif.common;
const biomarkerStrings = stringConstants.biomarker.common;

const items = [
  { label: stringConstants.sidebar.general.displayname, id: "General" },
  { label: stringConstants.sidebar.feature_view.displayname, id: "Feature-View"},  
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
    label: stringConstants.sidebar.biomarkers.displayname,
    id: "Biomarkers"
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

const getItemsCrossRefWithCategory = (data) => {
  let itemscrossRefCategory = [];
  //check data.
  if (data.crossref) {
    for (let crossrefitem of data.crossref) {
      if (crossrefitem.categories === undefined) {
        crossrefitem.categories = ["Other"]
      }
      if (crossrefitem.database === undefined) {
        crossrefitem.database = "";
      }
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
  const [glycanJSON, setGlycanJSON] = useState({});
  const [glycanEnzymeList, setGlycanEnzymeList] = useState([]);
  const [glycanMotifList, setGlycanMotifList] = useState([]);
  const [glycanResidueList, setGlycanResidueList] = useState([]);
  const [recommendedMotifRows, setRecommendedMotifRows] = useState([]);
  const [synonymMotifRows, setSynonymMotifRows] = useState([]);
  const [checkedResidue, setCheckedResidue] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { }
  );
  const [checkedMotif, setCheckedMotif] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { }
  );
  const [checkedEnzyme, setCheckedEnzyme] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { }
  );
  const [showCategories, setShowCategories] = useState(false);
  const [expandedCategories, setExpandedCategories] = useReducer(
    (state, newState) => ({
      ...state, 
      ...newState,
    }),{
      catInd: [0]
    }
    );

    const [orgExpandedRow, setOrgExpandedRow] = useReducer(
      (state, newState) => ({
        ...state, 
        ...newState,
      }),{
        orgArr: []
      }
      );
      const {showTotalCartIdsNotification} = useContext(GlyGenNotificationContext);

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
        getGlycanJson(id).then((response ) => {
          let jsonData = response.data;
          setGlycanJSON(jsonData);

          let enzyme = enzymeJson;
          let IUPACres = IUPACresJson;
          let motifList = motifListJson;

          if (jsonData && jsonData.annotations) {
            if (jsonData.annotations.Enzyme) {
              let enzMap = new Map();
              let enzMissing = [];

              for (let i = 0; i < enzyme.length; i ++) {
                enzMap.set(enzyme[i].id, enzyme[i]);
              }

              let glEnz = Object.keys(jsonData.annotations.Enzyme);
              let enzList = [];

              for (let i = 0; i < glEnz.length; i++) {
                if (glEnz[i] && glEnz[i] !== "__synonyms__") {
                  let temp = {};
                  let enz = enzMap.get(glEnz[i]);
                  if (!enz) {
                    enzMissing.push(glEnz[i]);
                    continue;
                  }
                  let tmp1 = undefined;
                  if (enzList.length > 0) {
                    tmp1 = enzList.find(obj => obj.tax_common_name === enz.tax_common_name)
                  }

                  if (tmp1 !== undefined) {
                    temp = tmp1;
                  }

                  temp.tax_name = enz.tax_name
                  temp.tax_common_name = enz.tax_common_name
                  if (!temp.enz_list) {
                    temp.enz_list = [];
                  }
                  temp.enz_list.push(enz);
                  if (tmp1 === undefined) {
                    enzList.push(temp)
                  }
                }
              }

              if (enzMissing.length > 0) {
                let message = "Missing enzymes in map file: " + enzMissing.join(", ");
                logActivity("user", id, message);
              }
              setGlycanEnzymeList(enzList);
            }

            if (jsonData.annotations.MotifAlignments) {
              let motifMap = new Map();
              for (let i = 0; i < motifList.length; i ++) {
                motifMap.set(motifList[i].id, motifList[i]);
              }

              let glMot = Object.keys(jsonData.annotations.MotifAlignments);
              let motList = [];

              for (let i = 0; i < glMot.length; i++) {
                if (glMot[i].startsWith('GGM.')) {
                  let mot = motifMap.get(glMot[i]);
                  if (mot) {
                    motList.push(mot);
                  }
                } 
              }
              setGlycanMotifList(motList);
            }

            if (jsonData.annotations.IUPAC) {
              let glRes = Object.keys(jsonData.annotations.IUPAC);
              let resList = [];

              let resMap = new Map();
              for (let i = 0; i < IUPACres.length; i ++) {
                let tempResArr = []
                if (IUPACres[i].children) {
                  for (let j = 0; j < IUPACres[i].children.length; j++) {
                    let obj = IUPACres[i].children[j];
                    obj.parent = IUPACres[i].id;
                    resMap.set(obj.id, obj);
                    if (jsonData.annotations.IUPAC[obj.id] && !obj.ignore){
                      tempResArr.push(obj);
                    }
                  }
                }

                let temp = IUPACres[i];
                temp.children = undefined;
                temp.parent = undefined;
                resMap.set(IUPACres[i].id, temp);

                temp.children = tempResArr;
                temp.parent = undefined;
                if (jsonData.annotations.IUPAC[temp.id]  && !temp.ignore) {
                  resList.push(temp);
                }
              }

              let parentMissing = [];
              let residueMissing = [];
              for (let i = 0; i < glRes.length; i ++) {
                if (glRes[i]) {
                  let resObj = resMap.get(glRes[i]);
                  if (!resObj) {
                    residueMissing.push(glRes[i]);
                    continue;
                  }

                  if (resObj.parent && !jsonData.annotations.IUPAC[resObj.parent]) {
                    parentMissing.push(glRes[i]);
                    continue;
                  }
                }
              }

              if (parentMissing.length > 0) {
                let message = "Parent of residues missing in json file: " + parentMissing.join(", ");
                logActivity("user", id, message);
              }

              if (residueMissing.length > 0) {
                let message = "Missing residues in map file: " + residueMissing.join(", ");
                logActivity("user", id, message);
              }
              setGlycanResidueList(resList);
            }
          }

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
          setGlycoproteinTotal(glycoProtStat[0]?.count);

          let expTiss = data.section_stats.filter(obj => obj.table_id === "expression_tissue");
          let expTissStat = expTiss[0].table_stats.filter(obj => obj.field === "total");
          setExpressionWithtissueTotal(expTissStat[0]?.count);

          let expCellLine = data.section_stats.filter(obj => obj.table_id === "expression_cell_line");
          let expCellLineStat = expCellLine[0].table_stats.filter(obj => obj.field === "total");
          setExpressionWithcellTotal(expCellLineStat[0]?.count);

          let publ = data.section_stats.filter(obj => obj.table_id === "publication");
          let publStat = publ[0].table_stats.filter(obj => obj.field === "total");
          setPublicationTotal(publStat[0]?.count);
        }

        if (detailDataTemp.names) {
          let motifRecNames = detailDataTemp.names.filter(motifRec => motifRec.domain === "motifname").map(obj => obj.name);
          let motifSynNames = detailDataTemp.names.filter(motifRec => motifRec.domain === "motifsynonym").map(obj => obj.name);
          setRecommendedMotifRows(motifRecNames);
          setSynonymMotifRows(motifSynNames);
        }

        setItemsCrossRef(getItemsCrossRefWithCategory(detailDataTemp));
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
        if (jsonData && jsonData.annotations === undefined) {
          newSidebarData = setSidebarItemState(newSidebarData, "Feature-View", true);
        }
        if (!detailDataTemp.tool_support || (detailDataTemp.tool_support && detailDataTemp.tool_support.pdb === "no")) {
          newSidebarData = setSidebarItemState(newSidebarData, "3D-View", true);
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
          !detailDataTemp.biomarkers ||
          detailDataTemp.biomarkers.length === 0
        ) {
          newSidebarData = setSidebarItemState(
            newSidebarData,
            "Biomarkers",
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

        })
        .catch(( error ) => {
          let message = "Glycan JSON api call";
          axiosError(error, id, message, undefined, undefined);
        });
      }

      setTimeout(() => {
        const anchorElement = location.hash;
        if (anchorElement && document.getElementById(anchorElement.substr(1))) {
          document
            .getElementById(anchorElement.substr(1))
            .scrollIntoView({ behavior: "auto" });
        }
      }, 500)
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
    biomarkers,
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
  const organismEvidence = groupOrganismEvidencesTableView(species);
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
      dataField: "tax_common_name",
      text: glycanStrings.organism.shortName,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
      },
      formatter: (value, row) => (
        <>
          {row.tax_common_name}
        </>
      )
    }
  ];

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
      dataField: "glygen_name",
      text: glycanStrings.organism.shortName,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
      },
      formatter: (value, row) => (
        <>
          {row.glygen_name}
          {" "}
          <DirectSearch
            text={glycanDirectSearch.organism.text}
            searchType={"glycan"}
            fieldType={glycanStrings.organism.id}
            fieldValue={{
              organism_list: [
                {
                  glygen_name: row.glygen_name,
                }
              ],
              annotation_category: "",
              operation: "or"
            }}
            executeSearch={glycanSearch}
          />
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
      // text: glycanStrings.species_name.name,
      text: glycanStrings.scientific_name.name,
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
      text: glycanStrings.common_name.name,
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
                  text={glycanDirectSearch.pmid.text}
                  searchType={"glycan"}
                  fieldType={glycanStrings.pmid.id}
                  fieldValue={ref.id}
                  executeSearch={glycanSearch}
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
      dataField: "tax_common_name",
      text: glycanStrings.organism.shortName,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
      },
      formatter: (value, row) => (
        <>
          <span className="text-capitalize">{row.tax_common_name}</span>
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
      formatter: (value, row) => 
        value ? (
        <LineTooltip text="View protein details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {row.uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      ) : (
        "Not Reported"
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
      dataField: "cell_line.name",
      text: "Cell / Cell Line Expression",
      sort: true,
      headerStyle: (column, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <>
          {row.cell_line && (<span className="nowrap">
           {row.cell_line.name}{" "} ({row.cell_line.namespace}: <LineTooltip text="View cell / cell line expression details"><a href={row.cell_line.url} target="_blank" rel="noopener noreferrer">{row.cell_line.id}</a></LineTooltip>)
          </span>)}
        </>
      ),
    }
  ];
  const expressionTissueColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
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
      formatter: (value, row) => 
        value ? (
        <LineTooltip text="View protein details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {row.uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      ) : (
        "Not Reported"
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
      dataField: "tissue.name",
      text: "Tissue / Bodily Fluid Expression",
      sort: true,
      headerStyle: (column, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <>
          {row.tissue && (<span className="nowrap">
            {row.tissue.name}{" "} ({row.tissue.namespace}: <LineTooltip text="View tissue / bodily fluid expression details"><a href={row.tissue.url} target="_blank" rel="noopener noreferrer">{row.tissue.id}</a></LineTooltip>)
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
    },
    {
      dataField: "condition",
      text: biomarkerStrings.condition.name,
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => <CollapsableTextArray data={value.name_list ? value.name_list : []} lines={5} />,
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
      feature_view: true,
      viewer: true,
      names_synonyms: true,
      motif: true,
      glycoprotein: true,
      glycanBindingProtein: true,
      bioEnzyme: true,
      subsumption: true,
      biomarkers: true,
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
            setPageLoading(false);
            navigate(
              routeConstants.glycanList + response.data["list_id"]
            );
          });
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

  /**
   * Function to handle on change event for category accordian.
   **/
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

  /**
   * Function to add glycan id to cart.
   **/
    const addGlycanID = () => {
    if (glytoucan && glytoucan.glytoucan_ac) {
      let totalCartCount = addIDsToStore("glycanID", [glytoucan.glytoucan_ac]);
      showTotalCartIdsNotification(totalCartCount);
    }
  };

  if (nonExistent) {
    return (
      <Container className="tab-content-border2 tab-bigscreen">
        <Alert className="erroralert" severity="error">
          {nonExistent.reason && nonExistent.reason.type && nonExistent.reason.type !== "invalid" ? (
            <>
              {(nonExistent.reason.type !== "never_in_glygen_current_in_glytoucan" && nonExistent.reason.type !== "discontinued_in_glygen") && (<AlertTitle> {id} is no longer valid Glycan ID</AlertTitle>)}
              {(nonExistent.reason.type === "discontinued_in_glygen") && (<AlertTitle> The GlyTouCan accession {id} is discontinued in GlyGen</AlertTitle>)}
              {(nonExistent.reason.type === "never_in_glygen_current_in_glytoucan") && (<AlertTitle> The GlyTouCan accession {id} does not exists in GlyGen</AlertTitle>)}
              {(nonExistent.reason.type === "never_in_glygen_current_in_glytoucan" || nonExistent.reason.type === "discontinued_in_glygen") && (<div>{"Valid ID in GlyTouCan: "} 
                <a href={"https://glytoucan.org/Structures/Glycans/" + id} target="_blank" rel="noopener noreferrer">
                  {id}
                </a>
              </div>)}
              {(nonExistent.reason.type !== "never_in_glygen_current_in_glytoucan") && (<div>{capitalizeFirstLetter(nonExistent.reason.description)}</div>)}
              {nonExistent.reason.type === "replacement_in_glygen" && <ul>
                <span>
                  {nonExistent.reason.replacement_id_list && (
                    nonExistent.reason.replacement_id_list.map((repID) =>
                    <li>
                      {" "}{"Go to Glycan: "}
                      <Link to={`${routeConstants.glycanDetail}${repID}`}>
                        {repID}
                      </Link>
                    </li>
                    )
                  )}
                </span>
              </ul>}
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
                  className="gg-btn-blue me-4"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Back
                </Button>
              </div>
            )}
            <div className="text-end gg-download-btn-width">
              <Button onClick={() => addGlycanID()} type="button" className="gg-btn-blue">
                Add To <ShoppingCartIcon sx={{ color: "white", paddingLeft1: "20px" }}/>
              </Button>
              <DownloadButton
                types={[
                  {
                    display: stringConstants.download.glycan_image.displayname,
                    type: "png",
                    data: "glycan_image"
                  },
                  {
                    display: stringConstants.download.glycan_svg_image.displayname,
                    type: "svg",
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
                        {glytoucan && glytoucan.glytoucan_ac ? (
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
                                <ReactCopyClipboard value={byonic.split('%')[0].trim()} />
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
                        </>)
                          : (
                            <p className="no-data-msg">{dataStatus}</p>
                        )}
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

               {/*  Feature View */}
               <Accordion
                id="Feature-View"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header style={{paddingTop:"12px", paddingBottom:"12px"}} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={"Feature View"}
                        text={DetailTooltips.glycan.feature_view.text}
                        urlText={DetailTooltips.glycan.feature_view.urlText}
                        url={DetailTooltips.glycan.feature_view.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.feature_view.displayname}
                    </h4>
                    <div className="float-end">
                      <CardToggle cardid="feature_view" toggle={collapsed.feature_view} eventKey="0" toggleCollapse={toggleCollapse}/>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <div>
                        {glycanEnzymeList && glycanResidueList && glycanMotifList && (glycanEnzymeList.length > 0 ||  glycanResidueList.length > 0 || glycanMotifList.length > 0) ?
                          (<Row style={{  minHeight : "495px"}}>
                            <Col 
                              xs={4}
                              sm={4}
                              md={4}
                              lg={4}
                              xl={4}
                              style1={{ marginBottom: "10px" }}
                              className="pe-0">
                              <>
                                <span id="residues">
                                  {glycanResidueList.map((parentObj, resParInd) => (<span key={"enSpan" + resParInd}>
                                    <span id={"Residue." + parentObj.id} glymagesvg_residues="residues" glymagesvg_forid="glymagesvg" glymagesvg_annotation={"IUPAC." + parentObj.id}></span>
                                    {parentObj.children && parentObj.children.length > 0 && parentObj.children.map((child, chInd) => (
                                      <span key={"chSpan" + chInd} id={"Residue." + child.id} glymagesvg_residues="residues" glymagesvg_forid="glymagesvg" glymagesvg_annotation={"IUPAC." + child.id}></span>            
                                    ))}
                                  </span>))}
                                </span>

                                <span id="motifs">
                                  {glycanMotifList.map((parentObj, chInd) => (
                                    <span key={"chSpan" + chInd} id={"Motif." + parentObj.id} glymagesvg_motifs="motifs" glymagesvg_forid="glymagesvg" glymagesvg_annotation={"MotifAlignments." + parentObj.id}></span>
                                  ))}
                                </span>

                                <span id="enzymes">
                                  {glycanEnzymeList.map((parentObj, enParInd) => (<span key={"enSpan" + enParInd}>
                                    {parentObj.enz_list && parentObj.enz_list.length > 0 && parentObj.enz_list.map((child, chInd) => (
                                      <span key={"chSpan" + chInd} id={"EnzymeUniAcc." + child.id} glymagesvg_enzymes="enzymes" glymagesvg_forid="glymagesvg" glymagesvg_annotation={"Enzyme." + child.id}></span>            
                                    ))}
                                  </span>))}
                                </span>

                                <GlycanViewer 
                                  enzParentList={glycanEnzymeList} 
                                  resParentList={glycanResidueList} 
                                  motifList={glycanMotifList} 
                                  url={GLYGEN_API + "/glycan/pdb/" + id + "/"} 
                                  checkedResidue={checkedResidue}
                                  setCheckedResidue={setCheckedResidue}
                                  checkedMotif={checkedMotif}
                                  setCheckedMotif={setCheckedMotif}
                                  checkedEnzyme={checkedEnzyme}
                                  setCheckedEnzyme={setCheckedEnzyme}
                                  />
                              </>                 
                            </Col>
                            <Col 
                              xs={8}
                              sm={8}
                              md={8}
                              lg={8}
                              xl={8}
                              justify={"center"}
                              className="pe-0 text-center">
                                <div style={{"width": "100%", "height": "100%", "margin": "0", "padding": "0"}}>
                                  <div className="content-cen" id="glymagesvg"
                                      glymagesvg_accession={id} 
                                      glymagesvg_imageclass="glymagesvg_low_opacity"
                                      glymagesvg_monoclass="glymagesvg_high_opacity"
                                      glymagesvg_linkclass="glymagesvg_high_opacity"
                                      glymagesvg_linkinfoclass="glymagesvg_high_opacity"
                                      glymagesvg_monoclick_highlights_parent_link="true"
                                      glymagesvg_monoclick_highlights_related_monos="true"
                                      glymagesvg_clicktarget="remote_element"
                                      glymagesvg_parentlinkclass="glymagesvg_low_opacity"
                                      glymagesvg_parentlinkinfoclass="glymagesvg_high_opacity_anomer"
                                      glymagesvg_substclass = "glymagesvg_high_opacity"
                                  />
                                </div>
                            </Col>
                          </Row>)
                          : (
                            <p className="no-data-msg">{dataStatus}</p>
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
                      <span className="gg-download-btn-width text-end">
                        <DownloadFile
                          id={id}
                          url={GLYGEN_API + "/glycan/pdb/" + id + "/"}
                          enable={tool_support && tool_support.pdb === "yes" }
                          mimeType={"text/plain"}
                          itemType={"url_file_download"}
                          fileName={id + ".pdb"}
                        />
                      </span>
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
                         {organismEvidence && organismEvidence.length > 0 && <ClientExpandableTable
                            data={organismEvidence}
                            orgExpandedRow={orgExpandedRow}
                            columns={glycoOrganismColumns}
                            expandableTableColumns={glycoOrganismExpandedColumns}
                            defaultSortField={"common_name"}
                            onClickTarget={"#organism"} 
                          /> }
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
                      <>
                      {(names && names.length) ? (
                        <ul className="list-style-none mb-0">
                            <>
                              {recommendedMotifRows && recommendedMotifRows.length > 0 && (
                                <>
                                  <strong>{glycanStrings.motif_name_recommended.name}</strong>
                                  {recommendedMotifRows.map(nameObject => (
                                    <li key={nameObject}>
                                      <ul><li>{nameObject}</li></ul>
                                    </li>
                                  ))}
                                </>
                              )}
                              {synonymMotifRows && synonymMotifRows.length > 0 && (
                                <>
                                  <strong>{glycanStrings.motif_name_synonym.name}</strong>
                                  {synonymMotifRows.map(nameObject => (
                                    <li key={nameObject}>
                                      <ul><li>{nameObject}</li></ul>
                                    </li>
                                  ))}
                                </>
                              )}
                            </>
                        </ul>
                      ) : (
                        <p>{dataStatus}</p>
                      )}
                      </>
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
                        <ClientServerPaginatedTableFullScreen
                          idField={"name"}
                          data={motifs}
                          columns={motifColumns}
                          defaultSortField={"name"}
                          onClickTarget={"#motif"}
                          viewPort={true}
                          title="Motif"
                          download={
                            {
                                types:[
                                  {
                                    display: "Motif (*.csv)",
                                    type: "motifs_csv",
                                    format: "csv",
                                    data: "glycan_section",
                                    section: "motifs",
                                  }
                                ],
                               dataId:id,
                               itemType:"glycan_section"
                            }
                          }
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
                      {glycoproteinTotal !== undefined && glycoprotein && glycoprotein.length !== 0 && (
                        <ClientServerPaginatedTableFullScreen
                          data={glycoprotein}
                          columns={glycoProtienColumns}
                          defaultSortField={"uniprot_canonical_ac"}
                          defaultSortOrder="asc"
                          onClickTarget={"#glycoprotein"}
                          record_type={"glycan"}
                          table_id={"glycoprotein"}
                          record_id={id}
                          serverPagination={true}
                          totalDataSize={glycoproteinTotal}
                          setAlertDialogInput={setAlertDialogInput}
                          setCardLoading={setCardLoadingGlyc}
                          setPageLoading={setPageLoading}
                          viewPort={true}
                          title="Associated Protein"
                          download={
                            {
                                types:[
                                  {
                                    display: "Associated Protein (*.csv)",
                                    type: "glycoprotein_csv",
                                    format: "csv",
                                    fileName: "associated_protein",
                                    data: "glycan_section",
                                    section: "glycoprotein",
                                  }
                                ],
                               dataId:id,
                               itemType:"glycan_section"
                            }
                          }
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
                        <ClientServerPaginatedTableFullScreen
                          idField={"interactor_id"}
                          data={interactions}
                          columns={glycanBindingProteinColumns}
                          defaultSortField={"interactor_id"}
                          onClickTarget={"#glycanBindingProtein"}
                          viewPort={true}
                          title="Glycan Binding Protein"
                          download={
                            {
                                types:[
                                  {
                                    display: "Glycan Binding Protein (*.csv)",
                                    type: "interactions_csv",
                                    format: "csv",
                                    fileName: "glycan_binding_protein",
                                    data: "glycan_section",
                                    section: "interactions",
                                  }
                                ],
                               dataId:id,
                               itemType:"glycan_section"
                            }
                          }
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
                        <ClientServerPaginatedTableFullScreen
                          idField={"uniprot_canonical_ac"}
                          data={enzyme}
                          columns={bioEnzymeColumns}
                          defaultSortField={"gene"}
                          onClickTarget={"#biosyntheticenzymes"}
                          viewPort={true}
                          title="Biosynthetic Enzymes"
                          download={
                            {
                                types:[
                                  {
                                    display: "Biosynthetic Enzymes (*.csv)",
                                    type: "enzyme_csv",
                                    format: "csv",
                                    fileName: "biosynthetic_enzymes",
                                    data: "glycan_section",
                                    section: "enzyme",
                                  }
                                ],
                               dataId:id,
                               itemType:"glycan_section"
                            }
                          }
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
                            <Container className="tab-content-padding tab-bigscreen">
                              {subsumptionAncestor &&
                                subsumptionAncestor.length > 0 && (
                                  <ClientServerPaginatedTableFullScreen
                                    idField={"id"}
                                    data={subsumptionAncestor}
                                    columns={subsumptionColumns}
                                    defaultSortField={"id"}
                                    onClickTarget={"#subsumption"}
                                    viewPort={true}
                                    title="Subsumption - Ancestor"
                                    download={
                                      {
                                          types:[
                                            {
                                              display: "Ancestor (*.csv)",
                                              type: "subsumption_ancestor_csv",
                                              format: "csv",
                                              data: "glycan_section",
                                              section: "subsumption_ancestor",
                                            }
                                          ],
                                         dataId:id,
                                         itemType:"glycan_section"
                                      }
                                    }
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
                            <Container className="tab-content-padding tab-bigscreen">
                              {subsumptionDescendant &&
                                subsumptionDescendant.length > 0 && (
                                  <ClientServerPaginatedTableFullScreen
                                    idField={"id"}
                                    data={subsumptionDescendant}
                                    columns={subsumptionColumns}
                                    defaultSortField={"id"}
                                    onClickTarget={"#subsumption"}
                                    viewPort={true}
                                    title="Subsumption - Descendant"
                                    download={
                                      {
                                          types:[
                                            {
                                              display: "Descendant (*.csv)",
                                              type: "subsumption_descendant_csv",
                                              format: "csv",
                                              data: "glycan_section",
                                              section: "subsumption_descendant",
                                            }
                                          ],
                                         dataId:id,
                                         itemType:"glycan_section"
                                      }
                                    }
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
                        title={DetailTooltips.glycan.biomarkers.title}
                        text={DetailTooltips.glycan.biomarkers.text}
                        urlText={DetailTooltips.glycan.biomarkers.urlText}
                        url={DetailTooltips.glycan.biomarkers.url}
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
                                data: "glycan_section",
                                section: "biomarkers",
                              }
                            ]}
                            dataId={id}
                            itemType="glycan_section"
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
                                    data: "glycan_section",
                                    section: "biomarkers",
                                  }
                                ],
                               dataId:id,
                               itemType:"glycan_section"
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
                            <Container className="tab-content-padding tab-bigscreen">
                              {expressionWithtissueTotal !== undefined && expressionWithtissue &&
                                expressionWithtissue.length > 0 && (
                                  <ClientServerPaginatedTableFullScreen
                                    data={expressionWithtissue}
                                    columns={expressionTissueColumns}
                                    onClickTarget={"#expression"}
                                    defaultSortField="start_pos"
                                    defaultSortOrder="asc"
                                    record_type={"glycan"}
                                    table_id={"expression_tissue"}
                                    record_id={id}
                                    serverPagination={true}
                                    totalDataSize={expressionWithtissueTotal}
                                    setAlertDialogInput={setAlertDialogInput}
                                    setCardLoading={setCardLoadingExp}
                                    setPageLoading={setPageLoading}
                                    viewPort={true}
                                    title="Expression - Tissue / Bodily Fluid Expression"
                                    download={
                                      {
                                          types:[
                                            {
                                              display: "Tissue / Bodily Fluid Expression (*.csv)",
                                              type: "expression_tissue_csv",
                                              format: "csv",
                                              data: "glycan_section",
                                              section: "expression_tissue",
                                            }
                                          ],
                                         dataId:id,
                                         itemType:"glycan_section"
                                      }
                                    }
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
                            <Container className="tab-content-padding tab-bigscreen">
                              {expressionWithcellTotal !== undefined && expressionWithcell &&
                                expressionWithcell.length > 0 && (
                                  <ClientServerPaginatedTableFullScreen
                                    data={expressionWithcell}
                                    columns={expressionCellColumns}
                                    onClickTarget={"#expression"}
                                    defaultSortField="start_pos"
                                    defaultSortOrder="asc"
                                    record_type={"glycan"}
                                    table_id={"expression_cell_line"}
                                    record_id={id}
                                    serverPagination={true}
                                    totalDataSize={expressionWithcellTotal}
                                    setAlertDialogInput={setAlertDialogInput}
                                    setCardLoading={setCardLoadingExp}
                                    setPageLoading={setPageLoading}
                                    viewPort={true}
                                    title="Expression - Cell / Cell Line Expression"
                                    download={
                                      {
                                          types:[
                                            {
                                              display: "Cell / Cell Line Expression (*.csv)",
                                              type: "expression_cell_line_csv",
                                              format: "csv",
                                              data: "glycan_section",
                                              section: "expression_cell_line",
                                            }
                                          ],
                                         dataId:id,
                                         itemType:"glycan_section"
                                      }
                                    }
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
                            <AccordionMUI disableGutters={true} key={"catDiv" + catInd}
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
                            <ul className="ps-3" key={historyItem.description}>
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
                        {publicationTotal !== undefined && publication && publication.length > 0 && <ClientServerPaginatedTable
                              data={publication}
                              columns={paperColumns}
                              tableHeader={'paper-table-header'}
                              wrapperClasses={"table-responsive table-height-auto"}
                              defaultSizePerPage={200}
                              defaultSortField={"date"}
                              defaultSortOrder={"desc"}
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
