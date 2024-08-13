import React, { useEffect, useState, useReducer, useRef } from "react";
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
import blastSearchData from "../data/json/isoformMapper";
import stringConstants from "../data/json/stringConstants";
import routeConstants from "../data/json/routeConstants";
import { getJobInit, postNewJob, getJobStatus, getJobDetails } from "../data/job";
import { getPageData } from "../data/api";
import ExampleExploreControl from "../components/example/ExampleExploreControl";
import ExampleControl2 from "../components/example/ExampleControl2";
import ExampleControl3 from "../components/example/ExampleControl3";
import proteinSearchData from '../data/json/proteinSearch';
import idMappingData from "../data/json/idMapping";
import plusIcon from "../images/icons/plus.svg";
import deleteIcon from "../images/icons/delete.svg";
import { Image } from "react-bootstrap";
import IsoformSearchInputcontrol from '../components/input/IsoformSearchInputcontrol';
import { Link } from "react-router-dom";

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

  const [blastError, setBlastError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      proSeqSearchDisabled: true,
      proSequenceInput: false,
    }
  );

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
      text: 'UniProtKB Accession *',
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
      text: 'Amino Acid Position *',
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
      text: 'Amino Acid',
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
      text: 'Amino Acid Position *',
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
      text: 'Amino Acid',
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

  const navigate = useNavigate();

  let commonBlastSearchData = stringConstants.blast_search.common;
  let blastJSONData = blastSearchData.blast_search;

  const fileOnChangeHandler = () => {
    const typesFileUpload = ["text/csv"];
    const fileElem = fileInputRef.current;

    if (fileElem.files.length > 0) {
      const file = fileElem.files[0];
      if (fileElem && typesFileUpload.includes(file.type)) {
        // setIdMapSearchData({ inputIdlist: "" });
        setFileUploadValidated(true);
        // setInputIdListValidated(true);
        // setErrorFileUpload("");
      } else {
        // setFileUploadForm(null);
        // setErrorFileUpload(idMappingData.file_upload.errorFileUpload);
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
    setBlastError({ proSequenceInput: false });
    setBlastError({ proSeqSearchDisabled: false });
  }

  /**
   * Function to handle onchange event for protein sequence.
   * @param {object} event - event object.
   **/
  const SequenceChange = (event) => {
    let proSequenceError = event.target.value.length < blastJSONData.seq.length;
    if (event.target.value.length === 0) {
      setInputValue({ proSequence: event.target.value });
      setBlastError({ proSequenceInput: false });
      setBlastError({ proSeqSearchDisabled: true });
    } else {
      setInputValue({ proSequence: event.target.value });
      if (!proSequenceError) {
        setBlastError({ proSequenceInput: proSequenceError });
      }
      setBlastError({ proSeqSearchDisabled: proSequenceError });
    }
  }

  /**
   * Function to handle onblur event for protein sequence.
   * @param {object} event - event object.
   **/
  const OnBlurSequenceChange = (event) => {
    let proSequenceError = event.target.value.length < blastJSONData.seq.length;
    if (event.target.value.length < blastJSONData.seq.length && event.target.value.length !== 0) {
      setBlastError({ proSequenceInput: proSequenceError });
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

    setBlastError({ proSequenceInput: false, proSeqSearchDisabled: true });

  };

  /**
* Function to set protein sequence value.
* @param {string} inputProSequence - input protein sequence value.
**/
  function mapFields(inputMapFields) {
    setData(inputMapFields);
    // setBlastError({ proSequenceInput: false });
    // setBlastError({ proSeqSearchDisabled: false });
  }

  /**
* Function to set protein sequence value.
* @param {string} inputProSequence - input protein sequence value.
**/
  function sequenceMapFields(inputSequenceMapFields) {
    setDataSequence(inputSequenceMapFields);
    // setBlastError({ proSequenceInput: false });
    // setBlastError({ proSeqSearchDisabled: false });
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

    setBlastError({ proSequenceInput: false, proSeqSearchDisabled: true });

  };


  /**
 * Function to clear all field values.
 **/
  const clearFileMapFields = () => {
    fileInputRef.current = ""
    setFileUploadValidated(false);
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
    // getJobInit()
    //   .then((response) => {
    //     let initData = response.data;
    //     setInitData(initData.blastp.paramlist);
    //     if (id === undefined) setPageLoading(false);
    //     id &&
    //     getJobDetails(id)
    //         .then(({ data }) => {
    //           logActivity("user", id, "Blast search modification initiated");
    //           setInputValue({
    //             proSequence:
    //               data.parameters.seq === undefined
    //                 ? ""
    //                 : data.parameters.seq,
    //             targetDatabase:
    //             data.parameters.targetdb === undefined
    //                 ? "canonicalsequences_all"
    //                 : data.parameters.targetdb,
    //             eValue:
    //             data.parameters.evalue === undefined
    //                 ? 0.001
    //                 : data.parameters.evalue,
    //             maxHits:
    //             data.parameters.num_alignments === undefined
    //                 ? 250
    //                 : data.parameters.num_alignments,
    //           });
    //           setBlastError({ proSequenceInput: false, proSeqSearchDisabled: false });
    //           setPageLoading(false);
    //         })
    //         .catch(function (error) {
    //           let message = "job details call";
    //           axiosError(error, "", message, setPageLoading, setAlertDialogInput);
    //         });
    //   })
    //   .catch(function (error) {
    //     let message = "job init api call";
    //     axiosError(error, "", message, setPageLoading, setAlertDialogInput);
    //   });
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
      [commonBlastSearchData.jobtype.id]: "isoform_mapper",
      "parameters": {},
    };

    if (type === "accession") {
      formJson["sequence"] = input_proSequence;
      formJson["intable"] = intable;
    } else if (type === "sequence") {
      formJson["sequence"] = input_proSequence;
      formJson["intable"] = intable;
    } else if (type === "file") {
      formJson["userfile"] = userfile;
    }

    return formJson;
  }

  /**
   * Function to handle blast search submit.
   **/
  const isoformSearchSubmit = (type, data, proSequence, userfile) => {

    let formObject = searchJson(
      type,
      data,
      proSequence,
      userfile
    );
    let message = "Isoform Search query=" + JSON.stringify(formObject);
    logActivity("user", id, "Performing Isoform Search." + message);

    postNewJob(formObject, { "userfile": userfile })
      .then((response) => {
        if (response.data["status"] && response.data["status"] !== {}) {
          let josStatus = response.data["status"].status;
          let jobid = response.data["jobid"];
          if (josStatus === "finished") {
            if (response.data["status"].result_count >= 0 && response.data["status"].result_count >= 0) {
              if (dialogLoadingRef.current) {
                logActivity("user", (id || "") + ">" + response.data["jobid"], message).finally(() => {
                  navigate(routeConstants.isoformMappingResult + response.data["jobid"]);
                });
                setDialogLoading(false);
              } else {
                logActivity("user", "", "User canceled job. " + message);
              }
            } else {
              logActivity("user", "", "No results. " + message);
              setDialogLoading(false);
              setAlertTextInput({ "show": true, "id": stringConstants.errors.blastSearchError.id });
              window.scrollTo(0, 0);
            }
          } else if (josStatus === "running") {
            if (dialogLoadingRef.current) {
              setTimeout((jobID) => {
                isoformSearchJobStatus(jobID);
              }, 2000, jobid);
            } else {
              logActivity("user", "", "User canceled job. " + message);
            }
          } else {
            let error = response.data["status"].error ? response.data["status"].error : "";
            logActivity("user", "", "No results. " + message + " " + error);
            setDialogLoading(false);
            setAlertTextInput({ "show": true, "id": stringConstants.errors.blastSearchError.id, custom: error });
            window.scrollTo(0, 0);
          }
        } else {
          logActivity("user", "", "No results. " + message);
          setDialogLoading(false);
          setAlertTextInput({ "show": true, "id": stringConstants.errors.blastSearchError.id });
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
    let message = "Blast Search query=" + JSON.stringify(jobID);
    getJobStatus(jobID)
      .then((response) => {
        if (response.data["status"] && response.data["status"] !== {}) {
          let josStatus = response.data["status"];
          if (josStatus === "finished") {
            if (response.data["result_count"] >= 0 && response.data["result_count"] >= 0) {
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
              setAlertTextInput({ "show": true, "id": stringConstants.errors.blastSearchError.id });
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
            setAlertTextInput({ "show": true, "id": stringConstants.errors.blastSearchError.id, custom: error });
            window.scrollTo(0, 0);
          }
        } else {
          logActivity("user", "", "No results. " + message);
          setDialogLoading(false);
          setAlertTextInput({ "show": true, "id": stringConstants.errors.blastSearchError.id });
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

  /**
* Function to handle click event for blast search.
**/
  const searchFileIsoformClick = () => {
    setDialogLoading(true);
    isoformSearchSubmit("file", undefined, undefined, fileInputRef.current.files[0]);
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
          <h5>{blastSearchData.pageSubtitle}</h5>
          <h2>
            {/* {blastSearchData.pageTitle} <strong>{blastSearchData.pageTitleBold}</strong>  */}
            {blastSearchData.pageTitle} <strong>{"Isoform Mapper"}</strong>
          </h2>
        </div>
      </div>
      <Container>
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
            <Container className='tab-content-border'>

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
                        data.some((obj) => obj.error)
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
                        title={initData && initData.length > 0 && initData.find((a) => a.id === blastJSONData.seq.id).label}
                        text={commonBlastSearchData.seq.tooltip.text}
                        urlText={commonBlastSearchData.seq.tooltip.urlText}
                        url={commonBlastSearchData.seq.tooltip.url}
                      />
                      {/* {initData && initData.length > 0 && initData.find((a) => a.id === blastJSONData.seq.id).label + " *"} */}
                      {"Enter Accession and Site Details" + " *"}
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
                    <div id={"isoform_table"}>
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
                            <div>{"Enter valid UniProtKB Accession, Amino Acid Position and Amino Acid values in highlighted rows."}</div>
                          </FormHelperText>
                        )}
                        <ExampleControl3
                          setInputValue={mapFields}
                          type={blastJSONData.accessionSiteDetails.exampleType}
                          exampleMap={blastJSONData.accessionSiteDetails.examples}
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
                        data.some((obj) => obj.error)
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
                        <strong>*</strong> These fields are required.
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
            <Container className='tab-content-border'>

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
                    {/* <i>{idMappingData.file_upload.upload_text}</i> */}
                    <i>{"Upload your own csv file with first line as header (one comma separated UniProtKB Accession *, Amino Acid Position * and Amino Acid per line)"}</i>
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
                    <i>{"Accepted File Type: .csv"}</i>
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
                        <strong>*</strong> These fields are required.
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
            <Container className='tab-content-border'>

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
                      disabled={blastError.proSequenceInput || inputValue.proSequence.trim() === "" || !dataSequence.some((obj) => obj.amino_acid !== "" || obj.amino_acid_position !== "") ||
                        dataSequence.some((obj) => obj.error)
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
                          title={"Protein Sequence"}
                          text={commonBlastSearchData.seq.tooltip.text}
                          urlText={commonBlastSearchData.seq.tooltip.urlText}
                          url={commonBlastSearchData.seq.tooltip.url}
                        />
                        {"Protein Sequence" + " *"}
                      </Typography>
                      <OutlinedInput
                        placeholder={blastJSONData.seq.placeholder}
                        margin='dense"'
                        multiline
                        rows={5}
                        value={inputValue.proSequence}
                        onChange={SequenceChange}
                        onBlur={OnBlurSequenceChange}
                        error={blastError.proSequenceInput}
                      />
                      {blastError.proSequenceInput && (
                        <FormHelperText className={"error-text"} error>
                          {blastJSONData.seq.errorText}
                        </FormHelperText>
                      )}
                      <ExampleControl2
                        setInputValue={proSequenceChange}
                        type={blastJSONData.seq.exampleType}
                        exampleMap={blastJSONData.seq.examples}
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
                          title={"Enter Site Details"}
                          text={commonBlastSearchData.seq.tooltip.text}
                          urlText={commonBlastSearchData.seq.tooltip.urlText}
                          url={commonBlastSearchData.seq.tooltip.url}
                        />
                        {"Enter Site Details" + " *"}
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

                      <div id={"isoform_sequence_table"}>
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
                              <div>{"Enter valid Amino Acid Position and Amino Acid values in highlighted rows."}</div>
                            </FormHelperText>
                          )}
                          <ExampleControl3
                            setInputValue={sequenceMapFields}
                            type={blastJSONData.siteDetails.exampleType}
                            exampleMap={blastJSONData.siteDetails.examples}
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
                      disabled={blastError.proSequenceInput || inputValue.proSequence.trim() === "" || !dataSequence.some((obj) => obj.amino_acid !== "" || obj.amino_acid_position !== "") ||
                        dataSequence.some((obj) => obj.error)
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
                        <strong>*</strong> These fields are required.
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
