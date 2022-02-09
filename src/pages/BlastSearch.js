import React, { useEffect, useState, useReducer, useRef } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import SelectControl from "../components/select/SelectControl";
import HelpTooltip from "../components/tooltip/HelpTooltip";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import TextAlert from "../components/alert/TextAlert";
import "../css/Search.css";
import { logActivity } from "../data/logging";
import { axiosError } from "../data/axiosError";
import idMappingData from "../data/json/idMapping";
import stringConstants from "../data/json/stringConstants";
import routeConstants from "../data/json/routeConstants";
import { getJobInit, postNewJob, getJobStatus, getJobDetails } from "../data/job";
import ExampleExploreControl from "../components/example/ExampleExploreControl";

import proteinSearchData from '../data/json/proteinSearch';
import { thresholdFreedmanDiaconis } from "d3";

const BlastSearch = (props) => {
  let { id } = useParams("");
  const [initData, setInitData] = useState([]);
  let advancedSearch = proteinSearchData.advanced_search;
  let commonProteinData = stringConstants.protein.common;

  const [inputValue, setInputValue] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      targetDatabase: "canonicalsequences_all",
      eValue: "10",
      maxHits: "250",
      proSequence: "",
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
  const [alertTextInput, setAlertTextInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  // let idMapData = stringConstants.id_mapping;
  let commonIdMappingData = stringConstants.id_mapping.common;

  /**
   * Function to set recordtype (molecule) name value.
   * @param {string} value - input recordtype (molecule) name value.
   **/
  const targetDatabaseOnChange = (value) => {
    setInputValue({ targetDatabase: value });
  };
  /**
   * Function to set inputNamespace (From ID Type) name value.
   * @param {string} value - input inputNamespace (From ID Type) name value.
   **/
  const eValueOnChange = (event) => {
    setInputValue({ eValue: event.target.value });
  };

  /**
   * Function to set outputNamespace (To ID Type) name value.
   * @param {string} value - input outputNamespace (To ID Type) name value.
   **/
  const maxHitsOnChange = (event) => {
    setInputValue({ maxHits: event.target.value });

  };

  /**
	 * Function to set protein or peptide sequence value.
	 * @param {string} inputProSequence - input protein or peptide sequence value.
	 **/
	function proSequenceChange(inputProSequence) {
    setInputValue({ proSequence: inputProSequence });
    setBlastError({ proSequenceInput: false });
    setBlastError({ proSeqSearchDisabled: false });
	}

	/**
	 * Function to handle onchange event for protein or peptide sequence.
	 * @param {object} event - event object.
	 **/
	const SequenceChange = (event) => {
		let proSequenceError = event.target.value.length < 20;
    if (event.target.value.length === 0) {
      setInputValue({ proSequence: event.target.value });
      setBlastError({ proSequenceInput: false });
      setBlastError({ proSeqSearchDisabled: true });
    } else {
      setInputValue({ proSequence: event.target.value });
      setBlastError({ proSequenceInput: proSequenceError });
      setBlastError({ proSeqSearchDisabled: proSequenceError });
    }
	}

  const clearMapFields = () => {
    setInputValue({
      targetDatabase: "canonicalsequences_all",
      eValue: "10",
      maxHits: "250",
      proSequence: "",
    });

    setBlastError({ proSequenceInput: false, proSeqSearchDisabled: true });

  };

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
              logActivity("user", id, "IdMapping modification initiated");
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
                    ? 10
                    : data.parameters.evalue,
                maxHits:
                data.parameters.max_target_seqs === undefined
                    ? 250
                    : data.parameters.max_target_seqs,
              });
              setBlastError({ proSequenceInput: false, proSeqSearchDisabled: false });
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

  function searchJson(
    input_proSequence,
    input_targetDatabase,
    input_eValue,
    input_maxHits
  ) {

      var formJson = {
          "jobtype": "blastp",
          "parameters": {
            "seq": input_proSequence,
            "targetdb": input_targetDatabase,
            "evalue": parseFloat(input_eValue),
            "max_target_seqs": parseInt(input_maxHits),
          }
    };

    return formJson;
  }

  const blastSearchSubmit = () => {

    let formObject = searchJson(
      inputValue.proSequence,
      inputValue.targetDatabase,
      inputValue.eValue,
      inputValue.maxHits
    );
    logActivity("user", id, "Performing Blast Search");
    let message = "Blast Search query=" + JSON.stringify(formObject);

      postNewJob(formObject)
      .then((response) => {
        if (response.data["status"] && response.data["status"] !== {}) {
          let josStatus = response.data["status"].status;
          let jobid = response.data["jobid"];
          if (josStatus === "finished") {
            setPageLoading(false);
            if (response.data["status"].result_count && response.data["status"].result_count > 0) {
              logActivity("user", (id || "") + ">" + response.data["jobid"], message).finally(() => {
                props.history.push(routeConstants.blastResult + response.data["jobid"]);
              });
            } else {
              logActivity("user", "", "No results. " + message);
              setPageLoading(false);
              setAlertTextInput({"show": true, "id": stringConstants.errors.blastSearchError.id})
              window.scrollTo(0, 0);
            }
          } else {
            setTimeout((jobID) => {
              blastSearchJobStatus(jobID);
          }, 2000, jobid);
          }
        }  else {
          logActivity("user", "", "No results. " + message);
          setPageLoading(false);
          setAlertTextInput({"show": true, "id": stringConstants.errors.blastSearchError.id})
          window.scrollTo(0, 0);
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  const blastSearchJobStatus = (jobID) => {

    logActivity("user", id, "Performing Blast Search");
    let message = "Blast Search query=" + JSON.stringify(jobID);
    getJobStatus(jobID)
      .then((response) => {
        if (response.data["status"] && response.data["status"] !== {}) {
          let josStatus = response.data["status"];
          if (josStatus === "finished") {
            setPageLoading(false);
            if (response.data["result_count"] && response.data["result_count"] > 0) {
              logActivity("user", (id || "") + ">" + jobID, message).finally(() => {
                props.history.push(routeConstants.blastResult + jobID);
              });
            } else {
              logActivity("user", "", "No results. " + message);
              setPageLoading(false);
              setAlertTextInput({"show": true, "id": stringConstants.errors.blastSearchError.id})
              window.scrollTo(0, 0);
            }
        } else {
            setTimeout((jobID) => {
              blastSearchJobStatus(jobID);
          }, 2000, jobID);
          } 
        }  else {
          logActivity("user", "", "No results. " + message);
          setPageLoading(false);
          setAlertTextInput({"show": true, "id": stringConstants.errors.blastSearchError.id})
          window.scrollTo(0, 0);
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  /**
   * Function to handle click event for blast search.
   **/
  const searchBlastClick = () => {
    setPageLoading(true);
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
          <h5>{idMappingData.pageSubtitle}</h5>
          <h2>
            {/* {idMappingData.pageTitle} <strong>{idMappingData.pageTitleBold}</strong> */}
            {idMappingData.pageTitle} <strong>{"Blast"}</strong>
          </h2>
        </div>
      </div>
      <Container className="id-mapping-content">
        <PageLoader pageLoading={pageLoading} />
        <DialogAlert
          alertInput={alertDialogInput}
          setOpen={(input) => {
            setAlertDialogInput({ show: input });
          }}
        />
        <TextAlert alertInput={alertTextInput} />

        {/* 1. Protein or Peptide Sequence */}
				<Grid item  xs={12} sm={12} md={12}>
					<FormControl
						fullWidth
						variant='outlined'
					>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                title={initData && initData.length > 0 && initData.find((a) => a.id === "seq").label}
                text={commonProteinData.sequence.tooltip.text}
                urlText={commonProteinData.sequence.tooltip.urlText}
                url={commonProteinData.sequence.tooltip.url}
              />
              {initData && initData.length > 0 && initData.find((a) => a.id === "seq").label + " *"}
						</Typography>
						<OutlinedInput
              placeholder={advancedSearch.sequence.placeholder}
							margin='dense"'
							multiline
							rows={5}
              value={inputValue.proSequence}
              onChange={SequenceChange}
              error={blastError.proSequenceInput}
						/>
						{blastError.proSequenceInput && (
							<FormHelperText className={"error-text"} error>
								{"Entry is too short - min length is 20."}
							</FormHelperText>
						)}
            <ExampleExploreControl
							setInputValue={proSequenceChange}
							inputValue={[
                {
                  "orderID": 100,
                  "example": {
                    "name": "Example",
                    "id": "MSIQENISSLQLRSWVSKSQ"
                  },
                  "explore": {
                    "id": "Peptide Sequence",
                    "url": "https://www.uniprot.org/help/sequences"
                  }
                }
              ]}
						/>
					</FormControl>
				</Grid>

        {/* 2 Threshold */}
        <Grid item xs={12} sm={12} md={12}>
          <FormControl
            fullWidth
            variant="outlined"
          >
            <Typography className={"search-lbl"} gutterBottom>
              <HelpTooltip
                // title={commonIdMappingData.recordtype.tooltip.title}
                title={initData && initData.length > 0 && initData.find((a) => a.id === "targetdb").label}
                text={commonIdMappingData.recordtype.tooltip.text}
              />
              {initData && initData.length > 0 && initData.find((a) => a.id === "targetdb").label}
              {/* {commonIdMappingData.recordtype.name} */}
            </Typography>
            <SelectControl
              inputValue={inputValue.targetDatabase}
              setInputValue={targetDatabaseOnChange}
              menu={initData && initData.length > 0 && initData.find((a) => a.id === "targetdb").optlist.map(item => {return {name : item.label, id : item.value}})
            }
              required={true}
            />
          </FormControl>
        </Grid>
        {/* 3 Threshold */}
        <Grid container className="select-type">
          {/* input_namespace From ID Type */}
          <Grid item xs={12} sm={12} md={5} className="pt-3">
            <FormControl
              fullWidth
              variant="outlined"
            >
              <Typography className={"search-lbl"} gutterBottom>
                <HelpTooltip
                  title={initData && initData.length > 0 && initData.find((a) => a.id === "evalue").label}
                  // title={commonIdMappingData.input_namespace.tooltip.title}
                  text={commonIdMappingData.input_namespace.tooltip.text}
                />
                {initData && initData.length > 0 && initData.find((a) => a.id === "evalue").label}
                {/* {commonIdMappingData.input_namespace.name} */}
              </Typography>
              <OutlinedInput
                fullWidth
                margin='dense'
                value={inputValue.eValue}
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
                  step: 0.0001,
                  // min: sitesData.patternPosition.min,
                  // max: sitesData.patternPosition.max,
                  min: 0.0001,
                  type: "number",
                }}
                />
            </FormControl>
          </Grid>
          {/* output_namespace To ID Type */}
          <Grid item xs={12} sm={12} md={5} className="pt-3">
              <Typography className={"search-lbl"} gutterBottom>
                <HelpTooltip
                    title={initData && initData.length > 0 && initData.find((a) => a.id === "max_target_seqs").label}
                  // title={commonIdMappingData.output_namespace.tooltip.title}
                  text={commonIdMappingData.output_namespace.tooltip.text}
                />
                {initData && initData.length > 0 && initData.find((a) => a.id === "max_target_seqs").label}
                {/* {commonIdMappingData.output_namespace.name} */}
              </Typography>
              <OutlinedInput
                fullWidth
                margin='dense'
                value={inputValue.maxHits}
                onChange={(event) => {maxHitsOnChange(event)}}
                onBlur={() =>{
                  let maxHits = inputValue.maxHits;
                  if (maxHits !== ""){
                    maxHits = parseInt(maxHits);
                    maxHits = Math.min(maxHits, 500);
                    maxHits = Math.max(maxHits, 1);
                    setInputValue({ maxHits: maxHits });
                  } else {
                    setInputValue({ maxHits: 1 });
                  }
                }}
                inputProps={{
                  step: 1,
                  // min: sitesData.patternPosition.min,
                  // max: sitesData.patternPosition.max,
                  min: 1,
                  max: 500,
                  type: "number",
                }}
                />
          </Grid>
        </Grid>
        {/*  Buttons */}
        <Grid item xs={12} sm={12}>
          <Row className="gg-align-center pt-5">
            <Button className="gg-btn-outline mr-4" onClick={clearMapFields}>
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
          </Row>
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
