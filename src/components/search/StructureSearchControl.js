import React, { useState, useReducer } from "react";
import { Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Grid, Typography } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import SelectControl from "../select/SelectControl";
import HelpTooltip from "../tooltip/HelpTooltip";
import "../../css/Search.css";
import ExampleControl2 from "../example/ExampleControl2";
import ExampleControl4 from "../example/ExampleControl4";
import glycanSearchData from "../../data/json/glycanSearch";
import stringConstants from "../../data/json/stringConstants";
import GlycoGlyph from "./GlycoGlyph";

/**
 * Glycan structure search control.
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

  let glycanStructSearchData = glycanSearchData.structure_search;
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
		let glySequenceError = event.target.value.length < glycanStructSearchData.seq.length;
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
	 * Function to handle onblur event for glycan sequence.
	 * @param {object} event - event object.
	 **/
  const OnBlurSequenceChange = (event) => {
		let glySequenceError = event.target.value.length < glycanStructSearchData.seq.length;
    if (event.target.value.length < 20 && event.target.value.length !== 0) {
      setStructError({ glySequenceInput: glySequenceError });
    }
	}

  /**
	 * Function to clear all field values.
	 **/
  const clearMapFields = () => {
    props.setInputValue({
      seqType: "GlycoCT",
      glySequence: "",
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
        style={{ margin: "0 0 0 -12px" }}
        spacing={3}
        justifyContent="center"
      >
          {/*  Buttons */}
          <Grid item size={{ xs:12, sm:10 }}>
            <div  className="gg-align-right pt-3 mb-2 me-1">
              <Button className="gg-btn-outline me-4" onClick={clearMapFields}>
                Clear Fields
              </Button>
              <Button
                className="gg-btn-blue"
                disabled={
                  !Object.keys(structError).every(
                    (err) => structError[err] === false
                  )
                }
                onClick={props.searchStructClick}
              >
                Submit
              </Button>
            </div>
          </Grid>

        {/* Sequence */}
				<Grid item size={{ xs:12, sm:10 }} className="pt-3">
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
              placeholder={glycanStructSearchData.seq.placeholder}
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
            <ExampleControl4
							setInputValue={glySequenceChange}
							exampleMap={glycanStructSearchData.seq.exampleMap}
						/>
					</FormControl>
				</Grid>

        {/*  Buttons */}
        <Grid item size={{ xs:12, sm:10 }}>
          <div  className="gg-align-right pt-3 mb-2 me-1">
              <Button
                className="gg-btn-blue me-4"
                onClick={() => setGlycoGlyphDialog(true)}	
              >
                Draw Glycan
              </Button>
              <Button className="gg-btn-outline me-4" onClick={clearMapFields}>
                Clear Fields
              </Button>
              <Button
                className="gg-btn-blue"
                disabled={
                  !Object.keys(structError).every(
                    (err) => structError[err] === false
                  )
                }
                onClick={props.searchStructClick}
              >
                Submit
              </Button>
          </div>
        </Grid>
        <Grid item size={{ xs:12, sm:10 }}>
          <Row>
            <Col>
              <div className="text-muted mt-2">
                <strong>*</strong> These fields are required.
              </div>
            </Col>
          </Row>
        </Grid>
      </Grid>
    </>
  );
};
export default StructureSearchControl;
