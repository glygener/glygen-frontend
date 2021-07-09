import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import SequenceDisplay from "./SequenceDisplay";
import "../css/proteinsequence.css";

/**
 * Getting mutation data
 * @param {array} mutationData
 * @return an array of highlight info.
 */
function getMutationHighlightData(mutationData) {
  var result = [];
  var positions = {};

  for (var x = 0; x < mutationData.length; x++) {
    if (!positions[mutationData[x].start_pos]) {
      positions[mutationData[x].start_pos] = true;
      result.push({
        start: mutationData[x].start_pos,
        length: mutationData[x].end_pos - mutationData[x].start_pos + 1,
      });
    }
  }
  return result;
}

/**
 * Getting sequon data
 * @param {array} sequonData
 * @return an array of highlight info.
 */
function getSequonHighlightData(sequonData) {
  var result = [];
  var positions = {};

  for (var x = 0; x < sequonData.length; x++) {
    if (!positions[sequonData[x].start_pos]) {
      positions[sequonData[x].start_pos] = true;
      result.push({
        start: sequonData[x].start_pos,
        length: sequonData[x].end_pos - sequonData[x].start_pos + 1,
      });
    }
  }
  return result;
}

/**
 * Getting phosphorylation data
 * @param {array} phosphorylationData
 * @return an array of highlight info.
 */
function getPhosphorylationHighlightData(phosphorylationData) {
  var result = [];
  var positions = {};

  for (var x = 0; x < phosphorylationData.length; x++) {
    if (!positions[phosphorylationData[x].start_pos]) {
      positions[phosphorylationData[x].start_pos] = true;
      result.push({
        start: phosphorylationData[x].start_pos,
        length: phosphorylationData[x].end_pos - phosphorylationData[x].start_pos + 1,
      });
    }
  }
  return result;
}

/**
 * Getting glycation data
 * @param {array} glycationData
 * @return an array of highlight info.
 */
function getGlycationHighlightData(glycationData) {
  var result = [];
  var positions = {};

  for (var x = 0; x < glycationData.length; x++) {
    if (!positions[glycationData[x].start_pos]) {
      positions[glycationData[x].start_pos] = true;
      result.push({
        start: glycationData[x].start_pos,
        length: glycationData[x].end_pos - glycationData[x].start_pos + 1,
      });
    }
  }
  return result;
}

/**
 * checking is highlighted or not
 * @param {number} position
 * @param {array} selection
 * @return:boolean if position in the ranges
 */
function isHighlighted(position, selection) {
  var result = false;
  if (selection) {
    for (var x = 0; x < selection.length; x++) {
      var start = selection[x].start;
      var end = selection[x].start + selection[x].length - 1;

      if (start <= position && position <= end) {
        result = true;
        break;
      }
    }
    return result;
  }
  return false;
}

/**
 * building highlight
 * @param {string} sequence
 * @param {object} highlightData:
 * @returns an array of each charcter of the sequence and is highlighted by its each type
 */
function buildHighlightData(sequence, highlightData) {
  var result = [];
  if (sequence) {
    for (var x = 0; x < sequence.length; x++) {
      var position = x + 1;
      result.push({
        character: sequence[x],
        n_link_glycosylation: isHighlighted(position, highlightData.n_link_glycosylation),
        o_link_glycosylation: isHighlighted(position, highlightData.o_link_glycosylation),
        mutation: isHighlighted(position, highlightData.mutation),
        site_annotation: isHighlighted(position, highlightData.site_annotation),
        phosphorylation: isHighlighted(position, highlightData.phosphorylation),
        glycation: isHighlighted(position, highlightData.glycation),
      });
    }
    return result;
  }
  return [];
}

// /**
//  * Sequence formatting Function
//  * @param {string} sequenceString
//  * @return {string}
//  */

const HiglightSelecter = ({ count = 0, selectedHighlights, type, label, onSelect, className }) => {
  return (
    <label>
      <input
        type="checkbox"
        name="checkbox"
        disabled={count < 1}
        checked={selectedHighlights[type]}
        onClick={() => onSelect(type)}
      />
      &nbsp;
      <span className={className}>{label}</span>
      {count > 0 && <span className="badge badge-light">{count}</span>}
    </label>
  );
};

