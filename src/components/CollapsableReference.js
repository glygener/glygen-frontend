import { Row, Col } from "react-bootstrap";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";

const CollapsableReference = (props) => {
  const { database, links, maxItems = 9 } = props;
  const [open, setOpen] = useState(links.length <= maxItems);
  const displayedItems = open ? links : links.slice(0, maxItems);

  return (
    <>
      <strong>{database}:</strong>
      <ul style={{ marginBottom: "10px" }}>
        <Row>
          {displayedItems.map((link) => (
            <Col xs={12} sm={4} key={link.id}>
              <li>
                {link.url ? <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.id}
                </a> :
                <span>{link.id}</span>}
              </li>
            </Col>
          ))}
        </Row>

        {links.length > maxItems && (
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
export default CollapsableReference;
