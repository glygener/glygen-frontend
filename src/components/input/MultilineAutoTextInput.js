import React from "react";
import TextField from "@mui/material/TextField";
import { getTypeahed } from '../../data/commonApi';
import Autocomplete from "@mui/material/Autocomplete";
import PropTypes from 'prop-types';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import '../../css/Search.css';


/**
 * Multiline text input component with comma separated typeahead.
 **/
export default function MultilineAutoTextInput(props) {

  const [options, setOptions] = React.useState([]);
  const inputValueRef = React.useRef(props.inputValue);
  inputValueRef.current = props.inputValue;

  /**
	 * Function to handle change event for input text.
	 * @param {object} event event object.
	 * @param {string} value input value.
	 * @param {string} reason event reason.
	 **/
  const handleChange = (event, value, reason) => {
    if (event !== null && !(value === "" && reason === "reset")){
      props.setInputValue(value);
    }
  };

  /**
	 * useEffect to get typeahead data from api.
	 **/
  React.useEffect(() => {
    if (props.inputValue.trim().substring(props.inputValue.trim().lastIndexOf(",") + 1) === "") {
      setOptions([]);
      return undefined;
    }

      if (props.inputValue) {
          getTypeahed(props.typeahedID, undefined, props.inputValue.substring(props.inputValue.lastIndexOf(",") + 1)).then(response => inputValueRef.current.trim() !== '' ? setOptions(response.data) : setOptions([]))
			    .catch(function (error) {});
      }

    return;
  }, [props.inputValue, props.typeahedID]);

  return (
    <>
    <Autocomplete
      freeSolo
      getOptionLabel={option => props.inputValue.substring(0, props.inputValue.lastIndexOf(",") + 1) + option + ","}
      options={options}
      filterOptions={(options) => options}
      classes={{
        option: 'auto-option',
        inputRoot: 'auto-input-root',
        input: 'input-auto'
      }}
      autoHighlight={true}
      inputValue={props.inputValue}
      onClose={(event, reason) => setOptions([])}
      renderOption={(props, option) => {
        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item xs>
                <span>{option}</span>
              </Grid>
            </Grid>
          </li>
        );
      }}
      onInputChange={handleChange}
      renderInput={params => (
        <TextField
          {...params}
          multiline
          rows="2"
          variant="outlined"
          placeholder={props.placeholder}
          error={
            props.inputValue.length > props.length
          }
        />
      )}
    />
    {props.inputValue.length > props.length && <FormHelperText 
      className={"error-text"} error>
      {props.errorText}
      </FormHelperText>}
    </>
  );
}

MultilineAutoTextInput.propTypes = {
    inputValue: PropTypes.string,
    placeholder: PropTypes.string,
    typeahedID: PropTypes.string,
    errorText: PropTypes.string,
    length: PropTypes.number,
    setInputValue: PropTypes.func,
  };