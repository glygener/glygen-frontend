import React from "react";

import GlygenBadge from "./GlygenBadge";
import { Row, Col } from "react-bootstrap";

const EvidenceList = props => {
  const { evidences } = props;

  return (
    <>
      {props.inline && (
        <Row>
          {Object.keys(evidences).map((db, index) => (
            <Col xs={12} sm={"auto"} className={"inline-evidence"} key={db}>
              <GlygenBadge key={index} text={db} expandList={evidences[db]} />
            </Col>
          ))}
        </Row>
      )}
      {!props.inline && (
        <span>
          {Object.keys(evidences).map((db, index) => (
            <GlygenBadge key={db} text={db} expandList={evidences[db]} />
          ))}
        </span>
      )}
    </>
  );
};

export default EvidenceList;
