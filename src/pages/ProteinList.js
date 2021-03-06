import React, { useState, useEffect, useReducer } from "react";
import Helmet from "react-helmet";
import Button from "react-bootstrap/Button";
import { getTitle, getMeta } from "../utils/head";
import { useParams } from "react-router-dom";
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

const ProteinList = props => {
  let { id } = useParams();
  let { searchId } = useParams();
  let quickSearch = stringConstants.quick_search;
  const [data, setData] = useState([]);
  const [query, setQuery] = useState([]);
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

  useEffect(() => {
    setPageLoading(true);
    setPage(1);
    logActivity("user", id);
    getProteinList(
      id,
      (page - 1) * sizePerPage + 1,
      sizePerPage,
      "hit_score",
      "desc",
      appliedFilters
    )
      .then(({ data }) => {
        if (data.error_code) {
          let message = "list api call";
          logActivity("user", id, "No results. " + message);
          setPageLoading(false);
        } else {
          setData(data.results);
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
          setPagination(data.pagination);
          setAvailableFilters(data.filters.available);
          if (data.pagination) {
            const currentPage = (data.pagination.offset - 1) / sizePerPage + 1;
            setPage(currentPage);
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
  }, [appliedFilters]);

  const handleTableChange = (
    type,
    { page, sizePerPage, sortField, sortOrder }
  ) => {
    if (pageLoading) {
      return;
    }
    setPage(page);
    setSizePerPage(sizePerPage);
    getProteinList(
      id,
      (page - 1) * sizePerPage + 1,
      sizePerPage,
      sortField || "hit_score",
      sortOrder,
      appliedFilters
    ).then(({ data }) => {
      // place to change values before rendering
      setData(data.results);
      setTimeStamp(data.cache_info.ts);
      setPagination(data.pagination);
      setAvailableFilters(data.filters.available);
      setTotalSize(data.pagination.total_length);
      setPageLoading(false);
    });
  };
  // useEffect(() => {
  //   if (data.results && data.results.length === 0) {
  //     setAlertDialogInput({
  //       show: true,
  //       id: "no-result-found"
  //     });
  //   }
  // }, [data]);

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
      setAppliedFilters([...appliedFilters, newFilter]);
    }
  };

  const handleModifySearch = () => {
    if (searchId === "gs") {
      props.history.push(routeConstants.globalSearchResult + query.term);
    } else if (searchId === "sups") {
      props.history.push(routeConstants.superSearch + id);
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
      props.history.push(routeConstants.proteinSearch + id);
    }
  };

  function rowStyleFormat(rowIdx) {
    return { backgroundColor: rowIdx % 2 === 0 ? "red" : "blue" };
  }
  const [sidebar, setSidebar] = useState(true);

  return (
    <>
      <Helmet>
        {getTitle("proteinList")}
        {getMeta("proteinList")}
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
        <div className="sidebar-page">
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
                  onModifySearch={handleModifySearch}
                />
              )}
            </section>
            <section>
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
                dataId={id}
                itemType="protein"
              />
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
                  noDataIndication={"No data available, Please select filters."}
                />
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProteinList;
