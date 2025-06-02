import { Col } from "react-bootstrap";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import LineTooltip from "./tooltip/LineTooltip";
import { Link } from "react-router-dom";

const CollapsableTextArray = (props) => {
  const { routeLink, data, maxItems = 4, noLink = false} = props;
  const [open, setOpen] = useState(data.length <= maxItems);
  const displayedItems = open ? data : data.slice(0, maxItems);

  return (
    <>
          {displayedItems.map((val, ind) => (
            <>
              <Col className="nowrap ps-0" id={ind}>
                <span>{val}</span>
              </Col>
            </>
          ))}

        {data.length > maxItems && (
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
    </>
  );
};
export default CollapsableTextArray;
