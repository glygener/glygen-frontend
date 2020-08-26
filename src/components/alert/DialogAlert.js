import React from "react";
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import PropTypes from "prop-types";
import stringConstants from '../../data/json/stringConstants';
import routeConstants from '../../data/json/routeConstants';
import Button from 'react-bootstrap/Button';
import { Dialog } from "@material-ui/core";

export default function DialogAlert(props) {

    const getID = () => {
        let errorID = props.alertInput.id;
        if (errorID === undefined || errorID === null || errorID === "") {
            errorID = stringConstants.errors.defaultDialogAlert.id;
        }
        if (stringConstants.errors[errorID] === undefined) {
            errorID = stringConstants.errors.defaultDialogAlert.id;
        }

        return errorID;
    };

  return (
        <Dialog
            open={props.alertInput.show}
            classes= {{
                paper: "alert-dialog",
                root: "alert-dialog-root"
            }}
            disableScrollLock
            onClose={() => props.setOpen(false)} 
        >    
            <h5 className= "alert-dialog-title">{stringConstants.errors[getID()].title}</h5>
            <div className="alert-dialog-content">
                <div className="alert-dialog-content-text">
                    {stringConstants.errors[getID()].message}
                    {stringConstants.errors[getID()].showContactUs && <>{' '}{stringConstants.errors.contactUsMsg}{' '}
                        <Navbar.Text
                            as={Link}
                            to={routeConstants.contactUs}
                            style={{padding:0}}
                        >
                            contact us
                        </Navbar.Text>{'.'}</>}
                </div>
                <Button
                    className= "gg-btn-outline"
                    style={{ float: "right" }}
                    onClick={() => props.setOpen(false)}
                >
                    Ok
                </Button>
            </div>
        </Dialog>
  );
}

DialogAlert.propTypes = {
  alertInput: PropTypes.object,
  setOpen: PropTypes.func
};