import React, { useEffect, useReducer, useState } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { getTitle as getTitleBiomarker, getMeta as getMetaBiomarker } from "../utils/biomarker/head";
import PageLoader from "../components/load/PageLoader";
import TextAlert from "../components/alert/TextAlert";
import DialogAlert from "../components/alert/DialogAlert";
import BiomarkerAdvancedSearch from "../components/search/BiomarkerAdvancedSearch";
import SimpleSearchControl from "../components/search/SimpleSearchControl";
import { Tab, Tabs, Container } from "react-bootstrap";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../css/Search.css";
import biomarkerSearchData from "../data/json/biomarkerSearch";
import stringConstants from "../data/json/stringConstants";
import routeConstants from "../data/json/routeConstants";
import { logActivity } from "../data/logging";
import { axiosError } from "../data/axiosError";
import {
  getBiomarkerSearch,
  getBiomarkerSimpleSearch,
  getBiomarkerList,
  getBiomarkerInit
} from "../data/biomarker";
import FeedbackWidget from "../components/FeedbackWidget"
import {
  GLYGEN_BUILD,
} from "../envVariables";

/**
 * Biomarker search component for showing protein search tabs.
 */
const BiomarkerSearch = props => {
  let { id } = useParams("");
  const [initData, setInitData] = useState({});
  const [bioSimpleSearchCategory, setBioSimpleSearchCategory] = useState("any");
  const [bioSimpleSearchTerm, setBioSimpleSearchTerm] = useState("");
  const [bioAdvSearchData, setBioAdvSearchData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      bioSpecimen: "",
      bioLOINCCode: "",
      bioAssessedEntityType: { id: "", name: "All" },
      bioBiomarkerEntity: "",
      bioBiomarkerId: "",
      bioCondition: "",
      bioDiseaseId: "",
      bioPublicationId: "",
      bioBestBiomarkerRole: { id: "", name: "All" },
      
      bioAdvSearchValError: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]
    }
  );

  const [sequenceSearchData, setSequenceSearchData] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{
		  proSequence: "",
		}
	  );

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

  let simpleSearch = biomarkerSearchData.simple_search;
  let advancedSearch = biomarkerSearchData.advanced_search;
  let biomarkerData = stringConstants.biomarker;
  let commonBiomarkerData = biomarkerData.common;
  const queryString = require('query-string');


  /**
   * useEffect for retriving data from api and showing page loading effects.
   */
  useEffect(() => {
    setPageLoading(true);
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
    getBiomarkerInit()
      .then(response => {
        let initData = response.data;

        setInitData(initData);
        const anchorElement = location.hash;
        if (anchorElement) {
          var hash = anchorElement.substr(1);
          if (hash ===  "Simple-Search" || hash ===  "Advanced-Search" || hash ===  "Tutorial") {
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
          getBiomarkerList(id, 1)
            .then(({ data }) => {
              logActivity("user", id, "Search modification initiated");
              if (
                data.cache_info.query.query_type ===
                biomarkerData.simple_search.query_type.name
              ) {
                setBioSimpleSearchCategory(
                  data.cache_info.query.term_category
                    ? data.cache_info.query.term_category
                    : "any"
                );
                setBioSimpleSearchTerm(
                  data.cache_info.query.term ? data.cache_info.query.term : ""
                );
                setProActTabKey("Simple-Search");
                setPageLoading(false);
              } else {
                setBioAdvSearchData({
                  bioSpecimen:
                    data.cache_info.query.specimen_name === undefined
                      ? ""
                      : data.cache_info.query.specimen_name,
                  bioLOINCCode:
                    data.cache_info.query.specimen_loinc_code === undefined
                      ? ""
                      : data.cache_info.query.specimen_loinc_code,
                  bioAssessedEntityType:
                    data.cache_info.query.biomarker_entity_type === undefined
                      ? {
                          id: advancedSearch.assessed_entity_type.placeholderId,
                          name: advancedSearch.assessed_entity_type.placeholderName
                        }
                      : {
                          id: data.cache_info.query.biomarker_entity_type,
                          // name: data.cache_info.query.organism.name
                        },
                  bioBiomarkerEntity:
                    data.cache_info.query.biomarker_entity_name === undefined
                      ? ""
                      : data.cache_info.query.biomarker_entity_name,
                  bioBiomarkerId:
                    data.cache_info.query.biomarker_id === undefined
                      ? ""
                      : data.cache_info.query.biomarker_id,
                  bioCondition:
                    data.cache_info.query.condition_name === undefined
                      ? ""
                      : data.cache_info.query.condition_name,
                  bioPublicationId:
                    data.cache_info.query.condition_id === undefined
                      ? ""
                      : data.cache_info.query.condition_id,
                      bioLOINCCode:
                      data.cache_info.query.specimen_loinc_code === undefined
                        ? ""
                        : data.cache_info.query.specimen_loinc_code,
                  bioBestBiomarkerRole:
                    data.cache_info.query.best_biomarker_role === undefined
                      ? {
                          id: advancedSearch.best_biomarker_role.placeholderId,
                          name: advancedSearch.best_biomarker_role.placeholderName
                        }
                      : {
                          id: data.cache_info.query.best_biomarker_role,
                          // name: data.cache_info.query.organism.name
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
  }, [id, biomarkerData]);

  /**
   * Function to handle biomarker simple search.
   **/
  const biomarkerSimpleSearch = () => {
    var formjsonSimple = {
      [commonBiomarkerData.operation.id]: "AND",
      [biomarkerData.simple_search.query_type.id]:
      biomarkerData.simple_search.query_type.name,
      [commonBiomarkerData.term.id]: bioSimpleSearchTerm,
      [commonBiomarkerData.term_category.id]: bioSimpleSearchCategory
    };
    logActivity("user", id, "Performing Simple Search");
    let message = "Simple Search query=" + JSON.stringify(formjsonSimple);
    getBiomarkerSimpleSearch(formjsonSimple)
      .then(response => {
        if (response.data["list_id"] !== "") {
          logActivity(
            "user",
            (id || "") + ">" + response.data["list_id"],
            message
          ).finally(() => {
            setPageLoading(false);
            navigate(
              routeConstants.biomarkerList + response.data["list_id"]
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
   * @param {string} input_specimen_name user specimen input
   * @param {string} input_specimen_loinc_code user loinc code input
   * @param {number} input_biomarker_entity_type user biomarker entity type input
   * @param {string} input_biomarker_entity_name user biomarker entity name input
   * @param {string} input_biomarker_id user biomarker id input
   * @param {string} input_condition_name user condition name input
   * @param {string} input_disease_id user disease id input
   * @param {string} input_publication_id user publication_id input
   * @param {string} input_best_biomarker_role user best biomarker role input
   * @return {string} returns json
   */
  function searchJson(
    input_query_type,
    input_specimen_name,
    input_specimen_loinc_code,
    input_biomarker_entity_type,
    input_biomarker_entity_name,
    input_biomarker_id,
    input_condition_name,
    input_disease_id,
    input_publication_id,
    input_best_biomarker_role
  ) {

    var biomarker_entity_type = undefined;
    if (
      input_biomarker_entity_type &&
      input_biomarker_entity_type !== advancedSearch.assessed_entity_type.placeholderId
    ) {
      biomarker_entity_type = input_biomarker_entity_type;
    }

    var best_biomarker_role = undefined;
    if (
      input_best_biomarker_role &&
      input_best_biomarker_role !== advancedSearch.best_biomarker_role.placeholderId
    ) {
      best_biomarker_role = input_best_biomarker_role;
    }
   
    var formjson = {
      // [commonBiomarkerData.operation.id]: "AND",
      // [biomarkerData.advanced_search.query_type.id]: input_query_type,
      [commonBiomarkerData.specimen_name.id]: input_specimen_name
        ? input_specimen_name
        : undefined,
      [commonBiomarkerData.specimen_loinc_code.id]: input_specimen_loinc_code
        ? input_specimen_loinc_code
        : undefined,
      [commonBiomarkerData.biomarker_entity_type.id]: biomarker_entity_type,
      [commonBiomarkerData.biomarker_entity_name.id]: input_biomarker_entity_name
        ? input_biomarker_entity_name
        : undefined,
      [commonBiomarkerData.biomarker_id.id]: input_biomarker_id
        ? input_biomarker_id
        : undefined,
      [commonBiomarkerData.condition_name.id]: input_condition_name ? input_condition_name : undefined,
      [commonBiomarkerData.condition_id.id]: input_disease_id ? input_disease_id : undefined,
      [commonBiomarkerData.publication_id.id]: input_publication_id ? input_publication_id : undefined,
      [commonBiomarkerData.best_biomarker_role.id]: best_biomarker_role,
    };
    return formjson;
  }

  /**
   * Function to handle biomarker advanced search.
   **/
  const biomarkerAdvSearch = () => {
    let formObject = searchJson(
      biomarkerData.advanced_search.query_type.name,
      bioAdvSearchData.bioSpecimen,
      bioAdvSearchData.bioLOINCCode,
      bioAdvSearchData.bioAssessedEntityType.id,
      bioAdvSearchData.bioBiomarkerEntity,
      bioAdvSearchData.bioBiomarkerId,
      bioAdvSearchData.bioCondition,
      bioAdvSearchData.bioDiseaseId,
      bioAdvSearchData.bioPublicationId,
      bioAdvSearchData.bioBestBiomarkerRole.id
    );
    logActivity("user", id, "Performing Advanced Search");
    let message = "Advanced Search query=" + JSON.stringify(formObject);
    getBiomarkerSearch(formObject)
      .then(response => {
        if (response.data["list_id"] !== "") {
          logActivity(
            "user",
            (id || "") + ">" + response.data["list_id"],
            message
          ).finally(() => {
            setPageLoading(false);
            navigate(
              routeConstants.biomarkerList + response.data["list_id"]
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
   * Function to handle click event for biomarker advanced search.
   **/
  const searchBiomarkerAdvClick = () => {
    setSearchStarted(true);
    setPageLoading(true);
    biomarkerAdvSearch();
  };

  /**
   * Function to handle click event for biomarker simple search.
   **/
  const searchBiomarkerSimpleClick = () => {
    setSearchStarted(true);
    setPageLoading(true);
    biomarkerSimpleSearch();
  };

  return (
    <>
      <Helmet>
        {GLYGEN_BUILD === "glygen" ? getTitle("biomarkerSearch") :
          getTitleBiomarker("biomarkerSearch")}

        {GLYGEN_BUILD === "glygen" ? getMeta("biomarkerSearch") :
          getMetaBiomarker("biomarkerSearch")}
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
            <h1 className="page-heading">{biomarkerSearchData.pageTitle}</h1>
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
              <Container className="tab-content-border tab-bigscreen">
                {initData.simple_search_category && (
                  <SimpleSearchControl
                    simpleSearchCategory={bioSimpleSearchCategory}
                    simpleSearchCategoryLabel={
                      commonBiomarkerData.term_category.name
                    }
                    simpleSearchTerm={bioSimpleSearchTerm}
                    simple_search_category={initData.simple_search_category}
                    simple_search={simpleSearch.categories}
                    searchSimpleClick={searchBiomarkerSimpleClick}
                    setSimpleSearchCategory={setBioSimpleSearchCategory}
                    setSimpleSearchTerm={setBioSimpleSearchTerm}
                    length={simpleSearch.length}
                    errorText={simpleSearch.errorText}
                    database={GLYGEN_BUILD === "glygen" ? "GlyGen" : "Biomarker Partnership"}
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
              <h5><br></br><center>{GLYGEN_BUILD === "glygen" ? advancedSearch.message : advancedSearch.messageBiomarker}</center></h5>
                {initData && (
                  <BiomarkerAdvancedSearch
                    searchBiomarkerAdvClick={searchBiomarkerAdvClick}
                    inputValue={bioAdvSearchData}
                    initData={initData}
                    setBioAdvSearchData={setBioAdvSearchData}
                  />
                )}
              </Container>
            </Tab>
            <Tab
              eventKey="Tutorial"
              title={biomarkerSearchData.tutorial.tabTitle}
              className="tab-content-padding"
            >
              <Container className="tab-content-border tab-bigscreen">
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

export default BiomarkerSearch;
