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

export const postNewJob = (formObject, userfile) => {
  const url = `/job/addnew`;
  const myHeaders = {
    "Content-Type": "application/json",
  };
  
  if (userfile === undefined) {
    return postFormDataTo1(url, formObject, myHeaders);
  } else {
    return postFormDataTo(url, formObject, undefined, userfile);
  }
};

export const  postNewJobWithTimeout = async (formObject, userfile, timeOut = 5000) => {
  let response = postNewJob(formObject, userfile);
  await new Promise(resolve => setTimeout(resolve, timeOut));
  return response;
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

export const getMultiJobStatus = (
  jobidlist,
) => {
  const queryParams = {
    jobidlist: jobidlist,
  };
  const queryParamString = JSON.stringify(queryParams);
  const url = `/job/status_many/?query=${queryParamString}`;
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
  jobId, page = undefined, sizePerPage = undefined
) => {
  const queryParams = {
    jobid: parseInt(jobId),
    offset: page ? parseInt(page) : undefined,
    limit: sizePerPage ? parseInt(sizePerPage) : undefined
  };
  const queryParamString = JSON.stringify(queryParams);
  const url = `/job/results/?query=${queryParamString}`;
  return getJson(url);
};
