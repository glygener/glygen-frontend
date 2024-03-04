import { getJson, postToAndGetBlob, glycanImageUrl, glycanSvgUrl, glycanJsonUrl } from "./api";
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

export const getMotifListDownload = (id, format, compressed, type, headers) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, format, compressed };
  const url = `/data/list_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};

export const getMotifDetailDownload = (id, format, compressed, type, headers) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, format, compressed };
  const url = `/data/detail_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};

export const getMotifSectionDownload = (id, format, compressed, type, headers, section) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, section, format, compressed };
  const url = `/data/section_download?query=${JSON.stringify(query)}`;
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

export function glymagesvgInit() {
  var params = {
      imageurl: glycanSvgUrl,
      jsonurl: glycanJsonUrl,
      imageclass: "glymagesvg_low_opacity",
			monoclass: "glymagesvg_high_opacity",
			substclass: "glymagesvg_high_opacity",
			linkclass: "glymagesvg_high_opacity",
			linkinfoclass: "glymagesvg_high_opacity",
			parentlinkclass: "glymagesvg_low_opacity",
			parentlinkinfoclass: "glymagesvg_high_opacity_anomer",
			highlight_parent_link: "true",
			cssurl: null
  };
  window.glymagesvg.init(params);
}