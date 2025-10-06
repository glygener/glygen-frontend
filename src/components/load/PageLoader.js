import React from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
// import LoadingImage from "../../images/page_loading.gif";
import styles from "../../css/loadImageSVG.css";
import { ReactComponent as LoadingImage } from "../../images/logo-loading-animated.svg";

/**
 * Component to display loading image on page while data is being retrieved.
 **/
export default function PageLoader(props) {
  return (
    <div>
      <Backdrop className={"page-loader-backdrop"} open={props.pageLoading}>
        <div className={styles.container}>
          <LoadingImage className={"page-loader-image"} />
        </div>
      </Backdrop>
    </div>
  );
}

PageLoader.propTypes = {
  pageLoading: PropTypes.bool,
};
