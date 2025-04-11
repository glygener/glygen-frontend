import React, { useEffect, useState, useReducer, useRef, useContext } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import SelectControl from "../components/select/SelectControl";
import HelpTooltip from "../components/tooltip/HelpTooltip";
import PageLoader from "../components/load/PageLoader";
import DialogLoader from '../components/load/DialogLoader';
import DialogAlert from "../components/alert/DialogAlert";
import TextAlert from "../components/alert/TextAlert";
import ClientEditableTable from "../components/ClientEditableTable";
import "../css/Search.css";
import { logActivity } from "../data/logging";
import { axiosError } from "../data/axiosError";
import isoformSearchData from "../data/json/isoformMapper";
import stringConstants from "../data/json/stringConstants";
import routeConstants from "../data/json/routeConstants";
import { getJobInit, postNewJob, postNewJobWithTimeout, getJobStatus, getJobDetails } from "../data/job";
import { getPageData } from "../data/api";
import ExampleExploreControl from "../components/example/ExampleExploreControl";
import ExampleControl2 from "../components/example/ExampleControl2";
import ExampleControl3 from "../components/example/ExampleControl3";
import proteinSearchData from '../data/json/proteinSearch';
// import idMappingData from "../data/json/idMapping";
import plusIcon from "../images/icons/plus.svg";
import deleteIcon from "../images/icons/delete.svg";
import { Image } from "react-bootstrap";
import IsoformSearchInputcontrol from '../components/input/IsoformSearchInputcontrol';
import { Link } from "react-router-dom";
import { addJobToStore } from "../data/jobStoreApi"
import GlyGenNotificationContext from "../components/GlyGenNotificationContext.js";
import {
  UNIPROT_REST_BASENAME,
} from "../envVariables";
import { Padding } from "@mui/icons-material";

const tempData = [{
  id: 0,
  accession: '',
  site: ''
}, {
  id: 1,
  accession: '',
  site: ''
}];

/**
 * Glycan blast search control.
 **/
