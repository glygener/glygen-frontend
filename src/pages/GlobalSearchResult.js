import React, { useEffect, useReducer, useState } from 'react';
import Helmet from 'react-helmet';
import { getTitle, getMeta } from '../utils/head';
import PageLoader from '../components/load/PageLoader';
import GlobalSearchCard from '../components/cards/GlobalSearchCard';
import GlobalSearchDualCard from '../components/cards/GlobalSearchDualCard';
import DialogAlert from '../components/alert/DialogAlert';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import '../css/Search.css';
import routeConstants from '../data/json/routeConstants';
import {logActivity} from '../data/logging';
import {axiosError} from '../data/axiosError';
import FeedbackWidget from "../components/FeedbackWidget";
import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";
import LineTooltip from "../components/tooltip/LineTooltip";
import { getGlobalSearch} from '../data/commonApi';
import stringConstants from "../data/json/stringConstants";

/**
 * GlobalSearchResult component for showing global search result.
 */
const GlobalSearchResult = (props) => {
	let { id } = useParams("");
	let glycanGlobalSearch = stringConstants.glycan.global_search_results;
	let proteinGlobalSearch = stringConstants.protein.global_search_results;

	const [pageLoading, setPageLoading] = useState(true);
	const [alertDialogInput, setAlertDialogInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{show: false, id: ""}
	);
	const [globalSearchData, setGlobalSearchData] = useState({});
	const [proteinKeyList, setProteinKeyList] = useState([]);


	/**
	 * useEffect for retriving data from api and showing page loading effects.
	 */
    useEffect(() => {
		setPageLoading(true);
		logActivity();
		getGlobalSearch(id).then(({ data }) => {
		logActivity("user", (id || ""), "Global search term=" + id);
		setGlobalSearchData(data);
										
		let proteinKeys = Object.keys(data.other_matches.protein);	
		let glycoproteinKeys = Object.keys(data.other_matches.glycoprotein);	
		for (let item of glycoproteinKeys){
			if (!proteinKeys.includes(item)) {
				proteinKeys.push(item);
			}
		}
		setProteinKeyList(proteinKeys);
		setPageLoading(false);
	})
	.catch(function (error) {
		let message = "global search api call term=" + id;
		axiosError(error, id, message, setPageLoading, setAlertDialogInput);
	});
}, [id]);
    
	return (
		<>
			<Helmet>
				{getTitle('globalSearchResult')}
				{getMeta('globalSearchResult')}
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

                    <Paper className={"gs-result-paper"}>
                        <div className="gs-panel-heading gs-panel">
                            <h2><strong>Search result for <span style={{ color: "#2F78B7" }}>{id}</span></strong></h2>
                        </div>

						<Typography className={"gs-exact-match"} variant="h6"> 	
							{globalSearchData.exact_match && globalSearchData.exact_match.map((searchMatch) => 
									<li key={searchMatch.id}>
										<span>A {searchMatch.type} exactly matching </span>
										<LineTooltip text="Click to see details page."> 
											<Link
												className={"gs-exact-match-link"}
												to={searchMatch.type === "glycan" ? routeConstants.glycanDetail + searchMatch.id : routeConstants.proteinDetail + searchMatch.id}
												>
											{id}
											</Link>
										</LineTooltip>
										<span> was found.</span>
									</li>
								)}
						</Typography>
					<Grid
						container
						style={{ margin: '0  auto' }}
						justifyContent='center'>
							<Grid item md={4}>
								{globalSearchData.other_matches && <GlobalSearchCard
									cardTitle="Glycan(s)"
									route={routeConstants.glycanList}
									term={id}
									routeTerm="gs"
									allCount={globalSearchData.other_matches.glycan.all.count}
									allListId={globalSearchData.other_matches.glycan.all.list_id}
									colHeading1={"Database"}
									colHeading2={"Glycan"}
									searchItems={Object.keys(globalSearchData.other_matches.glycan)
										.map((searchItem)  => {return {name: glycanGlobalSearch[searchItem] ? glycanGlobalSearch[searchItem].name : searchItem, count: globalSearchData.other_matches.glycan[searchItem].count, list_id : globalSearchData.other_matches.glycan[searchItem].list_id}})}
								/>}
							</Grid>
							<Grid item md={6}>
								{globalSearchData.other_matches && proteinKeyList.length > 0 && <GlobalSearchDualCard
									cardTitle1="Protein(s)"
									cardTitle2="Glycoprotein(s)"
									route={routeConstants.proteinList}
									term={id}
									routeTerm="gs"
									allCount1={globalSearchData.other_matches.protein.all.count}
									allListId1={globalSearchData.other_matches.protein.all.list_id}
									allCount2={globalSearchData.other_matches.glycoprotein.all.count}
									allListId2={globalSearchData.other_matches.glycoprotein.all.list_id}
									colHeading1={"Database"}
									colHeading2={"Protein"}
									colHeading3={"Glycoprotein"}
									searchItems={
										proteinKeyList
										.map((searchItem)  => {return {name: proteinGlobalSearch[searchItem] ? proteinGlobalSearch[searchItem].name : searchItem, count1: globalSearchData.other_matches.protein[searchItem] ? globalSearchData.other_matches.protein[searchItem].count : 0, list_id1 : globalSearchData.other_matches.protein[searchItem] ? globalSearchData.other_matches.protein[searchItem].list_id : "",
																count2: globalSearchData.other_matches.glycoprotein[searchItem] ? globalSearchData.other_matches.glycoprotein[searchItem].count : 0, list_id2 : globalSearchData.other_matches.glycoprotein[searchItem] ? globalSearchData.other_matches.glycoprotein[searchItem].list_id : ""}})}
								/>}
							</Grid>
						</Grid>
                    </Paper>
                </Container>
            </div>
		</>
	);
};

export default GlobalSearchResult;