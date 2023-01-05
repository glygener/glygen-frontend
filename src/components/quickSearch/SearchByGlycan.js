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

/**
 * Quick search control for glycan usecases.
 */
const SearchByGlycan = props => {
  let quickSearch = stringConstants.quick_search;
  let searchByGlycan = quickSearchData.searchByGlycan;

  return (
    <>
      <div id={props.id}>
        <section className="content-box-sm" style={{ margin: "0 auto" }}>
          <div className="quick-search-heading">
            <h4>{stringConstants.sidebar.search_by_glycan.displayname}</h4>
          </div>
          <div className="quick-search">
            <Accordion
              id={quickSearch.question_1.id}
              defaultExpanded={props.questionId === quickSearch.question_1.id}
              expanded={props.panelExpanded.question_1}
              onChange={()=> props.togglePanelExpansion(quickSearch.question_1.id)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className="gg-blue-color" />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className="gg-blue-color">
                  {quickSearch.question_1.text.split("{0}")[0]}
                  <strong className="gg-blue-color">
                    {searchByGlycan.common.label}
                  </strong>
                  {quickSearch.question_1.text.split("{0}")[1]}
                </Typography>
              </AccordionSummary>
              <form onSubmit={(event) => {event.preventDefault(); if (props.inputValue.question_1.length <= searchByGlycan.common.length) props.searchQuestion1()}}>
                <AccordionDetails>
                  <Grid container xs={12} sm={12}>
                    <Grid item xs={12} sm={12}>
                      <TextAlert
                        alertInput={
                          props.alertText.question === quickSearch.question_1.id
                            ? props.alertText.input
                            : props.alertText.default
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={7} className="quick-search-control">
                      <FormControl fullWidth variant="outlined">
                        <Typography className="qs-search-lbl" gutterBottom>
                          {searchByGlycan.common.label}
                        </Typography>
                        <AutoTextInput
                          inputValue={props.inputValue.question_1}
                          setInputValue={input =>
                            props.setInputValue({ question_1: input })
                          }
                          required={true}
                          placeholder={searchByGlycan.common.placeholder}
                          typeahedID={searchByGlycan.common.typeahedID}
                          length={searchByGlycan.common.length}
                          errorText={searchByGlycan.common.errorText}
                        />
                        <ExampleExploreControl
                          setInputValue={input =>
                            props.setInputValue({ question_1: input })
                          }
                          inputValue={searchByGlycan.common.examples}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2} className="quick-search-control">
                      <Typography gutterBottom>&nbsp;</Typography>
                      <Button
                        className="gg-btn-blue"
                        onClick={props.searchQuestion1}
                        disabled={props.inputValue.question_1.trim().length === 0}
                      >
                        Search
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </form>
            </Accordion>
            <Accordion
              id={quickSearch.question_2.id}
              defaultExpanded={props.questionId === quickSearch.question_2.id}
              expanded={props.panelExpanded.question_2}
              onChange={()=> props.togglePanelExpansion(quickSearch.question_2.id)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className="gg-blue-color" />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <Typography className="gg-blue-color">
                  {quickSearch.question_2.text.split("{0}")[0]}
                  <strong className="gg-blue-color">
                    {searchByGlycan.common.label}
                  </strong>
                  {quickSearch.question_2.text.split("{0}")[1]}
                </Typography>
              </AccordionSummary>
              <form onSubmit={(event) => {event.preventDefault(); if (props.inputValue.question_2.length <= searchByGlycan.common.length) props.searchQuestion2()}}>
                <AccordionDetails>
                  <Grid container xs={12} sm={12}>
                    <Grid item xs={12} sm={12}>
                      <TextAlert
                        alertInput={
                          props.alertText.question === quickSearch.question_2.id
                            ? props.alertText.input
                            : props.alertText.default
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={7} className="quick-search-control">
                      <FormControl fullWidth variant="outlined">
                        <Typography className="qs-search-lbl" gutterBottom>
                          {searchByGlycan.common.label}
                        </Typography>
                        <AutoTextInput
                          inputValue={props.inputValue.question_2}
                          setInputValue={input =>
                            props.setInputValue({ question_2: input })
                          }
                          required={true}
                          placeholder={searchByGlycan.common.placeholder}
                          typeahedID={searchByGlycan.common.typeahedID}
                          length={searchByGlycan.common.length}
                          errorText={searchByGlycan.common.errorText}
                        />
                        <ExampleExploreControl
                          setInputValue={input =>
                            props.setInputValue({ question_2: input })
                          }
                          inputValue={searchByGlycan.common.examples}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2} className="quick-search-control">
                      <Typography gutterBottom>&nbsp;</Typography>
                      <Button
                        className="gg-btn-blue"
                        onClick={props.searchQuestion2}
                        disabled={props.inputValue.question_2.trim().length === 0}
                      >
                        Search
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </form>
            </Accordion>
            <Accordion
              id={quickSearch.question_3.id}
              defaultExpanded={props.questionId === quickSearch.question_3.id}
              expanded={props.panelExpanded.question_3}
              onChange={()=> props.togglePanelExpansion(quickSearch.question_3.id)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className="gg-blue-color" />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
              >
                <Typography className="gg-blue-color">
                  {quickSearch.question_3.text.split("{0}")[0]}
                  <strong className="gg-blue-color">
                    {searchByGlycan.common.label}
                  </strong>
                  {quickSearch.question_3.text.split("{0}")[1]}
                </Typography>
              </AccordionSummary>
              <form onSubmit={(event) => {event.preventDefault(); if (props.inputValue.question_3.length <= searchByGlycan.common.length) props.searchQuestion3()}}>
                <AccordionDetails>
                  <Grid container xs={12} sm={12}>
                    <Grid item xs={12} sm={12}>
                      <TextAlert
                        alertInput={
                          props.alertText.question === quickSearch.question_3.id
                            ? props.alertText.input
                            : props.alertText.default
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={7} className="quick-search-control">
                      <FormControl fullWidth variant="outlined">
                        <Typography className="qs-search-lbl" gutterBottom>
                          {searchByGlycan.common.label}
                        </Typography>
                        <AutoTextInput
                          inputValue={props.inputValue.question_3}
                          setInputValue={input =>
                            props.setInputValue({ question_3: input })
                          }
                          required={true}
                          placeholder={searchByGlycan.common.placeholder}
                          typeahedID={searchByGlycan.common.typeahedID}
                          length={searchByGlycan.common.length}
                          errorText={searchByGlycan.common.errorText}
                        />
                        <ExampleExploreControl
                          setInputValue={input =>
                            props.setInputValue({ question_3: input })
                          }
                          inputValue={searchByGlycan.common.examples}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2} className="quick-search-control">
                      <Typography gutterBottom>&nbsp;</Typography>
                      <Button
                        className="gg-btn-blue"
                        onClick={props.searchQuestion3}
                        disabled={props.inputValue.question_3.trim().length === 0}
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
