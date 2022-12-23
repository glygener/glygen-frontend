import React from "react";
import MultilineAutoTextInput from "../input/MultilineAutoTextInput";
import RangeInputSlider from "../input/RangeInputSlider";
import AutoTextInput from "../input/AutoTextInput";
import MultiselectTextInput from "../input/MultiselectTextInput";
import SelectControl from "../select/SelectControl";
import HelpTooltip from "../tooltip/HelpTooltip";
import ExampleExploreControl from "../example/ExampleExploreControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Row } from "react-bootstrap";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Button, ButtonGroup } from "react-bootstrap";
import { sortDropdown } from "../../utils/common";
import "../../css/Search.css";
import glycanSearchData from "../../data/json/glycanSearch";
import stringConstants from "../../data/json/stringConstants";

/**
 * Glycan advanced search control.
 **/
const GlycanAdvancedSearch = props => {
  let commonGlycanData = stringConstants.glycan.common;
  let advancedSearch = glycanSearchData.advanced_search;

  /**
   * Function to set organism value.
   * @param {string} org - organism value.
   **/
  function glyOrgChange(org) {
    props.setGlyAdvSearchData({ glyOrganisms: org });
  }

  /**
   * Function to set organism operation value.
   * @param {string} value - operation value.
   **/
  const glyOrgOperationOnChange = value => {
    props.setGlyAdvSearchData({ glyOrgOperation: value });
  };

  /**
   * Function to set organism annotation category value.
   * @param {string} value - organism annotation category value.
   **/
  const glyOrgAnnotationCatChange = value => {
    props.setGlyAdvSearchData({ glyOrgAnnotationCat: value });
  };

  /**
   * Function to set mass type value.
   * @param {string} value - mass type value.
   **/
  const glyMassTypeOnChange = value => {
    props.setGlyAdvSearchData({ glyMassType: value });
    setMassValues(value, props.inputValue.glyMass);
  };

  /**
   * Function to set mass values based on mass type and given mass values.
   * @param {string} massType - mass type value.
   * @param {array} massValues - min and max mass values.
   **/
  const setMassValues = (massType, massValues) => {
    var perMet_mass_min = Math.floor(
      props.initData.glycan_mass.permethylated.min
    );
    var perMet_mass_max = Math.ceil(
      props.initData.glycan_mass.permethylated.max
    );
    var native_mass_min,
      minRange,
      minval = Math.floor(props.initData.glycan_mass.native.min);
    var native_mass_max,
      maxRange,
      maxval = Math.ceil(props.initData.glycan_mass.native.max);
    var mass_type_native = props.initData.glycan_mass.native.name;
    native_mass_min = minRange = minval;
    native_mass_max = maxRange = maxval;

    if (massType === undefined) massType = mass_type_native;

    if (massValues !== undefined) {
      minval = massValues[0];
      maxval = massValues[1];
    }

    if (massType === mass_type_native) {
      if (minval === perMet_mass_min) minval = native_mass_min;

      if (maxval === perMet_mass_max || maxval > native_mass_max)
        maxval = native_mass_max;
    } else {
      if (minval === native_mass_min || minval < perMet_mass_min)
        minval = perMet_mass_min;

      if (maxval === native_mass_max) maxval = perMet_mass_max;

      minRange = perMet_mass_min;
      maxRange = perMet_mass_max;
    }

    props.setGlyAdvSearchData({ glyMassRange: [minRange, maxRange] });
    props.setGlyAdvSearchData({
      glyMassInput: [
        Number(minval).toLocaleString("en-US"),
        Number(maxval).toLocaleString("en-US")
      ]
    });
    props.setGlyAdvSearchData({ glyMass: [minval, maxval] });
  };

  /**
   * Function to set min, max mass values.
   * @param {array} inputMass - input mass values.
   **/
  function glyMassInputChange(inputMass) {
    props.setGlyAdvSearchData({ glyMassInput: inputMass });
  }

  /**
   * Function to set min, max mass values based on slider position.
   * @param {array} inputMass - input mass values.
   **/
  function glyMassSliderChange(inputMass) {
    props.setGlyAdvSearchData({ glyMass: inputMass });
  }

  /**
   * Function to set min, max sugar values.
   * @param {array} inputNumSugars - input sugar values.
   **/
  function glyNumSugarsInputChange(inputNumSugars) {
    props.setGlyAdvSearchData({ glyNumSugarsInput: inputNumSugars });
  }

  /**
   * Function to set min, max sugar values based on slider position.
   * @param {array} inputNumSugars - input sugar values.
   **/
  function glyNumSugarsSliderChange(inputNumSugars) {
    props.setGlyAdvSearchData({ glyNumSugars: inputNumSugars });
  }

  /**
   * Function to set glycan type value.
   * @param {string} value - input glycan type value.
   **/
  const glyTypeOnChange = value => {
    if (value === ""){
      props.setGlyAdvSearchData({ glySubTypeIsHidden: true });
    } else {
      var length = props.initData.glycan_type.find(type => {
        return type.name === value; }).subtype.length;
      if (length > 1) {
        props.setGlyAdvSearchData({ glySubTypeIsHidden: false });
      } else {
        props.setGlyAdvSearchData({ glySubTypeIsHidden: true });
      }
    }

    props.setGlyAdvSearchData({ glySubType: "" });
    props.setGlyAdvSearchData({ glyType: value });
  };

  /**
   * Function to set glycan sub type value.
   * @param {string} value - input glycan sub type value.
   **/
  const glySubTypeOnChange = value => {
    props.setGlyAdvSearchData({ glySubType: value });
  };

  /**
   * Function to set glycan id value.
   * @param {string} inputGlycanId - input glycan id value.
   **/
  function glycanIdChange(inputGlycanId) {
    let valArr = props.inputValue.glyAdvSearchValError;
    valArr[0] = inputGlycanId.length > advancedSearch.glycan_identifier.length;
    props.setGlyAdvSearchData({
      glycanId: inputGlycanId,
      glyAdvSearchValError: valArr
    });
  }

  /**
   * Function to set glycan id subsumption value.
   * @param {string} inputGlycanIdSubsumption - input glycan id subsumption value.
   **/
  function glycanIdSubsumptionChange(inputGlycanIdSubsumption) {
    props.setGlyAdvSearchData({
      glycanIdSubsumption: inputGlycanIdSubsumption
    });
  }

  /**
   * Function to set glycosylated protein id value.
   * @param {string} inputGlyProt - input glycosylated protein id value.
   **/
  function glyProtChange(inputGlyProt) {
    let valArr = props.inputValue.glyAdvSearchValError;
    valArr[1] = inputGlyProt.length > advancedSearch.protein_identifier.length;
    props.setGlyAdvSearchData({
      glyProt: inputGlyProt,
      glyAdvSearchValError: valArr
    });
  }

  /**
   * Function to set motif value.
   * @param {string} inputGlyMotif - input motif value.
   **/
  function glyMotifChange(inputGlyMotif) {
    let valArr = props.inputValue.glyAdvSearchValError;
    valArr[2] = inputGlyMotif.length > advancedSearch.glycan_motif.length;
    props.setGlyAdvSearchData({
      glyMotif: inputGlyMotif,
      glyAdvSearchValError: valArr
    });
  }

  /**
   * Function to set biosynthetic enzyme value.
   * @param {string} inputGlyBioEnz - input biosynthetic enzyme value.
   **/
  function glyBioEnzChange(inputGlyBioEnz) {
    let valArr = props.inputValue.glyAdvSearchValError;
    valArr[3] = inputGlyBioEnz.length > advancedSearch.enzyme.length;
    props.setGlyAdvSearchData({
      glyBioEnz: inputGlyBioEnz,
      glyAdvSearchValError: valArr
    });
  }

  /**
   * Function to set pubmed id value.
   * @param {string} inputGlyPubId - input pubmed id value.
   **/
  function glyPubIdChange(inputGlyPubId) {
    let valArr = props.inputValue.glyAdvSearchValError;
    valArr[4] = inputGlyPubId.length > advancedSearch.pmid.length;
    props.setGlyAdvSearchData({
      glyPubId: inputGlyPubId,
      glyAdvSearchValError: valArr
    });
  }

  /**
   * Function to set binding protein id value.
   * @param {string} inputGlyBindingIdProtein - input binding protein id value.
   **/
  function glyBindingProteinIdChange(inputGlyBindingIdProtein) {
    let valArr = props.inputValue.glyAdvSearchValError;
    valArr[5] =
      inputGlyBindingIdProtein.length >
      advancedSearch.binding_protein_id.length;
    props.setGlyAdvSearchData({
      glyBindingProteinId: inputGlyBindingIdProtein,
      glyAdvSearchValError: valArr
    });
  }

  /**
   * Function to set glycan name value.
   * @param {string} inputGlyName - input glycan name value.
   **/
  function glyGlyNameChange(inputGlyName) {
    let valArr = props.inputValue.glyAdvSearchValError;
    valArr[6] = inputGlyName.length > advancedSearch.glycan_name.length;
    props.setGlyAdvSearchData({
      glyGlyName: inputGlyName,
      glyAdvSearchValError: valArr
    });
  }

  /**
   * Function to set glycan ID namespace value.
   * @param {string} value - input glycan ID namespace value.
   **/
   const glyIDNamespaceOnChange = value => {
    props.setGlyAdvSearchData({ glyIDNamespace: value });
  };

  /**
   * Function to clear input field values.
   **/
  const clearGlycan = () => {
    props.setGlyAdvSearchData({
      glycanId: "",
      glycanIdSubsumption: "none",
      glyMassType: props.initData.glycan_mass.native.name,
      glyMass: [
        Math.floor(props.initData.glycan_mass.native.min),
        Math.ceil(props.initData.glycan_mass.native.max)
      ],
      glyMassInput: [
        Math.floor(props.initData.glycan_mass.native.min).toLocaleString(
          "en-US"
        ),
        Math.ceil(props.initData.glycan_mass.native.max).toLocaleString("en-US")
      ],
      glyMassRange: [
        Math.floor(props.initData.glycan_mass.native.min),
        Math.ceil(props.initData.glycan_mass.native.max)
      ],
      glyNumSugars: [
        props.initData.number_monosaccharides.min,
        props.initData.number_monosaccharides.max
      ],
      glyNumSugarsRange: [
        props.initData.number_monosaccharides.min,
        props.initData.number_monosaccharides.max
      ],
      glyNumSugarsInput: [
        Number(props.initData.number_monosaccharides.min).toLocaleString(
          "en-US"
        ),
        Number(props.initData.number_monosaccharides.max).toLocaleString(
          "en-US"
        )
      ],
      glyOrganisms: [],
      glyOrgAnnotationCat: "",
      glyOrgOperation: "or",
      glyType: advancedSearch.glycan_type.placeholderId,
      glySubType: advancedSearch.glycan_subtype.placeholderId,
      glySubTypeIsHidden: true,
      glyProt: "",
      glyMotif: "",
      glyBioEnz: "",
      glyGlyName: "",
      glyPubId: "",
      glyBindingProteinId: "",
      glyIDNamespace: "",
      glyAdvSearchValError: [false, false, false, false, false, false, false]
    });
  };

  return (
    <>
      <Grid
        container
        style={{ margin: "0 0 0 -12px" }}
        spacing={3}
        justifyContent="center"
      >
        {/* Buttons Top */}
        <Grid className="gg-align-right" item xs={12} sm={10}>
          <div className="gg-align-right pt-2 pb-2 me-1">
          {/* <ButtonGroup className="text-end"> */}
            <Button className="gg-btn-outline me-4" onClick={clearGlycan}>
              Clear Fields
            </Button>
            <Button
              className="gg-btn-blue"
              onClick={props.searchGlycanAdvClick}
              disabled={
                !props.inputValue.glyAdvSearchValError.every(
                  err => err === false
                )
              }
            >
              Search Glycan
            </Button>
            {/* </ButtonGroup> */}
          </div>
        </Grid>
        {/* Glycan Id */}
        <Grid item xs={12} sm={10}>
          <FormControl fullWidth variant="outlined">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={9}>
                <Typography className={"search-lbl"} gutterBottom>
                  <HelpTooltip
                    title={commonGlycanData.glycan_identifier.tooltip.title}
                    text={commonGlycanData.glycan_identifier.tooltip.text}
                    urlText={commonGlycanData.glycan_identifier.tooltip.urlText}
                    url={commonGlycanData.glycan_identifier.tooltip.url}
                  />
                  {commonGlycanData.glycan_identifier.name}
                </Typography>
                <MultilineAutoTextInput
                  fullWidth
                  inputValue={props.inputValue.glycanId}
                  setInputValue={glycanIdChange}
                  placeholder={advancedSearch.glycan_identifier.placeholder}
                  typeahedID={advancedSearch.glycan_identifier.typeahedID}
                  length={advancedSearch.glycan_identifier.length}
                  errorText={advancedSearch.glycan_identifier.errorText}
                />
                <ExampleExploreControl
                  setInputValue={glycanIdChange}
                  inputValue={advancedSearch.glycan_identifier.examples}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <Typography className={"search-lbl"} gutterBottom>
                  &nbsp;
                </Typography>
                <FormControl variant="outlined" fullWidth>
                  <SelectControl
                    inputValue={props.inputValue.glycanIdSubsumption}
                    menu={advancedSearch.glycan_identifier.subsumption}
                    setInputValue={glycanIdSubsumptionChange}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </FormControl>
        </Grid>

        {/* Glycan ID Namespace */}
        <Grid item xs={12} sm={10}>
          <FormControl fullWidth variant="outlined">
            <Typography className={"search-lbl"} gutterBottom>
              <HelpTooltip
                title={commonGlycanData.id_namespace.tooltip.title}
                text={commonGlycanData.id_namespace.tooltip.text}
              />
              {commonGlycanData.id_namespace.name}
            </Typography>
            <SelectControl
              inputValue={props.inputValue.glyIDNamespace}
              placeholder={advancedSearch.id_namespace.placeholder}
              placeholderId={advancedSearch.id_namespace.placeholderId}
              placeholderName={advancedSearch.id_namespace.placeholderName}
              menu={props.initData.id_namespace.map(type => {
                return { id: type, name: type };
              })}
              setInputValue={glyIDNamespaceOnChange}
            />
          </FormControl>
        </Grid>

        {/* Monoisotopic Mass */}
        <Grid item xs={12} sm={10}>
          <FormControl fullWidth>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={9}>
                <Typography className={"search-lbl"} gutterBottom>
                  <HelpTooltip
                    title={commonGlycanData.mass.tooltip.title}
                    text={commonGlycanData.mass.tooltip.text}
                  />
                  {commonGlycanData.mass.name}
                </Typography>
                <RangeInputSlider
                  step={10}
                  min={props.inputValue.glyMassRange[0]}
                  max={props.inputValue.glyMassRange[1]}
                  inputClass="gly-rng-input"
                  inputValue={props.inputValue.glyMassInput}
                  setInputValue={glyMassInputChange}
                  inputValueSlider={props.inputValue.glyMass}
                  setSliderInputValue={glyMassSliderChange}
                />
              </Grid>
              {/* Mass Type */}
              <Grid item xs={12} sm={3}>
                <Typography className={"search-lbl"} gutterBottom>
                  &nbsp;
                </Typography>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel className={"select-lbl-inline"}>
                    {commonGlycanData.mass_type.name}
                  </InputLabel>
                  <SelectControl
                    inputValue={props.inputValue.glyMassType}
                    // labelWidth={85}
                    label={commonGlycanData.mass_type.name}
                    menu={Object.keys(props.initData.glycan_mass).map(
                      massType => {
                        return {
                          id: props.initData.glycan_mass[massType].name,
                          name: props.initData.glycan_mass[massType].name
                        };
                      }
                    )}
                    setInputValue={glyMassTypeOnChange}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </FormControl>
        </Grid>
        {/* No of Sugars */}
        <Grid item xs={12} sm={10}>
          <FormControl fullWidth>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={9}>
                <Typography className={"search-lbl"} gutterBottom>
                  <HelpTooltip
                    title={
                      commonGlycanData.number_monosaccharides.tooltip.title
                    }
                    text={commonGlycanData.number_monosaccharides.tooltip.text}
                  />
                  {commonGlycanData.number_monosaccharides.name}
                </Typography>
                <RangeInputSlider
                  step={1}
                  min={props.inputValue.glyNumSugarsRange[0]}
                  max={props.inputValue.glyNumSugarsRange[1]}
                  inputClass="gly-rng-input"
                  inputValue={props.inputValue.glyNumSugarsInput}
                  setInputValue={glyNumSugarsInputChange}
                  inputValueSlider={props.inputValue.glyNumSugars}
                  setSliderInputValue={glyNumSugarsSliderChange}
                />
              </Grid>
            </Grid>
          </FormControl>
        </Grid>
        {/* Organisms */}
        <Grid item xs={12} sm={10}>
          <FormControl fullWidth>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6} sm={6}>
                <Typography className={"search-lbl"} gutterBottom>
                  <HelpTooltip
                    title={commonGlycanData.organism.tooltip.title}
                    text={commonGlycanData.organism.tooltip.text}
                  />
                  {commonGlycanData.organism.name}
                </Typography>
                {
                  <MultiselectTextInput
                    options={props.initData.organism.sort(sortDropdown)}
                    inputValue={props.inputValue.glyOrganisms}
                    setInputValue={glyOrgChange}
                    placeholder={advancedSearch.organism.placeholder}
                  />
                }
              </Grid>
              {/* Subsumption */}
              <Grid item xs={3} sm={3}>
                <Typography className={"search-lbl"} gutterBottom>
                  &nbsp;
                </Typography>
                <FormControl variant="outlined" fullWidth>
                  <SelectControl
                    inputValue={props.inputValue.glyOrgAnnotationCat}
                    menu={advancedSearch.organism.annotation_category}
                    setInputValue={glyOrgAnnotationCatChange}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3} sm={3}>
                <Typography className={"search-lbl"} gutterBottom>
                  &nbsp;
                </Typography>
                <FormControl variant="outlined" fullWidth>
                  <SelectControl
                    inputValue={props.inputValue.glyOrgOperation}
                    menu={advancedSearch.organism.operations}
                    setInputValue={glyOrgOperationOnChange}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </FormControl>
        </Grid>
        {/* Glycan Type */}
        <Grid item xs={12} sm={10}>
          <FormControl fullWidth variant="outlined">
            <Typography className={"search-lbl"} gutterBottom>
              <HelpTooltip
                title={commonGlycanData.glycan_type.tooltip.title}
                text={commonGlycanData.glycan_type.tooltip.text}
              />
              {commonGlycanData.glycan_type.name}
            </Typography>
            <SelectControl
              inputValue={props.inputValue.glyType}
              placeholder={advancedSearch.glycan_type.placeholder}
              placeholderId={advancedSearch.glycan_type.placeholderId}
              placeholderName={advancedSearch.glycan_type.placeholderName}
              menu={props.initData.glycan_type.map(type => {
                return { id: type.name, name: type.name };
              })}
              setInputValue={glyTypeOnChange}
            />
          </FormControl>
        </Grid>
        {/* Glycan Subtype */}

        {!props.inputValue.glySubTypeIsHidden && (
          <Grid item xs={12} sm={10}>
            <FormControl fullWidth variant="outlined">
              <Typography className={"search-lbl"} gutterBottom>
                <HelpTooltip
                  title={commonGlycanData.glycan_subtype.tooltip.title}
                  text={commonGlycanData.glycan_subtype.tooltip.text}
                />
                {commonGlycanData.glycan_subtype.name}
              </Typography>
              <SelectControl
                inputValue={props.inputValue.glySubType}
                placeholder={advancedSearch.glycan_subtype.placeholder}
                placeholderId={advancedSearch.glycan_subtype.placeholderId}
                placeholderName={advancedSearch.glycan_subtype.placeholderName}
                menu={props.initData.glycan_type
                  .find(type => {
                    return type.name === props.inputValue.glyType;
                  })
                  .subtype.map(subtype => {
                    return { id: subtype, name: subtype };
                  })}
                setInputValue={glySubTypeOnChange}
              />
            </FormControl>
          </Grid>
        )}
        {/* Glycan Name */}
        <Grid item xs={12} sm={10}>
          <FormControl fullWidth variant="outlined">
            <Typography className={"search-lbl"} gutterBottom>
              <HelpTooltip
                title={commonGlycanData.glycan_name.tooltip.title}
                text={commonGlycanData.glycan_name.tooltip.text}
                urlText={commonGlycanData.glycan_name.tooltip.urlText}
                url={commonGlycanData.glycan_name.tooltip.url}
              />
              {commonGlycanData.glycan_name.name}
            </Typography>
            <AutoTextInput
              inputValue={props.inputValue.glyGlyName}
              setInputValue={glyGlyNameChange}
              placeholder={advancedSearch.glycan_name.placeholder}
              typeahedID={advancedSearch.glycan_name.typeahedID}
              length={advancedSearch.glycan_name.length}
              errorText={advancedSearch.glycan_name.errorText}
            />
            <ExampleExploreControl
              setInputValue={glyGlyNameChange}
              inputValue={advancedSearch.glycan_name.examples}
            />
          </FormControl>
        </Grid>

        {/* Glycosylated Protein */}
        <Grid item xs={12} sm={10}>
          <FormControl fullWidth variant="outlined">
            <Typography className={"search-lbl"} gutterBottom>
              <HelpTooltip
                title={commonGlycanData.protein_identifier.tooltip.title}
                text={commonGlycanData.protein_identifier.tooltip.text}
                urlText={commonGlycanData.protein_identifier.tooltip.urlText}
                url={commonGlycanData.protein_identifier.tooltip.url}
              />
              {commonGlycanData.protein_identifier.name}
            </Typography>
            <AutoTextInput
              inputValue={props.inputValue.glyProt}
              setInputValue={glyProtChange}
              placeholder={advancedSearch.protein_identifier.placeholder}
              typeahedID={advancedSearch.protein_identifier.typeahedID}
              length={advancedSearch.protein_identifier.length}
              errorText={advancedSearch.protein_identifier.errorText}
            />
            <ExampleExploreControl
              setInputValue={glyProtChange}
              inputValue={advancedSearch.protein_identifier.examples}
            />
          </FormControl>
        </Grid>

        {/* Binding Protein */}
        <Grid item xs={12} sm={10}>
          <FormControl fullWidth variant="outlined">
            <Typography className={"search-lbl"} gutterBottom>
              <HelpTooltip
                title={commonGlycanData.binding_protein_id.tooltip.title}
                text={commonGlycanData.binding_protein_id.tooltip.text}
                urlText={commonGlycanData.binding_protein_id.tooltip.urlText}
                url={commonGlycanData.binding_protein_id.tooltip.url}
              />
              {commonGlycanData.binding_protein_id.name}
            </Typography>
            <AutoTextInput
              inputValue={props.inputValue.glyBindingProteinId}
              setInputValue={glyBindingProteinIdChange}
              placeholder={advancedSearch.binding_protein_id.placeholder}
              typeahedID={advancedSearch.binding_protein_id.typeahedID}
              length={advancedSearch.binding_protein_id.length}
              errorText={advancedSearch.binding_protein_id.errorText}
            />
            <ExampleExploreControl
              setInputValue={glyBindingProteinIdChange}
              inputValue={advancedSearch.binding_protein_id.examples}
            />
          </FormControl>
        </Grid>
        {/* Glycan Motif */}
        <Grid item xs={12} sm={10}>
          <FormControl fullWidth variant="outlined">
            <Typography className={"search-lbl"} gutterBottom>
              <HelpTooltip
                title={commonGlycanData.glycan_motif.tooltip.title}
                text={commonGlycanData.glycan_motif.tooltip.text}
                urlText={commonGlycanData.glycan_motif.tooltip.urlText}
                url={commonGlycanData.glycan_motif.tooltip.url}
              />
              {commonGlycanData.glycan_motif.name}
            </Typography>
            <AutoTextInput
              inputValue={props.inputValue.glyMotif}
              setInputValue={glyMotifChange}
              placeholder={advancedSearch.glycan_motif.placeholder}
              typeahedID={advancedSearch.glycan_motif.typeahedID}
              length={advancedSearch.glycan_motif.length}
              errorText={advancedSearch.glycan_motif.errorText}
            />
            <ExampleExploreControl
              setInputValue={glyMotifChange}
              inputValue={advancedSearch.glycan_motif.examples}
            />
          </FormControl>
        </Grid>
        {/* Biosynthetic Enzyme */}
        <Grid item xs={12} sm={10}>
          <FormControl fullWidth variant="outlined">
            <Typography className={"search-lbl"} gutterBottom>
              <HelpTooltip
                title={commonGlycanData.enzyme.tooltip.title}
                text={commonGlycanData.enzyme.tooltip.text}
                urlText={commonGlycanData.enzyme.tooltip.urlText}
                url={commonGlycanData.enzyme.tooltip.url}
              />
              {commonGlycanData.enzyme.name}
            </Typography>
            <AutoTextInput
              inputValue={props.inputValue.glyBioEnz}
              setInputValue={glyBioEnzChange}
              placeholder={advancedSearch.enzyme.placeholder}
              typeahedID={advancedSearch.enzyme.typeahedID}
              length={advancedSearch.enzyme.length}
              errorText={advancedSearch.enzyme.errorText}
            />
            <ExampleExploreControl
              setInputValue={glyBioEnzChange}
              inputValue={advancedSearch.enzyme.examples}
            />
          </FormControl>
        </Grid>
        {/* Pubmed ID */}
        <Grid item xs={12} sm={10}>
          <FormControl fullWidth variant="outlined">
            <Typography className={"search-lbl"} gutterBottom>
              <HelpTooltip
                title={commonGlycanData.pmid.tooltip.title}
                text={commonGlycanData.pmid.tooltip.text}
                urlText={commonGlycanData.pmid.tooltip.urlText}
                url={commonGlycanData.pmid.tooltip.url}
              />
              {commonGlycanData.pmid.name}
            </Typography>
            <AutoTextInput
              inputValue={props.inputValue.glyPubId}
              setInputValue={glyPubIdChange}
              placeholder={advancedSearch.pmid.placeholder}
              typeahedID={advancedSearch.pmid.typeahedID}
              length={advancedSearch.pmid.length}
              errorText={advancedSearch.pmid.errorText}
            />
            <ExampleExploreControl
              setInputValue={glyPubIdChange}
              inputValue={advancedSearch.pmid.examples}
            />
          </FormControl>
        </Grid>
        {/* Buttons Buttom */}
        <Grid item xs={12} sm={10}>
          {/* <Row className="gg-align-right pt-3 mb-2 me-1"> */}
          <div className="gg-align-right pt-3 mb-2 me-1">
          {/* <ButtonGroup> */}
            <Button type="button" className="gg-btn-outline me-4" onClick={clearGlycan}>
              Clear Fields
            </Button>
            <Button type="button"
              className="gg-btn-blue"
              onClick={props.searchGlycanAdvClick}
              disabled={
                !props.inputValue.glyAdvSearchValError.every(
                  err => err === false
                )
              }
            >
              Search Glycan
            </Button>
            {/* </ButtonGroup> */}
            </div>
          {/* </Row> */}
        </Grid>
      </Grid>
    </>
  );
};

export default GlycanAdvancedSearch;

GlycanAdvancedSearch.propTypes = {
  initData: PropTypes.object,
  inputValue: PropTypes.object,
  searchGlycanAdvClick: PropTypes.func,
  setGlyAdvSearchData: PropTypes.func
};
