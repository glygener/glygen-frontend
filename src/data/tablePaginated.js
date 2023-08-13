import { getJson, postFormDataTo1, postTo } from "./api";

import { Link } from "react-router-dom";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import routeConstants from "./json/routeConstants";
import stringConstants from "./json/stringConstants";
import LineTooltip from "../components/tooltip/LineTooltip";
import HitScoreTooltip from "../components/tooltip/HitScoreTooltip";
import { logActivity } from "./logging";
// import { positions } from "@material-ui/system";

const proteinStrings = stringConstants.protein.common;

export const getTableList = (
  record_type,
  table_id,
  record_id,
  offset = 1,
  limit = 20,
  sort = "hit_score",
  order = "desc",
) => {
  const queryParams = {
    record_type:record_type,
    table_id:table_id,
    record_id: record_id,
    offset: offset,
    limit: limit,
    order: order,
    sort: sort,
  };
  const queryParamString = JSON.stringify(queryParams);
  // const url = `/pagination/page/?query=${queryParamString}`;
     const url = `pagination/page/`;
     const myHeaders = {
      "Content-Type": "application/json",
    };
  return postFormDataTo1(url, queryParamString, myHeaders);
};

