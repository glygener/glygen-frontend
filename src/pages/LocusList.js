import React, { useState, useEffect, useReducer } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { LOCUS_COLUMNS, getGeneLocusList } from "../data/usecases";
import ProteinQuerySummary from "../components/ProteinQuerySummary";
import PaginatedTable from "../components/PaginatedTable";
import Container from "@mui/material/Container";
import FeedbackWidget from "../components/FeedbackWidget";
import DownloadButton from "../components/DownloadButton";
import stringConstants from "../data/json/stringConstants.json";
import routeConstants from "../data/json/routeConstants";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import { GLYGEN_BASENAME } from "../envVariables";

// const proteinStrings = stringConstants.protein.common;

/**
 * Locus list page component for showing list table.
 */
const LocusList = props => {
  let { id } = useParams();
  let { searchId } = useParams();
  let quickSearch = stringConstants.quick_search;

  const [data, setData] = useState([]);
  const [query, setQuery] = useState([]);
  const [timestamp, setTimeStamp] = useState();
  const [pagination, setPagination] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(LOCUS_COLUMNS);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(20);
  const [totalSize, setTotalSize] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const navigate = useNavigate();

  /**
   * useEffect for retriving data from api and showing page loading effects.
   */
  useEffect(() => {
    setPageLoading(true);
    logActivity("user", id);
    getGeneLocusList(id)
      .then(({ data }) => {
        if (data.error_code) {
          let message = "list api call";
          logActivity("user", id, "No results. " + message);
          setPageLoading(false);
        } else {
          setData(data.results);
          setQuery(data.cache_info.query);
          setTimeStamp(data.cache_info.ts);
          setPagination(data.pagination);
          const currentPage = (data.pagination.offset - 1) / sizePerPage + 1;
          setPage(currentPage);
          setTotalSize(data.pagination.total_length);
          setPageLoading(false);
        }
      })
      .catch(function(error) {
        let message = "list api call";
        axiosError(error, id, message, setPageLoading, setAlertDialogInput);
      });
  }, [id, sizePerPage]);

  /**
   * Function to handle table change event. Retrives data from api to reflect new state of table.
   * @param {string} type - event type.
   * @param {object} {} - object specifying new state of table.
   */
  const handleTableChange = (
    type,
    { page, sizePerPage, sortField, sortOrder }
  ) => {
    setPage(page);
    setSizePerPage(sizePerPage);

    getGeneLocusList(
      id,
      (page - 1) * sizePerPage + 1,
      sizePerPage,
      sortField,
      sortOrder
    ).then(({ data }) => {
      // place to change values before rendering
      if (!data.error_code) {
        setData(data.results);
        setTimeStamp(data.cache_info.ts);
        setPagination(data.pagination);
        setTotalSize(data.pagination.total_length);
      }
    });
  };

  /**
   * Function to handle modify search button click.
   */
  const handleModifySearch = () => {
    if (quickSearch[searchId] !== undefined) {
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

  /**
   * Function to define row style format.
   * @param {object} row - row.
   * @param {number} rowIdx - row index.
   */
  function rowStyleFormat(row, rowIdx) {
    return { backgroundColor: rowIdx % 2 === 0 ? "red" : "blue" };
  }

  return (
    <>
      <Helmet>
        {getTitle("locusList")}
        {getMeta("locusList")}
      </Helmet>

      <FeedbackWidget />
      <Container maxWidth="xl" className="gg-container">
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
              timestamp={timestamp}
              onModifySearch={handleModifySearch}
            />
          )}
        </section>
        <section>
          <div className="text-end">
            <DownloadButton
              types={[
                {
                  display: stringConstants.download.locus_csvdata.displayname,
                  type: "csv",
                  data: "genelocus_list"
                },
                {
                  display: stringConstants.download.locus_jsondata.displayname,
                  type: "json",
                  data: "genelocus_list"
                },
                {
                  display: stringConstants.download.locus_fastadata.displayname,
                  type: "fasta",
                  data: "genelocus_list"
                }
              ]}
              dataId={id}
              itemType="locus_list"
            />
          </div>
          {selectedColumns && selectedColumns.length !== 0 && (
            <PaginatedTable
              trStyle={rowStyleFormat}
              data={data}
              columns={selectedColumns}
              page={page}
              pagination={pagination}
              sizePerPage={sizePerPage}
              totalSize={totalSize}
              onTableChange={handleTableChange}
              defaultSortField="uniprot_canonical_ac"
              defaultSortOrder="desc"
              idField="uniprot_canonical_ac"
              noDataIndication={pageLoading ? "Fetching Data." : "No data available."}
            />
          )}
        </section>
      </Container>
    </>
  );
};

export default LocusList;
