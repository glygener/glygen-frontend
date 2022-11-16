import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import HelpOutline from '@mui/icons-material/HelpOutline';

/**
 * LineTooltip component for showing one line text.
 */
const LineTooltip = (props) => {
    return(
        <>
            {props.text && props.text !== "" && <Tooltip
                disableTouchListener
                arrow
                placement={props.placement ? props.placement : 'bottom-start'}
                classes={{
                    tooltip : 'gg-tooltip'
                }}
                title={props.text}
            >
                {props.children ? props.children : <HelpOutline className= {props.helpIcon ? props.helpIcon : "gg-helpicon"}/>}
            </Tooltip>}
            {(props.text === undefined || props.text === "") && 
                <div>{props.children}</div>
            }
        </>
    );
}

export default LineTooltip;

LineTooltip.propTypes = {
    text: PropTypes.string,
};