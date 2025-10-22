import React, { useEffect, useReducer, useState } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import PageLoader from "../components/load/PageLoader";
import TextAlert from "../components/alert/TextAlert";
import DialogAlert from "../components/alert/DialogAlert";
import DiseaseAdvancedSearch from "../components/search/DiseaseAdvancedSearch";
import SimpleSearchControl from "../components/search/SimpleSearchControl";
import { Tab, Tabs, Container } from "react-bootstrap";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../css/Search.css";
import diseaseSearchData from "../data/json/diseaseSearch";
import stringConstants from "../data/json/stringConstants";
import routeConstants from "../data/json/routeConstants";
import { logActivity } from "../data/logging";
import { axiosError } from "../data/axiosError";

import {
  getDiseaseSearch,
  getDiseaseSimpleSearch,
  getDiseaseList,
  getDiseaseInit
} from "../data/disease";
import FeedbackWidget from "../components/FeedbackWidget"
import {
  GLYGEN_BUILD,
} from "../envVariables";

/**
 * Disease search component for showing disease search tabs.
 */
const DiseaseSearch = props => {
  let { id } = useParams("");
  const [initData, setInitData] = useState({});
  const [disSimpleSearchCategory, setDisSimpleSearchCategory] = useState("any");
  const [disSimpleSearchTerm, setDisSimpleSearchTerm] = useState("");

  const [disAdvSearchData, setDisAdvSearchData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      disDiseaseId: "",
      disDiseaseName: "",
      disSearchType: { id: "hierarchy", name: "Hierarchy"  },
      disDiseaseOrganism: { id: "", name: "All" },
      disBiomarkerId: "",
      disBiomarkerType:  { id: "", name: "All" },
      disGeneName: "",
      disRefSeqId: "",
      disProteinId: "",
      disProteinName: "",
      disGlycanId: "",
      disGlycanName: "",
      disAdvSearchValError: [
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

  const [proActTabKey, setDisActTabKey] = useState("Simple-Search");
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

  let simpleSearch = diseaseSearchData.simple_search;
  let advancedSearch = diseaseSearchData.advanced_search;
  let diseaseData = stringConstants.disease;
  let commonDiseaseData = diseaseData.common;
  const queryString = require('query-string');


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

    document.addEventListener("click", () => {
      setAlertTextInput({ show: false, message: ""});
    });
    getDiseaseInit()
      .then(response => {
        let initData = response.data;

        setInitData(initData);
        const anchorElement = location.hash;
        if (anchorElement) {
          var hash = anchorElement.substr(1);
          if (hash ===  "Simple-Search" || hash ===  "Advanced-Search" || hash ===  "Tutorial") {
            setDisActTabKey(hash);	
          } else {
            setDisActTabKey("Simple-Search");
          }
        } else {
          if (qryObjOut.selectedTab !== ""){
            setDisActTabKey(qryObjOut.selectedTab);
          } else {
            setDisActTabKey("Simple-Search");
          }
        }

        if (queryError && qryObjOut.logMessage !== ""){
          logActivity("user", "", qryObjOut.logMessage);
          setAlertTextInput({"show": true, "id": stringConstants.errors.querySerarchError.id, "message": qryObjOut.alertMessage})
          window.scrollTo(0, 0);
        }
      
        if ((id === undefined && (location === undefined || location.search === undefined || location.search === "")) || (location.search && queryError)) setPageLoading(false);

        id &&
          getDiseaseList(id, 1)
            .then(({ data }) => {
              logActivity("user", id, "Search modification initiated");
              if (
                data.cache_info.query.query_type ===
                diseaseData.simple_search.query_type.name
              ) {
                setDisSimpleSearchCategory(
                  data.cache_info.query.term_category
                    ? data.cache_info.query.term_category
                    : "any"
                );
                setDisSimpleSearchTerm(
                  data.cache_info.query.term ? data.cache_info.query.term : ""
                );
                setDisActTabKey("Simple-Search");
                setPageLoading(false);
              } else {
                setDisAdvSearchData({
                  disDiseaseId:
                    data.cache_info.query.disease_id === undefined
                      ? ""
                      : data.cache_info.query.disease_id,
                  disDiseaseName:
                    data.cache_info.query.disease_name === undefined
                      ? ""
                      : data.cache_info.query.disease_name,
                  disSearchType:
                    data.cache_info.query.search_type === undefined
                      ? {
                          id: advancedSearch.search_type.placeholderId,
                          name: advancedSearch.search_type.placeholderName
                        }
                      : {
                          id: data.cache_info.query.search_type,
                          // name: data.cache_info.query.search_type
                        },
                  disDiseaseOrganism:
                    data.cache_info.query.tax_name === undefined || !initData.organism  || initData.organism.length === 0
                      ? {
                          id: advancedSearch.organism.placeholderId,
                          name: advancedSearch.organism.placeholderName
                        }
                      : {
                          id: initData.organism.find(obj => obj.name === data.cache_info.query.tax_name).id,
                          name:  data.cache_info.query.tax_name
                        },
                  disBiomarkerId:
                    data.cache_info.query.biomarker_id === undefined
                      ? ""
                      : data.cache_info.query.biomarker_id,
                  disBiomarkerType:
                    data.cache_info.query.biomarker_type === undefined
                      ? {
                          id: advancedSearch.biomarker_type.placeholderId,
                          name: advancedSearch.biomarker_type.placeholderName
                        }
                      : {
                          id: data.cache_info.query.biomarker_type,
                          name: data.cache_info.query.biomarker_type.charAt(0).toUpperCase() + data.cache_info.query.biomarker_type.slice(1)
                        },
                  disGlycanId:
                    data.cache_info.query.glycan_id === undefined
                      ? ""
                      : data.cache_info.query.glycan_id,
                  disGlycanName:
                    data.cache_info.query.glycan_name === undefined
                      ? ""
                      : data.cache_info.query.glycan_name,
                  disGeneName:
                      data.cache_info.query.gene_name === undefined
                        ? ""
                        : data.cache_info.query.gene_name,
                  disRefSeqId:
                      data.cache_info.query.refseq_id === undefined
                        ? ""
                        : data.cache_info.query.refseq_id,
                  disProteinId:
                    data.cache_info.query.protein_id === undefined
                      ? ""
                      : data.cache_info.query.protein_id,
                  disProteinName:
                      data.cache_info.query.protein_name === undefined
                        ? ""
                        : data.cache_info.query.protein_name,
                });

                setDisActTabKey("Advanced-Search");
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
  }, [id]);

  /**
   * Function to handle disease simple search.
   **/
  const diseaseSimpleSearch = () => {
    var formjsonSimple = {
      [commonDiseaseData.operation.id]: "AND",
      [diseaseData.simple_search.query_type.id]:
      diseaseData.simple_search.query_type.name,
      [commonDiseaseData.term.id]: disSimpleSearchTerm,
      [commonDiseaseData.term_category.id]: disSimpleSearchCategory
    };
    logActivity("user", id, "Performing Simple Search");
    let message = "Simple Search query=" + JSON.stringify(formjsonSimple);
    getDiseaseSimpleSearch(formjsonSimple)
      .then(response => {
        if (response.data["list_id"] !== "") {
          logActivity(
            "user",
            (id || "") + ">" + response.data["list_id"],
            message
          ).finally(() => {
            setPageLoading(false);
            navigate(
              routeConstants.diseaseList + response.data["list_id"]
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
   * @param {string} input_disease_id user disease id input
   * @param {string} input_disease_name user disease name input
   * @param {number} input_search_type user search type input
   * @param {string} input_organism user organism input
   * @param {string} input_biomarker_id user biomarker id input
   * @param {string} input_biomarker_type user biomarker type input
   * @param {string} input_gene_name user gene name input
   * @param {string} input_refseq_id user refseq id input
   * @param {string} input_protein_id user protein id input
   * @param {string} input_protein_name user protein name input
   * @param {string} input_glycan_id user glycan id input
   * @param {string} input_glycan_name user glycan name input
   * @return {string} returns json
   */
  function searchJson(
    input_query_type,
    input_disease_id,
    input_disease_name,
    input_search_type,
    input_organism,
    input_biomarker_id,
    input_biomarker_type,
    input_gene_name,
    input_refseq_id,
    input_protein_id,
    input_protein_name,
    input_glycan_id,
    input_glycan_name,
  ) {

      var formjson = {
      // [commonDiseaseData.operation.id]: "AND",
      // [diseaseData.advanced_search.query_type.id]: input_query_type,
      [commonDiseaseData.disease_id.id]: input_disease_id ? input_disease_id : undefined,
      [commonDiseaseData.disease_name.id]: input_disease_name ? input_disease_name : undefined,
      [commonDiseaseData.search_type.id]: input_search_type && input_disease_name ? input_search_type.id : undefined,
      [commonDiseaseData.biomarker_id.id]: input_biomarker_id ? input_biomarker_id : undefined,
      [commonDiseaseData.biomarker_type.id]: input_biomarker_type && input_biomarker_type.id !== "" ? input_biomarker_type.id : undefined,
      [commonDiseaseData.gene_name.id]: input_gene_name ? input_gene_name : undefined,
      [commonDiseaseData.protein_id.id]: input_protein_id ? input_protein_id : undefined,
      [commonDiseaseData.refseq_id.id]: input_refseq_id ? input_refseq_id : undefined,
      [commonDiseaseData.protein_name.id]: input_protein_name ? input_protein_name : undefined,
      [commonDiseaseData.glycan_id.id]: input_glycan_id ? input_glycan_id : undefined,
      [commonDiseaseData.glycan_name.id]: input_glycan_name ? input_glycan_name : undefined,
      [commonDiseaseData.tax_name.id]: input_organism && input_organism.id !== "" ? input_organism.name : undefined,

    };
    return formjson;
  }

  /**
   * Function to handle disease advanced search.
   **/
  const diseaseAdvSearch = () => {
    let formObject = searchJson(
      diseaseData.advanced_search.query_type.name,
      disAdvSearchData.disDiseaseId,
      disAdvSearchData.disDiseaseName,
      disAdvSearchData.disSearchType,
      disAdvSearchData.disDiseaseOrganism,
      disAdvSearchData.disBiomarkerId,
      disAdvSearchData.disBiomarkerType,
      disAdvSearchData.disGeneName,
      disAdvSearchData.disRefSeqId,
      disAdvSearchData.disProteinId,
      disAdvSearchData.disProteinName,
      disAdvSearchData.disGlycanId,
      disAdvSearchData.disGlycanName,
    );
    logActivity("user", id, "Performing Advanced Search");
    let message = "Advanced Search query=" + JSON.stringify(formObject);
    getDiseaseSearch(formObject)
      .then(response => {
        if (response.data["list_id"] !== "") {
          logActivity(
            "user",
            (id || "") + ">" + response.data["list_id"],
            message
          ).finally(() => {
            setPageLoading(false);
            navigate(
              routeConstants.diseaseList + response.data["list_id"]
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
   * Function to handle click event for disease advanced search.
   **/
  const searchDiseaseAdvClick = () => {
    setSearchStarted(true);
    setPageLoading(true);
    diseaseAdvSearch();
  };

  /**
   * Function to handle click event for disease simple search.
   **/
  const searchDiseaseSimpleClick = () => {
    setSearchStarted(true);
    setPageLoading(true);
    diseaseSimpleSearch();
  };

  return (
    <>
      <Helmet>
        {getTitle("diseaseSearch")}
        {getMeta("diseaseSearch")}
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
            <h1 className="page-heading">{diseaseSearchData.pageTitle}</h1>
          </div>
          <Tabs
            defaultActiveKey="Advanced-Search"
            transition={false}
            activeKey={proActTabKey}
            mountOnEnter={true}
            unmountOnExit={true}
            onSelect={key => setDisActTabKey(key)}
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
                    simpleSearchCategory={disSimpleSearchCategory}
                    simpleSearchCategoryLabel={
                      commonDiseaseData.term_category.name
                    }
                    simpleSearchTerm={disSimpleSearchTerm}
                    simple_search_category={Object.keys(simpleSearch.categories).map(obj => {return { id: obj, display: obj.charAt(0).toUpperCase() + obj.slice(1) }} )}
                    simple_search={simpleSearch.categories}
                    searchSimpleClick={searchDiseaseSimpleClick}
                    setSimpleSearchCategory={setDisSimpleSearchCategory}
                    setSimpleSearchTerm={setDisSimpleSearchTerm}
                    length={simpleSearch.length}
                    errorText={simpleSearch.errorText}
                    database={"GlyGen"}
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
                  <DiseaseAdvancedSearch
                    searchDiseaseAdvClick={searchDiseaseAdvClick}
                    initData={initData}
                    inputValue={disAdvSearchData}
                    setDisAdvSearchData={setDisAdvSearchData}
                  />
                )}
              </Container>
            </Tab>
            <Tab
              eventKey="Tutorial"
              title={diseaseSearchData.tutorial.tabTitle}
              className="tab-content-padding"
            >
              <Container className="tab-bigscreen">
                <h2>
                  <center>Coming Soon...</center>
                </h2>
              </Container>
            </Tab>
          </Tabs>
        </Container>
      </div>
    </>
  );
};

export default DiseaseSearch;
