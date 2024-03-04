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
import blastSearchData from "../data/json/blastSearch";
import stringConstants from "../data/json/stringConstants";
import routeConstants from "../data/json/routeConstants";
import { getJobInit, postNewJob, getJobStatus, getJobDetails } from "../data/job";
import { getPageData } from "../data/api";
import ExampleExploreControl from "../components/example/ExampleExploreControl";
import ExampleControl2 from "../components/example/ExampleControl2";
import proteinSearchData from '../data/json/proteinSearch';
import idMappingData from "../data/json/idMapping";
import plusIcon from "../images/icons/plus.svg";
import deleteIcon from "../images/icons/delete.svg";
import { Image } from "react-bootstrap";
import IsoformSearchInputcontrol from '../components/input/IsoformSearchInputcontrol';

import {
  UNIPROT_REST_BASENAME,
} from "../envVariables";

const tempData = [{
  id: 0,
  accession : '',
  site: ''
}, {
  id: 1,
  accession : '',
  site: ''
}];

/**
 * Glycan blast search control.
 **/
const IsoformMapper = (props) => {
  let { id } = useParams("");
  const [initData, setInitData] = useState([]);
	const [glyActTabKey, setGlyActTabKey] = useState('Simple-Search');

  const [inputValue, setInputValue] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      targetDatabase: "canonicalsequences_all",
      eValue: "0.001",
      maxHits: "250",
      proSequence: "",
      proUniprotAcc: "",
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
  const [errorFileUpload, setErrorFileUpload] = useState(null);
  const [updateTable, setUpdateTable] = useState(false);

  const [data, setData] = useState([{
    id: 0,
    accession : '',
    site: ''
  }, {
    id: 1,
    accession : '',
    site: ''
  }]);

  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
	}, [updateTable]);


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

  const [controlArray, setControlArray] = useState([
    {
        "order":0,
        "aggregator":"",
        "field":"",
        "fieldType":"",
        "operation":"",
        "value":"",
        "typeaheadID":"",
        "maxlength":100,
        "error":false,
        "operationEnum":[],
        "selectEnum":[]
    },
    {
      "order":1,
      "aggregator":"",
      "field":"",
      "fieldType":"",
      "operation":"",
      "value":"",
      "typeaheadID":"",
      "maxlength":100,
      "error":false,
      "operationEnum":[],
      "selectEnum":[]
  },
  
  ]);

  function buttonDelete(cell, row) {
    return (
      <Button
        className='gg-btn-outline' 
        disabled = {row.id === 0}
        onClick={() => deleteTableEntry(row.id)}
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
    text: 'UniProtKB Accession',
    mode: 'select',
    headerStyle: (colum, colIndex) => {
      return {
        backgroundColor: "#4B85B6",
        color: "white",
        width: "50%"
      };
    },
  }, {
    dataField: 'site',
    text: 'Site',
    mode: 'input',
    headerStyle: (colum, colIndex) => {
      return {
        backgroundColor: "#4B85B6",
        color: "white",
        width: "40%"
      };
    },
  }, {
    text: '',
    formatter: buttonDelete,
    editable: false
  }
];


  const navigate = useNavigate();

  let commonBlastSearchData = stringConstants.blast_search.common;
  let blastJSONData = blastSearchData.blast_search;

  const fileOnChangeHandler = () => {
    const typesFileUpload = ["text/plain"];
    const fileElem = fileInputRef.current;

    if (fileElem.files.length > 0) {
      const file = fileElem.files[0];
      if (fileElem && typesFileUpload.includes(file.type)) {
        // setIdMapSearchData({ inputIdlist: "" });
        // setFileUploadValidated(true);
        // setInputIdListValidated(true);
        // setErrorFileUpload("");
      } else {
        // setFileUploadForm(null);
        // setErrorFileUpload(idMappingData.file_upload.errorFileUpload);
        // setFileUploadValidated(false);
      }
    }
  };

  /**
   * Function to set target database name value.
   * @param {string} value - input target database name value.
   **/
  const targetDatabaseOnChange = (value) => {
    setInputValue({ targetDatabase: value });
  };

  /**
	 * Function to handle onchange event for eValue.
	 * @param {object} event - event object.
	 **/
  const eValueOnChange = (event) => {
    setInputValue({ eValue: event.target.value });
  };

  /**
	 * Function to handle onchange event for UniprotAcc.
	 * @param {object} event - event object.
	 **/
   const proUniprotAccOnChange = (event) => {
    setInputValue({ proUniprotAcc: event.target.value });
  };

  /**
	 * Function to set inputProUniprotAcc value.
	 * @param {string} inputProDiseaseName - input inputProUniprotAcc value.
	 **/
	function proUniprotAccChange(inputProUniprotAcc) {
    setInputValue({ proUniprotAcc: inputProUniprotAcc });
	}

  /**
	 * Function to handle onchange event for maxHits.
	 * @param {object} event - event object.
	 **/
  const maxHitsOnChange = (event) => {
    setInputValue({ maxHits: event.target.value });

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
      accession : '',
      site: ''
    }, {
      id: 1,
      accession : '',
      site: ''
    }]);

    setInputValue({
      targetDatabase: "canonicalsequences_all",
      eValue: "0.001",
      maxHits: "250",
      proSequence: "",
      proUniprotAcc: ""
    });

    setBlastError({ proSequenceInput: false, proSeqSearchDisabled: true });

  };

  /**
	 * Function to retrive protein sequence.
	 **/
  const retriveSequence = () => {
    let url = UNIPROT_REST_BASENAME + "uniprotkb/" + inputValue.proUniprotAcc + ".fasta";
    getPageData(url)
    .then((response) => {
      const blob    = new Blob([response.data], {type: "text/plain"});
      const reader = new FileReader();
      reader.readAsText(blob);
      reader.onload = (event) => {
        const text = reader.result;
        let seqArr = text.split("\n");
        seqArr.splice(0,1);
        let seqData = seqArr.join("");
        proSequenceChange(seqData);
      };
    })
    .catch(function (error) {
      let message = " - Failed to retrieve valid Protein Sequence.";
      logActivity("user", "", "No results. " + inputValue.proUniprotAcc + message);
      setAlertTextInput({"show": true, "id": stringConstants.errors.blastSearchUniProtAccError.id});
      window.scrollTo(0, 0);
    });

  };

  /**
	 * Function to delete query.
	 * @param {number} order - query order number.
	 **/
	function supSearchDeleteQuery(order) {
    var tempArray = controlArray.filter(query => query.order !== order);
    tempArray.map((value, index, arr) => {
        if (value.order > order) {
            value.order = value.order - 1;
        }
        return value;
    }) 
    setControlArray(tempArray);
}

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
}

