import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Button from "react-bootstrap/Button";
import SelectControl from "../select/SelectControl";
import quickSearchData from "../../data/json/quickSearch.json";
import stringConstants from "../../data/json/stringConstants";
import proteinSearchData from "../../data/json/proteinSearch";
import TextAlert from "../alert/TextAlert";
import { getUsecaseInit } from "../../data/usecases";
import HelpTooltip from "../tooltip/HelpTooltip";

/**
 * Quick search control for organism usecases.
 */
const SearchByOrganism = props => {
  let quickSearch = stringConstants.quick_search;
  let searchByOrganism = quickSearchData.searchByOrganism;
  let advancedSearch = proteinSearchData.advanced_search;

  const [useCaseInitData, setUseCaseInitData] = useState({});

  useEffect(() => {
    getUsecaseInit().then(({ data }) => {
      setUseCaseInitData(data);
    });
  }, []);

  const {
    species_to_glycoproteins,
    species_to_glycosyltransferases,
    species_to_glycohydrolases
  } = useCaseInitData;

  return (
    <>
      <div id={props.id}>
        <section className="content-box-sm" style={{ margin: "0 auto" }}>
          <div className="quick-search-heading">
            <h4>{stringConstants.sidebar.search_by_organism.displayname}</h4>
          </div>
          <div className="quick-search">
            <Accordion
              id={quickSearch.question_8.id}
              defaultExpanded={props.questionId === quickSearch.question_8.id}
              expanded={props.panelExpanded.question_8}
              onChange={()=> props.togglePanelExpansion(quickSearch.question_8.id)}
            >
              <AccordionSummary
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
              </AccordionSummary>
              <AccordionDetails className={"ms-2"}>
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
                  <Grid item xs={12} sm={7} className="quick-search-control">
                    <FormControl fullWidth variant="outlined">
                      <Typography className={"search-lbl"} gutterBottom>
                        <HelpTooltip
                          title={quickSearch.question_8.tooltip.title}
                          text={quickSearch.question_8.tooltip.text}
                        />
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
                          species_to_glycosyltransferases &&
                          species_to_glycosyltransferases.organism
                            ? Object.keys(species_to_glycosyltransferases.organism).map((org) => (
                             {
                               id : species_to_glycosyltransferases.organism[org].id,
                               name : species_to_glycosyltransferases.organism[org].name
                             }
                           ))
                            : []
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
              </AccordionDetails>
            </Accordion>
            <Accordion
              id={quickSearch.question_9.id}
              defaultExpanded={props.questionId === quickSearch.question_9.id}
              expanded={props.panelExpanded.question_9}
              onChange={()=> props.togglePanelExpansion(quickSearch.question_9.id)}
            >
              <AccordionSummary
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
              </AccordionSummary>
              <AccordionDetails className={"ms-2"}>
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
                  <Grid item xs={12} sm={7} className="quick-search-control">
                    <FormControl fullWidth variant="outlined">
                      <Typography className={"search-lbl"} gutterBottom>
                        <HelpTooltip
                          title={quickSearch.question_9.tooltip.title}
                          text={quickSearch.question_9.tooltip.text}
                        />
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
                          species_to_glycohydrolases &&
                          species_to_glycohydrolases.organism
                            ? Object.keys(species_to_glycohydrolases.organism).map((org) => (
                             {
                               id : species_to_glycohydrolases.organism[org].id,
                               name : species_to_glycohydrolases.organism[org].name
                             }
                           ))
                            : []
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
              </AccordionDetails>
            </Accordion>
            <Accordion
              id={quickSearch.question_10.id}
              defaultExpanded={props.questionId === quickSearch.question_10.id}
              expanded={props.panelExpanded.question_10}
              onChange={()=> props.togglePanelExpansion(quickSearch.question_10.id)}
            >
              <AccordionSummary
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
              </AccordionSummary>
              <AccordionDetails className={"ms-2"}>
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
                  <Grid item xs={12} sm={7} className="quick-search-control">
                    <FormControl fullWidth variant="outlined">
                      <Typography className={"search-lbl"} gutterBottom>
                        <HelpTooltip
                          title={quickSearch.question_10.tooltip.title}
                          text={quickSearch.question_10.tooltip.text}
                        />
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
                          species_to_glycoproteins &&
                          species_to_glycoproteins.organism
                            ? Object.keys(species_to_glycoproteins.organism).map((org) => (
                              {
                                id : species_to_glycoproteins.organism[org].id,
                                name : species_to_glycoproteins.organism[org].name
                              }
                            ))
                            : []
                        }
                        setInputValue={organismId => {
                          props.setInputValue({
                            question_10: {
                              organism: organismId,
                              glycosylation_evidence: advancedSearch.glycosylation_evidence.placeholderId
                            }
                          });
                        }}
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
                        menu={
                          species_to_glycoproteins &&
                          species_to_glycoproteins.organism &&
                          props.inputValue.question_10.organism !== searchByOrganism.common.organism.placeholderId
                            ? 
                            species_to_glycoproteins.organism[props.inputValue.question_10.organism]
                              .evidence_type.map(type => ({
                                      id: type.id,
                                      name: type.display
                                    }))
                            : []
                        }
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
                      <strong>Organism</strong> and{" "}
                      <strong>Type.</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </div>
        </section>
      </div>
    </>
  );
};
export default SearchByOrganism;
