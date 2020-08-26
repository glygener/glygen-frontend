import React from 'react';
import MultilineAutoTextInput from '../input/MultilineAutoTextInput';
import RangeInputSlider from '../input/RangeInputSlider';
import AutoTextInput from '../input/AutoTextInput';
import MultiselectTextInput from '../input/MultiselectTextInput';
import SelectControl from '../select/SelectControl';
import HelpTooltip from '../tooltip/HelpTooltip';
import ExampleExploreControl from '../example/ExampleExploreControl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import PropTypes from 'prop-types';
import { Row } from 'react-bootstrap';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from 'react-bootstrap/Button';
import {sortDropdown} from '../../utils/common';
import '../../css/Search.css';
import glycanSearchData from '../../data/json/glycanSearch';
import stringConstants from '../../data/json/stringConstants';


const GlycanAdvancedSearch = (props) => {
    let commonGlycanData = stringConstants.glycan.common;
    let advancedSearch = glycanSearchData.advanced_search;

	function glyOrgChange(org) {
		props.setGlyAdvSearchData({ glyOrganisms: org });
	}

	const glyOrgOperationOnChange = (value) => {
		props.setGlyAdvSearchData({ glyOrgOperation: value });
	}

	const glyMassTypeOnChange = (value) => {
		props.setGlyAdvSearchData({ glyMassType: value });
		setMassValues(value, props.inputValue.glyMass);
	}

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
		props.setGlyAdvSearchData({ glyMassInput: [Number(minval).toLocaleString('en-US'), Number(maxval).toLocaleString('en-US')] });
		props.setGlyAdvSearchData({ glyMass: [minval, maxval] });
    };

    function glyMassInputChange(inputMass) {
        props.setGlyAdvSearchData({ glyMassInput: inputMass })
    }
    
    function glyMassSliderChange(inputMass) {
        props.setGlyAdvSearchData({ glyMass: inputMass })
    }
    
    function glyNumSugarsInputChange(inputNumSugars) {
        props.setGlyAdvSearchData({ glyNumSugarsInput: inputNumSugars })
    }
    
    function glyNumSugarsSliderChange(inputNumSugars) {
        props.setGlyAdvSearchData({ glyNumSugars: inputNumSugars })
    }

	const glyTypeOnChange = (value) => {
		if (value === '')
			props.setGlyAdvSearchData({ glySubTypeIsHidden: true });
		else props.setGlyAdvSearchData({ glySubTypeIsHidden: false });

		props.setGlyAdvSearchData({ glySubType: '' });
		props.setGlyAdvSearchData({ glyType: value });
	}

	const glySubTypeOnChange = (value) => {
		props.setGlyAdvSearchData({ glySubType: value });
	}

	function glycanIdChange(inputGlycanId) {
		let valArr = props.inputValue.glyAdvSearchValError;
		valArr[0] = inputGlycanId.length > advancedSearch.glycan_id.length;
		props.setGlyAdvSearchData({ glycanId: inputGlycanId, glyAdvSearchValError: valArr });
	}

	function glyProtChange(inputGlyProt) {
		let valArr = props.inputValue.glyAdvSearchValError;
		valArr[1] = inputGlyProt.length > advancedSearch.protein_identifier.length;
		props.setGlyAdvSearchData({ glyProt: inputGlyProt, glyAdvSearchValError: valArr });
	}

	function glyMotifChange(inputGlyMotif) {
		let valArr = props.inputValue.glyAdvSearchValError;
		valArr[2] = inputGlyMotif.length > advancedSearch.glycan_motif.length;
		props.setGlyAdvSearchData({ glyMotif: inputGlyMotif, glyAdvSearchValError: valArr });
	}

	function glyBioEnzChange(inputGlyBioEnz) {
		let valArr = props.inputValue.glyAdvSearchValError;
		valArr[3] = inputGlyBioEnz.length > advancedSearch.enzyme.length;
		props.setGlyAdvSearchData({ glyBioEnz: inputGlyBioEnz, glyAdvSearchValError: valArr });
	}

	function glyPubIdChange(inputGlyPubId) {
		let valArr = props.inputValue.glyAdvSearchValError;
		valArr[4] = inputGlyPubId.length > advancedSearch.pmid.length;
		props.setGlyAdvSearchData({ glyPubId: inputGlyPubId, glyAdvSearchValError: valArr });
	}

	const PubmedIdChange = (event) => {
		let valArr = props.inputValue.glyAdvSearchValError;
		valArr[4] = event.target.value.length > advancedSearch.pmid.length;
		props.setGlyAdvSearchData({ glyPubId: event.target.value, glyAdvSearchValError: valArr });
	};

	const clearGlycan = () => {
		props.setGlyAdvSearchData({
			glycanId: '',
			glyMassType: props.initData.glycan_mass.native.name,
			glyMass: [
				Math.floor(props.initData.glycan_mass.native.min),
				Math.ceil(props.initData.glycan_mass.native.max),
			],
			glyMassInput: [
				Math.floor(props.initData.glycan_mass.native.min).toLocaleString('en-US'),
				Math.ceil(props.initData.glycan_mass.native.max).toLocaleString('en-US'),
			],
			glyMassRange: [
				Math.floor(props.initData.glycan_mass.native.min),
				Math.ceil(props.initData.glycan_mass.native.max),
			],
			glyNumSugars: [
				props.initData.number_monosaccharides.min,
				props.initData.number_monosaccharides.max,
			],
			glyNumSugarsRange: [
				props.initData.number_monosaccharides.min,
				props.initData.number_monosaccharides.max,
			],
			glyNumSugarsInput: [
				Number(props.initData.number_monosaccharides.min).toLocaleString('en-US'),
				Number(props.initData.number_monosaccharides.max).toLocaleString('en-US'),
			],
			glyOrganisms: [],
			glyOrgOperation: 'or',
			glyType: advancedSearch.glycan_type.placeholderId,
			glySubType: advancedSearch.glycan_subtype.placeholderId,
			glySubTypeIsHidden: true,
			glyProt: '',
			glyMotif: '',
			glyBioEnz: '',
			glyPubId: '',
			glyAdvSearchValError: [false, false, false, false, false],
		});
	};

	return (
		<>
			<Grid
				container
				style={{ margin: '0  auto' }}
				spacing={3}
				justify='center'>
				{/* Buttons Top */}
				<Grid item xs={12} sm={10}>
					<Row className='gg-align-right pt-2 pb-2 mr-1'>
						<Button className='gg-btn-outline mr-4' onClick={clearGlycan}>
							Clear Fields
						</Button>
						<Button
							className='gg-btn-blue'
							onClick={props.searchGlycanAdvClick}
							disabled={
								!props.inputValue.glyAdvSearchValError.every(
									(err) => err === false
								)
							}>
							Search Glycan
						</Button>
					</Row>
				</Grid>
				{/* Glycan Id */}
				<Grid item xs={12} sm={10}>
					<FormControl fullWidth variant='outlined'>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                                title={commonGlycanData.glycan_id.tooltip.title}
                                text={commonGlycanData.glycan_id.tooltip.text}
                                urlText={commonGlycanData.glycan_id.tooltip.urlText}
                                url={commonGlycanData.glycan_id.tooltip.url}
                            />
                            {commonGlycanData.glycan_id.name}
						</Typography>
						<MultilineAutoTextInput
							fullWidth
							inputValue={props.inputValue.glycanId}
                            setInputValue={glycanIdChange}
                            placeholder={advancedSearch.glycan_id.placeholder}
							typeahedID={advancedSearch.glycan_id.typeahedID}
							length={advancedSearch.glycan_id.length}
							errorText={advancedSearch.glycan_id.errorText}
						/>
                        <ExampleExploreControl
							setInputValue={glycanIdChange}
							inputValue={advancedSearch.glycan_id.examples}
						/>
					</FormControl>
				</Grid>
				{/* Monoisotopic Mass */}
				<Grid item xs={12} sm={10}>
					<FormControl fullWidth>
						<Grid container spacing={2} alignItems='center'>
							<Grid item xs={12} sm={9}>
								<Typography className={'search-lbl'} gutterBottom>
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
									inputClass='gly-rng-input'
									inputValue={props.inputValue.glyMassInput}
                                    setInputValue={glyMassInputChange}
									inputValueSlider={props.inputValue.glyMass}
                                    setSliderInputValue={glyMassSliderChange}
								/>
							</Grid>
							{/* Mass Type */}
							<Grid item xs={12} sm={3}>
								<Typography className={'search-lbl'} gutterBottom>
									&nbsp;
								</Typography>
                                <FormControl 
                                    variant='outlined' 
                                    fullWidth
                                >
									<InputLabel className={'select-lbl-inline'}>
                                        {commonGlycanData.mass_type.name}
									</InputLabel>
									<SelectControl
										inputValue={props.inputValue.glyMassType}
										labelWidth={85}
										menu={Object.keys(props.initData.glycan_mass)
												.map((massType)  => {return {id: props.initData.glycan_mass[massType].name, name: props.initData.glycan_mass[massType].name}})}
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
						<Grid container spacing={2} alignItems='center'>
							<Grid item xs={12} sm={9}>
								<Typography className={'search-lbl'} gutterBottom>
									<HelpTooltip
                                        title={commonGlycanData.number_monosaccharides.tooltip.title}
                                        text={commonGlycanData.number_monosaccharides.tooltip.text}
                                    />
                                    {commonGlycanData.number_monosaccharides.name}
								</Typography>
								<RangeInputSlider
									step={1}
									min={props.inputValue.glyNumSugarsRange[0]}
									max={props.inputValue.glyNumSugarsRange[1]}
									inputClass='gly-rng-input'
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
						<Grid container spacing={2} alignItems='center'>
							<Grid item xs={9} sm={9}>
								<Typography
									className={'search-lbl'}
									gutterBottom
								>
									<HelpTooltip
                                        title={commonGlycanData.organism.tooltip.title}
                                        text={commonGlycanData.organism.tooltip.text}
                                    />
                                    {commonGlycanData.organism.name}
								</Typography>
								{<MultiselectTextInput
									options={props.initData.organism.sort(sortDropdown)}
									inputValue={props.inputValue.glyOrganisms}
									setInputValue={glyOrgChange}
									placeholder={advancedSearch.organism.placeholder}
								/>}
							</Grid>
							<Grid item xs={3} sm={3}>
                                <Typography className={'search-lbl'} gutterBottom>
									&nbsp;
								</Typography>
                                <FormControl 
                                    variant='outlined' 
                                    fullWidth
                                >
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
					<FormControl
						fullWidth
						variant='outlined'
					>
						<Typography className={'search-lbl'} gutterBottom>
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
							menu={props.initData.glycan_type.map((type) => {return {id: type.name, name: type.name}})}
							setInputValue={glyTypeOnChange}
						/>
					</FormControl>
				</Grid>
				{/* Glycan Subtype */}

				{!props.inputValue.glySubTypeIsHidden && (
					<Grid item xs={12} sm={10}>
						<FormControl
							fullWidth
							variant='outlined'
						>
							<Typography className={'search-lbl'} gutterBottom>
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
								menu={props.initData.glycan_type.find((type) => {return type.name === props.inputValue.glyType})
										.subtype.map((subtype) => {return {id: subtype, name: subtype}})}
								setInputValue={glySubTypeOnChange}
							/>
						</FormControl>
					</Grid>
				)}

				{/* Glycosylated Protein */}
				<Grid item xs={12} sm={10}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
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
				{/* Glycan Motif */}
				<Grid item xs={12} sm={10}>
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
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
					<FormControl fullWidth variant='outlined'>
						<Typography
							className={'search-lbl'}
							gutterBottom
						>
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
					<FormControl
						fullWidth
						variant='outlined'
					>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                                title={commonGlycanData.pmid.tooltip.title}
                                text={commonGlycanData.pmid.tooltip.text}
                                urlText={commonGlycanData.pmid.tooltip.urlText}
                                url={commonGlycanData.pmid.tooltip.url}
                            />
                            {commonGlycanData.pmid.name}
						</Typography>
						<OutlinedInput
                            placeholder={advancedSearch.pmid.placeholder}
                            margin='dense'
                            value={props.inputValue.glyPubId}
                            onChange={PubmedIdChange}
                            error={props.inputValue.glyPubId.length > advancedSearch.pmid.length}
						/>
						{props.inputValue.glyPubId.length > advancedSearch.pmid.length && (
							<FormHelperText className={"error-text"} error>
								{advancedSearch.pmid.errorText}
							</FormHelperText>
						)}
						{/* <AutoTextInput
                        inputValue={glyPubId} setInputValue={glycPubIdChange}
                        placeholder="Enter the Pubmed ID"
                        typeahedID = "glycan_pmid"
                        /> */}
                        <ExampleExploreControl
							setInputValue={glyPubIdChange}
							inputValue={advancedSearch.pmid.examples}
						/>
					</FormControl>
				</Grid>
				{/* Buttons Buttom */}
				<Grid item xs={12} sm={10}>
					<Row className='gg-align-right pt-3 mb-2 mr-1'>
						<Button className='gg-btn-outline mr-4' onClick={clearGlycan}>
							Clear Fields
						</Button>
						<Button
							className='gg-btn-blue'
							onClick={props.searchGlycanAdvClick}
							disabled={
								!props.inputValue.glyAdvSearchValError.every(
									(err) => err === false
								)
							}>
							Search Glycan
						</Button>
					</Row>
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
	setGlyAdvSearchData: PropTypes.func,
};
