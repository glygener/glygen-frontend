import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import HelpOutline from "@material-ui/icons/HelpOutline";
import PropTypes from "prop-types";

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
