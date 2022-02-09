import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../css/proteinsequence.css";

const SEQUENCE_ROW_RUN_LENGTH = 10;

/**
 * building row
 * @param {array} rowData
 * @returns string of sequence
 */
function buildRowText(rowData) {
  var text = [];
  var len = rowData.length;

  if (len > 0 && rowData[rowData.length-1] && rowData[rowData.length-1].character === "&nbsp;"){
    len = rowData.length - 1;
  }

  for (var x = 0; x < len; x++) {
      text.push(rowData[x].character);
  }
  return text.join("");
}

/**
 * building rowhighlight
 * @param {object} input props
 */
const RowHighlight = ({ rowData, type, selectedHighlights }) => {
  const isSelected = selectedHighlights[type];

  if (!isSelected) {
    return <></>;
  }

  return (
    <span className="highlight-highlight" data-type={type}>
      {rowData.map((row) => {
        if (row[type]) {
          return <span className="highlight-highlight-area">&nbsp;</span>;
        } else {
          return <>&nbsp;</>;
        }
      })}
    </span>
  );
};

/**
 * creating row
 * @param {object} input props
 */
const SequenceRow = ({ uniprot_id, uniprot_ac, clickThruUrl, rowData, start, selectedHighlights, multiSequence, tax_name, consensus, header, offset }) => {
  
  const space = "           ";
  const space1 = "       ";
  const space2 = "          ";

  
  return (
    <div className="highlight-row aln-line sequncealign">

      {header && <>    
        {multiSequence && <>
          <span></span>
          <span></span>
        </>}
      
        {start === 0 && <>
          <span></span>
          <span><pre className="sequencePreClass">
          {space}+10{space1} +20{space1} +30{space1} +40 {space1}+50{space1}
          </pre></span> </>}

          {start === 1 && <>
          <span></span>
          <span>
          <pre className="sequencePreClass">
          {space}|{space2}|{space2}|{space2}|{space2}|
          </pre> </span></>}

        {multiSequence && <>
            <span></span>
          </>}
        
      </>}
      
      {!header && <>
        {multiSequence && <span className="aln-line-header">
          {clickThruUrl ? (<a href={clickThruUrl ? clickThruUrl : "#"}>{uniprot_ac}</a>): <>{uniprot_ac}</> }
        </span>}
        {multiSequence && <span className="aln-line-header">{uniprot_id}</span>}
        <span className="highlight-line-number aln-line-header">{(start === -1 ? ("  ") : (start + 1 + offset))}</span>

        <span className="highlight-section">
          <span
            className="highlight-text"
            dangerouslySetInnerHTML={{ __html: buildRowText(rowData) }}
          ></span>

          {selectedHighlights && (
            <>
              <RowHighlight
                rowData={rowData}
                type="mutation"
                selectedHighlights={selectedHighlights}
              />
              <RowHighlight
                rowData={rowData}
                type="site_annotation"
                selectedHighlights={selectedHighlights}
              />
              <RowHighlight
                rowData={rowData}
                type="n_link_glycosylation"
                selectedHighlights={selectedHighlights}
              />
              <RowHighlight
                rowData={rowData}
                type="o_link_glycosylation"
                selectedHighlights={selectedHighlights}
              />
              <RowHighlight
                rowData={rowData}
                type="phosphorylation"
                selectedHighlights={selectedHighlights}
              />
              <RowHighlight
                rowData={rowData}
                type="glycation"
                selectedHighlights={selectedHighlights}
              />
              <RowHighlight
                rowData={rowData}
                type="text_search"
                selectedHighlights={selectedHighlights}
              />
            </>
          )}
        </span>
        {multiSequence && <span className="highlight-line-number aln-line-header">{(start === -1 ? ('\xa0') : (start + 60 + offset))}</span>}
      </>}
    </div>
  );
};


/**
 * slice sequence row into chuncks 
 * @param {array} array
 * @param {int} size
 * @returns chunks of sequence rows
 */
const sliceBy = (array, size) => {
  const result = [];
  for (let x = 0; x < array.length; x += size) {
    result.push(array.slice(x, x + size));
  }
  return result;
};


