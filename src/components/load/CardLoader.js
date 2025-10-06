import React from "react";
import PropTypes from "prop-types";
import styles from "../../css/loadImageSVG.css";
// import LoadingImage from "../../images/page_loading.gif";
import { ReactComponent as LoadingImage } from "../../images/logo-loading-animated.svg";
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
          <div className={styles.container}>
            <LoadingImage className={"card-loader-image"} />
          </div>
        </Row>
      </div>
    </Fade>
  );
}

CardLoader.propTypes = {
  pageLoading: PropTypes.bool,
};
