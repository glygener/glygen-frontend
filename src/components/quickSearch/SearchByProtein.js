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
import TextAlert from "../alert/TextAlert";
import Button from "react-bootstrap/Button";
import ExampleExploreControl from "../example/ExampleExploreControl";
import stringConstants from "../../data/json/stringConstants";
import HelpTooltip from "../tooltip/HelpTooltip";

/**
 * Quick search control for protein usecases.
 */
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
            <Accordion
              id={quickSearch.question_4.id}
              defaultExpanded={props.questionId === quickSearch.question_4.id}
              expanded={props.panelExpanded.question_4}
              onChange={()=> props.togglePanelExpansion(quickSearch.question_4.id)}
            >
              <AccordionSummary
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
              </AccordionSummary>
              <form className="ms-2" onSubmit={(event) => {event.preventDefault(); if (props.inputValue.question_4.length <= searchByProtein.common.length) props.searchQuestion4()}}>
                <AccordionDetails>
                  <Grid container size= {{ xs: 12, sm: 12 }}>
                    <Grid item size= {{ xs: 12, sm: 12 }}>
                      <TextAlert
                        alertInput={
                          props.alertText.question === quickSearch.question_4.id
                            ? props.alertText.input
                            : props.alertText.default
                        }
                      />
                    </Grid>
                    <Grid item size= {{ xs: 12, sm: 7 }} className="quick-search-control">
                      <FormControl fullWidth variant="outlined">
                        <Typography className="search-lbl" gutterBottom>
                          <HelpTooltip
                            title={quickSearch.question_4.tooltip.title}
                            text={quickSearch.question_4.tooltip.text}
                            urlText={quickSearch.question_4.tooltip.urlText}
                            url={quickSearch.question_4.tooltip.url}
                            relativeURL={true}
                          />
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
                    <Grid item size= {{ xs: 12, sm: 2 }} className="quick-search-control">
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
                </AccordionDetails>
              </form>
            </Accordion>
            <Accordion
              id={quickSearch.question_5.id}
              defaultExpanded={props.questionId === quickSearch.question_5.id}
              expanded={props.panelExpanded.question_5}
              onChange={()=> props.togglePanelExpansion(quickSearch.question_5.id)}
            >
              <AccordionSummary
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
              </AccordionSummary>
              <form className="ms-2" onSubmit={(event) => {event.preventDefault(); if (props.inputValue.question_5.length <= searchByProtein.common.length) props.searchQuestion5()}}>
                <AccordionDetails>
                  <Grid container size= {{ xs: 12, sm: 12 }}>
                    <Grid item size= {{ xs: 12, sm: 12 }}>
                      <TextAlert
                        alertInput={
                          props.alertText.question === quickSearch.question_5.id
                            ? props.alertText.input
                            : props.alertText.default
                        }
                      />
                    </Grid>
                    <Grid item size= {{ xs: 12, sm: 7 }} className="quick-search-control">
                      <FormControl fullWidth variant="outlined">
                        <Typography className="search-lbl" gutterBottom>
                          <HelpTooltip
                            title={quickSearch.question_5.tooltip.title}
                            text={quickSearch.question_5.tooltip.text}
                            urlText={quickSearch.question_5.tooltip.urlText}
                            url={quickSearch.question_5.tooltip.url}
                            relativeURL={true}
                          />
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
                    <Grid item size= {{ xs: 12, sm: 2 }} className="quick-search-control">
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
                </AccordionDetails>
              </form>
            </Accordion>
            <Accordion
              id={quickSearch.question_6.id}
              defaultExpanded={props.questionId === quickSearch.question_6.id}
              expanded={props.panelExpanded.question_6}
              onChange={()=> props.togglePanelExpansion(quickSearch.question_6.id)}
            >
              <AccordionSummary
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
              </AccordionSummary>
              <form className="ms-2" onSubmit={(event) => {event.preventDefault(); if (props.inputValue.question_6.length <= searchByProtein.common.length) props.searchQuestion6()}}>
                <AccordionDetails>
                  <Grid container size= {{ xs: 12, sm: 12 }}>
                    <Grid item size= {{ xs: 12, sm: 12 }}>
                      <TextAlert
                        alertInput={
                          props.alertText.question === quickSearch.question_6.id
                            ? props.alertText.input
                            : props.alertText.default
                        }
                      />
                    </Grid>
                    <Grid item size= {{ xs: 12, sm: 7 }} className="quick-search-control">
                      <FormControl fullWidth variant="outlined">
                        <Typography className="search-lbl" gutterBottom>
                          <HelpTooltip
                            title={quickSearch.question_6.tooltip.title}
                            text={quickSearch.question_6.tooltip.text}
                            urlText={quickSearch.question_6.tooltip.urlText}
                            url={quickSearch.question_6.tooltip.url}
                            relativeURL={true}
                          />
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
                    <Grid item size= {{ xs: 12, sm: 2 }} className="quick-search-control">
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
                </AccordionDetails>
              </form>
            </Accordion>
            <Accordion
              id={quickSearch.question_7.id}
              defaultExpanded={props.questionId === quickSearch.question_7.id}
              expanded={props.panelExpanded.question_7}
              onChange={()=> props.togglePanelExpansion(quickSearch.question_7.id)}
            >
              <AccordionSummary
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
              </AccordionSummary>
              <form className="ms-2" onSubmit={(event) => {event.preventDefault(); if (props.inputValue.question_7.length <= searchByProtein.common.length) props.searchQuestion7()}}>
                <AccordionDetails>
                  <Grid container size= {{ xs: 12, sm: 12 }}>
                    <Grid item size= {{ xs: 12, sm: 7 }} className="quick-search-control">
                      <FormControl fullWidth variant="outlined">
                        <Typography className="search-lbl" gutterBottom>
                          <HelpTooltip
                            title={quickSearch.question_7.tooltip.title}
                            text={quickSearch.question_7.tooltip.text}
                            urlText={quickSearch.question_7.tooltip.urlText}
                            url={quickSearch.question_7.tooltip.url}
                            relativeURL={true}
                          />
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
                    <Grid item size= {{ xs: 12, sm: 2 }} className="quick-search-control">
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
                </AccordionDetails>
              </form>
            </Accordion>
          </div>
        </section>
      </div>
    </>
  );
};
export default SearchByProtein;
