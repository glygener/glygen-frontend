import React from 'react';
import Grid from '@material-ui/core/Grid';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import ExampleControl from "../example/ExampleControl";
import SelectControl from '../select/SelectControl';
import '../../css/Search.css';

export default function SimpleSearchControl(props) {

	const simpleSearchCategoryOnChange = (value) => {
		props.setSimpleSearchCategory(value);
	}

	const simpleSearchTermOnChange = (event) => {
		props.setSimpleSearchTerm(event.target.value);
	}

	return (
		<form onSubmit={(event) => {event.preventDefault(); if (props.simpleSearchTerm.length <= props.length) props.searchSimpleClick()}}>
			<Grid
				container
				spacing={3}
				justify='center'>
				<Grid item xs={12} sm={3}>
					<FormControl variant='outlined' fullWidth>
						<InputLabel className={'select-lbl-inline'}>{props.simpleSearchCategoryLabel}</InputLabel>
						<SelectControl
							inputValue={props.simpleSearchCategory}
							rootClass='select-menu'
							labelWidth={80}
							menu={props.simple_search_category.map((category) => {return {id: category.id, name: category.display}})}
							setInputValue={simpleSearchCategoryOnChange}
						/>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6}>
					<OutlinedInput
						fullWidth
						required
						placeholder={
							props.simple_search !== undefined
								? props.simple_search[props.simpleSearchCategory].placeholder
								: ''
						}
						value={props.simpleSearchTerm}
						onChange={simpleSearchTermOnChange}
						error={props.simpleSearchTerm.length > props.length}
					/>
					{props.simpleSearchTerm.length > props.length && (
						<FormHelperText className={"error-text"} error>
							{props.errorText}
						</FormHelperText>
					)}
					<ExampleControl
						exampleMap={props.simple_search}
						type={props.simpleSearchCategory}
						setInputValue={(input) => {props.setSimpleSearchTerm(input)}}
					/>
				</Grid>
				<Grid item xs={12} sm={2}>
					<Button
						className='gg-btn-blue gg-btn-simple-search'
						disabled={
							props.simpleSearchTerm.trim() === '' ||
							props.simpleSearchTerm.length > props.length
						}
						onClick={props.searchSimpleClick}>
						Search
					</Button>
				</Grid>
			</Grid>
			<br />
			<Grid container spacing={3} justify='center'>
				<Grid className={"small-text"} item>
					*{' '}
					<em>
						"<strong>Any category</strong>"
					</em>{' '}
					allows you to search an entire GlyGen database, including the context
					match. *
				</Grid>
			</Grid>
		</form>
	);
}

SimpleSearchControl.propTypes = {
	simpleSearchCategory: PropTypes.string,
	simpleSearchCategoryLabel: PropTypes.string,
	simpleSearchTerm: PropTypes.string,
	simple_search_category: PropTypes.array,
	simple_search: PropTypes.object,
	errorText: PropTypes.string,
	length: PropTypes.number,
	searchSimpleClick: PropTypes.func,
	setGlySimpleSearchCategory: PropTypes.func,
	setGlySimpleSearchTerm: PropTypes.func,
};
