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
 * Global search card component to show two types of search results on the card.
 */
export default function GlobalSearchDualCard(props) {

	return (
        <div className={"global-search-card"}>
			<Card className={"card"}>
                <Table style={{margin:"0px", padding:"0px"}}>
                    <TableHead>
                        <TableRow hover className="card-row">
                            <TableCell align="center" colSpan={3}>
                                <h4><strong>
                                    <RouteLink
                                        text1={String(props.allCount1)}
                                        text2= {props.cardTitle1}
                                        disabled={Number(props.allCount1) === 0}
                                        link={props.route + props.allListId1 + "/" + props.routeTerm}
                                    />
                                    <span> / </span>
                                    <RouteLink
                                        text1={String(props.allCount2)}
                                        text2={props.cardTitle2}
                                        disabled={Number(props.allCount2) === 0}
                                        link={props.route + props.allListId2 + "/" + props.routeTerm}
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
                            <TableCell  className={"gs-cell-center"} classes={{head: "gs-cell"}}>
                            <span><strong>{props.colHeading3}</strong></span>
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
                                    text1={String(items.count1)}
                                    disabled={Number(items.count1) === 0}
                                    link={props.route + items.list_id1 + "/" + props.routeTerm}
                                />
                            </TableCell>
                            <TableCell className={"gs-cell-center"} classes={{body: "gs-cell"}}>
                                <RouteLink
                                    text1={String(items.count2)}
                                    disabled={Number(items.count2) === 0}
                                    link={props.route + items.list_id2 + "/" + props.routeTerm}
                                />
                            </TableCell>
                        </TableRow>))}
                    </TableBody>
                </Table>
			</Card>
		</div>
	);
}

GlobalSearchDualCard.propTypes = {
    cardTitle1: PropTypes.string,
    cardTitle2: PropTypes.string,
    term: PropTypes.string,
    routeTerm: PropTypes.string,
    allCount1: PropTypes.number,
    allListId1: PropTypes.string,
    allCount2: PropTypes.number,
    allListId2: PropTypes.string,
    colHeading1: PropTypes.string,
    colHeading2: PropTypes.string,
    colHeading3: PropTypes.string,
    searchItems: PropTypes.array
};
