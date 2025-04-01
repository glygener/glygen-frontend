import React, { useState, useEffect, useReducer, useContext } from "react";
import Helmet from "react-helmet";
import Button from "react-bootstrap/Button";
import { getTitle, getMeta } from "../utils/head";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getProteinList } from "../data";
import { PROTEIN_COLUMNS, getUserSelectedColumns } from "../data/protein";
import ProteinQuerySummary from "../components/ProteinQuerySummary";
import PaginatedTable from "../components/PaginatedTable";
import DownloadButton from "../components/DownloadButton";
import FeedbackWidget from "../components/FeedbackWidget";
import stringConstants from "../data/json/stringConstants.json";
import routeConstants from "../data/json/routeConstants";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import { GLYGEN_BASENAME } from "../envVariables";
import ListFilter from "../components/ListFilter";
import { ReactComponent as ArrowRightIcon } from "../images/icons/arrowRightIcon.svg";
import { ReactComponent as ArrowLeftIcon } from "../images/icons/arrowLeftIcon.svg";
import ClientPaginatedTable from "../components/ClientPaginatedTable";
import CustomColumns from "../components/columnSelector/CustomColumns";
import { getColumnList, getUserStoredColumns, setUserStoredColumns, getDisplayColumnList } from "../data/customcolumn.js";
import GlyGenNotificationContext from "../components/GlyGenNotificationContext.js";
import ListIDNameDialog from "../components/idcart/ListIDNameDialog";
import { addIDsToStore } from "../data/idCartApi"

