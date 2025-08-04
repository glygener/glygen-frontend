import React, { useState, useEffect, useReducer } from "react";
import Helmet from "react-helmet";
import Button from "react-bootstrap/Button";
import { getTitle, getMeta } from "../utils/head";
import { getTitle as getTitleBiomarker, getMeta as getMetaBiomarker } from "../utils/biomarker/head";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getDiseaseList } from "../data/disease";
import PaginatedTable from "../components/PaginatedTable";
import DownloadButton from "../components/DownloadButton";
import FeedbackWidget from "../components/FeedbackWidget";
import stringConstants from "../data/json/stringConstants.json";
import routeConstants from "../data/json/routeConstants";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import "../css/Sidebar.css";
import { axiosError } from "../data/axiosError";
import { GLYGEN_BASENAME } from "../envVariables";
import ListFilter from "../components/ListFilter";
import { ReactComponent as ArrowRightIcon } from "../images/icons/arrowRightIcon.svg";
import { ReactComponent as ArrowLeftIcon } from "../images/icons/arrowLeftIcon.svg";
import DiseaseQuerySummary from "../components/DiseaseQuerySummary";
import DirectSearch from "../components/search/DirectSearch.js";
import { getProteinSearch } from '../data/protein.js';
import LineTooltip from "../components/tooltip/LineTooltip";
import HitScoreTooltip from "../components/tooltip/HitScoreTooltip";
import CollapsableTextArray from "../components/CollapsableTextArray";
import { Link } from "react-router-dom";
import {
  GLYGEN_BUILD,
} from "../envVariables";

const diseaseStrings = stringConstants.disease.common;
const proteinStrings = stringConstants.protein.common;



const DiseaseList = props => {
  let { id } = useParams();
  let { searchId } = useParams();

  const DISEASE_COLUMNS = [
    {
      dataField: diseaseStrings.disease_id.id,
      text: diseaseStrings.disease_id.name,
      sort: true,
      selected: true,
      headerStyle: HeaderwithsameStyle,
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Link to={routeConstants.diseaseDetail + row.disease_id}>
            {row.disease_id}
          </Link>
        </LineTooltip>
      )
    },
    {
      dataField: "recommended_name",
      text: "Recommended Name",
      sort: true,
      headerStyle: HeaderwithsameStyle
    },
    {
      dataField: "glycan_count",
      text: "Glycan Count",
      sort: true,
      headerStyle: HeaderwithsameStyle
    },
    {
      dataField: "protein_count",
      text: "Protein Count",
      sort: true,
      headerStyle: HeaderwithsameStyle,
            formatter: (value, row) => (
          <div>
            {row.protein_count}
            {" "}
            {row.protein_count > 0 && 
              <DirectSearch
                text={"Find all proteins / glycoproteins with the same disease."}
                searchType={"protein"}
                fieldType={"disease_id"}
                fieldValue={row.disease_id}
                executeSearch={proteinSearch}
              />
            }
          </div>
        )
    },
    {
      dataField: proteinStrings.hit_score.id,
      text: proteinStrings.hit_score.name,
      sort: true,
      headerStyle: HeaderwithsameStyle,
      formatter: (value, row) => (
        <>
          <HitScoreTooltip
            title={"Hit Score"}
            text={"Hit Score Formula"}
            formula={"0.1 + ∑ (Weight + 0.01 * Frequency)"}
            contributions={row.score_info && row.score_info.contributions && row.score_info.contributions.map(item => {
              return {
                c: diseaseStrings.contributions[item.c]
                  ? diseaseStrings.contributions[item.c].name
                  : item.c,
                w: item.w,
                f: item.f
              };
            })}
          />
          {row.hit_score}
        </>
      )
    },
    {
      dataField: "synonyms",
      text: "Synonyms",
      headerStyle: (colum, colIndex) => {
        return { width: "20%" };
      },
      formatter: (value, row) => (
        <>
          <CollapsableTextArray data={value.map(obj => obj.name + " (" +obj.id + ")")} maxItems={5} />
        </>
      )
    },
  ];

  const [data, setData] = useState([]);
  const [query, setQuery] = useState([]);
  const [dataUnmap, setDataUnmap] = useState([]);
  const [listCacheId, setListCacheId] = useState("");
  const [timestamp, setTimeStamp] = useState();
  const [pagination, setPagination] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(DISEASE_COLUMNS);
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
  const navigate = useNavigate();

function HeaderwithsameStyle(colum, colIndex) {
  return { backgroundColor: "#4B85B6", color: "white" };
}

 /**
   * Function to handle protein direct search.
   **/
  const proteinSearch = (formObject) => {

    setPageLoading(true);
    logActivity("user", "", "Performing Direct Search");
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
        axiosError(error, id, message, setPageLoading, setAlertDialogInput);
      });
  };


  useEffect(() => {
    setPageLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    logActivity("user", id);
    getDiseaseList(
      id,
      (page - 1) * sizePerPage + 1,
      sizePerPage,
      "hit_score",
      "desc",
      appliedFilters
    )
      .then(({ data }) => {
        if (data.error_code) {
          let message = "direct search api call";
          logActivity("user", id, "No results. " + message);
          setPageLoading(false);
        } else {
          setData(data.results);
          setQuery(data.cache_info.query);
          setTimeStamp(data.cache_info.ts);
          setListCacheId(data.cache_info.listcache_id);
          setPagination(data.pagination);
          setAvailableFilters(data.filters.available);
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
        let message = "direct search api call";
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
    getDiseaseList(
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
      setListCacheId(data.cache_info.listcache_id);
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
    if (searchId && searchId.includes("sups")) {
      navigate(routeConstants.superSearch + id);
    } else {
      navigate(routeConstants.diseaseSearch + id);
    }
  };

  function rowStyleFormat(rowIdx) {
    return { backgroundColor: rowIdx % 2 === 0 ? "red" : "blue" };
  }
  const [sidebar, setSidebar] = useState(true);

  return (
    <>
      <Helmet>
        {getTitle("diseaseList")}

        {getMeta("diseaseList")}
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
        <div className="sidebar-page" style={{width: "100%"}}>
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
                <DiseaseQuerySummary
                  data={query}
                  searchId={searchId}
                  timestamp={timestamp}
                  dataUnmap={dataUnmap}
                  onModifySearch={handleModifySearch}
                />
              )}
            </section>
            <section>
              <div className="text-end">
                <DownloadButton
                  types={[
                    {
                      display:
                        stringConstants.download.disease_csvdata.displayname,
                      type: "csv",
                      data: "disease_list"
                    },
                    {
                      display:
                        stringConstants.download.disease_jsondata.displayname,
                      type: "json",
                      data: "disease_list"
                    }
                  ]}
                  dataId={listCacheId}
                  itemType="disease_list"
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

export default DiseaseList;
