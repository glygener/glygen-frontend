import React from "react";
import { ReactComponent as SearchIcon } from "../../images/icons/search.svg";
import LineTooltip from "../tooltip/LineTooltip";
import Button from "react-bootstrap/Button";
import GlycanDirectQueries from "../../data/glycanDirectQueries";
import ProteinDirectQueries from "../../data/proteinDirectQueries";
import SuperSearchDirectQueries from "../../data/superSearchDirectQueries";

/**
 * Direct search component for executing direct search queries.
 */
const DirectSearch = (props) => {
  /**
   * Direct search class for creating glycan/protein direct search queries.
   */
  class DirectQueries {
    /**
     * Constructor for direct search query object.
     **/
    constructor(searchType, executeSearch) {
      if (searchType === "glycan") {
        this.dq = new GlycanDirectQueries();
      }

      if (searchType === "protein") {
        this.dq = new ProteinDirectQueries();
      }

      if (searchType === "superSearch") {
        this.dq = new SuperSearchDirectQueries();
      }

      this.executeSearch = executeSearch;
    }

    /**
     * Function to execute glycan/protein direct search queries.
     * @param {var} fieldType - input field type.
     * @param {var} fieldValue - input field value.
     * @param {var} nodeType - node type.
     * @param {var} operator - input field operator.
     * @param {var} fieldPath - input field path.
     **/
    execute(fieldType, fieldValue, nodeType, operator, fieldPath) {
      let json = this.dq.getJson(fieldType, fieldValue, nodeType, operator, fieldPath);
      console.log(JSON.stringify(json));
      this.executeSearch(json, props.navigateTo);
    }
  }

  return (
    <>
      <LineTooltip text={props.text}>
        <Button
          className={"search-btn"}
          variant="link"
          onClick={() => {
            let dq = new DirectQueries(props.searchType, props.executeSearch);
            // dq.execute(props.fieldType, props.fieldValue);

            dq.execute(props.fieldType, props.fieldValue, props.nodeType, props.operator, props.fieldPath)
          }}
        >
          <SearchIcon title className="ml-1 mr-1 custom-icon-blue gg-align-top" />
        </Button>
      </LineTooltip>
    </>
  );
};

export default DirectSearch;
