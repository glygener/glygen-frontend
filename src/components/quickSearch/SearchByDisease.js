import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import quickSearchData from "../../data/json/quickSearch.json";
import AutoTextInput from "../input/AutoTextInput";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Button from "react-bootstrap/Button";
import TextAlert from "../alert/TextAlert";
import ExampleExploreControl from "../example/ExampleExploreControl";
import stringConstants from "../../data/json/stringConstants";
import HelpTooltip from "../tooltip/HelpTooltip";

/**
 * Quick search control for disease usecases.
 */
const SearchByGlycan = props => {
  let quickSearch = stringConstants.quick_search;
  let searchByDisease = quickSearchData.searchByDisease;

  return (
    <>
      <div id={props.id}>
        <section className="content-box-sm" style={{ margin: "0 auto" }}>
          <div className="quick-search-heading">
            <h4>{stringConstants.sidebar.search_by_disease.displayname}</h4>
          </div>
          <div className="quick-search">
            <Accordion
              id={quickSearch.question_11.id}
              defaultExpanded={props.questionId === quickSearch.question_11.id}
              expanded={props.panelExpanded.question_11}
              onChange={()=> props.togglePanelExpansion(quickSearch.question_11.id)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className="gg-blue-color" />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className="gg-blue-color">
                  {quickSearch.question_11.text.split("{0}")[0]}
                  <strong className="gg-blue-color">
                    {searchByDisease.common.label}
                  </strong>
                  {quickSearch.question_11.text.split("{0}")[1]}
                </Typography>
              </AccordionSummary>
              <form className="ms-2" onSubmit={(event) => {event.preventDefault(); if (props.inputValue.question_11.length <= searchByDisease.common.length) props.searchQuestion11()}}>
                <AccordionDetails>
                  <Grid container xs={12} sm={12}>
                    <Grid item xs={12} sm={12}>
                      <TextAlert
                        alertInput={
                          props.alertText.question === quickSearch.question_11.id
                            ? props.alertText.input
                            : props.alertText.default
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={7} className="quick-search-control">
                      <FormControl fullWidth variant="outlined">
                        <Typography className="search-lbl" gutterBottom>
                          <HelpTooltip
                            title={quickSearch.question_11.tooltip.title}
                            text={quickSearch.question_11.tooltip.text}
                            urlText={quickSearch.question_11.tooltip.urlText}
                            url={quickSearch.question_11.tooltip.url}
                          />
                          {searchByDisease.common.label}
                        </Typography>
                        <AutoTextInput
                          inputValue={props.inputValue.question_11}
                          setInputValue={input =>
                            props.setInputValue({ question_11: input })
                          }
                          required={true}
                          placeholder={searchByDisease.common.placeholder}
                          typeahedID={searchByDisease.common.typeahedID}
                          length={searchByDisease.common.length}
                          errorText={searchByDisease.common.errorText}
                        />
                        <ExampleExploreControl
                          setInputValue={input =>
                            props.setInputValue({ question_11: input })
                          }
                          inputValue={searchByDisease.common.examples}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2} className="quick-search-control">
                      <Typography gutterBottom>&nbsp;</Typography>
                      <Button
                        className="gg-btn-blue"
                        onClick={props.searchQuestion11}
                        disabled={
                          props.inputValue.question_11.trim().length === 0
                        }
                      >
                        Search
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </form>
            </Accordion>
          </div>
        </section>
      </div>
    </>
  );
};
export default SearchByGlycan;
