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
import proteinSearchData from '../../data/json/proteinSearch';
import stringConstants from '../../data/json/stringConstants';

/**
 * Protein advanced search control.
 */
const ProteinAdvancedSearch = (props) => {
    let commonProteinData = stringConstants.protein.common;
    let advancedSearch = proteinSearchData.advanced_search;

	/**
	 * Function to set protein id value.
	 * @param {string} inputProteinId - input protein id value.
	 **/
	function proteinIdChange(inputProteinId) {
		let valArr = props.inputValue.proAdvSearchValError;
		valArr[0] = inputProteinId.length > advancedSearch.uniprot_canonical_ac.length;
		props.setProAdvSearchData({ proteinId: inputProteinId, proAdvSearchValError: valArr });
	}

	/**
	 * Function to set RefSeq id value.
	 * @param {string} inputProRefSeqId - input RefSeq id value value.
	 **/
	function proRefSeqIdChange(inputProRefSeqId) {
		let valArr = props.inputValue.proAdvSearchValError;
		valArr[1] = inputProRefSeqId.length > advancedSearch.refseq_ac.length;
		props.setProAdvSearchData({ proRefSeqId: inputProRefSeqId, proAdvSearchValError: valArr });
	}

	/**
	 * Function to set mass value.
	 * @param {array} inputMass - input min, max mass value.
	 **/
	function proMassInputChange(inputMass) {
        props.setProAdvSearchData({ proMassInput: inputMass })
    }
    
	/**
	 * Function to set slider mass value.
	 * @param {array} inputMass - input min, max mass value.
	 **/
    function proMassSliderChange(inputMass) {
        props.setProAdvSearchData({ proMass: inputMass })
	}

	/**
	 * Function to set organism value.
	 * @param {string} value - input organism id value.
	 * @param {string} name - input organism name value.
	 **/
	const proOrganismOnChange = (value, name) => {
		props.setProAdvSearchData({ proOrganism: {id: value, name: name} });
	}

	/**
	 * Function to set biomarker type value.
	 * @param {string} value - input biomarker type id value.
	 * @param {string} name - input biomarker type name value.
	 **/
	const proBiomarkerTypeOnChange = (value, name) => {
		props.setProAdvSearchData({ proBiomarkerType: {id: value, name: name} });
	}

	/**
	 * Function to set protein name value.
	 * @param {string} inputProteinName - input protein name value.
	 **/
	function proteinNameChange(inputProteinName) {
		let valArr = props.inputValue.proAdvSearchValError;
		valArr[2] = inputProteinName.length > advancedSearch.protein_name.length;
		props.setProAdvSearchData({ proteinName: inputProteinName, proAdvSearchValError: valArr });	
	}

	/**
	 * Function to set biomarker disease value.
	 * @param {string} inputBiomarkerDisease - input biomarker disease name value.
	 **/
	function proBiomarkerDiseaseChange(inputProBiomarkerDisease) {
		let valArr = props.inputValue.proAdvSearchValError;
		valArr[13] = inputProBiomarkerDisease.length > advancedSearch.biomarker_disease.length;
		props.setProAdvSearchData({ proBiomarkerDisease: inputProBiomarkerDisease, proAdvSearchValError: valArr });	
	}

	/**
	 * Function to set gene name value.
	 * @param {string} inputGeneName - input gene name value.
	 **/
	function proGeneNameChange(inputGeneName) {
		let valArr = props.inputValue.proAdvSearchValError;
		valArr[3] = inputGeneName.length > advancedSearch.gene_name.length;
		props.setProAdvSearchData({ proGeneName: inputGeneName, proAdvSearchValError: valArr });	
	}

	/**
	 * Function to set GO name value.
	 * @param {string} inputProGOName - input GO name value.
	 **/
	function proGONameChange(inputProGOName) {
		let valArr = props.inputValue.proAdvSearchValError;
		valArr[4] = inputProGOName.length > advancedSearch.go_term.length;
		props.setProAdvSearchData({ proGOName: inputProGOName, proAdvSearchValError: valArr });
	}


	/**
	 * Function to set GO id value.
	 * @param {string} inputProGOId - input GO id value.
	 **/
	function proGOIdChange(inputProGOId) {
		let valArr = props.inputValue.proAdvSearchValError;
		valArr[5] = inputProGOId.length > advancedSearch.go_id.length;
		props.setProAdvSearchData({ proGOId: inputProGOId, proAdvSearchValError: valArr });
	}


	/**
	 * Function to set input amino acid value.
	 * @param {string} inputProAminoAcid - input amino acid value.
	 **/
	function proAminoAcidChange(inputProAminoAcid) {
		props.setProAdvSearchData({ proAminoAcid: inputProAminoAcid });
	}

	/**
	 * Function to set input amino acid operation value.
	 * @param {string} value - input amino acid operation value.
	 **/
	const proAminoAcidOperationOnChange = (value) => {
		props.setProAdvSearchData({ proAminoAcidOperation: value });
	}

	/**
	 * Function to set protein or peptide sequence value.
	 * @param {string} inputProSequence - input protein or peptide sequence value.
	 **/
	function proSequenceChange(inputProSequence) {
		let valArr = props.inputValue.proAdvSearchValError;
		valArr[6] = inputProSequence.length > advancedSearch.sequence.length;
		props.setProAdvSearchData({ proSequence: inputProSequence, proAdvSearchValError: valArr });
	}

	/**
	 * Function to handle onchange event for protein or peptide sequence.
	 * @param {object} event - event object.
	 **/
	const SequenceChange = (event) => {
		let valArr = props.inputValue.proAdvSearchValError;
		valArr[6] = event.target.value.length > advancedSearch.sequence.length;
		props.setProAdvSearchData({ proSequence: event.target.value, proAdvSearchValError: valArr });
	}
	
	/**
	 * Function to set pathway id value.
	 * @param {string} inputProPathwayId - input pathway id value.
	 **/
	function proPathwayIdChange(inputProPathwayId) {
		let valArr = props.inputValue.proAdvSearchValError;
		valArr[7] = inputProPathwayId.length > advancedSearch.pathway_id.length;
		props.setProAdvSearchData({ proPathwayId: inputProPathwayId, proAdvSearchValError: valArr });
	}

	/**
	 * Function to set pubmed id value.
	 * @param {string} inputProPubId - input pubmed id value.
	 **/
	function proPubIdChange(inputProPubId) {
		let valArr = props.inputValue.proAdvSearchValError;
		valArr[8] = inputProPubId.length > advancedSearch.pmid.length;
		props.setProAdvSearchData({ proPubId: inputProPubId, proAdvSearchValError: valArr });
	}

	/**
	 * Function to set glycosylation evidence type value.
	 * @param {string} value - input glycosylation evidence type value.
	 **/
	const proGlyEvidenceOnChange = (value) => {
		props.setProAdvSearchData({ proGlyEvidence: value });
	}

	/**
	 * Function to set glycosylation type value.
	 * @param {string} value - input glycosylation evidence type value.
	 **/
	const proGlycosylationTypeOnChange = (value) => {
		props.setProAdvSearchData({ proGlycosylationType: value });
		props.setProAdvSearchData({ proGlycosylationSubType: "" });
	}

	/**
	 * Function to set glycosylation sub type value.
	 * @param {string} value - input glycosylation evidence sub type value.
	 **/
	const proGlycosylationSubTypeOnChange = (value) => {
		props.setProAdvSearchData({ proGlycosylationSubType: value });
	}

	/**
	 * Function to set disease name value.
	 * @param {string} inputProDiseaseName - input disease name value.
	 **/
	function proDiseaseNameChange(inputProDiseaseName) {
		let valArr = props.inputValue.proAdvSearchValError;
		valArr[9] = inputProDiseaseName.length > advancedSearch.disease_name.length;
		props.setProAdvSearchData({ proDiseaseName: inputProDiseaseName, proAdvSearchValError: valArr });
	}

	/**
	 * Function to set disease id value.
	 * @param {string} inputProDiseaseId - input disease id value.
	 **/
	function proDiseaseIdChange(inputProDiseaseId) {
		let valArr = props.inputValue.proAdvSearchValError;
		valArr[10] = inputProDiseaseId.length > advancedSearch.disease_id.length;
		props.setProAdvSearchData({ proDiseaseId: inputProDiseaseId, proAdvSearchValError: valArr });
	}

	/**
	 * Function to set attached glycan id value.
	 * @param {string} inputProAttachedGlycanId - input attached glycan id value.
	 **/
	function proAttachedGlycanIdChange(inputProAttachedGlycanId) {
		let valArr = props.inputValue.proAdvSearchValError;
		valArr[11] = inputProAttachedGlycanId.length > advancedSearch.attached_glycan_id.length;
		props.setProAdvSearchData({ proAttachedGlycanId: inputProAttachedGlycanId, proAdvSearchValError: valArr });
	}

	/**
	 * Function to set binding glycan id value.
	 * @param {string} inputProBindingGlycanId - input binding glycan id value.
	 **/
	function proBindingGlycanIdChange(inputProBindingGlycanId) {
		let valArr = props.inputValue.proAdvSearchValError;
		valArr[12] = inputProBindingGlycanId.length > advancedSearch.binding_glycan_id.length;
		props.setProAdvSearchData({ proBindingGlycanId: inputProBindingGlycanId, proAdvSearchValError: valArr });
	}
	 
	/**
	 * Function to clear input field values.
	 **/
	const clearProtein = () => {
		props.setProAdvSearchData({
			proteinId: '',
			proRefSeqId: '',
			proMass: [
				Math.floor(props.initData.protein_mass.min),
				Math.ceil(props.initData.protein_mass.max),
			],
			proMassInput: [
				Math.floor(props.initData.protein_mass.min).toLocaleString('en-US'),
				Math.ceil(props.initData.protein_mass.max).toLocaleString('en-US'),
			],
			proMassRange: [
				Math.floor(props.initData.protein_mass.min),
				Math.ceil(props.initData.protein_mass.max),
			],
			proOrganism: {id: advancedSearch.organism.placeholderId, name: advancedSearch.organism.placeholderName},
			proteinName: '',
			proGeneName: '',
			proGOName: '',
			proGOId: '',
			proAminoAcid: [],
			proAminoAcidOperation: 'or',
			proSequence: '',
			proPathwayId: '',
			proPubId: '',
			proGlyEvidence: advancedSearch.glycosylation_evidence.placeholderId,
			proGlycosylationType: advancedSearch.glycosylation_type.placeholderId,
			proGlycosylationSubType: advancedSearch.glycosylation_subtype.placeholderId,
			proDiseaseName: '',
			proDiseaseId: '',
			proAttachedGlycanId: '',
			proBindingGlycanId: '',
			proBiomarkerDisease: "",
			proBiomarkerType: { id: "", name: "" },
			proAdvSearchValError: [false, false, false, false, false,
				false, false, false, false, false, false, false, false]
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
				<Grid item size={{ xs: 12, sm: 10 }}>
					<div className='gg-align-right pt-2 pb-2 me-1'>
						<Button className='gg-btn-outline me-4' onClick={clearProtein}>
							Clear Fields
						</Button>
						<Button
							className='gg-btn-blue'
							onClick={props.searchProteinAdvClick}
							disabled={
								!props.inputValue.proAdvSearchValError.every(
									(err) => err === false
								)
							}>
							Search Protein
						</Button>
					</div>
				</Grid>
				{/* Protein Id */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl fullWidth variant='outlined'>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                                title={commonProteinData.uniprot_canonical_ac.tooltip.title}
                                text={commonProteinData.uniprot_canonical_ac.tooltip.text}
                                urlText={commonProteinData.uniprot_canonical_ac.tooltip.urlText}
                                url={commonProteinData.uniprot_canonical_ac.tooltip.url}
                            />
                            {commonProteinData.uniprot_canonical_ac.name}
						</Typography>
						<MultilineAutoTextInput
							fullWidth
							inputValue={props.inputValue.proteinId}
                            setInputValue={proteinIdChange}
                            placeholder={advancedSearch.uniprot_canonical_ac.placeholder}
							typeahedID={advancedSearch.uniprot_canonical_ac.typeahedID}
							length={advancedSearch.uniprot_canonical_ac.length}
							errorText={advancedSearch.uniprot_canonical_ac.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={proteinIdChange}
							inputValue={advancedSearch.uniprot_canonical_ac.examples}
						/>
					</FormControl>
				</Grid>
				{/* RefSeq Accession */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonProteinData.refseq_ac.tooltip.title}
                                text={commonProteinData.refseq_ac.tooltip.text}
                                urlText={commonProteinData.refseq_ac.tooltip.urlText}
                                url={commonProteinData.refseq_ac.tooltip.url}
                            />
                            {commonProteinData.refseq_ac.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.proRefSeqId}
                            setInputValue={proRefSeqIdChange}
                            placeholder={advancedSearch.refseq_ac.placeholder}
							typeahedID={advancedSearch.refseq_ac.typeahedID}
							length={advancedSearch.refseq_ac.length}
							errorText={advancedSearch.refseq_ac.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={proRefSeqIdChange}
							inputValue={advancedSearch.refseq_ac.examples}
						/>
					</FormControl>
				</Grid>
				{/* Chemical Mass */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl fullWidth>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
								title={commonProteinData.mass.tooltip.title}
								text={commonProteinData.mass.tooltip.text}
							/>
							{commonProteinData.mass.name}
						</Typography>
						<RangeInputSlider
							step={10}
							min={props.inputValue.proMassRange[0]}
							max={props.inputValue.proMassRange[1]}
							inputClass='pro-rng-input'
							inputValue={props.inputValue.proMassInput}
							setInputValue={proMassInputChange}
							inputValueSlider={props.inputValue.proMass}
							setSliderInputValue={proMassSliderChange}
						/>
					</FormControl>
				</Grid>
				{/* Organism */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl
						fullWidth
						variant='outlined'
					>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                                title={commonProteinData.organism.tooltip.title}
                                text={commonProteinData.organism.tooltip.text}
                            />
                            {commonProteinData.organism.name}
						</Typography>
						<SelectControl
							inputValue={props.inputValue.proOrganism.id}
							placeholder={advancedSearch.organism.placeholder}
							placeholderId={advancedSearch.organism.placeholderId}
							placeholderName={advancedSearch.organism.placeholderName}
							menu={props.initData.organism}
							setInputValue={proOrganismOnChange}
						/>
					</FormControl>
				</Grid>
				{/* Protein Name */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonProteinData.protein_name.tooltip.title}
                                text={commonProteinData.protein_name.tooltip.text}
                                urlText={commonProteinData.protein_name.tooltip.urlText}
                                url={commonProteinData.protein_name.tooltip.url}
                            />
                            {commonProteinData.protein_name.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.proteinName}
                            setInputValue={proteinNameChange}
                            placeholder={advancedSearch.protein_name.placeholder}
							typeahedID={advancedSearch.protein_name.typeahedID}
							length={advancedSearch.protein_name.length}
							errorText={advancedSearch.protein_name.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={proteinNameChange}
							inputValue={advancedSearch.protein_name.examples}
						/>
					</FormControl>
				</Grid>
				{/* Gene Name */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonProteinData.gene_name.tooltip.title}
                                text={commonProteinData.gene_name.tooltip.text}
                                urlText={commonProteinData.gene_name.tooltip.urlText}
                                url={commonProteinData.gene_name.tooltip.url}
                            />
                            {commonProteinData.gene_name.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.proGeneName}
                            setInputValue={proGeneNameChange}
                            placeholder={advancedSearch.gene_name.placeholder}
							typeahedID={advancedSearch.gene_name.typeahedID}
							length={advancedSearch.gene_name.length}
							errorText={advancedSearch.gene_name.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={proGeneNameChange}
							inputValue={advancedSearch.gene_name.examples}
						/>
					</FormControl>
				</Grid>
				{/*  GO Name */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonProteinData.go_term.tooltip.title}
                                text={commonProteinData.go_term.tooltip.text}
                                urlText={commonProteinData.go_term.tooltip.urlText}
                                url={commonProteinData.go_term.tooltip.url}
                            />
                            {commonProteinData.go_term.name}
						</Typography>
						<CategorizedAutoTextInput
							inputValue={props.inputValue.proGOName}
                            setInputValue={proGONameChange}
                            placeholder={advancedSearch.go_term.placeholder}
							typeahedID={advancedSearch.go_term.typeahedID}
							length={advancedSearch.go_term.length}
							errorText={advancedSearch.go_term.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={proGONameChange}
							inputValue={advancedSearch.go_term.examples}
						/>
					</FormControl>
				</Grid>
				{/* GO ID */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonProteinData.go_id.tooltip.title}
                                text={commonProteinData.go_id.tooltip.text}
                                urlText={commonProteinData.go_id.tooltip.urlText}
                                url={commonProteinData.go_id.tooltip.url}
                            />
                            {commonProteinData.go_id.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.proGOId}
                            setInputValue={proGOIdChange}
                            placeholder={advancedSearch.go_id.placeholder}
							typeahedID={advancedSearch.go_id.typeahedID}
							length={advancedSearch.go_id.length}
							errorText={advancedSearch.go_id.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={proGOIdChange}
							inputValue={advancedSearch.go_id.examples}
						/>
					</FormControl>
				</Grid>
				{/* Bound Glycan */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonProteinData.binding_glycan_id.tooltip.title}
                                text={commonProteinData.binding_glycan_id.tooltip.text}
                                urlText={commonProteinData.binding_glycan_id.tooltip.urlText}
                                url={commonProteinData.binding_glycan_id.tooltip.url}
                            />
                            {commonProteinData.binding_glycan_id.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.proBindingGlycanId}
                            setInputValue={proBindingGlycanIdChange}
                            placeholder={advancedSearch.binding_glycan_id.placeholder}
							typeahedID={advancedSearch.binding_glycan_id.typeahedID}
							length={advancedSearch.binding_glycan_id.length}
							errorText={advancedSearch.binding_glycan_id.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={proBindingGlycanIdChange}
							inputValue={advancedSearch.binding_glycan_id.examples}
						/>
					</FormControl>
				</Grid>
				{/* Glycosylation  Type */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl
						fullWidth
						variant='outlined'
					>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                                title={commonProteinData.glycosylation_type.tooltip.title}
                                text={commonProteinData.glycosylation_type.tooltip.text}
                            />
                            {commonProteinData.glycosylation_type.name}
						</Typography>
						{/* {advancedSearch.glycosylation_type && ( */}
							<SelectControl
								inputValue={props.inputValue.proGlycosylationType}
								placeholder={advancedSearch.glycosylation_type.placeholder}
								placeholderId={advancedSearch.glycosylation_type.placeholderId}
								placeholderName={advancedSearch.glycosylation_type.placeholderName}
								menu={Object.keys(props.initData.glycosylation_types).map(a => ({name:a, id:a}))}
								setInputValue={proGlycosylationTypeOnChange}
							/>
						{/* )} */}
					</FormControl>
				</Grid>
				{/* Glycosylation  Subtype */}
				{props.inputValue.proGlycosylationType !== advancedSearch.glycosylation_type.placeholderId 
				 && props.initData.glycosylation_types[props.inputValue.proGlycosylationType].length > 0
				 && <Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl
						fullWidth
						variant='outlined'
					>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                                title={commonProteinData.glycosylation_subtype.tooltip.title}
                                text={commonProteinData.glycosylation_subtype.tooltip.text}
                            />
                            {commonProteinData.glycosylation_subtype.name}
						</Typography>
							<SelectControl
								inputValue={props.inputValue.proGlycosylationSubType}
								placeholder={advancedSearch.glycosylation_subtype.placeholder}
								placeholderId={advancedSearch.glycosylation_subtype.placeholderId}
								placeholderName={advancedSearch.glycosylation_subtype.placeholderName}
								menu={props.initData.glycosylation_types[props.inputValue.proGlycosylationType].map(a => ({name:a, id:a}))}
								setInputValue={proGlycosylationSubTypeOnChange}
							/>
					</FormControl>
				</Grid>}
				{/* Covalently Attached Glycan */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonProteinData.attached_glycan_id.tooltip.title}
                                text={commonProteinData.attached_glycan_id.tooltip.text}
                                urlText={commonProteinData.attached_glycan_id.tooltip.urlText}
                                url={commonProteinData.attached_glycan_id.tooltip.url}
                            />
                            {commonProteinData.attached_glycan_id.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.proAttachedGlycanId}
                            setInputValue={proAttachedGlycanIdChange}
                            placeholder={advancedSearch.attached_glycan_id.placeholder}
							typeahedID={advancedSearch.attached_glycan_id.typeahedID}
							length={advancedSearch.attached_glycan_id.length}
							errorText={advancedSearch.attached_glycan_id.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={proAttachedGlycanIdChange}
							inputValue={advancedSearch.attached_glycan_id.examples}
						/>
					</FormControl>
				</Grid>
				{/* Glycosylated Amino Acid */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl fullWidth>
						<Grid container spacing={2} alignItems='center'>
							<Grid item size={{ xs: 9, sm: 9 }}>
								<Typography
									className={'search-lbl'}
									gutterBottom
								>
									<HelpTooltip
                                        title={commonProteinData.glycosylated_aa.tooltip.title}
                                        text={commonProteinData.glycosylated_aa.tooltip.text}
                                    />
                                    {commonProteinData.glycosylated_aa.name}
								</Typography>
								<MultiselectTextInput
									options={props.initData.aa_list.sort(sortDropdown)}
									inputValue={props.inputValue.proAminoAcid}
									setInputValue={proAminoAcidChange}
									placeholder={advancedSearch.aa_list.placeholder}
								/>
							</Grid>
							<Grid item size={{ xs: 3, sm: 3 }}>
                                <Typography className={'search-lbl'} gutterBottom>
									&nbsp;
								</Typography>
                                <FormControl 
                                    variant='outlined' 
                                    fullWidth
                                >
									<SelectControl
										inputValue={props.inputValue.proAminoAcidOperation}
										menu={advancedSearch.aa_list.operations}
										setInputValue={proAminoAcidOperationOnChange}
									/>
								</FormControl>
							</Grid>
						</Grid>
					</FormControl>
				</Grid>
				{/* Glycosylation Evidence Type */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl
						fullWidth
						variant='outlined'
					>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                                title={commonProteinData.glycosylation_evidence.tooltip.title}
                                text={commonProteinData.glycosylation_evidence.tooltip.text}
                            />
                            {commonProteinData.glycosylation_evidence.name}
						</Typography>
						<SelectControl
							inputValue={props.inputValue.proGlyEvidence}
							placeholder={advancedSearch.glycosylation_evidence.placeholder}
							placeholderId={advancedSearch.glycosylation_evidence.placeholderId}
							placeholderName={advancedSearch.glycosylation_evidence.placeholderName}
							menu={props.initData.glycosylation_evidence_type ? props.initData.glycosylation_evidence_type.map(type => ({name:type.display, id:type.id})) : []}
							sortFunction={(a, b) => {return 0 }}
							setInputValue={proGlyEvidenceOnChange}
						/>
					</FormControl>
				</Grid>
				{/* Pathway ID */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonProteinData.pathway_id.tooltip.title}
                                text={commonProteinData.pathway_id.tooltip.text}
                                urlText={commonProteinData.pathway_id.tooltip.urlText}
                                url={commonProteinData.pathway_id.tooltip.url}
                            />
                            {commonProteinData.pathway_id.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.proPathwayId}
                            setInputValue={proPathwayIdChange}
                            placeholder={advancedSearch.pathway_id.placeholder}
							typeahedID={advancedSearch.pathway_id.typeahedID}
							length={advancedSearch.pathway_id.length}
							errorText={advancedSearch.pathway_id.errorText}
						/>
						<ExampleControl
							exampleMap={advancedSearch.pathway_id.examples}
							type={advancedSearch.pathway_id.examples.pathway_id.id}
							setInputValue={input => {
								proPathwayIdChange(input);
							}}
						/>
					</FormControl>
				</Grid>
				{/* Disease Name */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonProteinData.disease_name.tooltip.title}
                                text={commonProteinData.disease_name.tooltip.text}
                                urlText={commonProteinData.disease_name.tooltip.urlText}
                                url={commonProteinData.disease_name.tooltip.url}
                            />
                            {commonProteinData.disease_name.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.proDiseaseName}
                            setInputValue={proDiseaseNameChange}
                            placeholder={advancedSearch.disease_name.placeholder}
							typeahedID={advancedSearch.disease_name.typeahedID}
							length={advancedSearch.disease_name.length}
							errorText={advancedSearch.disease_name.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={proDiseaseNameChange}
							inputValue={advancedSearch.disease_name.examples}
						/>
					</FormControl>
				</Grid>
				{/* Disease ID */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonProteinData.disease_id.tooltip.title}
                                text={commonProteinData.disease_id.tooltip.text}
                                urlText={commonProteinData.disease_id.tooltip.urlText}
                                url={commonProteinData.disease_id.tooltip.url}
                            />
                            {commonProteinData.disease_id.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.proDiseaseId}
                            setInputValue={proDiseaseIdChange}
                            placeholder={advancedSearch.disease_id.placeholder}
							typeahedID={advancedSearch.disease_id.typeahedID}
							length={advancedSearch.disease_id.length}
							errorText={advancedSearch.disease_id.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={proDiseaseIdChange}
							inputValue={advancedSearch.disease_id.examples}
						/>
					</FormControl>
				</Grid>
				{/* Pubmed ID */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl
						fullWidth
						variant='outlined'
					>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                                title={commonProteinData.pmid.tooltip.title}
                                text={commonProteinData.pmid.tooltip.text}
                                urlText={commonProteinData.pmid.tooltip.urlText}
                                url={commonProteinData.pmid.tooltip.url}
                            />
                            {commonProteinData.pmid.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.proPubId}
                            setInputValue={proPubIdChange}
                            placeholder={advancedSearch.pmid.placeholder}
							typeahedID={advancedSearch.pmid.typeahedID}
							length={advancedSearch.pmid.length}
							errorText={advancedSearch.pmid.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={proPubIdChange}
							inputValue={advancedSearch.pmid.examples}
						/>
					</FormControl>
				</Grid>
				
				{/* Biomarker Disease */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
							<HelpTooltip
                                title={commonProteinData.biomarker_disease.tooltip.title}
                                text={commonProteinData.biomarker_disease.tooltip.text}
                                urlText={commonProteinData.biomarker_disease.tooltip.urlText}
                                url={commonProteinData.biomarker_disease.tooltip.url}
                            />
                            {commonProteinData.biomarker_disease.name}
						</Typography>
						<AutoTextInput
							inputValue={props.inputValue.proBiomarkerDisease}
                            setInputValue={proBiomarkerDiseaseChange}
                            placeholder={advancedSearch.biomarker_disease.placeholder}
							typeahedID={advancedSearch.biomarker_disease.typeahedID}
							length={advancedSearch.biomarker_disease.length}
							errorText={advancedSearch.biomarker_disease.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={proBiomarkerDiseaseChange}
							inputValue={advancedSearch.biomarker_disease.examples}
						/>
					</FormControl>
				</Grid>
				{/* Biomarker Type */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					<FormControl
						fullWidth
						variant='outlined'
					>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                                title={commonProteinData.biomarker_type.tooltip.title}
                                text={commonProteinData.biomarker_type.tooltip.text}
                            />
                            {commonProteinData.biomarker_type.name}
						</Typography>
						<SelectControl
							inputValue={props.inputValue.proBiomarkerType.id}
							placeholder={advancedSearch.biomarker_type.placeholder}
							placeholderId={advancedSearch.biomarker_type.placeholderId}
							placeholderName={advancedSearch.biomarker_type.placeholderName}
							menu={props.initData.biomarker_types.map(a => {return {name:a.charAt(0).toUpperCase() + a.slice(1), id:a}})}
							setInputValue={proBiomarkerTypeOnChange}
						/>
					</FormControl>
				</Grid>
				{/* Buttons Buttom */}
				<Grid item size={{ xs: 12, sm: 10 }}>
					{/* <Row className='gg-align-right pt-3 mb-2 mr-1'> */}
					<div className='gg-align-right pt-3 mb-2 me-1'>
						<Button className='gg-btn-outline me-4' onClick={clearProtein}>
							Clear Fields
						</Button>
						<Button
							className='gg-btn-blue'
							onClick={props.searchProteinAdvClick}
							disabled={
								!props.inputValue.proAdvSearchValError.every(
									(err) => err === false
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

export default ProteinAdvancedSearch;

ProteinAdvancedSearch.propTypes = {
	initData: PropTypes.object,
	inputValue: PropTypes.object,
	searchProteinAdvClick: PropTypes.func,
	setProAdvSearchData: PropTypes.func,
};
