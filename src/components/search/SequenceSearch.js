import React, { useEffect, useReducer, useState } from 'react';
import MultilineAutoTextInput from '../input/MultilineAutoTextInput';
import RangeInputSlider from '../input/RangeInputSlider';
import AutoTextInput from '../input/AutoTextInput';
import SelectControl from '../select/SelectControl';
import CategorizedAutoTextInput from '../input/CategorizedAutoTextInput';
import MultiselectTextInput from '../input/MultiselectTextInput';
import HelpTooltip from '../tooltip/HelpTooltip';
import ExampleExploreControl from '../example/ExampleExploreControl';
import ExampleControl from "../example/ExampleControl";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import PropTypes from 'prop-types';
import { Row } from 'react-bootstrap';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Button from 'react-bootstrap/Button';
import {sortDropdown} from '../../utils/common';
import '../../css/Search.css';
import proteinSearchData from '../../data/json/proteinSearch';
import stringConstants from '../../data/json/stringConstants';

/**
 * Sequence search control.
 */
const SequenceSearch = (props) => {
    let commonProteinData = stringConstants.protein.common;
    let advancedSearch = proteinSearchData.sequence_search;

	const [sequenceError, setSequenceError] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{
		  proSeqSearchDisabled: props.inputValue.proSequence.length <= 0,
		  proSequenceInput: false,
		}
	  );

	/**
	 * Function to set protein or peptide sequence value.
	 * @param {string} inputProSequence - input protein or peptide sequence value.
	 **/
	function proSequenceChange(inputProSequence) {
		props.setInputValue({ proSequence: inputProSequence });
		setSequenceError({ proSequenceInput: inputProSequence.length > advancedSearch.sequence.length, proSeqSearchDisabled: inputProSequence.length <= 0 });
	}

	/**
	 * Function to handle onchange event for protein or peptide sequence.
	 * @param {object} event - event object.
	 **/
	const SequenceChange = (event) => {
		props.setInputValue({ proSequence: event.target.value });
		setSequenceError({ proSequenceInput: event.target.value.length > advancedSearch.sequence.length, proSeqSearchDisabled: event.target.value.length <= 0 });
	}
	 
	/**
	 * Function to clear input field values.
	 **/
	const clearSequence = () => {
		props.setInputValue({
			proSequence: ''
		});

		setSequenceError({ proSequenceInput: false, proSeqSearchDisabled: true });
	};

	return (
		<>
			<Grid
				container
				style={{ margin: "0 0 0 -12px" }}
				spacing={3}
				justifyContent='center'>
				{/* Buttons Top */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<div className='gg-align-right pt-2 pb-2 me-1'>
						<Button className='gg-btn-outline me-4' onClick={clearSequence}>
							Clear Fields
						</Button>
						<Button
							className='gg-btn-blue'
							onClick={props.searchSequenceClick}
							disabled={
								!Object.keys(sequenceError).every(
									(err) => sequenceError[err] === false
								  )
							}>
							Search Protein
						</Button>
					</div>
				</Grid>
				{/* Protein or Peptide Sequence */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl
						fullWidth
						variant='outlined'
					>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                                title={commonProteinData.sequence.tooltip.title}
                                text={commonProteinData.sequence.tooltip.text}
                                urlText={commonProteinData.sequence.tooltip.urlText}
                                url={commonProteinData.sequence.tooltip.url}
                            />
                            {commonProteinData.sequence.name}
						</Typography>
						<OutlinedInput
                            placeholder={advancedSearch.sequence.placeholder}
							margin='dense'
							multiline
							rows={3}
                            value={props.inputValue.proSequence}
                            onChange={SequenceChange}
                            error={props.inputValue.proSequence.length > advancedSearch.sequence.length}
						/>
						{props.inputValue.proSequence.length > advancedSearch.sequence.length && (
							<FormHelperText className={"error-text"} error>
								{advancedSearch.sequence.errorText}
							</FormHelperText>
						)}
						<ExampleControl
							exampleMap={advancedSearch.sequence.examples}
							type={advancedSearch.sequence.examples.sequence.id}
							setInputValue={input => {
								proSequenceChange(input);
							}}
						/>
					</FormControl>
				</Grid>
				{/* Buttons Buttom */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					{/* <Row className='gg-align-right pt-3 mb-2 mr-1'> */}
					<div className='gg-align-right pt-3 mb-2 me-1'>
						<Button className='gg-btn-outline me-4' onClick={clearSequence}>
							Clear Fields
						</Button>
						<Button
							className='gg-btn-blue'
							onClick={props.searchSequenceClick}
							disabled={
								!Object.keys(sequenceError).every(
									(err) => sequenceError[err] === false
								  )
							}>
							Search Protein
						</Button>
					</div>
					{/* </Row> */}
				</Grid>
			</Grid>
		</>
	);
};

export default SequenceSearch;

SequenceSearch.propTypes = {
	inputValue: PropTypes.object,
	searchSequenceClick: PropTypes.func,
	setInputValue: PropTypes.func,
};
