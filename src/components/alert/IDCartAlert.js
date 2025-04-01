import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from 'react-bootstrap/Button';
import { Dialog } from "@mui/material";
import { postTo } from "../../data/api";
import { replaceSpecialCharacters } from "../../utils/common";
import { axiosError } from "../../data/axiosError";
import { logActivity, getUserID } from "../../data/logging";

/**
 * Dialog alert component to show error messages.
 */
export default function IDCartAlert(props) {

    const [contactUsResponseMessage, setContactUsResponseMessage] = useState("");
    const [contactUsErrorMessage, setContactUsErrorMessage] = useState("");
    
    /**
     * useEffect for retriving data from api and showing page loading effects.
     */
    useEffect(() => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
    document.addEventListener("click", () => {
        setContactUsResponseMessage("");
        setContactUsErrorMessage("");
    });
    setContactUsResponseMessage("");
    setContactUsErrorMessage("");

    }, []);
    
    const handleSubmit = (e) => {
        props.setPageLoading(true);
        e.preventDefault();
        setContactUsResponseMessage("");
        setContactUsErrorMessage("");
        let message =  JSON.stringify({"error": props.idCartErrorDialogInput.error, "searchQuery":  props.idCartErrorDialogInput.searchQuery,
        "columns":  props.idCartErrorDialogInput.columns, "applied_filters":  props.idCartErrorDialogInput.applied_filters,
        "list_id": props.idCartErrorDialogInput.list_id, "list_cache_id": props.idCartErrorDialogInput.list_cache_id});

        const formData = {
            user: getUserID(),
            subject: "List name: " + props.idCartErrorDialogInput.name + ", queryType: " + props.idCartErrorDialogInput.queryType + " error",
            message: escape(replaceSpecialCharacters(message)),
        };
        const url = `/auth/notify?query=${JSON.stringify(formData)}`;
        const myHeaders = {
            "Content-Type": "application/x-www-form-urlencoded",
        };
        postTo(url, myHeaders)
            .then((response) => {
            logActivity("user", "", "Message sent from contact us page.");
            setContactUsResponseMessage("We have received your message.");
            props.setPageLoading(false);
            })
            .catch((error) => {
            setContactUsErrorMessage(
                "Oops, something went wrong! We did not receive your message. Please try again later."
            );
            axiosError(error, "", "Contact us api call.", props.setPageLoading);
            });
    
    };

  return (
    <Dialog
        open={props.idCartErrorDialogInput.show}
        classes= {{
            paper: "alert-dialog"
        }}
        style={{margin:40}}
        disableScrollLock
        onClose={() => props.setOpen(false)} 
    >    
        <div id="contents" class = "gf-content-div">
            <h5 className= "alert-dialog-title" style={{minWidth: '500px' }}>{"Job Error"}</h5>
            <div clas1sName="alert-dialog-content"
                style={{padding:40, content:'center'}}
            >
                <div>
                    List Name: {props.idCartErrorDialogInput.name}
                </div>
                <div>
                    Message: {props.idCartErrorDialogInput.message}
                </div>

                <div style={{paddingTop:20, paddingBottom:20}}>
                <div>
                    Please find the error below,
                </div>
                {props.idCartErrorDialogInput.error && <ul>
                    <span>
                    {props.idCartErrorDialogInput.error.error_list && (
                        props.idCartErrorDialogInput.error.error_list.map((repID) =>
                        <li>
                            {repID.error_code} 
                        </li>
                        )
                    )}
                    </span>
                </ul>}
                </div>
                <div style={{paddingBottom:"40px"}}>
                    <div style={{paddingBottom:"20px"}}>
                        <div className={`alert-success ${contactUsResponseMessage ? "alert" : ""}`}>
                            <strong>{contactUsResponseMessage}</strong>
                        </div>
                        <div className={`alert-danger ${contactUsErrorMessage ? "alert" : ""}`}>
                            <strong>{contactUsErrorMessage}</strong>
                        </div>
                    </div>

                    <span className="text-right">
                        <Button
                            className= "gg-btn-outline"
                            style={{marginLeft: "20px", float: "right" }}
                            onClick={() => props.setOpen(false)}
                            >
                                Ok
                        </Button>
                        <Button
                            className= "gg-btn-outline"
                            variant="success"
                            style={{marginLeft: "20px", float: "right" }}
                            onClick={(e) => handleSubmit(e)}
                            >
                                Notify GlyGen
                        </Button>
                    </span>
                </div>
            </div>
        </div>
    </Dialog>
  );
}

IDCartAlert.propTypes = {
  alertInput: PropTypes.object,
  setOpen: PropTypes.func
};