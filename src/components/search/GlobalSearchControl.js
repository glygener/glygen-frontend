import React, {useState} from 'react';
import { useHistory } from "react-router"
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import {logActivity} from '../../data/logging';
import routeConstants from '../../data/json/routeConstants';
import '../../css/globalSearch.css';

export default function GlobalSearchControl(props) {
   
    let history = useHistory();
    const [globalSearchTerm, setGlobalSearchTerm] = useState('');

    function globalSearchTermChange(searchTerm) {
        setGlobalSearchTerm(searchTerm);
    }

    const globalSearchTermOnChange = (event) => {
        setGlobalSearchTerm(event.target.value);
    }

	const globalSearchStart = (event) => {
        event.preventDefault(); 
        logActivity("user", globalSearchTerm, "Performing Global Search");
        history.push(routeConstants.globalSearchResult + globalSearchTerm.substring(0, 100));
	}

	return (
    <Paper component="form" onSubmit={globalSearchStart} className={"gs-comp-paper"}>
        <InputBase
            value={globalSearchTerm}
            required
            onChange={globalSearchTermOnChange}
            className={"gs-input"}
            placeholder="Search..."
            inputProps={{ 'aria-label': 'search' }}
        />
        <Divider className={"gs-divider"} orientation="vertical" />
        <IconButton disabled={globalSearchTerm.length < 1} onClick={globalSearchStart} className="gs-icon-button" aria-label="search">
            <SearchIcon />
        </IconButton>
    </Paper>
	);
}

GlobalSearchControl.propTypes = {
    globalSearchTermChange : PropTypes.func
};
