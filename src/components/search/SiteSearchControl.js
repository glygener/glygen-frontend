import React, { useState, useEffect, useReducer } from "react";
import MultilineAutoTextInput from "../input/MultilineAutoTextInput";
import AutoTextInput from "../input/AutoTextInput";
import DialogAlert from "../alert/DialogAlert";
import SelectControl from "../select/SelectControl";
import HelpTooltip from "../tooltip/HelpTooltip";
import ExampleExploreControl from "../example/ExampleExploreControl";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";
import PropTypes from "prop-types";
import { Row } from "react-bootstrap";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormControl from "@material-ui/core/FormControl";
import Button from "react-bootstrap/Button";
import { sortDropdown } from "../../utils/common";
import "../../css/Search.css";
import MultiselectTextInput from "../input/MultiselectTextInput";
import siteData from "../../data/json/siteData";
import stringConstants from "../../data/json/stringConstants";
import { InputLabel, Radio } from "@material-ui/core";
import { grid, positions } from "@material-ui/system";
import { getSiteSearch, getSiteSearchInit } from "../../data/supersearch";
import proteinSearchData from "../../data/json/proteinSearch";
import * as routeConstants from "../../data/json/routeConstants";
import { logActivity } from "../../data/logging";
import { axiosError } from "../../data/axiosError";
import { getTitle, getMeta } from "../../utils/head";
import PageLoader from "../load/PageLoader";
import FeedbackWidget from "../FeedbackWidget";
import TextAlert from "../alert/TextAlert";
const commonProteinData = stringConstants.protein.common;
const sitesData = siteData.site_search;
let advancedSearch = proteinSearchData.advanced_search;
let siteListRoute = routeConstants.siteList;
/**
 * Protein advanced search control.
 */
