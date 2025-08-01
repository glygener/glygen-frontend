import { getJson, postToAndGetBlob, glycanImageUrl } from "./api";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { logActivity } from "./logging";
import routeConstants from "./json/routeConstants";
import stringConstants from "./json/stringConstants";
import LineTooltip from "../components/tooltip/LineTooltip";
import HitScoreTooltip from "../components/tooltip/HitScoreTooltip";
import HitScoreTooltipBiomarker from "../components/tooltip/biomarker/HitScoreTooltip";
import { Link } from "react-router-dom";
import { GLYGEN_BUILD } from "../envVariables";
import DirectSearch from "../components/search/DirectSearch.js";
import { getProteinSearch } from '../data/protein.js';
import { axiosError } from "../data/axiosError";

function HeaderwithsameStyle(colum, colIndex) {
  return { backgroundColor: "#4B85B6", color: "white" };
}
const proteinStrings = stringConstants.protein.common;
const biomarkerStrings = stringConstants.disease.common;
const diseaseStrings = stringConstants.disease.common;


export const getDiseaseDetailDownload = (id, format, compressed, type, headers) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, format, compressed };
  const url = `/data/detail_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};

export const getDiseaseDetail = (
  id,
) => {
  const queryParams = {
    paginated_tables:[{"table_id": "publication","offset":1, "limit":200,"sort": "date","order":"desc"}]
  };

  const queryParamString = JSON.stringify(queryParams);
  const url = `/disease/detail/${id}`;
  return getJson(url);
};

export const getGlycanImageUrl = (glytoucan_id) => {
  return glycanImageUrl + glytoucan_id;
};

export const getDiseaseSectionDownload = (id, format, compressed, type, headers, section) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, section, format, compressed };
  const url = `/data/section_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};


/**
 * Gets JSON for disease search.
 * @param {object} formObject - glycan search JSON query object.
 */
export const getDiseaseSearch = formObject => {
  var json = "query=" + JSON.stringify(formObject);
  const url = "/disease/search?" + json;
  return getJson(url);
};

/**
 * Gets JSON for disease simple search.
 * @param {object} formObject - glycan simple search JSON query object.
 */
export const getDiseaseSimpleSearch = formObject => {
  var json = "query=" + JSON.stringify(formObject);
  const url = "/disease/search_simple?" + json;
  return getJson(url);
};

/**
 * Gets JSON for disease search init.
 */
export const getDiseaseInit = () => {
  const url = `/disease/search_init`;
  return getJson(url);
};


/**
 * Gets JSON for disease list.
 */
export const getDiseaseList = (
  biomarkerListId,
  offset = 1,
  limit = 20,
  sort = decodeURI("hit_score"),
  order = "desc",
  filters = []
) => {
  const queryParams = {
    id: biomarkerListId,
    offset: offset,
    sort: sort,
    limit: limit,
    order: order,
    filters: filters
  };
  const queryParamString = JSON.stringify(queryParams);
  const url = `/disease/list?query=${queryParamString}`;
  return getJson(url);
};

export const getDiseaseListDownload = (
  id,
  format,
  compressed,
  type,
  headers, 
  section, 
  filters
) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, format, compressed, filters };
  const url = `/data/list_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};