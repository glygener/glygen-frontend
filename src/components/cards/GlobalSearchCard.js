import React from "react";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import RouteLink from '../Link/RouteLink.js'
import {sortDropdown} from '../../utils/common';
import "../../css/Search.css";

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
                                <h5><strong>{'match for'}{' '}{props.term}</strong></h5>
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
                        {props.searchItems.sort(sortDropdown).map( items => 
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
