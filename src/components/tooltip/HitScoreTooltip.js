import React from "react";
import Tooltip from "@mui/material/Tooltip";
import HelpOutline from "@mui/icons-material/HelpOutline";
import PropTypes from "prop-types";
import ClientTable from "../ClientTable";

/**
 * HitScoreTooltip component for showing hit score values.
 */
const HitScoreTooltip = (props) => {

	  const hitScoreColumns = [
		{
		  dataField: "cond",
		  name: "Condition"
		},
		{
		  dataField: "wt",
		  name: "Weight"
		},
		{
			dataField: "fq",
			name: "Frequency"
		},
		{
			dataField: "contr",
			name: "Contribution",
			footer: columnData => {
				let val = columnData.reduce((acc, item) => acc + item, 0)
				let num = +(Math.round(val + "e+2")  + "e-2") + 0.1;
				return Math.round((num +  Number.EPSILON) * 100) / 100;
			}
		}
	  ];

	/**
	 * Gets total from hit score contributions.
	 */
	function getTotal() {
		let val = props.contributions.reduce((acc, item) => acc + item.w + item.f * 0.01, 0);
		let num = +(Math.round(val + "e+2")  + "e-2") + 0.1;
		return Math.round((num +  Number.EPSILON) * 100) / 100;
	}

	return (
		<Tooltip
			disableTouchListener
			interactive
			arrow
			placement={props.placement ? props.placement : "bottom-start"}
			classes={{
				tooltip: "gg-tooltip-hitscore",
			}}
			title={
				<React.Fragment>
					<h5>
						<strong>{props.title + ":"}</strong>
					</h5>
					<div style={{paddingTop:"5px", paddingBottom:"10px"}}>
						{<strong>{props.text}</strong>} : {props.formula}		
					</div>
					{props.contributions && props.contributions.length > 0 && <>

						<ClientTable
							data={props.contributions.map((item)=> {return { cond:item.c, wt: item.w, fq: item.f, contr:Math.round((item.w + item.f * 0.01 +  Number.EPSILON) * 100) / 100}}).sort((item1, item2) => item1.cond >= item2.cond ? 1 : -1)}
							columns={hitScoreColumns}
							totalName={"Hit Score (Total + 0.1)"}
							totalColspan={3}
							total= {getTotal()}
							wrapperClasses="table-responsive table-height"
						/>
					</>}
					{"** There may be a rounding error in the 'Hit Score' shown in above Table and actual Hit Score value."}
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

export default HitScoreTooltip;

HitScoreTooltip.propTypes = {
	title: PropTypes.string,
	text: PropTypes.string,
	formula: PropTypes.string,
	contributions: PropTypes.object,
	urlText: PropTypes.string,
	url: PropTypes.string,
	helpIcon: PropTypes.string,
};
