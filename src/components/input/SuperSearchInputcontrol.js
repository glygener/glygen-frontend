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
import AutoTextInput from '../input/AutoTextInput';

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
			<div className={'svg-input-container'}>
				<Grid container justifyContent="center">
					<Grid item style={{width: "110px"}} className={'svg-input-item'}>
						<FormControl 
							variant='outlined'
							fullWidth
						>
							{props.prevOrderId !== undefined && <SelectControl
								inputValue={props.query.aggregator}
								sortFunction={sortByOrder}
								menu={aggregatorList}
								setInputValue={(input)=>{props.supSearchUpdateQuery(props.query.order, "aggregator", input)}}
							/>}
						</FormControl>
					</Grid>
					<Grid item style={{width: "280px"}} className={'svg-input-item'}>
						<FormControl 
							variant='outlined' 
							fullWidth
						>
							<SelectControl
								inputValue={props.query.field}
								menu={props.data.fields ? props.data.fields.map((value)=> { return {id:value.id, name:value.label, order:value.order}}) : []}
								sortFunction={sortByOrder}
								setInputValue={(input)=>{
									props.supSearchUpdateQuery(props.query.order, "field", input);
									let curfield = props.data.fields.filter((value)=> value.id === input)[0];
									props.supSearchUpdateQuery(props.query.order, "fieldType", curfield.type);
									props.supSearchUpdateQuery(props.query.order, "value", curfield.default_value ? curfield.default_value : "");
									props.supSearchUpdateQuery(props.query.order, "typeaheadID", curfield.typeahead);
									props.supSearchUpdateQuery(props.query.order, "error", false);
									props.supSearchUpdateQuery(props.query.order, "operationEnum", (curfield.enum && curfield.enum.length > 0 ? curfield.oplist.filter(val => val !== "$regex") : curfield.oplist));
									props.supSearchUpdateQuery(props.query.order, "selectEnum", curfield.enum);
									props.supSearchUpdateQuery(props.query.order, "operation", "$eq");
									props.supSearchUpdateQuery(props.query.order, "maxlength", curfield.maxlength ? curfield.maxlength : 100 );
									if (props.query.aggregator === "")
										props.supSearchUpdateQuery(props.query.order, "aggregator", "$and");
								}}
							/>
						</FormControl>
					</Grid>
					<Grid item style={{width: "110px"}} className={'svg-input-item'}>
						<FormControl 
							variant='outlined' 
							fullWidth
						>
							<SelectControl
								inputValue={props.query.operation}
								menu={props.query.operationEnum.map((value)=> { return {id:value, name:operationList.find((oper)=> value === oper.id).name}})}
								setInputValue={(input)=>{props.supSearchUpdateQuery(props.query.order, "operation", input)}}
							/>
						</FormControl>
					</Grid>
					<Grid item style={{width: "350px"}} className={'svg-input-item'}>
						{props.query.selectEnum.length === 0 && 
						<FormControl 
							variant='outlined' 
							fullWidth
						>
							{props.query.fieldType === "number" && <>
								<OutlinedInput
									className={'svg-input'}
									value={props.query.value}
									margin='dense'
									onChange={(event)=>{
										props.query.error && props.supSearchUpdateQuery(props.query.order, "error", false);
										props.supSearchUpdateQuery(props.query.order, "value", event.target.value);
									}}
									onBlur={(event) => onNumberMoveOut(event, props.query.order)}
									placeholder={superSearchNumberData.placeholder}
									error={(props.query.value !== "" && props.query.value !== "." && isNaN(Number(props.query.value))) || props.query.error }
								/>	
								{(props.query.value !== "" && (props.query.value !== "." || props.query.error) && isNaN(Number(props.query.value)))								
								&& (
									<FormHelperText className={"error-text"} error>
										{superSearchNumberData.errorText1}
									</FormHelperText>
								)}
								{(props.query.error && props.query.value === "")
								&& (
									<FormHelperText className={"error-text"} error>
										{superSearchNumberData.errorText1}
									</FormHelperText>
								)}								
							</>}
							{(!props.query.typeaheadID || props.query.typeaheadID === "") && props.query.fieldType === "string" && <>
								<OutlinedInput
									className={'svg-input'}
									value={props.query.value}
									margin='dense'
									onChange={(event)=>{
										props.query.error && props.supSearchUpdateQuery(props.query.order, "error", false);
										props.supSearchUpdateQuery(props.query.order, "value", event.target.value);
									}}
									onBlur={(event) => onTextMoveOut(event, props.query.order)}
									placeholder={superSearchTextData.placeholder}
									error={props.query.value.length > props.query.maxlength  || props.query.error }
								/>
									{(props.query.value.length > props.query.maxlength)
									&& (
										<FormHelperText className={"error-text"} error>
											{superSearchTextData.errorText1 + props.query.maxlength + "."}
										</FormHelperText>
									)}
									{(props.query.error && props.query.value === "") 
									&& (
										<FormHelperText className={"error-text"} error>
											{superSearchTextData.errorText2}
										</FormHelperText>
									)}								
							</>}
							{props.query.typeaheadID && props.query.typeaheadID !== "" && props.query.fieldType === "string" && <>
								<AutoTextInput
									inputValue={props.query.value}
									setInputValue={(value)=>{
										props.query.error && props.supSearchUpdateQuery(props.query.order, "error", false);
										props.supSearchUpdateQuery(props.query.order, "value", value);
									}}
									onBlur={(event) => onTextMoveOut(event, props.query.order)}
									error={props.query.error}
									placeholder={superSearchTextData.placeholder}
									typeahedID={props.query.typeaheadID}
									length={props.query.maxlength}
									errorText={superSearchTextData.errorText1 + props.query.maxlength + "."}
								/>
									{(props.query.error && props.query.value === "") 
									&& (
										<FormHelperText className={"error-text"} error>
											{superSearchTextData.errorText2}
										</FormHelperText>
									)}								
							</>}
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
						{props.query.selectEnum && props.query.selectEnum.length > 0 && <FormControl 
							variant='outlined' 
							fullWidth
						>
							<SelectControl
								inputValue={props.query.value}
								placeholder={superSearchSelectData.placeholder}
								placeholderId={superSearchSelectData.placeholderId}
								placeholderName={superSearchSelectData.placeholderName}
								onBlur={() => props.query.error && props.supSearchUpdateQuery(props.query.order, "error", false)}
								menu={props.query.selectEnum.map((value)=> { return {id:value, name:value}})}
								setInputValue={(input)=>{
									props.query.error && props.supSearchUpdateQuery(props.query.order, "error", false);
									props.supSearchUpdateQuery(props.query.order, "value", input);
								}}
								error={props.query.error}
							/>
							{props.query.error 
							&& (
								<FormHelperText className={"error-text"} error>
									{superSearchSelectData.errorText1}
								</FormHelperText>
							)}					
							</FormControl>
						}
					</Grid>
					<Grid item style={{width: "240px"}}>
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
							{props.prevOrderId !== undefined && <Button className='gg-btn-outline me-3 mb-3' 
							style={{padding : "8px 12px"}}
							onClick={() => props.supSearchMoveUpQuery(props.query.order, props.prevOrderId)}
						>
							<Image
								src={upArrowIcon}
								alt="up arrow button"
							/>
						</Button>}
						{props.nextOrderId !== undefined && <Button
							className='gg-btn-outline mb-3' style={{padding : "8px 12px"}}
							onClick={() => props.supSearchMoveDownQuery(props.query.order, props.nextOrderId)}
						>
							<Image
								src={downArrowIcon}
								alt="down arrow button"
							/>
						</Button>}
					</Grid>
				</Grid>
			</div>
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
