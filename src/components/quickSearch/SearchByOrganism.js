import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Button from "react-bootstrap/Button";
import SelectControl from "../select/SelectControl";
import quickSearchData from "../../data/json/quickSearch.json";
import stringConstants from "../../data/json/stringConstants";
import proteinSearchData from "../../data/json/proteinSearch";
import TextAlert from "../alert/TextAlert";

const SearchByOrganism = props => {
  let quickSearch = stringConstants.quick_search;
  let searchByOrganism = quickSearchData.searchByOrganism;
  let advancedSearch = proteinSearchData.advanced_search;

  return (
    <>
      <div id={props.id}>
        <section className="content-box-sm" style={{ margin: "0 auto" }}>
          <div className="quick-search-heading">
            <h4>{stringConstants.sidebar.search_by_organism.displayname}</h4>
          </div>
          <div className="quick-search">
            <ExpansionPanel
              id={quickSearch.question_8.id}
              defaultExpanded={props.questionId === quickSearch.question_8.id}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon className="gg-blue-color" />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className="gg-blue-color">
                  {quickSearch.question_8.text.split("{0}")[0]}
                  <strong className="gg-blue-color">
                    {searchByOrganism.common.label}
                  </strong>
                  {quickSearch.question_8.text.split("{0}")[1]}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container xs={12} sm={12}>
                  <Grid item xs={12} sm={12}>
                    <TextAlert
                      alertInput={
                        props.alertText.question === quickSearch.question_8.id
                          ? props.alertText.input
                          : props.alertText.default
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} className="quick-search-control">
                    <FormControl fullWidth variant="outlined">
                      <Typography className={"qs-search-lbl"} gutterBottom>
                        {searchByOrganism.common.label}
                      </Typography>
                      <SelectControl
                        inputValue={props.inputValue.question_8}
                        placeholder={
                          searchByOrganism.common.organism.placeholder
                        }
                        placeholderId={
                          searchByOrganism.common.organism.placeholderId
                        }
                        placeholderName={
                          searchByOrganism.common.organism.placeholderName
                        }
                        menu={
                          props.glycanInitData.organism
                            ? props.glycanInitData.organism.map(type => {
                                return { id: type.id, name: type.name };
                              })
                            : props.glycanInitData.organism
                        }
                        setInputValue={input =>
                          props.setInputValue({ question_8: input })
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2} className="quick-search-control">
                    <Typography gutterBottom>&nbsp;</Typography>
                    <Button
                      className="gg-btn-blue"
                      onClick={props.searchQuestion8}
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
              id={quickSearch.question_9.id}
              defaultExpanded={props.questionId === quickSearch.question_9.id}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon className="gg-blue-color" />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <Typography className="gg-blue-color">
                  {quickSearch.question_9.text.split("{0}")[0]}
                  <strong className="gg-blue-color">
                    {searchByOrganism.common.label}
                  </strong>
                  {quickSearch.question_9.text.split("{0}")[1]}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container xs={12} sm={12}>
                  <Grid item xs={12} sm={12}>
                    <TextAlert
                      alertInput={
                        props.alertText.question === quickSearch.question_9.id
                          ? props.alertText.input
                          : props.alertText.default
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} className="quick-search-control">
                    <FormControl fullWidth variant="outlined">
                      <Typography className={"qs-search-lbl"} gutterBottom>
                        {searchByOrganism.common.label}
                      </Typography>
                      <SelectControl
                        inputValue={props.inputValue.question_9}
                        placeholder={
                          searchByOrganism.common.organism.placeholder
                        }
                        placeholderId={
                          searchByOrganism.common.organism.placeholderId
                        }
                        placeholderName={
                          searchByOrganism.common.organism.placeholderName
                        }
                        menu={
                          props.glycanInitData.organism
                            ? props.glycanInitData.organism.map(type => {
                                return { id: type.id, name: type.name };
                              })
                            : props.glycanInitData.organism
                        }
                        setInputValue={input =>
                          props.setInputValue({ question_9: input })
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2} className="quick-search-control">
                    <Typography gutterBottom>&nbsp;</Typography>
                    <Button
                      className="gg-btn-blue"
                      onClick={props.searchQuestion9}
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
              id={quickSearch.question_10.id}
              defaultExpanded={props.questionId === quickSearch.question_10.id}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon className="gg-blue-color" />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
              >
                <Typography className="gg-blue-color">
                  {quickSearch.question_10.text.split("{0}")[0]}
                  <strong className="gg-blue-color">
                    {searchByOrganism.common.label}
                  </strong>
                  {quickSearch.question_10.text.split("{0}")[1]}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container xs={12} sm={12}>
                  <Grid item xs={12} sm={12}>
                    <TextAlert
                      alertInput={
                        props.alertText.question === quickSearch.question_10.id
                          ? props.alertText.input
                          : props.alertText.default
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} className="quick-search-control">
                    <FormControl fullWidth variant="outlined">
                      <Typography className={"qs-search-lbl"} gutterBottom>
                        {searchByOrganism.common.label}
                      </Typography>
                      <SelectControl
                        inputValue={props.inputValue.question_10.organism}
                        placeholder={
                          searchByOrganism.common.organism.placeholder
                        }
                        placeholderId={
                          searchByOrganism.common.organism.placeholderId
                        }
                        placeholderName={
                          searchByOrganism.common.organism.placeholderName
                        }
                        menu={
                          props.glycanInitData.organism
                            ? props.glycanInitData.organism.map(type => {
                                return { id: type.id, name: type.name };
                              })
                            : props.glycanInitData.organism
                        }
                        setInputValue={input =>
                          props.setInputValue({
                            question_10: {
                              organism: input,
                              glycosylation_evidence:
                                props.inputValue.question_10
                                  .glycosylation_evidence
                            }
                          })
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3} className="quick-search-control">
                    <FormControl fullWidth variant="outlined">
                      <Typography className={"qs-search-lbl"} gutterBottom>
                        {searchByOrganism.question_10.labelType}
                      </Typography>
                      <SelectControl
                        inputValue={
                          props.inputValue.question_10.glycosylation_evidence
                        }
                        placeholder={"Select Type"}
                        placeholderId={
                          advancedSearch.glycosylation_evidence.placeholderId
                        }
                        placeholderName={
                          advancedSearch.glycosylation_evidence.placeholderName
                        }
                        menu={advancedSearch.glycosylation_evidence.menu}
                        setInputValue={input =>
                          props.setInputValue({
                            question_10: {
                              organism: props.inputValue.question_10.organism,
                              glycosylation_evidence: input
                            }
                          })
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2} className="quick-search-control">
                    <Typography gutterBottom>&nbsp;</Typography>
                    <Button
                      className="gg-btn-blue"
                      onClick={props.searchQuestion10}
                      disabled={
                        props.inputValue.question_10.glycosylation_evidence ===
                        ""
                      }
                    >
                      Search
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Typography align="left" className="small-text">
                      ** Select both options{" "}
                      <strong className="gg-blue-color">Species</strong> and{" "}
                      <strong>Type.</strong>
                    </Typography>
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
export default SearchByOrganism;
