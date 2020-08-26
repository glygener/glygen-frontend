import React from "react";
import PropTypes from "prop-types";
import LineTooltip from "../tooltip/LineTooltip";
import Button from "react-bootstrap/Button";

const ExampleControl = (props) => {
	let firstEx = true;

	return (
		<div
		// className={ "small-text" }
		>
			Example(s):{" "}
			{props.exampleMap &&
				props.exampleMap[props.type].examples.map((key, index, arr) => (
					<span key={key}>
						<LineTooltip text="Click to insert example.">
							<Button
								className={"lnk-btn"}
								variant="link"
								onClick={() => {
									props.setInputValue(key);
								}}>
								{key}
							</Button>
						</LineTooltip>{arr.length === index + 1 ? "" : ", "}
					</span>
				))}
		</div>
	);
};

export default ExampleControl;

ExampleControl.propTypes = {
	exampleMap: PropTypes.object,
	type: PropTypes.string,
	setInputValue: PropTypes.func,
};
