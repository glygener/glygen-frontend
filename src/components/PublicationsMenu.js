import React from 'react';
// import React, { useReducer } from 'react';
// import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import SortIcon from '@mui/icons-material/Sort';
import { Typography } from '@mui/material';
// import Popover from '@mui/material/Popover';
// import Button from '@mui/material/Button';
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
