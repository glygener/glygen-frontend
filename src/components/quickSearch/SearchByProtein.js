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
import TextAlert from "../alert/TextAlert";
import Button from "react-bootstrap/Button";
import ExampleExploreControl from "../example/ExampleExploreControl";
import stringConstants from "../../data/json/stringConstants";

const SearchByProtein = props => {
  let quickSearch = stringConstants.quick_search;
  let searchByProtein = quickSearchData.searchByProtein;

  return (
    <>
      <div id={props.id}>
        <section className="content-box-sm" style={{ margin: "0 auto" }}>
          <div className="quick-search-heading">
            <h4>{stringConstants.sidebar.search_by_protein.displayname}</h4>
          </div>
          <div className="quick-search">
            <ExpansionPanel
              id={quickSearch.question_4.id}
              defaultExpanded={props.questionId === quickSearch.question_4.id}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon className="gg-blue-color" />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className="gg-blue-color">
                  {quickSearch.question_4.text.split("{0}")[0]}
                  <strong className="gg-blue-color">
                    {searchByProtein.common.label}
                  </strong>
                  {quickSearch.question_4.text.split("{0}")[1]}
                </Typography>
              </ExpansionPanelSummary>
              <form onSubmit={(event) => {event.preventDefault(); if (props.inputValue.question_4.length <= searchByProtein.common.length) props.searchQuestion4()}}>
                <ExpansionPanelDetails>
                  <Grid container xs={12} sm={12}>
                    <Grid item xs={12} sm={12}>
                      <TextAlert
                        alertInput={
                          props.alertText.question === quickSearch.question_4.id
                            ? props.alertText.input
                            : props.alertText.default
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} className="quick-search-control">
                      <FormControl fullWidth variant="outlined">
                        <Typography className="qs-search-lbl" gutterBottom>
                          {searchByProtein.common.label}
                        </Typography>
                        <AutoTextInput
                          inputValue={props.inputValue.question_4}
                          setInputValue={input =>
                            props.setInputValue({ question_4: input })
                          }
                          required={true}
                          placeholder={searchByProtein.common.placeholder}
                          typeahedID={searchByProtein.common.typeahedID}
                          length={searchByProtein.common.length}
                          errorText={searchByProtein.common.errorText}
                        />
                        <ExampleExploreControl
                          setInputValue={input =>
                            props.setInputValue({ question_4: input })
                          }
                          inputValue={searchByProtein.common.examples}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2} className="quick-search-control">
                      <Typography gutterBottom>&nbsp;</Typography>
                      <Button
                        className="gg-btn-blue"
                        onClick={props.searchQuestion4}
                        disabled={props.inputValue.question_4.trim().length === 0}
                      >
                        Search
                      </Button>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </form>
            </ExpansionPanel>
            <ExpansionPanel
              id={quickSearch.question_5.id}
              defaultExpanded={props.questionId === quickSearch.question_5.id}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon className="gg-blue-color" />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <Typography className="gg-blue-color">
                  {quickSearch.question_5.text.split("{0}")[0]}
                  <strong className="gg-blue-color">
                    {searchByProtein.common.label}
                  </strong>
                  {quickSearch.question_5.text.split("{0}")[1]}
                </Typography>
              </ExpansionPanelSummary>
              <form onSubmit={(event) => {event.preventDefault(); if (props.inputValue.question_5.length <= searchByProtein.common.length) props.searchQuestion5()}}>
                <ExpansionPanelDetails>
                  <Grid container xs={12} sm={12}>
                    <Grid item xs={12} sm={12}>
                      <TextAlert
                        alertInput={
                          props.alertText.question === quickSearch.question_5.id
                            ? props.alertText.input
                            : props.alertText.default
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} className="quick-search-control">
                      <FormControl fullWidth variant="outlined">
                        <Typography className="qs-search-lbl" gutterBottom>
                          {searchByProtein.common.label}
                        </Typography>
                        <AutoTextInput
                          inputValue={props.inputValue.question_5}
                          setInputValue={input =>
                            props.setInputValue({ question_5: input })
                          }
                          required={true}
                          placeholder={searchByProtein.common.placeholder}
                          typeahedID={searchByProtein.common.typeahedID}
                          length={searchByProtein.common.length}
                          errorText={searchByProtein.common.errorText}
                        />
                        <ExampleExploreControl
                          setInputValue={input =>
                            props.setInputValue({ question_5: input })
                          }
                          inputValue={searchByProtein.common.examples}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2} className="quick-search-control">
                      <Typography gutterBottom>&nbsp;</Typography>
                      <Button
                        className="gg-btn-blue"
                        onClick={props.searchQuestion5}
                        disabled={props.inputValue.question_5.trim().length === 0}
                      >
                        Search
                      </Button>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </form>
            </ExpansionPanel>
            <ExpansionPanel
              id={quickSearch.question_6.id}
              defaultExpanded={props.questionId === quickSearch.question_6.id}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon className="gg-blue-color" />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
              >
                <Typography className="gg-blue-color">
                  {quickSearch.question_6.text.split("{0}")[0]}
                  <strong className="gg-blue-color">
                    {searchByProtein.question_6.label}
                  </strong>
                  {quickSearch.question_6.text.split("{0}")[1]}
                </Typography>
              </ExpansionPanelSummary>
              <form onSubmit={(event) => {event.preventDefault(); if (props.inputValue.question_6.length <= searchByProtein.common.length) props.searchQuestion6()}}>
                <ExpansionPanelDetails>
                  <Grid container xs={12} sm={12}>
                    <Grid item xs={12} sm={12}>
                      <TextAlert
                        alertInput={
                          props.alertText.question === quickSearch.question_6.id
                            ? props.alertText.input
                            : props.alertText.default
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} className="quick-search-control">
                      <FormControl fullWidth variant="outlined">
                        <Typography className="qs-search-lbl" gutterBottom>
                          {searchByProtein.question_6.label}
                        </Typography>
                        <AutoTextInput
                          inputValue={props.inputValue.question_6}
                          setInputValue={input =>
                            props.setInputValue({ question_6: input })
                          }
                          required={true}
                          placeholder={searchByProtein.common.placeholder}
                          typeahedID={searchByProtein.common.typeahedID}
                          length={searchByProtein.common.length}
                          errorText={searchByProtein.common.errorText}
                        />
                        <ExampleExploreControl
                          setInputValue={input =>
                            props.setInputValue({ question_6: input })
                          }
                          inputValue={searchByProtein.question_6.examples}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2} className="quick-search-control">
                      <Typography gutterBottom>&nbsp;</Typography>
                      <Button
                        className="gg-btn-blue"
                        onClick={props.searchQuestion6}
                        disabled={props.inputValue.question_6.trim().length === 0}
                      >
                        Search
                      </Button>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </form>
            </ExpansionPanel>
            <ExpansionPanel
              id={quickSearch.question_7.id}
              defaultExpanded={props.questionId === quickSearch.question_7.id}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon className="gg-blue-color" />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className="gg-blue-color">
                  {quickSearch.question_7.text.split("{0}")[0]}
                  <strong className="gg-blue-color">
                    {searchByProtein.common.label}
                  </strong>
                  {quickSearch.question_7.text.split("{0}")[1]}
                </Typography>
              </ExpansionPanelSummary>
              <form onSubmit={(event) => {event.preventDefault(); if (props.inputValue.question_7.length <= searchByProtein.common.length) props.searchQuestion7()}}>
                <ExpansionPanelDetails>
                  <Grid container xs={12} sm={12}>
                    <Grid item xs={12} sm={6} className="quick-search-control">
                      <FormControl fullWidth variant="outlined">
                        <Typography className="qs-search-lbl" gutterBottom>
                          {searchByProtein.common.label}
                        </Typography>
                        <AutoTextInput
                          inputValue={props.inputValue.question_7}
                          setInputValue={input =>
                            props.setInputValue({ question_7: input })
                          }
                          required={true}
                          placeholder={searchByProtein.common.placeholder}
                          typeahedID={searchByProtein.common.typeahedID}
                          length={searchByProtein.common.length}
                          errorText={searchByProtein.common.errorText}
                        />
                        <ExampleExploreControl
                          setInputValue={input =>
                            props.setInputValue({ question_7: input })
                          }
                          inputValue={searchByProtein.common.examples}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2} className="quick-search-control">
                      <Typography gutterBottom>&nbsp;</Typography>
                      <Button
                        className="gg-btn-blue"
                        onClick={props.searchQuestion7}
                        disabled={props.inputValue.question_7.trim().length === 0}
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
export default SearchByProtein;
