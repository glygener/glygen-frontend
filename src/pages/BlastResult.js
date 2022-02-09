import React, { useState, useEffect, useReducer } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getMappingList } from "../data/mapping";
import { getJobResultList } from "../data/job.js"
import PaginatedTable from "../components/PaginatedTable";
import Container from "@material-ui/core/Container";
import DownloadButton from "../components/DownloadButton";
import FeedbackWidget from "../components/FeedbackWidget";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import Button from "react-bootstrap/Button";
import routeConstants from "../data/json/routeConstants";
import idMappingData from "../data/json/idMapping";
import stringConstants from "../data/json/stringConstants";
import BlastResultQuerySummary from "../components/blastResultQuerySummary";
import DownloadAllButton from "../components/DownloadAllButton";
import { Link } from "react-router-dom";
import { Tab, Tabs } from 'react-bootstrap';
import LineTooltip from "../components/tooltip/LineTooltip";
import ClientPaginatedTable from "../components/ClientPaginatedTable";
import MultiProteinAlignment from "../components/sequence/MultiProteinAlignment";
import doubleArraowIcon from "../images/icons/doubleArrowIcon.svg";
import Image from "react-bootstrap/Image";
import GetAppIcon from "@material-ui/icons/GetApp";

import { downloadFile } from "../utils/download.js"

const createSorter = (sortField, sortOrder) => (a, b) => {
  if (a[sortField] > b[sortField]) {
    return sortOrder === "asc" ? 1 : -1;
  } else if (a[sortField] < b[sortField]) {
    return sortOrder === "asc" ? -1 : 1;
  }
  return 0;
};


