import React, { useState } from "react";
// import { useHistory } from "react-router";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import PropTypes from "prop-types";
import { logActivity } from "../../data/logging";
import routeConstants from "../../data/json/routeConstants";
import PageLoader from "../load/PageLoader";
import "../../css/globalSearch.css";

/**
 * Global search control.
 **/
export default function GlobalSearchControl(props) {
  // let history = useHistory();
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const [pageLoading, setPageLoading] = useState(false);

  /**
   * Function to set global search term.
   * @param {string} searchTerm - global search term.
   **/
  // function globalSearchTermChange(searchTerm) {
  //     setGlobalSearchTerm(searchTerm);
  // }

  /**
   * Function to handle global search term onchange event.
   * @param {object} event - event object.
   **/
  const globalSearchTermOnChange = (event) => {
    setGlobalSearchTerm(event.target.value);
  };

  /**
   * Function to handle global search event.
   * @param {object} event - event object.
   **/
  const globalSearchStart = (event) => {
    setPageLoading(true);
    event.preventDefault();
    logActivity("user", globalSearchTerm, "Performing Global Search").finally(() => {
      setPageLoading(false);
      window.location = routeConstants.globalSearchResult + encodeURIComponent(globalSearchTerm);
    });    
  };

  return (
    <>
      <PageLoader pageLoading={pageLoading} />
      <Paper component="form" onSubmit={globalSearchStart} className={"gs-comp-paper"}>
        <InputBase
          value={globalSearchTerm}
          required
          onChange={globalSearchTermOnChange}
          className={"gs-input"}
          placeholder="Search..."
          inputProps={{ "aria-label": "search" }}
        />
        <Divider className={"gs-divider"} orientation="vertical" />
        <IconButton
          disabled={globalSearchTerm.length < 1}
          onClick={globalSearchStart}
          className="gs-icon-button"
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </>
  );
}

GlobalSearchControl.propTypes = {
  globalSearchTermChange: PropTypes.func,
};
