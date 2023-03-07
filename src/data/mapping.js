import { postTo, postFormDataTo, postToAndGetBlob } from "./api";
// import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { logActivity } from "../data/logging";

// Performs dropdown selections: Molecules, From ID Type, To ID Type
export const getMappingInit = () => {
  const url = `/idmapping/search_init?query={}`;
  return postTo(url);
};

// Forms objects and displays data in a results (list) page
// Takes selections and inputs in search page and performs search on submit btn
export const getMappingSearch = (formObject) => {
  // var json = "query=" + JSON.stringify(formObject);
  const url = "/idmapping/search/"; //+ json;
  return postFormDataTo(url, formObject);
};

export const getMappingList = (
  mappingId,
  category = "mapped",
  offset = 1,
  limit = 20,
  sort = "from",
  order = "asc"
) => {
  const queryParams = {
    id: mappingId,
    offset: offset,
    limit: limit,
    order: order,
    sort: sort,
    category: category,
  };
  const queryParamString = JSON.stringify(queryParams);
  const url = `/idmapping/list/?query=${queryParamString}`;
  return postTo(url);
};

export const getIdMappingMappedDownload = (id, format, compressed, type, headers) => {
  let message = "idMapping mapped downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, type, format, compressed };
  const url = `/data/download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};
export const getIdMappingUnmappedDownload = (id, format, compressed, type, headers) => {
  let message = "idMapping unmapped downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, type, format, compressed };
  const url = `/data/download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};
export const getIdMappingDownloadAll = (id, format, compressed, type, headers) => {
  let message = "idMapping all downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, type, format, compressed };
  const url = `/data/download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};
