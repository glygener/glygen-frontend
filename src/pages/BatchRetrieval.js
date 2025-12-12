import React, { useEffect, useState, useReducer, useRef, useContext } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import SelectControl from "../components/select/SelectControl";
import HelpTooltip from "../components/tooltip/HelpTooltip";
import PageLoader from "../components/load/PageLoader";
import FeedbackWidget from "../components/FeedbackWidget.js";
import DialogAlert from "../components/alert/DialogAlert";
import TextAlert from "../components/alert/TextAlert";
import "../css/Search.css";
import { logActivity } from "../data/logging";
import { axiosError } from "../data/axiosError";
import DialogLoader from '../components/load/DialogLoader';
import stringConstants from "../data/json/stringConstants";
import batchRetrieval from "../data/json/batchRetrieval";
import routeConstants from "../data/json/routeConstants";
import { getJobInit, getJobDetails, postNewJob, getJobStatus } from "../data/job";
import ExampleExploreControl from "../components/example/ExampleExploreControl";
import { sortDropdownIgnoreCase } from "../utils/common";
import CustomColumnsData from "../components/columnSelector/CustomColumnsData";
import AccordionMUI from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BatchRetrievalInputcontrol from "../components/input/BatchRetrievalInputcontrol"
import { sortByOrder } from '../utils/common';
import { addJobToStore } from "../data/jobStoreApi"
import GlyGenNotificationContext from "../components/GlyGenNotificationContext.js";
import { Link } from "react-router-dom";

