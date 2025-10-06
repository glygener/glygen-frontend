import React, { useState, useEffect, useReducer, useContext } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head.js";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getJobResultList } from "../data/job.js"
import PaginatedTable from "../components/PaginatedTable.js";
import Container from "@mui/material/Container";
import FeedbackWidget from "../components/FeedbackWidget.js";
import { logActivity } from "../data/logging.js";
import PageLoader from "../components/load/PageLoader.js";
import DialogAlert from "../components/alert/DialogAlert.js";
import { axiosError } from "../data/axiosError.js";
import routeConstants from "../data/json/routeConstants";
import stringConstants from "../data/json/stringConstants";
import BatchRetrievalQuerySummary from "../components/BatchRetrievalQuerySummary.js";
import { Link } from "react-router-dom";
import LineTooltip from "../components/tooltip/LineTooltip.js";
import DownloadButton from "../components/DownloadButton";
import CollapsableLinkText from "../components/CollapsableLinkText";

function HeaderwithsameStyle(colum, colIndex) {
  return { backgroundColor: "#4B85B6", color: "white" };
}

/**
 * Glycan blast result control.
 **/
const BatchRetrievalResult = (props) => {
  let  { jobId } =  useParams();
  const [query, setQuery] = useState({});
  const [timestamp, setTimeStamp] = useState();

  const [pageLoading, setPageLoading] = useState(true);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const [inputNamespace, setInputNamespace] = useState([]);
  const [page, setPage] = useState(1);
  const [pageContents, setPageContents] = useState([]);
  const [sizePerPage, setSizePerPage] = useState(20);
  const [totalSize, setTotalSize] = useState();
  const [batchRetrievalColumns, setBatchRetrievalColumns] = useState([]);
  const navigate = useNavigate();

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
      getJobResultList(jobId, (page - 1) * sizePerPage + 1, sizePerPage)
      .then(({ data }) => {
        // place to change values before rendering
        setPageContents(data.rows);
        setTotalSize(data.pagination.total_length);
        setPageLoading(false);
      })
      .catch(function (error) {
        let message = "result pagination api call";
        axiosError(error, jobId, message, setPageLoading, setAlertDialogInput);
      });
    };

  useEffect(() => {
    setPageLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    logActivity("user", jobId);
    getJobResultList(jobId, (page - 1) * sizePerPage + 1, sizePerPage)
     .then(({ data }) => {
        if (data.error_code) {
          let message = "list api call";
          logActivity("user", jobId, "No results. " + message);
          setPageLoading(false);
        } else {
          let query = data.query;
          let results = data.rows ? data.rows : [];
          let columns = query?.parameters?.columns;
          let inputnamespace = query?.parameters?.inputnamespace;
          setInputNamespace(inputnamespace);

          if (data.query) {
             setQuery({inputnamespace: inputnamespace, jobtype: query.jobtype});
          } else {
            setQuery({inputnamespace: "", jobtype: ""});
          }

          let BATCH_RETRIEVAL_COLUMNS = [
            {
              dataField: "input_id",
              text: inputnamespace,
              headerStyle: HeaderwithsameStyle
            },
            {
              dataField: "record_id",
              text: "UniProtKB",
              headerStyle: HeaderwithsameStyle,
              formatter: (value, row) => (
                <>
                  {value && 
                    <CollapsableLinkText data={value.split(";")} routeLink={routeConstants.proteinDetail}/>
                  }
                </>
              )
            }
          ];

          if (!columns) {
            columns = [];
          }
          for (let i = 0; i < columns.length; i++) {
            BATCH_RETRIEVAL_COLUMNS.push({
                dataField: columns[i].column_id,
                text: <div>{columns[i].label} {columns[i].filter && <div style={{border: "none", borderTop: "1px dashed white", fontSize: "14px" }}><i>{columns[i].filter}</i></div>}</div>,
                headerStyle: HeaderwithsameStyle,
                formatter: (value, row) => (
                  <>
                    {value && typeof value === "string" ?
                      <CollapsableLinkText data={value.split(";")}/>
                    : typeof value === "boolean" ?
                      <span>{value === true ? "Yes" : "No"}</span>
                    : <span>{value}</span>}
                  </>
                )
            })
          }

          setBatchRetrievalColumns(BATCH_RETRIEVAL_COLUMNS);
 
          setPageContents(results);
          data.pagination && setTotalSize(data.pagination.total_length);

          setPageLoading(false);
        }
      })
      .catch(function (error) {
        let message = "list api call";
        axiosError(error, jobId, message, setPageLoading, setAlertDialogInput);
      });
    // eslint-disable-next-line
  }, [jobId]);

  const handleModifySearch = () => {
    navigate(routeConstants.batchRetrieval + jobId);
  };

  return (
    <>
      <Helmet>
        {getTitle("batchRetrievalResult")}
        {getMeta("batchRetrievalResult")}
      </Helmet>

      <FeedbackWidget />
      <Container maxWidth="xl" className="gg-container">
        <PageLoader pageLoading={pageLoading} />
        <DialogAlert
          alertInput={alertDialogInput}
          setOpen={(input) => {
            setAlertDialogInput({ show: input });
          }}
        />
        <div id="To-Top"></div>
        <section className="content-box-md">
          {query && (
            <BatchRetrievalQuerySummary
              data={query}
              timestamp={timestamp}
              onModifySearch={handleModifySearch}
            />
          )}
        </section>
        <section>
          <div className="text-end pb-3" >
            <DownloadButton
              types={[
                {
                  display:
                    stringConstants.download.batch_retrieval_csvdata.displayname,
                  type: "csv",
                  data: "batch_retrieval"
                }
              ]}
              dataId={jobId}
              dataType="batch_retrieval"
            />
          </div>
          {pageContents && pageContents.length !== 0 && batchRetrievalColumns.length > 0 && (
            <div style={{padding:20, content:'center'}}>
              <PaginatedTable
                  data={pageContents}
                  columns={batchRetrievalColumns}
                  page={page}
                  sizePerPage={sizePerPage}
                  totalSize={totalSize}
                  onTableChange={handleTableChange}
                  wrapperClasses="table-responsive"
                  idField="unique_id"
                  noDataIndication={pageLoading ? "Fetching Data." : "No data available."}
                />
            </div>
          )}
        </section>  
      </Container>
    </>
  );
};

export default BatchRetrievalResult;
