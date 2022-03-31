import React, { useState, useReducer } from "react";
import { Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Grid, Typography } from "@material-ui/core";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import SelectControl from "../select/SelectControl";
import HelpTooltip from "../tooltip/HelpTooltip";
import "../../css/Search.css";
import ExampleControl2 from "../example/ExampleControl2";
import glycanSearchData from "../../data/json/glycanSearch";
import stringConstants from "../../data/json/stringConstants";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import GlycoGlyph from "./GlycoGlyph";

/**
 * Glycan substructure search control.
 **/
const StructureSearchControl = (props) => {

  const [structError, setStructError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      glySeqSearchDisabled: props.inputValue.glySequence.length <= 0,
      glySequenceInput: false,
    }
  );
  const [glycoGlyphDialog, setGlycoGlyphDialog] = useState(false);

  let glycanStructSearchData = glycanSearchData.substructure_search;
  let commonStructSearchData = stringConstants.glycan.common;

   /**
   * Function to set sequence type value.
   * @param {string} value - input sequence type value.
   **/
  const sequenceTypeOnChange = (value) => {
    props.setInputValue({ seqType: value });
    glySequenceChange("");
  };


  /**
	 * Function to set glycan sequence value.
	 * @param {string} inputGlySequence - input glycan sequence value.
	 **/
	function glySequenceChange(inputGlySequence, draw = false) {
    if (draw) {
      props.setInputValue({ glySequence: inputGlySequence});
    } else {
      props.setInputValue({ glySequence: inputGlySequence, glycoGlyphName: ""});
    }

    setStructError({ glySequenceInput: false });
    if (inputGlySequence.length > 0){
      setStructError({ glySeqSearchDisabled: false });
    } else {
      setStructError({ glySeqSearchDisabled: true });
    }
	}

	/**
	 * Function to handle onchange event for glycan sequence.
	 * @param {object} event - event object.
	 **/
	const SequenceChange = (event) => {
		let glySequenceError = event.target.value.length < 20;
    if (event.target.value.length === 0) {
      props.setInputValue({ glySequence: event.target.value, glycoGlyphName: ""});
      setStructError({ glySequenceInput: false });
      setStructError({ glySeqSearchDisabled: true });
    } else {
      props.setInputValue({ glySequence: event.target.value, glycoGlyphName: ""});
      if (!glySequenceError) {
        setStructError({ glySequenceInput: glySequenceError });
      }
      setStructError({ glySeqSearchDisabled: glySequenceError });
    }
	}


	/**
	 * Function to handle onblur event for protein sequence.
	 * @param {object} event - event object.
	 **/
  const OnBlurSequenceChange = (event) => {
		let glySequenceError = event.target.value.length < 20;
    if (event.target.value.length < 20 && event.target.value.length !== 0) {
      setStructError({ glySequenceInput: glySequenceError });
    }
	}

  /**
	 * Function to handle on change event for restrictTo.
	 * @param {object} event - event object.
	 **/
  const restrictToChange = (event) => {
    props.setInputValue({ restrictTo: event.target.value });
  }

  /**
	 * Function to clear all field values.
	 **/
  const clearMapFields = () => {
    props.setInputValue({
      seqType: "GlycoCT",
      glySequence: "",
      restrictTo: "substructure",
      glycoGlyphName: ""
    });

    setStructError({ glySequenceInput: false, glySeqSearchDisabled: true });
  };

  return (
    <>
      <GlycoGlyph
        show={glycoGlyphDialog}
        glySequenceChange={glySequenceChange}
        glySequence={props.inputValue.glySequence}
        setInputValue={props.setInputValue}
        inputValue={props.inputValue}
        title={"GlycoGlyph"}
        setOpen={(input) => {
          setGlycoGlyphDialog(input)
        }}
      />
      <Grid
        container
        style={{ margin: "0  auto" }}
        spacing={3}
        justify="center"
      >
          {/*  Buttons */}
          <Grid item xs={12} sm={10}>
            <Row  className="gg-align-right pt-3 mb-2 mr-1">
              <Button className="gg-btn-outline mr-4" onClick={clearMapFields}>
                Clear Fields
              </Button>
              <Button
                className="gg-btn-blue"
                disabled={
                  !Object.keys(structError).every(
                    (err) => structError[err] === false
                  )
                }
                onClick={props.searchSubStructClick}
              >
                Submit
              </Button>
            </Row>
          </Grid>

         {/* Sequence Type */}
         <Grid item xs={12} sm={10} className="pt-3">
          <FormControl
            fullWidth
            variant="outlined"
          >
            <Typography className={"search-lbl"} gutterBottom>
              <HelpTooltip
                title={commonStructSearchData.seq_type.tooltip.title}
                text={commonStructSearchData.seq_type.tooltip.text}
              />
              {commonStructSearchData.seq_type.name + " *"}
            </Typography>
            <SelectControl
              inputValue={props.inputValue.seqType}
              setInputValue={sequenceTypeOnChange}
              menu={glycanStructSearchData.seq_type.menu}
              required={true}
            />
          </FormControl>
        </Grid>

        {/* Sequence */}
				<Grid item xs={12} sm={10} className="pt-3">
					<FormControl
						fullWidth
						variant='outlined'
					>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                title={commonStructSearchData.seq.tooltip.title}
                text={commonStructSearchData.seq.tooltip.text}
              />
              {commonStructSearchData.seq.name + " *"}{<sup>,1</sup>}
						</Typography>
						<OutlinedInput
              placeholder={glycanStructSearchData.seq.exampleMap[props.inputValue.seqType].placeholder}
							margin='dense"'
							multiline
							rows={5}
              value={props.inputValue.glySequence}
              onChange={SequenceChange}
              onBlur={OnBlurSequenceChange}
              error={structError.glySequenceInput}
						/>
						{structError.glySequenceInput && (
							<FormHelperText className={"error-text"} error>
								{glycanStructSearchData.seq.errorText}
							</FormHelperText>
						)}
            <ExampleControl2
							setInputValue={glySequenceChange}
              type={props.inputValue.seqType}
							exampleMap={glycanStructSearchData.seq.exampleMap}
						/>
					</FormControl>
				</Grid>

          {/* "Restrict To */}   
          <Grid item xs={12} sm={10} className="pt-3">
            <FormControl
              fullWidth
              variant="outlined"
            >
              <Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                title={commonStructSearchData.align.tooltip.title}
                text={commonStructSearchData.align.tooltip.text}
              />
              {commonStructSearchData.align.name + " *"}
						</Typography>
              <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  onChange={restrictToChange}
                  value={props.inputValue.restrictTo}
                >
                  <Grid item xs={4} sm={3}>
                    <div><Radio value={glycanStructSearchData.align.substructure.id} color="primary"/>{glycanStructSearchData.align.substructure.name}</div>
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <div><Radio value={glycanStructSearchData.align.core.id} color="primary"/> {glycanStructSearchData.align.core.name}</div>
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <div><Radio value={glycanStructSearchData.align.nonreducingend.id} color="primary"/> {glycanStructSearchData.align.nonreducingend.name}</div>
                  </Grid>
              </RadioGroup>
            </FormControl>
          </Grid>

        {/*  Buttons */}
        <Grid item xs={12} sm={10}>
          <Row  className="gg-align-right pt-3 mb-2 mr-1">
            {props.inputValue.seqType === "GlycoCT" && (<Button
              className="gg-btn-blue mr-4"
              onClick={() => setGlycoGlyphDialog(true)}	
            >
              Generate GlycoCT
            </Button>)}
            <Button className="gg-btn-outline mr-4" onClick={clearMapFields}>
              Clear Fields
            </Button>
            <Button
              className="gg-btn-blue"
              disabled={
								!Object.keys(structError).every(
									(err) => structError[err] === false
								)
              }
              onClick={props.searchSubStructClick}
            >
              Submit
            </Button>
          </Row>
        </Grid>
        <Grid item xs={12} sm={10}>
        <Row>
          <Col>
            <div className="text-muted mt-2">
              <strong>*</strong> These fields are required.
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="text-muted">
              <strong><sup>1</sup></strong> Maximum number of monosaccharides supported is 10.
            </div>
          </Col>
        </Row>
        </Grid>
      </Grid>
    </>
  );
};
export default StructureSearchControl;
