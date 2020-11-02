import React from "react";

import GlygenBadge from "./GlygenBadge";
import { Row, Col } from "react-bootstrap";

const EvidenceList = props => {
  const { evidences } = props;

  return (
    <>
      {props.inline && <Row>
        {Object.keys(evidences).map((db, index) => (
          <Col
            xs={12}
            sm={12}
            md={4}
            lg={3}
            xl={3}
            className={"inline-evidence"}
          >
            <GlygenBadge key={index} text={db} expandList={evidences[db]} />
          </Col>
        ))}
      </Row>}
      {!props.inline && <span>
        {Object.keys(evidences).map((db, index) => (
          <GlygenBadge key={index} text={db} expandList={evidences[db]} />
        ))}
      </span>}
    </>
  );
};

export default EvidenceList;
