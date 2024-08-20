import { postTo, postFormDataTo, postToAndGetBlob } from "./api";
// import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { logActivity } from "./logging";

export const getIsoformMappingListDownload = (id, format, compressed, type, headers) => {
  let message = "Isoform mapping downloaded successfully ";
  logActivity("user", id, format, compressed, message);
  const query = { id, "download_type": type, format, compressed, filters:[] };
  const url = `/data/list_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};
