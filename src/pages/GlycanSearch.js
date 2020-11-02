import React, { useEffect, useReducer, useState } from 'react';
import Helmet from 'react-helmet';
import { getTitle, getMeta } from '../utils/head';
import PageLoader from '../components/load/PageLoader';
import TextAlert from '../components/alert/TextAlert';
import DialogAlert from '../components/alert/DialogAlert';
import GlycanAdvancedSearch from '../components/search/GlycanAdvancedSearch';
import CompositionSearchControl from '../components/search/CompositionSearchControl';
import SimpleSearchControl from '../components/search/SimpleSearchControl';
import GlycanTutorial from '../components/tutorial/GlycanTutorial';
import { Tab, Tabs, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import '../css/Search.css';
import glycanSearchData from '../data/json/glycanSearch';
import stringConstants from '../data/json/stringConstants';
import routeConstants from '../data/json/routeConstants';
import {logActivity} from '../data/logging';
import {axiosError} from '../data/axiosError';
import { getGlycanSearch, getGlycanSimpleSearch,  getGlycanList, getGlycanInit} from '../data/glycan';
import FeedbackWidget from "../components/FeedbackWidget";


const GlycanSearch = (props) => {
	let { id } = useParams("");
	const [initData, setInitData] = useState({
		"organism": [
			{
			  "name": "Homo sapiens", 
			  "id": 9606
			}
		  ],
		  "glycan_mass": {
			"native": {
			  "max": 6750.45, 
			  "name": "Native", 
			  "min": 150.05
			}
		  },
	});

	const [glySimpleSearchCategory, setGlySimpleSearchCategory] = useState('any');
	const [glySimpleSearchTerm, setGlySimpleSearchTerm] = useState('');
	const [glyAdvSearchData, setGlyAdvSearchData] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{
			glycanId: '',
			glycanIdSubsumption: 'none',
			glyMassType: 'Native',
			glyMass: [150, 6751],
			glyMassInput: [Number(150).toLocaleString('en-US'), Number(6751).toLocaleString('en-US')],
			glyMassRange: [150, 6751],
			glyNumSugars: [1, 37],
			glyNumSugarsRange: [1, 37],
			glyNumSugarsInput: [Number(1).toLocaleString('en-US'), Number(37).toLocaleString('en-US')],
			glyOrganisms: [],
			glyOrgAnnotationCat: '',
			glyOrgOperation: 'or',
			glyType: '',
			glySubType: '',
			glySubTypeIsHidden: true,
			glyProt: '',
			glyMotif: '',
			glyBioEnz: '',
			glyPubId: '',
			glyBindingProteinId: '',
			glyAdvSearchValError: [false, false, false, false, false],
		}
	);
	const [glyCompData, setGlyCompData] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{}
	);
	const [glyActTabKey, setGlyActTabKey] = useState('Simple-Search');
	const [pageLoading, setPageLoading] = useState(true);
	const [alertTextInput, setAlertTextInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{show: false, id: ""}
	);
	const [alertDialogInput, setAlertDialogInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{show: false, id: ""}
	);

	let simpleSearch = glycanSearchData.simple_search;
	let advancedSearch = glycanSearchData.advanced_search;
	let compositionSearch = glycanSearchData.composition_search;
	let glycanData = stringConstants.glycan;
	let commonGlycanData = glycanData.common;

	function glyCompChange(glyComp) {
		setGlyCompData(glyComp);
	}

	/**
	 * getSelectionValue returns selection control value based on min, max.
	 * @param {object} cur_min - min value.
	 * @param {object} cur_max - max value.
	 * @param {object} residue_min - residue min value.
	 * @param {object} residue_max - residue max value.
	 **/
	function getSelectionValue(cur_min, cur_max, residue_min, residue_max) {
		var selection = 'maybe';

		if (cur_min === residue_min && cur_max === residue_min) {
			selection = 'no';
		} else if (cur_min === residue_min && cur_max <= residue_max) {
			selection = 'maybe';
		} else if (cur_min > residue_min && cur_max <= residue_max) {
			selection = 'yes';
		}

		return selection;
	}

	useEffect(() => {
		setPageLoading(true);
		logActivity();
		document.addEventListener('click', () => {
			setAlertTextInput({"show": false})
		});
		getGlycanInit().then((response) => {
			let initData = response.data;
			setGlyAdvSearchData({
				glyMassType: initData.glycan_mass.native.name,
				glyMass: [
					Math.floor(initData.glycan_mass.native.min),
					Math.ceil(initData.glycan_mass.native.max),
				],
				glyMassInput: [
					Math.floor(initData.glycan_mass.native.min).toLocaleString('en-US'),
					Math.ceil(initData.glycan_mass.native.max).toLocaleString('en-US'),
				],
				glyMassRange: [
					Math.floor(initData.glycan_mass.native.min),
					Math.ceil(initData.glycan_mass.native.max),
				],
				glyNumSugars: [
					initData.number_monosaccharides.min,
					initData.number_monosaccharides.max,
				],
				glyNumSugarsRange: [
					initData.number_monosaccharides.min,
					initData.number_monosaccharides.max,
				],
				glyNumSugarsInput: [
					Number(initData.number_monosaccharides.min).toLocaleString('en-US'),
					Number(initData.number_monosaccharides.max).toLocaleString('en-US'),
				],
				glySubTypeIsHidden: true,
				glyAdvSearchValError: [false, false, false, false, false],
			});

			let compositionData = initData.composition;
			let compStateData = {};
			let compositionSearchData = glycanData.common.composition;

			for (let x = 0; x < compositionData.length; x++) {
				compositionData[x].orderID = compositionSearchData[compositionData[x].residue].orderID;
				compositionData[x].subtext = compositionSearchData[compositionData[x].residue].subtext;
				compositionData[x].name = compositionSearchData[compositionData[x].residue].name;
				compositionData[x].shortName = compositionSearchData[compositionData[x].residue].shortName;
				compositionData[x].tooltip = compositionSearchData[compositionData[x].residue].tooltip;
				compStateData[compositionData[x].residue] = {
					min: compositionData[x].min,
					selectValue: getSelectionValue(
						compositionData[x].min,
						compositionData[x].min,
						compositionData[x].min,
						compositionData[x].max
					),
					max: compositionData[x].min,
				};
			}
			initData.glycan_mass.native.min = Math.floor(
				initData.glycan_mass.native.min
			);
			initData.glycan_mass.native.max = Math.ceil(
				initData.glycan_mass.native.max
			);
			initData.glycan_mass.permethylated.min = Math.floor(
				initData.glycan_mass.permethylated.min
			);
			initData.glycan_mass.permethylated.max = Math.ceil(
				initData.glycan_mass.permethylated.max
			);

			initData.composition = compositionData.sort(function (res1, res2) {
				return parseInt(res1.orderID) - parseInt(res2.orderID);
			});
			setGlyCompData(compStateData);
			setInitData(initData);
			const anchorElement = props.history.location.hash;
			if (anchorElement) {
				setGlyActTabKey(anchorElement.substr(1));	
			} else {
				setGlyActTabKey("Simple-Search");
			}
			if (id === undefined) setPageLoading(false);

			id &&
				getGlycanList(id, 1).then(({ data }) => {
					logActivity("user", id, "Search modification initiated");
					if (data.query.composition !== undefined) {
						let queryCompData = {};
						for (let x = 0; x < data.query.composition.length; x++) {
							let resVal = initData.composition.filter(function (res) {
								return data.query.composition[x].residue === res.residue;
							})[0];
							queryCompData[data.query.composition[x].residue] = {
								min: data.query.composition[x].min,
								selectValue: getSelectionValue(
									parseInt(data.query.composition[x].min),
									parseInt(data.query.composition[x].max),
									parseInt(resVal.min),
									parseInt(resVal.max)
								),
								max: data.query.composition[x].max,
							};
						}
						setGlyCompData(queryCompData);
						setGlyActTabKey("Composition-Search");
						setPageLoading(false);
					} else if (data.query.query_type === glycanData.simple_search.query_type.name) {
						setGlySimpleSearchCategory(
							data.query.term_category ? data.query.term_category : 'any'
						);
						setGlySimpleSearchTerm(data.query.term ? data.query.term : '');
						setGlyActTabKey("Simple-Search");
						setPageLoading(false);
					} else {
						setGlyAdvSearchData({
							glycanId:
								data.query.glycan_identifier === undefined
									? ''
									: data.query.glycan_identifier.glycan_id + ",",
							glycanIdSubsumption:
								data.query.glycan_identifier === undefined
									? 'none'
									: data.query.glycan_identifier.subsumption,
							glyMassType:
								data.query.mass_type === undefined
									? initData.glycan_mass.native.name
									: data.query.mass_type,
							glyMass:
								data.query.mass === undefined
									? data.query.mass_type === undefined ||
									  data.query.mass_type === initData.glycan_mass.native.name
										? [
												Math.floor(initData.glycan_mass.native.min),
												Math.ceil(initData.glycan_mass.native.max),
										  ]
										: [
												Math.floor(initData.glycan_mass.permethylated.min),
												Math.ceil(initData.glycan_mass.permethylated.max),
										  ]
									: [data.query.mass.min, data.query.mass.max],
							glyMassInput:
								data.query.mass === undefined
									? data.query.mass_type === undefined ||
									  data.query.mass_type === initData.glycan_mass.native.name
										? [
												Math.floor(initData.glycan_mass.native.min).toLocaleString('en-US'),
												Math.ceil(initData.glycan_mass.native.max).toLocaleString('en-US'),
										  ]
										: [
												Math.floor(initData.glycan_mass.permethylated.min).toLocaleString('en-US'),
												Math.ceil(initData.glycan_mass.permethylated.max).toLocaleString('en-US'),
										  ]
									: [data.query.mass.min.toLocaleString('en-US'), data.query.mass.max.toLocaleString('en-US')],
							glyMassRange:
								data.query.mass_type === undefined ||
								data.query.mass_type === initData.glycan_mass.native.name
									? [
											Math.floor(initData.glycan_mass.native.min),
											Math.ceil(initData.glycan_mass.native.max),
									  ]
									: [
											Math.floor(initData.glycan_mass.permethylated.min),
											Math.ceil(initData.glycan_mass.permethylated.max),
									  ],
							glyNumSugars:
								data.query.number_monosaccharides === undefined
									? [
											initData.number_monosaccharides.min,
											initData.number_monosaccharides.max,
									  ]
									: [
											data.query.number_monosaccharides.min,
											data.query.number_monosaccharides.max,
									  ],
							glyNumSugarsInput:
								data.query.number_monosaccharides === undefined
									? [
											Number(initData.number_monosaccharides.min).toLocaleString('en-US'),
											Number(initData.number_monosaccharides.max).toLocaleString('en-US'),
									  ]
									: [
											Number(data.query.number_monosaccharides.min).toLocaleString('en-US'),
											Number(data.query.number_monosaccharides.max).toLocaleString('en-US'),
									  ],
							glyOrgAnnotationCat:
								data.query.organism === undefined
									? ''
									: data.query.organism.annotation_category,
							glyOrgOperation:
								data.query.organism === undefined
									? 'or'
									: data.query.organism.operation,
							glyOrganisms:
								data.query.organism === undefined
									? []
									: data.query.organism.organism_list,
							glyType:
								data.query.glycan_type === undefined
									? advancedSearch.glycan_type.placeholderId
									: data.query.glycan_type,
							glySubType:
								data.query.glycan_subtype === undefined
									? advancedSearch.glycan_subtype.placeholderId
									: data.query.glycan_subtype,
							glySubTypeIsHidden:
								data.query.glycan_type === undefined ? true : false,
							glyProt:
								data.query.protein_identifier === undefined
									? ''
									: data.query.protein_identifier,
							glyMotif:
								data.query.glycan_motif === undefined
									? ''
									: data.query.glycan_motif,
							glyBioEnz:
								data.query.enzyme === undefined ? '' : data.query.enzyme.id,
							glyPubId: data.query.pmid === undefined ? '' : data.query.pmid,
							glyBindingProteinId:
							data.query.binding_protein_id === undefined
								? ''
								: data.query.binding_protein_id,
							glyAdvSearchValError: [false, false, false, false, false, false],
						});

						setGlyActTabKey("Advanced-Search");
						setPageLoading(false);
					}
				})
				.catch(function (error) {
					let message = "list api call";
					axiosError(error, "", message, setPageLoading, setAlertDialogInput);
				});
		})
		.catch(function (error) {
			let message = "search_init api call";
			axiosError(error, "", message, setPageLoading, setAlertDialogInput);
		});
	}, [id, glycanData]);

	function searchjson(
		input_query_type,
		input_glycan_id,
		input_glycan_id_subsumption,
		input_mass_type,
		input_mass_min,
		input_mass_max,
		input_sugar_min,
		input_sugar_max,
		input_organism,
		input_organism_annotation_cat,
		input_organism_operation,
		input_glycantype,
		input_glycansubtype,
		input_enzyme,
		input_proteinid,
		input_motif,
		input_pmid,
		input_binding_protein_id,
		input_residue_comp
	) {
		var enzymes = {};
		if (input_enzyme) {
			enzymes = {
				id: input_enzyme,
				type: 'gene',
			};
		}

		var monosaccharides = undefined;
		if (input_sugar_min && input_sugar_max) {
			if (
				input_sugar_min !== initData.number_monosaccharides.min ||
				input_sugar_max !== initData.number_monosaccharides.max
			) {
				monosaccharides = {
					min: parseInt(input_sugar_min),
					max: parseInt(input_sugar_max),
				};
			}
		}

		var input_mass = undefined;
		if (input_mass_min && input_mass_max) {
			if (input_mass_type === 'Native') {
				if (
					input_mass_min !== initData.glycan_mass.native.min ||
					input_mass_max !== initData.glycan_mass.native.max
				) {
					input_mass = {
						min: parseInt(input_mass_min),
						max: parseInt(input_mass_max),
					};
				}
			} else {
				if (
					input_mass_min !== initData.glycan_mass.permethylated.min ||
					input_mass_max !== initData.glycan_mass.permethylated.max
				) {
					input_mass = {
						min: parseInt(input_mass_min),
						max: parseInt(input_mass_max),
					};
				}
			}
		}

		var organisms = undefined;
		if (input_organism && input_organism.length > 0) {
			organisms = {
				organism_list: input_organism,
				annotation_category: input_organism_annotation_cat,
				operation: input_organism_operation
			};
		}

		var glycan_identifier = undefined;
		var glycan_id = input_glycan_id;
		if (glycan_id) {
			glycan_id = glycan_id.trim();
			glycan_id = glycan_id.replace(/\u200B/g, '');
			glycan_id = glycan_id.replace(/\u2011/g, '-');
			glycan_id = glycan_id.replace(/\s+/g, ',');
			glycan_id = glycan_id.replace(/,+/g, ',');
			var index = glycan_id.lastIndexOf(',');
			if (index > -1 && index + 1 === glycan_id.length) {
				glycan_id = glycan_id.substr(0, index);
			}
			glycan_identifier = {
				glycan_id: glycan_id,
				subsumption: input_glycan_id_subsumption 
			}
		}

		var formjson = {
			[commonGlycanData.operation.id]: 'AND',
			[glycanData.advanced_search.query_type.id]: input_query_type,
			[commonGlycanData.mass_type.id]: input_mass_type,
			[commonGlycanData.mass.id]: input_mass,
			[commonGlycanData.number_monosaccharides.id]: monosaccharides,
			[commonGlycanData.enzyme.id]: enzymes,
			[commonGlycanData.glycan_identifier.id]: glycan_identifier,
			[commonGlycanData.organism.id]: organisms,
			[commonGlycanData.glycan_type.id]: input_glycantype,
			[commonGlycanData.glycan_subtype.id]: input_glycansubtype,
			[commonGlycanData.protein_identifier.id]: input_proteinid,
			[commonGlycanData.glycan_motif.id]: input_motif,
			[commonGlycanData.pmid.id]: input_pmid,
			[commonGlycanData.binding_protein_id.id]: input_binding_protein_id,
			[commonGlycanData.composition.id]: input_residue_comp,
		};
		return formjson;
	}

	const glycanSimpleSearch = () => {
		var formjsonSimple = {
			[commonGlycanData.operation.id]: 'AND',
			[glycanData.simple_search.query_type.id]: glycanData.simple_search.query_type.name,
			[commonGlycanData.term.id]: glySimpleSearchTerm,
			[commonGlycanData.term_category.id]: glySimpleSearchCategory,
		};
		logActivity("user", id, "Performing Simple Search");
		let message = "Simple Search query=" + JSON.stringify(formjsonSimple);
		getGlycanSimpleSearch(formjsonSimple)
		.then((response) => {
			if (response.data['list_id'] !== '') {
				logActivity("user", (id || "") + ">" + response.data['list_id'], message)
				.finally(() => {	
					props.history.push(routeConstants.glycanList + response.data['list_id']);
				});;
				setPageLoading(false);
			} else {
				logActivity("user", "", "No results. " + message);
				setPageLoading(false);
				setAlertTextInput({"show": true, "id": stringConstants.errors.simpleSerarchError.id})
				window.scrollTo(0, 0);
			}
		})
		.catch(function (error) {
			axiosError(error, "", message, setPageLoading, setAlertDialogInput);
		});
	};

	const glycanAdvSearch = () => {
		let formObject = searchjson(
			glycanData.advanced_search.query_type.name,
			glyAdvSearchData.glycanId,
			glyAdvSearchData.glycanIdSubsumption,
			glyAdvSearchData.glyMassType,
			glyAdvSearchData.glyMass[0],
			glyAdvSearchData.glyMass[1],
			glyAdvSearchData.glyNumSugars[0],
			glyAdvSearchData.glyNumSugars[1],
			glyAdvSearchData.glyOrganisms,
			glyAdvSearchData.glyOrgAnnotationCat,
			glyAdvSearchData.glyOrgOperation,
			glyAdvSearchData.glyType,
			glyAdvSearchData.glySubType,
			glyAdvSearchData.glyBioEnz,
			glyAdvSearchData.glyProt,
			glyAdvSearchData.glyMotif,
			glyAdvSearchData.glyPubId,
			glyAdvSearchData.glyBindingProteinId,
			undefined
		);
		logActivity("user", id, "Performing Advanced Search");
		let message = "Advanced Search query=" + JSON.stringify(formObject);
		getGlycanSearch(formObject)
			.then((response) => {
				if (response.data['list_id'] !== '') {
					logActivity("user", (id || "") + ">" + response.data['list_id'], message)
					.finally(() => {	
						props.history.push(routeConstants.glycanList + response.data['list_id']);
					});;
					setPageLoading(false);
				} else {
					logActivity("user", "", "No results. " + message);
					setPageLoading(false);
					setAlertTextInput({"show": true, "id": stringConstants.errors.advSerarchError.id})
					window.scrollTo(0, 0);
				}
			})
			.catch(function (error) {
				axiosError(error, "", message, setPageLoading, setAlertDialogInput);
			});
	};

	const glycanCompSearch = () => {
		let compSearchData = [];

		var count = 0;
		for (let residue in glyCompData) {
			compSearchData[count] = {
				residue: residue,
				min: glyCompData[residue].min,
				max: glyCompData[residue].max,
			};
			count++;
		}

		let formObject = searchjson(
			glycanData.composition_search.query_type.name,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			compSearchData
		);

		logActivity("user", id, "Performing Composition Search");
		let message = "Composition Search query=" + JSON.stringify(formObject);
		getGlycanSearch(formObject)
			.then((response) => {
				if (response.data['list_id'] !== '') {
					logActivity("user", (id || "") + ">" + response.data['list_id'], message)
					.finally(() => {	
						props.history.push(routeConstants.glycanList + response.data['list_id']);
					});;
					setPageLoading(false);
				} else {
					logActivity("user", "", "No results. " + message);
					setPageLoading(false);
					setAlertTextInput({"show": true, "id": stringConstants.errors.compSerarchError.id})
					window.scrollTo(0, 0);
				}
			})
			.catch(function (error) {
				axiosError(error, "", message, setPageLoading, setAlertDialogInput);
			});
		};

	const searchGlycanAdvClick = () => {
		setPageLoading(true);
		glycanAdvSearch();
	};

	const searchGlycanCompClick = () => {
		setPageLoading(true);
		glycanCompSearch();
	};

	const searchGlycanSimpleClick = () => {
		setPageLoading(true);
		glycanSimpleSearch();
	};

	return (
		<>
			<Helmet>
				{getTitle('glycanSearch')}
				{getMeta('glycanSearch')}
			</Helmet>
			<FeedbackWidget />
			<div className='lander'>
				<Container>
					<PageLoader pageLoading={pageLoading} />
					<DialogAlert
						alertInput={alertDialogInput}
						setOpen={(input) => {
							setAlertDialogInput({"show": input})
						}}
					/>
					<div className='content-box-md'>
						<h1 className='page-heading'>{glycanSearchData.pageTitle}</h1>
					</div>
					<Tabs
						defaultActiveKey='Advanced-Search'
						transition={false}
						activeKey={glyActTabKey}
						mountOnEnter={true}
						unmountOnExit={true}
						onSelect={(key) => setGlyActTabKey(key)}>
						<Tab
							eventKey='Simple-Search'
							className='tab-content-padding'
							title={simpleSearch.tabTitle}>
							<TextAlert
								alertInput={alertTextInput}
							/>
							<div style={{paddingBottom: "20px"}}></div>
							<Container className='tab-content-border'>
								{initData.simple_search_category && (
									<SimpleSearchControl
										simpleSearchCategory={glySimpleSearchCategory}
										simpleSearchCategoryLabel={commonGlycanData.term_category.name}
										simpleSearchTerm={glySimpleSearchTerm}
										simple_search_category={initData.simple_search_category}
										simple_search={simpleSearch.categories}
										searchSimpleClick={searchGlycanSimpleClick}
										setSimpleSearchCategory={setGlySimpleSearchCategory}
										setSimpleSearchTerm={setGlySimpleSearchTerm}
										length={simpleSearch.length}
										errorText={simpleSearch.errorText}
									/>
								)}
							</Container>
						</Tab>
						<Tab
							eventKey='Advanced-Search'
							className='tab-content-padding'
							title={advancedSearch.tabTitle}>
							<TextAlert
								alertInput={alertTextInput}
							/>
							<Container className='tab-content-border'>
								{initData && (
									<GlycanAdvancedSearch
										searchGlycanAdvClick={searchGlycanAdvClick}
										inputValue={glyAdvSearchData}
										initData={initData}
										setGlyAdvSearchData={setGlyAdvSearchData}
									/>
								)}
							</Container>
						</Tab>
						<Tab
							eventKey='Composition-Search'
							title={compositionSearch.tabTitle}
							className='tab-content-padding'>
							<TextAlert
								alertInput={alertTextInput}
							/>
							<Container className='tab-content-border'>
								{initData.composition && (
									<CompositionSearchControl
										compositionInitMap={initData.composition}
										inputValue={glyCompData}
										setInputValue={glyCompChange}
										searchGlycanCompClick={searchGlycanCompClick}
										getSelectionValue={getSelectionValue}
										step={1}
									/>
								)}
							</Container>
						</Tab>
						<Tab
							eventKey='Tutorial'
							title={glycanSearchData.tutorial.tabTitle}
							className='tab-content-padding'>
							<Container className='tab-content-border'>
								<GlycanTutorial />
							</Container>
						</Tab>
					</Tabs>
				</Container>
			</div>
		</>
	);
};

export default GlycanSearch;