/**
 * slice sequences by size and block 
 * @param {array} sequences
 * @param {int} size
 * @returns array of sequences
 */
const sliceRowBlock = (sequences, size) => {
  var maxSequenceLength = findMaxSequenceLength(sequences);
  const result = [];
  for (let x = 0; x < maxSequenceLength; x += size) {
    for (let y = 0; y < sequences.length; y++) {

      if (sequences[y].consensus) {
        result.push({consensus : sequences[y].consensus, clickThruUrl : "", uniprot_id : "", uniprot_ac: "", index : -1, seq : sequences[y].seq.slice(x, x + size)});
      } else {
        result.push({consensus : sequences[y].consensus, uniprot_id : sequences[y].uniprot_id, 
          uniprot_ac: sequences[y].uniprot_ac, clickThruUrl : sequences[y].clickThruUrl, index : x, tax_name : sequences[y].tax_name,
          seq : sequences[y].seq.slice(x, x + size), offset: sequences[y].offset ? sequences[y].offset : 0});
      }
    }

    if (sequences.length > 1)
      result.push({consensus : false, uniprot_id : "", uniprot_ac: "", index : -1, seq : []});
  }
  return result;
};

/**
 * Finds the max length of all sequences or consensus
 * @param {array} sequences
 * @returns max length
 */
function findMaxSequenceLength(sequences) {
  // get length of all sequences
  var sequenceLengths = sequences.map(function (aln) {
     return aln.seq.length;
  });
  // sort aln length, from smallest to largest
  sequenceLengths.sort();
  // get the largest aln length
  var maxSequenceLength = sequenceLengths[sequenceLengths.length - 1];

  return maxSequenceLength;
}

/**
 * Sequence display control
 * @param {object} input props
 */
const SequenceDataDisplay = ({ sequenceData, selectedHighlights, multiSequence }) => {
  const [rows, setRows] = useState([]);
  const perLine = window.innerWidth <= 500 ? 10 : 60;

  const space = "             ";
  const space1 = "       ";
  const space2 = "          ";

  /**
  * useEffect to slice sequences
  */
  useEffect(() => {
    if (sequenceData ) {
      const rows = sliceRowBlock(sequenceData, perLine);
      const byChunks = rows.map((row) => {return {uniprot_id : row.uniprot_id, uniprot_ac : row.uniprot_ac, 
        index: row.index, seq: sliceBy(row.seq, SEQUENCE_ROW_RUN_LENGTH),
        tax_name: row.tax_name, consensus : row.consensus, clickThruUrl: row.clickThruUrl, offset : row.offset}});
      const reducedToRows = byChunks.map((row) =>
       {return {
        index : row.index, 
        uniprot_id : row.uniprot_id,
        uniprot_ac : row.uniprot_ac,
        tax_name : row.tax_name,
        consensus : row.consensus,
        clickThruUrl : row.clickThruUrl,
        offset : row.offset,
        seq: row.seq.reduce(
          (all, chunk) => [
            ...all,
            ...chunk,
            {
              character: "&nbsp;",
              n_link_glycosylation: false,
              o_link_glycosylation: false,
              mutation: false,
              site_annotation: false,
              phosphorylation: false,
              glycation: false,
            },
          ],
          []
        )
       }}
      );
      setRows(reducedToRows);
    }
  }, [sequenceData, perLine]);

  return (
      <div className="aln-block">
      <SequenceRow
          header={true}
          multiSequence={multiSequence}
          start={0}
      />
        <SequenceRow
          header={true}
          multiSequence={multiSequence}
          start={1}
      />
      {rows.map((row, index) => (
        <>
        <SequenceRow
          key={index}
          header={false}
          multiSequence={multiSequence}
          consensus={row.consensus}
          uniprot_id={row.uniprot_id}
          uniprot_ac={row.uniprot_ac}
          clickThruUrl={row.clickThruUrl}
          offset={row.offset}
          tax_name={row.tax_name}
          rowData={row.seq}
          start={row.index}
          selectedHighlights={selectedHighlights}
        />
    </>
      ))}
      </div>
  );
};

export default SequenceDataDisplay;
