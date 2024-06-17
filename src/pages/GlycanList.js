import React, { useState, useEffect, useReducer } from "react";
import Helmet from "react-helmet";
import Button from "react-bootstrap/Button";
import { getTitle, getMeta } from "../utils/head";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getGlycanList } from "../data";
import { GLYCAN_COLUMNS } from "../data/glycan";
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
import { axiosError } from "../data/axiosError";
import { GLYGEN_BASENAME } from "../envVariables";
import ListFilter from "../components/ListFilter";
import { ReactComponent as ArrowRightIcon } from "../images/icons/arrowRightIcon.svg";
import { ReactComponent as ArrowLeftIcon } from "../images/icons/arrowLeftIcon.svg";
import ClientPaginatedTable from "../components/ClientPaginatedTable";
const GlycanList = props => {
  let { id } = useParams();
  let { searchId } = useParams();
  let quickSearch = stringConstants.quick_search;
  const [data, setData] = useState([]);
  const [dataUnmap, setDataUnmap] = useState([]);
  const [query, setQuery] = useState([]);
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
  const navigate = useNavigate();

  const unmappedStrings = stringConstants.glycan.common.unmapped;

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

    setPage(1);
    logActivity("user", id);
    getGlycanList(id, 1, sizePerPage, "hit_score", "desc", appliedFilters)
      .then(({ data }) => {
        if (data.error_code) {
          let message = "list api call";
          logActivity("user", id, "No results. " + message);
          setPageLoading(false);
        } else {
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
          setParameters(data.cache_info.query.parameters);
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
    setPageLoading(true);
    getGlycanList(
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
      const otherFilters = appliedFilters.filter(
        filter => filter.id !== newFilter.id
      );

      if (newFilter.selected.length) {
        setAppliedFilters([...otherFilters, newFilter]);
      } else {
        setAppliedFilters(otherFilters);
      }
    } else if (newFilter.selected.length) {
      setAppliedFilters([...appliedFilters, newFilter]);
    }
  };

  function rowStyleFormat(row, rowIdx) {
    return { backgroundColor: rowIdx % 2 === 0 ? "red" : "blue" };
  }
  const handleModifySearch = () => {
    if (searchId === "gs") {
      window.location = routeConstants.globalSearchResult + encodeURIComponent(query.term);
    } else if (searchId === "sups") {
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
      navigate(routeConstants.glycanSearch + id);
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
                parameters={parameters}
                question={quickSearch[searchId]}
                searchId={searchId}
                timestamp={timestamp}
                dataUnmap={dataUnmap}
                onModifySearch={handleModifySearch}
              />
            </section>

            <section>
              <div className="text-end">
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
                  dataId={id}
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
