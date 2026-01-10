import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from 'react-bootstrap/Button';
import { postTo } from "../../data/api";
import { replaceSpecialCharacters } from "../../utils/common";
import { axiosError } from "../../data/axiosError";
import { logActivity, getUserID } from "../../data/logging";

/**
 * Dialog component to show query.
 */
export default function NotifyGlyGen(props) {

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
        let message =  JSON.stringify({"search": props.search, "query": props.query, "aiQuery": props.aiQuery, "listID": props.listID});
        const formData = {
          user: getUserID(),
          subject: props.search + ": " + props.listID,
          message: escape(replaceSpecialCharacters(message)),
        };
        const url = `/auth/notify?query=${JSON.stringify(formData)}`;
        const myHeaders = {
          "Content-Type": "application/x-www-form-urlencoded",
        };
        postTo(url, myHeaders)
          .then((response) => {
            logActivity("user", "", "Message sent from notify glygen ai page.");
            setContactUsResponseMessage("We have received your message.");
            props.setPageLoading(false);
          })
          .catch((error) => {
            setContactUsErrorMessage(
              "Oops, something went wrong! We did not receive your message. Please try again later."
            );
            axiosError(error, "", "Notify api call.", props.setPageLoading);
          });
    
      };

  return (  
          <div>
            <div style={{paddingTop:"20px", content:'center', textAlign: 'text-center', justifyContent: "center", alignItems: "center" }}>
                {(contactUsResponseMessage !== "" || contactUsErrorMessage !== "") && <div style={{paddingBottom:"20px"}}>
                  <div className={`alert-success ${contactUsResponseMessage ? "alert" : ""}`}>
                    <strong>{contactUsResponseMessage}</strong>
                  </div>
                  <div className={`alert-danger ${contactUsErrorMessage ? "alert" : ""}`}>
                    <strong>{contactUsErrorMessage}</strong>
                  </div>
                </div>}

                <div style={{content:'center', textAlign: 'text-center' }}>
                  <Button
                    className= "gg-btn-outline"
                    variant="success"
                    onClick={(e) => handleSubmit(e)}
                  >
                    Notify Us If AI Got It Wrong
                  </Button>
                </div>
              </div>
          </div>
  );
}

NotifyGlyGen.propTypes = {
  search: PropTypes.string,
  query: PropTypes.object,
  listID: PropTypes.string,
  setPageLoading: PropTypes.func
};