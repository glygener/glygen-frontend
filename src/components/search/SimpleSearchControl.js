import React from "react";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import FormHelperText from "@mui/material/FormHelperText";
import ExampleControl from "../example/ExampleControl";
import SelectControl from "../select/SelectControl";
import "../../css/Search.css";

/**
 * Simple search control for protein search and glycan search
 */
export default function SimpleSearchControl(props) {
  const { database = "GlyGen" } = props;
  /**
   * Function to set simple search term value.
   * @param {string} value - input simple search term value.
   **/
  const simpleSearchCategoryOnChange = value => {
    props.setSimpleSearchCategory(value);
  };

  /**
   * Function to handle onchange event for simple search term.
   * @param {object} event - event object.
   **/
  const simpleSearchTermOnChange = event => {
    props.setSimpleSearchTerm(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (props.simpleSearchTerm.length <= props.length)
        props.searchSimpleClick();
    }
  };

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        if (props.simpleSearchTerm.length <= props.length)
          props.searchSimpleClick();
      }}
      onKeyDown={handleKeyDown}
    >
      <Grid container spacing={3} justifyContent="center">
        <Grid item size={{ xs: 12, sm: 3 }}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel className={"select-lbl-inline"}>
              {props.simpleSearchCategoryLabel}
            </InputLabel>
            <SelectControl
              inputValue={props.simpleSearchCategory}
              rootClass="select-menu"
              label={props.simpleSearchCategoryLabel}
              // labelWidth={80}
              menu={props.simple_search_category.map(category => {
                return { id: category.id, name: category.display };
              })}
              setInputValue={simpleSearchCategoryOnChange}
            />
          </FormControl>
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <OutlinedInput
            fullWidth
            required
            placeholder={
              props.simple_search !== undefined &&
              props.simple_search[props.simpleSearchCategory]
                ? props.simple_search[props.simpleSearchCategory].placeholder
                : ""
            }
            value={props.simpleSearchTerm}
            onChange={simpleSearchTermOnChange}
            error={props.simpleSearchTerm.length > props.length}
          />
          {props.simpleSearchTerm.length > props.length && (
            <FormHelperText className={"error-text"} error>
              {props.errorText}
            </FormHelperText>
          )}
          <ExampleControl
            exampleMap={props.simple_search}
            type={props.simpleSearchCategory}
            setInputValue={input => {
              props.setSimpleSearchTerm(input);
            }}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 2 }}>
          <Button
            className="gg-btn-blue gg-btn-simple-search"
            disabled={
              props.simpleSearchTerm.trim() === "" ||
              props.simpleSearchTerm.length > props.length
            }
            onClick={props.searchSimpleClick}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <br />
      <Grid container spacing={3} justifyContent="center">
        {props.simple_search_category !== undefined &&
              props.simple_search_category.length > 0 && 
              props.simple_search_category.find(obj => obj.id === props.simpleSearchCategory).message ?
          <Grid className={"small-text"} item>
            *{" "}Category{" "}
            <em>
              "<strong>{props.simpleSearchCategory}</strong>"
            </em><strong>{":"}</strong>{" "}
              {props.simple_search_category.find(obj => obj.id === props.simpleSearchCategory).message}
            {" *"}
          </Grid> :
          <Grid className={"small-text"} item>
            *{" "}Category{" "}
            <em>
              "<strong>Any</strong>" 
            </em>{" "}
            allows you to search an entire {database} database, including the context
            match. *
          </Grid>}
      </Grid>
    </form>
  );
}

SimpleSearchControl.propTypes = {
  simpleSearchCategory: PropTypes.string,
  simpleSearchCategoryLabel: PropTypes.string,
  simpleSearchTerm: PropTypes.string,
  simple_search_category: PropTypes.array,
  simple_search: PropTypes.object,
  errorText: PropTypes.string,
  length: PropTypes.number,
  searchSimpleClick: PropTypes.func,
  setGlySimpleSearchCategory: PropTypes.func,
  setGlySimpleSearchTerm: PropTypes.func
};
