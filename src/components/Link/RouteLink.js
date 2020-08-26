import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import LineTooltip from "../tooltip/LineTooltip";
import "../../css/Search.css";

export default function RouteLink(props) {
  return (
    <>
      {props.disabled ? (
        <div>
          <span
            className={
              "head-result-count route-lnk-disabled route-lnk-disabled-bkg"
            }
          >
            {props.text1}
          </span>{" "}
          <span className={"route-lnk-disabled route-lnk-disabled-clr"}>
            {props.text2}
          </span>
        </div>
      ) : (
        <LineTooltip text="Click to see list page.">
          <Link to={props.link}>
            <span className={"head-result-count route-lnk"}>{props.text1}</span>{" "}
            <span className={"route-lnk"}>{props.text2}</span>
          </Link>
        </LineTooltip>
      )}
    </>
  );
}

RouteLink.propTypes = {
  text: PropTypes.string,
  link: PropTypes.string,
  disabled: PropTypes.bool,
};
