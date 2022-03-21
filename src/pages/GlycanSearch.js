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
import StructureSearchControl from '../components/search/StructureSearchControl';
import SubstructureSearchControl from '../components/search/SubstructureSearchControl';
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
import { getJobInit, postNewJob, getJobStatus, getJobDetails, getJobResultList } from "../data/job";

/**
 * Glycan search component for showing glycan search tabs.
 */
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
			glyGlyName: '',
			glyIDNamespace: '',
			glyAdvSearchValError: [false, false, false, false, false, false, false],
		}
	);
	const [glyCompData, setGlyCompData] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{}
	);
	const [glyActTabKey, setGlyActTabKey] = useState('Simple-Search');
	const [pageLoading, setPageLoading] = useState(true);
	const [searchStarted, setSearchStarted] = useState(false);
	const [alertTextInput, setAlertTextInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{show: false, id: "", custom: ""}
	);
	const [alertDialogInput, setAlertDialogInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{show: false, id: ""}
	);
	const [compSearchDisabled, setCompSearchDisabled] = useState(true);

	const [structSearchData, setStructSearchData] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{
		  seqType: "GlycoCT",
		  glySequence: "",
		  glycoGlyphName: "",
		}
	  );

	const [subStructSearchData, setSubStructSearchData] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{
		  seqType: "GlycoCT",
		  glySequence: "",
		  restrictTo: "substructure",
		  glycoGlyphName: "",
		}
	  );

	let simpleSearch = glycanSearchData.simple_search;
	let advancedSearch = glycanSearchData.advanced_search;
	let querySearch = glycanSearchData.query_search;
	let compositionSearch = glycanSearchData.composition_search;
	let glycanData = stringConstants.glycan;
	let commonGlycanData = glycanData.common;
	const queryString = require('query-string');

	/**
	 * Sets composition data.
	 * @param {object} glyComp - glycan composition data.
	 */
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

	/**
	 * parseComposition returns composition value.
	 * @param {object} composition - composition value.
	 **/
	function parseComposition(composition, unknownComp){
		if (composition === undefined || composition === null || composition === "") return [];

		let compArr = composition.split(')');
		let compTemplate = Object.keys(querySearch.composition);
		let addComp = compTemplate;
		let compObj = [];

		for (let i = 0; i < compArr.length; i++){
			let com = compArr[i];
			if (com === "") continue;

			let comp1 = com.split('(');
			let isCompPresent = compTemplate.includes(comp1[0].toLowerCase());

			if (!isCompPresent) {
				unknownComp.push(comp1[0]);
				continue;
			} 
			addComp = addComp.filter(compTemp => compTemp !== comp1[0].toLowerCase());

			let comp = {
				"residue" : querySearch.composition[comp1[0].toLowerCase()].id,
				"min" : isNaN(parseInt(comp1[1])) ? 0: parseInt(comp1[1]),
				"max" : isNaN(parseInt(comp1[1])) ? 0: parseInt(comp1[1])
			}
			compObj.push(comp)
		}

		if (compObj.length > 1) {
			for (let i = 0; i < addComp.length; i++){
				let com = addComp[i];
				let val = 0;

					let comp = {
						"residue" : querySearch.composition[com.toLowerCase()].id,
						"min" : 0,
						"max" : 0
					}
				compObj.push(comp)
			}
		}

		return compObj;
	}

	/**
	 * executeQuery executes query passed by user as parameters.
	 * @param {object} queryObject - queryObject value.
	 * @param {object} qryObjOut - qryObjOut value.
	 **/
	function executeQuery(queryObject, qryObjOut) {
		let queryProps = Object.keys(queryObject);
		let queryPropArr = querySearch.queryProps;
		let unkProps = [];
		let nullValueProps = [];
		let queryArr = [];
		let isError = false;
		qryObjOut.selectedTab = "Advanced-Search";
		let mass = undefined;
		let tolerance = undefined;
		let massType = undefined;
		let acc = [];
		let subsumption = undefined;
		let comp = undefined;
		for (let i = 0; i < queryProps.length; i++){
			let isPropPresent = queryPropArr.includes(queryProps[i].toLowerCase());
			if (!isPropPresent){
				unkProps.push(queryProps[i]);
				continue;
			}
			if (queryObject[queryProps[i]] === null || queryObject[queryProps[i]] === ""){
				nullValueProps.push(queryProps[i]);
			}
			var value = undefined;
			if (queryProps[i].toLowerCase() === "acc"){
				acc.push(queryObject[queryProps[i]]);
			} else {
				if (queryObject[queryProps[i]] === null || queryObject[queryProps[i]] === "" || typeof(queryObject[queryProps[i]]) === "string") {
					value = queryObject[queryProps[i]];
				} else {
					value = queryObject[queryProps[i]][0];
				}
			}

			if (queryProps[i].toLowerCase() === "mass"){
				mass = value;
			}
			if (queryProps[i].toLowerCase() === "tolerance"){
				tolerance = value;
			}
			if (queryProps[i].toLowerCase() === "masstype"){
				massType = value;
			}
			if (queryProps[i].toLowerCase() === "subsumption"){
				subsumption = value;
			}
			if (queryProps[i].toLowerCase() === "comp"){
				comp = value;
			}
			queryArr.push(queryProps[i]);
		}
		if (unkProps.length > 0){
			qryObjOut.logMessage = "Query parameter error. Query Search query parameters=" + JSON.stringify(queryObject);
			qryObjOut.alertMessage = stringConstants.errors.querySerarchError.message + "Unknown parameter(s): " + unkProps.join(', ') + "."
			isError = true;
		}

		if (nullValueProps.length > 0){
			qryObjOut.logMessage = "Query parameter error. Query Search query parameters=" + JSON.stringify(queryObject);
			if (qryObjOut.alertMessage === "")
				qryObjOut.alertMessage = stringConstants.errors.querySerarchError.message + "Null or empty value parameter(s): " + nullValueProps.join(', ') + "."
			else
				qryObjOut.alertMessage += "\n Null or empty value parameter(s): " + nullValueProps.join(', ') + "."

			isError = true;
		}

		var composition = undefined;
		let unknownComp = [];
		if (comp || comp === "" || comp === null){
			qryObjOut.selectedTab = "Composition-Search";
			composition = parseComposition(comp, unknownComp);
			if (queryArr.length > 1 || unkProps.length > 0){
				qryObjOut.logMessage = "Query parameter error. Query Search query parameters=" + JSON.stringify(queryObject);
				if (qryObjOut.alertMessage === "")
					qryObjOut.alertMessage = "'comp' can not be combined with other query parameter(s)."
				else
					qryObjOut.alertMessage += "\n 'comp' can not be combined with other query parameter(s)."

				isError = true;
			}
			if (unknownComp.length > 0){
				qryObjOut.logMessage = "Query parameter error. Query Search query parameters=" + JSON.stringify(queryObject);
				if (unknownComp.length === 1 && composition.length === 0){
					if (qryObjOut.alertMessage === "")
						qryObjOut.alertMessage = stringConstants.errors.querySerarchError.message + "Composition string needs to be in proper format."
					else
						qryObjOut.alertMessage += "\n Composition string needs to be in proper format."
				} else {
					if (qryObjOut.alertMessage === "")
						qryObjOut.alertMessage = stringConstants.errors.querySerarchError.message + "Unknown composition(s): " + unknownComp.join(', ') + "."
					else
						qryObjOut.alertMessage += "\n Unknown composition(s): " + unknownComp.join(', ') + "."
				}
				
				isError = true;
			}
			if (composition.length === 0 && unknownComp.length === 0){
				qryObjOut.logMessage = "Query parameter error. Query Search query parameters=" + JSON.stringify(queryObject);
				if (qryObjOut.alertMessage === "")
					qryObjOut.alertMessage = stringConstants.errors.querySerarchError.message + "Composition string needs to be in proper format."
				else 
					qryObjOut.alertMessage += "\n Composition string needs to be in proper format."

				isError = true;
			}
		}

		if (massType && querySearch.massType[massType.toLowerCase()] === undefined){
			qryObjOut.logMessage = "Query parameter error. Query Search query parameters=" + JSON.stringify(queryObject);
			if (qryObjOut.alertMessage === "")
				qryObjOut.alertMessage = stringConstants.errors.querySerarchError.message + "Unknown massType value: " + massType  + ".";
			else
				qryObjOut.alertMessage += "\n Unknown massType value: " + massType + ".";

			isError = true;
		}

		if (subsumption && querySearch.subsumption[subsumption.toLowerCase()] === undefined){
			qryObjOut.logMessage = "Query parameter error. Query Search query parameters=" + JSON.stringify(queryObject);
			if(qryObjOut.alertMessage === "")
				qryObjOut.alertMessage = stringConstants.errors.querySerarchError.message + "Unknown subsumption value: " + subsumption  + ".";
			else
				qryObjOut.alertMessage +=  "\n Unknown subsumption value: " + subsumption + ".";

			isError = true;
		}

		if (searchStarted) {
			qryObjOut.logMessage = "";
			qryObjOut.alertMessage = "";
			qryObjOut.selectedTab = "";
			return false;
		}

		if (isError) return isError;

		var glycan_identifier = undefined;
		var glycan_id = undefined;
		if (acc.length > 0) {
			glycan_id = acc.join(',');
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
				subsumption: subsumption ? querySearch.subsumption[subsumption.toLowerCase()].id : "none"
			}
		}

		var tol = tolerance ? parseInt(tolerance) : 1;
		var formjson = {
			[commonGlycanData.operation.id]: 'AND',
			[glycanData.advanced_search.query_type.id]: glycanData.advanced_search.query_type.name,
			[commonGlycanData.mass_type.id]: mass ? massType ? querySearch.massType[massType.toLowerCase()].id: "Native" : undefined,
			[commonGlycanData.mass.id]: mass ? {
				min: parseInt(mass) - tol,
				max: parseInt(mass) + tol,
			} : undefined,
			[commonGlycanData.glycan_identifier.id]: glycan_identifier,
			[commonGlycanData.composition.id]: composition,
		};

		logActivity("user", id, "Performing Glycan Query Search");
		let message = "Query Search query=" + JSON.stringify(formjson);
		getGlycanSearch(formjson)
			.then((response) => {
				if (response.data['list_id'] !== '') {
					logActivity("user", (id || "") + ">" + response.data['list_id'], message)
					.finally(() => {	
						props.history.push(routeConstants.glycanList + response.data['list_id']);
					});;
				} else {
					let message = "No results. Query Search query=" + JSON.stringify(formjson);
					let altMessage = stringConstants.errors.querySerarcApiError.message;
					logActivity("user", "", message);
					setAlertTextInput({"show": true, "id": stringConstants.errors.querySerarchError.id, "message": altMessage});
					window.scrollTo(0, 0);
					setPageLoading(false);
				}
			})
			.catch(function (error) {
				axiosError(error, "", message, setPageLoading, setAlertDialogInput);
			});

		return isError;
	}

	/**
	 * useEffect for retriving data from api and showing page loading effects.
	 */
	useEffect(() => {
		setPageLoading(true);
		logActivity();
		document.addEventListener('click', () => {
			setAlertTextInput({"show": false, message: ""})
		});
		var qryObjOut = {
			logMessage : "",
			alertMessage : "",
			selectedTab : ""
		};
		var queryError = false;
		if (props.location.search){
			queryError = executeQuery(queryString.parse(props.location.search), qryObjOut);
		}
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
				glyAdvSearchValError: [false, false, false, false, false, false, false],
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
				var hash = anchorElement.substr(1);
				if (hash ===  "Simple-Search" || hash ===  "Advanced-Search" || hash ===  "Composition-Search"
				    ||  hash ===  "Tutorial") {
					setGlyActTabKey(hash);	
				} else {
					setGlyActTabKey("Simple-Search");
				}
			} else {
				if (qryObjOut.selectedTab !== ""){
					setGlyActTabKey(qryObjOut.selectedTab);
				} else {
					setGlyActTabKey("Simple-Search");
				}
			}

			if (queryError && qryObjOut.logMessage !== ""){
				logActivity("user", "", qryObjOut.logMessage);
				setAlertTextInput({"show": true, "id": stringConstants.errors.querySerarchError.id, "message": qryObjOut.alertMessage})
				window.scrollTo(0, 0);
			}

			if ((id === undefined && (props.location.search === undefined || props.location.search === "")) || (props.location.search && queryError)) setPageLoading(false);

			id &&
				getGlycanList(id, 1).then(({ data }) => {
					logActivity("user", id, "Search modification initiated");
					if (data.cache_info.query.composition !== undefined) {
						let queryCompData = {};
						for (let x = 0; x < data.cache_info.query.composition.length; x++) {
							let resVal = initData.composition.filter(function (res) {
								return data.cache_info.query.composition[x].residue === res.residue;
							})[0];
							queryCompData[data.cache_info.query.composition[x].residue] = {
								min: data.cache_info.query.composition[x].min,
								selectValue: getSelectionValue(
									parseInt(data.cache_info.query.composition[x].min),
									parseInt(data.cache_info.query.composition[x].max),
									parseInt(resVal.min),
									parseInt(resVal.max)
								),
								max: data.cache_info.query.composition[x].max,
							};
						}
						setGlyCompData(queryCompData);
						setCompSearchDisabled(false);
						setGlyActTabKey("Composition-Search");
						setPageLoading(false);
					} else if (data.cache_info.search_type === glycanData.structure_search.query_type.name) {
						if (data.cache_info.query.parameters && data.cache_info.query.parameters.align === "wholeglycan") {
							setStructSearchData({
								seqType: data.cache_info.query.parameters.seq && data.cache_info.query.parameters.seq.startsWith("WURCS") ? "WURCS" : "GlycoCT",
								glySequence: data.cache_info.query.parameters.seq ? data.cache_info.query.parameters.seq : ''
							});
							setGlyActTabKey("Structure-Search");
						} else if (data.cache_info.query.parameters) {
							setSubStructSearchData({
								seqType: data.cache_info.query.parameters.seq && data.cache_info.query.parameters.seq.startsWith("WURCS") ? "WURCS" : "GlycoCT",
								glySequence: data.cache_info.query.parameters.seq ? data.cache_info.query.parameters.seq : '',
								restrictTo: data.cache_info.query.parameters.align ? data.cache_info.query.parameters.align : 'substructure',
							});
							setGlyActTabKey("Substructure-Search");
						}
						setPageLoading(false);
					} else if (data.cache_info.query.query_type === glycanData.simple_search.query_type.name) {
						setGlySimpleSearchCategory(
							data.cache_info.query.term_category ? data.cache_info.query.term_category : 'any'
						);
						setGlySimpleSearchTerm(data.cache_info.query.term ? data.cache_info.query.term : '');
						setGlyActTabKey("Simple-Search");
						setPageLoading(false);
					} else {
						setGlyAdvSearchData({
							glycanId:
								data.cache_info.query.glycan_identifier === undefined
									? ''
									: data.cache_info.query.glycan_identifier.glycan_id + ",",
							glycanIdSubsumption:
								data.cache_info.query.glycan_identifier === undefined
									? 'none'
									: data.cache_info.query.glycan_identifier.subsumption,
							glyMassType:
								data.cache_info.query.mass_type === undefined
									? initData.glycan_mass.native.name
									: data.cache_info.query.mass_type,
							glyMass:
								data.cache_info.query.mass === undefined
									? data.cache_info.query.mass_type === undefined ||
									  data.cache_info.query.mass_type === initData.glycan_mass.native.name
										? [
												Math.floor(initData.glycan_mass.native.min),
												Math.ceil(initData.glycan_mass.native.max),
										  ]
										: [
												Math.floor(initData.glycan_mass.permethylated.min),
												Math.ceil(initData.glycan_mass.permethylated.max),
										  ]
									: [data.cache_info.query.mass.min, data.cache_info.query.mass.max],
							glyMassInput:
								data.cache_info.query.mass === undefined
									? data.cache_info.query.mass_type === undefined ||
									  data.cache_info.query.mass_type === initData.glycan_mass.native.name
										? [
												Math.floor(initData.glycan_mass.native.min).toLocaleString('en-US'),
												Math.ceil(initData.glycan_mass.native.max).toLocaleString('en-US'),
										  ]
										: [
												Math.floor(initData.glycan_mass.permethylated.min).toLocaleString('en-US'),
												Math.ceil(initData.glycan_mass.permethylated.max).toLocaleString('en-US'),
										  ]
									: [data.cache_info.query.mass.min.toLocaleString('en-US'), data.cache_info.query.mass.max.toLocaleString('en-US')],
							glyMassRange:
								data.cache_info.query.mass_type === undefined ||
								data.cache_info.query.mass_type === initData.glycan_mass.native.name
									? [
											Math.floor(initData.glycan_mass.native.min),
											Math.ceil(initData.glycan_mass.native.max),
									  ]
									: [
											Math.floor(initData.glycan_mass.permethylated.min),
											Math.ceil(initData.glycan_mass.permethylated.max),
									  ],
							glyNumSugars:
								data.cache_info.query.number_monosaccharides === undefined
									? [
											initData.number_monosaccharides.min,
											initData.number_monosaccharides.max,
									  ]
									: [
											data.cache_info.query.number_monosaccharides.min,
											data.cache_info.query.number_monosaccharides.max,
									  ],
							glyNumSugarsInput:
								data.cache_info.query.number_monosaccharides === undefined
									? [
											Number(initData.number_monosaccharides.min).toLocaleString('en-US'),
											Number(initData.number_monosaccharides.max).toLocaleString('en-US'),
									  ]
									: [
											Number(data.cache_info.query.number_monosaccharides.min).toLocaleString('en-US'),
											Number(data.cache_info.query.number_monosaccharides.max).toLocaleString('en-US'),
									  ],
							glyOrgAnnotationCat:
								data.cache_info.query.organism === undefined
									? ''
									: data.cache_info.query.organism.annotation_category,
							glyOrgOperation:
								data.cache_info.query.organism === undefined
									? 'or'
									: data.cache_info.query.organism.operation,
							glyOrganisms:
								data.cache_info.query.organism === undefined
									? []
									: data.cache_info.query.organism.organism_list.map(
										org => {
											return initData.organism.find(initOrg => {
												return initOrg.id === org.id;
											});
										}
									),
							glyType:
								data.cache_info.query.glycan_type === undefined
									? advancedSearch.glycan_type.placeholderId
									: data.cache_info.query.glycan_type,
							glySubType:
								data.cache_info.query.glycan_subtype === undefined
									? advancedSearch.glycan_subtype.placeholderId
									: data.cache_info.query.glycan_subtype,
							glySubTypeIsHidden:
								data.cache_info.query.glycan_type === undefined ? true 
								: initData.glycan_type.find(type => {
									return type.name === data.cache_info.query.glycan_type; }).subtype.length > 1 ? false 
								: true,
							glyProt:
								data.cache_info.query.protein_identifier === undefined
									? ''
									: data.cache_info.query.protein_identifier,
							glyMotif:
								data.cache_info.query.glycan_motif === undefined
									? ''
									: data.cache_info.query.glycan_motif,
							glyBioEnz:
								data.cache_info.query.enzyme === undefined ? '' : data.cache_info.query.enzyme.id,
							glyPubId: data.cache_info.query.pmid === undefined ? '' : data.cache_info.query.pmid,
							glyBindingProteinId:
							data.cache_info.query.binding_protein_id === undefined
								? ''
								: data.cache_info.query.binding_protein_id,
							glyGlyName:
								data.cache_info.query.glycan_name === undefined
									? ''
									: data.cache_info.query.glycan_name,
							glyIDNamespace:
								data.cache_info.query.id_namespace === undefined
									? advancedSearch.id_namespace.placeholderId
									: data.cache_info.query.id_namespace,
							glyAdvSearchValError: [false, false, false, false, false, false, false],
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

	/**
	 * Function to generate glycan search json object.
	 * @param {string} input_query_type - input_query_type value.
	 * @param {string} input_glycan_id - input_glycan_id value.
	 * @param {string} input_glycan_id_subsumption - input_glycan_id_subsumption value.
	 * @param {string} input_mass_type - input_mass_type value.
	 * @param {number} input_mass_min - input_mass_min value.
	 * @param {number} input_mass_max - input_mass_max value.
	 * @param {number} input_sugar_min - input_sugar_min value.
	 * @param {number} input_sugar_max - input_sugar_max value.
	 * @param {array} input_organism - input_organism value.
	 * @param {string} input_organism_annotation_cat - input_organism_annotation_cat value.
	 * @param {string} input_organism_operation - input_organism_operation value.
	 * @param {string} input_glycantype - input_glycantype value.
	 * @param {string} input_glycansubtype - input_glycansubtype value.
	 * @param {string} input_enzyme - input_enzyme value.
	 * @param {string} input_proteinid - input_proteinid value.
	 * @param {string} input_motif - input_motif value.
	 * @param {string} input_pmid - input_pmid value.
	 * @param {string} input_binding_protein_id - input_binding_protein_id value.
	 * @param {string} input_id_namespace - input_id_namespace value.
	 * @param {object} input_residue_comp - input_residue_comp value.
	 **/
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
		input_glycan_name,
		input_glycansubtype,
		input_enzyme,
		input_proteinid,
		input_motif,
		input_pmid,
		input_binding_protein_id,
		input_id_namespace,
		input_residue_comp
	) {
		var enzymes = undefined;
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
		var mass_type = undefined;
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
					mass_type = input_mass_type;
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
					mass_type = input_mass_type;
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
			[commonGlycanData.mass_type.id]: mass_type,
			[commonGlycanData.mass.id]: input_mass,
			[commonGlycanData.number_monosaccharides.id]: monosaccharides,
			[commonGlycanData.enzyme.id]: enzymes,
			[commonGlycanData.glycan_name.id]: input_glycan_name,
			[commonGlycanData.glycan_identifier.id]: glycan_identifier,
			[commonGlycanData.organism.id]: organisms,
			[commonGlycanData.glycan_type.id]: input_glycantype !== "" ? input_glycantype : undefined,
			[commonGlycanData.glycan_subtype.id]: input_glycansubtype !== "" ? input_glycansubtype : undefined,
			[commonGlycanData.protein_identifier.id]: input_proteinid !== "" ? input_proteinid : undefined,
			[commonGlycanData.glycan_motif.id]: input_motif !== "" ? input_motif : undefined,
			[commonGlycanData.pmid.id]: input_pmid !== "" ? input_pmid : undefined,
			[commonGlycanData.binding_protein_id.id]: input_binding_protein_id !== "" ? input_binding_protein_id : undefined,
			[commonGlycanData.id_namespace.id]: input_id_namespace !== "" ? input_id_namespace : undefined,
			[commonGlycanData.composition.id]: input_residue_comp,
		};
		return formjson;
	}

	/**
	 * Function to handle glycan simple search.
	 **/
	const glycanSimpleSearch = () => {
		var formjsonSimple = {
			[commonGlycanData.operation.id]: 'AND',
			[glycanData.simple_search.query_type.id]: glycanData.simple_search.query_type.name,
			[commonGlycanData.term.id]: glySimpleSearchTerm,
			[commonGlycanData.term_category.id]: glySimpleSearchCategory,
		};
		logActivity("user", id, "Performing Simple Search");
		let message = "Simple Search query=" + JSON.stringify(formjsonSimple);
		console.log(message);
		getGlycanSimpleSearch(formjsonSimple)
		.then((response) => {
			if (response.data['list_id'] !== '') {
				logActivity("user", (id || "") + ">" + response.data['list_id'], message)
				.finally(() => {	
					props.history.push(routeConstants.glycanList + response.data['list_id']);
				});
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

	/**
	 * Function to handle glycan advanced search.
	 **/
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
			glyAdvSearchData.glyGlyName,
			glyAdvSearchData.glySubType,
			glyAdvSearchData.glyBioEnz,
			glyAdvSearchData.glyProt,
			glyAdvSearchData.glyMotif,
			glyAdvSearchData.glyPubId,
			glyAdvSearchData.glyBindingProteinId,
			glyAdvSearchData.glyIDNamespace,
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

	/**
	 * Function to handle glycan composition search.
	 **/
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


/**
	 * Function to return JSON query.
   * @param {string} input_proSequence - protein sequence.
	 * @param {string} input_targetDatabase - target database.
	 * @param {string} input_eValue - E-value.
	 * @param {string} input_maxHits - Max number of hits.
	 **/
  function searchJson(
    input_glSequence,
    input_align = "wholeglycan",
  ) {
    
      var formJson = {
          [commonGlycanData.jobtype.id]: "structure_search",
          "parameters": {
            [commonGlycanData.seq.id]: input_glSequence,
            [commonGlycanData.align.id]: input_align
          }
    };

    return formJson;
  }

    /**
	 * Function to handle structure search submit.
	**/
  const structSearchSubmit = (type) => {

	let formObject = {};
	let message = "";
	if (type === "structure") {
		formObject = searchJson(
			structSearchData.glySequence,
		  );
		message = "Structure Search query=" + JSON.stringify(formObject);
		logActivity("user", id, message);
	} else if (type === "substructure"){
		formObject = searchJson(
			subStructSearchData.glySequence,
			subStructSearchData.restrictTo,
		  );
		message = "Substructure Search query=" + JSON.stringify(formObject);
		logActivity("user", id, message);
	}

      postNewJob(formObject)
      .then((response) => {
        if (response.data["status"] && response.data["status"] !== {}) {
		  let status = response.data["status"];
          let josStatus = status.status;
          let jobid = response.data["jobid"];
          if (josStatus === "finished") {
			setPageLoading(false);
            if (status["result_count"] && status["result_count"] > 0) {
				getJobResultList(jobid)
					.then((response) => {
						if (response.data['list_id'] !== '') {
							logActivity("user", (id || "") + ">" + jobid, message + " " + response.jobtype + " " + response.list_id).finally(() => {
								props.history.push(routeConstants.glycanList + response.data['list_id']);
							  });
							setPageLoading(false);
						} else {
							logActivity("user", "", "No results. " + message);
							setPageLoading(false);
							setAlertTextInput({"show": true, "id": (glyActTabKey === "Structure-Search" ? stringConstants.errors.structureSearchError.id : stringConstants.errors.substructureSearchError.id)})
							window.scrollTo(0, 0);
						}
					})
					.catch(function (error) {
						axiosError(error, "", message, setPageLoading, setAlertDialogInput);
					});
            } else {
              logActivity("user", "", "No results. " + message);
              setPageLoading(false);
              setAlertTextInput({"show": true, "id": (glyActTabKey === "Structure-Search" ? stringConstants.errors.structureSearchError.id : stringConstants.errors.substructureSearchError.id)})
              window.scrollTo(0, 0);
            }
          } else if (josStatus === "running") {
            setTimeout((jobID) => {
				searchJobStatus(jobID);
          	}, 2000, jobid);
          } else {
			let error = status.error ? status.error : "";
			logActivity("user", "", "No results. " + message + " " + error);
			setPageLoading(false);
			setAlertTextInput({"show": true, "id": (glyActTabKey === "Structure-Search" ? stringConstants.errors.structureSearchError.id : stringConstants.errors.substructureSearchError.id), custom : error});
			window.scrollTo(0, 0);
		  }
        }  else {
          logActivity("user", "", "No results. " + message);
          setPageLoading(false);
          setAlertTextInput({"show": true, "id": (glyActTabKey === "Structure-Search" ? stringConstants.errors.structureSearchError.id : stringConstants.errors.substructureSearchError.id)})
          window.scrollTo(0, 0);
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };


  /**
	 * Function to handle structure search job status.
   * @param {string} jobID - job id.
	 **/
  const searchJobStatus = (jobID) => {
    let message = "Structure/Substructure Search query=" + JSON.stringify(jobID);
    getJobStatus(jobID)
      .then((response) => {
        if (response.data["status"] && response.data["status"] !== {}) {
          let josStatus = response.data["status"];
          	if (josStatus === "finished") {
				setPageLoading(false);
				if (response.data["result_count"] && response.data["result_count"] > 0) {
					getJobResultList(jobID)
						.then((response) => {
							if (response.data['list_id'] !== '') {
								logActivity("user", (id || "") + ">" + jobID, message + " " + response.jobtype + " " + response.list_id).finally(() => {
									props.history.push(routeConstants.glycanList + response.data['list_id']);
								});
								setPageLoading(false);
							} else {
								logActivity("user", "", "No results. " + message);
								setPageLoading(false);
								setAlertTextInput({"show": true, "id": (glyActTabKey === "Structure-Search" ? stringConstants.errors.structureSearchError.id : stringConstants.errors.substructureSearchError.id)})
								window.scrollTo(0, 0);
							}
						})
						.catch(function (error) {
							axiosError(error, "", message, setPageLoading, setAlertDialogInput);
						});
				} else {
					logActivity("user", "", "No results. " + message);
					setPageLoading(false);
					setAlertTextInput({"show": true, "id": (glyActTabKey === "Structure-Search" ? stringConstants.errors.structureSearchError.id : stringConstants.errors.substructureSearchError.id)})
					window.scrollTo(0, 0);
				}
			} else if (josStatus === "running") {
				setTimeout((jobID) => {
					searchJobStatus(jobID);
				}, 2000, jobID);
			}  else {
				let error = response.data["error"] ? response.data["error"] : "";
				logActivity("user", "", "No results. " + message + " " + error);
				setPageLoading(false);
				setAlertTextInput({"show": true, "id": (glyActTabKey === "Structure-Search" ? stringConstants.errors.structureSearchError.id : stringConstants.errors.substructureSearchError.id), custom : error})
				window.scrollTo(0, 0);
			}  
		} else {
          logActivity("user", "", "No results. " + message);
          setPageLoading(false);
          setAlertTextInput({"show": true, "id": (glyActTabKey === "Structure-Search" ? stringConstants.errors.structureSearchError.id : stringConstants.errors.substructureSearchError.id)})
          window.scrollTo(0, 0);
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  /**
   * Function to handle click event for structure search.
   **/
  const searchStructClick = () => {
    setPageLoading(true);
    structSearchSubmit("structure");
  };

	/**
   * Function to handle click event for substructure search.
   **/
  const searchSubStructClick = () => {
    setPageLoading(true);
    structSearchSubmit("substructure");
  };

	/**
	 * Function to handle click event for glycan advanced search.
	 **/
	const searchGlycanAdvClick = () => {
		setSearchStarted(true);
		setPageLoading(true);
		glycanAdvSearch();
	};

	/**
	 * Function to handle click event for glycan composition search.
	 **/
	const searchGlycanCompClick = () => {
		setSearchStarted(true);
		setPageLoading(true);
		glycanCompSearch();
	};

	/**
	 * Function to handle click event for glycan simple search.
	 **/
	const searchGlycanSimpleClick = () => {
		setSearchStarted(true);
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
										setCompSearchDisabled={setCompSearchDisabled}
										compSearchDisabled={compSearchDisabled}
										step={1}
									/>
								)}
							</Container>
						</Tab>
						<Tab
							eventKey='Structure-Search'
							title={glycanSearchData.structure_search.tabTitle}
							className='tab-content-padding'>
							<TextAlert
								alertInput={alertTextInput}
							/>
							<Container className='tab-content-border'>
								{initData.composition && (
									<StructureSearchControl
										searchStructClick={searchStructClick}
										inputValue={structSearchData}
										setInputValue={setStructSearchData}
									/>
								)}
							</Container>
						</Tab>
						<Tab
							eventKey='Substructure-Search'
							title={glycanSearchData.substructure_search.tabTitle}
							className='tab-content-padding'>
							<TextAlert
								alertInput={alertTextInput}
							/>
							<Container className='tab-content-border'>
								{initData.composition && (
									<SubstructureSearchControl
										searchSubStructClick={searchSubStructClick}
										inputValue={subStructSearchData}
										setInputValue={setSubStructSearchData}
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