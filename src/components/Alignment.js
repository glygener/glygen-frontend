import React, { useState, useEffect, useReducer } from "react";
import { getIsoAlignment } from "../data/protein";
import "../css/alignment.css";
import { Grid } from "@material-ui/core";
import routeConstants from "../data/json/routeConstants";

// finds the max length of all sequences or consensus
function findMaxSequenceLength(sequenceObject) {
  // get length of consensus
  var alignmentLength = sequenceObject.consensus.length;
  // get length of all sequences
  var sequenceLengths = sequenceObject.sequences.map(function(aln) {
    return aln.aln.length;
  });
  // sort aln length, from smallest to largest
  sequenceLengths.sort();
  // get the largest aln length
  var maxSequenceLength = sequenceLengths[sequenceLengths.length - 1];
  //   var uniprot_canonical_ac = getParameterByName("uniprot_canonical_ac");
  //log if consensus not equal to the longest sequence
  // activityTracker("error", uniprot_canonical_ac, "Longest seq length=" + maxSequenceLength + ", Consensus length=" + alignmentLength);
  // return whichever is larger
  return Math.max(alignmentLength, maxSequenceLength);
}

function formatSequenceBlocks(sequenceObject, perLine) {
  var sequenceBlocks = [];
  var maxSequenceLength = findMaxSequenceLength(sequenceObject);
  for (var x = 0; x < maxSequenceLength; x += perLine) {
    var sequenceBlock = {
      // holds each aln peice for the block
      sequences: sequenceObject.sequences.map(function(aln) {
        return {
          start: x,
          id: aln.id,
          // tax_id: aln.tax_id,
          uniprot_id: aln.uniprot_id,
          // tax_name: aln.tax_name,
          name: aln.name,
          string: aln.aln.substr(x, perLine)
        };
      }),
      // consensus data for block
      consensus: {
        start: x,
        string: sequenceObject.consensus.substr(x, perLine)
      }
    };

    sequenceBlocks.push(sequenceBlock);
  }

  return sequenceBlocks;
}

const Alignment = ({ alignmentData, perLine }) => {
  const sequenceArray = formatSequenceBlocks(alignmentData, perLine);

  return (
    <div id="sequncealign">
      {sequenceArray.map(sequenceObject => (
        <>
          <div className="aln-block">
            {sequenceObject.sequences.map(aln => (
              <div className="aln-line row">
                {/* <Grid item xs={12} md={1}> */}
                <div className="aln-line-header">{aln.tax_id}</div>
                <div className="aln-line-header">{aln.tax_name}</div>
                <div className="aln-line-header" style={{ paddingLeft: "5px" }}>
                  <a href={routeConstants.proteinDetail}>{aln.id}</a>
                </div>
                <div className="aln-line-header">{aln.uniprot_id}</div>

                <div className="aln-line-value">{aln.string}</div>
              </div>
            ))}
            <div className="aln-line row">
              <div> </div>
              <div> </div>
              <div> </div>
              <div> </div>
              <div className="aln-line-consensus">
                {sequenceObject.consensus.string}
              </div>
            </div>
          </div>
        </>
      ))}
    </div>
  );
};
export default Alignment;
