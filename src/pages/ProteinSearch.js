import React, { useEffect, useReducer, useState } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import PageLoader from "../components/load/PageLoader";
import TextAlert from "../components/alert/TextAlert";
import DialogAlert from "../components/alert/DialogAlert";
import ProteinAdvancedSearch from "../components/search/ProteinAdvancedSearch";
import SequenceSearch from "../components/search/SequenceSearch";
import SimpleSearchControl from "../components/search/SimpleSearchControl";
import { Tab, Tabs, Container, Image } from "react-bootstrap";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../css/Search.css";
import proteinSearchData from "../data/json/proteinSearch";
import stringConstants from "../data/json/stringConstants";
import routeConstants from "../data/json/routeConstants";
import { logActivity } from "../data/logging";
import { axiosError } from "../data/axiosError";
import {
  getProteinSearch,
  getProteinSimpleSearch,
  getProteinList,
  getProteinInit,
  getProteinAIQueryAssistant
} from "../data/protein";
import FeedbackWidget from "../components/FeedbackWidget";
import ProteinTutorial from "../components/tutorial/ProteinTutorial";
import starBetaIcon from "../images/icons/star-beta.svg";
import AIQueryAssistant from "../components/search/AIQueryAssistant";

/**
 * Protein search component for showing protein search tabs.
 */
