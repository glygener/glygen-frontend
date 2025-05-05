import React, { useState, useEffect, useReducer } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getSuperSearchList, getSiteSearchInit } from "../data/supersearch";
import SitequerySummary from "../components/SitequerySummary";
// import { SITE_COLUMNS } from "../data/supersearch";
import PaginatedTable from "../components/PaginatedTable";
import Container from "@mui/material/Container";
import FeedbackWidget from "../components/FeedbackWidget";
import stringConstants from "../data/json/stringConstants.json";
// import ReactHtmlParser from "react-html-parser";
import routeConstants from "../data/json/routeConstants";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import DownloadButton from "../components/DownloadButton";
import LineTooltip from "../components/tooltip/LineTooltip";
import HitScoreTooltip from "../components/tooltip/HitScoreTooltip";
import { Link } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../images/icons/arrowRightIcon.svg";
import { ReactComponent as ArrowLeftIcon } from "../images/icons/arrowLeftIcon.svg";
import ListFilter from "../components/ListFilter";
import Button from "react-bootstrap/Button";
import CustomColumns from "../components/columnSelector/CustomColumns";
import { getColumnList, getUserStoredColumns, setUserStoredColumns, getDisplayColumnList } from "../data/customcolumn.js";

const proteinStrings = stringConstants.protein.common;
const siteStrings = stringConstants.site.common;

// import { GLYGEN_BASENAME } from "../envVariables";

// const proteinStrings = stringConstants.protein.common;

