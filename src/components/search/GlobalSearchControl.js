import React, { useState } from "react";
import { useHistory } from "react-router";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import PropTypes from "prop-types";
import { logActivity } from "../../data/logging";
import routeConstants from "../../data/json/routeConstants";
import "../../css/globalSearch.css";

/**
 * Global search control.
 **/
export default function GlobalSearchControl(props) {
  let history = useHistory();
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

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
    event.preventDefault();
    logActivity("user", globalSearchTerm, "Performing Global Search").finally(() => {
      window.location = routeConstants.globalSearchResult + encodeURIComponent(globalSearchTerm.substring(0, 100));
    });    
  };

  return (
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
  );
}

GlobalSearchControl.propTypes = {
  globalSearchTermChange: PropTypes.func,
};
