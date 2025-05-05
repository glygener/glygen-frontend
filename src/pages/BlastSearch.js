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
import DialogLoader from '../components/load/DialogLoader';
import DialogAlert from "../components/alert/DialogAlert";
import TextAlert from "../components/alert/TextAlert";
import "../css/Search.css";
import { logActivity } from "../data/logging";
import { axiosError } from "../data/axiosError";
import blastSearchData from "../data/json/blastSearch";
import stringConstants from "../data/json/stringConstants";
import routeConstants from "../data/json/routeConstants";
import { getJobInit, postNewJob, postNewJobWithTimeout, getJobStatus, getJobDetails } from "../data/job";
import { getPageData } from "../data/api";
import ExampleExploreControl from "../components/example/ExampleExploreControl";
import ExampleControl2 from "../components/example/ExampleControl2";
import { addJobToStore } from "../data/jobStoreApi"
import GlyGenNotificationContext from "../components/GlyGenNotificationContext.js";
import {
  UNIPROT_REST_BASENAME,
} from "../envVariables";

/**
 * Glycan blast search control.
 **/
const BlastSearch = (props) => {
  let { id } = useParams("");
  const location = useLocation();
  const state  = location.state;

  const [initData, setInitData] = useState([]);
  const { showNotification } = useContext(GlyGenNotificationContext);

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
  const navigate = useNavigate();

  let commonBlastSearchData = stringConstants.blast_search.common;
  let blastJSONData = blastSearchData.blast_search;

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
  const retriveSequence = (inputProUniprotAcc) => {
    let proUniprotAcc = inputProUniprotAcc ? inputProUniprotAcc : inputValue.proUniprotAcc;

    let url = UNIPROT_REST_BASENAME + "uniprotkb/" + proUniprotAcc + ".fasta";
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
      logActivity("user", "", "No results. " + proUniprotAcc + message);
      setAlertTextInput({"show": true, "id": stringConstants.errors.blastSearchUniProtAccError.id});
      window.scrollTo(0, 0);
    });

  };

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
        let initData = response.data;
        setInitData(initData.blastp.paramlist);
        if (id === undefined) setPageLoading(false);
        id &&
        getJobDetails(id)
            .then(({ data }) => {
              logActivity("user", id, "Blast search modification initiated");
              setInputValue({
                proSequence:
                data.query === undefined || data.query.parameters.seq === undefined
                    ? ""
                    : data.query.parameters.seq,
                targetDatabase:
                data.query === undefined || data.query.parameters.targetdb === undefined
                    ? "canonicalsequences_all"
                    : data.query.parameters.targetdb,
                eValue:
                data.query === undefined || data.query.parameters.evalue === undefined
                    ? 0.001
                    : data.query.parameters.evalue,
                maxHits:
                data.query === undefined || data.query.parameters.num_alignments === undefined
                    ? 250
                    : data.query.parameters.num_alignments,
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


  // Use an effect to monitor the update to params
  useEffect(() => {
    if (state && state.selectedID) {
      proUniprotAccChange(state.selectedID);
      retriveSequence(state.selectedID);
    }
  }, [state]);

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
                  let newJob = {
                    serverJobId: jobid,
                    jobType: "BLAST",
                    jobTypeInternal: "BLAST",
                    status: "finished",
                    result_count: response.data["status"].result_count,
                    job: formObject
                  };
                  addJobToStore(newJob);
                  showNotification("Blast search");
                  setDialogLoading(false);
                  navigate(routeConstants.jobStatus);
                });
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
                let newJob = {
                  serverJobId: jobid,
                  jobType: "BLAST",
                  jobTypeInternal: "BLAST",
                  status: "running",
                  job: formObject
                };
                addJobToStore(newJob);
                showNotification("Blast search" + Date.now());
                setDialogLoading(false);
                navigate(routeConstants.jobStatus);
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
                  setDialogLoading(false);
                  navigate(routeConstants.blastResult + jobID);
                });
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
            {blastSearchData.pageTitle} <strong>{blastSearchData.pageTitleBold}</strong>
          </h2>
        </div>
      </div>
      <Container className="id-mapping-content tab-bigscreen">
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
        {/* 3 Threshold */}
        <Grid container className="select-type">
          {/* input_namespace From ID Type */}
          <Grid item xs={12} sm={12} md={9} className="pt-3">
            <FormControl
              fullWidth
              variant="outlined"
            >
              <Typography className={"search-lbl"} gutterBottom>
                <HelpTooltip
                  title={commonBlastSearchData.uniprot_canonical_ac.tooltip.title}
                  text={commonBlastSearchData.uniprot_canonical_ac.tooltip.text}
                />
                {commonBlastSearchData.uniprot_canonical_ac.name}
              </Typography>
              <OutlinedInput
                fullWidth
                margin='dense'
                classes={{
                  input: 'input-auto'
                }}
                value={inputValue.proUniprotAcc}
                placeholder={blastJSONData.uniprot_canonical_ac.placeholder}
                onChange={(event) => { proUniprotAccOnChange(event) }}
                />
              <ExampleExploreControl
                setInputValue={proUniprotAccChange}
                inputValue={blastJSONData.uniprot_canonical_ac.examples}
						  />
            </FormControl>
          </Grid>
          {/* output_namespace To ID Type */}
          <Grid item xs={12} sm={12} md={3} className="pt-3">
            <Typography className={"search-lbl"} gutterBottom>
              &nbsp;
            </Typography>
            <div className="gg-align-right">
              <Button className="gg-btn-blue ms-3 me-3" style={{padding : "9px 12px"}} onClick={() => retriveSequence()} disabled={inputValue.proUniprotAcc.trim().length <= 0}>
                Retrieve Sequence
              </Button>
            </div>
          </Grid>
        </Grid>
        {/* 1. Protein Sequence */}
				<Grid item  xs={12} sm={12} md={12}>
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

        {/* targetdb */}
        <Grid item xs={12} sm={12} md={12}>
          <FormControl
            fullWidth
            variant="outlined"
          >
            <Typography className={"search-lbl"} gutterBottom>
              <HelpTooltip
                title={initData && initData.length > 0 && initData.find((a) => a.id === blastJSONData.targetdb.id).label}
                text={commonBlastSearchData.targetdb.tooltip.text}
              />
              {initData && initData.length > 0 && initData.find((a) => a.id === blastJSONData.targetdb.id).label + " *"}
            </Typography>
            <SelectControl
              inputValue={inputValue.targetDatabase}
              setInputValue={targetDatabaseOnChange}
              menu={initData && initData.length > 0 && initData.find((a) => a.id === blastJSONData.targetdb.id).optlist.map(item => {return {name : item.label, id : item.value}})}
              required={true}
            />
          </FormControl>
        </Grid>
        {/* evalue */}
        <Grid container className="select-type">
          {/* input_namespace From ID Type */}
          <Grid item xs={12} sm={12} md={5} className="pt-3">
            <FormControl
              fullWidth
              variant="outlined"
            >
              <Typography className={"search-lbl"} gutterBottom>
                <HelpTooltip
                  title={initData && initData.length > 0 && initData.find((a) => a.id === blastJSONData.evalue.id).label}
                  text={commonBlastSearchData.evalue.tooltip.text}
                />
                {initData && initData.length > 0 && initData.find((a) => a.id === blastJSONData.evalue.id).label + " *"}
              </Typography>
              <OutlinedInput
                fullWidth
                margin='dense'
                value={inputValue.eValue}
                classes={{
                  input: 'input-auto'
                }}
                onChange={(event) => { eValueOnChange(event) }}
                onBlur={() =>{
                  let eValue = inputValue.eValue;
                  if (eValue !== ""){
                    eValue = Math.max(eValue, 0);
                    if (eValue === 0){
                      eValue = 0.0001;
                    }
                    setInputValue({ eValue: eValue });
                  } else {
                    setInputValue({ eValue: 0.0001 });
                  }
                }}
                inputProps={{
                  step: blastJSONData.evalue.step,
                  min: blastJSONData.evalue.min,
                  type: "number",
                }}
                />
            </FormControl>
          </Grid>
          {/* num_alignments */}
          <Grid item xs={12} sm={12} md={5} className="pt-3">
              <Typography className={"search-lbl"} gutterBottom>
                <HelpTooltip
                  title={commonBlastSearchData.num_alignments.tooltip.title}
                  text={commonBlastSearchData.num_alignments.tooltip.text}
                />
                {initData && initData.length > 0 && initData.find((a) => a.id === blastJSONData.num_alignments.id).label + " *"}
              </Typography>
              <OutlinedInput
                fullWidth
                margin='dense'
                value={inputValue.maxHits}
                classes={{
                  input: 'input-auto'
                }}
                onChange={(event) => {maxHitsOnChange(event)}}
                onBlur={() =>{
                  let maxHits = inputValue.maxHits;
                  if (maxHits !== "") {
                    maxHits = parseInt(maxHits);
                    maxHits = Math.max(maxHits, 0);
                    if (maxHits === 0 || isNaN(maxHits)){
                      maxHits = 250;
                    }
                    maxHits = Math.min(maxHits, blastJSONData.num_alignments.max);
                    setInputValue({ maxHits: maxHits });
                  } else {
                    setInputValue({ maxHits: 250 });
                  }
                }}
                inputProps={{
                  step: blastJSONData.num_alignments.step,
                  min: blastJSONData.num_alignments.min,
                  max: blastJSONData.num_alignments.max,
                  type: "number",
                }}
                />
          </Grid>
        </Grid>
        {/*  Buttons */}
        <Grid item xs={12} sm={12}>
          <div className="gg-align-center pt-5">
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
export default BlastSearch;
