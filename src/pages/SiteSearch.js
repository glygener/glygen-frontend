import React, { useEffect, useReducer, useState } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import PageLoader from "../components/load/PageLoader";
import TextAlert from "../components/alert/TextAlert";
import DialogAlert from "../components/alert/DialogAlert";
import SiteSearchControl from "../components/search/SiteSearchControl";
import { Tab, Tabs, Container } from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";
import "../css/Search.css";
import {
  getSiteSearch,
  getSiteSearchInit,
  getSuperSearchList,
  createSiteQuerySummary,
} from "../data/supersearch";
import siteData from "../data/json/siteData";
import { logActivity } from "../data/logging";
import { axiosError } from "../data/axiosError";
import FeedbackWidget from "../components/FeedbackWidget";
import * as routeConstants from "../data/json/routeConstants";
import stringConstants from "../data/json/stringConstants";

/**
 * Protein search component for showing protein search tabs.
 */
const SiteSearch = (props) => {
  let { id } = useParams("");
  const [siteActTabKey, setSiteActTabKey] = useState("Site-Search");
  const [pageLoading, setPageLoading] = useState(false);
  const [alertTextInput, setAlertTextInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  const [siteSearchData, setSiteSearchData] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{
			position: '',
			proteinId: '',
			aminoType: '',
      pattern: '',
      distance: '',
      annotationOperation: '$and',
      operator: '$lte',
      updownoperator: 'down_seq',
      annotations: [],
      singleannotations: ''
		}
	);

  const [siteError, setSiteError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { neighbors: false, pattern: false, peptideInvalid: false, peptideLength: false, upstreamPosition: false }
  );
  const [initData, setInitData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setPageLoading(true);
    logActivity();
    document.addEventListener("click", () => {
      setAlertTextInput({ show: false });
    });

    getSiteSearchInit().then(response => {
      if (response.data && response.data.annotation_type_list){
        response.data.annotation_type_list = response.data.annotation_type_list.map((item) => {return {id: item.id, name: item.label}});
      }
      let initData = response.data;
      setInitData(response.data);

      let anchorElement = location.hash;
      if (anchorElement) {
        var hash = anchorElement.substr(1);
        if (hash ===  "Site-Search" || hash ===  "Tutorial") {
          setSiteActTabKey(hash);	
        } else {
          setSiteActTabKey("Site-Search");
        }
      } else {
        setSiteActTabKey("Site-Search");
      }

      if (id === undefined) setPageLoading(false);

      id && getSuperSearchList(id, 1)
          .then(({ data }) => {
            logActivity("user", id, "Search modification initiated");
            const querySummary = createSiteQuerySummary(data.cache_info.query);
            setSiteSearchData({
              proteinId:
                querySummary.proteinId === undefined
                  ? ''
                  : querySummary.proteinId.join(","),
              annotations:
                querySummary.annotations === undefined
                  ? []
                  : initData.annotation_type_list.filter(annotation => {
                    return querySummary.annotations.includes(annotation.id);
                  }),
              singleannotations:
                querySummary.neighborsCat === undefined
                  ? ''
                  : querySummary.neighborsCat,
              aminoType:
                querySummary.aminoType === undefined
                    ? ''
                    : querySummary.aminoType,
              position:
                querySummary.patternPosition === undefined
                  ? ''
                  : querySummary.patternPosition,
              annotationOperation:
                querySummary.annotationOperation === undefined
                        ? '$and'
                        : querySummary.annotationOperation,
              operator:
                querySummary.neighborsDistOper === undefined
                  ? '$lte'
                  : querySummary.neighborsDistOper,
              updownoperator:
                querySummary.patternTerminal === undefined
                  ? 'down_seq'
                  : querySummary.patternTerminal,
              distance:
                querySummary.neighborsDist === undefined
                  ? ''
                  : querySummary.neighborsDist,
              pattern:
                querySummary.patternPeptide === undefined
                  ? ''
                  : querySummary.patternPeptide,
            });

            setPageLoading(false);
          })
          .catch(function (error) {
            let message = "list api call";
            axiosError(error, "", message, setPageLoading, setAlertDialogInput);
          });
    })
    .catch(function (error) {
			let message = "search_init api call";
			axiosError(error, "", message, setPageLoading, setAlertDialogInput);
		});

  }, [id]);


  const handleSearch = () => {
    let errorTemp = siteError;
    let error = false;
    if ((siteSearchData.position !== "" || siteSearchData.pattern !== "") && !(siteSearchData.pattern !== "" && siteSearchData.position !== "")){
        errorTemp.pattern = true;
        error = true;
    }

    if (siteSearchData.updownoperator === "up_seq" && siteSearchData.pattern !== "" && siteSearchData.position !== ""){
      errorTemp.upstreamPosition = siteSearchData.pattern.length > siteSearchData.position;
      error = siteSearchData.pattern.length > siteSearchData.position;
    }

    if ((siteSearchData.distance !== "" || siteSearchData.singleannotations !== "") && !(siteSearchData.singleannotations !== "" && siteSearchData.distance !== "")){
        errorTemp.neighbors = true;
        error = true;
    }

    if (error){
      setSiteError(errorTemp);
      return;
    }

    let queryObject = {
      proteinId : siteSearchData.proteinId.split(",").filter(x => x !== ""),
      aminoType : siteSearchData.aminoType,
      annotations : siteSearchData.annotations.map(x => x.id.toLowerCase()),
      annotationOperation : siteSearchData.annotationOperation,
      singleannotations : siteSearchData.singleannotations,
      operator : siteSearchData.operator,
      updownoperator : siteSearchData.updownoperator,
      distance : siteSearchData.distance,
      combinedPattern: siteSearchData.position === "" || siteSearchData.pattern === "" ?  "" : `${parseInt(siteSearchData.position)}|${siteSearchData.pattern.toUpperCase()}`
    };

    setPageLoading(true);
    logActivity("user", props.searchId, "Performing Site Search");
    let message = "Site Search query=" + JSON.stringify(queryObject);

    getSiteSearch(queryObject)
      .then(response => {
        let listId = undefined;
        if (
          response.data &&
          response.data.results_summary &&
          response.data.results_summary.site &&
          response.data.results_summary.site.list_id
        )
          listId = response.data.results_summary.site.list_id;

        if (listId) {
          logActivity("user", (props.searchId || "") + ">" + listId, message)
					.finally(() => {	
            window.location = routeConstants.siteList + listId;
					});
        } else {
          logActivity("user", "", "No results. ");
          setPageLoading(false);
          setAlertTextInput({
            show: true,
            id: stringConstants.errors.siteSerarchError.id
          });
          window.scrollTo(0, 0);
        }
      })
      .catch(function(error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  return (
    <>
      <Helmet>
        {getTitle("proteinSiteSearch")}
        {getMeta("proteinSiteSearch")}
      </Helmet>
      <FeedbackWidget />
      <div className="lander">
        <Container>
          <PageLoader pageLoading={pageLoading} />
          <DialogAlert
            alertInput={alertDialogInput}
            setOpen={(input) => {
              setAlertDialogInput({ show: input });
            }}
          />
          <div className="content-box-md">
            <h1 className="page-heading">{siteData.pageTitle}</h1>
          </div>
          <Tabs
            defaultActiveKey="Site-Search"
            transition={false}
            activeKey={siteActTabKey}
            mountOnEnter={true}
            unmountOnExit={true}
            onSelect={(key) => setSiteActTabKey(key)}
          >
            <Tab
              key="search"
              eventKey="Site-Search"
              className="tab-content-padding"
              title={siteData.site_search.tabTitle}
            >
              <TextAlert alertInput={alertTextInput} />
              <Container className="tab-content-border">
              <h5><br></br><center>{siteData.site_search.message}</center></h5>
                <SiteSearchControl
                  siteSearchData={siteSearchData}
                  setSiteSearchData={setSiteSearchData}
                  siteError={siteError}
                  setSiteError={setSiteError}
                  handleSearch={handleSearch}
                  initData={initData}
                />
              </Container>
            </Tab>
            <Tab
              key="tutorial"
              eventKey="Tutorial"
              title={siteData.tutorial.tabTitle}
              className="tab-content-padding"
            >
              <Container className="tab-content-border">
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

export default SiteSearch;
