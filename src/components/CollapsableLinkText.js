import { Col } from "react-bootstrap";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import LineTooltip from "../components/tooltip/LineTooltip";
import { Link } from "react-router-dom";

const CollapsableLinkText = (props) => {
  const { routeLink, data, maxItems = 4 } = props;
  const [open, setOpen] = useState(data.length <= maxItems);
  const displayedItems = open ? data : data.slice(0, maxItems);

  return (
    <>
          {displayedItems.map((val, ind) => (
            <>
              {routeLink ? 
                <Col className="nowrap ps-0">
                  <LineTooltip text="View details">
                    <Link to={routeLink + val}>
                      <span
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        {val}
                      </span>
                    </Link>
                  </LineTooltip> 
              </Col> : 
              <Col className="ps-0">
                <span
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                >
                  {val}
                </span>
              </Col>}
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
export default CollapsableLinkText;
