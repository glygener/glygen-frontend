import React, { useState, useEffect, useReducer } from "react";
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
import Button from "react-bootstrap/Button";
import routeConstants from "../data/json/routeConstants";
import stringConstants from "../data/json/stringConstants";
import IsoformResultQuerySummary from "../components/IsoformResultQuerySummary.js";
import { Link } from "react-router-dom";
import { Tab, Tabs } from 'react-bootstrap';
import LineTooltip from "../components/tooltip/LineTooltip.js";
import MultiProteinAlignment from "../components/sequence/MultiProteinAlignment.js";
import doubleArraowIcon from "../images/icons/doubleArrowIcon.svg";
import Image from "react-bootstrap/Image";
import GetAppIcon from "@mui/icons-material/GetApp";
import { downloadFile } from "../utils/download.js"
import DownloadButton from "../components/DownloadButton";

const createSorter = (sortField, sortOrder) => (a, b) => {
  if (a[sortField] > b[sortField]) {
    return sortOrder === "asc" ? 1 : -1;
  } else if (a[sortField] < b[sortField]) {
    return sortOrder === "asc" ? -1 : 1;
  }
  return 0;
};

const blastSearch = stringConstants.blast_search.common;
let commonIsoformSearchData = stringConstants.isoform_search.common;

/**
 * Glycan blast result control.
 **/
const IsoformMappingResult = (props) => {
  let { jobId } = useParams();
  const [query, setQuery] = useState({});
  const [listId, setListId] = useState("");
  const [timestamp, setTimeStamp] = useState();
  const [proteinID, setProteinID] = useState("");
  const [blstActTabKey, setBlstActTabKey] = useState('Result');

  const [pageLoading, setPageLoading] = useState(true);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageContents, setPageContents] = useState([]);
  const [currentSort, setCurrentSort] = useState("");
  const [currentSortOrder, setCurrentSortOrder] = useState("asc");
  const [sizePerPage, setSizePerPage] = useState(20);
  const navigate = useNavigate();

  const handleTableChange = (
    type,
    { page, sizePerPage, sortField, sortOrder }
  ) => {
    data.sort(createSorter(sortField, sortOrder));

    const start = (page - 1) * sizePerPage;
    const end = page * sizePerPage;
    const pageData = data.slice(start, end);
    setPageContents(pageData);
    setPage(page);
    setCurrentSort(sortField);
    setCurrentSortOrder(sortOrder);
    setSizePerPage(sizePerPage);
  };

  useEffect(() => {
    setPageLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    logActivity("user", jobId);
    getJobResultList(jobId)
      .then(({ data }) => {
        if (data.error_code) {
          let message = "list api call";
          logActivity("user", jobId, "No results. " + message);
          setPageLoading(false);
        } else {
          function getMapping(warning, error) {
            if (warning === "" && error === "") {
              return "Mapped";
            }
            if (warning !== "") {
              return "Warning";
            }
            if (error !== "") {
              return "Error";
            }
          }

          function getMessage(warning, error) {
            if (warning === "" && error === "") {
              return ""
            }
            if (warning !== "") {
              return warning;
            }
            if (error !== "") {
              return error;
            }
          }

          let dataArr = data.objlist;
          dataArr = dataArr.map(obj => {return {
            ...obj, status: getMapping(obj.warning, obj.error), message: getMessage(obj.warning, obj.error) }})

          if (dataArr.length <= 0){
            let message = " Isoform mapping result array with no data: " + dataArr.join(", ");
            logActivity("error", jobId, message);
          }
          const start = (page - 1) * sizePerPage;
          const end = page * sizePerPage;
          const pageData = dataArr.slice(start, end);
          setPageContents(pageData);
          setData(dataArr);
          if (data.query) {
            setListId(data.list_id);
            setQuery({"parameters" : data.query, "jobtype": data.query.jobtype});
          } else {
            setQuery({"parameters" : undefined, "jobtype": ""});
          }
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
    navigate(routeConstants.isoformMapping + jobId);
  };

  const isoformResultColumns = [
    {
      dataField: "uniprotkb_isoform_ac",
      text: commonIsoformSearchData.uniprotkb_accession.name,
      sort: true,
      selected: true,
      formatter: (value, row) => (
        <>
        {row.glygen_canonical_ac !== "" && row.glygen_canonical_ac ? 
          <LineTooltip text="View details">
            <Link to={routeConstants.proteinDetail + row.glygen_canonical_ac + "#Isoforms"}>
              {value}
            </Link>
          </LineTooltip> : <>{value}</>}
        </>
      )
    },
    {
      dataField: "aa_pos_isoform",
      text: commonIsoformSearchData.amino_acid_position_isoform.name,
      sort: true,
      selected: true,
      formatter: (value, row) => (
        <>
          {row.aa_pos_isoform}
        </>
      )
    },
    {
      dataField: "aa_isoform_user",
      text: commonIsoformSearchData.amino_acid_isoform_user.name,
      sort: true,
      selected: true,
      formatter: (value, row) => (
        <>
          {row.aa_isoform_user}
        </>
      )
    },
    {
      dataField: "aa_isoform_actual",
      text: commonIsoformSearchData.amino_acid_isoform_actual.name,
      sort: true,
      selected: true,
      formatter: (value, row) => (
        <>
          {row.aa_isoform_actual}
        </>
      )
    },
    {
      dataField: "glygen_canonical_ac",
      text: commonIsoformSearchData.glygen_canonical_accession.name,
      sort: true,
      formatter: (value, row) => (
        <>
        {value !== "" && value ? 
          <LineTooltip text="View details">
            <Link to={routeConstants.proteinDetail + value}>
              {value}
            </Link>
          </LineTooltip> : ""}
        </>
      )
    },
    {
      dataField: "aa_pos_canonical",
      text: commonIsoformSearchData.amino_acid_position_canonical.name,
      sort: true,
    },
    {
      dataField: "aa_canonical",
      text: commonIsoformSearchData.amino_acid_canonical.name,
      sort: true,
    },
    {
      dataField: "status",
      text: commonIsoformSearchData.status.name,
      sort: true,
    },
    {
      dataField: "message",
      text: commonIsoformSearchData.message.name,
      sort: true,
    }
  ];

  return (
    <>
      <Helmet>
        {getTitle("isoformMapperResult")}
        {getMeta("isoformMapperResult")}
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
            <IsoformResultQuerySummary
              data={query}
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
                    display: stringConstants.download.isoform_mapper_list_csvdata.displayname,
                    type: "csv",
                    data: "isoform_mapper_list",
                  },
                  {
                    display:stringConstants.download.isoform_mapper_list_tsvdata.displayname,
                    type: "tsv",
                    data: "isoform_mapper_list",
                  },
                ]}
                dataId={listId}
                itemType="isoform_mapping_list"
                filters={[]}
              />
            </div>
              {isoformResultColumns && isoformResultColumns.length !== 0 && (
                <div style={{padding1:20, content:'center'}}>
                  <PaginatedTable
                      data={pageContents}
                      columns={isoformResultColumns}
                      page={page}
                      sizePerPage={sizePerPage}
                      totalSize={data.length}
                      onTableChange={handleTableChange}
                      defaultSortField={currentSort}
                      defaultSortOrder={currentSortOrder}
                      wrapperClasses="table-responsive"
                      noDataIndication={pageLoading ? "Fetching Data." : "No data available."}
                    />
                </div>
              )}
            </section>
      </Container>
    </>
  );
};

export default IsoformMappingResult;
