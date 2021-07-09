import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import { Dialog } from "@material-ui/core";

/**
 * Dialog alert component to ask user permission.
 */
export default function UserPermission(props) {
  return (
    <Dialog
      open={props.userPermission}
      classes={{
        paper: "alert-dialog",
        root: "alert-dialog-root",
      }}
      disableScrollLock
      onClose={() => props.setOpen(false)}
    >
      <h5 className="alert-dialog-title">{props.title}</h5>
      <div className="alert-dialog-content">
        <div className="alert-dialog-content-text">{props.message}</div>
        <Button
          className="gg-btn-outline"
          style={{ float: "right" }}
          onClick={() => props.setOpen(true)}
        >
          Ok
        </Button>
        <Button
          className="gg-btn-outline mr-3"
          style={{ float: "right" }}
          onClick={() => props.setOpen(false)}
        >
          Cancel
        </Button>
      </div>
    </Dialog>
  );
}

UserPermission.propTypes = {
  message: PropTypes.string,
  title: PropTypes.string,
  userPermission: PropTypes.bool,
  setOpen: PropTypes.func,
};
