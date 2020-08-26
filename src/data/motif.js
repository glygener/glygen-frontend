import { getJson, postToAndGetBlob, glycanImageUrl } from "./api";
import { Link } from "react-router-dom";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import routeConstants from "./json/routeConstants";
import LineTooltip from "../components/tooltip/LineTooltip";
import stringConstants from "./json/stringConstants";
import { logActivity } from "../data/logging";

const glycanStrings = stringConstants.glycan.common;

export const getMotifList = (
	glytoucan_ac = glytoucan_ac,
	offset = 1,
	limit = 20,
	sort = undefined,
	order = "asc"
) => {
	const queryParams = {
		glytoucan_ac: glytoucan_ac,
		offset: offset,
		sort: sort,
		limit: limit,
		order: order,
	};
	const queryParamString = JSON.stringify(queryParams);
	const url = `/motif/detail?query=${queryParamString}`;
	return getJson(url);
};

export const getMotifDownload = (id, format, compressed, type, headers) => {
	let message = "downloaded successfully ";
	logActivity("user", id, format, compressed, "No results. " + message);
	const query = { id, type, format, compressed };
	const url = `/data/download?query=${JSON.stringify(query)}`;
	return postToAndGetBlob(url, headers);
};

export const getMotifDetail = (accessionId) => {
	const url = `/glycan/detail/${accessionId}`;
	return getJson(url);
};
export const getGlycanImageUrl = (glytoucan_id) => {
	return glycanImageUrl + glytoucan_id;
};

const headerSortingClasses = (column, sortOrder, isLastSorting, colIndex) =>
	sortOrder === "asc" ? "demo-sorting-asc" : "demo-sorting-desc";
export const MOTIF_COLUMNS = [
	{
		dataField: glycanStrings.glycan_id.id,
		text: glycanStrings.glycan_id.name,
		sort: true,
		selected: true,
		headerStyle: (colum, colIndex) => {
			return { backgroundColor: "#4B85B6", color: "white" };
		},

		formatter: (value, row) => (
			<LineTooltip text="View glycan details">
				{/* <Navbar.Text
									as={NavLink}
									to={routeConstants.motifDetail + row.glytoucan_ac}>
									{row.glytoucan_ac}
								</Navbar.Text> */}
				<Link to={routeConstants.glycanDetail + row.glytoucan_ac}>
					{row.glytoucan_ac}
				</Link>
			</LineTooltip>
		),
	},
	{
		text: glycanStrings.glycan_image.name,
		sort: false,
		selected: true,
		formatter: (value, row) => (
			<div className="img-wrapper">
				<img
					className="img-cartoon-list-page5 img-cartoon"
					src={getGlycanImageUrl(row.glytoucan_ac)}
					alt="Glycan img"
				/>
			</div>
		),
		headerStyle: (colum, colIndex) => {
			return {
				textAlign: "left",
				backgroundColor: "#4B85B6",
				color: "white",
				whiteSpace: "nowrap",
			};
		},
	},
];
