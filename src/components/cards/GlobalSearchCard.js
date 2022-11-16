import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import RouteLink from '../Link/RouteLink.js'
import {sortDropdownIgnoreCase} from '../../utils/common';
import "../../css/Search.css";

/**
 * Global search card component to show search results on the card.
 */
export default function GlobalSearchCard(props) {

	return (
        <div className={"global-search-card"}>
			<Card className={"card"}>
                <Table style={{margin:"0px", padding:"0px"}}>
                    <TableHead>
                        <TableRow hover className="card-row">
                            <TableCell align="center" colSpan={2}>
                                <h4><strong>
                                    <RouteLink
                                        text1={String(props.allCount)}
                                        text2={props.cardTitle}
                                        disabled={Number(props.allCount) === 0}
                                        link={props.route + props.allListId + "/" + props.routeTerm}
                                    />
                                </strong></h4>
                            </TableCell>
                        </TableRow>
                        <TableRow hover className="card-row">
                            <TableCell classes={{head: "gs-cell"}}>
                                <span><strong>{props.colHeading1}</strong></span>
                            </TableCell>
                            <TableCell className={"gs-cell-center"} classes={{head: "gs-cell"}}>
                                <span><strong>{props.colHeading2}</strong></span>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.searchItems.sort(sortDropdownIgnoreCase).map( items => 
                        (items.name !== "all" && <TableRow key={items.name} hover className="card-row">
                            <TableCell className={"gs-cell-left"} classes={{body: "gs-cell"}}>
                                <span>{items.name[0].toUpperCase() + items.name.slice(1)}</span>
                            </TableCell>
                            <TableCell className={"gs-cell-center"} classes={{body: "gs-cell"}}>
                                <RouteLink
                                    text1={String(items.count)}
                                    disabled={Number(items.count) === 0}
                                    link={props.route + items.list_id + "/" + props.routeTerm}
                                />
                            </TableCell>
                        </TableRow>))}
                    </TableBody>
                </Table>
			</Card>
		</div>
	);
}

GlobalSearchCard.propTypes = {
    cardTitle: PropTypes.string,
    term: PropTypes.string,
    routeTerm: PropTypes.string,
    allCount: PropTypes.number,
    allListId: PropTypes.string,
    colHeading1: PropTypes.string,
    colHeading2: PropTypes.string,
    searchItems: PropTypes.array
};