const BatchRetrieval = (props) => {
  let { id } = useParams("");
  const location = useLocation();
  const [initData, setInitData] = useState({});
  const [columnsData, setColumnsData] = useState({});
  const [categoriesData, setCategoriesData] = useState({});
  const state = location.state;
  const fileInputRef = useRef();
  const [batchRetrievalData, setBatchRetrievalData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      inputNamespace: "any",
      inputIdlist: "",
    }
  );

  const [isInputTouched, setInputTouched] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      fromIdInput: false,
      idListInput: false,
      fileInput: false,
    }
  );

  const [fileUploadForm, setFileUploadForm] = useState(null);
  const [errorFileUpload, setErrorFileUpload] = useState(null);
  const { showNotification } = useContext(GlyGenNotificationContext);
  const [fromIdTypeValidated, setFromIdTypeValidated] = useState(false);
  const [toIdTypeValidated, setToIdTypeValidated] = useState(false);
  const [inputIdListValidated, setInputIdListValidated] = useState(false);
  const [fileUploadValidated, setFileUploadValidated] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const dialogLoadingRef = useRef(dialogLoading);
  dialogLoadingRef.current = dialogLoading;
  const [pageLoading, setPageLoading] = React.useState(true);
  const [alertTextInput, setAlertTextInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  let batchRetrievalJSONData = batchRetrieval.batch_retrieval;

  const [open, setOpen] = React.useState(false);
  const [userSelectedColumns, setUserSelectedColumns] = useState([]);
  const tableId = "glycan";


  function toggleDrawer(newOpen) {
    setOpen(newOpen);
  };

  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const navigate = useNavigate();

  let commonBatchRetrievalData = stringConstants.batch_retrieval.common;


  /**
   * Function to set inputNamespace value.
   * @param {string} value - input inputNamespace value.
   **/
  const inputNamespaceOnChange = (value) => {
    setInputTouched({ fromIdInput: true });
    setBatchRetrievalData({ inputNamespace: value });
    setToIdTypeValidated(false);
    if (value && value !== "any") {
      setFromIdTypeValidated(true);
    } else {
      setFromIdTypeValidated(false);
    }
  };

  /**
   * Function to set inputIdlist (Enter IDs) name value.
   * @param {string} event - input inputIdlist (Enter IDs) name value.
   **/
  const inputIdlistOnChange = (event) => {
    setInputTouched({ idListInput: true });
    fileInputRef.current.value = "";
    setBatchRetrievalData({ inputIdlist: event.target.value });
    if (event.target.value) {
      setInputIdListValidated(true);
      setFileUploadValidated(true);
      setErrorFileUpload("");
    } else {
      setInputIdListValidated(false);
    }
  };

  /**
   * Function to set input ID list value.
   * @param {string} inputFuncInputIdlist - input ID list value.
   **/
  function funcInputIdlistOnChange(inputFuncInputIdlist) {
    setInputTouched({ idListInput: true });
    fileInputRef.current.value = "";
    setBatchRetrievalData({ inputIdlist: inputFuncInputIdlist });
    if (inputFuncInputIdlist) {
      setInputIdListValidated(true);
      setFileUploadValidated(true);
      setErrorFileUpload("");
    } else {
      setInputIdListValidated(false);
    }
  }

  const fileOnChangeHandler = () => {
    const typesFileUpload = ["text/csv"];
    const fileElem = fileInputRef.current;

    if (fileElem.files.length > 0) {
      const file = fileElem.files[0];
      if (fileElem && typesFileUpload.includes(file.type)) {
        setBatchRetrievalData({ inputIdlist: "" });
        setFileUploadValidated(true);
        setInputIdListValidated(true);
        setErrorFileUpload("");
      } else {
        setFileUploadForm(null);
        setErrorFileUpload(batchRetrievalJSONData.file_upload.errorFileUpload);
        setFileUploadValidated(false);
      }
    }
  };

  /**
 * Function to handle on change event for category accordian.
 **/
  function handleCategories(expanded) {
    setShowCategories(expanded);
  }

  const [showCategories, setShowCategories] = useState(false);
  const [controlArray, setControlArray] = useState([]);

  /**
   * Function to delete query.
   * @param {number} order - query order number.
   **/
  function batchRetrievalDeleteQuery(order) {
    var temp = controlArray.find(query => query.order === order);

    var tempArray = controlArray.filter(query => query.order !== order);
    tempArray.map((value, index, arr) => {
      if (value.order > order) {
        value.order = value.order - 1;
      }
      return value;
    })
    setControlArray(tempArray);

    var tempArrayDup = tempArray.filter(query => query.id === temp.id);
    if (tempArrayDup.length === 0) {
      var tempArraySel = userSelectedColumns.filter(query => query.id !== temp.id);
      tempArraySel.map((value, index, arr) => {
        if (value.order > order) {
          value.order = value.order - 1;
        }
        return value;
      })
      setUserSelectedColumns(tempArraySel);
    }
  }

  /**
 * Function to add query.
 * @param {number} order - query order number.
 * @param {string} curfield - current field.
 **/
  function batchRetrievalAddQuery(order, curfield) {
    var tempArray = controlArray.slice();
    tempArray.map((value, index, arr) => {
      if (value.order >= order) {
        value.order = value.order + 1;
      }
      return value;
    })

    tempArray.push({
      order: order,
      id: curfield.id,
      propertyName: curfield.property_name,
      field: curfield.field,
      label: curfield.label,
      oplist: curfield.oplist,
      operationEnum: curfield.operationEnum,
      categories: curfield.categories,
      typeaheadID: curfield.typeaheadID,
      fieldList: curfield.fieldList,
      outputType: curfield.outputType,
      fieldType: "string",
      outputTypeValue: "id",
      operationEnumValue: "none",
      tooltip: curfield.tooltip,
      maxlength: 100,
      error: false,
      selectEnum: [],
      value: "",
    });
    setControlArray(tempArray);
  }

  /**
 * Function to move query up.
 * @param {number} currOrder - current query order number.
   * @param {number} prevOrder - previous query order number.
 **/
  function batchRetrievalMoveUpQuery(currOrder, prevOrder) {
    var tempArray = controlArray.slice();
    var currQuery = tempArray.filter(query => query.order === currOrder)[0];
    var prevQuery = tempArray.filter(query => query.order === prevOrder)[0];

    var updatedArray = tempArray.filter(query => query.order !== currOrder && query.order !== prevOrder);

    currQuery.order = prevOrder;
    prevQuery.order = currOrder;

    updatedArray.push(prevQuery);
    updatedArray.push(currQuery);

    setControlArray(updatedArray);
  }

  /**
 * Function to move query down.
 * @param {number} currOrder - current query order number.
   * @param {number} nextOrder - next query order number.
 **/
  function batchRetrievalMoveDownQuery(currOrder, nextOrder) {
    var tempArray = controlArray.slice();
    var currQuery = tempArray.filter(query => query.order === currOrder)[0];
    var nextQuery = tempArray.filter(query => query.order === nextOrder)[0];

    var updatedArray = tempArray.filter(query => query.order !== currOrder && query.order !== nextOrder);

    currQuery.order = nextOrder;
    nextQuery.order = currOrder;

    updatedArray.push(currQuery);
    updatedArray.push(nextQuery);

    setControlArray(updatedArray);
  }

  /**
 * Function to update query data.
 * @param {number} currOrder - current query order number.
   * @param {string} field - value type.
 * @param {var} value - value of the field.
 **/
  function batchRetrievalUpdateQuery(currOrder, field, value) {
    var tempArray = controlArray.slice();
    var currQuery = tempArray.filter(query => query.order === currOrder)[0];

    var updatedArray = tempArray.filter(query => query.order !== currOrder);

    currQuery[field] = value;

    updatedArray.push(currQuery);

    setControlArray(updatedArray);
  }


  const clearMapFields = () => {
    fileInputRef.current.value = "";
    setErrorFileUpload("");
    setBatchRetrievalData({
      inputNamespace: "any",
      inputIdlist: "",
    });

    setFromIdTypeValidated(false);
    setInputIdListValidated(false);
    setFileUploadValidated(false);

    setInputTouched({
      fromIdInput: false,
      idListInput: false,
      fileInput: false,
    });
    setControlArray([]);
    setUserSelectedColumns([]);
    setShowCategories(false)
  };

  const onFetchDataByIdFormValidation = () => {
    setFromIdTypeValidated(true);
    setToIdTypeValidated(true);
    setInputIdListValidated(true);
    setFileUploadValidated(true);

    setInputTouched({
      fromIdInput: false,
      idListInput: false,
      fileInput: false,
    });
  };

  function saveColumnsToQuery(columnList) {
    let idList = []
    let queryArray = [...controlArray];
    let order = 1;
    for (let i = 0; i < columnList.length; i++) {
      let temp = queryArray.filter(obj => obj.field === columnList[i].id);
      idList.push(columnList[i].id);
      if (temp && temp.length === 0) {
        queryArray.push({
          id: columnList[i].id,
          propertyName: columnList[i].property_name,
          field: columnList[i].id,
          label: columnList[i].label,
          operationEnum: columnList[i].oplist,
          categories: columnList[i].categories,
          typeaheadID: columnList[i].typeaheadID,
          fieldList: columnList[i].fieldList,
          outputType: columnList[i].outputType,
          fieldType: "string",
          outputTypeValue: "id",
          operationEnumValue: "none",
          order: order++,
          tooltip: columnList[i].tooltip,
          maxlength: 100,
          error: false,
          selectEnum: [],
          enum: [],
          value: "",
        })
      } else {
        for (let j = 0; j < temp.length; j++) {
          temp[j].order = order++;
        }
      }
    }
    queryArray = queryArray.filter(obj => idList.includes(obj.field));

    if (queryArray.length > 0) {
      handleCategories(true);
    } else {
      handleCategories(false);
    }

    setControlArray(queryArray);
  }

  // Use an effect to monitor the update to params
  useEffect(() => {
    if (state && state.selectedIDs) {
      funcInputIdlistOnChange(state.selectedIDs);
      setInputTouched({ idListInput: false });
    }
  }, [state]);


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
    document.addEventListener("click", () => {
      setAlertTextInput({ show: false });
    });

    getJobInit()
      .then((response) => {
        let initData = response.data.batch_retrieval;

        function getColumns(data) {
          let cols = Object.keys(data);
          let columns = [];

          for (let i = 0; i < cols.length; i++) {
            columns.push({
              id: cols[i],
              property_name: cols[i],
              label: data[cols[i]].label,
              oplist: data[cols[i]].oplist ? [...data[cols[i]].oplist] : [],
              categories: data[cols[i]].categories ? [...data[cols[i]].categories] : [],
              typeaheadID: data[cols[i]].typeahead,
              fieldList: data[cols[i]].field_list,
              outputType: data[cols[i]].output_type ? [...data[cols[i]].output_type] : [],
              order: i + 1,
              tooltip: "",
            })
          }

          return columns;
        }

        let columnsJSON = initData.columns;
        let columns = getColumns(columnsJSON);
        let categories = initData.categories ? initData.categories : [];
        setColumnsData(columns);
        setCategoriesData(categories);
        setInitData(initData);
        if (id === undefined) setPageLoading(false);
        id &&
          getJobDetails(id)
            .then(({ data }) => {
              logActivity("user", id, "batch retrieval modification initiated");
              setBatchRetrievalData({
                inputNamespace:
                  data.query.parameters.inputnamespace === undefined
                    ? "any"
                    : data.query.parameters.inputnamespace,
                inputIdlist:
                  data.query.parameters.acclist === undefined
                    ? ""
                    : data.query.parameters.acclist + ",",
                userfile:
                  data.query.parameters.userfile === undefined
                    ? ""
                    : data.query.parameters.userfile,
              });

              let colummsTemp = data?.query?.parameters?.columns ? data.query.parameters.columns : [];
              for (let i = 0; i < colummsTemp.length; i++) {
                colummsTemp[i].propertyName = colummsTemp[i].id;
                colummsTemp[i].field = colummsTemp[i].id;
                colummsTemp[i].categories = columnsJSON[colummsTemp[i].id].categories;
                colummsTemp[i].fieldType = "string";
                colummsTemp[i].outputTypeValue = colummsTemp[i].output_type ? colummsTemp[i].output_type : "id";
                colummsTemp[i].operationEnumValue = colummsTemp[i].filter_type ? colummsTemp[i].filter_type : "none";
                colummsTemp[i].operationEnum = columnsJSON[colummsTemp[i].id].oplist;
                colummsTemp[i].outputType = columnsJSON[colummsTemp[i].id].output_type;
                colummsTemp[i].value = colummsTemp[i].filter ? colummsTemp[i].filter : "";
                colummsTemp[i].typeaheadID = columnsJSON[colummsTemp[i].id].typeahead;
                colummsTemp[i].fieldList = columnsJSON[colummsTemp[i].id].field_list;
                colummsTemp[i].tooltip = "";
                colummsTemp[i].maxlength = 100;
                colummsTemp[i].error = false;
                colummsTemp[i].selectEnum = [];
                colummsTemp[i].enum = [];
              }

              if (colummsTemp.length > 0) {
                handleCategories(true);
              }
              setControlArray(colummsTemp);
              setUserSelectedColumns(colummsTemp);

              setPageLoading(false);
              onFetchDataByIdFormValidation();
            })
            .catch(function (error) {
              let message = "batch retrieval - job detail api call";
              axiosError(error, "", message, setPageLoading, setAlertDialogInput);
            });
      })
      .catch(function (error) {
        let message = "batch retrieval - job init api call";
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  }, [id]);


  /**f
   * Function to return JSON query.fcommonBatchRetrievalData
   * @param {string} input_proSequence - protein sequence.
   * @param {string} input_data - input data.
   * @param {string} columns - input data.
   **/
  function searchJson(
    input_inputnamespace,
    input_data,
    columns
  ) {

    var acclist = input_data;
    if (acclist) {
      acclist = acclist.replace(/\s+/g, ",");
      acclist = acclist.replace(/\\n+/g, ",");
      acclist = acclist.replace(/,+/g, ",");
      var index = acclist.lastIndexOf(",");
      if (index > -1 && index + 1 === acclist.length) {
        acclist = acclist.substr(0, index);
      }
      
      acclist = acclist.split(",");
    }

    var formJson = {
      [commonBatchRetrievalData.jobtype.id]: "batch_retrieval",
      "parameters": {
        "inputnamespace": input_inputnamespace,
        "acclist": acclist === undefined || acclist.length === 0 ? undefined : acclist,
        "columns": columns
      }
    };

    return formJson;
  }

  /**
   * Function to handle blast search submit.
   **/
  const blastRetrievalSubmit = (type, inputnamespace, data, columns, userfile, userfileb64) => {

    let formObject = searchJson(
      inputnamespace,
      data,
      columns
    );
    let message = "Batch Retrieval query";
    logActivity("user", id, "Performing " + message);
    postNewJob(formObject, userfile)
      .then((response) => {
        if (response.data["status"] && response.data["status"] !== {}) {
          let josStatus = response.data["status"].status;
          let jobid = response.data["jobid"];
          if (josStatus === "finished") {
            if (dialogLoadingRef.current) {
              let newJob = {
                serverJobId: jobid,
                jobType: "BATCH_RETRIEVAL",
                jobTypeInternal: "BATCH_RETRIEVAL",
                status: "finished",
                result_count: response.data["status"].result_count,
                job: formObject,
                userfile: userfileb64
              };
              addJobToStore(newJob);
              showNotification("BATCH_RETRIEVAL_" + Date.now());
              setDialogLoading(false);
              navigate(routeConstants.jobStatus);
            } else {
              logActivity("user", "", "User canceled job. " + message);
            }
          } else if (josStatus === "running") {
            if (dialogLoadingRef.current) {
              let newJob = {
                serverJobId: jobid,
                jobType: "BATCH_RETRIEVAL",
                jobTypeInternal: "BATCH_RETRIEVAL",
                status: "running",
                job: formObject,
                userfile: userfileb64
              };

              addJobToStore(newJob);
              showNotification("BATCH_RETRIEVAL_" + Date.now());
              setDialogLoading(false);
              navigate(routeConstants.jobStatus);

            } else {
              logActivity("user", "", "User canceled job. " + message);
            }
          } else {
            let error = response.data["status"].error ? response.data["status"].error : "";
            logActivity("user", "", "No results. " + message + " " + error);
            setDialogLoading(false);
            setAlertTextInput({ "show": true, "id": stringConstants.errors.batchRetrievalError.id, custom: error });
            window.scrollTo(0, 0);
          }
        } else {
          let errorId = stringConstants.errors.batchRetrievalError.id;
          if (response.data) {
            errorId = response.data.error_list && response.data.error_list.length > 0 ? response.data.error_list[0].error_code : errorId;
          }
          logActivity("user", "", "No results. " + message);
          setDialogLoading(false);
          setAlertTextInput({ "show": true, "id": errorId });
          window.scrollTo(0, 0);
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setDialogLoading, setAlertDialogInput);
      });
  };


  function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        const base64Str = fileReader.result.split(',')[1];
        resolve(base64Str);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };

      fileReader.readAsDataURL(file);
    });
  }

  /**
   * Function to handle click event for blast search.
   **/
  const searchBatchRetrievalClick = () => {

    var tempArray = controlArray.slice();

    var tempArray1 = tempArray.sort(sortByOrder);
                    
    var tempArray2 = tempArray1.filter((query) => (query.value === "" && query.operationEnumValue !== "none") || query.error);
    if (tempArray2.length > 0) {
        let tempArray3 = controlArray.map((query) => {
            if (query.value === "" && query.operationEnumValue !== "none"){
                query.error = true;
            }
            return query;
        })
        setControlArray(tempArray3);
        setAlertTextInput({"show": true, "id": stringConstants.errors.superSearchError.id});
        return;
    }

    setDialogLoading(true);
    let columns = controlArray.map((obj) => {
      return {
        "id": obj.id,
        "label": obj.label,
        "filter_type": obj.operationEnumValue,
        "filter": obj.value !== undefined && obj.value !== "" ? obj.value : undefined,
        "output_type": obj.outputTypeValue,
        "order": obj.order
      }
    });
    
    if (batchRetrievalData.inputIdlist) {
      blastRetrievalSubmit("acclist", batchRetrievalData.inputNamespace, batchRetrievalData.inputIdlist, columns, undefined, undefined);
    } else {
      convertFileToBase64(fileInputRef.current.files[0])
        .then(base64Str => {
          blastRetrievalSubmit("file", batchRetrievalData.inputNamespace, undefined, columns, fileInputRef.current.files[0], base64Str);
        })
        .catch(error => {
        });
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        {getTitle("batchRetrieval")}
        {getMeta("batchRetrieval")}
      </Helmet>
      <FeedbackWidget />
      <div className="content-box-md">
        <div className="horizontal-heading text-center">
          <h5>{batchRetrieval.pageSubtitle}</h5>
          <h2>
            {batchRetrieval.pageTitle} <strong>{batchRetrieval.pageTitleBold}</strong>
          </h2>
        </div>
      </div>
      <Container className="id-mapping-content tab-bigscreen">
        <PageLoader pageLoading={pageLoading} />
        <DialogLoader
          show={dialogLoading}
          title={"Batch Retrieval"}
          setOpen={(input) => {
            setDialogLoading(input)
          }}
        />
        <DialogAlert
          alertInput={alertDialogInput}
          setOpen={(input) => {
            setAlertDialogInput({ show: input });
          }}
        />
        <TextAlert alertInput={alertTextInput} />

        {/* input_namespace ID Type */}
        <Grid container className="select-type">
          <Grid item size= {{ xs: 12, sm: 12, md: 12 }} className="pt-3">
            <FormControl
              fullWidth
              variant="outlined"
              error={isInputTouched.fromIdInput && !fromIdTypeValidated}
            >
              <Typography className={"search-lbl"} gutterBottom>
                <HelpTooltip
                  title={commonBatchRetrievalData.input_namespace.tooltip.title}
                  text={commonBatchRetrievalData.input_namespace.tooltip.text}
                />
                {commonBatchRetrievalData.input_namespace.name + " *"}
              </Typography>
              <SelectControl
                placeholder={batchRetrievalJSONData.input_namespace.placeholder}
                placeholderId={batchRetrievalJSONData.input_namespace.placeholderId}
                placeholderName={batchRetrievalJSONData.input_namespace.placeholderName}
                inputValue={batchRetrievalData.inputNamespace}
                setInputValue={inputNamespaceOnChange}
                onBlur={() => {
                  setInputTouched({ fromIdInput: true });
                }}
                sortFunction={sortDropdownIgnoreCase}
                menu={
                  !initData.input_namespaces ? [] :
                    [
                      ...Object.keys(initData.input_namespaces).map(
                        (fromId) => {
                          return {
                            id: fromId,
                            name: fromId,
                          };
                        }
                      ),
                    ]
                }
                required={true}
              />
            </FormControl>
            {isInputTouched.fromIdInput && !fromIdTypeValidated && (
              <FormHelperText className={"error-text"} error>
                {batchRetrievalJSONData.input_namespace.required}
              </FormHelperText>
            )}
          </Grid>

        </Grid>
        {/* Enter IDs */}
        <Grid item size= {{ xs: 12, sm: 12, md: 12 }} className="pt-3">
          <FormControl fullWidth variant="outlined">
            <Typography className={"search-lbl"} gutterBottom>
              <HelpTooltip
                title={commonBatchRetrievalData.input_idlist.tooltip.title}
                text={commonBatchRetrievalData.input_idlist.tooltip.text}
              />
              {commonBatchRetrievalData.input_idlist.name + " *"}
            </Typography>
            <OutlinedInput
              fullWidth
              multiline
              rows="6"
              required={true}
              placeholder={batchRetrievalJSONData.input_idlist.placeholder}
              value={batchRetrievalData.inputIdlist}
              onChange={inputIdlistOnChange}
              error={
                (isInputTouched.idListInput && !inputIdListValidated) ||
                batchRetrievalData.inputIdlist.length > batchRetrievalJSONData.input_idlist.length
              }
              onBlur={(e) => {
                setInputTouched({ idListInput: true });
              }}
            ></OutlinedInput>

            {batchRetrievalData.inputIdlist.length > batchRetrievalJSONData.input_idlist.length && (
              <FormHelperText className={"error-text"} error>
                {batchRetrievalJSONData.input_idlist.errorText}
              </FormHelperText>
            )}
            {isInputTouched.idListInput && !inputIdListValidated && (
              <FormHelperText className={"error-text"} error>
                {batchRetrievalJSONData.input_idlist.required}
              </FormHelperText>
            )}
            <ExampleExploreControl
              setInputValue={funcInputIdlistOnChange}
              inputValue={
                batchRetrievalData.recordType === "any" || batchRetrievalData.inputNamespace === "any"
                  ? []
                  : [
                    {
                      orderID: 100,
                      example: {
                        name: `Example for ${batchRetrievalData.inputNamespace}: `,
                        id: initData.input_namespaces[
                          batchRetrievalData.inputNamespace
                        ].example_id_list.join(", "),
                      },
                    },
                  ]
              }
            />
          </FormControl>
        </Grid>
        {/* File Upload */}
        <Grid className="pt-2">
          <Typography className="mb-1">
            <strong>OR</strong>
          </Typography>
          <Typography className="mb-1">
            <i>{batchRetrievalJSONData.file_upload.upload_text}</i>
          </Typography>
        </Grid>
        <form>
          <label>
            <input
              className="mt-2"
              type="file"
              ref={fileInputRef}
              onChange={fileOnChangeHandler}
              onBlur={() => {
                setInputTouched({ fileInput: true });
              }}
            />
          </label>
          <div className="output">
            {errorFileUpload && (
              <div className="error" style={{ color: "red" }}>
                {errorFileUpload}
              </div>
            )}
            {fileUploadForm && <div>{fileUploadForm.name}</div>}
          </div>
        </form>
        <Typography>
          <i>{batchRetrievalJSONData.file_upload.acceptedFileTypeText}</i>
        </Typography>
        <Typography>
          <i>{"Sample file: "}
            <Link
              to={"/downloads/sample/batch_retrieval_example.csv"}
              target="_blank"
              download
            >
              {"batch_retrieval_example.csv"}
            </Link>{"."}
          </i>
        </Typography>

        <Grid item size= {{ xs: 12, sm: 12, md: 12 }} className="pt-3">
          <FormControl fullWidth variant="outlined">
            <Typography className={"search-lbl"} gutterBottom>
              <HelpTooltip
                title={commonBatchRetrievalData.columns_result_table.tooltip.title}
                text={commonBatchRetrievalData.columns_result_table.tooltip.text}
              />
              {commonBatchRetrievalData.columns_result_table.name + " *"}
            </Typography>
            <CustomColumnsData columns={columnsData} saveColumnsToQuery={saveColumnsToQuery} categories={categoriesData} open={open} setOpen={setOpen} title={"Batch Retrieval Columns"} tableId={tableId} userSelectedColumns={userSelectedColumns} setUserSelectedColumns={setUserSelectedColumns} onClose={() => toggleDrawer(false)} />
            <div className="pb-3" >
              <Button onClick={() => toggleDrawer(true)} type="button" className="gg-btn-blue">Click To Select Columns</Button>
            </div>
          </FormControl>
        </Grid>

        <Grid item size= {{ xs: 12, sm: 12, md: 12 }} className1="pt-3">
          <FormControl fullWidth variant="outlined">
            <Typography className={"search-lbl"} gutterBottom>
              <HelpTooltip
                title={commonBatchRetrievalData.filters_selected_columns.tooltip.title}
                text={commonBatchRetrievalData.filters_selected_columns.tooltip.text}
              />
              {commonBatchRetrievalData.filters_selected_columns.name + " *"}
            </Typography>
            <div className1="pb-3" >
              <AccordionMUI disableGutters={true} key={"catDiv"}
                disabled={controlArray.length === 0}
                expanded={showCategories}
                onChange={(event, expanded) => handleCategories(controlArray.length === 0 ? false : !showCategories)}
              >
                <AccordionSummary
                  style={{ backgroundColor: "#f0f0f0", height: "50px" }}
                  expandIcon={<ExpandMoreIcon className="gg-blue-color" />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className="gg-blue-color">{"Click To Add Column Filters"}</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ paddingBottom: "0px" }}>
                  <div className="pt-2 pb-3" textAlign="center">
                    <Grid container justifyContent="center">
                      <Grid item size= {{ xs: 3.1, sm: 3.1, md: 3.1 }} style={{ paddingRight: "16px" }} >
                        <Typography className={"comp-search-label-header"} gutterBottom align="center">
                          Column Name
                        </Typography>
                      </Grid>
                      <Grid item size= {{ xs: 1.3, sm: 1.3, md: 1.3 }} style={{ paddingRight: "16px" }}>
                        <Typography className={"comp-search-label-header"} gutterBottom align="center">
                          Output
                        </Typography>
                      </Grid>
                      <Grid item size= {{ xs: 1.6, sm: 1.6, md: 1.6 }} style={{ paddingRight: "16px" }}>
                        <Typography className={"comp-search-label-header"} gutterBottom align="center">
                          Filter
                        </Typography>
                      </Grid>
                      <Grid item size= {{ xs: 3.1, sm: 3.1, md: 3.1 }} style={{ paddingRight: "16px" }}>
                        <Typography className={"comp-search-label-header"} gutterBottom align="center">
                          Filter Value
                        </Typography>
                      </Grid>
                      <Grid item size= {{ xs: 2.9, sm: 2.9, md: 2.9 }} style={{ paddingRight: "16px" }}>
                        <Typography className={"comp-search-label-header"} gutterBottom align="center">
                          Actions
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>

                  {controlArray.sort(sortByOrder).map((query, index, cntArr) =>
                    <BatchRetrievalInputcontrol
                      key={query.order}
                      query={query}
                      userSelectedColumns={userSelectedColumns}
                      setUserSelectedColumns={setUserSelectedColumns}
                      prevOrderId={index - 1 === -1 ? undefined : cntArr[index - 1].order}
                      nextOrderId={index + 1 === controlArray.length ? undefined : cntArr[index + 1].order}
                      batchRetrievalDeleteQuery={batchRetrievalDeleteQuery} batchRetrievalAddQuery={batchRetrievalAddQuery}
                      batchRetrievalMoveUpQuery={batchRetrievalMoveUpQuery} batchRetrievalMoveDownQuery={batchRetrievalMoveDownQuery}
                      batchRetrievalUpdateQuery={batchRetrievalUpdateQuery}
                      data={controlArray}
                    />)}
                </AccordionDetails>
              </AccordionMUI>
            </div>
          </FormControl>
        </Grid>

        {/*  Buttons */}
        <Grid item size = {{ xs: 12, sm: 12 }}>
          <div className="gg-align-center pt-5">
            <Button className="gg-btn-outline me-4" onClick={clearMapFields}>
              Clear Fields
            </Button>
            <Button
              className="gg-btn-blue"
              disabled={
                !(
                  fromIdTypeValidated &&
                  inputIdListValidated &&
                  fileUploadValidated
                ) || (controlArray.length === 0) || !controlArray.every(({ error }) => error === false) || batchRetrievalData.inputIdlist.length > batchRetrievalJSONData.input_idlist.length
              }
              onClick={searchBatchRetrievalClick}
            >
              Submit
            </Button>
          </div>
        </Grid>
        <Row>
          <Col>
            <p className="text-muted mt-2">
              <strong>*</strong> These fields are required.
            </p>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};
export default BatchRetrieval;
