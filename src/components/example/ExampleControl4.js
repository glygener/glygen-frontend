import React from "react";
import PropTypes from "prop-types";
import LineTooltip from "../tooltip/LineTooltip";
import Button from "react-bootstrap/Button";

/**
 * Component to show examples under input component like search control.
 **/
const ExampleControl = props => {
  return (
    <div
    // className={ "small-text" }
    >
      Example(s):{" "}
      {props.exampleMap &&
        props.exampleMap &&
        props.exampleMap.map((obj, index, arr) => (
          <span key={obj.name}>
            <LineTooltip text="Click to insert example.">
              <Button
                className={"lnk-btn"}
                variant="link"
                onClick={() => {
                  props.setInputValue(obj.key);
                }}
              >
                {obj.name}
              </Button>
            </LineTooltip>
            {arr.length === index + 1 ? "" : ", "}
          </span>
        ))}
    </div>
  );
};

export default ExampleControl;

ExampleControl.propTypes = {
  exampleMap: PropTypes.object,
  setInputValue: PropTypes.func
};
