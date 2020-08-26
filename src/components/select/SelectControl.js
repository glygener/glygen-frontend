import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import {sortDropdown} from '../../utils/common';
import '../../css/Search.css';

export default function SelectControl(props) {

    const handleChange = (event, child) => {
		props.setInputValue(child.props.value, child.props.name, event.target.name);
	}
    
	return (
		<>
            <Select
                value={props.inputValue}
                displayEmpty
                name={props.name}
                onChange={handleChange}
                margin={props.margin}
                variant={props.variant}
                defaultValue={props.defaultValue}
                classes={{
                    root: props.rootClass ? props.rootClass : 'select-menu-adv',
                }}
                labelWidth={props.labelWidth}>
                {props.placeholder && <MenuItem key={props.placeholderId} value={props.placeholderId} name={props.placeholderName}>{props.placeholder}</MenuItem>}
                {props.menu &&
                    props.menu
                        .sort(sortDropdown)
                        .map((item) => (
                            <MenuItem key={item.id} value={item.id} name={item.name}>{item.name}</MenuItem>
                        ))}
            </Select>
        </>
	);
}

SelectControl.propTypes = {
	inputValue: PropTypes.string,
    placeholder: PropTypes.string,
    placeholderId: PropTypes.string,
    placeholderName: PropTypes.string,
    rootClass: PropTypes.string,
    margin: PropTypes.string,
    variant: PropTypes.string,
    labelWidth: PropTypes.number,
    defaultValue: PropTypes.string,
    menu: PropTypes.array,
	setInputValue: PropTypes.func,
};