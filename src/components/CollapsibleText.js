import React, { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";

const CollapsibleText = (props) => {
  const { text, lines = 5 } = props;
  const textRef = useRef();
  const [overflow, setOverflow] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  useEffect(() => {
    const scrollHeight = textRef.current.scrollHeight;
    const clientHeight = textRef.current.clientHeight;
    const scrollWidth = textRef.current.scrollWidth;
    const clientWidth = textRef.current.clientWidth;

    const isOverflow = scrollHeight > clientHeight || scrollWidth > clientWidth;
    setOverflow(isOverflow);
  }, [text]);
  return (
    <>
      <span
        ref={textRef}
        style={{
          display: "-webkit-box",
          WebkitLineClamp: collapsed ? lines : "unset",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {text}
      </span>
      {overflow && collapsed && (
        <Button className={"lnk-btn"} variant="link" onClick={() => setCollapsed(false)}>
          Show More...
        </Button>
      )}
      {overflow && !collapsed && (
        <Button className={"lnk-btn"} variant="link" onClick={() => setCollapsed(true)}>
          Show Less...
        </Button>
      )}
    </>
  );
};
export default CollapsibleText;
