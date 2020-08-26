import React from 'react';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

function ToTopArrow() {
	return (
		<div className='goToTop'>
			<a href='#top-heading'>
				to Top{' '}
				<span>
					<ArrowUpwardIcon />
				</span>
			</a>
		</div>
	);
}
export default ToTopArrow;
