import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import { Row, Col, Dropdown } from "react-bootstrap";
import { downloadFromServer } from "../utils/download";
import FormControl from "@material-ui/core/FormControl";
import { withStyles } from "@material-ui/core/styles";
import Button from "react-bootstrap/Button";
import InputBase from "@material-ui/core/InputBase";
import SelectControl from "./select/SelectControl";
import { Link } from "@material-ui/core";

import routeConstants from "../data/json/routeConstants";

const BootstrapInput = withStyles(theme => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3)
    }
  },
  input: {
    borderRadius: 4,
    minWidth: "40px",
    border: "1px solid #ced4da",
    padding: "7px 26px 7px 12px"
  }
}))(InputBase);

const AlignmentDropdown = props => {
  const { types, dataId } = props;

  const [show, setShow] = useState(false);
  const [dropdown, setDropdown] = useState("unselected");
  const [linkPath, setLinkPath] = useState("#");

  useEffect(() => {
    setLinkPath(`${routeConstants.isoAlignment}${dataId}/${dropdown}`);
  }, [dropdown]);

  return (
    <>
      <FormControl
        margin="dense"
        variant="outlined"
        style={{ margin: "0 auto", verticalAlign: "middle" }}
      >
        <SelectControl
          inputValue={dropdown}
          menu={[
            { id: "unselected", name: "Select" },
            ...types.map(typeItem => {
              return { id: typeItem.name, name: typeItem.label };
            })
          ]}
          setInputValue={value => {
            setDropdown(value);
          }}
        />
      </FormControl>
      <NavLink to={linkPath}>
        <Button
          type="button"
          style={{ marginLeft: "10px" }}
          className="gg-btn-blue"
          disabled={dropdown === "unselected"}
        >
          Alignment
        </Button>
      </NavLink>
    </>
  );
};
export default AlignmentDropdown;