const BlastResult = (props) => {
  let { jobId } = useParams();
  const [subjectData, setSubjectData] = useState({});
  const [legends, setLegends] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [query, setQuery] = useState({});
  const [text, setText] = useState({});
  const [timestamp, setTimeStamp] = useState();
  const [totalSize, setTotalSize] = useState();
  const [totalSizeUnmap, setTotalSizeUnmap] = useState();
  const [proteinID, setProteinID] = useState("");
  const [blstActTabKey, setBlstActTabKey] = useState('Description');

  const [pageLoading, setPageLoading] = useState(true);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageContents, setPageContents] = useState([]);
  const [currentSort, setCurrentSort] = useState("uniprot_ac");
  const [currentSortOrder, setCurrentSortOrder] = useState("asc");
  const [sizePerPage, setSizePerPage] = useState(20);

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
    logActivity("user", jobId);
    getJobResultList(jobId)
      .then(({ data }) => {
        if (data.error_code) {
          let message = "list api call";
          logActivity("user", jobId, "No results. " + message);
          setPageLoading(false);
        } else {
        let proData = Object.keys(data.by_subject).map((protID) => {
              return data.by_subject[protID].hsp_list.map((obj) => {
                let seqObj = obj.sequences.find((seq)=> seq.id === protID);
              return {
                "evalue": obj.evalue,
                "score": obj.score,
                "gaps": obj.gaps,
                "positives": obj.positives,
                "identities": obj.identities,
                "method": obj.method,
                "uniprot_ac": seqObj.uniprot_ac,
                "uniprot_id": seqObj.uniprot_id,
                "tax_name": seqObj.tax_name,
                "tax_id": seqObj.tax_id,
              }
            })
          });

          let proDataArr = []
          for(var i = 0; i < proData.length; i++) {
            proDataArr = proDataArr.concat(proData[i]);
          }

          setText(data.raw);
          setSubjectData(data.by_subject);
          proDataArr.sort(createSorter(currentSort, currentSortOrder));
          const start = (page - 1) * sizePerPage;
          const end = page * sizePerPage;
          const pageData = proDataArr.slice(start, end);
          setPageContents(pageData);
          setData(proDataArr);
          setProteinID(proDataArr[0] !== undefined ? proDataArr[0].uniprot_ac: "" );
          setQuery({"parameters" : data.parameters, "jobtype": data.jobtype});
          // setTimeStamp(data.cache_info.ts);
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
    props.history.push(routeConstants.blastSearch + jobId);
  };

    /**
   * Function to set recordtype (molecule) name value.
   * @param {string} value - input recordtype (molecule) name value.
   **/
     const proteinIDChange = (value) => {
      setProteinID(value);
    };

  const idMapResultColumns = [
    {
      dataField: "uniprot_ac",
      text: "UniProtKB Accession",
      sort: true,
      selected: true,
      // headerStyle: (colum, colIndex) => {
      //   return { width: "33%" };
      // },
      headerFormatter: (column, colIndex, { sortElement }) => {
        return (
          <div>
            {column.text} {legends.from}
            {sortElement}
          </div>
        );
      },
      formatter: (value, row) => (
        <>
        <LineTooltip text="View details">
          <Link to={routeConstants.proteinDetail + value}>
            {value}
          </Link>
        </LineTooltip>
        <LineTooltip text="See alignment">
          <Button type="button" className="gg-btn-blue ml-3" onClick={() => {setProteinID(value); setBlstActTabKey("Alignments")}}>
              <Image
                  src={doubleArraowIcon}
                  style={{ width: "15px", height: "15px"}}
              />
          </Button>
        </LineTooltip>
        </>
      )
    },
    {
      dataField: "uniprot_id",
      text: "UniProtKB ID",
      sort: true,
      // headerStyle: (colum, colIndex) => {
      //   return { width: "33%" };
      // },
      headerFormatter: (column, colIndex, { sortElement }) => {
        return (
          <div>
            {column.text} {legends.anchor}
            {sortElement}
          </div>
        );
      },
    },
    {
      dataField: "tax_name",
      text: "Organism",
      sort: true,
      // headerStyle: (colum, colIndex) => {
      //   return { width: "33%" };
      // },
      headerFormatter: (column, colIndex, { sortElement }) => {
        return (
          <div>
            {column.text} {legends.to}
            {sortElement}
          </div>
        );
      },
    },
    {
      dataField: "positives",
      text: "Positives",
      sort: true,
      // headerStyle: (colum, colIndex) => {
      //   return { width: "33%" };
      // },
      headerFormatter: (column, colIndex, { sortElement }) => {
        return (
          <div>
            {column.text} {legends.to}
            {sortElement}
          </div>
        );
      },
    },
    {
      dataField: "identities",
      text: "Identities",
      sort: true,
      // headerStyle: (colum, colIndex) => {
      //   return { width: "33%" };
      // },
      headerFormatter: (column, colIndex, { sortElement }) => {
        return (
          <div>
            {column.text} {legends.to}
            {sortElement}
          </div>
        );
      },
    },
    {
      dataField: "method",
      text: "Method",
      sort: true,
      // headerStyle: (colum, colIndex) => {
      //   return { width: "33%" };
      // },
      headerFormatter: (column, colIndex, { sortElement }) => {
        return (
          <div>
            {column.text} {legends.to}
            {sortElement}
          </div>
        );
      },
    },
    {
      dataField: "evalue",
      text: "E-value",
      sort: true,
      // headerStyle: (colum, colIndex) => {
      //   return { width: "33%" };
      // },
      headerFormatter: (column, colIndex, { sortElement }) => {
        return (
          <div>
            {column.text} {legends.to}
            {sortElement}
          </div>
        );
      },
    },
    {
      dataField: "score",
      text: "Score",
      sort: true,
      // headerStyle: (colum, colIndex) => {
      //   return { width: "33%" };
      // },
      headerFormatter: (column, colIndex, { sortElement }) => {
        return (
          <div>
            {column.text} {legends.to}
            {sortElement}
          </div>
        );
      },
    },
    {
      dataField: "gaps",
      text: "Gaps",
      sort: true,
      // headerStyle: (colum, colIndex) => {
      //   return { width: "33%" };
      // },
      headerFormatter: (column, colIndex, { sortElement }) => {
        return (
          <div>
            {column.text} {legends.to}
            {sortElement}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        {getTitle("blastResult")}
        {getMeta("blastResult")}
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
            <BlastResultQuerySummary
              data={query}
              totalSize={totalSize}
              totalSizeUnmap={totalSizeUnmap}
              timestamp={timestamp}
              onModifySearch={handleModifySearch}
            />
          )}
        </section>

        <Tabs
						defaultActiveKey='Description'
						transition={false}
						activeKey={blstActTabKey}
						mountOnEnter={true}
						unmountOnExit={true}
						onSelect={(key) => setBlstActTabKey(key)}
            >
						<Tab
							eventKey='Description'
							className='tab-content-padding'
              title={"Description"}
							// title={simpleSearch.tabTitle}
            >

        <div id="Mapped-Table"></div>
        {/* <DownloadButton
          types={[
            {
              display: stringConstants.download.idmapping_mapped_csvdata.displayname,
              type: "csv",
              data: "idmapping_list_mapped",
            },
          ]}
          dataId={jobId}
          itemType="idMappingMapped"
        /> */}

        <section>
          {/* Mapped Table */}
          {idMapResultColumns && idMapResultColumns.length !== 0 && (
            <div style={{padding:20, content:'center'}}
            >
            <PaginatedTable
                data={pageContents}
                columns={idMapResultColumns}
                page={page}
                sizePerPage={sizePerPage}
                totalSize={data.length}
                onTableChange={handleTableChange}
                defaultSortField={currentSort}
                defaultSortOrder={currentSortOrder}
                wrapperClasses="table-responsive table-height"
                noDataIndication={"No data available."}
              />
              {/* <ClientPaginatedTable
                data={data}
                columns={idMapResultColumns}
                defaultSortField={"uniprot_ac"}
                defaultSortOrder="asc"
                noDataIndication={"No data available."}
              /> */}
            </div>
          )}
        </section>

        </Tab>
						<Tab
							eventKey='Alignments'
							title={"Alignments"}
							className='tab-content-padding'>

          {subjectData && <MultiProteinAlignment 
                  algnData={subjectData} 
                  proteinID={proteinID}
                  proteinIDChange={proteinIDChange}
                  ></MultiProteinAlignment>}

          </Tab>
				<Tab
            eventKey='Text-View'
            title={"Text View"}
            className='tab-content-padding'>
            <div id="contents" class = "gf-content-div">
              <div style={{padding:20, content:'center'}}>
                {/* <div style={{paddingLeft:20, paddingRight:80, float: 'right'}}>
                  <Button
                    className={"lnk-btn"}
                    variant="link"
                    onClick={() => {
                      downloadFile(text, "blast-data.txt", "text");
                    }}                    
                    align="bottom"
                  >
                    <div>
                      <GetAppIcon /> Download
                    </div>
                  </Button>
                </div> */}
                  <div 
                      style={{overflow: 'scroll', paddingRight:40, content:'center', maxHeight: '600px' }}
                  >
                      <div><pre>{text}</pre></div>
                  </div>
              </div>
            </div>
        </Tab>
      </Tabs>
      </Container>
    </>
  );
};

export default BlastResult;
