import React from "react";
import PropTypes from "prop-types";
// import LoadingImage from "../../images/page_loading.gif";
import LoadingImage from "../../images/logo-loading-animated.svg";
import Fade from "@mui/material/Fade";
import { Row } from "react-bootstrap";

/**
 * Component to display loading image on card while data is being retrieved.
 **/
export default function CardLoader(props) {
  return (
    <Fade in={props.pageLoading}>
      <div className={"card-loader-overlay"}>
        <Row className={"card-loader-row"}>
          <img src={LoadingImage} alt="loadingImage" className={"card-loader-image"} />
        </Row>
      </div>
    </Fade>
  );
}

CardLoader.propTypes = {
  pageLoading: PropTypes.bool,
};
