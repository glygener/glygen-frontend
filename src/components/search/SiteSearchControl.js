import React from "react";
import SelectControl from "../select/SelectControl";
import HelpTooltip from "../tooltip/HelpTooltip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import { Row } from "react-bootstrap";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import Button from "react-bootstrap/Button";
import { sortDropdown } from "../../utils/common";
import "../../css/Search.css";
import MultiselectTextInput from "../input/MultiselectTextInput";
import siteData from "../../data/json/siteData";
import stringConstants from "../../data/json/stringConstants";
const siteStrings = stringConstants.site.common;
const sitesData = siteData.site_search;
/**
 * Protein advanced search control.
 */
const SiteSearchControl = props => {
  const { siteSearchData, setSiteSearchData, siteError, setSiteError, handleSearch, initData } = props;
  const amAcidPattern = /[^rhkdestnqcugpavilmfywxRHKDESTNQCUGPAVILMFYWX]/g;
  
  /**
   * Function to clear input field values.
   **/
  const clearSite = () => {
    setSiteSearchData({
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
    });

    let errorTemp = {};
    let errorKeys = Object.keys(siteError);
    for(let i = 0; i < errorKeys.length; i++){
      errorTemp[errorKeys[i]] = false;
    }
    setSiteError(errorTemp);
  };

  return (
    <>
      <Grid
        container
        style={{ margin: "0 0 0 -12px" }}
        spacing={3}
        justifyContent="center"
      >
        {initData && (
          <>
            {/* Buttons Top */}
            <Grid item xs={12} sm={10}>
              <div className="gg-align-right pt-2 pb-2 me-1">
                <Button className="gg-btn-outline me-4" onClick={clearSite}>
                  Clear Fields
                </Button>
                <Button 
                  className="gg-btn-blue" 
                  onClick={handleSearch}
                  disabled={!Object.keys(siteError).every(
                    err => siteError[err] === false)
                  }
                >
                  Search Protein Site
                </Button>
              </div>
            </Grid>

            {/* Amino Acid */}
            <Grid item xs={12} sm={10}>
              <FormControl fullWidth variant="outlined">
                <Typography className={"search-lbl"} gutterBottom>
                  <HelpTooltip
                    title={siteStrings.glycosylated_aa.tooltip.title}
                    text={siteStrings.glycosylated_aa.tooltip.text}
                  />
                  {siteStrings.glycosylated_aa.name}
                </Typography>
                <SelectControl
                  inputValue={siteSearchData.aminoType}
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
                  setInputValue={(input) => setSiteSearchData({aminoType: input})}
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
                        title={siteStrings.annotation.tooltip.title}
                        text={siteStrings.annotation.tooltip.text}
                      />
                      {siteStrings.annotation_type.name}
                    </Typography>
                    <MultiselectTextInput
                      inputValue={siteSearchData.annotations}
                      placeholder={sitesData.annotation.placeholder}
                      placeholderId={sitesData.annotation.placeholderId}
                      placeholderName={sitesData.annotation.placeholderName}
                      options={initData.annotation_type_list.sort(sortDropdown)}
                      setInputValue={(input) => setSiteSearchData({annotations: input})}
                    ></MultiselectTextInput>
                  </Grid>
                  <Grid item xs={3} sm={3}>
                    <Typography className={"search-lbl"} gutterBottom>
                      &nbsp;
                    </Typography>
                    <FormControl fullWidth variant="outlined">
                      <SelectControl
                        inputValue={siteSearchData.annotationOperation}
                        menu={sitesData.aa_listforsite.operations}
                        setInputValue={(input) => setSiteSearchData({annotationOperation: input})}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>

            {/* Neighbors */}
            <Grid item xs={12} sm={10}>
              {/* <FormControl fullWidth> */}
                <Grid container spacing={2} style={{paddingBottom:"0px"}} alignItems="center">
                  <Grid item xs={6} sm={6} style={{paddingBottom:"0px"}}>
                    <Typography className={"search-lbl"} gutterBottom>
                      <HelpTooltip
                        title={siteStrings.neighbors.tooltip.title}
                        text={siteStrings.neighbors.tooltip.text}
                      />
                      {siteStrings.neighbors.tooltip.title}
                    </Typography>

                    <FormControl fullWidth variant="outlined">
                      <SelectControl
                        inputValue={siteSearchData.singleannotations}
                        placeholder={sitesData.annotation.placeholder}
                        placeholderId={sitesData.annotation.placeholderId}
                        placeholderName={sitesData.annotation.placeholderName}
                        menu={initData.annotation_type_list.sort(sortDropdown)}
                        setInputValue={(input) => {
                          if (siteError.neighbors && ((input !== "" && siteSearchData.distance !== "") || (input === "" && siteSearchData.distance === ""))){
                            let errorTemp = siteError;
                            errorTemp.neighbors = false;
                            setSiteError(errorTemp);
                          }
                          setSiteSearchData({singleannotations: input});
                        }}
                        error={siteError.neighbors}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3} sm={3} style={{paddingBottom:"0px"}}>
                    <Typography className={"search-lbl"} gutterBottom>
                      &nbsp;
                    </Typography>

                    <FormControl fullWidth variant="outlined">
                      <OutlinedInput
                        fullWidth
                        margin='dense'
                        placeholder={sitesData.neighborDistance.placeholder}
                        value={siteSearchData.distance}
                        classes={{
                          input: 'input-auto'
                          }}
                        onChange={(event) => {
                          if (siteError.neighbors && ((event.target.value !== "" && siteSearchData.singleannotations !== "") || (event.target.value === "" && siteSearchData.singleannotations === ""))){
                            let errorTemp = siteError;
                            errorTemp.neighbors = false;
                            setSiteError(errorTemp);
                          }
                          setSiteSearchData({distance: event.target.value});
                        }}
                        onBlur={() =>{
                          let currentDistance = siteSearchData.distance;
                          if (currentDistance !== ""){
                            currentDistance = Math.min(currentDistance, sitesData.neighborDistance.max);
                            currentDistance = Math.max(currentDistance, sitesData.neighborDistance.min);
                            setSiteSearchData({distance: currentDistance});
                          }
                        }}
                        inputProps={{
                          step: 1,
                          min: sitesData.neighborDistance.min,
                          max: sitesData.neighborDistance.max,
                          type: "number",
                        }}
                        error={siteError.neighbors}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3} sm={3} style={{paddingBottom:"0px"}}>
                    <Typography className={"search-lbl"} gutterBottom>
                      &nbsp;
                    </Typography>
                    <FormControl fullWidth variant="outlined">
                      <SelectControl
                        inputValue={siteSearchData.operator}
                        menu={sitesData.operatorforsite.operations}
                        setInputValue={(input) => setSiteSearchData({operator: input})}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item style={{paddingTop:"0px"}}>
                     {(siteError.neighbors) && (
                        <FormHelperText className={"error-text"} error>
                          {sitesData.neighborDistance.errorText}
                        </FormHelperText>
                      )}
                  </Grid>
                </Grid>
              {/* </FormControl> */}
            </Grid>

            {/* Pattern */}
            <Grid item xs={12} sm={10}>
              {/* <FormControl fullWidth> */}
                <Grid container spacing={2} style={{paddingBottom:"0px"}} alignItems="center">
                  <Grid item xs={4} sm={4} style={{paddingBottom:"0px"}}>
                    <Typography className={"search-lbl"} gutterBottom>
                      <HelpTooltip
                        title={siteStrings.pattern.tooltip.title}
                        text={siteStrings.pattern.tooltip.text}
                      />
                      {siteStrings.pattern.tooltip.title}
                    </Typography>
                    <FormControl fullWidth variant="outlined">
                      <SelectControl
                        inputValue={siteSearchData.updownoperator}
                        menu={sitesData.updownstreamforsite.operations}
                        setInputValue={(input) => {
                          let errorTemp = siteError;
                          errorTemp.upstreamPosition = false;
                          setSiteError(errorTemp);
                          setSiteSearchData({updownoperator: input});
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} sm={4} style={{paddingBottom:"0px"}}>
                    <Typography className={"search-lbl"} gutterBottom>
                      &nbsp;
                    </Typography>
                    {/* <FormControl fullWidth variant="outlined"> */}
                      <OutlinedInput
                        fullWidth
                        margin='dense'
                        placeholder={sitesData.patternPosition.placeholder}
                        value={siteSearchData.position}
                        classes={{
                          input: 'input-auto'
                          }}
                        onChange={(event) => {
                          let errorTemp = siteError;
                          if (siteError.pattern && ((event.target.value !== "" && siteSearchData.pattern !== "") || (event.target.value === "" && siteSearchData.pattern === ""))){
                              errorTemp.pattern = false;
                          }

                          if (siteError.upstreamPosition && ((event.target.value === "" || siteSearchData.pattern === "") || (event.target.value > siteSearchData.pattern.length))){
                            errorTemp.upstreamPosition = false;
                          }
                          setSiteError(errorTemp);
                          setSiteSearchData({position: event.target.value});
                        }}
                        onBlur={() =>{
                          let currentPosition = siteSearchData.position;
                          if (currentPosition !== ""){
                            currentPosition = Math.min(currentPosition, sitesData.patternPosition.max);
                            currentPosition = Math.max(currentPosition, sitesData.patternPosition.min);
                            setSiteSearchData({position: currentPosition});
                          }
                        }}
                        inputProps={{
                          step: 1,
                          min: sitesData.patternPosition.min,
                          max: sitesData.patternPosition.max,
                          type: "number",
                        }}
                        error={siteError.pattern || siteError.upstreamPosition}
                      />
                    {/* </FormControl> */}
                  </Grid>
                  <Grid item xs={4} sm={4} style={{paddingBottom:"0px"}}>
                    <Typography className={"search-lbl"} gutterBottom>
                      &nbsp;
                    </Typography>
                    <FormControl fullWidth variant="outlined">
                      <OutlinedInput
                        fullWidth
                        required
                        margin='dense'
                        placeholder={sitesData.patternPeptide.placeholder}
                        value={siteSearchData.pattern}
                        classes={{
                          input: 'input-auto'
                          }}
                        onChange={(event) => {
                          let errorTemp = siteError;
                          if (siteError.pattern && ((event.target.value !== "" && siteSearchData.position !== "") || (event.target.value === "" && siteSearchData.position === ""))){
                            errorTemp.pattern = false;
                          }

                          if (siteError.upstreamPosition && ((event.target.value === "" || siteSearchData.position === "") || (siteSearchData.position > event.target.value.length))){
                            errorTemp.upstreamPosition = false;
                          }
                          errorTemp.peptideInvalid = (event.target.value.search(amAcidPattern, "") + 1) > 0;
                          errorTemp.peptideLength = event.target.value.length > sitesData.patternPeptide.length;
                          setSiteError(errorTemp);
                          setSiteSearchData({pattern: event.target.value});
                        }}
                        error={siteError.peptideInvalid || siteError.peptideLength || siteError.pattern || siteError.upstreamPosition}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item style={{paddingTop:"0px"}}>
                    {(siteError.peptideInvalid) && (
                        <FormHelperText className={"error-text"} error>
                          {sitesData.patternPeptide.errorText}
                        </FormHelperText>
                    )}
                    {(siteError.peptideLength) && (
                        <FormHelperText className={"error-text"} error>
                          {sitesData.patternPeptide.errorText1}
                        </FormHelperText>
                    )}
                     {(siteError.pattern) && (
                        <FormHelperText className={"error-text"} error>
                          {sitesData.patternPeptide.errorText2}
                        </FormHelperText>
                    )}
                    {(siteError.upstreamPosition) && (
                        <FormHelperText className={"error-text"} error>
                          {sitesData.patternPeptide.errorText3}
                        </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              {/* </FormControl> */}
             </Grid>

            {/* Buttons Buttom */}
            <Grid item xs={12} sm={10}>
              <div className="gg-align-right pt-3 mb-2 me-1">
                <Button className="gg-btn-outline me-4" onClick={clearSite}>
                  Clear Fields
                </Button>
                <Button 
                  className="gg-btn-blue" 
                  onClick={handleSearch}
                  disabled={
                    !Object.keys(siteError).every(
                      err => siteError[err] === false
                    )
                  }
                >
                  Search Protein Site
                </Button>
              </div>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default SiteSearchControl;

SiteSearchControl.propTypes = {};
