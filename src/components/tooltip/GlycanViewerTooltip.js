import React from "react";
import Tooltip from "@mui/material/Tooltip";
import HelpOutline from "@mui/icons-material/HelpOutline";
import Image from "react-bootstrap/Image";
import PropTypes from "prop-types";
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";
import {
	GLYGEN_DOMAIN
  } from "../../envVariables";

/**
 * GlycanViewerTooltip component for showing text, link.
 */
const GlycanViewerTooltip = (props) => {
	return (
		<Tooltip
			disableTouchListener
			interactive
			arrow
			placement={props.placement ? props.placement : "bottom-start"}
			classes={{
				tooltip: "gg-tooltip-feature-view",
			}}
			title={
				<React.Fragment>
					<h5>
						<strong>{props.title + ":"}</strong>
					</h5>
					<Grid
						container
						style={{ margin: '0  auto' }}
						spacing={1}
					>
						{props.type === "residue" && <>
							<Grid item xs={9} sm={9}>
								<div>{props.title}{" "}({props.id})</div>
								{props.pubChemCompound && <div>{"PubChem Compound : "}
									<a href={props.pubChemUrl + props.pubChemCompound} target="_blank" rel="noopener noreferrer">
										{props.pubChemCompound}
									</a>{"."}
								</div>}
								{props.wikiLink && <div>{"Read more on "}
									<a href={props.wikiLink} target="_blank" rel="noopener noreferrer">
										{"Wikipedia"}
									</a>{"."}
								</div>}
							</Grid>
							{props.imagePath && <Grid item xs={3} sm={3}>	
								<Image
									src={GLYGEN_DOMAIN + props.imagePath}
									style={{ width: "140px", height: "85px"}}
								/>
							</Grid>}
						</>}
						{props.type === "enzyme" && <>
							<Grid style={{ paddingBottom: "10px" }} item xs={12} sm={12}>
								<div>{"See enzymes on Protein Details ("}
									<a href={props.url} target="_blank" rel="noopener noreferrer">
										{props.id}
									</a>{") page."}
								</div>
							</Grid>	
						</>}
						{props.type === "motif" && <>
							<Grid style={{ paddingBottom: "10px" }} item xs={12} sm={12}>
								<div>{"See motif details on "}
									<a href={props.url} target="_blank" rel="noopener noreferrer">
										{"GlyGen"}
									</a>{"."}
								</div>
								<div>{"See motif details on "}
									<a href={props.glycoMotifUrl + props.id} target="_blank" rel="noopener noreferrer">
										{"GlycoMotif"}
									</a>{"."}
								</div>
							</Grid>								
						</>}
					</Grid>
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

export default GlycanViewerTooltip;

GlycanViewerTooltip.propTypes = {
	title: PropTypes.string,
	urlText: PropTypes.string,
	glycoMotifUrl: PropTypes.string,
	imagePath: PropTypes.string,
	pubChemCompound: PropTypes.string,
	pubChemUrl: PropTypes.string,
	helpIcon: PropTypes.string,
};
