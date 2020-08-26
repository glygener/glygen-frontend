import React from "react";
import PropTypes from "prop-types";
import { Alert, AlertTitle } from '@material-ui/lab';
import stringConstants from '../../data/json/stringConstants';

export default function TextAlert(props) {

  const getValue = (input) => {
    let errorID = props.alertInput.id;
    if (errorID === undefined || errorID === null || errorID === "") {
        errorID = stringConstants.errors.defaultTextAlert.id;
    }
    if (stringConstants.errors[errorID] === undefined) {
        errorID = stringConstants.errors.defaultTextAlert.id;
    }

    if (input === "title")
        return stringConstants.errors[errorID].title;
    else if (input === "message")
        return stringConstants.errors[errorID].message;    
  };

  return (
    <>
    {props.alertInput.show && <div>
      <Alert severity="error">
         <AlertTitle>{getValue("title")}</AlertTitle>
            {getValue("message")}
        </Alert>
    </div>}
    </>

  );
}

TextAlert.propTypes = {
  alertInput: PropTypes.object
};
