import { getJson, postToAndGetBlob, glycanImageUrl } from "./api";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import routeConstants from "./json/routeConstants";
import LineTooltip from "../components/tooltip/LineTooltip";
import stringConstants from "./json/stringConstants";
import { logActivity } from "../data/logging";
import { Link } from "react-router-dom";

const glycanStrings = stringConstants.glycan.common;

export const getGlycanList = (
  glycanListId,
  offset = 1,
  limit = 20,
  sort = "hit_score",
  order = "desc"
) => {
  const queryParams = {
    id: glycanListId,
    offset: offset,
    sort: sort,
    limit: limit,
    order: order
  };
  const queryParamString = JSON.stringify(queryParams);
  const url = `/glycan/list?query=${queryParamString}`;
  return getJson(url);
};

export const getGlycanDownload = (id, format, compressed, type, headers) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, type, format, compressed };
  const url = `/data/download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};

export const getGlycanDetail = accessionId => {
  const url = `/glycan/detail/${accessionId}`;
  return getJson(url);
};

const headerSortingClasses = (column, sortOrder, isLastSorting, colIndex) =>
  sortOrder === "asc" ? "demo-sorting-asc" : "demo-sorting-desc";
export const GLYCAN_COLUMNS = [
  {
    dataField: glycanStrings.glycan_id.id,
    text: glycanStrings.glycan_id.shortName,
    sort: true,
    selected: true,
    headerStyle: (colum, colIndex) => {
      return {
        backgroundColor: "#4B85B6",
        color: "white",
        width: "15% !important"
      };
    },

    formatter: (value, row) => (
      <LineTooltip text="View details">
        <Link to={routeConstants.glycanDetail + row.glytoucan_ac}>
          {row.glytoucan_ac}
        </Link>
      </LineTooltip>
    )
  },
  {
    text: glycanStrings.glycan_image.name,
    sort: false,
    selected: true,
    formatter: (value, row) => (
      <div className="img-wrapper">
        <img
          className="img-cartoon"
          src={getGlycanImageUrl(row.glytoucan_ac)}
          alt="Glycan img"
        />
      </div>
    ),
    headerStyle: (colum, colIndex) => {
      return {
        width: "30%",
        textAlign: "left",
        backgroundColor: "#4B85B6",
        color: "white",
        whiteSpace: "nowrap"
      };
    }
  },
  {
    dataField: "hit_score",
    text: "Hit Score",
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    }
  },
  {
    dataField: glycanStrings.mass.id,
    text: glycanStrings.mass.shortName,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    selected: true
  },

  {
    dataField: "mass_pme",
    text: glycanStrings.mass_pme.shortName,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    formatter: value => (value ? value : "N/A")
  },
  {
    dataField: glycanStrings.number_monosaccharides.id,
    text: glycanStrings.number_monosaccharides.shortName,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    formatter: value => (value ? value : "N/A")
  },
  {
    dataField: glycanStrings.number_proteins.id,
    text: glycanStrings.number_proteins.shortName,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    formatter: value => (value ? value : " ")
  },
  {
    dataField: glycanStrings.number_enzymes.id,
    text: glycanStrings.number_enzymes.shortName,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    formatter: value => (value ? value : " ")
  }
];

const glycanColumnsStorageKey = "glycan-columns";

export const getUserSelectedColumns = () => {
  if (localStorage.getItem(glycanColumnsStorageKey) === null) {
    const defaultSelectedCols = GLYCAN_COLUMNS.filter(col => col.selected).map(
      col => col.text
    );
    localStorage.setItem(glycanColumnsStorageKey, defaultSelectedCols);
    return defaultSelectedCols;
  }

  let selectedFields = [];

  try {
    const parsedValue = localStorage.getItem(glycanColumnsStorageKey);

    if (parsedValue && parsedValue.length) {
      selectedFields = parsedValue;
    }
  } catch (err) {
    selectedFields = [];
  }

  return selectedFields;
};

export const setUserSelectedColumns = arr => {
  localStorage.setItem(glycanColumnsStorageKey, arr);
};

/**
 * Gets JSON for glycan search.
 * @param {object} formObject - glycan search JSON query object.
 */
export const getGlycanSearch = formObject => {
  var json = "query=" + JSON.stringify(formObject);
  const url = "/glycan/search?" + json;
  return getJson(url);
};

/**
 * Gets JSON for glycan simple search.
 * @param {object} formObject - glycan simple search JSON query object.
 */
export const getGlycanSimpleSearch = formObject => {
  var json = "query=" + JSON.stringify(formObject);
  const url = "/glycan/search_simple?" + json;
  return getJson(url);
};

/**
 * Gets JSON for glycan search init.
 */
export const getGlycanInit = () => {
  const url = `/glycan/search_init`;
  return getJson(url);
};

export const getGlycanImageUrl = glytoucan_id => {
  return glycanImageUrl + glytoucan_id;
};
