import React from 'react';
import MultilineAutoTextInput from '../input/MultilineAutoTextInput';
import AutoTextInput from '../input/AutoTextInput';
import SelectControl from '../select/SelectControl';
import HelpTooltip from '../tooltip/HelpTooltip';
import ExampleExploreControl from '../example/ExampleExploreControl';
import ExampleControl from "../example/ExampleControl";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import Button from 'react-bootstrap/Button';
import {sortDropdown} from '../../utils/common';
import '../../css/Search.css';
import diseaseSearchData from '../../data/json/diseaseSearch';
import stringConstants from '../../data/json/stringConstants';

/**
 * Disease advanced search control.
 */
const DiseaseAdvancedSearch = (props) => {
    let advancedSearch = diseaseSearchData.advanced_search;
	let commonDiseaseData = stringConstants.disease.common;
	/**
	 * Function to set disease id value.
	 * @param {string} inputDiseaseIdChange - input disease id value.
	 **/
	function disDiseaseIdChange(inputDiseaseIdChange) {
		let valArr = props.inputValue.disAdvSearchValError;
		valArr[0] = inputDiseaseIdChange.length > advancedSearch.disease_id.length;
		props.setDisAdvSearchData({ disDiseaseId: inputDiseaseIdChange, disAdvSearchValError: valArr });
	}

	/**
	 * Function to set disease name value.
	 * @param {string} inputDiseaseNameChange - input disease name value.
	 **/
	function disDiseaseNameChange(inputDiseaseNameChange) {
		let valArr = props.inputValue.disAdvSearchValError;
		valArr[1] = inputDiseaseNameChange.length > advancedSearch.disease_name.length;
		props.setDisAdvSearchData({ disDiseaseName: inputDiseaseNameChange, disAdvSearchValError: valArr });
	}

	/**
	 * Function to set search type value.
	 * @param {string} value - input search type value.
	 **/
	function disSearchTypeChange(value, name) {
		props.setDisAdvSearchData({ disSearchType: {id: value, name: name} });
	}

	/**
	 * Function to set organism value.
	 * @param {string} value - input organism.
	 **/
	function disOrganismNameChange(value, name) {
		props.setDisAdvSearchData({ disDiseaseOrganism: {id: value, name: name} });	
	}

	/**
	 * Function to set biomarker id value.
	 * @param {string} inputDisBiomarkerId - input biomarker id value.
	 **/
	function disBiomarkerIdChange(inputDisBiomarkerId) {
		let valArr = props.inputValue.disAdvSearchValError;
		valArr[2] = inputDisBiomarkerId.length > advancedSearch.biomarker_id.length;
		props.setDisAdvSearchData({ disBiomarkerId: inputDisBiomarkerId, disAdvSearchValError: valArr });
	}

	/**
	 * Function to set biomarker type value.
	 * @param {string} value - input biomarker type.
	 **/
	function disBiomarkerTypeChange(value, name) {
		props.setDisAdvSearchData({ disBiomarkerType: {id: value, name: name} });
	}

	/**
	 * Function to set gene name value.
	 * @param {string} inputDisGeneName - input gene name value.
	 **/
	function disGeneNameChange(inputDisGeneName) {
		let valArr = props.inputValue.disAdvSearchValError;
		valArr[3] = inputDisGeneName.length > advancedSearch.gene_name.length;
		props.setDisAdvSearchData({ disGeneName: inputDisGeneName, disAdvSearchValError: valArr });
	}


	/**
	 * Function to set refseq id value.
	 * @param {string} inputDisRefSeqId - input refseq id value.
	 **/
	function disRefSeqIdChange(inputDisRefSeqId) {
		let valArr = props.inputValue.disAdvSearchValError;
		valArr[4] = inputDisRefSeqId.length > advancedSearch.refseq_id.length;
		props.setDisAdvSearchData({ disRefSeqId: inputDisRefSeqId, disAdvSearchValError: valArr });
	}

	/**
	 * Function to set protein id value.
	 * @param {string} inputDisProteinId - input protein id value.
	 **/
	function disProteinIdChange(inputDisProteinId) {
		let valArr = props.inputValue.disAdvSearchValError;
		valArr[5] = inputDisProteinId.length > advancedSearch.uniprot_canonical_ac.length;
		props.setDisAdvSearchData({ disProteinId: inputDisProteinId, disAdvSearchValError: valArr });
	}

	/**
	 * Function to set protein name value.
	 * @param {string} inputDisProteinName - input protein name value.
	 **/
	function disProteinNameChange(inputDisProteinName) {
		let valArr = props.inputValue.disAdvSearchValError;
		valArr[6] = inputDisProteinName.length > advancedSearch.protein_name.length;
		props.setDisAdvSearchData({ disProteinName: inputDisProteinName, disAdvSearchValError: valArr });
	}

	/**
	 * Function to set glycan id value.
	 * @param {string} inputDisGlycanId - input glycan id value.
	 **/
	function disGlycanIdChange(inputDisGlycanId) {
		let valArr = props.inputValue.disAdvSearchValError;
		valArr[7] = inputDisGlycanId.length > advancedSearch.glycan_identifier.length;
		props.setDisAdvSearchData({ disGlycanId: inputDisGlycanId, disAdvSearchValError: valArr });
	}

	/**
	 * Function to set glycan name value.
	 * @param {string} inputDisGlycanName - input glycan name value.
	 **/
	function disGlycanNameChange(inputDisGlycanName) {
		let valArr = props.inputValue.disAdvSearchValError;
		valArr[8] = inputDisGlycanName.length > advancedSearch.glycan_name.length;
		props.setDisAdvSearchData({ disGlycanName: inputDisGlycanName, disAdvSearchValError: valArr });
	}
	 
	/**
	 * Function to clear input field values.
	 **/
	const clearDisease = () => {
		props.setDisAdvSearchData({
		disDiseaseId: "",
		disDiseaseName: "",
		disSearchType: { id: "hierarchy", name: "Hierarchy"  },
		disDiseaseOrganism: { id: "", name: "All" },
		disBiomarkerId: "",
		disBiomarkerType:  { id: "", name: "All" },
		disGeneName: "",
		disRefSeqId: "",
		disProteinId: "",
		disProteinName: "",
		disGlycanId: "",
		disGlycanName: "",
		disAdvSearchValError: [
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false
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
						<Button className='gg-btn-outline me-4' onClick={clearDisease}>
							Clear Fields
						</Button>
						<Button
							className='gg-btn-blue'
							onClick={props.searchDiseaseAdvClick}
							disabled={
								!props.inputValue.disAdvSearchValError.every(
									(err) => err === false
								)
							}>
							Search Disease
						</Button>
					</div>
				</Grid>
				{/* Disease ID */}
				<Grid item xs={12} sm={10}>
					<FormControl fullWidth variant="outlined">
						<Typography className={"search-lbl"} gutterBottom>
						<HelpTooltip
							title={commonDiseaseData.disease_id.tooltip.title}
							text={commonDiseaseData.disease_id.tooltip.text}
						/>
						{commonDiseaseData.disease_id.name}
						</Typography>
						<MultilineAutoTextInput
							fullWidth
							inputValue={props.inputValue.disDiseaseId}
							setInputValue={disDiseaseIdChange}
							placeholder={advancedSearch.disease_id.placeholder}
							typeahedID={advancedSearch.disease_id.typeahedID}
							length={advancedSearch.disease_id.length}
							errorText={advancedSearch.disease_id.errorText}
						/>
						<ExampleControl
							exampleMap={advancedSearch.disease_id.examples}
							type={advancedSearch.disease_id.examples.disease_id.id}
							setInputValue={disDiseaseIdChange}
						/>
					</FormControl>
				</Grid>
				{/* Disease Name */}
				<Grid item xs={12} sm={10}>
					<FormControl fullWidth variant="outlined">
						<Grid container spacing={2}>
							<Grid item xs={12} sm={9}>
								<Typography className={"search-lbl"} gutterBottom>
								<HelpTooltip
									title={commonDiseaseData.disease_name.tooltip.title}
									text={commonDiseaseData.disease_name.tooltip.text}
								/>
								{commonDiseaseData.disease_name.name}
								</Typography>
										<AutoTextInput
											inputValue={props.inputValue.disDiseaseName}
											setInputValue={disDiseaseNameChange}
											placeholder={advancedSearch.disease_name.placeholder}
											typeahedID={advancedSearch.disease_name.typeahedID}
											length={advancedSearch.disease_name.length}
											errorText={advancedSearch.disease_name.errorText}
										/>
									<ExampleExploreControl
											setInputValue={disDiseaseNameChange}
											inputValue={advancedSearch.disease_name.examples}
										/>
							</Grid>

							<Grid item xs={12} sm={3}>
								<Typography className={"search-lbl"} gutterBottom>
								&nbsp;
								</Typography>
								<FormControl variant="outlined" fullWidth>
								<SelectControl
									inputValue={props.inputValue.disSearchType.id}
									menu={advancedSearch.search_type.menu}
									setInputValue={disSearchTypeChange}
								/>
								</FormControl>
							</Grid>
						</Grid>
					</FormControl>
				</Grid>
				{/* Organism */}
				<Grid item xs={12} sm={10}>
					<FormControl
						fullWidth
						variant='outlined'
					>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
								title={commonDiseaseData.organism.tooltip.title}
								text={commonDiseaseData.organism.tooltip.text}
							/>
							{commonDiseaseData.organism.name}
						</Typography>
						<SelectControl
							inputValue={props.inputValue.disDiseaseOrganism.id}
							placeholder={advancedSearch.organism.placeholder}
							placeholderId={advancedSearch.organism.placeholderId}
							placeholderName={advancedSearch.organism.placeholderName}
							menu={props.initData.organism}
							setInputValue={disOrganismNameChange}
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
								title={commonDiseaseData.biomarker_id.tooltip.title}
								text={commonDiseaseData.biomarker_id.tooltip.text}
							/>
							{commonDiseaseData.biomarker_id.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.disBiomarkerId}
							setInputValue={disBiomarkerIdChange}
							placeholder={advancedSearch.biomarker_id.placeholder}
							typeahedID={advancedSearch.biomarker_id.typeahedID}
							length={advancedSearch.biomarker_id.length}
							errorText={advancedSearch.biomarker_id.errorText}
						/>
						<ExampleExploreControl
							setInputValue={disBiomarkerIdChange}
							inputValue={advancedSearch.biomarker_id.examples}
						/>
					</FormControl>
				</Grid>
				{/* Biomarker Type */}
				<Grid item xs={12} sm={10}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
								title={commonDiseaseData.biomarker_type.tooltip.title}
								text={commonDiseaseData.biomarker_type.tooltip.text}
							/>
							{commonDiseaseData.biomarker_type.name}
						</Typography>
						<SelectControl
							inputValue={props.inputValue.disBiomarkerType.id}
							placeholder={advancedSearch.biomarker_type.placeholder}
							placeholderId={advancedSearch.biomarker_type.placeholderId}
							placeholderName={advancedSearch.biomarker_type.placeholderName}
							menu={props.initData.biomarker_types.map(a => {return {name:a.charAt(0).toUpperCase() + a.slice(1), id:a}})}
							setInputValue={disBiomarkerTypeChange}
						/>
					</FormControl>
				</Grid>
				{/*  Gene Name */}
				<Grid item xs={12} sm={10}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonDiseaseData.gene_name.tooltip.title}
                                text={commonDiseaseData.gene_name.tooltip.text}
                            />
                            {commonDiseaseData.gene_name.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.disGeneName}
                            setInputValue={disGeneNameChange}
                            placeholder={advancedSearch.gene_name.placeholder}
							typeahedID={advancedSearch.gene_name.typeahedID}
							length={advancedSearch.gene_name.length}
							errorText={advancedSearch.gene_name.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={disGeneNameChange}
							inputValue={advancedSearch.gene_name.examples}
						/>
					</FormControl>
				</Grid>
				{/* RefSeq ID */}
				<Grid item xs={12} sm={10}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonDiseaseData.refseq_id.tooltip.title}
                                text={commonDiseaseData.refseq_id.tooltip.text}
                            />
                            {commonDiseaseData.refseq_id.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.disRefSeqId}
                            setInputValue={disRefSeqIdChange}
                            placeholder={advancedSearch.refseq_id.placeholder}
							typeahedID={advancedSearch.refseq_id.typeahedID}
							length={advancedSearch.refseq_id.length}
							errorText={advancedSearch.refseq_id.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={disRefSeqIdChange}
							inputValue={advancedSearch.refseq_id.examples}
						/>
					</FormControl>
				</Grid>
				{/* Protein ID */}
				<Grid item xs={12} sm={10}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonDiseaseData.protein_id.tooltip.title}
                                text={commonDiseaseData.protein_id.tooltip.text}
                            />
                            {commonDiseaseData.protein_id.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.disProteinId}
                            setInputValue={disProteinIdChange}
                            placeholder={advancedSearch.uniprot_canonical_ac.placeholder}
							typeahedID={advancedSearch.uniprot_canonical_ac.typeahedID}
							length={advancedSearch.uniprot_canonical_ac.length}
							errorText={advancedSearch.uniprot_canonical_ac.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={disProteinIdChange}
							inputValue={advancedSearch.uniprot_canonical_ac.examples}
						/>
					</FormControl>
				</Grid>				
				{/* Protein Name */}
				<Grid item xs={12} sm={10}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonDiseaseData.protein_name.tooltip.title}
                                text={commonDiseaseData.protein_name.tooltip.text}
                            />
                            {commonDiseaseData.protein_name.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.disProteinName}
                            setInputValue={disProteinNameChange}
                            placeholder={advancedSearch.protein_name.placeholder}
							typeahedID={advancedSearch.protein_name.typeahedID}
							length={advancedSearch.protein_name.length}
							errorText={advancedSearch.protein_name.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={disProteinNameChange}
							inputValue={advancedSearch.protein_name.examples}
						/>
					</FormControl>
				</Grid>
				{/* Glycan ID */}
				<Grid item xs={12} sm={10}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonDiseaseData.glycan_id.tooltip.title}
                                text={commonDiseaseData.glycan_id.tooltip.text}
                            />
                            {commonDiseaseData.glycan_id.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.disGlycanId}
                            setInputValue={disGlycanIdChange}
                            placeholder={advancedSearch.glycan_identifier.placeholder}
							typeahedID={advancedSearch.glycan_identifier.typeahedID}
							length={advancedSearch.glycan_identifier.length}
							errorText={advancedSearch.glycan_identifier.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={disGlycanIdChange}
							inputValue={advancedSearch.glycan_identifier.examples}
						/>
					</FormControl>
				</Grid>
				{/* Glycan Name */}
				<Grid item xs={12} sm={10}>
					<FormControl
						fullWidth
						variant='outlined'
					>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                                title={commonDiseaseData.glycan_name.tooltip.title}
                                text={commonDiseaseData.glycan_name.tooltip.text}
                            />
                            {commonDiseaseData.glycan_name.name}
						</Typography>
							<AutoTextInput
								inputValue={props.inputValue.disGlycanName}
								setInputValue={disGlycanNameChange}
								placeholder={advancedSearch.glycan_name.placeholder}
								typeahedID={advancedSearch.glycan_name.typeahedID}
								length={advancedSearch.glycan_name.length}
								errorText={advancedSearch.glycan_name.errorText}
							/>
							<ExampleExploreControl
								setInputValue={disGlycanNameChange}
								inputValue={advancedSearch.glycan_name.examples}
							/>
					</FormControl>
				</Grid>								
				{/* Buttons Buttom */}
				<Grid item xs={12} sm={10}>
					<div className='gg-align-right pt-3 mb-2 me-1'>
						<Button className='gg-btn-outline me-4' onClick={clearDisease}>
							Clear Fields
						</Button>
						<Button
							className='gg-btn-blue'
							onClick={props.searchDiseaseAdvClick}
							disabled={
								!props.inputValue.disAdvSearchValError.every(
									(err) => err === false
								)
							}>
							Search Disease
						</Button>
					</div>
				</Grid>
			</Grid>
		</>
	);
};

export default DiseaseAdvancedSearch;

DiseaseAdvancedSearch.propTypes = {
	initData: PropTypes.object,
	inputValue: PropTypes.object,
	searchProteinAdvClick: PropTypes.func,
	setBioAdvSearchData: PropTypes.func,
};
