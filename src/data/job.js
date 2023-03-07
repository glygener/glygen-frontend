import { postTo, postFormDataTo1, postFormDataTo, postToAndGetBlob, getJson } from "./api";
// import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { logActivity } from "./logging";

// Performs dropdown selections: Molecules, From ID Type, To ID Type
export const getJobInit = () => {
  const url = `/job/init?query={}`;
  return postTo(url);
};


// Forms objects and displays data in a results (list) page
// Takes selections and inputs in search page and performs search on submit btn
export const postNewJob = (formObject) => {
  // var json = "query=" + JSON.stringify(formObject);
  let query = formObject;
  var json = {query};
  const url = `/job/addnew`;
  const myHeaders = {
    "Content-Type": "application/json",
  };
  
  return postFormDataTo1(url, json, myHeaders);
};

export const getJobStatus = (
  jobId,
) => {
  const queryParams = {
    jobid: parseInt(jobId),
  };
  const queryParamString = JSON.stringify(queryParams);
  const url = `/job/status/?query=${queryParamString}`;
  return getJson(url);
};


export const getJobDetails = (
  jobId,
) => {
  const queryParams = {
    jobid: parseInt(jobId),
  };
  const queryParamString = JSON.stringify(queryParams);
  const url = `/job/detail/?query=${queryParamString}`;
  return getJson(url);
};

export const getJobResultList = (
  jobId,
) => {
  const queryParams = {
    jobid: parseInt(jobId),
  };
  const queryParamString = JSON.stringify(queryParams);
  const url = `/job/results/?query=${queryParamString}`;
  return getJson(url);
};
