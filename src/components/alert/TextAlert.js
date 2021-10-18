import React from "react";
import PropTypes from "prop-types";
import { Alert, AlertTitle } from '@material-ui/lab';
import stringConstants from '../../data/json/stringConstants';

/**
 * Text alert component to show error messages.
 */
export default function TextAlert(props) {

  /**
	 * getValue returns error id to display.
	 **/
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
        return props.alertInput.message || stringConstants.errors[errorID].message;    
  };

  return (
    <>
    {props.alertInput.show && <div>
      <Alert severity="error">
         <AlertTitle>{getValue("title")}</AlertTitle>
            <span className="alert-text">
              {getValue("message")}
            </span>            
        </Alert>
    </div>}
    </>

  );
}

TextAlert.propTypes = {
  alertInput: PropTypes.object
};
