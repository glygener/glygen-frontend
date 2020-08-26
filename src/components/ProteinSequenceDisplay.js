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
        length: mutationData[x].end_pos - mutationData[x].start_pos + 1
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
        length: sequonData[x].end_pos - sequonData[x].start_pos + 1
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
        n_link_glycosylation: isHighlighted(
          position,
          highlightData.n_link_glycosylation
        ),
        o_link_glycosylation: isHighlighted(
          position,
          highlightData.o_link_glycosylation
        ),
        mutation: isHighlighted(position, highlightData.mutation),
        site_annotation: isHighlighted(position, highlightData.site_annotation)
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

const HiglightSelecter = ({
  count = 0,
  selectedHighlights,
  type,
  label,
  onSelect,
  className
}) => {
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
  glycosylation = [],
  mutation,
  siteAnnotation,
  selectedHighlights, 
  setSelectedHighlights
}) => {
  const [nLinkGlycan, setNLinkGlycan] = useState([]);
  const [oLinkGlycan, setOLinkGlycan] = useState([]);
  const [mutationHighlights, setMutationHighlights] = useState([]);
  const [siteAnnotationHighlights, setSiteAnnotationHighlights] = useState([]);
  const [sequenceData, setSequenceData] = useState([]);

  useEffect(() => {
    if (glycosylation) {
      //distinct
      const distinctGlycanPositions = (value, index, self) => {
        const findPosition = self.find(
          item => item.position === value.position
        );
        return self.indexOf(findPosition) === index;
      };
      const nLink = glycosylation
        .filter(item => item.type === "N-linked")
        .filter(distinctGlycanPositions)
        .map(item => ({
          start: item.position,
          length: 1
        }));
      const oLink = glycosylation
        .filter(item => item.type === "O-linked")
        .filter(distinctGlycanPositions)
        .map(item => ({
          start: item.position,
          length: 1
        }));

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
    if (sequenceObject && sequenceObject.sequence) {
      setSequenceData(
        buildHighlightData(sequenceObject.sequence, {
          mutation: mutationHighlights,
          site_annotation: siteAnnotationHighlights,
          n_link_glycosylation: nLinkGlycan,
          o_link_glycosylation: oLinkGlycan
        })
      );
    }
  }, [
    sequenceObject,
    mutationHighlights,
    siteAnnotationHighlights,
    nLinkGlycan,
    oLinkGlycan
  ]);

  const handleSelectHighlight = type => {
    setSelectedHighlights({
      ...selectedHighlights,
      [type]: !selectedHighlights[type]
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
            <SequenceDisplay
              sequenceData={sequenceData}
              selectedHighlights={selectedHighlights}
            />
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
              label="Mutations"
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
        </ul>
      </Grid>
    </Grid>
  );
};

export default ProteinSequenceDisplay;