const SiteList = (props) => {
  let { id } = useParams();
  let { searchId } = useParams();

  const yesNoFormater = (value, row) => {
    return value && value.length > 1 ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  };

  const SITE_COLUMNS = [
    {
      dataField: proteinStrings.shortName,
      text: proteinStrings.uniprot_accession.name,
      sort: true,
      selected: true,
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {row.uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      ),
    },
    {
      dataField: proteinStrings.protein_names.shortName,
      text: proteinStrings.protein_names.name,
      sort: true,
    },
    {
      dataField: proteinStrings.organism.shortName,
      text: proteinStrings.organism.name,
      sort: true,
    },
    {
      dataField: "hit_score",
      text: "Hit Score",
      sort: true,
      formatter: (value, row) => (
        <>
          <HitScoreTooltip
            title={"Hit Score"}
            text={"Hit Score Formula"}
            formula={"0.1 + ∑ (Weight + 0.01 * Frequency)"}
            contributions={row.score_info && row.score_info.contributions && row.score_info.contributions.map((item) => {
              return {
                c: siteStrings.contributions[item.c]
                  ? siteStrings.contributions[item.c].name
                  : item.c,
                w: item.w,
                f: item.f,
              };
            })}
          />
          {row.hit_score}
        </>
      ),
    },
    {
      dataField: "start_pos",
      text: "Start Pos",
      sort: true,
      formatter: (value, row) =>
        row.start_pos === row.end_pos && row.start_pos !== 0 ? (
          <LineTooltip text="View siteview details">
            <Link
              to={`${routeConstants.siteview + row.uniprot_canonical_ac}/${
                row.start_pos
              }`}
            >
              {row.start_pos}
            </Link>
          </LineTooltip>
        ) : (
          row.start_pos === row.end_pos && row.start_pos === 0 ? "Not Reported" : value
        ),
    },
    {
      dataField: "end_pos",
      text: "End Pos",
      sort: true,
      formatter: (value, row) =>
        row.end_pos === row.start_pos && row.end_pos !== 0 ? (
          <LineTooltip text="View siteview details">
            <Link
              to={`${routeConstants.siteview + row.uniprot_canonical_ac}/${
                row.end_pos
              }`}
            >
              {row.end_pos}
            </Link>
          </LineTooltip>
        ) : (
          row.end_pos === row.start_pos && row.end_pos === 0 ? "Not Reported" : value
        ),
    },
    {
      dataField: "snv",
      text: "SNV",
      sort: true,
      formatter: yesNoFormater,
    },
    {
      dataField: "glycosylation",
      text: "Glycosylation",
      sort: true,
      formatter: yesNoFormater,
    },
    {
      dataField: "mutagenesis",
      text: "Mutagenesis",
      sort: true,
      formatter: yesNoFormater,
    },
    {
      dataField: "glycation",
      text: "Glycation",
      sort: true,
      formatter: yesNoFormater,
    },
    {
      dataField: "phosphorylation",
      text: "Phosphorylation",
      sort: true,
      formatter: yesNoFormater,
    },
  ];

  const [data, setData] = useState([]);
  const [query, setQuery] = useState([]);
  const [timestamp, setTimeStamp] = useState();
  const [pagination, setPagination] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(SITE_COLUMNS);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(20);
  const [totalSize, setTotalSize] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [availableFilters, setAvailableFilters] = useState([]);
  const [sidebar, setSidebar] = useState(true);

  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  const [configData, setConfigData] = useState({});
  const [listCacheId, setListCacheId] = useState("");
  const [open, setOpen] = React.useState(false);
  const [userSelectedColumns, setUserSelectedColumns] = useState([]);

  function toggleDrawer(newOpen) {
    setOpen(newOpen);
  };
  const tableId = "site";
  const navigate = useNavigate();

  useEffect(() => {
    setPageLoading(true);
    if (userSelectedColumns.length > 0) {
      return;
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
    const dataPromise = Promise.all([
      getSiteSearchInit(),
      getSuperSearchList(id,
        (page - 1) * sizePerPage + 1,
          sizePerPage,
          "hit_score",
          "desc",
          appliedFilters,
          cols
        )
    ]);

    dataPromise.then(([{ data: initData }, { data }]) => {
      if (data.error_code) {
        let message = "list api call";
        logActivity("user", id, "No results. " + message);
      } else {
        setData(data.results);
        setQuery(data.cache_info.query);
        setTimeStamp(data.cache_info.ts);
        setListCacheId(data.cache_info.listcache_id);
        setPagination(data.pagination);
        data.filters && setAvailableFilters(data.filters.available);
        setTotalSize((data.pagination && data.pagination.total_length > 0 ? data.pagination.total_length : 0));
        setConfigData(initData);
      }
    });

    dataPromise.catch(function (error) {
      let message = "list api call";
      axiosError(error, id, message, setPageLoading, setAlertDialogInput);
    });

    dataPromise.finally(() => {
      setPageLoading(false);
    });
  }, [appliedFilters, userSelectedColumns]);
  // useEffect(() => {
  //   setPageLoading(true);
  //   logActivity("user", id);
  //   getSuperSearchList(id)
  //     .then(({ data }) => {
  //       if (data.error_code) {
  //         let message = "list api call";
  //         logActivity("user", id, "No results. " + message);
  //         setPageLoading(false);
  //       } else {
  //         setData(data.results);
  //         setQuery(data.cache_info.query);
  //         setTimeStamp(data.cache_info.ts);
  //         setPagination(data.pagination);
  //         const currentPage = (data.pagination.offset - 1) / sizePerPage + 1;
  //         setPage(currentPage);
  //         setTotalSize(data.pagination.total_length);
  //         setPageLoading(false);
  //       }
  //     })
  //     .catch(function(error) {
  //       let message = "list api call";
  //       axiosError(error, id, message, setPageLoading, setAlertDialogInput);
  //     });
  // }, []);

  const handleTableChange = (
    type,
    { page, sizePerPage, sortField, sortOrder}
  ) => {
    if (pageLoading) {
      return;
    }
    setPage(page);
    setSizePerPage(sizePerPage);
    setPageLoading(true);
    let cols = userSelectedColumns.map(col => col.id);
    getSuperSearchList(
      id,
      (page - 1) * sizePerPage + 1,
      sizePerPage,
      sortField,
      sortOrder,
      appliedFilters,
      cols
    ).then(({ data }) => {
      if (!data.error_code) {
        setData(data.results);
        setTimeStamp(data.cache_info.ts);
        setListCacheId(data.cache_info.listcache_id);
        setPagination(data.pagination);
        data.filters && setAvailableFilters(data.filters.available);
        data.pagination && setTotalSize(data.pagination.total_length);
      }
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
    if (searchId === "sups") {
      navigate(routeConstants.superSearch + id);
    } else {
      navigate(routeConstants.siteSearch + id);
    }
  };

  function rowStyleFormat(row, rowIdx) {
    return { backgroundColor: rowIdx % 2 === 0 ? "red" : "blue" };
  }

  return (
    <>
      <Helmet>
        {getTitle("siteList")}
        {getMeta("siteList")}
      </Helmet>

      <FeedbackWidget />
      <div className="gg-baseline list-page-container">
        {availableFilters && availableFilters.length !== 0 && (
          <div className="list-sidebar-container">
            <div className={"list-sidebar" + (sidebar ? "" : " closed")}>
              <div className="reset-filter-btn-container">
                <Button
                  type="button"
                  className="gg-btn-blue reset-filter-btn"
                  onClick={() => {
                    window.location.reload();
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
                    window.location.reload();
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
        <CustomColumns id={id} open={open} setOpen={setOpen} title={"Site List Columns"} tableId={tableId} userSelectedColumns={userSelectedColumns} setUserSelectedColumns={setUserSelectedColumns} onClose={() => toggleDrawer(false)}/>
        <div className="sidebar-page-outreach">
          <div class="list-mainpage-container list-mainpage-container">
            <PageLoader pageLoading={pageLoading} />
            <DialogAlert
              alertInput={alertDialogInput}
              setOpen={(input) => {
                setAlertDialogInput({ show: input });
              }}
            />
            <section className="content-box-md">
              {query && (
                <SitequerySummary
                  data={query}
                  timestamp={timestamp}
                  searchId={searchId}
                  onModifySearch={handleModifySearch}
                  initData={configData}
                />
              )}
            </section>
            <section>
              <div className="text-end pb-3">
                <Button onClick={() => toggleDrawer(true)} type="button" className="gg-btn-blue" >Edit Columns</Button>
                <DownloadButton
                  types={[
                    {
                      display:
                        stringConstants.download.proteinsite_csvdata.displayname,
                      type: "csv",
                      data: "site_list",
                    },
                    {
                      display:
                        stringConstants.download.proteinsite_jsondata.displayname,
                      type: "json",
                      data: "site_list",
                    },
                  ]}
                  dataId={listCacheId}
                  itemType="site_list"
                  filters={appliedFilters}
                />
              </div>
              {/* {data && data.length !== 0 && ( */}
              {data  && (
                <PaginatedTable
                  trStyle={rowStyleFormat}
                  data={data}
                  columns={selectedColumns}
                  page={page}
                  pagination={pagination}
                  sizePerPage={sizePerPage}
                  totalSize={totalSize}
                  onTableChange={handleTableChange}
                  defaultSortField="hit_score"
                  defaultSortOrder="desc"
                  noDataIndication={pageLoading ? "Fetching Data." : "No data available, please select filters."}
                />
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default SiteList;
