import React, { useEffect, useReducer, useState } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import PageLoader from "../components/load/PageLoader";
import TextAlert from "../components/alert/TextAlert";
import DialogAlert from "../components/alert/DialogAlert";
import ProteinAdvancedSearch from "../components/search/ProteinAdvancedSearch";
import SimpleSearchControl from "../components/search/SimpleSearchControl";
import { Tab, Tabs, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "../css/Search.css";
import proteinSearchData from "../data/json/proteinSearch";
import stringConstants from "../data/json/stringConstants";
import routeConstants from "../data/json/routeConstants";
import { logActivity } from "../data/logging";
import { axiosError } from "../data/axiosError";
import {
	getProteinSearch,
	getProteinSimpleSearch,
	getProteinList,
	getProteinInit,
} from "../data/protein";
import FeedbackWidget from "../components/FeedbackWidget";
import ProteinTutorial from "../components/tutorial/ProteinTutorial";

const ProteinSearch = (props) => {
	let { id } = useParams("");
	const [initData, setInitData] = useState({});

	const [proSimpleSearchCategory, setProSimpleSearchCategory] = useState("any");
	const [proSimpleSearchTerm, setProSimpleSearchTerm] = useState("");
	const [proAdvSearchData, setProAdvSearchData] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{
			proteinId: "",
			proRefSeqId: "",
			proMass: [260, 3906488],
			proMassInput: [
				Number(260).toLocaleString("en-US"),
				Number(3906488).toLocaleString("en-US"),
			],
			proMassRange: [260, 3906488],
			proOrganism: { id: "0", name: "All" },
			proteinName: "",
			proGeneName: "",
			proGOName: "",
			proGOId: "",
			proGlytoucanAc: "",
			proRelation: "attached",
			proAminoAcid: [],
			proAminoAcidOperation: "or",
			proSequence: "",
			proPathwayId: "",
			proPubId: "",
			proGlyEvidence: "",
			proAdvSearchValError: [
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
			],
		}
	);
	const [proActTabKey, setProActTabKey] = useState("simple_search");
	const [pageLoading, setPageLoading] = useState(true);
	const [alertTextInput, setAlertTextInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{ show: false, id: "" }
	);
	const [alertDialogInput, setAlertDialogInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{ show: false, id: "" }
	);

	let simpleSearch = proteinSearchData.simple_search;
	let advancedSearch = proteinSearchData.advanced_search;
	let proteinData = stringConstants.protein;
	let commonProteinData = proteinData.common;

	useEffect(() => {
		setPageLoading(true);
		logActivity();
		document.addEventListener("click", () => {
			setAlertTextInput({ show: false });
		});
		getProteinInit()
			.then((response) => {
				let initData = response.data;
				setProAdvSearchData({
					proMass: [
						Math.floor(initData.protein_mass.min),
						Math.ceil(initData.protein_mass.max),
					],
					proMassInput: [
						Math.floor(initData.protein_mass.min).toLocaleString("en-US"),
						Math.ceil(initData.protein_mass.max).toLocaleString("en-US"),
					],
					proMassRange: [
						Math.floor(initData.protein_mass.min),
						Math.ceil(initData.protein_mass.max),
					],
				});

				setInitData(initData);
				setProActTabKey("simple_search");
				if (id === undefined) setPageLoading(false);

				id &&
					getProteinList(id, 1)
						.then(({ data }) => {
							logActivity("user", id, "Search modification initiated");
							if (
								data.query.query_type ===
								proteinData.simple_search.query_type.name
							) {
								setProSimpleSearchCategory(
									data.query.term_category ? data.query.term_category : "any"
								);
								setProSimpleSearchTerm(data.query.term ? data.query.term : "");
								const anchorElement = props.history.location.hash;
								if (anchorElement) {
									setProActTabKey(anchorElement.substr(1));	
								} else {
									setProActTabKey("simple_search");
								}
								setPageLoading(false);
							} else {
								setProAdvSearchData({
									proteinId:
										data.query.uniprot_canonical_ac === undefined
											? ""
											: data.query.uniprot_canonical_ac + ",",
									proRefSeqId:
										data.query.refseq_ac === undefined
											? ""
											: data.query.refseq_ac,
									proMass:
										data.query.mass === undefined
											? [
													Math.floor(initData.protein_mass.min),
													Math.ceil(initData.protein_mass.max),
											  ]
											: [
													Math.floor(data.query.mass.min),
													Math.ceil(data.query.mass.max),
											  ],
									proMassInput:
										data.query.mass === undefined
											? [
													Math.floor(initData.protein_mass.min).toLocaleString(
														"en-US"
													),
													Math.ceil(initData.protein_mass.max).toLocaleString(
														"en-US"
													),
											  ]
											: [
													Math.floor(data.query.mass.min).toLocaleString(
														"en-US"
													),
													Math.ceil(data.query.mass.max).toLocaleString(
														"en-US"
													),
											  ],
									proOrganism:
										data.query.organism === undefined
											? {
													id: advancedSearch.organism.placeholderId,
													name: advancedSearch.organism.placeholderName,
											  }
											: {
													id: data.query.organism.id,
													name: data.query.organism.name,
											  },
									proteinName:
										data.query.protein_name === undefined
											? ""
											: data.query.protein_name,
									proGeneName:
										data.query.gene_name === undefined
											? ""
											: data.query.gene_name,
									proGOName:
										data.query.go_term === undefined ? "" : data.query.go_term,
									proGOId:
										data.query.go_id === undefined ? "" : data.query.go_id,
									proGlytoucanAc:
										data.query.glycan === undefined
											? ""
											: data.query.glycan.glytoucan_ac,
									proRelation:
										data.query.glycan === undefined
											? "attached"
											: data.query.glycan.relation,
									proAminoAcid:
										data.query.glycosylated_aa === undefined
											? []
											: data.query.glycosylated_aa.aa_list.map((aminoAcid) => {
													return initData.aa_list.find((aa) => {
														return aa.key === aminoAcid;
													});
											  }),
									proAminoAcidOperation:
										data.query.glycosylated_aa === undefined
											? "or"
											: data.query.glycosylated_aa.operation,
									proSequence:
										data.query.sequence === undefined
											? ""
											: data.query.sequence.aa_sequence,
									proPathwayId:
										data.query.pathway_id === undefined
											? ""
											: data.query.pathway_id,
									proPubId:
										data.query.pmid === undefined ? "" : data.query.pmid,
									proGlyEvidence:
										data.query.glycosylation_evidence === undefined
											? advancedSearch.glycosylation_evidence.placeholderId
											: data.query.glycosylation_evidence,
								});

								setProActTabKey("advanced_search");
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
	}, [id, proteinData]);

	const proteinSimpleSearch = () => {
		var formjsonSimple = {
			[commonProteinData.operation.id]: "AND",
			[proteinData.simple_search.query_type.id]:
				proteinData.simple_search.query_type.name,
			[commonProteinData.term.id]: proSimpleSearchTerm,
			[commonProteinData.term_category.id]: proSimpleSearchCategory,
		};
		logActivity("user", id, "Performing Simple Search");
		let message = "Simple Search query=" + JSON.stringify(formjsonSimple);
		getProteinSimpleSearch(formjsonSimple)
			.then((response) => {
				if (response.data["list_id"] !== "") {
					logActivity(
						"user",
						(id || "") + ">" + response.data["list_id"],
						message
					)
					.finally(() => {	
						props.history.push(
							routeConstants.proteinList + response.data["list_id"]
						);
					});;
					setPageLoading(false);
				} else {
					logActivity("user", "", "No results. " + message);
					setPageLoading(false);
					setAlertTextInput({
						show: true,
						id: stringConstants.errors.simpleSerarchError.id,
					});
					window.scrollTo(0, 0);
				}
			})
			.catch(function (error) {
				axiosError(error, "", message, setPageLoading, setAlertDialogInput);
			});
	};

	/**
	 * Forms searchjson from the form values submitted
	 * @param {string} input_query_type query search
	 * @param {string} input_protein_id user protein input
	 * @param {string} input_refseq_id user input
	 * @param {string} input_mass_min user mass min input
	 * @param {string} input_mass_max user mass max input
	 * @param {string} input_organism organism input
	 * @param {string} input_protein_name user input
	 * @param {string} input_gene_name user input
	 * @param {string} input_go_term user input
	 * @param {string} input_go_id user input
	 * @param {string} input_glycan user input
	 * @param {string} input_glycosylated_aa user input
	 * @param {string} input_glycosylated_aa_operation user input
	 * @param {string} input_sequence user input
	 * @param {string} input_pathway_id user input
	 * @param {string} input_pmid user input
	 * @param {string} input_relation user input
	 * @return {string} returns json
	 */
	function searchJson(
		input_query_type,
		input_protein_id,
		input_refseq_id,
		input_mass_min,
		input_mass_max,
		input_organism,
		input_protein_name,
		input_gene_name,
		input_go_term,
		input_go_id,
		input_glycan,
		input_relation,
		input_glycosylated_aa,
		input_glycosylated_aa_operation,
		input_sequence,
		input_pathway_id,
		input_pmid,
		input_glycosylation_evidence
	) {
		var uniprot_id = input_protein_id;
		if (uniprot_id) {
			uniprot_id = input_protein_id.trim();
			uniprot_id = uniprot_id.replace(/\u200B/g, "");
			uniprot_id = uniprot_id.replace(/\u2011/g, "-");
			uniprot_id = uniprot_id.replace(/\s+/g, ",");
			uniprot_id = uniprot_id.replace(/,+/g, ",");
			var index = uniprot_id.lastIndexOf(",");
			if (index > -1 && index + 1 === uniprot_id.length) {
				uniprot_id = uniprot_id.substr(0, index);
			}
		}

		var sequences;
		if (input_sequence) {
			sequences = {
				type: "exact",
				aa_sequence: input_sequence,
			};
		}

		var glycans = undefined;
		if (input_glycan) {
			glycans = {
				relation: input_relation,
				glytoucan_ac: input_glycan,
			};
		}
		var selected_organism = undefined;
		if (
			input_organism &&
			input_organism.id !== advancedSearch.organism.placeholderId
		) {
			selected_organism = {
				id: input_organism.id,
				name: input_organism.name,
			};
		}
		var glyco_aa = undefined;
		if (input_glycosylated_aa && input_glycosylated_aa.length > 0) {
			glyco_aa = {
				aa_list: input_glycosylated_aa,
				operation: input_glycosylated_aa_operation,
			};
		}

		var input_mass = undefined;
		if (
			initData.protein_mass.min !== input_mass_min ||
			initData.protein_mass.max !== input_mass_max
		) {
			input_mass = {
				min: parseInt(input_mass_min),
				max: parseInt(input_mass_max),
			};
		}

		var formjson = {
			[commonProteinData.operation.id]: "AND",
			[proteinData.advanced_search.query_type.id]: input_query_type,
			[commonProteinData.uniprot_canonical_ac.id]: uniprot_id
				? uniprot_id
				: undefined,
			[commonProteinData.refseq_ac.id]: input_refseq_id
				? input_refseq_id
				: undefined,
			[commonProteinData.mass.id]: input_mass,
			[commonProteinData.organism.id]: selected_organism,
			[commonProteinData.protein_name.id]: input_protein_name
				? input_protein_name
				: undefined,
			[commonProteinData.gene_name.id]: input_gene_name
				? input_gene_name
				: undefined,
			[commonProteinData.go_term.id]: input_go_term ? input_go_term : undefined,
			[commonProteinData.go_id.id]: input_go_id ? input_go_id : undefined,
			[commonProteinData.glycan.id]: glycans ? glycans : undefined,
			[commonProteinData.glycosylated_aa.id]: glyco_aa ? glyco_aa : undefined,
			[commonProteinData.sequence.id]: sequences ? sequences : undefined,
			[commonProteinData.pathway_id.id]: input_pathway_id
				? input_pathway_id
				: undefined,
			[commonProteinData.pmid.id]: input_pmid ? input_pmid : undefined,
			[commonProteinData.glycosylation_evidence
				.id]: input_glycosylation_evidence
				? input_glycosylation_evidence
				: undefined,
		};
		return formjson;
	}

	const proteinAdvSearch = () => {
		let formObject = searchJson(
			proteinData.advanced_search.query_type.name,
			proAdvSearchData.proteinId,
			proAdvSearchData.proRefSeqId,
			proAdvSearchData.proMass[0],
			proAdvSearchData.proMass[1],
			proAdvSearchData.proOrganism,
			proAdvSearchData.proteinName,
			proAdvSearchData.proGeneName,
			proAdvSearchData.proGOName,
			proAdvSearchData.proGOId,
			proAdvSearchData.proGlytoucanAc,
			proAdvSearchData.proRelation,
			proAdvSearchData.proAminoAcid.map((aminoAcid) => {
				return aminoAcid.key;
			}),
			proAdvSearchData.proAminoAcidOperation,
			proAdvSearchData.proSequence,
			proAdvSearchData.proPathwayId,
			proAdvSearchData.proPubId,
			proAdvSearchData.proGlyEvidence
		);
		logActivity("user", id, "Performing Advanced Search");
		let message = "Advanced Search query=" + JSON.stringify(formObject);
		getProteinSearch(formObject)
			.then((response) => {
				if (response.data["list_id"] !== "") {
					logActivity(
						"user",
						(id || "") + ">" + response.data["list_id"],
						message
					)
					.finally(() => {	
						props.history.push(
							routeConstants.proteinList + response.data["list_id"]
						);
					});;
					setPageLoading(false);
				} else {
					logActivity("user", "", "No results. " + message);
					setPageLoading(false);
					setAlertTextInput({
						show: true,
						id: stringConstants.errors.advSerarchError.id,
					});
					window.scrollTo(0, 0);
				}
			})
			.catch(function (error) {
				axiosError(error, "", message, setPageLoading, setAlertDialogInput);
			});
	};

	const searchProteinAdvClick = () => {
		setPageLoading(true);
		proteinAdvSearch();
	};

	const searchProteinSimpleClick = () => {
		setPageLoading(true);
		proteinSimpleSearch();
	};

	return (
		<>
			<Helmet>
				{getTitle("proteinSearch")}
				{getMeta("proteinSearch")}
			</Helmet>
			<FeedbackWidget />
			<div className="lander">
				<Container>
					<PageLoader pageLoading={pageLoading} />
					<DialogAlert
						alertInput={alertDialogInput}
						setOpen={(input) => {
							setAlertDialogInput({ show: input });
						}}
					/>
					<div className="content-box-md">
						<h1 className="page-heading">{proteinSearchData.pageTitle}</h1>
					</div>
					<Tabs
						defaultActiveKey="advanced_search"
						transition={false}
						activeKey={proActTabKey}
						mountOnEnter={true}
						unmountOnExit={true}
						onSelect={(key) => setProActTabKey(key)}>
						<Tab
							eventKey="simple_search"
							className="tab-content-padding"
							title={simpleSearch.tabTitle}>
							<TextAlert alertInput={alertTextInput} />
							<div style={{ paddingBottom: "20px" }}></div>
							<Container className="tab-content-border">
								{initData.simple_search_category && (
									<SimpleSearchControl
										simpleSearchCategory={proSimpleSearchCategory}
										simpleSearchCategoryLabel={
											commonProteinData.term_category.name
										}
										simpleSearchTerm={proSimpleSearchTerm}
										simple_search_category={initData.simple_search_category}
										simple_search={simpleSearch.categories}
										searchSimpleClick={searchProteinSimpleClick}
										setSimpleSearchCategory={setProSimpleSearchCategory}
										setSimpleSearchTerm={setProSimpleSearchTerm}
										length={simpleSearch.length}
										errorText={simpleSearch.errorText}
									/>
								)}
							</Container>
						</Tab>
						<Tab
							eventKey="advanced_search"
							className="tab-content-padding"
							title={advancedSearch.tabTitle}>
							<TextAlert alertInput={alertTextInput} />
							<Container className="tab-content-border">
								{initData && (
									<ProteinAdvancedSearch
										searchProteinAdvClick={searchProteinAdvClick}
										inputValue={proAdvSearchData}
										initData={initData}
										setProAdvSearchData={setProAdvSearchData}
									/>
								)}
							</Container>
						</Tab>
						<Tab
							eventKey="tutorial"
							title={proteinSearchData.tutorial.tabTitle}
							className="tab-content-padding">
							<Container className="tab-content-border">
								<ProteinTutorial />
							</Container>
						</Tab>
					</Tabs>
				</Container>
			</div>
		</>
	);
};

export default ProteinSearch;
