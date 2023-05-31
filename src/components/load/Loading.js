import React from "react";
import "./Loading.css";
import PropTypes from "prop-types";
// import { usePromiseTracker } from "react-promise-tracker";
import LoadingImage from "../../images/page_loading.gif";
// import LoadingImage from "../../images/logo-loading-animated.svg";
import Button from "react-bootstrap/Button";

const Loading = props => {
  // const { promiseInProgress } = usePromiseTracker();

  return props.show ? (
    <>
      <div
        className={"download-spinner"}
        // style={{ marginLeft: props.show ? "14%" : "" }}
      >
      <Button className="gg-btn-outline-reg">
          <img src={LoadingImage} alt="loadingImage" className={"download-spinner-image"} />
        </Button>
      </div>
    </>
  ) : (
    ""
  );
};

Loading.propTypes = {
  show: PropTypes.bool
};

export { Loading };
