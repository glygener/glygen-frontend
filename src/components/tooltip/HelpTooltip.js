import React from "react";
import Tooltip from "@mui/material/Tooltip";
import HelpOutline from "@mui/icons-material/HelpOutline";
import Image from "react-bootstrap/Image";
import PropTypes from "prop-types";
import Grid from '@mui/material/Grid';

/**
 * HelpTooltip component for showing text, link.
 */
const HelpTooltip = (props) => {
	return (
		<Tooltip
			disableTouchListener
			interactive
			arrow
			placement={props.placement ? props.placement : "bottom-start"}
			classes={{
				tooltip: "gg-tooltip",
			}}
			title={
				<React.Fragment>
					<h5>
						<strong>{props.title + ":"}</strong>
					</h5>
					{props.text}
					{props.imageArray && props.imageArray.length > 0 && <>
						{props.imageArray.map((value, index) => (
							<Grid
								key={index}
								container
								style={{ margin: '0  auto' }}
								spacing={1}
							>
								<Grid item xs={8} sm={8}>
									{value.imageTitle}
								</Grid>
								<Grid item xs={3} sm={3}>								
									<Image
										src={process.env.PUBLIC_URL + value.imagePath}
										style={{ width: "20px", height: "20px"}}
									/>
								</Grid>
							</Grid>
						))}
					</>}
					{props.text && <br />}
					<a href={props.url} target="_blank" rel="noopener noreferrer">
						{props.urlText}
					</a>
				</React.Fragment>
			}>
			{props.children ? (
				props.children
			) : (
				<HelpOutline
					className={props.helpIcon ? props.helpIcon : "gg-helpicon"}
				/>
			)}
		</Tooltip>
	);
};

export default HelpTooltip;

HelpTooltip.propTypes = {
	title: PropTypes.string,
	text: PropTypes.string,
	urlText: PropTypes.string,
	url: PropTypes.string,
	helpIcon: PropTypes.string,
};
