import { getJson, postToAndGetBlob, glycanImageUrl } from "./api";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import routeConstants from "./json/routeConstants";
import LineTooltip from "../components/tooltip/LineTooltip";
import stringConstants from "./json/stringConstants";
import { logActivity } from "../data/logging";
import { Link } from "react-router-dom";
import { Col } from "react-bootstrap";

const glycanStrings = stringConstants.glycan.common;
const motifStrings = stringConstants.motif.common;

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

export const MOTIF_LIST_COLUMNS = [
  {
    dataField: "motif_ac",
    text: glycanStrings.glycan_image.name,
    sort: false,
    selected: true,
    formatter: (value, row) => (
      <div className="img-wrapper">
        <img className="img-cartoon" src={getGlycanImageUrl(row.motif_ac)} alt="Glycan img" />
      </div>
    ),
    headerStyle: (colum, colIndex) => {
      return {
        // width: "20%",
        whiteSpace: "nowrap",
      };
    },
  },
  {
    dataField: "motif_ac",
    text: motifStrings.motif_id.name,
    sort: true,
    selected: true,
    headerStyle: () => {
      return { width: "20%" };
    },
    formatter: (value, row) => (
      <LineTooltip text="View details">
        <Link to={routeConstants.motifDetail + row.motif_ac}>{row.motif_ac}</Link>
      </LineTooltip>
    ),
  },
  {
    dataField: "motif_name",
    text: motifStrings.motif_name.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: "20%" };
    },
    formatter: (value, row) => (
      <LineTooltip text="View details">
        <Link to={routeConstants.motifDetail + row.motif_ac}>{row.motif_name}</Link>
      </LineTooltip>
    ),
  },
  {
    dataField: "synonyms",
    text: motifStrings.motif_synonym.synonym,
    sort: false,
    headerStyle: (colum, colIndex) => {
      return { width: "20%" };
    },
    formatter: (value, row) => (
      <>
        {value.map((synonyms) => (
          <Col className="nowrap pl-0">
            <LineTooltip text="View details">
              <Link to={routeConstants.motifDetail + row.motif_ac}>{synonyms}</Link>
            </LineTooltip>
          </Col>
        ))}
      </>
    ),
  },
  {
    dataField: "glycan_count",
    text: motifStrings.glycan_count.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: "20%" };
    },
    formatter: (value, row) => (
      <LineTooltip text="View details">
        <Link to={routeConstants.motifDetail + row.motif_ac}>{row.glycan_count}</Link>
      </LineTooltip>
    ),
  },
  // {
  // 	dataField: "glytoucan_ac",
  // 	text: "GlyTouCan Accession",
  // 	sort: true,
  // 	headerStyle: (colum, colIndex) => {
  // 		return { backgroundColor: "#4B85B6", color: "white" };
  // 	},
  // 	formatter: (value, row) => (
  // 		<LineTooltip text="View glycan details">
  // 			<Link to={routeConstants.glycanDetail + row.glytoucan_ac}>
  // 				{row.glytoucan_ac}
  // 			</Link>
  // 		</LineTooltip>
  // 	),
  // },
];
export const MOTIF_COLUMNS = [
  {
    dataField: glycanStrings.glycan_id.id,
    text: glycanStrings.glycan_id.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    formatter: (value, row) => (
      <LineTooltip text="View glycan details">
        <Link to={routeConstants.glycanDetail + row.glytoucan_ac}>{row.glytoucan_ac}</Link>
      </LineTooltip>
    ),
  },
  {
    text: glycanStrings.glycan_image.name,
    sort: false,
    selected: true,
    formatter: (value, row) => (
      <div className="img-wrapper">
        <img className="img-cartoon" src={getGlycanImageUrl(row.glytoucan_ac)} alt="Glycan img" />
      </div>
    ),
    headerStyle: (colum, colIndex) => {
      return {
        textAlign: "left",
        backgroundColor: "#4B85B6",
        color: "white",
        whiteSpace: "nowrap",
      };
    },
  },
];
