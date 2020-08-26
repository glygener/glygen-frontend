import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import "../../css/Search.css";

export default function MultiselectTextInput(props) {
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
