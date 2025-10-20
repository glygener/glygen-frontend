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
import AutoTextInput from './AutoTextInput';

/**
 * Batch retrieval input control.
 **/
const BatchRetrievalInputcontrol = (props) => {
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
			props.batchRetrievalUpdateQuery(order, "error", true);
		} else {
			props.query.error && props.batchRetrievalUpdateQuery(order, "error", false);
		}
	}

	/**
	 * Function to validate text input.
	 * @param {object} event - event object.
     * @param {number} order - order number.
	 **/
	function onTextMoveOut(event, order){
		if (event.target.value.length > props.query.maxlength){
			props.batchRetrievalUpdateQuery(order, "error", true);
		} else {
			props.query.error && props.batchRetrievalUpdateQuery(order, "error", false);
		}
	}

	return (
		<>
			<div className={'svg-input-container'}>
				<Grid container justifyContent="center">
					<Grid item size= {{ xs: 3.1, sm: 3.1, md: 3.1 }} className={'svg-input-item'}>
						<FormControl 
							variant='outlined' 
							fullWidth
						>
								<OutlinedInput
									className={'svg-input'}
									classes={{
										input: 'input-auto'
									}}
									value={props.query.label}
									margin='dense'
									disabled={true}
									onChange={(event)=>{}}
								/>
						</FormControl>
					</Grid>
					<Grid item size= {{ xs: 1.3, sm: 1.3, md: 1.3 }} className={'svg-input-item'}>
						<FormControl 
							variant='outlined' 
							fullWidth
						>
							<SelectControl
								inputValue={props.query.outputTypeValue}
								menu={props.query.outputType ? props.query.outputType.map((value)=> { return {id:value, name:value}}) :[]}
								setInputValue={(input)=>{props.batchRetrievalUpdateQuery(props.query.order, "outputTypeValue", input)}}
							/>
						</FormControl>
					</Grid>
					<Grid item size= {{ xs: 1.6, sm: 1.6, md: 1.6 }} className={'svg-input-item'}>
						<FormControl 
							variant='outlined' 
							fullWidth
						>
							<SelectControl
								inputValue={props.query.operationEnumValue}
								menu={props.query.operationEnum ? props.query.operationEnum.map((value)=> { return {id:value, name:value}}) :[]}
								setInputValue={(input)=>{
									props.query.error && input === "none" && props.batchRetrievalUpdateQuery(props.query.order, "error", false);
									input === "none" && props.batchRetrievalUpdateQuery(props.query.order, "value", "");
									props.batchRetrievalUpdateQuery(props.query.order, "operationEnumValue", input)}}
							/>
						</FormControl>
					</Grid>
					<Grid item size= {{ xs: 3.1, sm: 3.1, md: 3.1 }} className={'svg-input-item'}>
						{(!props.query.selectEnum || props.query.selectEnum.length === 0) && 
						<FormControl 
							variant='outlined' 
							fullWidth
						>
							{props.query.fieldType === "number" && <>
								<OutlinedInput
									className={'svg-input'}
									value={props.query.value}
									margin='dense'
									classes={{
										input: 'input-auto'
									}}
									disabled={props.query.operationEnumValue === "none"}
									onChange={(event)=>{
										props.query.error && props.batchRetrievalUpdateQuery(props.query.order, "error", false);
										props.batchRetrievalUpdateQuery(props.query.order, "value", event.target.value);
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
							{((!props.query.typeaheadID || props.query.typeaheadID === "") && (!props.query.fieldList || props.query.fieldList.length === 0)) && props.query.fieldType === "string" && <>
								<OutlinedInput
									className={'svg-input'}
									classes={{
										input: 'input-auto'
									}}
									value={props.query.value}
									margin='dense'
									disabled={props.query.operationEnumValue === "none"}
									onChange={(event)=>{
										props.query.error && props.batchRetrievalUpdateQuery(props.query.order, "error", false);
										props.batchRetrievalUpdateQuery(props.query.order, "value", event.target.value);
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
							{((props.query.typeaheadID && props.query.typeaheadID !== "") || (props.query.fieldList && props.query.fieldList.length > 0)) && props.query.fieldType === "string" && <>
								<AutoTextInput
									inputValue={props.query.value}
									setInputValue={(value)=>{
										props.query.error && props.batchRetrievalUpdateQuery(props.query.order, "error", false);
										props.batchRetrievalUpdateQuery(props.query.order, "value", value);
									}}
									onBlur={(event) => onTextMoveOut(event, props.query.order)}
									disabled={props.query.operationEnumValue === "none"}
									error={props.query.error}
									placeholder={superSearchTextData.placeholder}
									typeahedID={props.query.typeaheadID}
									fieldList={props.query.fieldList}
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
									disabled={props.query.operationEnumValue === "none"}
									value={props.query.value}
									margin='dense'
									onChange={(event)=>{props.batchRetrievalUpdateQuery(props.query.order, "value", event.target.value)}}
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
								onBlur={() => props.query.error && props.batchRetrievalUpdateQuery(props.query.order, "error", false)}
								menu={props.query.selectEnum.map((value)=> { return {id:value, name:value}})}
								setInputValue={(input)=>{
									props.query.error && props.batchRetrievalUpdateQuery(props.query.order, "error", false);
									props.batchRetrievalUpdateQuery(props.query.order, "value", input);
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
					<Grid item size= {{ xs: 2.9, sm: 2.9, md: 2.9 }}>
						<Button 
							className='gg-btn-outline me-3 mb-3' 
							style={{padding : "8px 12px"}}
							onClick={() => {
								let curfield = props.data.filter((value)=> value.id === props.query.id)[0];
								props.batchRetrievalAddQuery(props.query.order + 1, curfield)}}
						>
							<Image
								src={plusIcon}
								alt="plus button"
							/>
						</Button>
							{!(props.prevOrderId === undefined && props.nextOrderId === undefined) && <Button className='gg-btn-outline me-3 mb-3' 
							style={{padding : "8px 12px"}}
							onClick={() => props.batchRetrievalDeleteQuery(props.query.order)}
						>
							<Image
								src={deleteIcon}
								alt="delete button"
							/>
						</Button>}
							{props.prevOrderId !== undefined && <Button className='gg-btn-outline me-3 mb-3' 
							style={{padding : "8px 12px"}}
							onClick={() => props.batchRetrievalMoveUpQuery(props.query.order, props.prevOrderId)}
						>
							<Image
								src={upArrowIcon}
								alt="up arrow button"
							/>
						</Button>}
						{props.nextOrderId !== undefined && <Button
							className='gg-btn-outline mb-3' style={{padding : "8px 12px"}}
							onClick={() => props.batchRetrievalMoveDownQuery(props.query.order, props.nextOrderId)}
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

export default BatchRetrievalInputcontrol;

BatchRetrievalInputcontrol.propTypes = {
	query: PropTypes.object,
	prevOrderId: PropTypes.number,
	nextOrderId: PropTypes.number,
	data: PropTypes.array,
	batchRetrievalDeleteQuery: PropTypes.func,
	batchRetrievalAddQuery: PropTypes.func,
	batchRetrievalMoveUpQuery: PropTypes.func,
	batchRetrievalMoveDownQuery: PropTypes.func,
	batchRetrievalUpdateQuery: PropTypes.func
};