/**
* Function to add query.
* @param {number} order - query order number.
**/
function supSearchAddQuery(order) {
    var tempArray = controlArray.slice();
    tempArray.map((value, index, arr) => {
        if (value.order >= order) {
            value.order = value.order + 1;
        }
        return value;
    }) 
    tempArray.push({
        order:order,
        aggregator:"",
        field:"",
        fieldType:"",
        operation:"",
        value:"",
        typeaheadID:"",
        maxlength:100,
        error:false,
        operationEnum:[],
        selectEnum:[]
    });
    setControlArray(tempArray);
}

    /**
	 * Function to update query data.
	 * @param {number} currOrder - current query order number.
     * @param {string} field - value type.
	 * @param {var} value - value of the field.
	 **/
    function supSearchUpdateQuery(currOrder, field, value) {
      var tempArray = controlArray.slice();
      var currQuery = tempArray.filter(query => query.order === currOrder)[0];

      var updatedArray = tempArray.filter(query => query.order !== currOrder);

      currQuery[field] = value;

      updatedArray.push(currQuery);

      setControlArray(updatedArray);
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
    getJobInit()
      .then((response) => {
        let initData = response.data;
        setInitData(initData.blastp.paramlist);
        if (id === undefined) setPageLoading(false);
        id &&
        getJobDetails(id)
            .then(({ data }) => {
              logActivity("user", id, "Blast search modification initiated");
              setInputValue({
                proSequence:
                  data.parameters.seq === undefined
                    ? ""
                    : data.parameters.seq,
                targetDatabase:
                data.parameters.targetdb === undefined
                    ? "canonicalsequences_all"
                    : data.parameters.targetdb,
                eValue:
                data.parameters.evalue === undefined
                    ? 0.001
                    : data.parameters.evalue,
                maxHits:
                data.parameters.num_alignments === undefined
                    ? 250
                    : data.parameters.num_alignments,
              });
              setBlastError({ proSequenceInput: false, proSeqSearchDisabled: false });
              setPageLoading(false);
            })
            .catch(function (error) {
              let message = "job details call";
              axiosError(error, "", message, setPageLoading, setAlertDialogInput);
            });
      })
      .catch(function (error) {
        let message = "job init api call";
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  }, [id]);

  /**
	 * Function to return JSON query.
   * @param {string} input_proSequence - protein sequence.
	 * @param {string} input_targetDatabase - target database.
	 * @param {string} input_eValue - E-value.
	 * @param {string} input_maxHits - Max number of hits.
	 **/
  function searchJson(
    input_proSequence,
    input_targetDatabase,
    input_eValue,
    input_maxHits
  ) {
    
      var formJson = {
          [commonBlastSearchData.jobtype.id]: "blastp",
          "parameters": {
            [commonBlastSearchData.seq.id]: input_proSequence,
            [commonBlastSearchData.targetdb.id]: input_targetDatabase,
            [commonBlastSearchData.evalue.id]: parseFloat(input_eValue),
            [commonBlastSearchData.num_alignments.id]: parseInt(input_maxHits),
          }
    };

    return formJson;
  }

  /**
	 * Function to handle blast search submit.
	 **/
  const blastSearchSubmit = () => {

    let formObject = searchJson(
      inputValue.proSequence,
      inputValue.targetDatabase,
      inputValue.eValue,
      inputValue.maxHits
    );
    let message = "Blast Search query=" + JSON.stringify(formObject);
    logActivity("user", id, "Performing Blast Search." + message);

      postNewJob(formObject)
      .then((response) => {
        if (response.data["status"] && response.data["status"] !== {}) {
          let josStatus = response.data["status"].status;
          let jobid = response.data["jobid"];
          if (josStatus === "finished") {
            if (response.data["status"].result_count && response.data["status"].result_count > 0) {
              if (dialogLoadingRef.current) {
                logActivity("user", (id || "") + ">" + response.data["jobid"], message).finally(() => {
                  navigate(routeConstants.blastResult + response.data["jobid"]);
                });
                setDialogLoading(false);
              } else {
                logActivity("user", "", "User canceled job. " + message);
              }
            } else {
              logActivity("user", "", "No results. " + message);
              setDialogLoading(false);
              setAlertTextInput({"show": true, "id": stringConstants.errors.blastSearchError.id});
              window.scrollTo(0, 0);
            }
          } else if (josStatus === "running") {
              if (dialogLoadingRef.current) {
                  setTimeout((jobID) => {
                    blastSearchJobStatus(jobID);
                }, 2000, jobid);
              } else {
                logActivity("user", "", "User canceled job. " + message);
              }
          } else {
            let error = response.data["status"].error ? response.data["status"].error : "";
            logActivity("user", "", "No results. " + message + " " + error);
            setDialogLoading(false);
            setAlertTextInput({"show": true, "id": stringConstants.errors.blastSearchError.id, custom : error});
            window.scrollTo(0, 0);
          }
        } else {
          logActivity("user", "", "No results. " + message);
          setDialogLoading(false);
          setAlertTextInput({"show": true, "id": stringConstants.errors.blastSearchError.id});
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
  const blastSearchJobStatus = (jobID) => {
    let message = "Blast Search query=" + JSON.stringify(jobID);
    getJobStatus(jobID)
      .then((response) => {
        if (response.data["status"] && response.data["status"] !== {}) {
          let josStatus = response.data["status"];
          if (josStatus === "finished") {
            if (response.data["result_count"] && response.data["result_count"] > 0) {
              if (dialogLoadingRef.current) {
                logActivity("user", (id || "") + ">" + jobID, message).finally(() => {
                  navigate(routeConstants.blastResult + jobID);
                });
                setDialogLoading(false);
              } else {
                logActivity("user", "", "User canceled job. " + message);
              }
            } else {
              logActivity("user", "", "No results. " + message);
              setDialogLoading(false);
              setAlertTextInput({"show": true, "id": stringConstants.errors.blastSearchError.id});
              window.scrollTo(0, 0);
            }
          } else if (josStatus === "running") {
            if (dialogLoadingRef.current) {
                setTimeout((jobID) => {
                  blastSearchJobStatus(jobID);
              }, 2000, jobID);
            } else {
              logActivity("user", "", "User canceled job. " + message);
            }
          } else {
            let error = response.data["error"] ? response.data["error"] : "";
            logActivity("user", "", "No results. " + message + " " + error);
            setDialogLoading(false);
            setAlertTextInput({"show": true, "id": stringConstants.errors.blastSearchError.id, custom : error});
            window.scrollTo(0, 0);
          }
        }  else {
          logActivity("user", "", "No results. " + message);
          setDialogLoading(false);
          setAlertTextInput({"show": true, "id": stringConstants.errors.blastSearchError.id});
          window.scrollTo(0, 0);
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setDialogLoading, setAlertDialogInput);
      });
  };

  /**
   * Function to handle click event for blast search.
   **/
  const searchBlastClick = () => {
    setDialogLoading(true);
    blastSearchSubmit();
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
        {getTitle("blastSearch")}
        {getMeta("blastSearch")}
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
          title={"Blast Search"}
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

        <Tabs
						defaultActiveKey='Advanced-Search'
						transition={false}
						activeKey={glyActTabKey}
						mountOnEnter={true}
						unmountOnExit={true}
						onSelect={(key) => setGlyActTabKey(key)}>
						<Tab
							eventKey='Simple-Search'
							className='tab-content-padding'
							title={"Accession and Site based"}>
							<TextAlert
								alertInput={alertTextInput}
							/>
							<div style={{paddingBottom: "20px"}}></div>
							<Container className='tab-content-border'>

      {/* 1. Protein Sequence */}
      <Grid
        container
        style={{ margin: "0 0 0 -12px" }}
        spacing={3}
        justifyContent="center"
      >
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
                let dt = dataRef.current;
                let len = dt.length;

                let text = copyTextFromClipboard().then((response) => {
                  let lineArr = response.split(/\r?\n|\r|\n/g);
                  for (let i = 0; i < lineArr.length; i++) {
                    let lineS = lineArr[i].split(new RegExp("[,|\\s+|\t]"));
                    dt.push({
                    id: len,
                    accession : lineS[0] ? lineS[0] : '',
                    site: lineS[1] ? lineS[1] : ''
                  })
                  len = len + 1;
                }

              })
              // setData([])
              setData(dt)
              setUpdateTable(!updateTable);

            }
            }
            >
              Import From Clipboard
              {/* <Image
								src={plusIcon}
								alt="plus button"
							/> */}
            </Button>

            <Button
              className='gg-btn-outline' 
              onClick={() => {
                let dt = dataRef.current;
                dt.push({
                id: dt.length,
                accession : '',
                site: ''
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

            <ClientEditableTable
              data={data}
              columns={columns}
              idField={"index"}
              updateTable={updateTable}
            />
						{blastError.proSequenceInput && (
							<FormHelperText className={"error-text"} error>
								{blastJSONData.seq.errorText}
							</FormHelperText>
						)}
					</FormControl>
				</Grid>}

        {/* <Grid container justifyContent="center" style={{ margin: "12px 0 12px -12px" }} spacing={2}>
        <Grid item xs={4} sm={4}  className={'me-3'}>
          <Typography className={"comp-search-label-header"} gutterBottom align="center">
          UniProtKB Accession
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4}>
          <Typography className={"comp-search-label-header"} gutterBottom align="center">
            Site
          </Typography>
        </Grid>
        <Grid item xs={2} sm={2} style1={{width: "240px"}}>
        </Grid>

          {controlArray.map((query, index, cntArr ) =>
              <IsoformSearchInputcontrol 
                  key={query.order}
                  query={query} 
                  prevOrderId={index - 1 === -1 ? undefined : cntArr[index - 1].order} 
                  nextOrderId={index + 1 === controlArray.length ? undefined : cntArr[index + 1].order}
                  supSearchDeleteQuery={supSearchDeleteQuery} 
                  supSearchAddQuery={supSearchAddQuery}
                  supSearchUpdateQuery={supSearchUpdateQuery}
                  data={props.data} selectedNode={props.selectedNode}
          />)}
        </Grid> */}



        {/*  Buttons */}
        <Grid item xs={12} sm={10}>
          <div className="gg-align-right pt-5">
            <Button className="gg-btn-outline me-4" onClick={clearMapFields}>
              Clear Fields
            </Button>
            <Button
              className="gg-btn-blue"
              disabled={
								!Object.keys(blastError).every(
									(err) => blastError[err] === false
								)
              }
              onClick={searchBlastClick}
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
							eventKey='Advanced-Search'
							className='tab-content-padding'
							title={"File based"}>
							<TextAlert
								alertInput={alertTextInput}
							/>
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
            <i>{"Upload your own text file (one comma separated Uniprot Accession and Site per line)" + " *"}</i>
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
          <i>{idMappingData.file_upload.acceptedFileTypeText}</i>
        </Typography>
        </Grid>


       {/*  Buttons */}
       <Grid item xs={12} sm={10}>
          <div className="gg-align-right pt-5">
            <Button className="gg-btn-outline me-4" onClick={clearMapFields}>
              Clear Fields
            </Button>
            <Button
              className="gg-btn-blue"
              disabled={
								!Object.keys(blastError).every(
									(err) => blastError[err] === false
								)
              }
              onClick={searchBlastClick}
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
							eventKey='Composition-Search'
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

        {/* <Grid container className="select-type"> */}
          {/* input_namespace From ID Type */}
          <Grid  item xs={12} sm={10} className="pt-3">
            <FormControl
              fullWidth
              variant="outlined"
            >
              <Typography className={"search-lbl"} gutterBottom>
                <HelpTooltip
                  title={commonBlastSearchData.uniprot_canonical_ac.tooltip.title}
                  text={commonBlastSearchData.uniprot_canonical_ac.tooltip.text}
                />
                {/* {commonBlastSearchData.uniprot_canonical_ac.name} */}
                {"Site" + " *"}
              </Typography>
              <OutlinedInput
                fullWidth
                margin='dense'
                classes={{
                  input: 'input-auto'
                }}
                value={inputValue.proUniprotAcc}
                // placeholder={blastJSONData.uniprot_canonical_ac.placeholder}
                placeholder={"Enter a Site"}
                onChange={(event) => { proUniprotAccOnChange(event) }}
                />
              <ExampleExploreControl
                setInputValue={proUniprotAccChange}
                // inputValue={blastJSONData.uniprot_canonical_ac.examples}
                inputValue={[
                  {
                    "orderID": 100,
                    "example": {
                      "name": "Example",
                      "id": "222"
                    }
                  }
                ]}
						  />
            </FormControl>
          </Grid>
        {/* </Grid> */}
        {/* 1. Protein Sequence */}
				<Grid  item xs={12} sm={10}>
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
              {initData && initData.length > 0 && initData.find((a) => a.id === blastJSONData.seq.id).label + " *"}
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


     {/*  Buttons */}
     <Grid item xs={12} sm={10}>
          <div className="gg-align-right pt-5">
            <Button className="gg-btn-outline me-4" onClick={clearMapFields}>
              Clear Fields
            </Button>
            <Button
              className="gg-btn-blue"
              disabled={
								!Object.keys(blastError).every(
									(err) => blastError[err] === false
								)
              }
              onClick={searchBlastClick}
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
export default IsoformMapper;
