import React, { useEffect, useState, useReducer, useRef, useContext } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useParams, useNavigate } from "react-router-dom";
import PageLoader from "../components/load/PageLoader";
import DialogLoader from '../components/load/DialogLoader';
import DialogAlert from "../components/alert/DialogAlert";
import JobErrorDisplay from "../components/alert/JobErrorDisplay";
import ClientEditableTable from "../components/ClientEditableTable";
import LineTooltip from "../components/tooltip/LineTooltip";
import "../css/Search.css";
import GlyGenNotificationContext from "../components/GlyGenNotificationContext.js";
import { logActivity } from "../data/logging";
import { axiosError } from "../data/axiosError";
import stringConstants from "../data/json/stringConstants";
import routeConstants from "../data/json/routeConstants";
import { postNewJobWithTimeout, getJobResultList, postNewJob } from "../data/job";
import deleteIcon from "../images/icons/delete.svg";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getJobStatusFromStore, getPendingJobFromStore, updateJobProperty, deleteJob, setJobCompleteValue, getJobValue, addJobToStore } from "../data/jobStoreApi"
import LoadingImage from "../images/logo-loading-animated-black.svg";
import WorkIcon from '@mui/icons-material/Work';
import EditIcon from '@mui/icons-material/Edit';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import FeedbackWidget from "../components/FeedbackWidget";

/**
 * GlyGen job status.
 **/
