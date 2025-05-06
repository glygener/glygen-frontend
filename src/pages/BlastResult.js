import React, { useState, useEffect, useReducer, useContext } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getJobResultList } from "../data/job.js"
import PaginatedTable from "../components/PaginatedTable";
import Container from "@mui/material/Container";
import FeedbackWidget from "../components/FeedbackWidget";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import Button from "react-bootstrap/Button";
import routeConstants from "../data/json/routeConstants";
import stringConstants from "../data/json/stringConstants";
import BlastResultQuerySummary from "../components/BlastResultQuerySummary";
import { Link } from "react-router-dom";
import { Tab, Tabs } from 'react-bootstrap';
import LineTooltip from "../components/tooltip/LineTooltip";
import MultiProteinAlignment from "../components/sequence/MultiProteinAlignment";
import doubleArraowIcon from "../images/icons/doubleArrowIcon.svg";
import Image from "react-bootstrap/Image";
import GetAppIcon from "@mui/icons-material/GetApp";
import { downloadFile } from "../utils/download.js"
import GlyGenNotificationContext from "../components/GlyGenNotificationContext.js";
import { addIDsToStore } from "../data/idCartApi"

const createSorter = (sortField, sortOrder) => (a, b) => {
  if (a[sortField] > b[sortField]) {
    return sortOrder === "asc" ? 1 : -1;
  } else if (a[sortField] < b[sortField]) {
    return sortOrder === "asc" ? -1 : 1;
  }
  return 0;
};

const blastSearch = stringConstants.blast_search.common;

/**
 * Glycan blast result control.
 **/
