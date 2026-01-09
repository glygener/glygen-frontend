import React, { useContext, useState, useRef, useEffect } from 'react';
import GlyGenNotificationContext from "./GlyGenNotificationContext.js";
import { getMultiJobStatus } from "../data/job";
import routeConstants from "../data/json/routeConstants";
import { logActivity } from "../data/logging";
import { getPendingJobFromStore, updateJobStatus, getJobStatusFromStore, setJobCompleteValue } from "../data/jobStoreApi"

const GlyGenNotificationComponent = () => {
  const { notification, showTotalJobsNotification, showJobCompleteNotification } = useContext(GlyGenNotificationContext);
  const [firstMount, setFirstMount] = useState(true);
  const firstMountRef = useRef(firstMount);
  firstMountRef.current = useRef(firstMount);
  const [apiProcessing, setApiProcessing] = useState(false);

  const [jobQueue, setJobQueue] = useState([]);
  const jobQueueRef = useRef(jobQueue);
  jobQueueRef.current = jobQueue;

  /**
   * useEffect for retriving data.
   */
  useEffect(() => {
    logActivity();
    let jobs = getJobStatusFromStore();
    let totalJobs = jobs.length;
    showTotalJobsNotification(totalJobs);
    if (!apiProcessing) {
      setTimeout((firstMountVar) => {
        jobStatus(firstMountVar);
      }, 2000, firstMount);
    }
    setFirstMount(false);
    
  }, [notification]);


  /**
   * Function to handle job status.
   **/
  const jobStatus = (firstMountVar) => {
    let jobObjList = getPendingJobFromStore(firstMountVar);
    let jobIDList = jobObjList.map(job => job.serverJobId);
    jobIDList = jobIDList.filter((item, index) => jobIDList.indexOf(item) === index);
    if (jobIDList.length === 0) {
      return;
    }
    let pendingJobList = [];
    if (firstMountVar) {
      pendingJobList = getPendingJobFromStore(false);
      pendingJobList = pendingJobList.map(job => job.serverJobId);
    }
    setApiProcessing(true);
    let message = "Job query=" + JSON.stringify(jobIDList);
    let jobStatusUpdate = [];
    let needCallback = false;
    getMultiJobStatus(jobIDList)
      .then((responseArr) => {
        for (let i = 0; i < responseArr.data.status_obj_list.length; i++ ) {
          let response = responseArr.data.status_obj_list[i];
        if (response.status) {
          let jobStatus = response.status;
          jobStatusUpdate.push({"jobId": response.jobid, "status": jobStatus, "result_count": response.result_count})

          if (jobStatus === "finished") {
            // JOB processing complete notification - finished case
            let loc = window.location + "";
            let now = Date.now();
            if (!loc.includes(routeConstants.jobStatus)) {
              if (firstMountVar) {
                if (pendingJobList.includes(response.jobid)) {
                  setJobCompleteValue(true);
                  showJobCompleteNotification(now);
                }
              } else {
                setJobCompleteValue(true);
                showJobCompleteNotification(now);
              }
            }
          } else if (jobStatus === "running") {
            needCallback = true;
          } else {
            let error = response ? response : "";
            logActivity("user", "", "No results. " + message + " " + error);
            window.scrollTo(0, 0);
            jobStatusUpdate.push({"jobId": response.jobid, "status": "error", "error": response});
            // JOB processing complete notification - error case
            let loc = window.location + "";
            let now = Date.now();
            if (!loc.includes(routeConstants.jobStatus)) {
              if (firstMountVar) {
                if (pendingJobList.includes(response.jobid)) {
                  setJobCompleteValue(true);
                  showJobCompleteNotification(now);
                }
              } else {
                setJobCompleteValue(true);
                showJobCompleteNotification(now);
              }
            }
          }
        }  else {
          logActivity("user", "", "No results. " + message);
          window.scrollTo(0, 0);
          jobStatusUpdate.push({"jobId": response.jobid, "status": "error", "error": response});
          // JOB processing complete notification - error case
          let loc = window.location + "";
          let now = Date.now();
          if (!loc.includes(routeConstants.jobStatus)) {
            if (firstMountVar) {
              if (pendingJobList.includes(response.jobid)) {
                setJobCompleteValue(true);
                showJobCompleteNotification(now);
              }
            } else {
              setJobCompleteValue(true);
              showJobCompleteNotification(now);
            }
          }
        }
      }
        updateJobStatus(jobStatusUpdate);
        if (needCallback) {
            setApiProcessing(true);
            setTimeout(() => {
              jobStatus();
          }, 5000, true);
        } else {
          setApiProcessing(false);
        }
      })
      .catch(function (error) {
        setApiProcessing(false);
      });
  };

  return (
    <></>
  );
};
export default GlyGenNotificationComponent;