const ProteinSequenceDisplay = ({
  sequenceObject,
  glycosylation,
  mutation,
  siteAnnotation,
  phosphorylationObj,
  glycationObj,
  selectedHighlights,
  setSelectedHighlights,
}) => {
  const [nLinkGlycan, setNLinkGlycan] = useState([]);
  const [oLinkGlycan, setOLinkGlycan] = useState([]);
  const [mutationHighlights, setMutationHighlights] = useState([]);
  const [siteAnnotationHighlights, setSiteAnnotationHighlights] = useState([]);
  const [phosphorylationHighlights, setPhosphorylationHighlights] = useState([]);
  const [glycationHighlights, setGlycationHighlights] = useState([]);

  const [sequenceData, setSequenceData] = useState([]);

  //const hasStartPos = item => typeof item.start_pos === "undefined";
  //const hasStartPos = item => item.start_pos === "undefined";

  useEffect(() => {
    if (glycosylation) {
      const tempGlycosylation = glycosylation.filter((item) => item.start_pos !== undefined);

      //distinct
      const distinctGlycanPositions = (value, index, self) => {
        const findPosition = self.find((item) => item.start_pos === value.start_pos);
        return self.indexOf(findPosition) === index;
      };
      const nLink = tempGlycosylation
        .filter((item) => item.type === "N-linked")
        //.filter(hasStartPos)
        .filter(distinctGlycanPositions)
        .map((item) => ({
          start: item.start_pos,
          length: 1,
        }));
      const oLink = tempGlycosylation
        .filter((item) => item.type === "O-linked")
        //.filter(hasStartPos)
        .filter(distinctGlycanPositions)
        .map((item) => ({
          start: item.start_pos,
          length: 1,
        }));

      // debugger;
      setNLinkGlycan(nLink);
      setOLinkGlycan(oLink);
    }
  }, [glycosylation]);

  useEffect(() => {
    //distinct
    if (siteAnnotation) {
      setSiteAnnotationHighlights(getSequonHighlightData(siteAnnotation));
    }
  }, [siteAnnotation]);

  useEffect(() => {
    //distinct
    if (mutation) {
      setMutationHighlights(getMutationHighlightData(mutation));
    }
  }, [mutation]);

  useEffect(() => {
    if (phosphorylationObj) {
      setPhosphorylationHighlights(getPhosphorylationHighlightData(phosphorylationObj));
    }
  }, [phosphorylationObj]);

  useEffect(() => {
    if (glycationObj) {
      setGlycationHighlights(getGlycationHighlightData(glycationObj));
    }
  }, [glycationObj]);

  useEffect(() => {
    if (sequenceObject && sequenceObject.sequence) {
      setSequenceData(
        buildHighlightData(sequenceObject.sequence, {
          mutation: mutationHighlights,
          site_annotation: siteAnnotationHighlights,
          n_link_glycosylation: nLinkGlycan,
          o_link_glycosylation: oLinkGlycan,
          phosphorylation: phosphorylationHighlights,
          glycation: glycationHighlights,
        })
      );
    }
  }, [
    sequenceObject,
    mutationHighlights,
    siteAnnotationHighlights,
    nLinkGlycan,
    oLinkGlycan,
    phosphorylationHighlights,
    glycationHighlights,
  ]);

  const handleSelectHighlight = (type) => {
    setSelectedHighlights({
      ...selectedHighlights,
      [type]: !selectedHighlights[type],
    });
  };

  if (!sequenceObject) {
    return <p>No Data Available.</p>;
  }

  return (
    <Grid container className="content-box">
      <Grid item className="sequnce_highlight">
        <div>
          {sequenceObject && (
            <SequenceDisplay sequenceData={sequenceData} selectedHighlights={selectedHighlights} />
          )}
        </div>
      </Grid>
      <Grid item className="content-active">
        <ul className="highlight-panel-categories">
          <li>
            <HiglightSelecter
              count={nLinkGlycan.length}
              selectedHighlights={selectedHighlights}
              type="n_link_glycosylation"
              label="N-linked Sites"
              className="sequnce1"
              onSelect={handleSelectHighlight}
            />
            {/* <label>
              <input
                type="checkbox"
                name="checkbox"
                id="seq_n_link"
                disabled={nLinkGlycan.length === 0}
                checked={selectedHighlights.n_link_glycosylation}
                onClick={() => handleSelectHighlight("n_link_glycosylation")}
              />
              &nbsp;<span className="sequnce1">N-linked Sites</span>
              {nLinkGlycan && (
                <span className="badge badge-light">
                  {nLinkGlycan.length + 1}
                </span>
              )}
            </label> */}
          </li>
          <li>
            <HiglightSelecter
              count={oLinkGlycan.length}
              selectedHighlights={selectedHighlights}
              type="o_link_glycosylation"
              label="O-linked Sites"
              className={"sequnce2"}
              onSelect={handleSelectHighlight}
            />
          </li>
          <li>
            <HiglightSelecter
              count={mutationHighlights.length}
              selectedHighlights={selectedHighlights}
              type="mutation"
              label="Variation from mutation"
              className={"sequnce3"}
              onSelect={handleSelectHighlight}
            />
          </li>
          <li>
            <HiglightSelecter
              count={siteAnnotationHighlights.length}
              selectedHighlights={selectedHighlights}
              type="site_annotation"
              label="Sequon"
              className={"sequnce4"}
              onSelect={handleSelectHighlight}
            />
          </li>
          <li>
            <HiglightSelecter
              count={phosphorylationHighlights.length}
              selectedHighlights={selectedHighlights}
              type="phosphorylation"
              label="Phosphorylation"
              className={"sequnce5"}
              onSelect={handleSelectHighlight}
            />
          </li>
          <li>
            <HiglightSelecter
              count={glycationHighlights.length}
              selectedHighlights={selectedHighlights}
              type="glycation"
              label="Glycation"
              className={"sequnce6"}
              onSelect={handleSelectHighlight}
            />
          </li>
        </ul>
      </Grid>
    </Grid>
  );
};

export default ProteinSequenceDisplay;
