import React, {useState, useEffect, useContext} from "react";
import PropTypes from "prop-types";
import Button from 'react-bootstrap/Button';
import { Dialog } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import HelpTooltip from '../tooltip/HelpTooltip';
import Grid from '@mui/material/Grid';
import OutlinedInput from "@mui/material/OutlinedInput";
import { addIDsToStore } from "../../data/idCartApi"
import GlyGenNotificationContext from "../GlyGenNotificationContext.js";

/**
 * Dialog component to show query.
 */
export default function ListIDNameDialog(props) {
  const [listIDName, setListIDName] = useState("");
  const {showTotalCartIdsNotification} = useContext(GlyGenNotificationContext);

  return (
        <Dialog
            open={props.listIDOpen}
            maxWidth={'lg'}
            classes= {{
                paper: "alert-dialog",
            }}
            style={{margin:40}}
            disableScrollLock
            onClose={() => {
                props.setListIDOpen(false);
            }} 
        >    
            <div 
                id="contents"
                className="gf-content-div"
             >
            <h5 className= "alert-dialog-title" style={{minWidth: '800px' }}>{"Add List ID To Cart"}</h5>
            <div className="alert-dialog-content"
                style={{minWidth: '800px' }}
            >
                <Grid
                    container
                    style={{ margin: '0  auto' }}
                    justifyContent='center'>
                        <Grid item size= {{ xs: 11, sm: 11 }} className="ps-3 pe-3 pb-4 pt-2">
                            <FormControl
                                fullWidth
                                variant='outlined'
                            >
                                <Typography className={'search-lbl'} gutterBottom>
                                    <HelpTooltip
                                        title={"List ID Name"}
                                    />
                                    {"List ID Name"}
                                </Typography>
                                <OutlinedInput
                                    fullWidth
                                    required
                                    margin='dense'
                                    placeholder={"Enter List ID Name"}
                                    value={listIDName}
                                    classes={{
                                    input: 'input-auto'
                                    }}
                                    onChange={(event) => {
                                        setListIDName(event.target.value);
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item size= {{ xs: 11, sm: 11 }} className="ps-3 pe-3 pb-4 pt-4">  
                            <Button
                                className= "gg-btn-blue"
                                style={{ float: "right" }}
                                disabled={listIDName === ""}
                                onClick={() => {
                                    let totalCartCount = addIDsToStore(props.type, [{name:listIDName, listId:props.listId, 
                                        listCacheId:props.listCacheId, appliedFilters:props.appliedFilters, aiQuery: props.aiQuery,
                                        searchQuery:props.searchQuery, queryType:props.queryType, 
                                        columns:props.columns, totalSize:props.totalSize}]);
                                    showTotalCartIdsNotification(totalCartCount);
                                    props.setListIDOpen(false);
                                }}
                            >
                                Add List ID
                            </Button> 
                            <Button
                                className= "gg-btn-outline me-4"
                                style={{ float: "right" }}
                                onClick={() => {
                                    props.setListIDOpen(false);
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

ListIDNameDialog.propTypes = {
  show: PropTypes.bool,
  executeSuperSearchQuery: PropTypes.func,
  superSearchQuerySelect: PropTypes.string,
  setSuperSearchQuerySelect: PropTypes.func,
  title: PropTypes.string,
  setOpen: PropTypes.func
};