import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import { Dialog } from "@mui/material";
import { Checkbox } from "@mui/material";
import { withStyles } from "@mui/styles";
const BlueCheckbox = withStyles({
  root: {
    color: "#979797",
    "&$checked": {
      color: "#2f78b7"
    }
  },
  checked: {}
})(props => <Checkbox color="default" {...props} />);

/**
 * Dialog alert component to ask user permission.
 */
export default function UserPermissionExternalLink(props) {
  const ExternalLinkKey = "external-link-dialog";
  const [selection, setSelection] = useState(false);

  const handleOptionChange = event => {
    const { checked } = event.target;
    setSelection(checked);
  };

  const navigateAndClose = (updateFlag) => { 
    if (updateFlag) {
      if (selection) {
        localStorage.setItem(ExternalLinkKey, "dontshow");
      } else {
        localStorage.setItem(ExternalLinkKey, "show");
      }
    }
    props.setUrl(); 
    setSelection(false);
    props.setOpenDialog(false); 
    window.open(props.url, "_blank", "noopener,noreferrer");
  }

    /**
     * useEffect for displaying message based on user response.
     */
    useEffect(() => {

    if (typeof Storage !== "undefined") {
      if (!localStorage.getItem(ExternalLinkKey)) {
          localStorage.setItem(ExternalLinkKey, "show");
          setSelection(false);
      } else {
          let keyValue = localStorage.getItem(ExternalLinkKey)
          if (keyValue === "dontshow"){
            navigateAndClose();
          } else {
            setSelection(false);
          }
      }
    } else {
      navigateAndClose();
    }
      
    }, []);

  return (
    <Dialog
      open={props.openDialog}
      classes={{
        paper: "alert-dialog",
        root: "alert-dialog-root",
      }}
      disableScrollLock
      onClose={() => { props.setOpenDialog(false); props.setUrl() }}
    >
      <h5 className="alert-dialog-title">{"Warning: External Link"}</h5>
      <div className="alert-dialog-content">
        <div className="alert-dialog-content-text">{"You are about to leave GlyGen and go to an external resource."}</div>
        <div className="alert-dialog-content-text">
         <BlueCheckbox
            checked={selection}
            onChange={handleOptionChange}
            size="small"
            className="pt-1 pb-1"
          />
          {"Don't show this message again."}
        </div>
        <Button
          className="gg-btn-outline"
          style={{ float: "right" }}
          onClick={() => navigateAndClose(true)}
        >
          Ok
        </Button>
        <Button
          className="gg-btn-outline me-3"
          style={{ float: "right" }}
          onClick={() => { props.setOpenDialog(false); props.setUrl(); setSelection(false); }}
        >
          Cancel
        </Button>
      </div>
    </Dialog>
  );
}

UserPermissionExternalLink.propTypes = {
  message: PropTypes.string,
  title: PropTypes.string,
  userPermission: PropTypes.bool,
  setOpen: PropTypes.func,
};