const IsoformMapping = (props) => {
  let { id } = useParams("");
  const [initData, setInitData] = useState([]);
  const [glyActTabKey, setGlyActTabKey] = useState('Accession-Site-Based');
  const amAcidPattern = /[^rhkdestnqcugpavilmfywoRHKDESTNQCUGPAVILMFYWO]/g;

  const [inputValue, setInputValue] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      proSequence: ""
    }
  );

  const [isoformError, setIsoformError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      proSeqSearchDisabled: true,
      proSequenceInput: false,
    }
  );
  const { showNotification } = useContext(GlyGenNotificationContext);
  const fileInputRef = useRef();
  const [pageLoading, setPageLoading] = React.useState(true);
  const [dialogLoading, setDialogLoading] = useState(false);
  const dialogLoadingRef = useRef(dialogLoading);
  dialogLoadingRef.current = dialogLoading;
  const [alertTextInput, setAlertTextInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "", custom: "" }
  );

  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const [fileUploadForm, setFileUploadForm] = useState(null);
  const [fileUploadValidated, setFileUploadValidated] = useState(false);
  const [errorFileUpload, setErrorFileUpload] = useState(null);
  const [updateTable, setUpdateTable] = useState(false);
  const [updateTableSequence, setUpdateTableSequence] = useState(false);
  const [dataSequence, setDataSequence] = useState([{
    id: 0,
    amino_acid_position: '',
    amino_acid: '',
    error: false
  }, {
    id: 1,
    amino_acid_position: '',
    amino_acid: '',
    error: false
  }]);
  const [data, setData] = useState([{
    id: 0,
    accession: '',
    amino_acid_position: '',
    amino_acid: '',
    error: false
  }, {
    id: 1,
    accession: '',
    amino_acid_position: '',
    amino_acid: '',
    error: false
  }]);

  const dataRef = useRef(data);
  dataRef.current = data;

  const dataSequenceRef = useRef(dataSequence);
  dataSequenceRef.current = dataSequence;

  const [isInputTouched, setInputTouched] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      recordTypeInput: false,
      fromIdInput: false,
      toIdInput: false,
      idListInput: false,
      fileInput: false,
    }
  );

  const navigate = useNavigate();

  let commonIsoformSearchData = stringConstants.isoform_search.common;
  let isoformJSONData = isoformSearchData.isoform_search;

  const rowStyle = (row, rowIndex) => {
    const style = {};
    if (row.error) {
      style.border = "2px solid var(--gg-red) !important";
    }

    return style;
  };

  function buttonDelete(cell, row, rowIndex) {
    return (
      <Button
        className='gg-btn-outline'
        // disabled = {rowIndex === 0}
        onClick={() => deleteTableEntry(row.id)}
      >
        <Image
          src={deleteIcon}
          alt="delete button"
        />
      </Button>
    );
  }

  function buttonSequenceDelete(cell, row, rowIndex) {
    return (
      <Button
        className='gg-btn-outline'
        // disabled = {rowIndex === 0}
        onClick={() => deleteSequenceTableEntry(row.id)}
      >
        <Image
          src={deleteIcon}
          alt="delete button"
        />
      </Button>
    );
  }

  const columns = [
    {
      dataField: 'id',
      text: 'Number',
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "5%"
        };
      },
      hidden: true
    },
    {
      dataField: 'accession',
      text: commonIsoformSearchData.uniprotkb_accession.name + " *",
      mode: 'select',
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "30%"
        };
      },
      editorClasses: (cell, row, rowIndex, colIndex) =>
        'editing-editor'
    }, {
      dataField: 'amino_acid_position',
      text: commonIsoformSearchData.amino_acid_position.name + " *",
      mode: 'input',
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "30%"
        };
      },
      editorClasses: (cell, row, rowIndex, colIndex) =>
        'editing-editor'
    }, {
      dataField: 'amino_acid',
      text: commonIsoformSearchData.amino_acid.name,
      mode: 'input',
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "30%"
        };
      },
      editorClasses: (cell, row, rowIndex, colIndex) =>
        'editing-editor'
    },
    {
      text: '',
      formatter: buttonDelete,
      editable: false
    }
  ];

  const columnsSequence = [
    {
      dataField: 'id',
      text: 'Number',
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "5%"
        };
      },
      hidden: true
    }, {
      dataField: 'amino_acid_position',
      text: commonIsoformSearchData.amino_acid_position.name + " *",
      mode: 'input',
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "45%"
        };
      },
      editorClasses: (cell, row, rowIndex, colIndex) =>
        'editing-editor'
    },
    {
      dataField: 'amino_acid',
      text: commonIsoformSearchData.amino_acid.name,
      mode: 'input',
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "45%"
        };
      },
      editorClasses: (cell, row, rowIndex, colIndex) =>
        'editing-editor'
    },
    {
      text: '',
      formatter: buttonSequenceDelete,
      editable: false
    }
  ];

  const fileOnChangeHandler = () => {
    const typesFileUpload = ["text/csv"];
    const fileElem = fileInputRef.current;

    if (fileElem.files.length > 0) {
      const file = fileElem.files[0];
      if (fileElem && typesFileUpload.includes(file.type)) {
        setFileUploadValidated(true);
        setErrorFileUpload("");
      } else {
        setFileUploadForm(null);
        setErrorFileUpload(isoformJSONData.file_upload.errorFileUpload);
        setFileUploadValidated(false);
      }
    }
  };

  /**
   * Function to set protein sequence value.
   * @param {string} inputProSequence - input protein sequence value.
   **/
  function proSequenceChange(inputProSequence) {
    setInputValue({ proSequence: inputProSequence });
    setIsoformError({ proSequenceInput: false });
    setIsoformError({ proSeqSearchDisabled: false });
  }

  /**
   * Function to handle onchange event for protein sequence.
   * @param {object} event - event object.
   **/
  const SequenceChange = (event) => {
    let proSequenceError = event.target.value.length < isoformJSONData.seq.length;
    if (event.target.value.length === 0) {
      setInputValue({ proSequence: event.target.value });
      setIsoformError({ proSequenceInput: false });
      setIsoformError({ proSeqSearchDisabled: true });
    } else {
      setInputValue({ proSequence: event.target.value });
      if (!proSequenceError) {
        setIsoformError({ proSequenceInput: proSequenceError });
      }
      setIsoformError({ proSeqSearchDisabled: proSequenceError });
    }
  }

  /**
   * Function to handle onblur event for protein sequence.
   * @param {object} event - event object.
   **/
  const OnBlurSequenceChange = (event) => {
    let proSequenceError = event.target.value.length < isoformJSONData.seq.length;
    if (event.target.value.length < isoformJSONData.seq.length && event.target.value.length !== 0) {
      setIsoformError({ proSequenceInput: proSequenceError });
    }
  }

  /**
   * Function to clear all field values.
   **/
  const clearMapFields = () => {
    setData([{
      id: 0,
      accession: '',
      amino_acid_position: '',
      amino_acid: ''
    }, {
      id: 1,
      accession: '',
      amino_acid_position: '',
      amino_acid: ''
    }]);

    setIsoformError({ proSequenceInput: false, proSeqSearchDisabled: true });

  };

  /**
* Function to set protein sequence value.
* @param {string} inputProSequence - input protein sequence value.
**/
  function mapFields(inputMapFields) {
    let temp = inputMapFields.map(obj => {return {...obj}})
    setData(temp);
  }

  /**
* Function to set protein sequence value.
* @param {string} inputProSequence - input protein sequence value.
**/
  function sequenceMapFields(inputSequenceMapFields) {
    let temp = inputSequenceMapFields.map(obj => {return {...obj}})
    setDataSequence(temp);
  }
  /**
* Function to clear all field values.
**/
  const clearSequenceMapFields = () => {
    setDataSequence([{
      id: 0,
      amino_acid_position: '',
      amino_acid: '',
    }, {
      id: 1,
      amino_acid_position: '',
      amino_acid: ''
    }]);

    setInputValue({
      proSequence: "",
    });

    setIsoformError({ proSequenceInput: false, proSeqSearchDisabled: true });

  };


  /**
 * Function to clear all field values.
 **/
  const clearFileMapFields = () => {
    fileInputRef.current.value = "";
    setFileUploadForm(null);
    setFileUploadValidated(false);
    setErrorFileUpload("");
  };

  /**
   * Function to delete table entry.
   * @param {number} id - id number.
   **/
  function deleteTableEntry(id) {
    dataRef.current = dataRef.current.filter(obj => obj.id !== id);
    dataRef.current.map((value, index, arr) => {
      if (value.id > id) {
        value.id = value.id - 1;
      }
      return value;
    })
    setData(dataRef.current);

    if (dataRef.current.length === 0) {
      clearMapFields();
    }
  }

  /**
 * Function to delete table entry.
 * @param {number} id - id number.
 **/
  function deleteSequenceTableEntry(id) {
    dataSequenceRef.current = dataSequenceRef.current.filter(obj => obj.id !== id);
    dataSequenceRef.current.map((value, index, arr) => {
      if (value.id > id) {
        value.id = value.id - 1;
      }
      return value;
    })
    setDataSequence(dataSequenceRef.current);

    if (dataSequenceRef.current.length === 0) {
      clearSequenceMapFields();
    }
  }

  /**
   * useEffect for retriving data from api and showing page loading effects.
   */
  useEffect(() => {
    setPageLoading(true);
    logActivity();
    document.addEventListener("click", () => {
      setAlertTextInput({ show: false });
    });
    setPageLoading(false);
        if (id === undefined) setPageLoading(false);
        id &&
        getJobDetails(id)
            .then(({ data }) => {
              logActivity("user", id, "Isoform Mapper search modification initiated");
              let query = data.query;
              if (query) {
                if (query.sequence) {
                  if (query.intable && query.intable.length > 0) {
                    let intable = query.intable.slice(1);
                    intable = intable.map(temp => { return {"amino_acid_position": temp[0], "amino_acid": temp[1]} })
                    setDataSequence(intable && intable.length > 0 ? intable : dataSequence);
                  }
                  setInputValue({ "proSequence" : (query.sequence ? query.sequence : "")});
                  setGlyActTabKey('Sequence-Site-Based');
                } else {
                  if (query.intable && query.intable.length > 0) {
                    let intable = query.intable.slice(1);
                    intable = intable.map(temp => { return {"accession" : temp[0], "amino_acid_position": temp[1], "amino_acid": temp[2]} })
                    setData(intable && intable.length > 0 ? intable : data);
                  }
                  setGlyActTabKey('Accession-Site-Based');
                }
              }
        
              setIsoformError({ proSequenceInput: false, proSeqSearchDisabled: false });
              setPageLoading(false);
            })
            .catch(function (error) {
              let message = "job details call";
              axiosError(error, "", message, setPageLoading, setAlertDialogInput);
            });
  }, [id]);

  /**
   * Function to return JSON query.
   * @param {string} input_data - input data.
   * @param {string} input_proSequence - protein sequence.
   **/
  function searchJson(
    type,
    input_data,
    input_proSequence,
    userfile
  ) {
    let tempArr = undefined;
    let intable = undefined;
    if (input_data) {
      intable = [];
      if (input_proSequence) {
        tempArr = input_data.map(temp => { return [temp.amino_acid_position + "", temp.amino_acid] }).filter(temp => temp[0] !== "")
        intable.push(["amino_acid_pos", "amino_acid"]);
      } else {
        tempArr = input_data.map(temp => { return [temp.accession, temp.amino_acid_position + "", temp.amino_acid] }).filter(temp => temp[0] !== "" && temp[1] !== "")
        intable.push(["isoform_ac", "amino_acid_pos", "amino_acid"]);
      }
      intable.push(...tempArr);
    }

    var formJson = {
      [commonIsoformSearchData.jobtype.id]: "isoform_mapper"
    };

    if (type === "accession") {
      formJson["intable"] = intable;
      formJson["parameters"] = JSON.stringify({});
    } else if (type === "sequence") {
      formJson["sequence"] = input_proSequence;
      formJson["intable"] = intable;
      formJson["parameters"] = JSON.stringify({});
    } 
    return formJson;
  }

  /**
   * Function to handle blast search submit.
   **/
  const isoformSearchSubmit = (type, data, proSequence, userfile, userfileb64) => {

    let formObject = searchJson(
      type,
      data,
      proSequence,
      userfile
    );
    let message = "Isoform Mapper Search query type=" + type;
    logActivity("user", id, "Performing Isoform Search." + message);

    let files = {"data": JSON.stringify(formObject)}
    postNewJob(formObject, userfile)
      .then((response) => {
        if (response.data["status"] && response.data["status"] !== {}) {
          let josStatus = response.data["status"].status;
          let jobid = response.data["jobid"];
          if (josStatus === "finished") {
            if (dialogLoadingRef.current) {
              let newJob = {
                serverJobId: jobid,
                jobType: "ISOFORM",
                jobTypeInternal: "ISOFORM_" + type.toUpperCase(),
                status: "finished",
                result_count: response.data["status"].result_count,
                job: formObject,
                userfile: userfileb64
              };
              addJobToStore(newJob);
              showNotification("ISOFORM_" + type.toUpperCase() + Date.now());
              setDialogLoading(false);
              navigate(routeConstants.jobStatus);
            } else {
                logActivity("user", "", "User canceled job. " + message);
            }
          } else if (josStatus === "running") {
            if (dialogLoadingRef.current) {
              let newJob = {
                serverJobId: jobid,
                jobType: "ISOFORM",
                jobTypeInternal: "ISOFORM_" + type.toUpperCase(),
                status: "running",
                job: formObject,
                userfile: userfileb64
              };

              addJobToStore(newJob);
              showNotification("ISOFORM_" + type.toUpperCase() + Date.now());
              setDialogLoading(false);
              navigate(routeConstants.jobStatus);

            } else {
              logActivity("user", "", "User canceled job. " + message);
            }
          } else {
            let error = response.data["status"].error ? response.data["status"].error : "";
            logActivity("user", "", "No results. " + message + " " + error);
            setDialogLoading(false);
            setAlertTextInput({ "show": true, "id": stringConstants.errors.isoformSearchError.id, custom: error });
            window.scrollTo(0, 0);
          }
        } else {
          let errorId = stringConstants.errors.isoformSearchError.id;
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


  /**
   * Function to handle blast search job status.
   * @param {string} jobID - job id.
   **/
  const isoformSearchJobStatus = (jobID) => {
    let message = "Isoform Mapper Search query=" + JSON.stringify(jobID);
    getJobStatus(jobID)
      .then((response) => {
        if (response.data["status"] && response.data["status"] !== {}) {
          let josStatus = response.data["status"];
          if (josStatus === "finished") {
            if (response.data["result_count"] && response.data["result_count"] > 0) {
              if (dialogLoadingRef.current) {
                logActivity("user", (id || "") + ">" + jobID, message).finally(() => {
                  navigate(routeConstants.isoformMappingResult + jobID);
                });
                setDialogLoading(false);
              } else {
                logActivity("user", "", "User canceled job. " + message);
              }
            } else {
              logActivity("user", "", "No results. " + message);
              setDialogLoading(false);
              setAlertTextInput({ "show": true, "id": stringConstants.errors.isoformSearchError.id });
              window.scrollTo(0, 0);
            }
          } else if (josStatus === "running") {
            if (dialogLoadingRef.current) {
              setTimeout((jobID) => {
                isoformSearchJobStatus(jobID);
              }, 2000, jobID);
            } else {
              logActivity("user", "", "User canceled job. " + message);
            }
          } else {
            let error = response.data["error"] ? response.data["error"] : "";
            logActivity("user", "", "No results. " + message + " " + error);
            setDialogLoading(false);
            setAlertTextInput({ "show": true, "id": stringConstants.errors.isoformSearchError.id, custom: error });
            window.scrollTo(0, 0);
          }
        } else {
          let errorId = stringConstants.errors.isoformSearchError.id;
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


  const validateIsoformSubmitData = (data) => {
    let ret = false;

    for (let i = 0; i < data.length; i++) {
      if (data[i].accession === "" && data[i].amino_acid === "" && data[i].amino_acid_position === "") {
        continue;
      }

      if (data[i].accession === "" || data[i].amino_acid_position === "") {
        data[i].error = true;
        ret = true;
      }

      if (!Number.isInteger(parseInt(data[i].amino_acid_position))) {
        data[i].error = true;
        ret = true;
      } else {
        data[i].amino_acid_position = parseInt(data[i].amino_acid_position);
      }

      if (data[i].amino_acid.length > 1) {
        data[i].error = true;
        ret = true;
      }

      if (data[i].amino_acid.length === 1 && (data[i].amino_acid.search(amAcidPattern, "") + 1) > 0) {
        data[i].error = true;
        ret = true;
      }
    }

    setData(data)
    return ret;
  };


  const validateColumnData = (columnId, value) => {
    if (columnId === "accession") {
      if (value === "") {
        return false;
      }
      return true;
    } else if (columnId === "amino_acid_position") {
      if (value === "") {
        return false;
      }
      if (!Number.isInteger(parseInt(value))) {
        return false;
      }
      return true;
    } else if (columnId === "amino_acid") {
      if (value === "") {
        return true;
      }
      if (value.length > 1) {
        return false;
      }
      if ((value.search(amAcidPattern, "") + 1) > 0) {
        return false;
      }
      return true;
    }

    return true;
  };


  /**
   * Function to handle click event for blast search.
   **/
  const searchIsoformClick = () => {
    if (validateIsoformSubmitData(dataRef.current))
      return;

    setDialogLoading(true);
    isoformSearchSubmit("accession", data);
  };

  const validateSequenceIsoformSubmitData = (data) => {

    let ret = false;

    for (let i = 0; i < data.length; i++) {
      if (data[i].amino_acid === "" && data[i].amino_acid_position === "") {
        continue;
      }

      if (data[i].amino_acid_position === "") {
        data[i].error = true;
        ret = true;
      }

      if (!Number.isInteger(parseInt(data[i].amino_acid_position))) {
        data[i].error = true;
        ret = true;
      } else {
        data[i].amino_acid_position = parseInt(data[i].amino_acid_position);
      }

      if (data[i].amino_acid.length > 1) {
        data[i].error = true;
        ret = true;
      }

      if (data[i].amino_acid.length === 1 && (data[i].amino_acid.search(amAcidPattern, "") + 1) > 0) {
        data[i].error = true;
        ret = true;
      }
    }

    setDataSequence(data)
    return ret;
  };

  /**
 * Function to handle click event for blast search.
 **/
  const searchSequenceIsoformClick = () => {
    if (validateSequenceIsoformSubmitData(dataSequence))
      return;

    setDialogLoading(true);
    isoformSearchSubmit("sequence", dataSequence, inputValue.proSequence);
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
  const searchFileIsoformClick = () => {
    setDialogLoading(true);

    convertFileToBase64(fileInputRef.current.files[0])
    .then(base64Str => {
      isoformSearchSubmit("file", undefined, undefined, fileInputRef.current.files[0], base64Str);
    })
    .catch(error => {
    });
  };


  // This is the function we wrote earlier
  async function copyTextFromClipboard() {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.readText();
    }
  }

  return (
    <React.Fragment>
      <Helmet>
        {getTitle("isoformMapper")}
        {getMeta("isoformMapper")}
      </Helmet>
      <div className="content-box-md">
        <div className="horizontal-heading text-center">
          <h5>{isoformSearchData.pageSubtitle}</h5>
          <h2>
            {isoformSearchData.pageTitle} <strong>{isoformSearchData.pageTitleBold}</strong> 
          </h2>
        </div>
      </div>
      <Container className="tab-bigscreen">
        <PageLoader pageLoading={pageLoading} />
        <DialogLoader
          show={dialogLoading}
          title={"Isoform Mapper"}
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
        {/* <TextAlert alertInput={alertTextInput} /> */}

        <Tabs
          defaultActiveKey='Accession-Site-Based'
          transition={false}
          activeKey={glyActTabKey}
          mountOnEnter={true}
          unmountOnExit={true}
          onSelect={(key) => setGlyActTabKey(key)}>
          <Tab
            eventKey='Accession-Site-Based'
            className='tab-content-padding'
            title={"Accession and Site based"}>
            <TextAlert
              alertInput={alertTextInput}
            />
            {/* <div style={{paddingBottom: "20px"}}></div> */}
            <Container className='tab-content-border tab-bigscreen'>

              {/* 1. Protein Sequence */}
              <Grid
                container
                style={{ margin: "0 0 0 -12px" }}
                spacing={3}
                justifyContent="center"
              >
                {/*  Buttons */}
                <Grid item xs={12} sm={10}>
                  <div className="gg-align-right pt-5">
                    <Button className="gg-btn-outline me-4" onClick={clearMapFields}>
                      Clear Fields
                    </Button>
                    <Button
                      className="gg-btn-blue"
                      disabled={!data.some((obj) => obj.accession !== "" || obj.amino_acid !== "" || obj.amino_acid_position !== "") ||
                        data.some((obj) => obj.error) ||
                        data.filter(dtTemp => dtTemp.accession !== "" || dtTemp.amino_acid_position !== "" || dtTemp.amino_acid !== "").length > 1000
                      }
                      onClick={searchIsoformClick}
                    >
                      Submit
                    </Button>
                  </div>
                </Grid>

                {data && <Grid item xs={12} sm={10}>
                  <FormControl
                    fullWidth
                    variant='outlined'
                  >
                    <Typography className={'search-lbl'} gutterBottom>
                      <HelpTooltip
                        title={commonIsoformSearchData.accessionSiteDetails.tooltip.title}
                        text={commonIsoformSearchData.accessionSiteDetails.tooltip.text}
                      />
                      {commonIsoformSearchData.accessionSiteDetails.name + " *"}
                    </Typography>
                    <div className="gg-align-right me-1">
                      <Button
                        className='gg-btn-outline me-4'
                        onClick={() => {
                          let dtTemp = dataRef.current;
                          let dt = [];
                          let k = 0;
                          for (let i = 0; i < dtTemp.length; i++) {
                            if (dtTemp[i].accession !== "" || dtTemp[i].amino_acid_position !== "" || dtTemp[i].amino_acid !== "") {
                              k = i;
                            }
                          }
                          for (let j = 0; j <= k; j++) {
                            if (k !== 0) {
                              dt.push({
                                id: j,
                                accession: dtTemp[j].accession,
                                amino_acid_position: dtTemp[j].amino_acid_position,
                                amino_acid: dtTemp[j].amino_acid
                              })
                            } else if (dtTemp[j].accession !== "" || dtTemp[j].amino_acid_position !== "" || dtTemp[j].amino_acid !== "") {
                              dt.push({
                                id: j,
                                accession: dtTemp[j].accession,
                                amino_acid_position: dtTemp[j].amino_acid_position,
                                amino_acid: dtTemp[j].amino_acid,
                              })
                            }
                          }
                          let len = dt.length;
                          let text = copyTextFromClipboard().then((response) => {
                            let lineArr = response.split(/\r?\n|\r|\n/g);
                            for (let i = 0; i < lineArr.length; i++) {
                              let lineS = lineArr[i].split(new RegExp("[,|\\s+|\t]"));
                              dt.push({
                                id: len,
                                accession: lineS[0] ? lineS[0] : '',
                                amino_acid_position: lineS[1] ? lineS[1] : '',
                                amino_acid: lineS[2] ? lineS[2] : ''
                              })
                              len = len + 1;
                            }
                            setData(dt)
                            setUpdateTable(!updateTable);
                          })
                        }
                        }
                      >
                        Import From Clipboard
                      </Button>

                      <Button
                        className='gg-btn-outline'
                        onClick={() => {
                          let dt = dataRef.current;
                          dt.push({
                            id: dt.length,
                            accession: '',
                            amino_acid_position: '',
                            amino_acid: ''
                          })
                          setData(dt)
                        }
                        }
                      >
                        <Image
                          src={plusIcon}
                          alt="plus button"
                        />
                      </Button>
                    </div>
                    <div style={{ marginTop: "16px" }} id={"isoform_table"}>
                      <div style={{ marginBottom: "-16px" }}>
                        {data.some((obj) => obj.error) && (
                          <FormHelperText className={"error-text"} error>
                            <div>{isoformJSONData.accessionSiteDetails.errorText}</div>
                          </FormHelperText>
                        )}
                        {data.filter(dtTemp => dtTemp.accession !== "" || dtTemp.amino_acid_position !== "" || dtTemp.amino_acid !== "").length > 1000 && (
                          <FormHelperText className={"error-text"} error>
                            <div>{isoformJSONData.accessionSiteDetails.errorText1}</div>
                          </FormHelperText>
                        )}
                      </div>
                      <ClientEditableTable
                        data={data}
                        errorColumns={["accession", "amino_acid_position", "amino_acid"]}
                        columns={columns}
                        idField={"index"}
                        updateTable={updateTable}
                        rowStyle={rowStyle}
                        validateColumnData={validateColumnData}
                      />
                      <div style={{ marginTop: "-16px" }}>
                        {data.some((obj) => obj.error) && (
                          <FormHelperText className={"error-text"} error>
                            <div>{isoformJSONData.accessionSiteDetails.errorText}</div>
                          </FormHelperText>
                        )}
                        {data.filter(dtTemp => dtTemp.accession !== "" || dtTemp.amino_acid_position !== "" || dtTemp.amino_acid !== "").length > 1000 && (
                          <FormHelperText className={"error-text"} error>
                            <div>{isoformJSONData.accessionSiteDetails.errorText1}</div>
                          </FormHelperText>
                        )}
                        <ExampleControl3
                          setInputValue={mapFields}
                          type={isoformJSONData.accessionSiteDetails.exampleType}
                          exampleMap={isoformJSONData.accessionSiteDetails.examples}
                        />
                      </div>
                    </div>
                  </FormControl>
                </Grid>}

                {/*  Buttons */}
                <Grid item xs={12} sm={10}>
                  <div className="gg-align-right pt-5">
                    <Button className="gg-btn-outline me-4" onClick={clearMapFields}>
                      Clear Fields
                    </Button>
                    <Button
                      className="gg-btn-blue"
                      disabled={!data.some((obj) => obj.accession !== "" || obj.amino_acid !== "" || obj.amino_acid_position !== "") ||
                        data.some((obj) => obj.error) ||
                        data.filter(dtTemp => dtTemp.accession !== "" || dtTemp.amino_acid_position !== "" || dtTemp.amino_acid !== "").length > 1000
                      }
                      onClick={searchIsoformClick}
                    >
                      Submit
                    </Button>
                  </div>
                  {/* </Grid> */}
                  <Row>
                    <Col>
                      <p className="text-muted mt-2">
                        <div><strong>*</strong>{isoformSearchData.infoText}</div>
                        <div><strong>*</strong>{isoformSearchData.infoText1}</div>
                      </p>
                    </Col>
                  </Row>
                </Grid>
              </Grid>

            </Container>
          </Tab>
          <Tab
            eventKey='File-Based'
            className='tab-content-padding'
            title={"File based"}>
            <TextAlert
              alertInput={alertTextInput}
            />
            <div style={{ paddingBottom: "20px" }}></div>
            <Container className='tab-content-border tab-bigscreen'>

              <Grid
                container
                style={{ margin: "0 0 0 -12px" }}
                spacing={3}
                // justifyContent="flex-start"
                justifyContent="center"
              >

                {/* File Upload */}
                <Grid item xs={12} sm={10} className="pt-5">
                  <Typography className="mb-1">
                    <i>{isoformJSONData.file_upload.upload_text}</i>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={10} className="pt-1">
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
                    <i>{isoformJSONData.file_upload.acceptedFileTypeText}</i>
                  </Typography>

                  <Typography>
                    <i>{"Sample file: "}
                      <Link
                        to={"/downloads/sample/isoform_mapper_example.csv"}
                        target="_blank"
                        download
                      >
                        {"isoform_mapper_example.csv"}
                      </Link>{"."}
                    </i>
                  </Typography>
                </Grid>


                {/*  Buttons */}
                <Grid item xs={12} sm={10}>
                  <div className="gg-align-right pt-5">
                    <Button className="gg-btn-outline me-4" onClick={clearFileMapFields}>
                      Clear Fields
                    </Button>
                    <Button
                      className="gg-btn-blue"
                      disabled={!fileUploadValidated
                      }
                      onClick={searchFileIsoformClick}
                    >
                      Submit
                    </Button>
                  </div>
                  {/* </Grid> */}
                  <Row>
                    <Col>
                      <p className="text-muted mt-2">
                        <div><strong>*</strong>{isoformSearchData.infoText}</div>
                        <div><strong>*</strong>{isoformSearchData.infoText1}</div>
                      </p>
                    </Col>
                  </Row>
                </Grid>
              </Grid>
            </Container>
          </Tab>
          <Tab
            eventKey='Sequence-Site-Based'
            title={"Sequence and Site based"}
            className='tab-content-padding'>
            <TextAlert
              alertInput={alertTextInput}
            />
            <Container className='tab-content-border tab-bigscreen'>

              <Grid
                container
                style={{ margin: "0 0 0 -12px" }}
                spacing={3}
                justifyContent="center"
              >
                {/*  Buttons */}
                <Grid item xs={12} sm={10}>
                  <div className="gg-align-right pt-5">
                    <Button className="gg-btn-outline me-4" onClick={clearSequenceMapFields}>
                      Clear Fields
                    </Button>
                    <Button
                      className="gg-btn-blue"
                      disabled={isoformError.proSequenceInput || inputValue.proSequence.trim() === "" || !dataSequence.some((obj) => obj.amino_acid !== "" || obj.amino_acid_position !== "") ||
                        dataSequence.some((obj) => obj.error) ||
                        dataSequence.filter(dtTemp => dtTemp.amino_acid_position !== "" || dtTemp.amino_acid !== "").length > 1000
                      }
                      onClick={searchSequenceIsoformClick}
                    >
                      Submit
                    </Button>
                  </div>
                </Grid>

                {data && <Grid item xs={12} sm={10}>

                  <Grid item className={'mb-3'}>
                    {/* 1. Protein Sequence */}
                    <FormControl
                      fullWidth
                      variant='outlined'
                    >
                      <Typography className={'search-lbl'} gutterBottom>
                        <HelpTooltip
                          title={commonIsoformSearchData.seq.tooltip.title}
                          text={commonIsoformSearchData.seq.tooltip.text}
                          urlText={commonIsoformSearchData.seq.tooltip.urlText}
                          url={commonIsoformSearchData.seq.tooltip.url}
                        />
                        {commonIsoformSearchData.seq.name + " *"}
                      </Typography>
                      <OutlinedInput
                        placeholder={isoformJSONData.seq.placeholder}
                        margin='dense"'
                        multiline
                        rows={5}
                        value={inputValue.proSequence}
                        onChange={SequenceChange}
                        onBlur={OnBlurSequenceChange}
                        error={isoformError.proSequenceInput}
                      />
                      {isoformError.proSequenceInput && (
                        <FormHelperText className={"error-text"} error>
                          {isoformJSONData.seq.errorText}
                        </FormHelperText>
                      )}
                      <ExampleControl2
                        setInputValue={proSequenceChange}
                        type={isoformJSONData.seq.exampleType}
                        exampleMap={isoformJSONData.seq.examples}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item>
                    <FormControl
                      fullWidth
                      variant='outlined'
                    >
                      <Typography className={'search-lbl'} gutterBottom>
                        <HelpTooltip
                        title={commonIsoformSearchData.siteDetails.tooltip.title}
                        text={commonIsoformSearchData.siteDetails.tooltip.text}
                      />
                      {commonIsoformSearchData.siteDetails.name + " *"}
                      </Typography>
                      <div className="gg-align-right me-1">
                        <Button
                          className='gg-btn-outline me-4'
                          onClick={() => {
                            let dtTemp = dataSequenceRef.current;
                            let dt = [];
                            let k = 0;
                            for (let i = 0; i < dtTemp.length; i++) {
                              if (dtTemp[i].amino_acid_position !== "" || dtTemp[i].amino_acid !== "") {
                                k = i;
                              }
                            }
                            for (let j = 0; j <= k; j++) {
                              if (k !== 0) {
                                dt.push({
                                  id: j,
                                  amino_acid_position: dtTemp[j].amino_acid_position,
                                  amino_acid: dtTemp[j].amino_acid
                                })
                              } else if (dtTemp[j].amino_acid_position !== "" || dtTemp[j].amino_acid !== "") {
                                dt.push({
                                  id: j,
                                  amino_acid_position: dtTemp[j].amino_acid_position,
                                  amino_acid: dtTemp[j].amino_acid,
                                })
                              }
                            }
                            let len = dt.length;
                            let text = copyTextFromClipboard().then((response) => {
                              let lineArr = response.split(/\r?\n|\r|\n/g);
                              for (let i = 0; i < lineArr.length; i++) {
                                let lineS = lineArr[i].split(new RegExp("[,|\\s+|\t]"));
                                dt.push({
                                  id: len,
                                  amino_acid_position: lineS[0] ? lineS[0] : '',
                                  amino_acid: lineS[1] ? lineS[1] : ''
                                })
                                len = len + 1;
                              }
                              setDataSequence(dt)
                              setUpdateTableSequence(!updateTableSequence);
                            })
                          }
                          }
                        >
                          Import From Clipboard
                        </Button>

                        <Button
                          className='gg-btn-outline'
                          onClick={() => {
                            let dt = dataSequenceRef.current;
                            dt.push({
                              id: dt.length,
                              amino_acid_position: '',
                              amino_acid: ''
                            })
                            setDataSequence(dt)
                          }
                          }
                        >
                          <Image
                            src={plusIcon}
                            alt="plus button"
                          />
                        </Button>
                      </div>

                      <div style={{ marginTop: "16px" }} id={"isoform_sequence_table"}>
                        <div style={{ marginBottom: "-16px" }}>
                          {dataSequence.some((obj) => obj.error) && (
                            <FormHelperText className={"error-text"} error>
                              <div>{isoformJSONData.siteDetails.errorText}</div>
                            </FormHelperText>
                          )}
                          {dataSequence.filter(dtTemp => dtTemp.amino_acid_position !== "" || dtTemp.amino_acid !== "").length > 1000 && (
                            <FormHelperText className={"error-text"} error>
                              <div>{isoformJSONData.siteDetails.errorText1}</div>
                            </FormHelperText>
                          )}
                        </div>
                        <ClientEditableTable
                          data={dataSequence}
                          columns={columnsSequence}
                          errorColumns={["amino_acid_position", "amino_acid"]}
                          idField={"id"}
                          updateTable={updateTableSequence}
                          rowStyle={rowStyle}
                          validateColumnData={validateColumnData}
                        />
                        <div style={{ marginTop: "-16px" }}>
                          {dataSequence.some((obj) => obj.error) && (
                            <FormHelperText className={"error-text"} error>
                              <div>{isoformJSONData.siteDetails.errorText}</div>
                            </FormHelperText>
                          )}
                          {dataSequence.filter(dtTemp => dtTemp.amino_acid_position !== "" || dtTemp.amino_acid !== "").length > 1000 && (
                            <FormHelperText className={"error-text"} error>
                              <div>{isoformJSONData.siteDetails.errorText1}</div>
                            </FormHelperText>
                          )}
                          <ExampleControl3
                            setInputValue={sequenceMapFields}
                            type={isoformJSONData.siteDetails.exampleType}
                            exampleMap={isoformJSONData.siteDetails.examples}
                          />
                        </div>
                      </div>
                    </FormControl>
                  </Grid>
                </Grid>}

                {/*  Buttons */}
                <Grid item xs={12} sm={10}>
                  <div className="gg-align-right pt-5">
                    <Button className="gg-btn-outline me-4" onClick={clearSequenceMapFields}>
                      Clear Fields
                    </Button>
                    <Button
                      className="gg-btn-blue"
                      disabled={isoformError.proSequenceInput || inputValue.proSequence.trim() === "" || !dataSequence.some((obj) => obj.amino_acid !== "" || obj.amino_acid_position !== "") ||
                        dataSequence.some((obj) => obj.error) ||
                        dataSequence.filter(dtTemp => dtTemp.amino_acid_position !== "" || dtTemp.amino_acid !== "").length > 1000
                      }
                      onClick={searchSequenceIsoformClick}
                    >
                      Submit
                    </Button>
                  </div>
                  {/* </Grid> */}
                  <Row>
                    <Col>
                      <p className="text-muted mt-2">
                        <div><strong>*</strong>{isoformSearchData.infoText}</div>
                        <div><strong>*</strong>{isoformSearchData.infoText1}</div>
                      </p>
                    </Col>
                  </Row>
                </Grid>
              </Grid>

            </Container>
          </Tab>
        </Tabs>
      </Container>
    </React.Fragment>
  );
};
export default IsoformMapping;
