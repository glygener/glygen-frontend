import React from 'react';
import '../../css/Sidebar.css';
import { NavLink } from 'react-router-dom';
//import ListItem from '@mui/material/ListItem';
//import ListItemText from '@mui/material/ListItemText';
//import List from '@mui/material/List';

const SidebarPages = () => {
	const pages = ['/license', '/privacy-policy', '/disclaimer'];
	const pageLabels = ['License', 'Privacy Policy', 'Disclaimer'];

	var items = pages.map((value, index) => {
		return (
			<NavLink
				// activeClassName='active'
				to={value}
				style={{ textDecoration: 'none' }}
				key={index}>
				<ul className='sidebar-item'>
					<li className='sidebar-item-text'>{pageLabels[index]}</li>
				</ul>
			</NavLink>
		);
	});

	return (
		<>
			<div className='sidebar-container sidbar-top-padding'>
				<div className='sidebar'>{items}</div>
			</div>
		</>
	);
};

export default SidebarPages;

// import React from 'react';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
// import { Link } from '@mui/material';
// import '../../css/Sidebar.css';
// // import { useLocation } from "react-router-dom";
// // import { withRouter } from "react-router-dom";

// function SidebarPages() {
// 	const pages = ['/license/?', '/privacy-policy/?', '/disclaimer/?'];
// 	const label = ['License', 'Privacy Policy', 'Disclaimer'];

// 	// const [activeLink, setActiveLink] = useState(items[0].id);

// 	return (
// 		<div className='sidebar-container sidbar-top-padding'>
// 			<div className='sidebar'>
// 				{/* <ScrollToTop /> */}
// 				<List disablePadding dense>
// 					{pages.map(({ value, index }) => (
// 						<>
// 							<Link
// 								activeClassName='active'
// 								to={value}
// 								style={{ textDecoration: 'none' }}
// 								key={index}>
// 								<ListItem
// 									key={index}
// 									button
// 									// onClick={() => setActiveLink(id)}
// 									className={'sidebar-item'}>
// 									<ListItemText className='sidebar-item-text'>
// 										{label[index]}
// 									</ListItemText>
// 								</ListItem>
// 							</Link>
// 						</>
// 					))}
// 				</List>
// 			</div>
// 		</div>
// 	);
// }

// export default SidebarPages;
