import React, { useState } from "react";
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";
import PropTypes from "prop-types";
import { Row } from "react-bootstrap";

const CustomPopover = props => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);

  return (
    <div>
      <Button color="link" id={"Popover" + props.id} onBlur={toggle}>
        <pre>{props.displayText}</pre>
      </Button>
      <Popover
        placement="bottom"
        isOpen={popoverOpen}
        target={"Popover" + props.id}
        toggle={toggle}
      >
        <PopoverHeader>{"GlycoCT"}</PopoverHeader>
        <PopoverBody>
          <div style={{ whiteSpace: "pre-wrap" }}>{props.popOverText}</div>
        </PopoverBody>
      </Popover>
    </div>
  );
};

CustomPopover.propTypes = {
  id: PropTypes.number.isRequired,
  displayText: PropTypes.string.isRequired,
  popOverText: PropTypes.string.isRequired
};

export default CustomPopover;
