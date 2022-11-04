import { Row, Col } from "react-bootstrap";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import DirectSearch from "./search/DirectSearch.js";

const CollapsibleDirectSearchReference = (props) => {
  const { resource, links, maxItems = 9 } = props;
  const [open, setOpen] = useState(links.length <= maxItems);
  const displayedItems = open ? links : links.slice(0, maxItems);

  return (
    <>
      <strong>{resource}</strong>
      <ul style={{ marginBottom: "10px" }}>
        <Row>
          {displayedItems.map((link, index) => (
            <Col key={index} xs={12} sm={12}>
              <li>
                {link.name}{" "}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.id}
                </a>
                <DirectSearch
                  text={props.text}
                  searchType={props.searchType}
                  fieldType={props.fieldType}
                  fieldValue={link.id}
                  executeSearch={props.executeSearch}
                />
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
export default CollapsibleDirectSearchReference;
