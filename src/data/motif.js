import { getJson, postToAndGetBlob, glycanImageUrl } from "./api";
// import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
// import routeConstants from "./json/routeConstants";
// import LineTooltip from "../components/tooltip/LineTooltip";
// import stringConstants from "./json/stringConstants";
import { logActivity } from "../data/logging";
// import { Link } from "react-router-dom";

export const getMotifList = (
  motifListId,
  offset = 1,
  limit = 20,
  sort = "glycan_count",
  order = "desc"
) => {
  const queryParams = {
    id: motifListId,
    offset: offset,
    sort: sort,
    limit: limit,
    order: order,
  };
  const queryParamString = JSON.stringify(queryParams);
  const url = `/motif/list?query=${queryParamString}`;
  return getJson(url);
};

export const getMotifDownload = (id, format, compressed, type, headers) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, type, format, compressed };
  const url = `/data/download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};

export const getMotifDetail = (
  motif_ac,
  offset = 1,
  limit = 20,
  sort = undefined,
  order = "asc"
) => {
  const queryParams = {
    motif_ac: motif_ac,
    offset: offset,
    sort: sort,
    limit: limit,
    order: order,
  };
  const queryParamString = JSON.stringify(queryParams);
  const url = `/motif/detail?query=${queryParamString}`;
  return getJson(url);
};

export const getGlycanImageUrl = (glytoucan_id) => {
  return glycanImageUrl + glytoucan_id;
};
