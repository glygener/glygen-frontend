import { getJson, postToAndGetBlob, glycanImageUrl } from "./api";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import routeConstants from "./json/routeConstants";
import LineTooltip from "../components/tooltip/LineTooltip";
import HitScoreTooltip from "../components/tooltip/HitScoreTooltip";
import stringConstants from "./json/stringConstants";
import { logActivity } from "./logging";
import { Link } from "react-router-dom";
import axios from "axios";


export const getOutreachData = (
) => {
  const url = '/outreach/list/';
  return getJson(url);
};
