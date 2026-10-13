import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import SequenceDisplay from "../SequenceDisplay";
import SelectControl from "../select/SelectControl";
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from "react-bootstrap/Button";
import { getPhosphorylationHighlightData, getNLinkGlycanMapHighlights, getOLinkGlycanMapHighlights,
  getSequonHighlightData, getMutationHighlightData, getGlycationHighlightData } from "../../data/sequenceHighlighter";
import "../../css/proteinsequence.css";
import FormControl from "@mui/material/FormControl";


/**
 * Higlight selecter control for highlighting protein sequence sites.
 */
const HiglightSelecter = ({ count = 0, disabled = false, selectedHighlights, type, typeMaster, label, onSelect, className, showNumbers }) => {
  return (
    <label style={{marginBottom: "0.5rem"}}>
      <input
        type="checkbox"
        name="checkbox"
        disabled={count < 1 || disabled}
        checked={selectedHighlights[type] || selectedHighlights[typeMaster]}
        onClick={() => typeMaster ? !selectedHighlights[typeMaster] && onSelect(type) : onSelect(type)}
      />
      &nbsp;
      <span className={className}>{label}</span>
      {count > 0 && showNumbers && <span className="badge badge-light">{count}</span>}
    </label>
  );
};


/**
 * Higlight input control for highlighting protein sequence text.
 */
const HiglightInput = ({ selectedHighlights, type, label, onSelect, className, input, onInput, onSelectTemplate }) => {
  return (
    <label style={{marginBottom: "0.5rem"}}>
      <input
        type="checkbox"
        name="checkbox"
        checked={selectedHighlights[type]}
        onClick={() => onSelect(type)}
      />
      &nbsp;
      <OutlinedInput
        className={className}
        value={input}
        margin='dense'
        placeholder="Custom AA sequence"
        classes={{
          input: className
          }}
        onChange={(e) => {
          if (input !==e.target.value) {
            onInput(e.target.value);
            onSelectTemplate("");
          }

        }}
      />

    </label>
  );
};


/**
 * Higlight input control for highlighting protein sequence text.
 */
const HiglightSelect = ({ selectedHighlights, type, label, onSelect, className, input, onInput, onSelectTemplate, inputTemplate, consensusMenu }) => {
  return (
    // <FormControl fullWidth>
    <div className="pop-up">
    <label style={{marginBottom: "0.5rem", width: "100%"}}>
      <input
        type="checkbox"
        name="checkbox"
        style={{visibility:"hidden"}}
        // checked={selectedHighlights[type]}
        // onClick={() => onSelect(type)}
      />
      &nbsp;
      <SelectControl
        rootClass={className}
        className={className}
        inputValue={inputTemplate}
        placeholder={"Sequon / Consensus"}
        placeholderId={""}
        placeholderName={"Sequon / Consensus"}
        menu={consensusMenu}
        setInputValue={(value) => {
          onSelectTemplate(value);
        }}
      />
      &nbsp;
      <Button
        type="button"
        style={{ marginLeft: "5px" }}
        className="gg-btn-blue"
        disabled={inputTemplate === ""}
        onClick={() => {
          onInput(inputTemplate)
          onSelect(type, true);
        }}
      >
        Load
      </Button>
    </label>
    </div>
  );
};


/**
 * Protein sequence highlighter control.
 */
