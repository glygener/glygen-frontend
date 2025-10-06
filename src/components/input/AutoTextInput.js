import React from 'react';
import TextField from '@mui/material/TextField';
import { getTypeahed } from '../../data/commonApi';
import Autocomplete from '@mui/material/Autocomplete';
import PropTypes from 'prop-types';
import FormHelperText from '@mui/material/FormHelperText';
import '../../css/Search.css';

/**
 * Text input component with typeahead.
 **/
export default function AutoTextInput(props) {
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
		if (!(event === null && value === "" && reason === "reset")){
			props.setInputValue(value);
		}
	};

	/**
	 * useEffect to get typeahead data from api.
	 **/
	React.useEffect(() => {
		if (props.inputValue.trim() === '') {
			setOptions([]);
			return undefined;
		}
		if (props.inputValue) {
			getTypeahed(props.typeahedID, props.fieldList, props.inputValue).then((response) => inputValueRef.current.trim() !== '' ? setOptions(response.data) : setOptions([]))
			.catch(function (error) {});
		}

		return;
	}, [props.inputValue, props.typeahedID, props.fieldList]);

	return (
		<>
			<Autocomplete
				freeSolo
				getOptionLabel={(option) => option}
				classes={{
				 	option: 'auto-option',
				 	inputRoot: 'auto-input-root',
				 	input: 'input-auto'
				}}
				options={options}
				filterOptions={(options) => options}
				autoHighlight={true}
				inputValue={props.inputValue}
				onInputChange={handleChange}
				disabled={props.disabled}
				onBlur={props.onBlur}
				onClose={(event, reason) => setOptions([])}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='outlined'
						required={props.required}
						placeholder={props.placeholder}
						error={props.inputValue.length > props.length || props.error}
					/>
				)}
			/>
			{props.inputValue.length > props.length && (
				<FormHelperText className={"error-text"} error>
					{props.errorText}
				</FormHelperText>
			)}
		</>
	);
}

AutoTextInput.propTypes = {
	inputValue: PropTypes.string,
	placeholder: PropTypes.string,
	typeahedID: PropTypes.string,
	fieldList: PropTypes.array,
	errorText: PropTypes.string,
	length: PropTypes.number,
	required: PropTypes.bool,
	setInputValue: PropTypes.func,
};
