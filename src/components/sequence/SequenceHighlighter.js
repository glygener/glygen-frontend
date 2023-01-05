import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import SequenceDisplay from "../SequenceDisplay";
import { getPhosphorylationHighlightData, getNLinkGlycanMapHighlights, getOLinkGlycanMapHighlights,
  getSequonHighlightData, getMutationHighlightData, getGlycationHighlightData } from "../../data/sequenceHighlighter";
import "../../css/proteinsequence.css";

/**
 * Higlight selecter control for highlighting protein sequence sites.
 */
const HiglightSelecter = ({ count = 0, selectedHighlights, type, label, onSelect, className, showNumbers }) => {
  return (
    <label style={{marginBottom: "0.5rem"}}>
      <input
        type="checkbox"
        name="checkbox"
        disabled={count < 1}
        checked={selectedHighlights[type]}
        onClick={() => onSelect(type)}
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
const HiglightInput = ({ selectedHighlights, type, label, onSelect, className, input, onInput }) => {
  return (
    <label style={{marginBottom: "0.5rem"}}>
      <input
        type="checkbox"
        name="checkbox"
        checked={selectedHighlights[type]}
        onClick={() => onSelect(type)}
      />
      &nbsp;
      <input
        className={className}
        type="text"
        name="text"
        placeholder="Custom AA sequence"
        value={input} onInput={e => onInput(e.target.value)}
      />
    </label>
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
  showNumbers
}) => {

  const [highlightsCount, setHighlightsCount] = useState({});

  const handleSelectHighlight = (type) => {
    setSelectedHighlights({
      ...selectedHighlights,
      [type]: !selectedHighlights[type],
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

    let glycoN = 0;
    let glycoO = 0;
    let ph = 0;
    let siAn = 0;
    let mu = 0;
    let glyca = 0;

    details && details.map((det) => {
      phArr = getPhosphorylationHighlightData(det.phosphorylation);
      glycoNArr = getNLinkGlycanMapHighlights(det.glycosylation);
      glycoOArr = getOLinkGlycanMapHighlights(det.glycosylation);
      siAnArr = getSequonHighlightData(det.site_annotation);
      muArr = getMutationHighlightData(det.snv);
      glycaArr = getGlycationHighlightData(det.glycation);

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
              type="mutation"
              label="Variation from mutation"
              className={"sequnce3"}
              onSelect={handleSelectHighlight}
            />
          </li>
          <li>
            <HiglightSelecter
              count={highlightsCount["site_annotation"] ? highlightsCount["site_annotation"] : 0}
              selectedHighlights={selectedHighlights}
              showNumbers={showNumbers}
              type="site_annotation"
              label="Sequon"
              className={"sequnce4"}
              onSelect={handleSelectHighlight}
            />
          </li>
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
            />
          </li>
        </ul>
      </Grid>
    </Grid>
  );
};

export default SequenceHighlighter;
