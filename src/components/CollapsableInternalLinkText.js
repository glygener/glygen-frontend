import { Col } from "react-bootstrap";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import LineTooltip from "./tooltip/LineTooltip";
import { Link } from "react-router-dom";

const CollapsableInternalLinkText = (props) => {
  const { routeLink, data, maxItems = 4, noLink = false, type} = props;
  const [open, setOpen] = useState(data.length <= maxItems);
  const displayedItems = open ? data : data.slice(0, maxItems);

  return (
    <>
          {displayedItems && displayedItems.map((val, ind) => (
            <>
              <Col className="nowrap ps-0">
                {noLink ? <span>{type === "string" ? val.trim() : val.id}</span> : <LineTooltip text="View details">
                  <Link to={routeLink + (type === "string" ? val.trim() : val.id)}>
                    <span
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}
                    >
                      {type === "string" ? val.trim() : val.id}
                    </span>
                  </Link>
                </LineTooltip>}
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
export default CollapsableInternalLinkText;
