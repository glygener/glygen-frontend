import { getJson, postToAndGetBlob, postFormDataTo1 } from "./api";

import { Link } from "react-router-dom";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import routeConstants from "./json/routeConstants";
import stringConstants from "./json/stringConstants";
import LineTooltip from "../components/tooltip/LineTooltip";
import HitScoreTooltip from "../components/tooltip/HitScoreTooltip";
import { logActivity } from "../data/logging";
// import { positions } from "@material-ui/system";

const proteinStrings = stringConstants.protein.common;

export const getProteinList = (
  protienListId,
  offset = 1,
  limit = 20,
  sort = "hit_score",
  order = "desc",
  filters = []
) => {
  const queryParams = {
    id: protienListId,
    offset: offset,
    limit: limit,
    order: order,
    sort: sort,
    filters: filters
  };
  const queryParamString = JSON.stringify(queryParams);
  const url = `/protein/list?query=${queryParamString}`;
  return getJson(url);
};

export const getProteinsiteDetail = (protienId, position) => {
  const url = `/site/detail/${protienId}.${position}.${position}`;
  return getJson(url);
};

export const getProteinDetail = accessionId => {

  const queryParams = {"paginated_tables":[{"table_id": "glycosylation_reported_with_glycan","offset":1, "limit":20,"sort": "glytoucan_ac","order":"asc"},
                      {"table_id": "glycosylation_reported","offset":1, "limit":20,"s1ort": "glytoucan_ac","order":"asc"},
                      {"table_id": "phosphorylation","offset":1, "limit":20,"s1ort": "glytoucan_ac","order":"asc"},
                      {"table_id": "publication","offset":1, "limit":200,"sort": "date","order":"desc"}]}

  const queryParamString = JSON.stringify(queryParams);

  const url = `/protein/detail/${accessionId}/?query=${queryParamString}`;
  // const url = `/protein/detail/${accessionId}`;


  // const url = `/pagination/page/?query=${queryParamString}`;
    //  const url = `pagination/page/`;
    //  const myHeaders = {
    //   "Content-Type": "application/json",
    // };
  // return postFormDataTo1(url, queryParamString, myHeaders);
  return getJson(url);
};
export const getProteinDetailDownload = (id, format, compressed, type, headers) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id,  "download_type": type, format, compressed };
  const url = `/data/detail_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};
export const getProteinListDownload = (id, format, compressed, type, headers, section, filters) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id,  "download_type": type, format, compressed, filters };
  const url = `/data/list_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};

export const getProteinSectionDownload = (id, format, compressed, type, headers, section) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, section, format, compressed };
  const url = `/data/section_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};

export const getProteinSiteListDownload = (
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

export const getProteinSiteDetailDownload = (
  id,
  format,
  compressed,
  type,
  headers
) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, format, compressed };
  const url = `/data/detail_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};

export const getProteinSiteSectionDownload = (id, format, compressed, type, headers, section) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, section, format, compressed };
  const url = `/data/section_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};

function HeaderwithsameStyle(colum, colIndex) {
  return { backgroundColor: "#4B85B6", color: "white" };
}

export const PROTEIN_COLUMNS = [
  {
    dataField: proteinStrings.shortName,
    text: proteinStrings.uniprot_accession.name,
    sort: true,
    selected: true,
    headerStyle: HeaderwithsameStyle,

    formatter: (value, row) => (
      <LineTooltip text="View details">
        <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
          {row.uniprot_canonical_ac}
        </Link>
      </LineTooltip>
    )
  },
  {
    dataField: proteinStrings.gene_name.shortName,
    text: proteinStrings.gene_name.name,
    sort: true,
    headerStyle: HeaderwithsameStyle
  },

  {
    dataField: proteinStrings.protein_names.shortName,
    text: proteinStrings.protein_names.name,
    sort: true,
    headerStyle: HeaderwithsameStyle
  },
  {
    dataField: proteinStrings.hit_score.id,
    text: proteinStrings.hit_score.name,
    sort: true,
    headerStyle: HeaderwithsameStyle,
    formatter: (value, row) => (
      <>
        <HitScoreTooltip
          title={"Hit Score"}
          text={"Hit Score Formula"}
          formula={"0.1 + ∑ (Weight + 0.01 * Frequency)"}
          contributions={row.score_info.contributions.map(item => {
            return {
              c: proteinStrings.contributions[item.c]
                ? proteinStrings.contributions[item.c].name
                : item.c,
              w: item.w,
              f: item.f
            };
          })}
        />
        {row.hit_score}
      </>
    )
  },
  {
    dataField: proteinStrings.mass.shortName,
    text: proteinStrings.mass.name + " (Da)",
    sort: true,
    headerStyle: HeaderwithsameStyle
  },
  {
    dataField: proteinStrings.organism.shortName,
    text: proteinStrings.organism.name,
    sort: true,
    headerStyle: HeaderwithsameStyle
  },
  {
    dataField: proteinStrings.refSeq_name.shortName,
    text: proteinStrings.refSeq_name.name,
    sort: true,
    headerStyle: HeaderwithsameStyle
  },
  {
    dataField: proteinStrings.refseq_ac.shortName,
    text: proteinStrings.refseq_ac.name,
    sort: true,
    headerStyle: HeaderwithsameStyle
  }
];

/**
 * Gets JSON for protein search.
 * @param {object} formObject - protein search JSON query object.
 */
export const getProteinSearch = formObject => {
  var json = "query=" + JSON.stringify(formObject);
  const url = "/protein/search?" + json;
  return getJson(url);
};

/**
 * Gets JSON for protein simple search.
 * @param {object} formObject - protein simple search JSON query object.
 */
export const getProteinSimpleSearch = formObject => {
  var json = "query=" + JSON.stringify(formObject);
  const url = "/protein/search_simple?" + json;
  return getJson(url);
};

/**
 * Gets JSON for protein search init.
 */
export const getProteinInit = () => {
  const url = `/protein/search_init`;
  return getJson(url);
};

export const getIsoAlignment = (protienId, alignment) => {
  const queryParamString = JSON.stringify({
    uniprot_canonical_ac: protienId,
    cluster_type: alignment
  });
  const url = `/protein/alignment?query=${queryParamString}`;
  return getJson(url);
};

export const getHomoAlignment = (protienId, alignment) => {
  const queryParamString = JSON.stringify({
    uniprot_canonical_ac: protienId,
    cluster_type: alignment
  });
  const url = `/protein/alignment?query=${queryParamString}`;
  return getJson(url);
};
