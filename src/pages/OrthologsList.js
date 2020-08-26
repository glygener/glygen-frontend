import React, { useState, useEffect, useReducer } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ORTHOLOGS_COLUMNS, getOrthologsList } from '../data/usecases';
import ProteinQuerySummary from "../components/ProteinQuerySummary";
import PaginatedTable from "../components/PaginatedTable";
import Container from "@material-ui/core/Container";
import FeedbackWidget from "../components/FeedbackWidget";
import stringConstants from "../data/json/stringConstants.json";
import routeConstants from "../data/json/routeConstants";
import { logActivity } from "../data/logging";
import PageLoader from '../components/load/PageLoader';
import DialogAlert from '../components/alert/DialogAlert';
import {axiosError} from '../data/axiosError';
import { GLYGEN_BASENAME } from "../envVariables";

const proteinStrings = stringConstants.protein.common;

const OrthologsList = props => {
  let { id } = useParams();
  let { searchId } = useParams();
  let quickSearch = stringConstants.quick_search;

  const [data, setData] = useState([]);
  const [query, setQuery] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(ORTHOLOGS_COLUMNS);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(20);
  const [totalSize, setTotalSize] = useState();
	const [pageLoading, setPageLoading] = useState(true);
	const [alertDialogInput, setAlertDialogInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{show: false, id: ""}
  );
  
  useEffect(() => {
    setPageLoading(true);
		logActivity("user", id);
    getOrthologsList(id).then(({ data }) => {
      if (data.error_code) {
        let message = "list api call";
        logActivity("user", id, "No results. " + message);
        setPageLoading(false);
      } else {
      setData(data.results);
      setQuery(data.query);

      setPagination(data.pagination);
      const currentPage = (data.pagination.offset - 1) / sizePerPage + 1;
      setPage(currentPage);
      setTotalSize(data.pagination.total_length);
      setPageLoading(false);
      }
    })
    .catch(function (error) {
			let message = "list api call";
			axiosError(error, id, message, setPageLoading, setAlertDialogInput);
    });
    
  }, []);

  const handleTableChange = (
    type,
    { page, sizePerPage, sortField, sortOrder }
  ) => {
    setPage(page);
    setSizePerPage(sizePerPage);

    getOrthologsList(
      id,
      (page - 1) * sizePerPage + 1,
      sizePerPage,
      sortField,
      sortOrder
    ).then(({ data }) => {
      // place to change values before rendering
      if (!data.error_code) {
        setData(data.results);
        setPagination(data.pagination);
        setTotalSize(data.pagination.total_length);
      }
    });
  };
  const handleModifySearch = () => {
    if (quickSearch[searchId] !== undefined) {
      const basename = GLYGEN_BASENAME === "/" ? "" : GLYGEN_BASENAME;
      window.location = basename + routeConstants.quickSearch + id + "/" + quickSearch[searchId].id + "#" + quickSearch[searchId].id;
    } else {
      props.history.push(routeConstants.proteinSearch + id);
    }
  };

  function rowStyleFormat(row, rowIdx) {
    return { backgroundColor: rowIdx % 2 === 0 ? "red" : "blue" };
  }

  return (
    <>
      <Helmet>
        {getTitle("orthologsList")}
        {getMeta("orthologsList")}
      </Helmet>

      <FeedbackWidget />
      <Container maxWidth="xl" className="gg-container">
          <PageLoader pageLoading={pageLoading} />
					<DialogAlert
						alertInput={alertDialogInput}
						setOpen={(input) => {
							setAlertDialogInput({"show": input})
						}}
					/>
        <section className="content-box-md">
          {query && (
            <ProteinQuerySummary
              data={query}
              question={quickSearch[searchId]}
              onModifySearch={handleModifySearch}
            />
          )}
        </section>
        <section>
          {selectedColumns && selectedColumns.length !== 0 && (
            <PaginatedTable
              trStyle={rowStyleFormat}
              data={data}
              columns={selectedColumns}
              page={page}
              sizePerPage={sizePerPage}
              totalSize={totalSize}
              onTableChange={handleTableChange}
              defaultSortField="uniprot_canonical_ac"
              idField="uniprot_canonical_ac"
            />
          )}
        </section>
      </Container>
    </>
  );
};

export default OrthologsList;
