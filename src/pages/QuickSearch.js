import React, { useEffect, useReducer, useState } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import Container from "@material-ui/core/Container";
import VerticalHeading from "../components/headings/VerticalHeading";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { logActivity } from "../data/logging";
import { getGlycanInit } from "../data/glycan";
import {
  getGlycanToBiosynthesisEnzymes,
  getGlycanToGlycoproteins,
  getGlycanToEnzymeGeneLoci,
  getDiseaseToGlycosyltransferases,
  getProteinToOrthologs,
  getOrthologsList,
  getBiosynthesisEnzymeToGlycans,
  getOrganismToGlycosyltransferases,
  getOrganismToGlycohydrolases,
  getOrganismToGlycoproteins,
  getGeneLocusList,
} from "../data/usecases";
import { axiosError } from "../data/axiosError";
import stringConstants from "../data/json/stringConstants";
import routeConstants from "../data/json/routeConstants";
import SearchByGlycan from "../components/quickSearch/SearchByGlycan";
import SearchByProtein from "../components/quickSearch/SearchByProtein";
import SearchByOrganism from "../components/quickSearch/SearchByOrganism";
import SearchByDisease from "../components/quickSearch/SearchByDisease";
import { getProteinList } from "../data/protein";
import { getGlycanList } from "../data/glycan";
import { GLYGEN_BASENAME } from "../envVariables";

