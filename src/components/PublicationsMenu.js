import React from 'react';
// import React, { useReducer } from 'react';
// import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import SortIcon from '@material-ui/icons/Sort';
import { Typography } from '@material-ui/core';
// import Popover from '@material-ui/core/Popover';
// import Button from '@material-ui/core/Button';
const options = ['Title', 'Authors', 'Journal', 'Date', 'PMID'];

// const ITEM_HEIGHT = 48;

export default function PublicationsMenu() {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	// const [sortBy, setSortBy] = useReducer(
	// 	(state, newState) => ({ ...state, ...newState }),
	// 	{
	// 		title: true,
	// 		authors: true,
	// 		journal: true,
	// 		date: true,
	// 		pmid: true,
	// 	}
	// );

	// function handleSortBy(name, value) {
	// 	setSortBy({ [name]: value });
	// }

	return (
		<div>
			<div
				aria-label='more'
				// aria-controls='long-menu'
				// aria-haspopup='true'
				onClick={handleClick}>
				{/* <Tooltip title='Sort by' placement='top'> */}
				<Tooltip
					placement='top'
					title={
						<>
							<Typography color='inherit'>Sort by</Typography>
						</>
					}>
					<SortIcon className='icon-blue' fontSize='large' />
				</Tooltip>
			</div>
			<Menu
				id='long-menu'
				anchorEl={anchorEl}
				keepMounted
				open={open}
				onClose={handleClose}
				PaperProps={{
					style: {
						// maxHeight: ITEM_HEIGHT * 4.5,
						width: '130px',
					},
				}}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}>
				<strong>
					<center>Sort by:</center>
				</strong>
				{/* <MenuItem onClick={handleSortBy}>{sortBy.title}</MenuItem> */}
				{/* <MenuItem onClick={handleSortBy}>{sortBy.authors}</MenuItem> */}
				{/* <MenuItem onClick={handleSortBy}>{sortBy.journal}</MenuItem> */}
				{/* <MenuItem onClick={handleSortBy}>{sortBy.date}</MenuItem> */}
				{/* <MenuItem onClick={handleSortBy}>{sortBy.pmid}</MenuItem> */}
				{options.map((option) => (
					<MenuItem
						key={option}
						selected={option === 'Title'}
						onClick={handleClose}>
						{option}
					</MenuItem>
				))}
			</Menu>
		</div>
	);
}