const ProteinList = props => {
  let { id } = useParams();
  let { searchId } = useParams();
  const location = useLocation();
  
  const state  = location.state;

  const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    onSelect: (row, isSelect, rowIndex, e) => {
      let proteinIDs = [];
      if (isSelect) {
         selectedData.push({uniprot_canonical_ac: row.uniprot_canonical_ac, protein_name: row.protein_name, organism: row.organism });
         setSelectedData(selectedData);
      } else {
        proteinIDs = selectedData.filter(obj => obj.uniprot_canonical_ac === row.uniprot_canonical_ac);
        setSelectedData(proteinIDs);
      }
    },
    onSelectAll: (isSelect, rows, e) => {
      let proteinIDs = rows.map(obj =>  {return { "uniprot_canonical_ac": obj.uniprot_canonical_ac, "protein_name": obj.protein_name, "organism": obj.organism }});
      if (isSelect) {
         selectedData.push(...proteinIDs);
         setSelectedData(selectedData);
      } else {
        let proteinIDs = rows.map(obj =>  obj.uniprot_canonical_ac);
        let proIDs = selectedData.filter(obj => !proteinIDs.includes(obj.uniprot_canonical_ac));
        setSelectedData(proIDs);
      }
    }
  };

  let quickSearch = stringConstants.quick_search;
  const [data, setData] = useState([]);
  const [query, setQuery] = useState([]);
  const [dataUnmap, setDataUnmap] = useState([]);
  const [timestamp, setTimeStamp] = useState();
  const [pagination, setPagination] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(PROTEIN_COLUMNS);
  const [page, setPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [availableFilters, setAvailableFilters] = useState([]);
  const [sizePerPage, setSizePerPage] = useState(20);
  const [totalSize, setTotalSize] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const [listCacheId, setListCacheId] = useState("");
  const [open, setOpen] = React.useState(false);
  const [userSelectedColumns, setUserSelectedColumns] = useState([]);

  const {totalCartIds, showTotalCartIdsNotification} = useContext(GlyGenNotificationContext);
  const [selectedData, setSelectedData] = useState([]);
  const [listIDOpen, setListIDOpen] = React.useState(false);
  const [columns, setColumns] = useState();
  const [searchQuery, setSearchQuery] = useState();
  const [queryType, setQueryType] = useState();

  function toggleDrawer(newOpen) {
    setOpen(newOpen);
  };
  const tableId = "protein";
  const navigate = useNavigate();

  const unmappedStrings = stringConstants.protein.common.unmapped;

     /**
     * Function to add protein ids to cart.
     **/
       const addProteinIDs = () => {
        let totalCartCount = addIDsToStore("proteinID", selectedData);
        showTotalCartIdsNotification(totalCartCount);
      };
  
       /**
     * Function to add protein list id.
     **/
       const addProteinList = () => {        
        setListIDOpen(true);
      };

  useEffect(() => {
    setPageLoading(true);
    if (userSelectedColumns.length > 0) {
      return;
    }
    let selColms = getUserStoredColumns(tableId);
    if (selColms.length > 0) {
      setUserSelectedColumns(selColms);
      return;
    }

    getColumnList(tableId)
    .then(({ data }) => {
      if (data.error_code) {
        let message = "list init api call";
        logActivity("user", id, "No results. " + message);
        setPageLoading(false);
      } else {
        let colArr = [];
        let columns = data.columns;
        for (let i = 0; i < columns.length; i++) {
          let col = columns[i];
            if (col.default || col.immutable) {
              colArr.push({
                "id" : col.id,
                "label" : col.label,
                "immutable" : col.immutable,
                "property_name" : col.property_name,
                "tooltip" : col.tooltip,
                "order" : col.order
              })
          }
        }
        let sortedItems = colArr.sort((obj1, obj2) => obj1.order - obj2.order);
        setUserSelectedColumns(sortedItems);
        setUserStoredColumns(tableId, sortedItems);
        setPageLoading(false);
      }
    })
    .catch(function(error) {
      let message = "list init api call";
      axiosError(error, id, message, setPageLoading, setAlertDialogInput);
    });
    // eslint-disable-anext-line
  }, []);

  useEffect(() => {
    if (userSelectedColumns.length === 0) {
      return;
    }
    setPageLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    logActivity("user", id);
    let cols = userSelectedColumns.map(col => col.id);
    getDisplayColumnList(userSelectedColumns, setSelectedColumns);
    getProteinList(
      id,
      (page - 1) * sizePerPage + 1,
      sizePerPage,
      "hit_score",
      "desc",
      appliedFilters,
      cols
    )
      .then(({ data }) => {
        if (data.error_code) {
          let message = "list api call";
          logActivity("user", id, "No results. " + message);
          setPageLoading(false);
        } else {
          let qur = JSON.parse(JSON.stringify(data.cache_info.query));
          setSearchQuery(qur);
          setColumns(data.query.columns);
          setQueryType(searchId ? searchId : "proteinSearch");
          setData(data.results);
          setDataUnmap(data.cache_info.batch_info && data.cache_info.batch_info.unmapped ? data.cache_info.batch_info.unmapped : []);
          if (data.cache_info.query.uniprot_canonical_ac) {
            data.cache_info.query.uniprot_canonical_ac_short =
              data.cache_info.query.uniprot_canonical_ac.split(",").length > 9
                ? data.cache_info.query.uniprot_canonical_ac
                    .split(",")
                    .slice(0, 9)
                    .join(",")
                : "";
          }
          setQuery(data.cache_info.query);
          setTimeStamp(data.cache_info.ts);
          setListCacheId(data.cache_info.listcache_id);
          setPagination(data.pagination);
          data.filters && setAvailableFilters(data.filters.available);
          if (data.pagination) {
            setTotalSize(data.pagination.total_length);
          } else {
            setPage(1);
            setTotalSize(0);
          }
          setPageLoading(false);
        }
      })
      .catch(function(error) {
        let message = "list api call";
        axiosError(error, id, message, setPageLoading, setAlertDialogInput);
      });
    // eslint-disable-next-line
  }, [appliedFilters, userSelectedColumns]);

  // Use an effect to monitor the update to params
  useEffect(() => {
    if (state && state.appliedFilters) {
      setAppliedFilters(state.appliedFilters);
    }
  }, [state]);

  const handleTableChange = (
    type,
    { page, sizePerPage, sortField, sortOrder }
  ) => {
    if (pageLoading) {
      return;
    }
    setPage(page);
    setSizePerPage(sizePerPage);
    setPageLoading(true);
    let cols = userSelectedColumns.map(col => col.id);
    getProteinList(
      id,
      (page - 1) * sizePerPage + 1,
      sizePerPage,
      sortField || "hit_score",
      sortOrder,
      appliedFilters,
      cols
    ).then(({ data }) => {
      // place to change values before rendering
      setData(data.results);
      setTimeStamp(data.cache_info.ts);
      setListCacheId(data.cache_info.listcache_id);
      setPagination(data.pagination);
      data.filters && setAvailableFilters(data.filters.available);
      data.pagination && setTotalSize(data.pagination.total_length);
      setPageLoading(false);
    });
  };

  const handleFilterChange = newFilter => {
    console.log(newFilter);
    // find if a filter exists for this type
    const existingFilter = appliedFilters.find(
      filter => filter.id === newFilter.id
    );
    // if no filter exists
    if (
      existingFilter &&
      existingFilter.selected &&
      newFilter &&
      newFilter.selected &&
      (newFilter.selected.length || existingFilter.selected.length)
    ) {
      setPage(1);
      // list of all the other filters
      // add a new filter of this type
      const otherFilters = appliedFilters.filter(
        filter => filter.id !== newFilter.id
      );

      if (newFilter.selected.length) {
        // for this existing filter, make sure we remove this option if it existed
        setAppliedFilters([...otherFilters, newFilter]);
      } else {
        setAppliedFilters(otherFilters);
      }
    } else if (newFilter.selected.length) {
      setPage(1);
      setAppliedFilters([...appliedFilters, newFilter]);
    }
  };

  const handleModifySearch = () => {
    if (searchId === "gs" || searchId === "gsgp") {
      window.location = routeConstants.globalSearchResult + encodeURIComponent(query.term);
    } else if (searchId && searchId.includes("sups")) {
      navigate(routeConstants.superSearch + id);
    } else if (quickSearch[searchId] !== undefined) {
      const basename = GLYGEN_BASENAME === "/" ? "" : GLYGEN_BASENAME;
      window.location =
        basename +
        routeConstants.quickSearch +
        id +
        "/" +
        quickSearch[searchId].id +
        "#" +
        quickSearch[searchId].id;
    } else {
      navigate(routeConstants.proteinSearch + id);
    }
  };

  function rowStyleFormat(rowIdx) {
    return { backgroundColor: rowIdx % 2 === 0 ? "red" : "blue" };
  }
  const [sidebar, setSidebar] = useState(true);

  const unmapIDColumns = [
    {
      dataField: unmappedStrings.input_id.shortName,
      text: unmappedStrings.input_id.name,
      sort: true,
      selected: true,
    },
    {
      dataField: unmappedStrings.reason.shortName,
      text: unmappedStrings.reason.name,
      sort: true,
    },
  ];

  return (
    <>
      <Helmet>
        {getTitle("proteinList")}
        {getMeta("proteinList")}
      </Helmet>

      <FeedbackWidget />
      {listIDOpen && <ListIDNameDialog listIDOpen={listIDOpen} setListIDOpen={setListIDOpen} 
        listId={id} listCacheId={listCacheId} type="proteinList" appliedFilters={appliedFilters}   
        searchQuery={searchQuery} columns={columns} queryType={queryType} totalSize={totalSize}                     
      />}
      <div className="gg-baseline list-page-container">
        {availableFilters && availableFilters.length !== 0 && (
          <div className="list-sidebar-container">
            <div className={"list-sidebar" + (sidebar ? "" : " closed")}>
              <div className="reset-filter-btn-container">
                <Button
                  type="button"
                  className="gg-btn-blue reset-filter-btn"
                  onClick={() => {
                    setAppliedFilters([]);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
              <ListFilter
                availableOptions={availableFilters}
                selectedOptions={appliedFilters}
                onFilterChange={handleFilterChange}
              />
              <div className="reset-filter-btn-container ">
                <Button
                  type="button"
                  className="gg-btn-blue reset-filter-btn"
                  onClick={() => {
                    setAppliedFilters([]);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
            <div
              className="list-sidebar-opener sidebar-arrow-center"
              onClick={() => setSidebar(!sidebar)}
            >
              {sidebar ? <ArrowLeftIcon /> : <ArrowRightIcon />}
            </div>
          </div>
        )}
        <CustomColumns id={id} open={open} setOpen={setOpen} title={"Protein List Columns"} tableId={tableId} userSelectedColumns={userSelectedColumns} setUserSelectedColumns={setUserSelectedColumns} onClose={() => toggleDrawer(false)}/>
        <div className="sidebar-page-outreach">
          <div class="list-mainpage-container list-mainpage-container">
            <PageLoader pageLoading={pageLoading} />
            <DialogAlert
              alertInput={alertDialogInput}
              setOpen={input => {
                setAlertDialogInput({ show: input });
              }}
            />
            <section className="content-box-md">
              {query && (
                <ProteinQuerySummary
                  data={query}
                  question={quickSearch[searchId]}
                  searchId={searchId}
                  timestamp={timestamp}
                  dataUnmap={dataUnmap}
                  onModifySearch={handleModifySearch}
                />
              )}
            </section>
            <section>
              <div className="text-end pb-3">
                <Button onClick={() => addProteinList()} type="button" className="gg-btn-blue"
                   disabled={quickSearch[searchId] !== undefined}
                  >Add List ID</Button>
                <Button onClick={() => addProteinIDs()} type="button" className="gg-btn-blue" style={{marginLeft: "12px"}}>Add Protein IDs</Button>
                <Button onClick={() => toggleDrawer(true)} type="button" className="gg-btn-blue" style={{marginLeft: "12px"}} >Edit Columns</Button>
                <DownloadButton
                  types={[
                    {
                      display:
                        stringConstants.download.protein_csvdata.displayname,
                      type: "csv",
                      data: "protein_list"
                    },
                    {
                      display:
                        stringConstants.download.protein_jsondata.displayname,
                      type: "json",
                      data: "protein_list"
                    },
                    {
                      display:
                        stringConstants.download.protein_fastadata.displayname,
                      type: "fasta",
                      data: "protein_list"
                    }
                  ]}
                  dataId={listCacheId}
                  itemType="protein_list"
                  filters={appliedFilters}
                />
              </div>
              {data && (
                <PaginatedTable
                  trStyle={rowStyleFormat}
                  data={data}
                  columns={selectedColumns}
                  page={page}
                  sizePerPage={sizePerPage}
                  totalSize={totalSize}
                  onTableChange={handleTableChange}
                  defaultSortField="hit_score"
                  defaultSortOrder="desc"
                  idField="uniprot_canonical_ac"
                  selectRow={selectRow}
                  noDataIndication={pageLoading ? "Fetching Data." : "No data available, please select filters."}
                />
              )}
            </section>
            {dataUnmap && dataUnmap.length > 0 && (<>
              <div id="Unmapped-Table"></div>
                <div className="content-box-sm">
                  <h1 className="page-heading">{unmappedStrings.title}</h1>
                </div>
              <section>
                {/* Unmapped Table */}
                {unmapIDColumns && unmapIDColumns.length !== 0 && (
                  <ClientPaginatedTable
                    data={dataUnmap}
                    columns={unmapIDColumns}
                    defaultSortField={"input_id"}
                    defaultSortOrder="asc"
                    onClickTarget={"#Unmapped-Table"}
                />
                )}
              </section>
            </>)}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProteinList;
