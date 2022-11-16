import React from "react";
import { Row, Col } from "react-bootstrap";
import { useState } from "react";
import "../../css/feedback.css";
import CloseIcon from "@mui/icons-material/Close";
import SequenceHighlighter from "./SequenceHighlighter";

/**
 * Sequence dashboard control for displaying sequence highlighter control.
 */
const SequenceDashboard = (props) => {
  const [isOpen, setIsOpen] = useState(true);

  /**
   * Function to close sequence dashboard control.
   */
  const closeForm = () => {
    setIsOpen(!isOpen);
  };

  return (
    <form autoComplete="off" className="form">
      <div
        className={
          "sidebar-contact feedback_ protvistaicon sequence-dashboard" + (isOpen ? " active" : "")
        }
      >
        <Row>
          <Col sm={12} md={12} lg={12}>
            <div
              className={"toggle rotate" + (isOpen ? " active mt-1" : "")}
              onClick={() => closeForm()}
            >
              {isOpen ? (
                <CloseIcon style={{ fill: "white" }} />
              ) : (
                <span className="name">
                  <b className="color-white">Sites</b>
                </span>
              )}
            </div>
            <div className="scroll">
              <h5>Site Feature</h5>
              <SequenceHighlighter
                details={props.details}
                sequenceObject={props.sequences}
                selectedHighlights={props.selectedHighlights}
                setSelectedHighlights={props.setSelectedHighlights}
                sequenceSearchText={props.sequenceSearchText}
                setSequenceSearchText={props.setSequenceSearchText}
                showNumbers={props.showNumbers}
              />
            </div>
          </Col>
        </Row>
      </div>
    </form>
  );
};
export default SequenceDashboard;