const SequenceHighlighter = ({
  details,
  selectedHighlights,
  setSelectedHighlights,
  sequenceSearchText,
  setSequenceSearchText,
  sequenceTemplateText,
  setSequenceTemplateText,
  consensusMenu,
  showNumbers,
  flatDataStructure
}) => {

  const [highlightsCount, setHighlightsCount] = useState({});

  const handleSelectHighlight = (type) => {
    setSelectedHighlights({
      ...selectedHighlights,
      [type]: !selectedHighlights[type],
    });
  };

  const handleSelectHighlightFlag = (type, flag) => {
    setSelectedHighlights({
      ...selectedHighlights,
      [type]: flag,
    });
  };

  /**
   * useEffect for counting sites.
  */
  useEffect(() => {

    let glycoNArr = [];
    let glycoOArr = [];
    let phArr = [];
    let siAnArr = [];
    let muArr = [];
    let glycaArr = [];
    let highlightDataArr = [];
    let n_gl_sequon_gainArr = [];
    let n_gl_sequon_lossArr = [];
    let o_gl_site_lossArr = [];
    let snv_non_glArr = [];

    let glycoN = 0;
    let glycoO = 0;
    let ph = 0;
    let siAn = 0;
    let mu = 0;
    let glyca = 0;
    let n_gl_sequon_gain = 0;
    let n_gl_sequon_loss = 0;
    let o_gl_site_loss = 0;
    let snv_non_gl = 0

    details && details.map((det) => {
      phArr = getPhosphorylationHighlightData(det.phosphorylation, flatDataStructure);
      glycoNArr = getNLinkGlycanMapHighlights(det.n_glycosylation ? det.n_glycosylation : det.glycosylation, flatDataStructure);
      glycoOArr = getOLinkGlycanMapHighlights(det.o_glycosylation ? det.o_glycosylation : det.glycosylation, flatDataStructure);
      siAnArr = getSequonHighlightData(det.site_annotation);
      muArr = getMutationHighlightData(det.snv, flatDataStructure);
      n_gl_sequon_gainArr = getMutationHighlightData(det.n_glyco_sequon_gain, flatDataStructure);
      n_gl_sequon_lossArr = getMutationHighlightData(det.n_glyco_sequon_loss, flatDataStructure);
      o_gl_site_lossArr = getMutationHighlightData(det.o_glyco_site_loss, flatDataStructure);
      snv_non_glArr = getMutationHighlightData(det.snv_non_glyco, flatDataStructure);
      glycaArr = getGlycationHighlightData(det.glycation, flatDataStructure);

      if (phArr.length > 0){
        ph = phArr.length
      }
      if (glycoNArr.length > 0){
        glycoN = glycoNArr.length
      }
      if (glycoOArr.length > 0){
        glycoO = glycoOArr.length
      }
      if (siAnArr.length > 0){
        siAn = siAnArr.length
      }
      if (n_gl_sequon_gainArr.length > 0){
        n_gl_sequon_gain = n_gl_sequon_gainArr.length
      }
      if (n_gl_sequon_lossArr.length > 0){
        n_gl_sequon_loss = n_gl_sequon_lossArr.length
      }
      if (o_gl_site_lossArr.length > 0){
        o_gl_site_loss = o_gl_site_lossArr.length
      }
      if (snv_non_glArr.length > 0){
        snv_non_gl = snv_non_glArr.length
      }
      if (muArr.length > 0){
        mu = muArr.length
      }
      if (glycaArr.length > 0){
        glyca = glycaArr.length
      }

    });

    let highlightData = {        
      "phosphorylation" : ph,
      "n_link_glycosylation" : glycoN,
      "o_link_glycosylation" : glycoO,
      "site_annotation" : siAn,
      "glycation" : glyca,
      "mutation" : mu,
      "n_glyco_sequon_gain": n_gl_sequon_gain,
      "n_glyco_sequon_loss": n_gl_sequon_loss,
      "o_glyco_site_loss": o_gl_site_loss,
      "snv_non_glyco": snv_non_gl
    }

    setHighlightsCount(highlightData);

  }, [details]);


  return (
    <Grid container className="content-box">
      <Grid item className="content-active">
        <ul className="highlight-panel-categories">
          <li>
            <HiglightSelecter
              count={highlightsCount["n_link_glycosylation"] ? highlightsCount["n_link_glycosylation"] : 0}
              selectedHighlights={selectedHighlights}
              showNumbers={showNumbers}
              type="n_link_glycosylation"
              label="N-linked Sites"
              className="sequnce1"
              onSelect={handleSelectHighlight}
            />
          </li>
          <li>
            <HiglightSelecter
              count={highlightsCount["o_link_glycosylation"] ? highlightsCount["o_link_glycosylation"] : 0}
              selectedHighlights={selectedHighlights}
              showNumbers={showNumbers}
              type="o_link_glycosylation"
              label="O-linked Sites"
              className={"sequnce2"}
              onSelect={handleSelectHighlight}
            />
          </li>
          <li>
            <HiglightSelecter
              count={highlightsCount["mutation"] ? highlightsCount["mutation"] : 0}
              selectedHighlights={selectedHighlights}
              showNumbers={showNumbers}
              disabled={!(highlightsCount["n_glyco_sequon_gain"] && highlightsCount["n_glyco_sequon_loss"]
                 && highlightsCount["o_glyco_site_loss"] && highlightsCount["snv_non_glyco"])}
              type="mutation"
              label="Variation from mutation"
              className={"sequnce3"}
              onSelect={handleSelectHighlight}
            />
          </li>
          <li className="ps-3">
            <HiglightSelecter
              count={highlightsCount["n_glyco_sequon_gain"] ? highlightsCount["n_glyco_sequon_gain"] : 0}
              selectedHighlights={selectedHighlights}
              showNumbers={showNumbers}
              type="n_glyco_sequon_gain"
              typeMaster="mutation"
              label="N-glyco sequon gain"
              className={"sequnce3"}
              onSelect={handleSelectHighlight}
            />
          </li>
          <li className="ps-3">
            <HiglightSelecter
              count={highlightsCount["n_glyco_sequon_loss"] ? highlightsCount["n_glyco_sequon_loss"] : 0}
              selectedHighlights={selectedHighlights}
              showNumbers={showNumbers}
              type="n_glyco_sequon_loss"
              typeMaster="mutation"
              label="N-glyco sequon loss"
              className={"sequnce3"}
              onSelect={handleSelectHighlight}
            />
          </li>
          <li className="ps-3">
            <HiglightSelecter
              count={highlightsCount["o_glyco_site_loss"] ? highlightsCount["o_glyco_site_loss"] : 0}
              selectedHighlights={selectedHighlights}
              showNumbers={showNumbers}
              type="o_glyco_site_loss"
              typeMaster="mutation"
              label="O-glyco site loss"
              className={"sequnce3"}
              onSelect={handleSelectHighlight}
            />
          </li>
          <li className="ps-3">
            <HiglightSelecter
              count={highlightsCount["snv_non_glyco"] ? highlightsCount["snv_non_glyco"] : 0}
              selectedHighlights={selectedHighlights}
              showNumbers={showNumbers}
              type="snv_non_glyco"
              typeMaster="mutation"
              label="Non glyco mutation"
              className={"sequnce3"}
              onSelect={handleSelectHighlight}
            />
          </li>
          {/* <li>
            <HiglightSelecter
              count={highlightsCount["site_annotation"] ? highlightsCount["site_annotation"] : 0}
              selectedHighlights={selectedHighlights}
              showNumbers={showNumbers}
              type="site_annotation"
              label="Sequon"
              className={"sequnce4"}
              onSelect={handleSelectHighlight}
            />
          </li> */}
          <li>
            <HiglightSelecter
              count={highlightsCount["phosphorylation"] ? highlightsCount["phosphorylation"] : 0}
              selectedHighlights={selectedHighlights}
              showNumbers={showNumbers}
              type="phosphorylation"
              label="Phosphorylation"
              className={"sequnce5"}
              onSelect={handleSelectHighlight}
            />
          </li>
          <li>
            <HiglightSelecter
              count={highlightsCount["glycation"] ? highlightsCount["glycation"] : 0}
              selectedHighlights={selectedHighlights}
              showNumbers={showNumbers}
              type="glycation"
              label="Glycation"
              className={"sequnce6"}
              onSelect={handleSelectHighlight}
            />
          </li>
          <li>
            <HiglightInput
              selectedHighlights={selectedHighlights}
              showNumbers={showNumbers}
              type="text_search"
              label="User"
              className={"sequnce7"}
              onSelect={handleSelectHighlight}
              input={sequenceSearchText}
              onInput={setSequenceSearchText}
              onSelectTemplate={setSequenceTemplateText}
            />
          </li>
          <li>
            <HiglightSelect
              selectedHighlights={selectedHighlights}
              showNumbers={showNumbers}
              type="text_search"
              label="User"
              className={"sequnce8"}
              onSelect={handleSelectHighlightFlag}
              input={sequenceSearchText}
              onInput={setSequenceSearchText}
              inputTemplate={sequenceTemplateText}
              onSelectTemplate={setSequenceTemplateText}
              consensusMenu={consensusMenu}
            />
          </li>
        </ul>
      </Grid>
    </Grid>
  );
};

export default SequenceHighlighter;
