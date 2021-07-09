import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import Button from "react-bootstrap/Button";
import SelectControl from "./select/SelectControl";

import routeConstants from "../data/json/routeConstants";

const AlignmentDropdown = (props) => {
  const { types, dataId } = props;

  const [dropdown, setDropdown] = useState("unselected");
  const [linkPath, setLinkPath] = useState("#");

  useEffect(() => {
    setLinkPath(`${routeConstants.isoAlignment}${dataId}/${dropdown}`);
  }, [dropdown, dataId]);

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
            ...types.map((typeItem) => {
              return { id: typeItem.name, name: typeItem.label };
            }),
          ]}
          setInputValue={(value) => {
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