const BlastResult = (props) => {
  let { jobId } = useParams();
  const [subjectData, setSubjectData] = useState({});
  const [query, setQuery] = useState({});
  const [text, setText] = useState("");
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
  const [currentSort, setCurrentSort] = useState("evalue");
  const [currentSortOrder, setCurrentSortOrder] = useState("asc");
  const [sizePerPage, setSizePerPage] = useState(20);
  const {showTotalCartIdsNotification} = useContext(GlyGenNotificationContext);
  const [selectedData, setSelectedData] = useState([]);
  const navigate = useNavigate();

  const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    onSelect: (row, isSelect, rowIndex, e) => {
      let proteinIDs = [];
      if (isSelect) {
        proteinIDs = selectedData.map(obj => obj.uniprot_canonical_ac);
        if (!proteinIDs.includes(row.uniprot_canonical_ac)) {
          selectedData.push({uniprot_canonical_ac: row.uniprot_canonical_ac, protein_name: row.protein_name, organism: row.glygen_name });
          setSelectedData(selectedData);
        }
      } else {
        proteinIDs = selectedData.filter(obj => obj.uniprot_canonical_ac !== row.uniprot_canonical_ac);
        setSelectedData(proteinIDs);
      }
    },
    onSelectAll: (isSelect, rows, e) => {
      let proteinIDs = rows.map(obj =>  {return { "uniprot_canonical_ac": obj.uniprot_canonical_ac, "protein_name": obj.protein_name, "organism": obj.glygen_name }});
      if (isSelect) {
         selectedData.push(...proteinIDs);
         setSelectedData(selectedData);
      } else {
        let proteinIDs = rows.map(obj =>  obj.uniprot_canonical_ac);
        let proIDs = selectedData.filter(obj => !proteinIDs.includes(obj.uniprot_canonical_ac));
        setSelectedData(proIDs);
      }
    }
  };

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
          let protArr = [];
          Object.keys(data.by_subject).map((protID) => {
            let proObjs = data.by_subject[protID].hsp_list.filter(obj => obj.sequences === undefined);
            if (proObjs !== undefined){
              protArr.push(protID);
            }
          })
          if (protArr.length > 0){
            let message = "Protein object with no sequences array: " + protArr.join(", ");
            logActivity("error", jobId, message);
          }

          let proData = Object.keys(data.by_subject).map((protID) => {
              return data.by_subject[protID].hsp_list.filter(obj => obj.sequences !== undefined).map((obj) => {
                let seqObj = obj.sequences.find((seq)=> seq.id === protID);
                let identities_val = parseInt(obj.identities.slice(obj.identities.indexOf("(")+1, obj.identities.indexOf("%")));
                let evalue = parseFloat(obj.evalue)
              return {
                "evalue": evalue,
                "identities": obj.identities,
                "evalue_identities_val": {evalue : evalue, identities_val : identities_val},
                "identities_val": parseInt(obj.identities.slice(obj.identities.indexOf("(")+1, obj.identities.indexOf("%"))),
                "uniprot_ac": seqObj.uniprot_ac,
                "uniprot_canonical_ac": data.by_subject[protID].details.uniprot_canonical_ac,
                "uniprot_id": seqObj.uniprot_id,
                "protein_name": data.by_subject[protID].details.protein_name,
                "gene_name": data.by_subject[protID].details.gene_name,
                "common_name": data.by_subject[protID].details.species.common_name,
                "glygen_name": data.by_subject[protID].details.species.glygen_name,
                "tax_name": seqObj.tax_name,
                "tax_id": seqObj.tax_id,
                "start_pos": seqObj.start_pos,
                "end_pos": seqObj.end_pos,
                "unique_id": data.by_subject[protID].details.uniprot_canonical_ac + " " + seqObj.start_pos + " " + seqObj.end_pos,
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
          if (data.query) {
            setQuery({"parameters" : data.query.parameters, "jobtype": data.query.jobtype});
          } else {
            setQuery({"parameters" : undefined, "jobtype": ""});
          }
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

/**
 * Function to add protein ids to cart.
 **/
  const addProteinIDs = () => {
    let unique = getUniqueIDs(selectedData, obj => obj.uniprot_canonical_ac);
    let totalCartCount = addIDsToStore("proteinID", unique);
    showTotalCartIdsNotification(totalCartCount);
  };

/**
 * Function to handle protein direct search.
 **/
  const addAllProteinIDs = () => {
    let proteinIDs = data.map(obj =>  {return { "uniprot_canonical_ac": obj.uniprot_canonical_ac, "protein_name": obj.protein_name, "organism": obj.glygen_name }});
    let unique = getUniqueIDs(proteinIDs, obj => obj.uniprot_canonical_ac);
    let totalCartCount = addIDsToStore("proteinID", unique);
    showTotalCartIdsNotification(totalCartCount);
  };

  function getUniqueIDs(ids, key) {
    let idSet = new Set();
    return ids.filter(obj => {
        let val = key(obj);
        return idSet.has(val) ? false : idSet.add(val);
    });
  }


  const handleModifySearch = () => {
    navigate(routeConstants.blastSearch + jobId);
  };

  /**
   * Function to set recordtype (molecule) name value.
   * @param {string} value - input recordtype (molecule) name value.
   **/
     const proteinIDChange = (value) => {
      setProteinID(value);
    };

  const blastResultColumns = [
    {
      dataField: "uniprot_ac",
      text: blastSearch.uniprot_canonical_ac.name,
      sort: true,
      selected: true,
      formatter: (value, row) => (
        <>
        <LineTooltip text="View details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {value}
          </Link>
        </LineTooltip>
        <LineTooltip text="See alignment">
          <Button type="button" className="gg-btn-blue ms-3" onClick={() => {setProteinID(value); setBlstActTabKey("Alignments")}}>
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
      dataField: "start_pos",
      text: "Position (Start - End)",
      sort: true,
      selected: true,
      formatter: (value, row) => (
        <>
          {row.start_pos + "-" + row.end_pos}
        </>
      )
    },
    {
      dataField: "uniprot_id",
      text: blastSearch.uniprot_id.name,
      sort: true,
    },
    {
      dataField: "protein_name",
      text: blastSearch.protein_name.name,
      sort: true,
    },
    {
      dataField: "gene_name",
      text: blastSearch.gene_name.name,
      sort: true,
    },
    {
      dataField: "glygen_name",
      text: blastSearch.organism.name,
      sort: true,
    },
    {
      dataField: "evalue",
      text: blastSearch.evalue.name,
      sort: true,
    },
    {
      dataField: "identities_val",
      text: blastSearch.identities.name,
      sort: true,
      formatter: (value, row) => (
        <>
          {row.identities}
        </>
      )
    }
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
              timestamp={timestamp}
              onModifySearch={handleModifySearch}
            />
          )}
        </section>

        <Tabs
          defaultActiveKey='Result'
          transition={false}
          activeKey={blstActTabKey}
          mountOnEnter={true}
          unmountOnExit={true}
          onSelect={(key) => setBlstActTabKey(key)}
          >
						<Tab
							eventKey='Result'
							className='tab-content-padding'
              title={"Result"}
            >
              <section>
              <div className="text-end p-3" >
                <Button onClick={() => addAllProteinIDs()} type="button" className="gg-btn-blue me-4">Add All Protein IDs</Button>
                <Button onClick={() => addProteinIDs()} type="button" className="gg-btn-blue">Add Protein IDs</Button>
              </div>
                {blastResultColumns && blastResultColumns.length !== 0 && (
                  <div style={{padding:20, content:'center'}}>
                    <PaginatedTable
                        data={pageContents}
                        columns={blastResultColumns}
                        page={page}
                        sizePerPage={sizePerPage}
                        totalSize={data.length}
                        totalSizeText={"High Scoring Pair (HSP) Results"}
                        onTableChange={handleTableChange}
                        defaultSortField={currentSort}
                        defaultSortOrder={currentSortOrder}
                        wrapperClasses="table-responsive table-height"
                        idField="unique_id"
                        selectRow={selectRow}
                        noDataIndication={pageLoading ? "Fetching Data." : "No data available."}
                      />
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
            jobId={jobId}
            />}
        </Tab>
				<Tab
          eventKey='Text-View'
          title={"Text View"}
          className='tab-content-padding'>
            <div id="contents" class = "gf-content-div">
              <div style={{padding:20, content:'center'}}>
                <div style={{paddingLeft:20, paddingRight:80, float: 'right'}}>
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
                </div>
                <div 
                  style={{overflow: 'scroll', paddingRight:40, content:'center', maxHeight: '600px' }}>
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
