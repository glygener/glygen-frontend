import { Row, Col } from "react-bootstrap";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import EvidenceList from "../components/EvidenceList";
import { groupEvidences } from "../data/data-format";

const CollapsibleEvidenceArray = (props) => {
  const { title, names, maxItems = 3 } = props;
  const [open, setOpen] = useState(names.length <= maxItems);
  const displayedItems = open ? names : names.slice(0, maxItems);

  return (
    <>
      <strong>{title}</strong>
      <ul style={{ marginTop: "5px" }}>
        <Row>
          {displayedItems.map((obj, index) => (
            <span key={index} xs={12} sm={12} style={{ marginBottom: "2px", verticalAlign: "middle", alignItems: "center" }}>
              <li>
                <span>
                  <EvidenceList
                    name={obj.name}
                    inlineWithName={true}
                    evidences={groupEvidences(obj.evidence)}
                  />
                </span>
              </li>
            </span>
          ))}
        </Row>

        {names.length > maxItems && (
          <>
            {open ? (
              <Button className={"lnk-btn"} variant="link" onClick={() => setOpen(false)}>
                Show Less...
              </Button>
            ) : (
              <Button className={"lnk-btn"} variant="link" onClick={() => setOpen(true)}>
                Show More...
              </Button>
            )}
          </>
        )}
      </ul>
    </>
  );
};
export default CollapsibleEvidenceArray;
