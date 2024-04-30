import React, { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";

const CollapsibleTextTableView = (props) => {
  const { text, id,  } = props;

  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      <span
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {text}
      </span>
      { collapsed && (
        <Button className={"lnk-btn"} variant="link" onClick={() => {
          setCollapsed(false)
          props.handleCallback(props.id, true)
        }}>
          Show More...
        </Button>
      )}
      { !collapsed && (
        <Button className={"lnk-btn"} variant="link" onClick={() => {
          setCollapsed(true)
          props.handleCallback(props.id, false)
          }}>
          Show Less...
        </Button>
      )}
    </>
  );
};
export default CollapsibleTextTableView;
