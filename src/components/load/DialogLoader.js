import React from "react";
import PropTypes from "prop-types";
// import LoadingImage from "../../images/page_loading.gif";
import LoadingImageBlack from "../../images/logo-loading-animated-black.svg";
import { Row } from "react-bootstrap";
import { Dialog } from "@mui/material";
import Button from 'react-bootstrap/Button';


/**
 * Component to display loading image on dialog while data is being retrieved.
 **/
export default function DialogLoader(props) {
  return (
      <Dialog
      open={props.show}
      maxWidth={'lg'}
      classes= {{
          paper: "alert-dialog",
      }}
      style={{margin:40}}
      disableScrollLock
      onClose={(event, reason) => {
        if (reason !== "backdropClick")
          props.setOpen(false);
      }} 
      disableEscapeKeyDown={true}
    >  
      <div style={{overflow: 'hidden'}}>
        <h5 className= "sups-dialog-title">{props.title}</h5>
        <div className='m-3' style={{overflow: 'hidden', textAlign:'center'}}>  
            <h5>{"Waiting for job to complete."}</h5>
        </div>
        <div className='m-3' style={{overflow: 'hidden' ,content:'center', height: '120px', width: '600px', opacity: '0.3'}}>    
          <Row className={"dialog-loader-row"}>
            <img src={LoadingImageBlack} alt="loadingImage" className={"dialog-loader-image"} />
          </Row>
        </div>
        <div style={{ marginTop: "20px", marginRight: "50px" }}>
          <Button
              className='gg-btn-outline mr-3 mb-5'
              style={{ float: "right" }}
              onClick={() => props.setOpen(false)}
              >
              Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

DialogLoader.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
};