const QuickSearch = (props) => {
  let { id } = useParams("");
  let { questionId } = useParams("");
  let quickSearch = stringConstants.quick_search;

  const vertHeadQuickSearch = {
    h5VerticalText: "Searches",
    h2textTop: "Perform",
    h2textBottom: "A",
    h2textBottomStrongAfter: "Quick Search",
  };

  const items = [
    {
      label: stringConstants.sidebar.search_by_glycan.displayname,
      id: "Search-by-Glycan",
    },
    {
      label: stringConstants.sidebar.search_by_protein.displayname,
      id: "Search-by-Protein",
    },
    {
      label: stringConstants.sidebar.search_by_organism.displayname,
      id: "Search-by-Organism",
    },
    {
      label: stringConstants.sidebar.search_by_disease.displayname,
      id: "Search-by-Disease",
    },
  ];

  const [glycanInitData, setGlycanInitData] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  const [alertText, setAlertText] = useReducer((state, newState) => ({ ...state, ...newState }), {
    question: "",
    input: { show: false, id: "" },
    default: { show: false, id: "" },
  });

  const [inputValue, setInputValue] = useReducer((state, newState) => ({ ...state, ...newState }), {
    question_1: "",
    question_2: "",
    question_3: "",
    question_4: "",
    question_5: "",
    question_6: "",
    question_7: "",
    question_8: "0",
    question_9: "0",
    question_10: { organism: "0", glycosylation_evidence: "" },
    question_11: "",
  });

  const searchQuestion1 = () => {
    setPageLoading(true);
    logActivity("user", id, "Performing Quick Search");
    let message = "Quick Search Question_1 = /9606/" + inputValue.question_1;
    getGlycanToBiosynthesisEnzymes(9606, inputValue.question_1)
      .then((response) => {
        if (response.data["list_id"] !== "") {
          setPageLoading(false);
          logActivity("user", (id || "") + ">" + response.data["list_id"], message).finally(() => {
            props.history.push(
              routeConstants.proteinList +
                response.data["list_id"] +
                "/" +
                quickSearch.question_1.id
            );
          });
        } else {
          setPageLoading(false);
          logActivity("user", "", "No results. " + message);
          setAlertText({
            question: quickSearch.question_1.id,
            input: {
              show: true,
              id: stringConstants.errors.quickSerarchError.id,
            },
          });
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  const searchQuestion2 = () => {
    setPageLoading(true);
    logActivity("user", id, "Performing Quick Search");
    let message = "Quick Search Question_2 = /0/" + inputValue.question_2;
    getGlycanToGlycoproteins(0, inputValue.question_2)
      .then((response) => {
        if (response.data["list_id"] !== "") {
          setPageLoading(false);
          logActivity("user", (id || "") + ">" + response.data["list_id"], message).finally(() => {
            props.history.push(
              routeConstants.proteinList +
                response.data["list_id"] +
                "/" +
                quickSearch.question_2.id
            );
          });
        } else {
          setPageLoading(false);
          logActivity("user", "", "No results. " + message);
          setAlertText({
            question: quickSearch.question_2.id,
            input: {
              show: true,
              id: stringConstants.errors.quickSerarchError.id,
            },
          });
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  const searchQuestion3 = () => {
    setPageLoading(true);
    logActivity("user", id, "Performing Quick Search");
    let message = "Quick Search Question_3 = /9606/" + inputValue.question_3;
    getGlycanToEnzymeGeneLoci(9606, inputValue.question_3)
      .then((response) => {
        if (response.data["list_id"] !== "") {
          setPageLoading(false);
          logActivity("user", (id || "") + ">" + response.data["list_id"], message).finally(() => {
            props.history.push(
              routeConstants.locusList + response.data["list_id"] + "/" + quickSearch.question_3.id
            );
          });
        } else {
          setPageLoading(false);
          logActivity("user", "", "No results. " + message);
          setAlertText({
            question: quickSearch.question_3.id,
            input: {
              show: true,
              id: stringConstants.errors.quickSerarchError.id,
            },
          });
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  const searchQuestion4 = () => {
    setPageLoading(true);
    logActivity("user", id, "Performing Quick Search");
    let message = "Quick Search Question_4 = /" + inputValue.question_4;
    getProteinToOrthologs(inputValue.question_4)
      .then((response) => {
        if (response.data["list_id"] !== "") {
          setPageLoading(false);
          logActivity("user", (id || "") + ">" + response.data["list_id"], message).finally(() => {
            props.history.push(
              routeConstants.orthologsList +
                response.data["list_id"] +
                "/" +
                quickSearch.question_4.id
            );
          });
        } else {
          setPageLoading(false);
          logActivity("user", "", "No results. " + message);
          setAlertText({
            question: quickSearch.question_4.id,
            input: {
              show: true,
              id: stringConstants.errors.quickSerarchError.id,
            },
          });
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  const searchQuestion5 = () => {
    let message = `Quick Search Question_5 =/${inputValue.question_5} function`;
    logActivity("user", (id || "") + ">" + inputValue.question_5, message).finally(() => {
      const basename = GLYGEN_BASENAME === "/" ? "" : GLYGEN_BASENAME;
      window.location =
        basename + routeConstants.proteinDetail + inputValue.question_5 + "#Function";
    });
  };

  const searchQuestion6 = () => {
    setPageLoading(true);
    logActivity("user", id, "Performing Quick Search");
    let message = "Quick Search Question_6 = /10090/" + inputValue.question_6;
    getBiosynthesisEnzymeToGlycans(10090, inputValue.question_6)
      .then((response) => {
        if (response.data["list_id"] !== "") {
          setPageLoading(false);
          logActivity("user", (id || "") + ">" + response.data["list_id"], message).finally(() => {
            props.history.push(
              routeConstants.glycanList + response.data["list_id"] + "/" + quickSearch.question_6.id
            );
          });
        } else {
          setPageLoading(false);
          logActivity("user", "", "No results. " + message);
          setAlertText({
            question: quickSearch.question_6.id,
            input: {
              show: true,
              id: stringConstants.errors.quickSerarchError.id,
            },
          });
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  const searchQuestion7 = () => {
    let message = `Quick Search Question_7 =/${inputValue.question_7} sequence`;
    logActivity("user", (id || "") + ">" + inputValue.question_7, message).finally(() => {
      const basename = GLYGEN_BASENAME === "/" ? "" : GLYGEN_BASENAME;
      window.location =
        basename +
        routeConstants.proteinDetail +
        inputValue.question_7 +
        "/site_annotation#Sequence";
    });
  };

  const searchQuestion8 = () => {
    setPageLoading(true);
    logActivity("user", id, "Performing Quick Search");
    let message = "Quick Search Question_8 = /" + inputValue.question_8;
    getOrganismToGlycosyltransferases(inputValue.question_8)
      .then((response) => {
        if (response.data["list_id"] !== "") {
          setPageLoading(false);
          logActivity("user", (id || "") + ">" + response.data["list_id"], message).finally(() => {
            props.history.push(
              routeConstants.proteinList +
                response.data["list_id"] +
                "/" +
                quickSearch.question_8.id
            );
          });
        } else {
          setPageLoading(false);
          logActivity("user", "", "No results. " + message);
          setAlertText({
            question: quickSearch.question_8.id,
            input: {
              show: true,
              id: stringConstants.errors.quickSerarchError.id,
            },
          });
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  const searchQuestion9 = () => {
    setPageLoading(true);
    logActivity("user", id, "Performing Quick Search");
    let message = "Quick Search Question_9 = /" + inputValue.question_9;
    getOrganismToGlycohydrolases(inputValue.question_9)
      .then((response) => {
        if (response.data["list_id"] !== "") {
          setPageLoading(false);
          logActivity("user", (id || "") + ">" + response.data["list_id"], message).finally(() => {
            props.history.push(
              routeConstants.proteinList +
                response.data["list_id"] +
                "/" +
                quickSearch.question_9.id
            );
          });
        } else {
          setPageLoading(false);
          logActivity("user", "", "No results. " + message);
          setAlertText({
            question: quickSearch.question_9.id,
            input: {
              show: true,
              id: stringConstants.errors.quickSerarchError.id,
            },
          });
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  const searchQuestion10 = () => {
    setPageLoading(true);
    logActivity("user", id, "Performing Quick Search");
    let message = "Quick Search Question_10 = /9606/" + inputValue.question_10;
    getOrganismToGlycoproteins(
      inputValue.question_10.organism,
      inputValue.question_10.glycosylation_evidence
    )
      .then((response) => {
        if (response.data["list_id"] !== "") {
          setPageLoading(false);
          logActivity("user", (id || "") + ">" + response.data["list_id"], message).finally(() => {
            props.history.push(
              routeConstants.proteinList +
                response.data["list_id"] +
                "/" +
                quickSearch.question_10.id
            );
          });
        } else {
          setPageLoading(false);
          logActivity("user", "", "No results. " + message);
          setAlertText({
            question: quickSearch.question_10.id,
            input: {
              show: true,
              id: stringConstants.errors.quickSerarchError.id,
            },
          });
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  const searchQuestion11 = () => {
    setPageLoading(true);
    logActivity("user", id, "Performing Quick Search");
    var formObject = { do_name: inputValue.question_11, tax_id: 0 };
    let message = "Quick Search Question_11 query=" + JSON.stringify(formObject);
    getDiseaseToGlycosyltransferases(formObject)
      .then((response) => {
        if (response.data["list_id"] !== "") {
          setPageLoading(false);
          logActivity("user", (id || "") + ">" + response.data["list_id"], message).finally(() => {
            props.history.push(
              routeConstants.proteinList +
                response.data["list_id"] +
                "/" +
                quickSearch.question_11.id
            );
          });
        } else {
          setPageLoading(false);
          logActivity("user", "", "No results. " + message);
          setAlertText({
            question: quickSearch.question_11.id,
            input: {
              show: true,
              id: stringConstants.errors.quickSerarchError.id,
            },
          });
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  function getListData(listId) {
    let listApi = getListApi(questionId);
    if ("getGlycanList" === listApi) return getGlycanList(listId, 1, 1);
    else if ("getProteinList" === listApi) return getProteinList(listId, 1, 1);
    else if ("getGeneLocusList" === listApi) return getGeneLocusList(listId, 1, 1);
    else if ("getOrthologsList" === listApi) return getOrthologsList(listId, 1, 1);
    return undefined;
  }

  function getListApiResponse(questionId, response) {
    if (questionId === quickSearch.question_1.id) {
      return response.query.glytoucan_ac;
    } else if (questionId === quickSearch.question_2.id) {
      return response.query.glytoucan_ac;
    } else if (questionId === quickSearch.question_3.id) {
      return response.query.glytoucan_ac;
    } else if (questionId === quickSearch.question_4.id) {
      return response.query.uniprot_canonical_ac;
    } else if (questionId === quickSearch.question_5.id) {
      return "";
    } else if (questionId === quickSearch.question_6.id) {
      return response.query.uniprot_canonical_ac;
    } else if (questionId === quickSearch.question_7.id) {
      return "";
    } else if (questionId === quickSearch.question_8.id) {
      return response.query.organism.id;
    } else if (questionId === quickSearch.question_9.id) {
      return response.query.organism.id;
    } else if (questionId === quickSearch.question_10.id) {
      return {
        organism: response.query.organism.id,
        glycosylation_evidence: response.query.evidence_type,
      };
    } else if (questionId === quickSearch.question_11.id) {
      return response.query.do_name;
    }
  }

  function getListApi(questionId) {
    if (questionId === quickSearch.question_1.id) {
      return "getProteinList";
    } else if (questionId === quickSearch.question_2.id) {
      return "getProteinList";
    } else if (questionId === quickSearch.question_3.id) {
      return "getGeneLocusList";
    } else if (questionId === quickSearch.question_4.id) {
      return "getOrthologsList";
    } else if (questionId === quickSearch.question_5.id) {
      return "getProteinList";
    } else if (questionId === quickSearch.question_6.id) {
      return "getGlycanList";
    } else if (questionId === quickSearch.question_7.id) {
      return "getProteinList";
    } else if (questionId === quickSearch.question_8.id) {
      return "getProteinList";
    } else if (questionId === quickSearch.question_9.id) {
      return "getProteinList";
    } else if (questionId === quickSearch.question_10.id) {
      return "getProteinList";
    } else if (questionId === quickSearch.question_11.id) {
      return "getProteinList";
    }
  }

  useEffect(() => {
    setPageLoading(true);
    logActivity();

    document.addEventListener("click", () => {
      setAlertText({ question: "", input: { show: false, id: "" } });
    });

    let question = quickSearch[questionId];
    getGlycanInit()
      .then((response) => {
        setGlycanInitData(response.data);
        const anchorElement = props.history.location.hash;
        if (anchorElement && document.getElementById(anchorElement.substr(1))) {
          document.getElementById(anchorElement.substr(1)).scrollIntoView({ behavior: "auto" });
        }
        if (!id || !question) setPageLoading(false);
      })
      .catch(function (error) {
        let message = "search_init api call";
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });

    id &&
      question &&
      getListData(id)
        .then((response) => {
          setInputValue({
            [questionId]: getListApiResponse(questionId, response.data),
          });
          setPageLoading(false);
        })
        .catch(function (error) {
          let message = "list api call";
          axiosError(error, "", message, setPageLoading, setAlertDialogInput);
        });
  }, [id, questionId, quickSearch]);

  return (
    <>
      <Helmet>
        {getTitle("quickSearch")}
        {getMeta("quickSearch")}
      </Helmet>

      <div id="top-heading"></div>
      <Row className="gg-baseline">
        <Col sm={12} md={12} lg={12} xl={3} className="sidebar-col">
          <Sidebar items={items} />
        </Col>
        <Col sm={12} md={12} lg={12} xl={9} className="sidebar-page">
          <Container maxWidth="md" className="sidebar-page-mb">
            <VerticalHeading post={vertHeadQuickSearch} style={{ margin: "0 auto" }} />
            <PageLoader pageLoading={pageLoading} />
            <DialogAlert
              alertInput={alertDialogInput}
              setOpen={(input) => {
                setAlertDialogInput({ show: input });
              }}
            />
            <SearchByGlycan
              setInputValue={setInputValue}
              inputValue={inputValue}
              searchQuestion1={searchQuestion1}
              searchQuestion2={searchQuestion2}
              searchQuestion3={searchQuestion3}
              questionId={questionId}
              alertText={alertText}
              id="Search-by-Glycan"
            />
            <SearchByProtein
              setInputValue={setInputValue}
              inputValue={inputValue}
              searchQuestion4={searchQuestion4}
              searchQuestion5={searchQuestion5}
              searchQuestion6={searchQuestion6}
              searchQuestion7={searchQuestion7}
              questionId={questionId}
              alertText={alertText}
              id="Search-by-Protein"
            />
            <SearchByOrganism
              setInputValue={setInputValue}
              inputValue={inputValue}
              glycanInitData={glycanInitData}
              searchQuestion8={searchQuestion8}
              searchQuestion9={searchQuestion9}
              searchQuestion10={searchQuestion10}
              questionId={questionId}
              alertText={alertText}
              id="Search-by-Organism"
            />
            <SearchByDisease
              setInputValue={setInputValue}
              inputValue={inputValue}
              searchQuestion11={searchQuestion11}
              questionId={questionId}
              alertText={alertText}
              id="Search-by-Disease"
            />
          </Container>
        </Col>
      </Row>
    </>
  );
};
export default QuickSearch;