const JobStatus = (props) => {
  const { showJobCompleteNotification, showTotalJobsNotification, showNotification } = useContext(GlyGenNotificationContext);

  let { id } = useParams("");

  const [pageLoading, setPageLoading] = React.useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const dialogLoadingRef = useRef(dialogLoading);
  dialogLoadingRef.current = dialogLoading;
  const [alertTextInput, setAlertTextInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "", custom: "" }
  );

  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const [jobErrorDialogInput, setJobErrorDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, error: "" }
  );
  const [updateTable, setUpdateTable] = useState(null);
  const [dataSequence, setDataSequence] = useState([{
    id: 0,
    amino_acid_position: '',
    amino_acid: '',
    error: false
  }, {
    id: 1,
    amino_acid_position: '',
    amino_acid: '',
    error: false
  }]);
  const [data, setData] = useState([{
    clientJobId: 0,
    jobType: '',
    name: '',
    startDate: '',
    status: '',
    error: false
  }, {
    clientJobId: 1,
    jobType: '',
    name: '',
    startDate: '',
    status: '',
    error: false
  }]);

  const dataRef = useRef(data);
  dataRef.current = data;

  const dataSequenceRef = useRef(dataSequence);
  dataSequenceRef.current = dataSequence;

  const [apiProcessing, setApiProcessing] = useState(false);
  const [updateNotification, setUpdateNotification] = useState(null);


  const navigate = useNavigate();

  function buttonJobDelete(cell, row, rowIndex) {
    return (
      <Button
        className='gg-btn-outline'
        onClick={() => deleteJobTableEntry(row.clientJobId)}
      >
        <Image
          src={deleteIcon}
          alt="delete button"
        />
      </Button>
    );
  }

  function buttonRestartJob(cell, row, rowIndex) {
    return (
      <Button
        className='gg-btn-outline'
        onClick={() => restartJob(row.clientJobId)}
      >
        <RestartAltOutlinedIcon sx={{ color: 'text.primary' }}/>
      </Button>
    );
  }

  const rowStyle = (row, rowIndex) => {
    const style = {};
    if (row.error) {
      style.backgroundColor = row.expired ? "#FAF0F0" : "#FDEDED";
    }
    return style;
  };

  const columnsJob = [
    {
      dataField: 'clientJobId',
      text: 'Number',
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "1%"
        };
      },
      sort:true,
      selected: true,
      hidden: true,
      editable: false
    },
    {
      dataField: 'jobType',
      text: 'Job Type',
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "15%"
        };
      },
      editable: false
    }, {
      dataField: 'name',
      text: "Name",
      mode: 'input',
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "50%"
        };
      },
      editorClasses: (cell, row, rowIndex, colIndex) =>
        'editing-editor',
      formatter: (value, row) => (
        <>
         <span>{value}</span>
         <span style={{paddingLeft:"10px"}}><EditIcon/></span>
       </>
     ),

    },
    {
      dataField: 'startDate',
      text: "Start Date",
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "15%",
          wordBreak: "breakAll"
        };
      },
      editable: false
    },
    {
      dataField: 'status',
      text: "Status",
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "30%"
        };
      },
      formatter: (value, row) => (
         <>
          {row.status === "running" && <>
              <span>{value}</span><img src={LoadingImage} alt="loadingImage" style={{paddingLeft:"20px", width:"50px", height:"38px"}} />
          </>}
          {row.status === "finished" && <>
            <LineTooltip text="View results">
              {row.jobType === "BLAST" && row.result_count > 0 && 
                <Link to={routeConstants.blastResult + row.serverJobId}>
                  {"finished"}
                </Link>}
              {(row.jobType === "STRUCTURE" || row.jobType === "SUBSTRUCTURE")  && row.result_count > 0  && 
                <Button className={"lnk-btn"} variant="link" onClick={() => getListID(row.listID, row.clientJobId, row.serverJobId)}>
                  {"finished"}
                </Button>}
              {(row.jobType === "ISOFORM")  && row.result_count > 0 && 
                <Link to={routeConstants.isoformMappingResult + row.serverJobId}>
                  {"finished"}
                </Link>}
            </LineTooltip>
            {row.result_count === 0 && 
              <div>
                {"finished"}
            </div>}
            {row.result_count >= 0 && 
              <div>
                {"Result count: "}{row.result_count}
            </div>}
            </>}
            {row.status === "error" && <>
              <Button className={"lnk-btn"} variant="link" onClick={() => setJobError(row.serverJobId, row.jobType, row.job, row.jobTypeInternal, row.userfile, row.error, row.expired)}>
                {row.expired ? "expired": value}
              </Button>
          </>}
        </>
      ),
      editable: false
    },
    {
      text: '',
      formatter: buttonRestartJob,
      editable: false
    },
    {
      text: '',
      formatter: buttonJobDelete,
      editable: false
    }
  ];


  function getListID(listID, clientJobId, serverJobId) {
    if (listID) {
      navigate(routeConstants.glycanList + listID);
      return;
    }
    setPageLoading(true);
    let message = "JOB to List ID";
    getJobResultList(serverJobId)
      .then((response) => {
        if (response.data['list_id'] !== '') {
            logActivity("user", (id || "") + ">" + serverJobId, message + " " + JSON.stringify(response.data["query"]) + " " + response.data['list_id']).finally(() => {
              setPageLoading(false);
              updateJobProperty(clientJobId, "listID", response.data['list_id']);
              navigate(routeConstants.glycanList + response.data['list_id']);
            });
        } else {
          logActivity("user", "", "No results. " + message);
          setPageLoading(false);
          window.scrollTo(0, 0);
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  }

  function setJobError(serverJobId ,jobType, job, jobTypeInternal, userfile, error, expired) {
    setJobErrorDialogInput({ show: true, jobType: jobType, serverJobId: serverJobId, job: job, jobTypeInternal: jobTypeInternal, userfile: userfile, error: error, expired: expired })
  }

  /**
 * Function to delete table entry.
 * @param {number} id - id number.
 **/
  function deleteJobTableEntry(clientJobId) {
    deleteJob(clientJobId);
    let jobs = getJobStatusFromStore();
    setData(jobs);
    let now = Date.now();
    setUpdateTable(now);
    showTotalJobsNotification(jobs.length);

  }

  /**
     * Function to handle blast search submit.
     **/
    const jobSubmit = (formObject, clientJobIdOld, nameOld, jobType, jobTypeInternal, userfile, userfileb64) => {
      setDialogLoading(true);
      let message = "Job query=" + JSON.stringify(formObject);
      logActivity("user", id, "Re-executing Job." + message);
      postNewJob(formObject, userfile)
        .then((response) => {
          if (response.data["status"] && response.data["status"] !== {}) {
            let josStatus = response.data["status"].status;
            let jobid = response.data["jobid"];
            if (josStatus === "finished") {
              if (response.data["status"].result_count && response.data["status"].result_count > 0) {
                if (dialogLoadingRef.current) {
                  logActivity("user", (id || "") + ">" + response.data["jobid"], message).finally(() => {                   
                    let newJob = {
                      serverJobId: jobid,
                      jobType: jobType,
                      jobTypeInternal: jobTypeInternal,
                      name: nameOld,
                      status: "finished",
                      result_count: response.data["status"].result_count,
                      job: formObject,
                      userfile: userfileb64
                    };
                    addJobToStore(newJob);
                    deleteJob(clientJobIdOld);
                    let now = Date.now();
                    showNotification(now);
                    let jobs = getJobStatusFromStore();
                    setData(jobs);
                    setUpdateTable(now);
                    showTotalJobsNotification(jobs.length);
                    setUpdateNotification(now);
                    setDialogLoading(false);
                  });
                } else {
                  logActivity("user", "", "User canceled job. " + message);
                }
              } else {
                logActivity("user", "", "No results. " + message);
                setDialogLoading(false);
                setAlertTextInput({"show": true, "id": stringConstants.errors.blastSearchError.id});
                window.scrollTo(0, 0);
              }
            } else if (josStatus === "running") {
                if (dialogLoadingRef.current) {
                      let newJob = {
                      serverJobId: jobid,
                      jobType: jobType,
                      jobTypeInternal: jobTypeInternal,
                      name: nameOld,
                      status: "running",
                      job: formObject,
                      userfile: userfileb64
                    };
                    addJobToStore(newJob);
                    deleteJob(clientJobIdOld);
                    let now = Date.now();
                    showNotification(now);
                    let jobs = getJobStatusFromStore();
                    setData(jobs);
                    setUpdateTable(now);
                    showTotalJobsNotification(jobs.length);
                    setUpdateNotification(now);
                    setDialogLoading(false);
                } else {
                  logActivity("user", "", "User canceled job. " + message);
                }
            } else {
              let error = response.data["status"].error ? response.data["status"].error : "";
              logActivity("user", "", "No results. " + message + " " + error);
              setDialogLoading(false);
              window.scrollTo(0, 0);
            }
          } else {
            logActivity("user", "", "No results. " + message);
            setDialogLoading(false);
            window.scrollTo(0, 0);
          }
        })
        .catch(function (error) {
          axiosError(error, "", message, setDialogLoading, setAlertDialogInput);
        });
    };

  const base64toBlob = async (base64) => {
    const response = await fetch(`data:application/octet-stream;base64,${base64}`);
    const fileBlob = await response.blob();
    return fileBlob;
  }

   /**
 * Function to restart job.
 * @param {number} id - id number.
 **/
   function restartJob(clientJobId) {
    let jobValue = getJobValue(clientJobId);
      try {
        if (jobValue.jobTypeInternal === "ISOFORM_FILE" && typeof jobValue.userfile === 'string') {
          base64toBlob(jobValue.userfile).then((blob) => {
            jobSubmit(jobValue.job, jobValue.clientJobId, jobValue.name, jobValue.jobType, jobValue.jobTypeInternal, blob, jobValue.userfile);
          })
          .catch ()
        } else {
          jobSubmit(jobValue.job, jobValue.clientJobId, jobValue.name, jobValue.jobType, jobValue.jobTypeInternal);
        }
      } catch (er) {
      }
  }

 function updateJobStatus() {
    setData(getJobStatusFromStore());
    let now = Date.now();
    setUpdateTable(now);

    let jobObjList = getPendingJobFromStore();
    let penJobIDList = jobObjList.map(job => job.serverJobId);
      if (penJobIDList.length > 0) {
        setApiProcessing(true);
        setTimeout(() => {
          updateJobStatus();
      }, 5000);
    } else {
      setApiProcessing(false);
    }
  }

  /**
   * useEffect for retriving data from api and showing page loading effects.
   */
  useEffect(() => {
    setPageLoading(true);
    logActivity();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    document.addEventListener("click", () => {
      setAlertTextInput({ show: false });
    });
    let now = Date.now();
    setData(getJobStatusFromStore());
    setUpdateTable(now);
    setJobCompleteValue(false);
    showJobCompleteNotification(now);

    setUpdateNotification(now);
    setPageLoading(false);
  }, []);


  useEffect(() => {
    if (!apiProcessing) {
      setTimeout(() => {
        updateJobStatus();
      }, 5000);
    }
  }, [updateNotification]);

  const saveColumnData = (oldValue, newValue, row, column) => {
    updateJobProperty(row.clientJobId, "name", newValue.trim() === "" ? oldValue : newValue);
    setData(getJobStatusFromStore());
    let now = Date.now();
    setUpdateTable(now);
  }

  const validateColumnData = (columnId, value) => {
    return false;
  };

  return (
    <React.Fragment>
      <Helmet>
        {getTitle("jobStatus")}
        {getMeta("jobStatus")}
      </Helmet>

      <FeedbackWidget />

      <div className="content-box-md">
        <div className="horizontal-heading text-center">
          <h2>
            {"Job Status"}
          </h2>
        </div>
      </div>
      <Container className1="tab-bigscreen">
        <PageLoader pageLoading={pageLoading} />
        <DialogLoader
          show={dialogLoading}
          title={"Executing Job"}
          page={"job-status"}
          setOpen={(input) => {
            setDialogLoading(input)
          }}
        />
        <JobErrorDisplay
          jobErrorDialogInput={jobErrorDialogInput}
          setPageLoading={setPageLoading}
          setOpen={(input) => {
            setJobErrorDialogInput({ show: input });
          }}
        />
        <DialogAlert
          alertInput={alertDialogInput}
          setOpen={(input) => {
            setAlertDialogInput({ show: input });
          }}
        />
          <div id={"isoform_table"}>
            <div className="text-center">{"The table below shows the list of jobs you have submitted and their corresponding status. While GlyGen is processing the job requests feel free to continue to explore our webpage. You can always return to this page using the "}
              <WorkIcon/>
              {" icon in the top right corner of the page. A red marker on the icon will indicate that job processing is complete. You can access the results of the job by clicking the “finished” link in the status column."}
            </div>
          </div>
          <div className="list-mainpage-container">
            <ClientEditableTable
              data={data}
              errorColumns={["name"]}
              columns={columnsJob}
              rowStyle={rowStyle}
              idField={"clientJobId"}
              defaultSortField = "clientJobId"
              defaultSortOrder = "desc"
              updateTable={updateTable}
              validateColumnData={validateColumnData}
              saveColumnData={saveColumnData}
              tableHeader={"header-class"}
              bordered={false}
              noDataIndication={"No job results available."}
            />
          </div>
      </Container>
    </React.Fragment>
  );
};
export default JobStatus;