const SiteSearchControl = props => {
  const { defaults } = props;
  const [initData, setInitData] = useState(null);
  const [position, setPosition] = useState("");
  const [minRange, setMinRange] = useState("");
  const [maxRange, setMaxRange] = useState("");
  const [proteinId, setproteinId] = useState("");
  const [aminoType, setAminoType] = useState("");
  const [annotationOperation, setAnnotationOperation] = useState("$and");
  const [annotations, setAnnotations] = useState([]);
  const [queryObject, setQueryObject] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [alertTextInput, setAlertTextInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const proteinStrings = stringConstants.protein.common;

  useEffect(() => {
    setPageLoading(true);
    document.addEventListener('click', () => {
			setAlertTextInput({"show": false})
		});
    logActivity();
    setAlertTextInput({ show: false });
    getSiteSearchInit().then(response => {
      setInitData(response.data);
      setPageLoading(false);
    });
  }, []);

  useEffect(() => {
    if (defaults.proteinId) {
      setproteinId(defaults.proteinId.join(","));
    }
    if (defaults.annotations) {
      const anno = initData.annotation_type_list.filter(annotation => {
        return defaults.annotations.includes(annotation.id);
      });

      setAnnotations(
        anno.map(x => ({
          ...x,
          name: x.label
        }))
      );
    }
    if (defaults.aminoType) {
      setAminoType(defaults.aminoType);
    }
    if (defaults.min) {
      setMinRange(defaults.min);
    }
    if (defaults.max) {
      setMaxRange(defaults.max);
    }
    if (defaults.position) {
      setPosition(defaults.position);
    }
    if (defaults.annotationOperation) {
      setAnnotationOperation(defaults.annotationOperation);
    }
    console.log("defaults", defaults);
  }, [initData, defaults]);

  // const validateMinRange = (minRange) => true;

  // const minRangeError = validateMinRange(minRange)

  useEffect(() => {
    setPageLoading(false);
    setQueryObject({
      proteinId,
      aminoType,
      annotations,
      annotationOperation,
      position,
      minRange,
      maxRange
    });
  }, [
    proteinId,
    aminoType,
    annotations,
    annotationOperation,
    position,
    minRange,
    maxRange
  ]);

  /**
   * Function to clear input field values.
   **/
  const clearSite = () => {
    setAlertTextInput({ show: false });
    setproteinId("");
    setMinRange("");
    setPosition("");
    setMaxRange("");
    setAnnotations([]);
    setAminoType("");
    setAnnotationOperation("$and");
  };

  const handlePositionChange = event => {
    setPosition(event.target.value);
    setMinRange("");
    setMaxRange("");
  };

  const handleMinRangeChange = event => {
    setMinRange(event.target.value);
    setPosition("");
  };

  const handleMaxRangeChange = event => {
    setMaxRange(event.target.value);
    setPosition("");
  };

  const handleSearch = () => {
    setPageLoading(true);
    logActivity("user", "Performing Site Search");
    let message = "Site Search query=" + JSON.stringify(queryObject);
    console.log(message);

    getSiteSearch({
      ...queryObject,
      proteinId: queryObject.proteinId.split(",").filter(x => x !== ""),
      aminoType: queryObject.aminoType,
      annotations: queryObject.annotations.map(x => x.id.toLowerCase())
    })
      .then((response) => {
        let listId = undefined;
        
        if (response.data && response.data.results_summary && response.data.results_summary.site && response.data.results_summary.site.list_id)
          listId = response.data.results_summary.site.list_id;

        if (listId) {
          window.location = siteListRoute + listId;
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
      <Grid
        container
        style={{ margin: "0  auto" }}
        spacing={3}
        justify="center"
      >
        <PageLoader pageLoading={pageLoading} />
        <DialogAlert
						alertInput={alertDialogInput}
						setOpen={(input) => {
							setAlertDialogInput({"show": input})
						}}
					/>					

        <Grid item xs={12} sm={10}>
          <TextAlert alertInput={alertTextInput} /> 
        </Grid>

        {initData && (
          <>
            {/* Buttons Top */}
            <Grid item xs={12} sm={10}>
              <Row className="gg-align-right pt-2 pb-2 mr-1">
                <Button className="gg-btn-outline mr-4" onClick={clearSite}>
                  Clear Fields
                </Button>
                <Button
                  className="gg-btn-blue"
                  onClick={handleSearch}
                  // disabled={!SiteSearchValError.every(err => err === false)}
                >
                  Search Protein Site
                </Button>
              </Row>
            </Grid>
            {/* <Grid item>
          <pre>{JSON.stringify(defaults)}</pre>
        </Grid> */}

            {/* <Grid item xs={12} sm={10}>
              <FormControl fullWidth variant="outlined">
                <Typography className={"search-lbl"} gutterBottom>
                  <HelpTooltip
                    title={commonProteinData.uniprot_canonical_ac.tooltip.title}
                    text={commonProteinData.uniprot_canonical_ac.tooltip.text}
                    urlText={
                      commonProteinData.uniprot_canonical_ac.tooltip.urlText
                    }
                    url={commonProteinData.uniprot_canonical_ac.tooltip.url}
                  />
                  {commonProteinData.uniprot_canonical_ac.name}
                </Typography>
                <MultilineAutoTextInput
                  fullWidth
                  inputValue={proteinId}
                  setInputValue={setproteinId}
                  placeholder={sitesData.uniprot_canonical_ac.placeholder}
                  typeahedID={sitesData.uniprot_canonical_ac.typeahedID}
                  length={sitesData.uniprot_canonical_ac.length}
                  errorText={sitesData.uniprot_canonical_ac.errorText}
                />
                <ExampleExploreControl
                  setInputValue={setproteinId}
                  inputValue={advancedSearch.uniprot_canonical_ac.examples}
                />
              </FormControl>
            </Grid> */}
            {/* Amino Acid */}
            <Grid item xs={12} sm={10}>
              <FormControl fullWidth variant="outlined">
                <Typography className={"search-lbl"} gutterBottom>
                  <HelpTooltip
                    title={commonProteinData.glycosylated_aa.tooltip.title}
                    text={commonProteinData.glycosylated_aa.tooltip.text}
                  />
                  {proteinStrings.glycosylated_aa.site_form}
                </Typography>
                <SelectControl
                  inputValue={aminoType}
                  placeholder={sitesData.amino_type.placeholder}
                  placeholderId={sitesData.amino_type.placeholderId}
                  placeholderName={sitesData.amino_type.placeholderName}
                  menu={initData.aa_type_list
                    .map(a => ({
                      ...a,
                      name: a.label
                        .split(" - ")
                        .reverse()
                        .join(" - ")
                    }))
                    .sort(sortDropdown)}
                  setInputValue={setAminoType}
                />
              </FormControl>
            </Grid>

            {/* annotation */}
            <Grid item xs={12} sm={10}>
              <FormControl fullWidth>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={9} sm={9}>
                    <Typography className={"search-lbl"} gutterBottom>
                      <HelpTooltip
                        title={commonProteinData.annotation.tooltip.title}
                        text={commonProteinData.annotation.tooltip.text}
                      />
                      {proteinStrings.annotation_type.name}
                    </Typography>
                    <MultiselectTextInput
                      inputValue={annotations}
                      placeholder={sitesData.annotation.placeholder}
                      placeholderId={sitesData.annotation.placeholderId}
                      placeholderName={sitesData.annotation.placeholderName}
                      options={initData.annotation_type_list
                        .map(a => ({
                          ...a,
                          name: a.label
                        }))

                        .sort(sortDropdown)}
                      setInputValue={setAnnotations}
                    ></MultiselectTextInput>
                  </Grid>
                  <Grid item xs={3} sm={3}>
                    <Typography className={"search-lbl"} gutterBottom>
                      &nbsp;
                    </Typography>
                    <FormControl fullWidth variant="outlined">
                      <SelectControl
                        inputValue={annotationOperation}
                        menu={advancedSearch.aa_listforsite.operations}
                        setInputValue={setAnnotationOperation}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>

            {/* Position */}
            <Grid item xs={12} sm={10}>
              <FormControl fullWidth>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6} sm={6}>
                    <Typography className={"search-lbl"} gutterBottom>
                      <HelpTooltip
                        title={commonProteinData.site_range.tooltip.title}
                        text={commonProteinData.site_range.tooltip.text}
                      />
                      {commonProteinData.site_range.tooltip.title}
                    </Typography>

                    <FormControl fullWidth variant="outlined">
                      <InputLabel className={"select-lbl-inline"}>
                        Min
                      </InputLabel>
                      <OutlinedInput
                        className={props.inputClass}
                        value={minRange}
                        margin="dense"
                        onChange={handleMinRangeChange}
                        labelWidth={40}
                        inputProps={{
                          min: props.min,
                          max: props.max
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={6} sm={6}>
                    <Typography className={"search-lbl"} gutterBottom>
                      &nbsp;
                    </Typography>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel className={"select-lbl-inline"}>
                        Max
                      </InputLabel>
                      <OutlinedInput
                        className={props.inputClass}
                        value={maxRange}
                        margin="dense"
                        onChange={handleMaxRangeChange}
                        labelWidth={40}
                        inputProps={{
                          min: props.min,
                          max: props.max
                        }}
                        // disabled={positionOrRange !== "range"}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>

            {/* Buttons Buttom */}
            <Grid item xs={12} sm={10}>
              <Row className="gg-align-right pt-3 mb-2 mr-1">
                <Button className="gg-btn-outline mr-4" onClick={clearSite}>
                  Clear Fields
                </Button>
                <Button className="gg-btn-blue" onClick={handleSearch}>
                  Search Protein Site
                </Button>
              </Row>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default SiteSearchControl;

SiteSearchControl.propTypes = {
  // initData: PropTypes.object
};
