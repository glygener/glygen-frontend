import React, { useState, useEffect, useReducer, useContext } from "react";
import Helmet from "react-helmet";
import Button from "react-bootstrap/Button";
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import { getTitle, getMeta } from "../utils/head";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getGlycanList } from "../data";
import { getGlycanImageUrl } from "../data/glycan";
import DirectSearch from "../components/search/DirectSearch.js";
import LineTooltip from "../components/tooltip/LineTooltip";
import HitScoreTooltip from "../components/tooltip/HitScoreTooltip";
import { Link } from "react-router-dom";
import GlycanQuerySummary from "../components/GlycanQuerySummary";
import PaginatedTable from "../components/PaginatedTable";
import DownloadButton from "../components/DownloadButton";
import FeedbackWidget from "../components/FeedbackWidget";
import stringConstants from "../data/json/stringConstants.json";
import ReactHtmlParser from "react-html-parser";
import routeConstants from "../data/json/routeConstants";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { getProteinSearch } from "../data/protein";
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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const GlycanList = props => {
  let { id } = useParams();
  let { searchId } = useParams();
  const location = useLocation();
  
  const state  = location.state;

  let quickSearch = stringConstants.quick_search;
  const proteinDirectSearch = stringConstants.protein.direct_search;
  const proteinStrings = stringConstants.protein.common;
  const glycanStrings = stringConstants.glycan.common;

  const GLYCAN_COLUMNS = [
    {
      dataField: glycanStrings.glycan_id.id,
      text: glycanStrings.glycan_id.shortName,
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "15% !important"
        };
      },
  
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Link to={routeConstants.glycanDetail + row.glytoucan_ac}>
            {row.glytoucan_ac}
          </Link>
        </LineTooltip>
      )
    },
    {
      text: glycanStrings.glycan_image.name,
      sort: false,
      selected: true,
      formatter: (value, row) => (
        <div className="img-wrapper">
          <img
            className="img-cartoon"
            src={getGlycanImageUrl(row.glytoucan_ac)}
            alt="Glycan img"
          />
        </div>
      ),
      headerStyle: (colum, colIndex) => {
        return {
          width: "30%",
          textAlign: "left",
          backgroundColor: "#4B85B6",
          color: "white",
          whiteSpace: "nowrap"
        };
      }
    },
    {
      dataField: "hit_score",
      text: "Hit Score",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <>
          <HitScoreTooltip
            title={"Hit Score"}
            text={"Hit Score Formula"}
            formula={"0.1 + ∑ (Weight + 0.01 * Frequency)"}
            contributions={row.hit_info && row.hit_info.contributions && row.hit_info.contributions.map((item) => {return {c:glycanStrings.contributions[item.c] ? glycanStrings.contributions[item.c].name: item.c, w: item.w, f: item.f}})}
          />
          {row.hit_score}
        </>
      )
    },
    {
      dataField: glycanStrings.mass.id,
      text: glycanStrings.mass.shortName,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      selected: true
    },
  
    {
      dataField: "mass_pme",
      text: glycanStrings.mass_pme.shortName,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: value => (value ? value : "N/A")
    },
    {
      dataField: glycanStrings.number_monosaccharides.id,
      text: glycanStrings.number_monosaccharides.shortName,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: value => (value ? value : "N/A")
    },
    {
      dataField: glycanStrings.number_proteins.id,
      text: glycanStrings.number_proteins.shortName,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      // formatter: value => (value ? value : " ")
      formatter: (value, row) => (
        <div>
          {value ? value : " "}
          {" "}
          {row[glycanStrings.number_proteins.id] > 0 && <DirectSearch
            text={proteinDirectSearch.attached_glycan_id.text}
            searchType={"protein"}
            fieldType={proteinStrings.attached_glycan_id.id}
            fieldValue={row.glytoucan_ac}
            executeSearch={proteinSearch}
          />}
        </div>
      )
    },
    {
      dataField: glycanStrings.number_enzymes.id,
      text: glycanStrings.number_enzymes.shortName,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: value => (value ? value : " ")
    }
  ];

  const columnSpecDispTypes = {
    "number_proteins":{
      dataField: glycanStrings.number_proteins.id,
      text: glycanStrings.number_proteins.shortName,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <div>
          {value ? value : " "}
          {" "}
          {value > 0 && <DirectSearch
            text={proteinDirectSearch.attached_glycan_id.text}
            searchType={"protein"}
            fieldType={proteinStrings.attached_glycan_id.id}
            fieldValue={row.glytoucan_ac}
            executeSearch={proteinSearch}
          />}
        </div>
      )
    },
  };


  const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    onSelect: (row, isSelect, rowIndex, e) => {
      let glycanIDs = [];
      if (isSelect) {
        if (!selectedData.includes(row.glytoucan_ac)) {
          selectedData.push(row.glytoucan_ac);
          setSelectedData(selectedData);
        }
      } else {
        glycanIDs = selectedData.filter(id => id !== row.glytoucan_ac);
        setSelectedData(glycanIDs);
      }
    },
    onSelectAll: (isSelect, rows, e) => {
      let glycanIDs = rows.map(obj => obj.glytoucan_ac);
      if (isSelect) {
         selectedData.push(...glycanIDs);
         setSelectedData(selectedData);
      } else {
        let glyIDs = selectedData.filter(id => !glycanIDs.includes(id));
        setSelectedData(glyIDs);
      }
    }
  };

  const [data, setData] = useState([]);
  const [dataUnmap, setDataUnmap] = useState([]);
  const [query, setQuery] = useState([]);
  const [aIQueryAssistant, setAIQueryAssistant] = useState();
  const [parameters, setParameters] = useState(undefined);
  const [timestamp, setTimeStamp] = useState();
  const [pagination, setPagination] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [availableFilters, setAvailableFilters] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(GLYCAN_COLUMNS);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(20);
  const [totalSize, setTotalSize] = useState();
  const [pageLoading, setPageLoading] = useState(true);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const [listCacheId, setListCacheId] = useState("");
  const [open, setOpen] = React.useState(false);
  const [userSelectedColumns, setUserSelectedColumns] = useState([]);
  const {showTotalCartIdsNotification} = useContext(GlyGenNotificationContext);
  const [selectedData, setSelectedData] = useState([]);
  const [listIDOpen, setListIDOpen] = React.useState(false);
  const [columns, setColumns] = useState();
  const [searchQuery, setSearchQuery] = useState({});
  const [jobType, setJobType] = useState();
  const [queryType, setQueryType] = useState("");


  function toggleDrawer(newOpen) {
    setOpen(newOpen);
  };
  const tableId = "glycan";
  const navigate = useNavigate();

  const unmappedStrings = stringConstants.glycan.common.unmapped;

    /**
   * Function to handle protein direct search.
   **/
    const proteinSearch = (formObject) => {
      setPageLoading(true);
      logActivity("user", id, "Performing Direct Search");
      let message = "Direct Search query=" + JSON.stringify(formObject);
      getProteinSearch(formObject)
        .then((response) => {
          if (response.data["list_id"] !== "") {
            logActivity("user", (id || "") + ">" + response.data["list_id"], message).finally(() => {
              setPageLoading(false);
              navigate(routeConstants.proteinList + response.data["list_id"]);
            });
          } else {
            let error = {
              response: {
                status: stringConstants.errors.defaultDialogAlert.id,
              },
            };
            axiosError(error, "", "No results. " + message, setPageLoading, setAlertDialogInput);
          }
        })
        .catch(function (error) {
          axiosError(error, "", message, setPageLoading, setAlertDialogInput);
        });
    };

     /**
   * Function to add glycan ids.
   **/
     const addGlycanIDs = () => {
      let totalCartCount = addIDsToStore("glycanID", selectedData);
      showTotalCartIdsNotification(totalCartCount);
    };

     /**
   * Function to add glycan list.
   **/
     const addGlycanList = () => {
      setListIDOpen(true);
    };

  const fixResidueToShortNames = query => {
    const residueMap = stringConstants.glycan.common.composition;
    const result = { ...query };

    if (result.composition) {
      result.composition = result.composition
        .sort((a, b) => {
          if (residueMap[a.residue].orderID < residueMap[b.residue].orderID) {
            return -1;
          } else if (
            residueMap[a.residue].orderID < residueMap[b.residue].orderID
          ) {
            return 1;
          }
          return 0;
        })
        .map(item => ({
          ...item,
          residue: ReactHtmlParser(residueMap[item.residue].name.bold())
        }));
    }

    return result;
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
    getDisplayColumnList(userSelectedColumns, setSelectedColumns, columnSpecDispTypes);
    getGlycanList(id, 1, sizePerPage, "hit_score", "desc", appliedFilters, cols)
      .then(({ data }) => {
        if (data.error_code) {
          let message = "list api call";
          logActivity("user", id, "No results. " + message);
          setPageLoading(false);
        } else {
          let qur = JSON.parse(JSON.stringify(data.cache_info.query));
          setSearchQuery(qur);
          setJobType(qur.jobtype);
          setColumns(data.query.columns);
          setQueryType(searchId ? searchId : "glycanSearch");
          setData(data.results);
          setDataUnmap(
            data.cache_info.batch_info && data.cache_info.batch_info.unmapped
              ? data.cache_info.batch_info.unmapped
              : []
          );
          if (
            data.cache_info.query.glycan_identifier &&
            data.cache_info.query.glycan_identifier.glycan_id
          ) {
            data.cache_info.query.glycan_identifier.glycan_id_short =
              data.cache_info.query.glycan_identifier.glycan_id.split(",")
                .length > 9
                ? data.cache_info.query.glycan_identifier.glycan_id
                    .split(",")
                    .slice(0, 9)
                    .join(",")
                : "";
          }
          setQuery(fixResidueToShortNames(data.cache_info.query));
          setAIQueryAssistant(data.cache_info.query.ai_query);
          setParameters(data.cache_info.query.parameters);
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
    getGlycanList(
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

    const existingFilter = appliedFilters.find(
      filter => filter.id === newFilter.id
    );

    if (
      existingFilter &&
      existingFilter.selected &&
      newFilter &&
      newFilter.selected &&
      (newFilter.selected.length || existingFilter.selected.length)
    ) {
      setPage(1);
      const otherFilters = appliedFilters.filter(
        filter => filter.id !== newFilter.id
      );

      if (newFilter.selected.length) {
        setAppliedFilters([...otherFilters, newFilter]);
      } else {
        setAppliedFilters(otherFilters);
      }
    } else if (newFilter.selected.length) {
      setPage(1);
      setAppliedFilters([...appliedFilters, newFilter]);
    }
  };

  function rowStyleFormat(row, rowIdx) {
    return { backgroundColor: rowIdx % 2 === 0 ? "red" : "blue" };
  }
  const handleModifySearch = (hash) => {
    if (searchId === "gs") {
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
        if (hash === "AI-Query-Assistant") {
          navigate(routeConstants.glycanSearch + id + "#" + hash);
        } else {
          navigate(routeConstants.glycanSearch + id);
        }
    }
  };

  const [sidebar, setSidebar] = useState(true);

  const unmapIDColumns = [
    {
      dataField: unmappedStrings.input_id.shortName,
      text: unmappedStrings.input_id.name,
      sort: true,
      selected: true
    },
    {
      dataField: unmappedStrings.reason.shortName,
      text: unmappedStrings.reason.name,
      sort: true
    }
  ];

  return (
    <>
      <Helmet>
        {getTitle("glycanList")}
        {getMeta("glycanList")}
      </Helmet>

      <FeedbackWidget />
      {listIDOpen && <ListIDNameDialog listIDOpen={listIDOpen} setListIDOpen={setListIDOpen} 
        listId={id} listCacheId={listCacheId} type="glycanList" appliedFilters={appliedFilters}                          
        searchQuery={searchQuery} columns={columns} queryType={queryType} totalSize={totalSize}
      />}
      {/* <Container maxWidth="xl" className="gg-container5"> */}
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
        {/* <Drawer open={open} onClose={() => toggleDrawer(false)}>
          <Box sx={{ width: "600px" }} role="presentation" onClick={() => toggleDrawer(false)}>
          </Box>
        </Drawer> */}
        <CustomColumns id={id} open={open} setOpen={setOpen} title={"Glycan List Columns"} tableId={tableId} userSelectedColumns={userSelectedColumns} setUserSelectedColumns={setUserSelectedColumns} onClose={() => toggleDrawer(false)}/>
        <div className="sidebar-page-outreach">
          <div class="list-mainpage-container">
            <PageLoader pageLoading={pageLoading} />
            <DialogAlert
              alertInput={alertDialogInput}
              setOpen={input => {
                setAlertDialogInput({ show: input });
              }}
            />

            <section className="content-box-md">
              <GlycanQuerySummary
                data={query}
                aIQueryAssistant={aIQueryAssistant}
                parameters={parameters}
                question={quickSearch[searchId]}
                searchId={searchId}
                timestamp={timestamp}
                dataUnmap={dataUnmap}
                onModifySearch={handleModifySearch}
                setPageLoading={setPageLoading}
                searchQuery={searchQuery}
                listID={id}
              />
            </section>

            <section>
              <div className="text-end pb-3" >
                <Button onClick={() => addGlycanList()} type="button" className="gg-btn-blue me-4"
                 disabled={quickSearch[searchId] !== undefined || jobType !== undefined }>
                  Add All To <ShoppingCartIcon sx={{ color: "white", paddingLeft1: "20px" }}/>
                  </Button>
                <Button onClick={() => addGlycanIDs()} type="button" className="gg-btn-blue me-4">    
                  Add Selected To <ShoppingCartIcon sx={{ color: "white", paddingLeft1: "20px" }}/>
                </Button>
                <Button onClick={() => toggleDrawer(true)} type="button" className="gg-btn-blue">Edit Columns</Button>
                <DownloadButton
                  types={[
                    {
                      display:
                        stringConstants.download.glycan_csvdata.displayname,
                      type: "csv",
                      data: "glycan_list"
                    },
                    {
                      display:
                        stringConstants.download.glycan_jsondata.displayname,
                      type: "json",
                      data: "glycan_list"
                    },
                    {
                      display:
                        stringConstants.download.glycan_byonicdata.displayname,
                      type: "byonic",
                      data: "glycan_list"
                    }
                    // {
                    //   display:
                    //     stringConstants.download.glycan_gritsdata.displayname,
                    //   type: "grits",
                    //   data: "glycan_list"
                    // }
                  ]}
                  dataId={listCacheId}
                  dataType="glycan_list"
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
                  idField="glytoucan_ac"
                  selectRow={selectRow}
                  noDataIndication={pageLoading ? "Fetching Data." : "No data available, please select filters."}
                />
              )}
              {/* {data && data.length === 0 && <p>No data.</p>} */}
            </section>
            {dataUnmap && dataUnmap.length > 0 && (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GlycanList;
