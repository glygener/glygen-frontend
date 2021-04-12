import { getJson } from "./api";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import routeConstants from "./json/routeConstants";
import LineTooltip from "../components/tooltip/LineTooltip";
import stringConstants from "./json/stringConstants";
import { Link } from "react-router-dom";
const proteinStrings = stringConstants.protein.common;

/**
 * Gets JSON for super search list.
 * @param {string} superSearchListId - list id.
 * @param {number} offset - offset value.
 * @param {number} limit - limit value.
 * @param {string} sort - sort field.
 * @param {string} order - order value - asc/desc.
 */
export const getSuperSearchList = (
  superSearchListId,
  offset = 1,
  limit = 20,
  sort = "hit_score",
  order = "desc"
) => {
  const queryParams = {
    id: superSearchListId,
    offset: offset,
    sort: sort,
    limit: limit,
    order: order
  };
  const queryParamString = JSON.stringify(queryParams);
  const url = `/supersearch/list?query=${queryParamString}`;
  return getJson(url);
};

/**
 * Gets JSON for super search init.
 */
export const getSuperSearchInit = () => {
  const url = `/supersearch/search_init?query={}`;
  return getJson(url);
};

/**
 * Gets JSON for super search init.
 */
export const getSiteSearchInit = () => {
  const url = `/site/search_init?query={}`;
  return getJson(url);
};

/**
 * Gets JSON for super search.
 * @param {object} formObject - super search JSON query object.
 */
export const getSuperSearch = formObject => {
  var json = "query=" + JSON.stringify(formObject);
  const url = "/supersearch/search?" + json;
  return getJson(url);
};

const constructSiteSearchObject = queryObject => {
  const {
    proteinId,
    aminoType,
    annotationOperation,
    annotations,
    position,
    minRange,
    maxRange
  } = queryObject;

  let min = minRange || position || maxRange;
  let max = maxRange || position || minRange;

  const formObject = [];

  if (proteinId && proteinId.length) {
    formObject.push({
      concept: "protein",
      query: {
        aggregator: "$and",
        aggregated_list: [],
        unaggregated_list: proteinId.map((protein, index) => ({
          path: "uniprot_ac",
          order: index,
          operator: "$eq",
          string_value: []
        }))
      }
    });
  }

  if (min || max || (aminoType && aminoType.length) || (annotations && annotations.length)) {
    const siteQuery = {
      concept: "site",
      query: {
        aggregator: "$and",
        aggregated_list: [],
        unaggregated_list: []
      }
    };
    let order = 0;

    if (aminoType && aminoType.length) {
      siteQuery.query.unaggregated_list.push({
        path: "site_seq",
        order,
        operator: "$eq",
        string_value: aminoType
      });
      order++;
    }


    if (min || max) {
      siteQuery.query.unaggregated_list.push({
        path: "start_pos",
        order,
        operator: "$gte",
        numeric_value: parseInt(min)
      });

      order++;

      siteQuery.query.unaggregated_list.push({
        path: "end_pos",
        order,
        operator: "$lte",
        numeric_value: parseInt(max)
      });

      order++;
    }

    if (annotations && annotations.length) {
      let targetList = siteQuery.query.unaggregated_list;
      if (annotationOperation === "$or" && annotations.length > 1) {
        const aggregator = {
          aggregator: "$or",
          aggregated_list: [],
          unaggregated_list: []
        };

        for (let annotation of annotations) {
          aggregator.unaggregated_list.push({
            path: annotation,
            order,
            operator: "$eq",
            string_value: "true"
          });
          order++;
        }

        if (siteQuery.query.unaggregated_list.length > 0) {
          siteQuery.query.aggregated_list.push(aggregator);
        } else {
          siteQuery.query = aggregator;
        }
      } else {
        for (let annotation of annotations) {
          targetList.push({
            path: annotation,
            order,
            operator: "$eq",
            string_value: "true"
          });
          order++;
        }
      }
    }

    formObject.push(siteQuery);
  }

  return {
    concept_query_list: formObject
  };
};

export const getSiteSearch = async queryObject => {
  const formObject = constructSiteSearchObject(queryObject);
  return getSuperSearch(formObject);
};

const yesNoFormater = (value, row) => {
  return value && value.length ? "YES" : "NO";
};

export const SITE_COLUMNS = [
  {
    dataField: proteinStrings.shortName,
    text: proteinStrings.uniprot_accession.name,
    sort: true,
    selected: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },

    formatter: (value, row) => (
      <LineTooltip text="View details">
        <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
          {row.uniprot_canonical_ac}
        </Link>
      </LineTooltip>
    )
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
    dataField: "start_pos",
    text: "Start Pos",
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    }
  },
  {
    dataField: "end_pos",
    text: "End Pos",
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    }
  },
  {
    dataField: "snv",
    text: "SNV",
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    formatter: yesNoFormater
  },
  {
    dataField: "glycosylation",
    text: "Glycosylation",
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    formatter: yesNoFormater
  },
  {
    dataField: "mutagenesis",
    text: "Mutagenesis",
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    formatter: yesNoFormater
  },
  {
    dataField: "glycation",
    text: "Glycation",
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    formatter: yesNoFormater
  },
  {
    dataField: "phosphorylation",
    text: "Phosphorylation",
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    formatter: yesNoFormater
  }
];

export const createSiteQuerySummary = query => {
  let result = {};
  let start;
  let end;

  if (query.concept_query_list) {
    for (let querySection of query.concept_query_list) {
      if (querySection && querySection.query.unaggregated_list) {
        for (let listItem of querySection.query.unaggregated_list) {
          if (listItem.path === "uniprot_ac") {
            if (!result.proteinId) {
              result.proteinId = [];
            }
            result.proteinId.push(listItem.string_value);
          } else if (listItem.path === "site_seq") {
            result.aminoType = listItem.string_value;
          } else if (
            ["glycosylation_flag", "snv_flag", "mutagenesis_flag"].includes(
              listItem.path
            )
          ) {
            if (!result.annotations) {
              result.annotations = [];
            }
            result.annotations.push(listItem.path);

            result.annotationOperation = querySection.query.aggregator;
          } else if (listItem.path === "start_pos") {
            start = listItem.numeric_value;
          } else if (listItem.path === "end_pos") {
            end = listItem.numeric_value;
          }
        }
      }
    }
  }

  if (start && end) {
    // if (start === end) {
    //   result.position = start;
    // }

    result.min = start;
    result.max = end;
  }

  return result;
};
