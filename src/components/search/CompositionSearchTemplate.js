import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import Button from 'react-bootstrap/Button';
import { Dialog } from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import SelectControl from '../select/SelectControl';
import stringConstants from '../../data/json/stringConstants';
import HelpTooltip from '../tooltip/HelpTooltip';
import glycanSearchData from '../../data/json/glycanSearch';
import Grid from '@material-ui/core/Grid';
import {sortByOrder} from '../../utils/common';

/**
 * Dialog component to show query.
 */
export default function CompositionSearchTemplate(props) {

  let compositionSearchJSONData = glycanSearchData.composition_search;
  let compositionSearchData = stringConstants.glycan.composition_search;
  const [compositionSearchTemplateSelect, setCompositionSearchTemplateSelect] = useState("");

  /**
   * useEffect for setting select value.
  */
  useEffect(() => {
    setCompositionSearchTemplateSelect(props.compositionSearchTemplateSelect);
  }, [props.compositionSearchTemplateSelect]);

  return (
        <Dialog
            open={props.show}
            fullWidth
            classes= {{
                paper: "alert-dialog",
            }}
            style={{margin:40}}
            disableScrollLock
            onClose={() => {
                setCompositionSearchTemplateSelect(props.compositionSearchTemplateSelect);
                props.setOpen(false);
            }} 
        >    
            <div 
                id="contents"
                className="gf-content-div"
             >
            <h5 className= "alert-dialog-title">{props.title}</h5>
            <div className="alert-dialog-content"
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
                                        title={compositionSearchData.template_select.tooltip.title}
                                        text={compositionSearchData.template_select.tooltip.text}
                                    />
                                    {compositionSearchData.template_select.name}
                                </Typography>
                                <SelectControl
                                    inputValue={compositionSearchTemplateSelect}
                                    placeholder={compositionSearchJSONData.template_select.placeholder}
                                    placeholderId={compositionSearchJSONData.template_select.placeholderId}
                                    placeholderName={compositionSearchJSONData.template_select.placeholderName}
                                    menu={compositionSearchJSONData.template_select.template_list}
                                    sortFunction={sortByOrder}
                                    setInputValue={(value) => setCompositionSearchTemplateSelect(value)}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={11} sm={11} className="pl-3 pr-3 pb-4 pt-4">  
                            <Button
                                className= "gg-btn-blue"
                                style={{ float: "right" }}
                                onClick={() => {
                                    props.setCompositionSearchTemplateSelect(compositionSearchTemplateSelect);
                                    if (compositionSearchTemplateSelect !== compositionSearchJSONData.template_select.placeholderId){
                                        props.loadCompositionSearchData(
                                            compositionSearchJSONData.template_select.template_list.find(option => option.id === compositionSearchTemplateSelect).template
                                        );
                                    }
                                    props.setOpen(false);
                                }}
                            >
                                Load
                            </Button> 
                            <Button
                                className= "gg-btn-outline mr-4"
                                style={{ float: "right" }}
                                onClick={() => {
                                    setCompositionSearchTemplateSelect(props.compositionSearchTemplateSelect);
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

CompositionSearchTemplate.propTypes = {
  show: PropTypes.bool,
  loadCompositionSearchData: PropTypes.func,
  compositionSearchTemplateSelect: PropTypes.string,
  setCompositionSearchTemplateSelect: PropTypes.func,
  title: PropTypes.string,
  setOpen: PropTypes.func
};