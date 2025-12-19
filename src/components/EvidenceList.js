import React from "react";

import GlygenBadge from "./GlygenBadge";
import { Row, Col } from "react-bootstrap";

const EvidenceList = props => {
  const { evidences, name } = props;

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
      {props.inlineWithName && (
        <Row style={{ marginBottom: "5px" }}>
            <Col xs={"auto"} sm={"auto"} style={{ marginBottom: "10px"}}>
              {name && <span >{name}</span>}
            </Col>
            {Object.keys(evidences).map((db, index) => (
              <Col xs={"auto"} sm={"auto"} className={"inline-evidence"} style={{ marginTop: "-10px" }} key={db}>
                <GlygenBadge key={index} text={db} expandList={evidences[db]} />
              </Col>
            ))}
        </Row>
      )}
      {!props.inline && !props.inlineWithName && (
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
