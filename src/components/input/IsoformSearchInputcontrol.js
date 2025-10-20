import React from 'react';
import SelectControl from '../select/SelectControl';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import Button from 'react-bootstrap/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from "@mui/material/FormHelperText";
import '../../css/Search.css';
import superSearchData from '../../data/json/superSearchData';
import plusIcon from "../../images/icons/plus.svg";
import deleteIcon from "../../images/icons/delete.svg";
import downArrowIcon from "../../images/icons/down-arrow.svg";
import upArrowIcon from "../../images/icons/up-arrow.svg";
import { Image } from "react-bootstrap";
import {sortByOrder} from '../../utils/common';
import AutoTextInput from './AutoTextInput';

/**
 * Super search input control.
 **/
const SuperSearchInputcontrol = (props) => {
	let superSearchCommonData = superSearchData.common;
	let operationList = superSearchCommonData.oplist;
	let aggregatorList = superSearchCommonData.aggregators;
	let superSearchNumberData = superSearchCommonData.number;
	let superSearchTextData = superSearchCommonData.text;
	let superSearchSelectData = superSearchCommonData.select;

	/**
	 * Function to validate number input.
	 * @param {object} event - event object.
     * @param {number} order - order number.
	 **/
	function onNumberMoveOut(event, order){
		if (event.target.value !== "" && isNaN(Number(event.target.value))){
			props.supSearchUpdateQuery(order, "error", true);
		} else {
			props.query.error && props.supSearchUpdateQuery(order, "error", false);
		}
	}

	/**
	 * Function to validate text input.
	 * @param {object} event - event object.
     * @param {number} order - order number.
	 **/
	function onTextMoveOut(event, order){
		if (event.target.value.length > props.query.maxlength){
			props.supSearchUpdateQuery(order, "error", true);
		} else {
			props.query.error && props.supSearchUpdateQuery(order, "error", false);
		}
	}

	return (
		<>
			{/* <div className1={'svg-input-container'}> */}
				{/* <Grid container justifyContent1="center"> */}
					<Grid item size= {{ xs: 4, sm: 4 }} style1={{width: "350px"}}  className={'me-3'} className1={'svg-input-item'}>

						{props.query.fieldType === "" &&
							<FormControl 
								variant='outlined' 
								fullWidth
							>
								<OutlinedInput
									className={'svg-input'}
									classes={{
										input: 'input-auto'
									}}
									value={props.query.value}
									margin='dense'
									onChange={(event)=>{props.supSearchUpdateQuery(props.query.order, "value", event.target.value)}}
								/>
							</FormControl>
						}
					</Grid>
					<Grid item size= {{ xs: 4, sm: 4 }} style1={{width: "350px"}} className={'me-3'} className1={'svg-input-item'}>
						{props.query.selectEnum.length === 0 && 
						<FormControl 
							variant='outlined' 
							fullWidth
						>
							{props.query.fieldType === "" &&
								<OutlinedInput
									className={'svg-input'}
									classes={{
										input: 'input-auto'
									}}
									value={props.query.value}
									margin='dense'
									onChange={(event)=>{props.supSearchUpdateQuery(props.query.order, "value", event.target.value)}}
								/>
							}
						</FormControl>
						}
					</Grid>
					<Grid item size= {{ xs: 2, sm: 2 }} style1={{width: "240px"}}>
						<Button 
							className='gg-btn-outline me-3 mb-3' 
							style={{padding : "8px 12px"}}
							onClick={() => props.supSearchAddQuery(props.query.order + 1)}
						>
							<Image
								src={plusIcon}
								alt="plus button"
							/>
						</Button>
							{!(props.prevOrderId === undefined && props.nextOrderId === undefined) && <Button className='gg-btn-outline me-3 mb-3' 
							style={{padding : "8px 12px"}}
							onClick={() => props.supSearchDeleteQuery(props.query.order)}
						>
							<Image
								src={deleteIcon}
								alt="delete button"
							/>
						</Button>}
					</Grid>
				{/* </Grid> */}
			{/* </div> */}
		</>
	);
};

export default SuperSearchInputcontrol;

SuperSearchInputcontrol.propTypes = {
	query: PropTypes.object,
	prevOrderId: PropTypes.number,
	nextOrderId: PropTypes.number,
	data: PropTypes.array,
	selectedNode: PropTypes.string,
	supSearchDeleteQuery: PropTypes.func,
	supSearchAddQuery: PropTypes.func,
	supSearchMoveUpQuery: PropTypes.func,
	supSearchMoveDownQuery: PropTypes.func,
	supSearchUpdateQuery: PropTypes.func
};
