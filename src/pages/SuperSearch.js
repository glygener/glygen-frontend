import React, { useEffect, useReducer, useState } from 'react';
import Helmet from 'react-helmet';
import { getTitle, getMeta } from '../utils/head';
import PageLoader from '../components/load/PageLoader';
import DialogAlert from '../components/alert/DialogAlert';
import UserPermission from '../components/alert/UserPermission';
import SuperSearchQueryDisplay from '../components/alert/SuperSearchQueryDisplay';
import SuperSearchSampleQuery from '../components/search/SuperSearchSampleQuery';
import { Tab, Tabs, Container } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../css/Search.css';
import Grid from '@mui/material/Grid';
import superSearchData from '../data/json/superSearchData';
import routeConstants from '../data/json/routeConstants';
import edgerules from '../data/json/edgerules';
import {logActivity} from '../data/logging';
import {axiosError} from '../data/axiosError';
import { getSuperSearchList, getSuperSearchInit} from '../data/supersearch';
import FeedbackWidget from "../components/FeedbackWidget";
import SuperSearchSVG from '../components/search/SuperSearchSVG';
import SuperSearchControl from '../components/search/SuperSearchControl';
import { Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { getSuperSearch } from '../data/supersearch';
import OutlinedInput from '@mui/material/OutlinedInput';
import LineTooltip from "../components/tooltip/LineTooltip";
import stringConstants from "../data/json/stringConstants";

/**
 * Super search component for showing super search tabs.
 */
const SuperSearch = (props) => {
  let superSearchJSONData = superSearchData.super_search;
  let superSearchTutorialData = superSearchData.tutorial;
  let superSearchCommonData = superSearchData.common;
  let superSearchStringCommonData = stringConstants.super_search.common;


  let { id } = useParams("");
  let { searchId } = useParams();

  const [initData, setInitData] = useState([]);
  const [svgData, setSVGData] = useState([]);
  const [selectedNode, setSelectedNode] = useState("");
  const [queryData, setQueryData] = useState({});
  const [queryDataDirect, setQueryDataDirect] = useState(JSON.stringify(edgerules, null, 2));
  const [supSearchShowQuery, setSupSearchShowQuery] = useState(false);
  const [supSearchSampleQuery, setSupSearchSampleQuery] = useState(false);
  const [supSearchActTabKey, setSupSearchActTabKey] = useState('Super-Search');
  const [superSearchQuerySelect, setSuperSearchQuerySelect] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [enableDebug, setEnableDebug] = useState(false);
  const [showData, setShowData] = useState(true);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{show: false, id: ""}
	);
  const [userPermission, setUserPermission] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  /**
	* useEffect for retriving data from api and showing page loading effects.
  */
  useEffect(() => {
	setPageLoading(true);
	logActivity();
	getSuperSearchInit().then((response) => {
		var initData = response.data;
		setInitData(initData);
		var initSvgData = getInitSVGData(initData);
		setSVGData(initSvgData);
		const anchorElement = location.hash;
		if (anchorElement) {
			setSupSearchActTabKey(anchorElement.substr(1));	
		} else {
			setSupSearchActTabKey("Super-Search");
		}
		if (id === undefined) setPageLoading(false);

		id &&
		getSuperSearchList(id, 1).then(({ data }) => {
				logActivity("user", id, "Super Search modification initiated");
				setQueryData(data.cache_info.query);
				if (data.cache_info.result_summary !== undefined) {
					updateNodeData(data.cache_info.result_summary, initSvgData, initData);
				}
				setSupSearchActTabKey("Super-Search");
				setPageLoading(false);
			})
			.catch(function (error) {
				let message = "super search list api call";
				axiosError(error, "", message, setPageLoading, setAlertDialogInput);
			});
	})
	.catch(function (error) {
		let message = "super search_init api call";
		axiosError(error, "", message, setPageLoading, setAlertDialogInput);
	});

  }, [id, searchId])

 

  /**
    * Function to get svg init data.
	* @param {object} initData - init data.
  **/
  function getInitSVGData(initData) {
	var initSvgData = initData.map((node) => {
		let tempNode =  {
			description: node.description,
			record_count: node.record_count,
			id: node.id,
			label: node.label,
			list_id: node.list_id ? node.list_id : "",
		};
		if (node.bylinkage !== undefined) {
			for (let key in node.bylinkage) {
				tempNode[node.id + "_" + key + "_record_count"] = node.bylinkage[key].result_count;
				tempNode[node.id + "_" + key + "_list_id"] = node.bylinkage[key].list_id;
			}
		}
		return tempNode;
	  });
	  return initSvgData;
  }

  /**
    * Function to update svg node data.
	* @param {object} searchData - search data.
	* @param {array} initSvgData - init svg data.
  **/
  function updateNodeData(searchData, initSvgData, initDataTemp){
	  var updatedData = [];
	  if (searchData !== undefined) {
		let tempData = initSvgData ? JSON.parse(JSON.stringify(initSvgData)) : JSON.parse(JSON.stringify(svgData));
		updatedData = tempData.map((node) => {
			let id = node.id;
			node.record_count = searchData[id] ? searchData[id].result_count : 0;
			node.list_id = searchData[id] ? searchData[id].list_id : "";
			const initNode = initDataTemp ? initDataTemp.find((node) => node.id === id) : initData.find((node) => node.id === id);
			if (initNode !== undefined && initNode.bylinkage !== undefined) {
				for (let key in initNode.bylinkage) {
					node[id + "_" + key + "_record_count"] = searchData[id] && searchData[id].bylinkage && searchData[id].bylinkage[key] && searchData[id].bylinkage[key].result_count !== undefined ? searchData[id].bylinkage[key].result_count : undefined;
					node[id + "_" + key + "_list_id"] = searchData[id] && searchData[id].bylinkage && searchData[id].bylinkage[key] && searchData[id].bylinkage[key].list_id !== undefined ? searchData[id].bylinkage[key].list_id : undefined;
				}
			}
			return node;
		});
	} else {
		updatedData = getInitSVGData(initData);
	}
	  setSVGData(updatedData);
  }

  /**
    * Function to go to list page based on node click.
	* @param {string} listID - list id.
	* @param {string} currentNode - current node id.
  **/
  function goToListPage(listID, currentNode){
	let message = "Super Search " + currentNode + " list page. query=" + JSON.stringify(queryData);
	logActivity(
		"user",
		(id || "") + ">" + listID,
		message
	)
	.finally(() => {	
		navigate(
			getListPageRoute(currentNode) + listID + "/sups"
		);
	});
  }

  /**
    * Function to return route constant based on current node id.
	* @param {string} currentNode - current node id.
  **/
  function getListPageRoute(currentNode) {
	if (currentNode === superSearchJSONData.glycan.id) {
		return routeConstants.glycanList;
	} else if (currentNode === superSearchJSONData.protein.id) {
		return routeConstants.proteinList;
	} else if (currentNode === superSearchJSONData.site.id) {
		return routeConstants.siteList;
	}
  }

  /**
    * Function to reset node data and query data.
  **/
  function resetSuperSearchQuery() {
	updateNodeData();
	setQueryData({});
	setSuperSearchQuerySelect("");
	setQueryDataDirect(JSON.stringify(edgerules, null, 2));
  }

  /**
    * Function to execute super search query.
	* @param {array} superSearchQuery - query object.
	* @param {boolean} selected - true if sample query is executed.
	* @param {boolean} selected - true if sample query is executed.
  **/
 function executeSuperSearchQuery(superSearchQuery, selected, direct) {

	if (!selected && !direct){
		superSearchQuery = {
			concept_query_list : superSearchQuery
		};
	}

	if (JSON.stringify(superSearchQuery) === JSON.stringify({}) && 
	!(queryData.ignored_edges && queryData.ignored_edges.length > 0) && !(queryData.concept_query_list && queryData.concept_query_list.length > 0)){
		setQueryData({});
		updateNodeData();
		setSelectedNode("");
		setSuperSearchQuerySelect("");
		return;
	}

	if (JSON.stringify(superSearchQuery) !== JSON.stringify({})){
		setPageLoading(true);
		!selected && setSuperSearchQuerySelect("");
		let message = "Super Search query=" + JSON.stringify(superSearchQuery);
		logActivity("user", "", "Performing Super Search. " + message);
		getSuperSearch(superSearchQuery).then((response) => {
			let searchData = response.data;
			setPageLoading(false);
			setQueryData(superSearchQuery);
			updateNodeData(searchData.results_summary);
			setSelectedNode("");
		})
		.catch(function (error) {
			axiosError(error, "", message, setPageLoading, setAlertDialogInput);
		});
	}
  }

  /**
    * Function to handle node click.
	* @param {string} currentNode - current node id.
  **/
	 function nodeClickSuperSearchQuery(currentNode) {
		if (queryData.concept_query_list){
			let finalSearchQuery = queryData.concept_query_list.filter((query) => query.concept !== currentNode);
			if (finalSearchQuery.length > 0){
				setUserPermission(true);
			}
		}
		setSelectedNode(currentNode);
	  }

    return (
		<>
      		<Helmet>
				{getTitle('superSearch')}
				{getMeta('superSearch')}
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
					<UserPermission
						userPermission={userPermission}
						title={superSearchCommonData.userPermisssionDialog.title}
						message={superSearchCommonData.userPermisssionDialog.message}
						setOpen={(input) => {
							if (input) {
								let currentNode = selectedNode;
								setSelectedNode("");
								setUserPermission(!input)
								setTimeout(() => {
									setSelectedNode(currentNode);
								},500);
							} else {
								setSelectedNode("");
								setUserPermission(input)
							}
						}}
					/>
					<SuperSearchControl data={initData.filter((value) => value.id === selectedNode)[0] ? initData.filter((value) => value.id === selectedNode)[0] : []} 
						selectedNode={selectedNode} 
						userPermission={userPermission}
						executeSuperSearchQuery={executeSuperSearchQuery}
						setSelectedNode={setSelectedNode} 
						queryData={JSON.stringify(queryData) === JSON.stringify({}) ? [] : queryData.concept_query_list} 
					/>
					<SuperSearchSampleQuery
						show={supSearchSampleQuery}
						executeSuperSearchQuery={executeSuperSearchQuery}
						setSuperSearchQuerySelect={setSuperSearchQuerySelect}
						superSearchQuerySelect={superSearchQuerySelect}
						title={superSearchCommonData.sampleQueryDialog.title}
						setOpen={(input) => {
							setSupSearchSampleQuery(input)
						}}
					/>
					<SuperSearchQueryDisplay
						show={supSearchShowQuery}
						query={queryData}
						title={superSearchCommonData.queryDialog.title}
						setOpen={(input) => {
							setSupSearchShowQuery(input)
						}}
					/>	
					<div className='content-box-md'>
						<h1 className='page-heading'>{superSearchData.pageTitle}</h1>
					</div>
					<Tabs
						defaultActiveKey='Super-Search'
						transition={false}
						activeKey={supSearchActTabKey}
						mountOnEnter={true}
						unmountOnExit={true}
						onSelect={(key) => setSupSearchActTabKey(key)}>
						<Tab
							eventKey='Super-Search'
							className='tab-content-padding'
							title={superSearchJSONData.tabTitle}>
							<Container className='tab-content-border'>
								<Grid
									container
									style={{ margin: '0  auto' }}
									spacing={3}
									justify='center'>
									<Grid item xs={12} sm={12}>
									<h5><br></br><center>{superSearchData.super_search.message}</center></h5>
										{svgData.length !== 0 && <SuperSearchSVG 
											svgData={svgData} 
											nodeClickSuperSearchQuery={nodeClickSuperSearchQuery}
											showData={showData}
											goToListPage={goToListPage}
										/>}
									</Grid>

									{/* Buttons */}
									<Grid item xs={12} sm={12}>
										<div className="gg-align-right btn-supsearch-top me-5 pe-2 mb-2">
											<LineTooltip text={superSearchStringCommonData.enable_debug.tooltip.text}>
												<Button className="gg-btn-outline mt-4 me-4" 
													onClick={() => setEnableDebug(!enableDebug)}			
												>
													{enableDebug ? superSearchStringCommonData.enable_debug.disable_name : superSearchStringCommonData.enable_debug.enable_name}
												</Button>
											</LineTooltip>
											<LineTooltip text={superSearchStringCommonData.simple_view.tooltip.text}>
												<Button className="gg-btn-outline mt-4 me-4" 
													onClick={() => setShowData(!showData)}			
												>
													{showData ? superSearchStringCommonData.simple_view.simple_name : superSearchStringCommonData.simple_view.advanced_name}
												</Button>
											</LineTooltip>
											<LineTooltip text={superSearchStringCommonData.try_sample_query.tooltip.text}>
												<Button className="gg-btn-outline mt-4 me-4" 
													onClick={() => setSupSearchSampleQuery(true)}			
												>
													{superSearchStringCommonData.try_sample_query.sample_query_name}
												</Button>
											</LineTooltip>
											<LineTooltip text={JSON.stringify(queryData) === JSON.stringify({}) ? ""
												: (!(queryData.ignored_edges && queryData.ignored_edges.length > 0) && !(queryData.concept_query_list && queryData.concept_query_list.length > 0)) ? "" 
												: superSearchStringCommonData.reset_query.tooltip.text}
											>
												<Button className="gg-btn-outline mt-4 me-4"
													disabled={JSON.stringify(queryData) === JSON.stringify({}) ? true :
													(!(queryData.ignored_edges && queryData.ignored_edges.length > 0) && !(queryData.concept_query_list && queryData.concept_query_list.length > 0)) }
													onClick={resetSuperSearchQuery}
													title={""}		
												>
													{superSearchStringCommonData.reset_query.reset_query_name}
												</Button>
											</LineTooltip>
											<LineTooltip text={JSON.stringify(queryData) === JSON.stringify({}) ? ""
													: (!(queryData.ignored_edges && queryData.ignored_edges.length > 0) && !(queryData.concept_query_list && queryData.concept_query_list.length > 0)) ? "" 
													: superSearchStringCommonData.show_query.tooltip.text}
											>
												<Button className="gg-btn-outline mt-4 me-4" 
													disabled={JSON.stringify(queryData) === JSON.stringify({}) ? true :
															(!(queryData.ignored_edges && queryData.ignored_edges.length > 0) && !(queryData.concept_query_list && queryData.concept_query_list.length > 0)) }
													onClick={() => setSupSearchShowQuery(true)}	
													title={""}		
												>
													{superSearchStringCommonData.show_query.show_query_name}
												</Button>
											</LineTooltip>
										</div>
									</Grid>

									{/* Buttons */}
									{enableDebug && <Grid item xs={12} sm={12}>
										<Row className="mt-2 me-5 ms-4 pe-2 ps-4">
											<div className="pe-4">										
												<OutlinedInput
													className={'svg-input'}
													value={queryDataDirect}
													fullWidth
													multiline
													margin='dense'
													placeholder='Enter Query'
													rows={5}
													onChange={(event)=>{setQueryDataDirect(event.target.value)}}
												/>
											</div>
										</Row>
										<Row className="gg-align-right mt-4 me-5 pe-2 mb-2">			
											<div className="me-2">			
												<Button className="gg-btn-outline" 
													disabled={queryDataDirect.length <= 0}
													onClick={() => executeSuperSearchQuery(JSON.parse(queryDataDirect), false, true)}			
												>
													Execute
												</Button>
											</div>		
										</Row>
									</Grid>}
								</Grid>
							</Container>
						</Tab>
						<Tab
							eventKey='Tutorial'
							title={superSearchTutorialData.tabTitle}
							className='tab-content-padding'>
							<Container className='tab-content-border'>
								<h2><center>Coming Soon...</center></h2>
							</Container>
						</Tab>
					</Tabs>
        		</Container>
      		</div>
        </>
	);
};

export default SuperSearch;