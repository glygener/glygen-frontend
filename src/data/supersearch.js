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
  order = "desc",
  filters = []

) => {
  const queryParams = {
    id: superSearchListId,
    offset: offset,
    sort: sort,
    limit: limit,
    order: order,
    filters: filters
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
    maxRange,
    singleannotations,
    distance,
    operator,
    updownoperator,
    combinedPattern
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

  if (
    min ||
    max ||
    (aminoType && aminoType.length) ||
    (annotations && annotations.length) ||
    singleannotations ||
    distance ||
    combinedPattern
  ) {
    const siteQuery = {
      concept: "site",
      query: {
        aggregator: "$and",
        unaggregated_list: [],
        aggregated_list: []
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

    if (parseInt(distance) && operator && singleannotations && singleannotations.length){
      siteQuery.query.unaggregated_list.push({
        path: "neighbors.categories",
        order,
        operator: "$eq",
        string_value: singleannotations
      });
      order++;
    
      siteQuery.query.unaggregated_list.push({
        path: "neighbors.distance",
        order,
        operator: operator,
        numeric_value: parseInt(distance)
      });
      order++;
  }

    if (combinedPattern && combinedPattern.length && updownoperator) {
      siteQuery.query.unaggregated_list.push({
        path: updownoperator,
        order,
        operator: "$regex",
        string_value: combinedPattern
      });
      order++;
    }

    // Added in the bottom of site concept to handle or conditions.
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

export const createSiteQuerySummary = query => {
  let result = {};

  const processList = (result, listItem) => {
    if (listItem.path === "uniprot_ac") {
      if (!result.proteinId) {
        result.proteinId = [];
      }
      result.proteinId.push(listItem.string_value);
    } else if (listItem.path === "site_seq") {
      result.aminoType = listItem.string_value;
    } else if (
      [
        "glycosylation_flag",
        "snv_flag",
        "mutagenesis_flag",
        "phosphorylation_flag",
        "glycation_flag"
      ].includes(listItem.path)
    ) {
      if (!result.annotations) {
        result.annotations = [];
      }
      result.annotations.push(listItem.path);
    } else if (listItem.path === "start_pos") {
      result.min = listItem.numeric_value;
    } else if (listItem.path === "end_pos") {
      result.max = listItem.numeric_value;
    } else if (listItem.path === "neighbors.categories") {
      result.neighborsCat = listItem.string_value;
    } else if (listItem.path === "neighbors.distance") {
      result.neighborsDist = listItem.numeric_value;
      result.neighborsDistOper = listItem.operator;
    } else if (listItem.path === "down_seq" || listItem.path === "up_seq") {
      result.patternTerminal = listItem.path;
      result.patternPosition = listItem.string_value.split("|")[0];
      result.patternPeptide = listItem.string_value.split("|")[1];
    }
  };

  if (query.concept_query_list) {
    for (let querySection of query.concept_query_list) {
      if (
        querySection &&
        querySection.query.unaggregated_list &&
        querySection.query.unaggregated_list.length
      ) {
        for (let listItem of querySection.query.unaggregated_list) {
          // result = { ...result, ...processList(listItem) };
          processList(result, listItem);
        }

        if (result.annotations && result.annotations.length) {
          result.annotationOperation = querySection.query.aggregator;
        }
      }

      if (
        querySection &&
        querySection.query.aggregated_list &&
        querySection.query.aggregated_list.length
      ) {
        for (let aggregatedItem of querySection.query.aggregated_list) {
          for (let aggregatedItemUnaggregatedList of aggregatedItem.unaggregated_list) {
            processList(result, aggregatedItemUnaggregatedList);
          }
        }

        if (result.annotations && result.annotations.length) {
          result.annotationOperation =
            querySection.query.aggregated_list[0].aggregator;
        }
      }
    }
  }

  return result;
};
