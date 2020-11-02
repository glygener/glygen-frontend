import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import quickSearchData from "../../data/json/quickSearch.json";
import AutoTextInput from "../input/AutoTextInput";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Button from "react-bootstrap/Button";
import TextAlert from "../alert/TextAlert";
import ExampleExploreControl from "../example/ExampleExploreControl";
import stringConstants from "../../data/json/stringConstants";

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
            <ExpansionPanel
              id={quickSearch.question_1.id}
              defaultExpanded={props.questionId === quickSearch.question_1.id}
            >
              <ExpansionPanelSummary
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
              </ExpansionPanelSummary>
              <form onSubmit={(event) => {event.preventDefault(); if (props.inputValue.question_1.length <= searchByGlycan.common.length) props.searchQuestion1()}}>
                <ExpansionPanelDetails>
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
                    <Grid item xs={12} sm={6} className="quick-search-control">
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
                </ExpansionPanelDetails>
              </form>
            </ExpansionPanel>
            <ExpansionPanel
              id={quickSearch.question_2.id}
              defaultExpanded={props.questionId === quickSearch.question_2.id}
            >
              <ExpansionPanelSummary
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
              </ExpansionPanelSummary>
              <form onSubmit={(event) => {event.preventDefault(); if (props.inputValue.question_2.length <= searchByGlycan.common.length) props.searchQuestion2()}}>
                <ExpansionPanelDetails>
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
                    <Grid item xs={12} sm={6} className="quick-search-control">
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
                </ExpansionPanelDetails>
              </form>
            </ExpansionPanel>
            <ExpansionPanel
              id={quickSearch.question_3.id}
              defaultExpanded={props.questionId === quickSearch.question_3.id}
            >
              <ExpansionPanelSummary
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
              </ExpansionPanelSummary>
              <form onSubmit={(event) => {event.preventDefault(); if (props.inputValue.question_3.length <= searchByGlycan.common.length) props.searchQuestion3()}}>
                <ExpansionPanelDetails>
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
                    <Grid item xs={12} sm={6} className="quick-search-control">
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
                </ExpansionPanelDetails>
              </form>
            </ExpansionPanel>
          </div>
        </section>
      </div>
    </>
  );
};
export default SearchByGlycan;
