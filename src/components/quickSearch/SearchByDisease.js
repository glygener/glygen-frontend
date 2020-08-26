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
  let searchByDisease = quickSearchData.searchByDisease;

  return (
    <>
      <div id={props.id}>
        <section className="content-box-sm" style={{ margin: "0 auto" }}>
          <div className="quick-search-heading">
            <h4>{stringConstants.sidebar.search_by_disease.displayname}</h4>
          </div>
          <div className="quick-search">
            <ExpansionPanel
              id={quickSearch.question_11.id}
              defaultExpanded={props.questionId === quickSearch.question_11.id}
            >
              <ExpansionPanelSummary
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
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
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

                  <Grid item xs={12} sm={6} className="quick-search-control">
                    <FormControl fullWidth variant="outlined">
                      <Typography className="qs-search-lbl" gutterBottom>
                        {searchByDisease.common.label}
                      </Typography>
                      <AutoTextInput
                        inputValue={props.inputValue.question_11}
                        setInputValue={input =>
                          props.setInputValue({ question_11: input })
                        }
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
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        </section>
      </div>
    </>
  );
};
export default SearchByGlycan;
