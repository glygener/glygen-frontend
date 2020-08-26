import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import HelpOutline from '@material-ui/icons/HelpOutline';

const LineTooltip = (props) => {
    return(
    <Tooltip
        disableTouchListener
        arrow
        placement={props.placement ? props.placement : 'bottom-start'}
        classes={{
            tooltip : 'gg-tooltip'
        }}
        title={props.text}
    >
        {props.children ? props.children : <HelpOutline className= {props.helpIcon ? props.helpIcon : "gg-helpicon"}/>}
    </Tooltip>
    );
}

export default LineTooltip;

LineTooltip.propTypes = {
    text: PropTypes.string,
};