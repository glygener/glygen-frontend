import React from "react";
import PropTypes from 'prop-types';
import Backdrop from "@material-ui/core/Backdrop";
import LoadingImage from "../../images/page_loading.gif";

export default function PageLoader(props) {

  return (
    <div>
      <Backdrop className={"page-loader-backdrop"} open={props.pageLoading}>
        <img src={LoadingImage} alt="loadingImage" className={"page-loader-image"} />
      </Backdrop>
    </div>
  );
}

PageLoader.propTypes = {
	pageLoading: PropTypes.bool,
};