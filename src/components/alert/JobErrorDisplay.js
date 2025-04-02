import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from 'react-bootstrap/Button';
import { Dialog } from "@mui/material";
import { postTo } from "../../data/api";
import { replaceSpecialCharacters } from "../../utils/common";
import { axiosError } from "../../data/axiosError";
import { logActivity, getUserID } from "../../data/logging";
/**
 * Dialog component to show query.
 */
export default function JobErrorDisplay(props) {

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
        let message =  JSON.stringify({"error": props.jobErrorDialogInput.error, "jobTypeInternal": props.jobErrorDialogInput.jobTypeInternal,
          "job": props.jobErrorDialogInput.job, "userfile": props.jobErrorDialogInput.userfile
        });
        const formData = {
          user: getUserID(),
          subject: "JOB: " + props.jobErrorDialogInput.jobType + ": " + props.jobErrorDialogInput.serverJobId + " error",
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
            open={props.jobErrorDialogInput.show}
            classes= {{
                paper: "alert-dialog"
            }}
            style={{margin:40}}
            disableScrollLock
            onClose={() => props.setOpen(false)} 
        >    
            <div id="contents" class = "gf-content-div">
                <h5 className= "alert-dialog-title" style={{minWidth: '500px' }}>{props.jobErrorDialogInput.expired ? "Job Expired" : "Job Error"}</h5>
                <div clas1sName="alert-dialog-content"
                    style={{padding:40, content:'center'}}
                >
                    <div>
                      Job Type: {props.jobErrorDialogInput.jobType}
                    </div>
                    <div>
                      Job ID: {props.jobErrorDialogInput.serverJobId}
                    </div>

                    <div style={{paddingTop:20, paddingBottom:20}}>
                      {<div>
                        {props.jobErrorDialogInput.expired ? "Please find the details below," : "Please find the error below,"}
                      </div>}
                      {props.jobErrorDialogInput.error && <ul>
                        <span>
                          {props.jobErrorDialogInput.error.error_list && (
                            props.jobErrorDialogInput.error.error_list.map((repID) =>
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

JobErrorDisplay.propTypes = {
  show: PropTypes.bool,
  query: PropTypes.object,
  title: PropTypes.string,
  setOpen: PropTypes.func
};