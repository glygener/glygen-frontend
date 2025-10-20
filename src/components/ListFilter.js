import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import { Checkbox, Collapse } from "@mui/material";
import "../css/Sidebar.css";
import Button from "react-bootstrap/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
const PREFIX = 'ListFilter';

const classes = {
  root: `${PREFIX}-root`,
  checked: `${PREFIX}-checked`
};

const Root = styled('div')({
  [`& .${classes.root}`]: {
    color: "#979797",
    "&$checked": {
      color: "#2f78b7"
    }
  },
  [`& .${classes.checked}`]: {}
});

const BlueCheckbox = (props => <Checkbox {...props} />);

// let advancedSearch = proteinSearchData.advanced_search;
const ListFilterOptionGroup = props => {
  const { type, onFilterChange, filterOperations, filterReset, setFilterReset } = props;
  const [optionState, setOptionState] = useState([...type.options]);
  const [selection, setSelection] = useState(null);
  const [annotationOperation, setAnnotationOperation] = useState(
    type.operator || "OR"
  );
  // sort by order field
  const sortedOptions = [...type.options].sort((a, b) => {
    if (a.order < b.order) return -1;
    if (b.order < a.order) return 1;
    return 0;
  });

  const handleOptionChange = event => {
    // get the value (which option) and checked state
    const { checked, value } = event.target;
    const newOptionState = [...optionState];
    newOptionState.find(item => item.id === value).selected = checked;
    setOptionState(newOptionState);
  };

  // Updates the UI when the filters change from the server side
  useEffect(() => {
    if (!(annotationOperation && optionState)) {
      return;
    }
    const selectedOptions = optionState
      .filter(item => item.selected)
      .map(item => item.id);

    const filter = {
      id: type.id,
      operator: annotationOperation,
      selected: selectedOptions
    };

    if (selectedOptions !== selection) {
      setSelection(selectedOptions);
      onFilterChange(filter);
    }
  }, [annotationOperation, optionState]);

  useEffect(() => {
    if (filterReset > 0) {
      const newOptionState = optionState
      .map(item => {item.selected = false; return item });
      setOptionState(newOptionState);
      setFilterReset && setFilterReset(filterReset - 1);
    }
  }, [filterReset]);

  return (
    <>
      <Root className="pb-1">
        <div className="sidebar-header">
          <h6 className="color-white nowrap d-inline-block">{type.label}</h6>
          {filterOperations === true && <select
            className="select-dropdown float-end pt-0"
            value={annotationOperation}
            onChange={event => setAnnotationOperation(event.target.value)}
          >
            <option value="OR">OR</option>
            <option value="AND">AND</option>
          </select>}
        </div>
        {/* <div className="parentElement">{type.label}</div> */}
        <ul className="list-unstyled mt-0 mb-0 pt-1">
          {sortedOptions &&
            sortedOptions.map(option => (
              <li key={option.id}>
                <FormControlLabel
                  className="ps-3 mt-0 mb-0 pt-0 pb-0"
                  control={
                    <BlueCheckbox
                      value={option.id}
                      checked={option.selected}
                      onChange={handleOptionChange}
                      size="small"
                      className="pt-1 pb-1"
                      classes={{
                        root: classes.root,
                        checked: classes.checked
                      }} />
                  }
                  label={`${option.label}` + `${option && option.count !== undefined ? ` (${option.count})` : ''}`}
                />
              </li>
            ))}
        </ul>
      </Root>
    </>
  );
};

// Master Component that controls each group of filters
// Tracks current selection state vs options to trigger
// server side update
const ListFilter = ({
  availableOptions = [],
  selectedOptions = [],
  onFilterChange,
  filterOperations = true,
  filterReset = 0,
  setFilterReset = undefined
}) => {

  // If nothing available, exit
  if (!availableOptions.length) {
    return <></>;
  }

  // create new array, holding integrated available / selected data
  const filterGroupData = availableOptions.map(group => {
    // See if there is an entry in the selected values for this type
    const selectGroup = selectedOptions.find(
      selected => selected.id === group.id
    );

    // create a return that is the same except for selection
    return {
      ...group,
      options: group.options.map(option => ({
        ...option,
        // false if no matching group in selection, or see if its in the selection
        selected: selectGroup
          ? selectGroup.selected.indexOf(option.id) > -1
          : false
      }))
    };
  });

  // sort by order field
  filterGroupData.sort((a, b) => {
    if (a.order < b.order) return -1;
    if (b.order < a.order) return 1;
    return 0;
  });

  return (
    <div>
      {filterGroupData.map(type => (
        <div key={type.id}>
          <ListFilterOptionGroup type={type} onFilterChange={onFilterChange} filterOperations={filterOperations} 
           filterReset={filterReset} setFilterReset={setFilterReset} />
        </div>
      ))}
    </div>
  );
};

export default ListFilter;
