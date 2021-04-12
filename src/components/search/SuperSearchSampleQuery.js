import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import Button from 'react-bootstrap/Button';
import { Dialog } from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import SelectControl from '../select/SelectControl';
import stringConstants from '../../data/json/stringConstants';
import HelpTooltip from '../tooltip/HelpTooltip';
import superSearchData from '../../data/json/superSearchData';
import Grid from '@material-ui/core/Grid';

/**
 * Dialog component to show query.
 */
export default function SuperSearchSampleQuery(props) {

  let superSearchJSONData = superSearchData.super_search;
  let commonSuperSearchData = stringConstants.super_search.common;
  const [superSearchQuerySelect, setSuperSearchQuerySelect] = useState("");

  /**
   * useEffect for setting select value.
  */
  useEffect(() => {
    setSuperSearchQuerySelect(props.superSearchQuerySelect);
  }, [props.superSearchQuerySelect]);

  return (
        <Dialog
            open={props.show}
            maxWidth={'lg'}
            classes= {{
                paper: "alert-dialog",
            }}
            style={{margin:40}}
            disableScrollLock
            onClose={() => {
                setSuperSearchQuerySelect(props.superSearchQuerySelect);
                props.setOpen(false);
            }} 
        >    
            <div 
                id="contents"
                className="gf-content-div"
             >
            <h5 className= "alert-dialog-title" style={{minWidth: '800px' }}>{props.title}</h5>
            <div className="alert-dialog-content"
                style={{minWidth: '800px' }}
            >
                <Grid
                    container
                    style={{ margin: '0  auto' }}
                    justify='center'>
                        <Grid item xs={11} sm={11} className="pl-3 pr-3 pb-4 pt-2">
                            <FormControl
                                fullWidth
                                variant='outlined'
                            >
                                <Typography className={'search-lbl'} gutterBottom>
                                    <HelpTooltip
                                        title={commonSuperSearchData.query_select.tooltip.title}
                                        text={commonSuperSearchData.query_select.tooltip.text}
                                    />
                                    {commonSuperSearchData.query_select.name}
                                </Typography>
                                <SelectControl
                                    inputValue={superSearchQuerySelect}
                                    placeholder={superSearchJSONData.query_select.placeholder}
                                    placeholderId={superSearchJSONData.query_select.placeholderId}
                                    placeholderName={superSearchJSONData.query_select.placeholderName}
                                    menu={superSearchJSONData.query_select.query_list}
                                    setInputValue={(value) => setSuperSearchQuerySelect(value)}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={11} sm={11} className="pl-3 pr-3 pb-4 pt-4">  
                            <Button
                                className= "gg-btn-blue"
                                style={{ float: "right" }}
                                onClick={() => {
                                    props.setSuperSearchQuerySelect(superSearchQuerySelect);
                                    props.executeSuperSearchQuery(superSearchQuerySelect === superSearchJSONData.query_select.placeholderId ? [] 
                                    : superSearchJSONData.query_select.query_list.find(option => option.id === superSearchQuerySelect).query, true);
                                    props.setOpen(false);
                                }}
                            >
                                Search
                            </Button> 
                            <Button
                                className= "gg-btn-outline mr-4"
                                style={{ float: "right" }}
                                onClick={() => {
                                    setSuperSearchQuerySelect(props.superSearchQuerySelect);
                                    props.setOpen(false);
                                }}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </Dialog>
  );
}

SuperSearchSampleQuery.propTypes = {
  show: PropTypes.bool,
  executeSuperSearchQuery: PropTypes.func,
  superSearchQuerySelect: PropTypes.string,
  setSuperSearchQuerySelect: PropTypes.func,
  title: PropTypes.string,
  setOpen: PropTypes.func
};