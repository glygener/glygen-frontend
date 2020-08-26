import React from "react";
import TextField from "@material-ui/core/TextField";
import { getTypeahed } from '../../data/commonApi';
import Autocomplete from "@material-ui/lab/Autocomplete";
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import '../../css/Search.css';

export default function MultilineAutoTextInput(props) {

  const [options, setOptions] = React.useState([]);
  const inputValueRef = React.useRef(props.inputValue);
  inputValueRef.current = props.inputValue;

  const handleChange = (event, value, reason) => {
    if (event !== null && !(value === "" && reason === "reset")){
      props.setInputValue(value);
    }
  };

  React.useEffect(() => {
    if (props.inputValue.trim().substring(props.inputValue.trim().lastIndexOf(",") + 1) === "") {
      setOptions([]);
      return undefined;
    }

    if (props.inputValue) {
        getTypeahed(props.typeahedID, props.inputValue.substring(props.inputValue.lastIndexOf(",") + 1)).then(response => inputValueRef.current.trim() !== '' ? setOptions(response.data) : setOptions([]));
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
      renderOption={option => option}
      onInputChange={handleChange}
      renderInput={params => (
        <TextField
          {...params}
          multiline
          rows="3"
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