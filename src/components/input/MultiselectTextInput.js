import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import "../../css/Search.css";

/**
 * Multiselect text input component.
 **/
export default function MultiselectTextInput(props) {
  
  /**
	 * Function to handle change event for input text.
	 * @param {object} event event object.
	 * @param {string} value input value.
	 * @param {string} reason event reason.
	 **/
  const handleChange = (event, value, reason) => {
    props.setInputValue(value);
  };

  return (
    <div>
      <Autocomplete
        multiple
        options={props.options}
        getOptionLabel={(option) => option.name}
        classes={{
          option: "auto-option",
          inputRoot: "auto-input-root",
          input: "input-auto",
        }}
        filterSelectedOptions
        autoHighlight={true}
        value={props.inputValue}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder={props.placeholder}
          />
        )}
      />
    </div>
  );
}

MultiselectTextInput.propTypes = {
  inputValue: PropTypes.array,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  setInputValue: PropTypes.func,
};
