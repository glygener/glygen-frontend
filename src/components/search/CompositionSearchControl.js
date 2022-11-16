import React, { useState } from "react";
// import Select from '@mui/material/Select';
import OutlinedInput from "@mui/material/OutlinedInput";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import PropTypes from "prop-types";
// import MenuItem from '@mui/material/MenuItem';
import Typography from "@mui/material/Typography";
import Button from "react-bootstrap/Button";
import { Row } from "react-bootstrap";
import ReactHtmlParser from "react-html-parser";
import HelpTooltip from "../tooltip/HelpTooltip";
import SelectControl from "../select/SelectControl";
import CompositionSearchTemplate from "./CompositionSearchTemplate";
import glycanSearchData from "../../data/json/glycanSearch";
import "../../css/Search.css";

/**
 * Composition search control for glycan search.
 */
export default function CompositionSearchControl(props) {
  let compositionSearch = glycanSearchData.composition_search;

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [undoVal, setUndoVal] = useState({});
  const [redoDisabled, setRedoDisabled] = useState(true);
  const [undoDisabled, setUndoDisabled] = useState(true);
  const [compositionSearchTemplateSelect, setCompositionSearchTemplateSelect] = useState("");
  const [compositionSearchTemplate, setCompositionSearchTemplate] = useState(false);

  /**
   * Function to handle min input change event.
   */
  const minInputChange = (event) => {
    let compositionData = JSON.parse(JSON.stringify(props.inputValue));
    let comp = {
      min: event.target.value,
      selectValue: compositionData[event.target.name].selectValue,
      max: compositionData[event.target.name].max,
    };
    props.setInputValue({ [event.target.name]: comp });
  };

  /**
   * Function to handle max input change event.
   */
  const maxInputChange = (event) => {
    let compositionData = JSON.parse(JSON.stringify(props.inputValue));
    let comp = {
      min: compositionData[event.target.name].min,
      selectValue: compositionData[event.target.name].selectValue,
      max: event.target.value,
    };
    props.setInputValue({ [event.target.name]: comp });
  };

  /**
   * onSelControlChange sets min, max values based on user selection.
   * @param {object} select_control - Select control.
   * @param {object} min_val - min value control.
   * @param {object} max_val - max value control.
   * @param {string} residue - residue id.
   **/
  function onSelControlChange(sel_control_value, min_val, max_val, residue) {
    compSearchRedoReset();
    saveResidueStateToUndoList(residue, sel_control_value, parseInt(min_val), parseInt(max_val));

    let comp = {
      min: parseInt(min_val),
      selectValue: sel_control_value,
      max: parseInt(max_val),
    };

    var min = undefined;
    var max = undefined;
    var sel_residue = props.compositionInitMap.filter(function (res) {
      return residue === res.residue;
    })[0];
    if (sel_residue) {
      min = parseInt(sel_residue.min);
      max = parseInt(sel_residue.max);
    }
    if (sel_control_value === "maybe") {
      comp.selectValue = "maybe";
      comp.min = parseInt(min);
      if (parseInt(max_val) === max || parseInt(max_val) === min) comp.max = parseInt(max);
    } else if (sel_control_value === "yes") {
      comp.selectValue = "yes";
      comp.min = parseInt(min + 1);
      if (parseInt(max_val) === max || parseInt(max_val) === min) comp.max = parseInt(max);
    } else if (sel_control_value === "no") {
      comp.selectValue = "no";
      comp.min = parseInt(min);
      comp.max = parseInt(min);
    }
    props.setInputValue({ [residue]: comp });

    let compositionData = JSON.parse(JSON.stringify(props.inputValue));
    compositionData[residue] = comp;
    if (allNoTrue(compositionData)) {
      props.setCompSearchDisabled(true);
    } else {
      props.setCompSearchDisabled(false);
    }
    resetTemplateSelection();
  }

  /**
   * onResidueMinMoveOut sets min control value based on select option value.
   * @param {object} inputMin - min value.
   * @param {object} inputMax - max value.
   * @param {object} selOption - select option.
   * @param {string} residue - residue.
   **/
  function onResidueMinMoveOut(inputMin, inputMax, min, max, selOption, residue) {
    if (
      undoVal.residue === residue &&
      parseInt(undoVal.min) !== parseInt(inputMin) &&
      inputMin !== ""
    ) {
      compSearchRedoReset();
      saveResidueStateToUndoList(
        undoVal.residue,
        selOption,
        parseInt(undoVal.min),
        parseInt(undoVal.max)
      );
    }
    if (inputMin !== "") {
      if (parseInt(inputMin) < parseInt(min)) {
        inputMin = parseInt(min);
      }
      if (parseInt(inputMin) > parseInt(inputMax) && selOption !== "no") {
        if (parseInt(inputMin) < parseInt(max)) {
          inputMin = parseInt(inputMin);
          inputMax = parseInt(inputMin);
        } else {
          inputMin = parseInt(max);
          inputMax = parseInt(max);
        }
      } else if (parseInt(inputMin) > parseInt(min) && selOption === "no") {
        if (parseInt(inputMin) > parseInt(max)) {
          inputMin = parseInt(max);
          inputMax = parseInt(max);
        } else {
          inputMax = parseInt(inputMin);
        }
      }
    } else if (inputMin === "") {
      if (selOption === "maybe") {
        inputMin = parseInt(min);
      } else if (selOption === "yes") {
        inputMin = parseInt(min) + 1;
      } else if (selOption === "no") {
        inputMin = parseInt(min);
      }
    }
    let comp = {
      min: parseInt(inputMin),
      selectValue: props.getSelectionValue(
        parseInt(inputMin),
        parseInt(inputMax),
        parseInt(min),
        parseInt(max)
      ),
      max: parseInt(inputMax),
    };
    props.setInputValue({ [residue]: comp });

    let compositionData = JSON.parse(JSON.stringify(props.inputValue));

    if (parseInt(undoVal.min) !== parseInt(comp.min)) {
      resetTemplateSelection();
    }
    compositionData[residue] = comp;
    if (allNoTrue(compositionData)) {
      props.setCompSearchDisabled(true);
    } else {
      props.setCompSearchDisabled(false);
    }
  }

  /**
   * onResidueMaxMoveOut sets max control value based on select option value.
   * @param {string} inputMax - max value.
   * @param {string} inputMin - min value.
   * @param {string} selOption - select value.
   * @param {string} residue - residue.
   **/
  function onResidueMaxMoveOut(inputMax, inputMin, max, min, selOption, residue) {
    if (
      undoVal.residue === residue &&
      parseInt(undoVal.max) !== parseInt(inputMax) &&
      inputMax !== ""
    ) {
      compSearchRedoReset();
      saveResidueStateToUndoList(
        undoVal.residue,
        selOption,
        parseInt(undoVal.min),
        parseInt(undoVal.max)
      );
    }
    if (inputMax !== "") {
      if (parseInt(inputMax) > parseInt(max)) {
        inputMax = parseInt(max);
      }
      if (parseInt(inputMax) < parseInt(inputMin) && selOption !== "yes") {
        if (parseInt(inputMax) > parseInt(min)) {
          inputMax = parseInt(inputMax);
          inputMin = parseInt(inputMax);
        } else {
          inputMax = parseInt(min);
          inputMin = parseInt(min);
        }
      } else if (parseInt(inputMax) < parseInt(inputMin) && selOption === "yes") {
        if (parseInt(inputMax) < parseInt(min)) {
          inputMin = parseInt(min);
          inputMax = parseInt(min);
        } else {
          inputMin = parseInt(inputMax);
        }
      }
    } else if (inputMax === "") {
      if (selOption === "maybe") {
        inputMax = parseInt(max);
      } else if (selOption === "yes") {
        inputMax = parseInt(max);
      } else if (selOption === "no") {
        inputMax = parseInt(min);
      }
    }

    let comp = {
      min: parseInt(inputMin),
      selectValue: props.getSelectionValue(
        parseInt(inputMin),
        parseInt(inputMax),
        parseInt(min),
        parseInt(max)
      ),
      max: parseInt(inputMax),
    };
    props.setInputValue({ [residue]: comp });

    let compositionData = JSON.parse(JSON.stringify(props.inputValue));

    if (parseInt(undoVal.max) !== parseInt(comp.max)) {
      resetTemplateSelection();
    }
    compositionData[residue] = comp;
    if (allNoTrue(compositionData)) {
      props.setCompSearchDisabled(true);
    } else {
      props.setCompSearchDisabled(false);
    }
  }

  /**
   * saveResidueStateToUndoList saves residue state to undo list.
   * @param {string} residue - residue id.
   * @param {string} selOption - select option.
   * @param {int} min - min value.
   * @param {int} max - max value.
   **/
  function saveResidueStateToUndoList(residue, selOption, min, max) {
    var sel_residue = props.compositionInitMap.filter(function (res) {
      return residue === res.residue;
    })[0];
    let compData = {};
    compData[residue] = {
      min: parseInt(min),
      selectValue: props.getSelectionValue(
        parseInt(min),
        parseInt(max),
        parseInt(sel_residue.min),
        parseInt(sel_residue.max)
      ),
      max: parseInt(max),
    };

    let undoResStack = undoStack;
    undoResStack.push(compData);

    setUndoStack(undoResStack);
    if (undoStack.length > 0) {
      setUndoDisabled(false);
    }
  }

  /**
   * saveCurrentResidueStatesToUndoList saves current residue states to undo list.
   *  * @param {array} updated_res_list - residue list.
   **/
  function saveCurrentResidueStatesToUndoList(updated_res_list) {
    let compositionStateData = JSON.parse(JSON.stringify(props.inputValue));
    let undoResStack = undoStack;
    undoResStack.push(compositionStateData);
    setUndoStack(undoResStack);
    if (undoResStack.length > 0) {
      setUndoDisabled(false);
    }
  }

  /**
   * onMinMaxFocus sets residue values to undo_residue_val.
   * @param {object} selOption - select option.
   * @param {object} minVal - min value.
   * @param {object} maxVal - max value.
   * @param {string} residue - residue id.
   **/
  function onMinMaxFocus(selOption, minVal, maxVal, residue) {
    let undoResidue = {
      residue: residue,
      selectValue: selOption,
      min: parseInt(minVal),
      max: parseInt(maxVal),
    };
    setUndoVal(undoResidue);
  }

  /**
   * compSearchUndoRedo undo or redo button handler.
   * @param {string} option specifies "undo" or "redo" option.
   **/
  function compSearchUndoRedo(option) {
    var pre_state = undefined;
    var cur_state = undefined;
    if (option === "undo") {
      pre_state = undoStack.pop();
      cur_state = JSON.parse(JSON.stringify(props.inputValue));
      let redoResStack = redoStack;
      redoResStack.push(cur_state);
      setRedoStack(redoResStack);
    }
    if (option === "redo") {
      pre_state = redoStack.pop();
      cur_state = JSON.parse(JSON.stringify(props.inputValue));
      let undoResStack = undoStack;
      undoResStack.push(cur_state);
      setUndoStack(undoResStack);
    }

    props.setInputValue(pre_state);

    if (undoStack.length > 0) {
      setUndoDisabled(false);
    } else {
      setUndoDisabled(true);
    }
    if (redoStack.length > 0) {
      setRedoDisabled(false);
    } else {
      setRedoDisabled(true);
    }

    let compositionData = JSON.parse(JSON.stringify(props.inputValue));
    for (let residue in pre_state) {
      compositionData[residue].min = pre_state[residue].min;
      compositionData[residue].selectValue = pre_state[residue].selectValue;
      compositionData[residue].max = pre_state[residue].max;
    }

    if (allNoTrue(compositionData)) {
      props.setCompSearchDisabled(true);
    } else {
      props.setCompSearchDisabled(false);
    }
    resetTemplateSelection();
  }

  /**
   * compSearchRedoReset resets redo list.
   **/
  function compSearchRedoReset() {
    while (redoStack.length > 0) {
      redoStack.pop();
    }

    if (redoStack.length < 1) {
      setRedoDisabled(true);
    }
  }

  /**
   * compSearchStateChanged checks if current residue states are changed compared to values in residue list.
   * @param {array} compositionData - new residue list.
   * @param {array} inputCompStateData - current residue list.
   **/
  function compSearchStateChanged(compositionData, inputCompStateData) {
    var stateChanged = false;

    let compositionStateData = undefined;
    if (inputCompStateData !== undefined) {
      compositionStateData = inputCompStateData;
    } else {
      compositionStateData = props.inputValue;
    }

    for (let residue in compositionData) {
      if (parseInt(compositionStateData[residue].min) !== parseInt(compositionData[residue].min)) {
        stateChanged = true;
        break;
      }
      if (parseInt(compositionStateData[residue].max) !== parseInt(compositionData[residue].max)) {
        stateChanged = true;
        break;
      }
    }

    return stateChanged;
  }

  /**
   * Sets all options to yes.
   **/
  const allYes = () => {
    var compositionData = JSON.parse(JSON.stringify(props.inputValue));

    for (var x = 0; x < props.compositionInitMap.length; x++) {
      compositionData[props.compositionInitMap[x].residue].min = 1;
      compositionData[props.compositionInitMap[x].residue].selectValue = "yes";
      compositionData[props.compositionInitMap[x].residue].max = props.compositionInitMap[x].max;
    }
    if (compSearchStateChanged(compositionData)) {
      compSearchRedoReset();
      saveCurrentResidueStatesToUndoList(compositionData);
      resetTemplateSelection();
    }
    props.setInputValue(compositionData);
    props.setCompSearchDisabled(false);
  };

  /**
   * Sets all options to no.
   **/
  const allNo = () => {
    var compositionData = JSON.parse(JSON.stringify(props.inputValue));

    for (let residue in compositionData) {
      compositionData[residue].min = 0;
      compositionData[residue].selectValue = "no";
      compositionData[residue].max = 0;
    }

    if (compSearchStateChanged(compositionData)) {
      compSearchRedoReset();
      saveCurrentResidueStatesToUndoList(compositionData);
      resetTemplateSelection();
    }
    props.setInputValue(compositionData);
    props.setCompSearchDisabled(true);
  };

  /**
   * Returns true if all options are no.
   **/
  const allNoTrue = (inputCompStateData) => {
    var compositionData = JSON.parse(JSON.stringify(props.inputValue));

    for (let residue in compositionData) {
      compositionData[residue].min = 0;
      compositionData[residue].selectValue = "no";
      compositionData[residue].max = 0;
    }

    if (compSearchStateChanged(compositionData, inputCompStateData)) {
      return false;
    }
    return true;
  };

  /**
   * Sets all options to maybe.
   **/
  const allMaybe = () => {
    var compositionData = JSON.parse(JSON.stringify(props.inputValue));

    for (var x = 0; x < props.compositionInitMap.length; x++) {
      compositionData[props.compositionInitMap[x].residue].min = props.compositionInitMap[x].min;
      compositionData[props.compositionInitMap[x].residue].selectValue = "maybe";
      compositionData[props.compositionInitMap[x].residue].max = props.compositionInitMap[x].max;
    }

    if (compSearchStateChanged(compositionData)) {
      compSearchRedoReset();
      saveCurrentResidueStatesToUndoList(compositionData);
      resetTemplateSelection();
    }
    props.setInputValue(compositionData);
    props.setCompSearchDisabled(false);
  };

  /**
   * Loads template composition data.
   **/
  const loadCompositionSearchData = (compositionTemplateData) => {
    var compositionData = JSON.parse(JSON.stringify(props.inputValue));

    for (var x = 0; x < props.compositionInitMap.length; x++) {
      compositionData[props.compositionInitMap[x].residue].min = compositionTemplateData[
        props.compositionInitMap[x].residue
      ]
        ? compositionTemplateData[props.compositionInitMap[x].residue].min
        : 0;
      compositionData[props.compositionInitMap[x].residue].selectValue = compositionTemplateData[
        props.compositionInitMap[x].residue
      ]
        ? compositionTemplateData[props.compositionInitMap[x].residue].selectValue
        : "no";
      compositionData[props.compositionInitMap[x].residue].max = compositionTemplateData[
        props.compositionInitMap[x].residue
      ]
        ? compositionTemplateData[props.compositionInitMap[x].residue].max
        : 0;
    }

    if (compSearchStateChanged(compositionData)) {
      compSearchRedoReset();
      saveCurrentResidueStatesToUndoList(compositionData);
    }
    props.setInputValue(compositionData);
    props.setCompSearchDisabled(false);
  };

  /**
   * Resets template selection.
   **/
  const resetTemplateSelection = () => {
    setCompositionSearchTemplateSelect("");
  };

  return (
    <div>
      <CompositionSearchTemplate
        show={compositionSearchTemplate}
        loadCompositionSearchData={loadCompositionSearchData}
        setCompositionSearchTemplateSelect={setCompositionSearchTemplateSelect}
        compositionSearchTemplateSelect={compositionSearchTemplateSelect}
        title={compositionSearch.templateDialog.title}
        setOpen={(input) => {
          setCompositionSearchTemplate(input);
        }}
      />
      <Row className="gg-align-center ml-1 pt-3 pb-4">
        <Typography className={"search-lbl pt-1"} gutterBottom align="center">
          {compositionSearch.templateDialogLabel.title}
        </Typography>
        <Button className="gg-btn-outline ml-4" onClick={() => setCompositionSearchTemplate(true)}>
          Load Template
        </Button>
      </Row>
      <Grid container style={{ margin: 0 }} spacing={2} justify="center">
        <Grid item xs={4} sm={4} md={4}>
          <Typography className={"comp-search-label-header"} gutterBottom>
            Residue
          </Typography>
        </Grid>
        <Grid item xs={4} sm={3} md={2}>
          <Typography className={"comp-search-label-header"} gutterBottom align="center">
            Contains
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography className={"comp-search-label-header"} gutterBottom align="center">
            Min
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography className={"comp-search-label-header"} gutterBottom align="center">
            Max
          </Typography>
        </Grid>
      </Grid>
      {props.compositionInitMap &&
        props.compositionInitMap.map((key, index) => (
          <Grid
            key={key.residue}
            container
            style={{ margin: "0  auto" }}
            spacing={2}
            justify="center"
          >
            <Grid item xs={12} sm={4}>
              <Typography className={"search-lbl"}>
                <HelpTooltip
                  title={key.tooltip.title}
                  text={key.tooltip.text}
                  urlText={key.tooltip.urlText}
                  url={key.tooltip.url}
                  imageArray={key.tooltip.imageArray}
                />
                <strong>{key.name}</strong>
              </Typography>
              <Typography className={"comp-search-label-subtext"}>
                {ReactHtmlParser(key.subtext)}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <FormControl fullWidth>
                <SelectControl
                  inputValue={props.inputValue[key.residue].selectValue}
                  defaultValue={"maybe"}
                  variant="outlined"
                  margin="dense"
                  rootClass="select-menu"
                  name={key.residue}
                  menu={compositionSearch.contains}
                  setInputValue={(value, name, resName) => {
                    onSelControlChange(
                      value,
                      props.inputValue[key.residue].min,
                      props.inputValue[key.residue].max,
                      resName
                    );
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3} sm={2}>
              <FormControl fullWidth>
                <OutlinedInput
                  variant="outlined"
                  name={key.residue}
                  margin="dense"
                  value={props.inputValue[key.residue].min}
                  onChange={minInputChange}
                  onBlur={() =>
                    onResidueMinMoveOut(
                      props.inputValue[key.residue].min,
                      props.inputValue[key.residue].max,
                      key.min,
                      key.max,
                      props.inputValue[key.residue].selectValue,
                      key.residue
                    )
                  }
                  onFocus={() =>
                    onMinMaxFocus(
                      props.inputValue[key.residue].selectValue,
                      props.inputValue[key.residue].min,
                      props.inputValue[key.residue].max,
                      key.residue
                    )
                  }
                  inputProps={{
                    step: props.step,
                    min: key.min,
                    max: key.max,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3} sm={2}>
              <FormControl fullWidth>
                <OutlinedInput
                  variant="outlined"
                  margin="dense"
                  name={key.residue}
                  value={props.inputValue[key.residue].max}
                  onChange={maxInputChange}
                  onBlur={() =>
                    onResidueMaxMoveOut(
                      props.inputValue[key.residue].max,
                      props.inputValue[key.residue].min,
                      key.max,
                      key.min,
                      props.inputValue[key.residue].selectValue,
                      key.residue
                    )
                  }
                  onFocus={() =>
                    onMinMaxFocus(
                      props.inputValue[key.residue].selectValue,
                      props.inputValue[key.residue].min,
                      props.inputValue[key.residue].max,
                      key.residue
                    )
                  }
                  inputProps={{
                    step: props.step,
                    min: key.min,
                    max: key.max,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        ))}

      <Row className="gg-align-center pt-5">
        <Button
          className="gg-btn-outline mr-4 mb-3"
          onClick={() => setCompositionSearchTemplate(true)}
        >
          Load Template
        </Button>
        <Button className="gg-btn-outline mr-4 mb-3" onClick={allYes}>
          All Yes
        </Button>
        <Button className="gg-btn-outline mr-4 mb-3" onClick={allNo}>
          All No
        </Button>
        <Button className="gg-btn-outline mr-4 mb-3" onClick={allMaybe}>
          All Maybe
        </Button>
        <Button
          className="gg-btn-outline mr-4 mb-3"
          disabled={undoDisabled}
          onClick={() => compSearchUndoRedo("undo")}
        >
          Undo
        </Button>
        <Button
          className="gg-btn-outline mr-4 mb-3"
          disabled={redoDisabled}
          onClick={() => compSearchUndoRedo("redo")}
        >
          Redo
        </Button>
        <Button
          className="gg-btn-blue mb-3"
          disabled={props.compSearchDisabled}
          onClick={props.searchGlycanCompClick}
        >
          Search Glycan
        </Button>
      </Row>
    </div>
  );
}

CompositionSearchControl.propTypes = {
  step: PropTypes.number,
  inputValue: PropTypes.object,
  compositionInitMap: PropTypes.array,
  setCompositionData: PropTypes.func,
  getSelectionValue: PropTypes.func,
};
