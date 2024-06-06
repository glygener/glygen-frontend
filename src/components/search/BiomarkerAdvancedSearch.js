import React from 'react';
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
import biomarkerSearchData from '../../data/json/biomarkerSearch';
import stringConstants from '../../data/json/stringConstants';

/**
 * Biomarker advanced search control.
 */
const BiomarkerAdvancedSearch = (props) => {
    let commonBiomarkerData = stringConstants.biomarker.common;
    let advancedSearch = biomarkerSearchData.advanced_search;

	/**
	 * Function to set protein name value.
	 * @param {string} inputBioSpecimen - input protein name value.
	 **/
	function bioSpecimenNameChange(inputBioSpecimen) {
		let valArr = props.inputValue.bioAdvSearchValError;
		valArr[0] = inputBioSpecimen.length > advancedSearch.specimen_name.length;
		props.setBioAdvSearchData({ bioSpecimen: inputBioSpecimen, proAdvSearchValError: valArr });	
	}

	/**
	 * Function to set gene name value.
	 * @param {string} inputGeneName - input gene name value.
	 **/
	function bioLOINCCodeChange(inputBioLOINCCode) {
		let valArr = props.inputValue.bioAdvSearchValError;
		valArr[1] = inputBioLOINCCode.length > advancedSearch.loinc_code.length;
		props.setBioAdvSearchData({ bioLOINCCode: inputBioLOINCCode, bioAdvSearchValError: valArr });	
	}

	/**
	 * Function to set Assessed Entity Type value.
	 * @param {string} value - input bio assessed entity type value.
	 **/
	const bioAssessedEntityTypeOnChange = (value, name) => {
		props.setBioAdvSearchData({ bioAssessedEntityType: {id: value, name: name} });
	}

	/**
	 * Function to set GO name value.
	 * @param {string} inputProGOName - input GO name value.
	 **/
	function bioBiomarkerEntityChange(inputBioBiomarkerEntity) {
		let valArr = props.inputValue.bioAdvSearchValError;
		valArr[2] = inputBioBiomarkerEntity.length > advancedSearch.biomarker_entity.length;
		props.setBioAdvSearchData({ bioBiomarkerEntity: inputBioBiomarkerEntity, bioAdvSearchValError: valArr });
	}

	/**
	 * Function to set GO id value.
	 * @param {string} inputProGOId - input GO id value.
	 **/
	function bioBiomarkerIdChange(inputBioBiomarkerId) {
		let valArr = props.inputValue.bioAdvSearchValError;
		valArr[3] = inputBioBiomarkerId.length > advancedSearch.biomarker_id.length;
		props.setBioAdvSearchData({ bioBiomarkerId: inputBioBiomarkerId, bioAdvSearchValError: valArr });
	}

	/**
	 * Function to set biomarker disease value.
	 * @param {string} inputBioCondition - input biomarker disease name value.
	 **/
	function bioConditionChange(inputBioCondition) {
		let valArr = props.inputValue.bioAdvSearchValError;
		valArr[4] = inputBioCondition.length > advancedSearch.condition.length;
		props.setBioAdvSearchData({ bioCondition: inputBioCondition, bioAdvSearchValError: valArr });	
	}

	/**
	 * Function to set disease id value.
	 * @param {string} inputBioDiseaseId - input disease id value.
	 **/
	function bioDiseaseIdChange(inputBioDiseaseId) {
		let valArr = props.inputValue.bioAdvSearchValError;
		valArr[5] = inputBioDiseaseId.length > advancedSearch.condition_id.length;
		props.setBioAdvSearchData({ bioDiseaseId: inputBioDiseaseId, bioAdvSearchValError: valArr });
	}

	/**
	 * Function to set pubmed id value.
	 * @param {string} inputBioPublicationId - input pubmed id value.
	 **/
	function bioPublicationIdChange(inputBioPublicationId) {
		let valArr = props.inputValue.bioAdvSearchValError;
		valArr[6] = inputBioPublicationId.length > advancedSearch.publication_id.length;
		props.setBioAdvSearchData({ bioPublicationId: inputBioPublicationId, bioAdvSearchValError: valArr });
	}

	/**
	 * Function to set biomarker type value.
	 * @param {string} value - input biomarker type id value.
	 * @param {string} name - input biomarker type name value.
	 **/
	const bioBestBiomarkerRoleOnChange = (value, name) => {
		props.setBioAdvSearchData({ bioBestBiomarkerRole: {id: value, name: name} });
	}
	 
	/**
	 * Function to clear input field values.
	 **/
	const clearBiomarker = () => {
		props.setBioAdvSearchData({
			bioSpecimen: "",
			bioLOINCCode: "",
			bioAssessedEntityType: { id: "", name: "All" },
			bioBiomarkerEntity: "",
			bioBiomarkerId: "",
			bioCondition: "",
			bioDiseaseId: "",
			bioPublicationId: "",
			bioBestBiomarkerRole: { id: "", name: "All" },
			bioAdvSearchValError: [
			  false,
			  false,
			  false,
			  false,
			  false,
			  false,
			  false,
			]
		});
	};

	return (
		<>
			<Grid
				container
				style={{ margin: "0 0 0 -12px" }}
				spacing={3}
				justifyContent='center'>
				{/* Buttons Top */}
				<Grid item xs={12} sm={10}>
					<div className='gg-align-right pt-2 pb-2 me-1'>
						<Button className='gg-btn-outline me-4' onClick={clearBiomarker}>
							Clear Fields
						</Button>
						<Button
							className='gg-btn-blue'
							onClick={props.searchBiomarkerAdvClick}
							disabled={
								!props.inputValue.bioAdvSearchValError.every(
									(err) => err === false
								)
							}>
							Search Biomarker
						</Button>
					</div>
				</Grid>
				
				{/* Specimen */}
				<Grid item xs={12} sm={10}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonBiomarkerData.specimen_name.tooltip.title}
                                text={commonBiomarkerData.specimen_name.tooltip.text}
                            />
                            {commonBiomarkerData.specimen_name.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.bioSpecimen}
                            setInputValue={bioSpecimenNameChange}
                            placeholder={advancedSearch.specimen_name.placeholder}
							typeahedID={advancedSearch.specimen_name.typeahedID}
							length={advancedSearch.specimen_name.length}
							errorText={advancedSearch.specimen_name.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={bioSpecimenNameChange}
							inputValue={advancedSearch.specimen_name.examples}
						/>
					</FormControl>
				</Grid>
				{/* LOINC code */}
				<Grid item xs={12} sm={10}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonBiomarkerData.specimen_loinc_code.tooltip.title}
                                text={commonBiomarkerData.specimen_loinc_code.tooltip.text}
                            />
                            {commonBiomarkerData.specimen_loinc_code.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.bioLOINCCode}
                            setInputValue={bioLOINCCodeChange}
                            placeholder={advancedSearch.loinc_code.placeholder}
							typeahedID={advancedSearch.loinc_code.typeahedID}
							length={advancedSearch.loinc_code.length}
							errorText={advancedSearch.loinc_code.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={bioLOINCCodeChange}
							inputValue={advancedSearch.loinc_code.examples}
						/>
					</FormControl>
				</Grid>
				{/* Assessed Entity Type */}
				<Grid item xs={12} sm={10}>
					<FormControl
						fullWidth
						variant='outlined'
					>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                                title={commonBiomarkerData.biomarker_entity_type.tooltip.title}
                                text={commonBiomarkerData.biomarker_entity_type.tooltip.text}
                            />
                            {commonBiomarkerData.biomarker_entity_type.name}
						</Typography>
							<SelectControl
								inputValue={props.inputValue.bioAssessedEntityType.id}
								placeholder={advancedSearch.assessed_entity_type.placeholder}
								placeholderId={advancedSearch.assessed_entity_type.placeholderId}
								placeholderName={advancedSearch.assessed_entity_type.placeholderName}
								menu={props.initData.assessed_entity_type.map(a => {return {name:a.charAt(0).toUpperCase() + a.slice(1), id:a}})}
								setInputValue={bioAssessedEntityTypeOnChange}
							/>
						{/* )} */}
					</FormControl>
				</Grid>
				{/*  Biomarker Entity */}
				<Grid item xs={12} sm={10}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonBiomarkerData.biomarker_entity_name.tooltip.title}
                                text={commonBiomarkerData.biomarker_entity_name.tooltip.text}
                            />
                            {commonBiomarkerData.biomarker_entity_name.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.bioBiomarkerEntity}
                            setInputValue={bioBiomarkerEntityChange}
                            placeholder={advancedSearch.biomarker_entity.placeholder}
							typeahedID={advancedSearch.biomarker_entity.typeahedID}
							length={advancedSearch.biomarker_entity.length}
							errorText={advancedSearch.biomarker_entity.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={bioBiomarkerEntityChange}
							inputValue={advancedSearch.biomarker_entity.examples}
						/>
					</FormControl>
				</Grid>
				{/* Biomarker ID */}
				<Grid item xs={12} sm={10}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonBiomarkerData.biomarker_id.tooltip.title}
                                text={commonBiomarkerData.biomarker_id.tooltip.text}
                            />
                            {commonBiomarkerData.biomarker_id.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.bioBiomarkerId}
                            setInputValue={bioBiomarkerIdChange}
                            placeholder={advancedSearch.biomarker_id.placeholder}
							typeahedID={advancedSearch.biomarker_id.typeahedID}
							length={advancedSearch.biomarker_id.length}
							errorText={advancedSearch.biomarker_id.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={bioBiomarkerIdChange}
							inputValue={advancedSearch.biomarker_id.examples}
						/>
					</FormControl>
				</Grid>
				{/* Condition */}
				<Grid item xs={12} sm={10}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonBiomarkerData.condition_name.tooltip.title}
                                text={commonBiomarkerData.condition_name.tooltip.text}
                            />
                            {commonBiomarkerData.condition_name.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.bioCondition}
                            setInputValue={bioConditionChange}
                            placeholder={advancedSearch.condition.placeholder}
							typeahedID={advancedSearch.condition.typeahedID}
							length={advancedSearch.condition.length}
							errorText={advancedSearch.condition.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={bioConditionChange}
							inputValue={advancedSearch.condition.examples}
						/>
					</FormControl>
				</Grid>
				{/* Disease ID */}
				<Grid item xs={12} sm={10}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonBiomarkerData.condition_id.tooltip.title}
                                text={commonBiomarkerData.condition_id.tooltip.text}
                            />
                            {commonBiomarkerData.condition_id.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.bioDiseaseId}
                            setInputValue={bioDiseaseIdChange}
                            placeholder={advancedSearch.condition_id.placeholder}
							typeahedID={advancedSearch.condition_id.typeahedID}
							length={advancedSearch.condition_id.length}
							errorText={advancedSearch.condition_id.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={bioDiseaseIdChange}
							inputValue={advancedSearch.condition_id.examples}
						/>
					</FormControl>
				</Grid>
				{/* Pubmed ID */}
				<Grid item xs={12} sm={10}>
					<FormControl
						fullWidth
						variant='outlined'
					>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                                title={commonBiomarkerData.publication_id.tooltip.title}
                                text={commonBiomarkerData.publication_id.tooltip.text}
                            />
                            {commonBiomarkerData.publication_id.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.bioPublicationId}
                            setInputValue={bioPublicationIdChange}
                            placeholder={advancedSearch.publication_id.placeholder}
							typeahedID={advancedSearch.publication_id.typeahedID}
							length={advancedSearch.publication_id.length}
							errorText={advancedSearch.publication_id.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={bioPublicationIdChange}
							inputValue={advancedSearch.publication_id.examples}
						/>
					</FormControl>
				</Grid>
				{/* BEST Biomarker Role */}
				<Grid item xs={12} sm={10}>
					<FormControl
						fullWidth
						variant='outlined'
					>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                                title={commonBiomarkerData.best_biomarker_role.tooltip.title}
                                text={commonBiomarkerData.best_biomarker_role.tooltip.text}
                            />
                            {commonBiomarkerData.best_biomarker_role.name}
						</Typography>
						<SelectControl
							inputValue={props.inputValue.bioBestBiomarkerRole.id}
							placeholder={advancedSearch.best_biomarker_role.placeholder}
							placeholderId={advancedSearch.best_biomarker_role.placeholderId}
							placeholderName={advancedSearch.best_biomarker_role.placeholderName}
							menu={props.initData.best_biomarker_role.map(a => {return {name:a.charAt(0).toUpperCase() + a.slice(1), id:a}})}
							setInputValue={bioBestBiomarkerRoleOnChange}
						/>
					</FormControl>
				</Grid>
				
				{/* Buttons Buttom */}
				<Grid item xs={12} sm={10}>
					{/* <Row className='gg-align-right pt-3 mb-2 mr-1'> */}
					<div className='gg-align-right pt-3 mb-2 me-1'>
						<Button className='gg-btn-outline me-4' onClick={clearBiomarker}>
							Clear Fields
						</Button>
						<Button
							className='gg-btn-blue'
							onClick={props.searchBiomarkerAdvClick}
							disabled={
								!props.inputValue.bioAdvSearchValError.every(
									(err) => err === false
								)
							}>
							Search Biomarker
						</Button>
					</div>
					{/* </Row> */}
				</Grid>
			</Grid>
		</>
	);
};

export default BiomarkerAdvancedSearch;

BiomarkerAdvancedSearch.propTypes = {
	initData: PropTypes.object,
	inputValue: PropTypes.object,
	searchProteinAdvClick: PropTypes.func,
	setBioAdvSearchData: PropTypes.func,
};