const ProteinSearch = props => {
  let { id } = useParams("");
  const [initData, setInitData] = useState({});
  const [proSimpleSearchCategory, setProSimpleSearchCategory] = useState("any");
  const [proSimpleSearchTerm, setProSimpleSearchTerm] = useState("");
  const [proAIQueryAssistantQuestion, setProAIQueryAssistantQuestion] = useState("");
  const [proAdvSearchData, setProAdvSearchData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      proteinId: "",
      proRefSeqId: "",
      proMass: [260, 3906488],
      proMassInput: [
        Number(260).toLocaleString("en-US"),
        Number(3906488).toLocaleString("en-US")
      ],
      proMassRange: [260, 3906488],
      proOrganism: { id: "0", name: "All" },
      proteinName: "",
      proGeneName: "",
      proGOName: "",
      proGOId: "",
      proAminoAcid: [],
      proAminoAcidOperation: "or",
      proSequence: "",
      proPathwayId: "",
      proPubId: "",
      proGlyEvidence: "",
      proDiseaseName: "",
      proDiseaseId: "",
      proAttachedGlycanId: "",
      proBindingGlycanId: "",
      proGlycosylationType: "",
      proGlycosylationSubType: "",
      proBiomarkerDisease: "",
      proBiomarkerType: { id: "", name: "" },
      proAdvSearchValError: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ]
    }
  );

  const [sequenceSearchData, setSequenceSearchData] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{
		  proSequence: "",
		}
	  );

  const [aiSearchToken, setAISearchToken] = useState(true);
  const [aiSearchStatus, setAISearchStatus] = useState(true);

  const [proActTabKey, setProActTabKey] = useState("Simple-Search");
  const [pageLoading, setPageLoading] = useState(true);
  const [searchStarted, setSearchStarted] = useState(false);
  const [alertTextInput, setAlertTextInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  const navigate = useNavigate();
	const location = useLocation();

  let simpleSearch = proteinSearchData.simple_search;
  let advancedSearch = proteinSearchData.advanced_search;
  let aIQueryAssistant = proteinSearchData.ai_query_assistant;
  let sequenceSearch = proteinSearchData.sequence_search;
  let querySearch = proteinSearchData.query_search;
  let proteinData = stringConstants.protein;
  let commonProteinData = proteinData.common;
  const queryString = require('query-string');

  /**
	 * getSelectionValue returns selection control value based on min, max.
	 * @param {object} queryObject - queryObject value.
   * @param {object} qryObjOut - qryObjOut value.
	 **/
	function executeQuery(queryObject, qryObjOut) {
    let queryProps = Object.keys(queryObject);
    let queryPropArr = querySearch.queryProps;
    let unkProps = [];
    let nullValueProps = [];
    let isError = false;
    qryObjOut.selectedTab = "Advanced-Search";
    let mass = undefined;
    let tolerance = undefined;
    let acc = [];

    for (let i = 0; i < queryProps.length; i++){
      let isPropPresent = queryPropArr.includes(queryProps[i].toLowerCase());
      if (!isPropPresent){
        unkProps.push(queryProps[i]);
        continue;
      }
      if (queryObject[queryProps[i]] === null || queryObject[queryProps[i]] === ""){
				nullValueProps.push(queryProps[i]);
			}
      var value = undefined;
      if (queryProps[i].toLowerCase() === "acc"){
        acc.push(queryObject[queryProps[i]]);
      } else {
        if (queryObject[queryProps[i]] === null || queryObject[queryProps[i]] === "" || typeof(queryObject[queryProps[i]]) === "string") {
					value = queryObject[queryProps[i]];
				} else {
					value = queryObject[queryProps[i]][0];
				}
      }
      if (queryProps[i].toLowerCase() === "mass"){
        mass = value;
      }
      if (queryProps[i].toLowerCase() === "tolerance"){
        tolerance = value;
      }
    }
    
    if (unkProps.length > 0){
      qryObjOut.logMessage = "Query parameter error. Query Search query parameters=" + JSON.stringify(queryObject);
      qryObjOut.alertMessage = stringConstants.errors.querySerarchError.message + "Unknown parameter(s): " + unkProps.join(', ') + "."
      isError = true;
    }

    if (nullValueProps.length > 0){
			qryObjOut.logMessage = "Query parameter error. Query Search query parameters=" + JSON.stringify(queryObject);
			if (qryObjOut.alertMessage === "")
				qryObjOut.alertMessage = stringConstants.errors.querySerarchError.message + " Null or empty value parameter(s): " + nullValueProps.join(', ') + "."
			else
				qryObjOut.alertMessage += "\n Null or empty value parameter(s): " + nullValueProps.join(', ') + "."
			
      isError = true;
		}

    if (searchStarted) {
			qryObjOut.logMessage = "";
			qryObjOut.alertMessage = "";
			qryObjOut.selectedTab = "";
			return false;
		}

		if (isError) return isError;

		var uniprot_id = undefined;
    if (acc.length > 0) {
      uniprot_id = acc.join(',');
      uniprot_id = uniprot_id.trim();
      uniprot_id = uniprot_id.replace(/\u200B/g, "");
      uniprot_id = uniprot_id.replace(/\u2011/g, "-");
      uniprot_id = uniprot_id.replace(/\s+/g, ",");
      uniprot_id = uniprot_id.replace(/,+/g, ",");
      var index = uniprot_id.lastIndexOf(",");
      if (index > -1 && index + 1 === uniprot_id.length) {
        uniprot_id = uniprot_id.substr(0, index);
      }
    }

		var tol = tolerance ? parseInt(tolerance) : 1;

    var formjson = {
      [commonProteinData.operation.id]: "AND",
      [proteinData.advanced_search.query_type.id]: proteinData.advanced_search.query_type.name,
      [commonProteinData.uniprot_canonical_ac.id]: uniprot_id
        ? uniprot_id
        : undefined,
      [commonProteinData.mass.id]: mass ? {
				min: parseInt(mass) - tol,
				max: parseInt(mass) + tol,
			} : undefined,
    };

    logActivity("user", id, "Performing Protein Query Search");
    let message = "Query Search query=" + JSON.stringify(formjson);
    getProteinSearch(formjson)
      .then(response => {
        if (response.data["list_id"] !== "") {
          logActivity(
            "user",
            (id || "") + ">" + response.data["list_id"],
            message
          ).finally(() => {
            setPageLoading(false);
            navigate(
              routeConstants.proteinList + response.data["list_id"]
            );
          });
        } else {
          let message = "No results. Query Search query=" + JSON.stringify(formjson);
					let altMessage = stringConstants.errors.querySerarcApiError.message;
					logActivity("user", "", message);
					setAlertTextInput({"show": true, "id": stringConstants.errors.querySerarchError.id, "message": altMessage});
					window.scrollTo(0, 0);
					setPageLoading(false);
        }
      })
      .catch(function(error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });

    return isError;
	}

  /**
   * useEffect for retriving data from api and showing page loading effects.
   */
  useEffect(() => {
    setPageLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    logActivity();
		var qryObjOut = {
			logMessage : "",
			alertMessage : "",
			selectedTab : ""
		};
		var queryError = false;
    if (location.search){
			queryError = executeQuery(queryString.parse(location.search), qryObjOut);
		}
    document.addEventListener("click", () => {
      setAlertTextInput({ show: false, message: ""});
    });
    getProteinInit()
      .then(response => {
        let initData = response.data;
        setProAdvSearchData({
          proMass: [
            Math.floor(initData.protein_mass.min),
            Math.ceil(initData.protein_mass.max)
          ],
          proMassInput: [
            Math.floor(initData.protein_mass.min).toLocaleString("en-US"),
            Math.ceil(initData.protein_mass.max).toLocaleString("en-US")
          ],
          proMassRange: [
            Math.floor(initData.protein_mass.min),
            Math.ceil(initData.protein_mass.max)
          ]
        });

        if (initData.ai_search) {
          setAISearchToken(initData.ai_search.token)
          setAISearchStatus(initData.ai_search.status)
        }

        setInitData(initData);
        const anchorElement = location.hash;
        if (anchorElement) {
          var hash = anchorElement.substr(1);
          if (hash ===  "Simple-Search" || hash ===  "Advanced-Search" || hash === "Sequence-Search" || hash ===  "Tutorial") {
            setProActTabKey(hash);	
          } else {
            setProActTabKey("Simple-Search");
          }
        } else {
          if (qryObjOut.selectedTab !== ""){
            setProActTabKey(qryObjOut.selectedTab);
          } else {
            setProActTabKey("Simple-Search");
          }
        }

        if (queryError && qryObjOut.logMessage !== ""){
          logActivity("user", "", qryObjOut.logMessage);
          setAlertTextInput({"show": true, "id": stringConstants.errors.querySerarchError.id, "message": qryObjOut.alertMessage})
          window.scrollTo(0, 0);
        }
      
        if ((id === undefined && (location === undefined || location.search === undefined || location.search === "")) || (location.search && queryError)) setPageLoading(false);

        id &&
          getProteinList(id, 1)
            .then(({ data }) => {
              logActivity("user", id, "Search modification initiated");
              if (data.cache_info.query.sequence !== undefined) {

                setSequenceSearchData({
                  proSequence : data.cache_info.query.sequence.aa_sequence ? data.cache_info.query.sequence.aa_sequence : ""
                });

                setProActTabKey("Sequence-Search");
                setPageLoading(false);
              } else if (
                data.cache_info.query.query_type ===
                proteinData.simple_search.query_type.name
              ) {
                setProSimpleSearchCategory(
                  data.cache_info.query.term_category
                    ? data.cache_info.query.term_category
                    : "any"
                );
                setProSimpleSearchTerm(
                  data.cache_info.query.term ? data.cache_info.query.term : ""
                );
                setProActTabKey("Simple-Search");
                setPageLoading(false);
              } else if (data.cache_info.query.ai_query && hash === "AI-Query-Assistant") {
                setProAIQueryAssistantQuestion(
                data.cache_info.query.ai_query
                  ? data.cache_info.query.ai_query
                  : ""
                );
                setProActTabKey("AI-Query-Assistant");
                setPageLoading(false);
              } else {
                setProAdvSearchData({
                  proteinId:
                    data.cache_info.query.uniprot_canonical_ac === undefined
                      ? ""
                      : data.cache_info.query.uniprot_canonical_ac + ",",
                  proRefSeqId:
                    data.cache_info.query.refseq_ac === undefined
                      ? ""
                      : data.cache_info.query.refseq_ac,
                  proMass:
                    data.cache_info.query.mass === undefined
                      ? [
                          Math.floor(initData.protein_mass.min),
                          Math.ceil(initData.protein_mass.max)
                        ]
                      : [
                          Math.floor(data.cache_info.query.mass.min),
                          Math.ceil(data.cache_info.query.mass.max)
                        ],
                  proMassInput:
                    data.cache_info.query.mass === undefined
                      ? [
                          Math.floor(initData.protein_mass.min).toLocaleString(
                            "en-US"
                          ),
                          Math.ceil(initData.protein_mass.max).toLocaleString(
                            "en-US"
                          )
                        ]
                      : [
                          Math.floor(
                            data.cache_info.query.mass.min
                          ).toLocaleString("en-US"),
                          Math.ceil(
                            data.cache_info.query.mass.max
                          ).toLocaleString("en-US")
                        ],
                  proOrganism:
                    data.cache_info.query.organism === undefined
                      ? {
                          id: advancedSearch.organism.placeholderId,
                          name: advancedSearch.organism.placeholderName
                        }
                      : {
                          id: data.cache_info.query.organism.id,
                          name: data.cache_info.query.organism.name
                        },
                  proteinName:
                    data.cache_info.query.protein_name === undefined
                      ? ""
                      : data.cache_info.query.protein_name,
                  proGeneName:
                    data.cache_info.query.gene_name === undefined
                      ? ""
                      : data.cache_info.query.gene_name,
                  proGOName:
                    data.cache_info.query.go_term === undefined
                      ? ""
                      : data.cache_info.query.go_term,
                  proGOId:
                    data.cache_info.query.go_id === undefined
                      ? ""
                      : data.cache_info.query.go_id,
                  proAminoAcid:
                    data.cache_info.query.glycosylated_aa === undefined
                      ? []
                      : data.cache_info.query.glycosylated_aa.aa_list.map(
                          aminoAcid => {
                            return initData.aa_list.find(aa => {
                              return aa.key === aminoAcid;
                            });
                          }
                        ),
                  proAminoAcidOperation:
                    data.cache_info.query.glycosylated_aa === undefined
                      ? "or"
                      : data.cache_info.query.glycosylated_aa.operation,
                  proSequence:
                    data.cache_info.query.sequence === undefined
                      ? ""
                      : data.cache_info.query.sequence.aa_sequence,
                  proPathwayId:
                    data.cache_info.query.pathway_id === undefined
                      ? ""
                      : data.cache_info.query.pathway_id,
                  proPubId:
                    data.cache_info.query.pmid === undefined
                      ? ""
                      : data.cache_info.query.pmid,
                  proGlyEvidence:
                    data.cache_info.query.glycosylation_evidence === undefined
                      ? advancedSearch.glycosylation_evidence.placeholderId
                      : data.cache_info.query.glycosylation_evidence,
                  proGlycosylationType:
                    data.cache_info.query.glycosylation_type === undefined
                      ? advancedSearch.glycosylation_type.placeholderId
                      : data.cache_info.query.glycosylation_type,
                  proGlycosylationSubType:
                      data.cache_info.query.glycosylation_subtype === undefined
                        ? advancedSearch.glycosylation_subtype.placeholderId
                        : data.cache_info.query.glycosylation_subtype,
                  proDiseaseName:
                    data.cache_info.query.disease_name === undefined
                      ? ""
                      : data.cache_info.query.disease_name,
                  proDiseaseId:
                    data.cache_info.query.disease_id === undefined
                      ? ""
                      : data.cache_info.query.disease_id,
                  proAttachedGlycanId:
                    data.cache_info.query.attached_glycan_id === undefined
                      ? ""
                      : data.cache_info.query.attached_glycan_id,
                  proBindingGlycanId:
                    data.cache_info.query.binding_glycan_id === undefined
                      ? ""
                      : data.cache_info.query.binding_glycan_id,
                  proBiomarkerDisease:
                    data.cache_info.query.biomarker === undefined || data.cache_info.query.biomarker.disease_name === undefined
                      ? ""
                      : data.cache_info.query.biomarker.disease_name,
                  proBiomarkerType:
                    data.cache_info.query.biomarker === undefined || data.cache_info.query.biomarker.type === undefined
                  ? {
                      id: advancedSearch.biomarker_type.placeholderId,
                      name: advancedSearch.biomarker_type.placeholderName
                    }
                  : {
                      id: data.cache_info.query.biomarker.type,
                      name: data.cache_info.query.biomarker.type.charAt(0).toUpperCase() + data.cache_info.query.biomarker.type.slice(1)
                    },
                });

                setProActTabKey("Advanced-Search");
                setPageLoading(false);
              }
            })
            .catch(function(error) {
              let message = "list api call";
              axiosError(
                error,
                "",
                message,
                setPageLoading,
                setAlertDialogInput
              );
            });
      })
      .catch(function(error) {
        let message = "search_init api call";
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  }, [id, proteinData]);

  /**
   * Function to handle protein simple search.
   **/
  const proteinSimpleSearch = () => {
    var formjsonSimple = {
      [commonProteinData.operation.id]: "AND",
      [proteinData.simple_search.query_type.id]:
        proteinData.simple_search.query_type.name,
      [commonProteinData.term.id]: proSimpleSearchTerm,
      [commonProteinData.term_category.id]: proSimpleSearchCategory
    };
    logActivity("user", id, "Performing Simple Search");
    let message = "Simple Search query=" + JSON.stringify(formjsonSimple);
    getProteinSimpleSearch(formjsonSimple)
      .then(response => {
        if (response.data["list_id"] !== "") {
          logActivity(
            "user",
            (id || "") + ">" + response.data["list_id"],
            message
          ).finally(() => {
            setPageLoading(false);
            navigate(
              routeConstants.proteinList + response.data["list_id"]
            );
          });
        } else {
          logActivity("user", "", "No results. " + message);
          setPageLoading(false);
          setAlertTextInput({
            show: true,
            id: stringConstants.errors.simpleSerarchError.id
          });
          window.scrollTo(0, 0);
        }
      })
      .catch(function(error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  /**
   * Forms searchjson from the form values submitted
   * @param {string} input_query_type query search
   * @param {string} input_protein_id user protein input
   * @param {string} input_refseq_id user input
   * @param {number} input_mass_min user mass min input
   * @param {number} input_mass_max user mass max input
   * @param {string} input_organism organism input
   * @param {string} input_protein_name user input
   * @param {string} input_gene_name user input
   * @param {string} input_go_term user input
   * @param {string} input_go_id user input
   * @param {string} input_glycan user input
   * @param {string} input_glycosylated_aa user input
   * @param {string} input_glycosylated_aa_operation user input
   * @param {string} input_sequence user input
   * @param {string} input_pathway_id user input
   * @param {string} input_pmid user input
   * @param {string} input_relation user input
   * @param {string} input_disease_name user input
   * @param {string} input_disease_id user input
   * @param {string} input_attached_glycan_id user input
   * @param {string} input_binding_glycan_id user input
   * @param {string} input_biomarker_disease - input_biomarker_disease value.
	 * @param {object} input_biomarker_type - input_biomarker_type value.
   * @return {string} returns json
   */
  function searchJson(
    input_query_type,
    input_protein_id,
    input_refseq_id,
    input_mass_min,
    input_mass_max,
    input_organism,
    input_protein_name,
    input_gene_name,
    input_go_term,
    input_go_id,
    input_glycosylated_aa,
    input_glycosylated_aa_operation,
    input_sequence,
    input_pathway_id,
    input_pmid,
    input_glycosylation_evidence,
    input_glycosylation_type,
    input_glycosylation_subtype,
    input_disease_name,
    input_disease_id,
    input_attached_glycan_id,
    input_binding_glycan_id,
    input_biomarker_disease,
    input_biomarker_type
  ) {
    var uniprot_id = input_protein_id;
    if (uniprot_id) {
      uniprot_id = input_protein_id.trim();
      uniprot_id = uniprot_id.replace(/\u200B/g, "");
      uniprot_id = uniprot_id.replace(/\u2011/g, "-");
      uniprot_id = uniprot_id.replace(/\s+/g, ",");
      uniprot_id = uniprot_id.replace(/,+/g, ",");
      var index = uniprot_id.lastIndexOf(",");
      if (index > -1 && index + 1 === uniprot_id.length) {
        uniprot_id = uniprot_id.substr(0, index);
      }
    }

    var sequences;
    if (input_sequence) {
      sequences = {
        type: "exact",
        aa_sequence: input_sequence
      };
    }

    var selected_organism = undefined;
    if (
      input_organism &&
      input_organism.id !== advancedSearch.organism.placeholderId
    ) {
      selected_organism = {
        id: input_organism.id,
        name: input_organism.name
      };
    }
    var glyco_aa = undefined;
    if (input_glycosylated_aa && input_glycosylated_aa.length > 0) {
      glyco_aa = {
        aa_list: input_glycosylated_aa,
        operation: input_glycosylated_aa_operation
      };
    }

    var input_mass = undefined;
    if (
      initData.protein_mass.min !== input_mass_min ||
      initData.protein_mass.max !== input_mass_max
    ) {
      input_mass = {
        min: parseInt(input_mass_min),
        max: parseInt(input_mass_max)
      };
    }

    var biomarker = undefined;
		if (input_biomarker_disease || input_biomarker_type) {
			biomarker = {
				disease_name: input_biomarker_disease ? input_biomarker_disease : undefined,
				type: input_biomarker_type ? input_biomarker_type : undefined,
			};
		}

    var formjson = {
      [commonProteinData.operation.id]: "AND",
      [proteinData.advanced_search.query_type.id]: input_query_type,
      [commonProteinData.uniprot_canonical_ac.id]: uniprot_id
        ? uniprot_id
        : undefined,
      [commonProteinData.refseq_ac.id]: input_refseq_id
        ? input_refseq_id
        : undefined,
      [commonProteinData.mass.id]: input_mass,
      [commonProteinData.organism.id]: selected_organism,
      [commonProteinData.protein_name.id]: input_protein_name
        ? input_protein_name
        : undefined,
      [commonProteinData.gene_name.id]: input_gene_name
        ? input_gene_name
        : undefined,
      [commonProteinData.go_term.id]: input_go_term ? input_go_term : undefined,
      [commonProteinData.go_id.id]: input_go_id ? input_go_id : undefined,
      [commonProteinData.glycosylated_aa.id]: glyco_aa ? glyco_aa : undefined,
      [commonProteinData.sequence.id]: sequences ? sequences : undefined,
      [commonProteinData.pathway_id.id]: input_pathway_id
        ? input_pathway_id
        : undefined,
      [commonProteinData.pmid.id]: input_pmid ? input_pmid : undefined,
      [commonProteinData.glycosylation_evidence
        .id]: input_glycosylation_evidence
        ? input_glycosylation_evidence
        : undefined,
      [commonProteinData.glycosylation_type.id]: input_glycosylation_type
        ? input_glycosylation_type
        : undefined,
        [commonProteinData.glycosylation_subtype.id]: input_glycosylation_subtype
        ? input_glycosylation_subtype
        : undefined,
      [commonProteinData.disease_name.id]: input_disease_name
        ? input_disease_name
        : undefined,
      [commonProteinData.disease_id.id]: input_disease_id
        ? input_disease_id
        : undefined,
      [commonProteinData.attached_glycan_id.id]: input_attached_glycan_id
        ? input_attached_glycan_id
        : undefined,
      [commonProteinData.binding_glycan_id.id]: input_binding_glycan_id
        ? input_binding_glycan_id
        : undefined,
      [commonProteinData.biomarker.id]: biomarker ? biomarker	: undefined,
    };
    return formjson;
  }

  /**
   * Function to handle protein advanced search.
   **/
  const proteinAdvSearch = () => {
    let formObject = searchJson(
      proteinData.advanced_search.query_type.name,
      proAdvSearchData.proteinId,
      proAdvSearchData.proRefSeqId,
      proAdvSearchData.proMass[0],
      proAdvSearchData.proMass[1],
      proAdvSearchData.proOrganism,
      proAdvSearchData.proteinName,
      proAdvSearchData.proGeneName,
      proAdvSearchData.proGOName,
      proAdvSearchData.proGOId,
      proAdvSearchData.proAminoAcid.map(aminoAcid => {
        return aminoAcid.key;
      }),
      proAdvSearchData.proAminoAcidOperation,
      proAdvSearchData.proSequence,
      proAdvSearchData.proPathwayId,
      proAdvSearchData.proPubId,
      proAdvSearchData.proGlyEvidence,
      proAdvSearchData.proGlycosylationType,
      proAdvSearchData.proGlycosylationSubType,
      proAdvSearchData.proDiseaseName,
      proAdvSearchData.proDiseaseId,
      proAdvSearchData.proAttachedGlycanId,
      proAdvSearchData.proBindingGlycanId,
      proAdvSearchData.proBiomarkerDisease,
      proAdvSearchData.proBiomarkerType.id
    );
    logActivity("user", id, "Performing Advanced Search");
    let message = "Advanced Search query=" + JSON.stringify(formObject);
    getProteinSearch(formObject)
      .then(response => {
        if (response.data["list_id"] !== "") {
          logActivity(
            "user",
            (id || "") + ">" + response.data["list_id"],
            message
          ).finally(() => {
            setPageLoading(false);
            // console.log("Protein Search: "+Date.now());
            navigate(
              routeConstants.proteinList + response.data["list_id"]
            );
          });
        } else {
          logActivity("user", "", "No results. " + message);
          setPageLoading(false);
          setAlertTextInput({
            show: true,
            id: stringConstants.errors.advSerarchError.id
          });
          window.scrollTo(0, 0);
        }
      })
      .catch(function(error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  /**
   * Forms searchjson from the form values submitted
   * @param {string} input_query_type query search
   * @param {string} input_sequence user input
   * @return {string} returns json
   */
  function searchSequenceJson(
    input_query_type,
    input_sequence,
  ) {

    var sequences;
    if (input_sequence) {
      sequences = {
        type: "exact",
        aa_sequence: input_sequence
      };
    }

    var formjson = {
      [commonProteinData.operation.id]: "AND",
      [proteinData.advanced_search.query_type.id]: input_query_type,
      [commonProteinData.sequence.id]: sequences ? sequences : undefined,
    };
    return formjson;
  }

  /**
   * Function to handle protein peptide search.
   **/
  const proteinSequenceSearch = () => {
    let formObject = searchSequenceJson(
      proteinData.advanced_search.query_type.name,
      sequenceSearchData.proSequence,
    );
    logActivity("user", id, "Performing Sequence Search");
    let message = "Sequence Search query=" + JSON.stringify(formObject);
    getProteinSearch(formObject)
      .then(response => {
        if (response.data["list_id"] !== "") {
          logActivity(
            "user",
            (id || "") + ">" + response.data["list_id"],
            message
          ).finally(() => {
            setPageLoading(false);
            navigate(
              routeConstants.proteinList + response.data["list_id"]
            );
          });
        } else {
          logActivity("user", "", "No results. " + message);
          setPageLoading(false);
          setAlertTextInput({
            show: true,
            id: stringConstants.errors.advSerarchError.id
          });
          window.scrollTo(0, 0);
        }
      })
      .catch(function(error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

    /**
   * Function to handle protein AI Query Assistant.
   **/
  const proteinAIQueryAssistant = () => {
    var formjsonSimple = {
      [proteinData.ai_query_assistant.query_type.id]:
      proAIQueryAssistantQuestion
    };
    logActivity("user", id, "Performing Protein AI Query Assistant");
    let message = "Protein AI Query Assistant query=" + JSON.stringify(formjsonSimple);
    getProteinAIQueryAssistant(formjsonSimple, aiSearchToken)
      .then(response => {
        if (response.data["error"]) {
          logActivity("user", "", "No results. " + message);
          setPageLoading(false);
          setAlertTextInput({
            show: true,
            id: stringConstants.errors.aiQueryAssistantError.id
          });
          window.scrollTo(0, 0);
    } else if (response.data["parsed_parameters"] && response.data["parsed_parameters"]["error"]) {
      logActivity("user", "", "No results. " + message);
          setPageLoading(false);
          setAlertTextInput({
            show: true,
            id: stringConstants.errors.aiQueryAssistantError.id
          });
          window.scrollTo(0, 0);
    }  else if (response.data["parsed_parameters"] && response.data["mapped_parameters"]) {
      let formObject = response.data["mapped_parameters"];
      formObject.ai_query = response.data["original_query"];
      logActivity("user", id, "Protein AI Query Performing Advanced Search");
      let message = "AI Query Assistant Advanced Search query=" + JSON.stringify(formObject);
      getProteinSearch(formObject)
        .then((response) => {
          if (response.data['list_id'] !== '') {
            logActivity("user", (id || "") + ">" + response.data['list_id'], message)
            .finally(() => {	
              setPageLoading(false);
              navigate(routeConstants.proteinList + response.data['list_id']);
            });;
          } else {
            logActivity("user", "", "No results. " + message);
            setPageLoading(false);
            setAlertTextInput({"show": true, "id": stringConstants.errors.advSerarchError.id});
            window.scrollTo(0, 0);
          }
        })
        .catch(function (error) {
          axiosError(error, "", message, setPageLoading, setAlertDialogInput);
        });
    } else {
      logActivity("user", "", "No results. " + message);
          setPageLoading(false);
          setAlertTextInput({
            show: true,
            id: stringConstants.errors.aiQueryAssistantError.id
          });
          window.scrollTo(0, 0);
    }
      })
      .catch(function(error) {
        let errorMsg = error?.response?.data?.error;
        if (errorMsg && stringConstants.errors[errorMsg.error_msg]) {
          logActivity("user", "", "No results. " + message);
          setPageLoading(false);
          setAlertTextInput({
            show: true,
            id: errorMsg.error_msg
          });
          window.scrollTo(0, 0);
        } else {
          axiosError(error, "", message, setPageLoading, setAlertDialogInput);
        }
      });
  };

  /**
   * Function to handle click event for protein peptide search.
   **/
    const searchSequenceClick = () => {
      setSearchStarted(true);
      setPageLoading(true);
      proteinSequenceSearch();
    };

  /**
   * Function to handle click event for protein advanced search.
   **/
  const searchProteinAdvClick = () => {
    setSearchStarted(true);
    setPageLoading(true);
    proteinAdvSearch();
  };

  /**
   * Function to handle click event for protein simple search.
   **/
  const searchProteinSimpleClick = () => {
    setSearchStarted(true);
    setPageLoading(true);
    proteinSimpleSearch();
  };

  /**
   * Function to handle click event for protein AI Query Assistant.
   **/
    const aIQueryAssistantClick = () => {
      setSearchStarted(true);
      setPageLoading(true);
      proteinAIQueryAssistant();
    };

  return (
    <>
      <Helmet>
        {getTitle("proteinSearch")}
        {getMeta("proteinSearch")}
      </Helmet>
      <FeedbackWidget />
      <div className="lander">
        <Container className="tab-bigscreen">
          <PageLoader pageLoading={pageLoading} />
          <DialogAlert
            alertInput={alertDialogInput}
            setOpen={input => {
              setAlertDialogInput({ show: input });
            }}
          />
          <div className="content-box-md">
            <h1 className="page-heading">{proteinSearchData.pageTitle}</h1>
          </div>
          <Tabs
            defaultActiveKey="Advanced-Search"
            transition={false}
            activeKey={proActTabKey}
            mountOnEnter={true}
            unmountOnExit={true}
            onSelect={key => setProActTabKey(key)}
          >
            <Tab
              eventKey="Simple-Search"
              className="tab-content-padding"
              title={simpleSearch.tabTitle}
            >
              <TextAlert alertInput={alertTextInput} />
              <div style={{ paddingBottom: "20px" }}></div>
              <Container className="tab-bigscreen">
                {initData.simple_search_category && (
                  <SimpleSearchControl
                    simpleSearchCategory={proSimpleSearchCategory}
                    simpleSearchCategoryLabel={
                      commonProteinData.term_category.name
                    }
                    simpleSearchTerm={proSimpleSearchTerm}
                    simple_search_category={initData.simple_search_category}
                    simple_search={simpleSearch.categories}
                    searchSimpleClick={searchProteinSimpleClick}
                    setSimpleSearchCategory={setProSimpleSearchCategory}
                    setSimpleSearchTerm={setProSimpleSearchTerm}
                    length={simpleSearch.length}
                    errorText={simpleSearch.errorText}
                  />
                )}
              </Container>
            </Tab>
            <Tab
              eventKey="Advanced-Search"
              className="tab-content-padding"
              title={advancedSearch.tabTitle}
            >
              <TextAlert alertInput={alertTextInput} />
              <Container className="tab-content-border tab-bigscreen">
              <h5><br></br><center>{advancedSearch.message}</center></h5>
                {initData && (
                  <ProteinAdvancedSearch
                    searchProteinAdvClick={searchProteinAdvClick}
                    inputValue={proAdvSearchData}
                    initData={initData}
                    setProAdvSearchData={setProAdvSearchData}
                  />
                )}
              </Container>
            </Tab>
            {aiSearchStatus && <Tab
							eventKey="AI-Query-Assistant"
							className="tab-content-padding"
							title={
								<div>
									<span>{aIQueryAssistant.tabTitle}{" "}
									</span>
									<Image style={{marginTop:"-5px"}} width="34px" src={starBetaIcon} alt="star beta icon" />
								</div> 
							}
							>
							<TextAlert alertInput={alertTextInput} />
							<Container className="tab-content-border">
								{initData && (
								<AIQueryAssistant
									aIQueryAssistantClick={aIQueryAssistantClick}
									inputValue={proAIQueryAssistantQuestion}
									setInputValue={setProAIQueryAssistantQuestion}
                  commonData={commonProteinData} 
									aIQueryAssistant={aIQueryAssistant}
								/>
								)}
							</Container>
						</Tab>}
            <Tab
              eventKey="Sequence-Search"
              className="tab-content-padding"
              title={sequenceSearch.tabTitle}
            >
              <TextAlert alertInput={alertTextInput} />
              <Container className="tab-content-border tab-bigscreen">
                {initData && (
                  <SequenceSearch
                    searchSequenceClick={searchSequenceClick}
                    inputValue={sequenceSearchData}
                    setInputValue={setSequenceSearchData}
                  />
                )}
              </Container>
            </Tab>
            <Tab
              eventKey="Tutorial"
              title={proteinSearchData.tutorial.tabTitle}
              className="tab-content-padding"
            >
              <Container className="tab-bigscreen">
                <ProteinTutorial />
              </Container>
            </Tab>
          </Tabs>
        </Container>
      </div>
    </>
  );
};

export default ProteinSearch;
