import React, { useState, useEffect } from "react";
import "../css/proteinsequence.css";

const SEQUENCE_ROW_RUN_LENGTH = 10;

/**
 * building row
 * @param {array} rowData
 * @returns string of sequence
 */
function buildRowText(rowData) {
  var text = [];

  for (var x = 0; x < rowData.length; x++) {
    text.push(rowData[x].character);
  }
  return text.join("");
}

/**
 * building rowhighlight
 * @param {array} rowData
 * @param {string}type
 * @returns string of sequence
 */
const RowHighlight = ({ rowData, type, selectedHighlights }) => {
  const isSelected = selectedHighlights[type];

  if (!isSelected) {
    return <></>;
  }

  return (
    <span className="highlight-highlight" data-type={type}>
      {rowData.map(row => {
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
 * @param {number} start
 * @param {array} rowData
 * @returns jquery object of the row
 */
const SequenceRow = ({ rowData, start, selectedHighlights }) => {
  return (
    <div className="highlight-row">
      <span className="highlight-line-number">
        {("     " + (start + 1)).slice(-5) + " "}
      </span>
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
          </>
        )}
      </span>
    </div>
  );
};
const sliceBy = (array, size) => {
  const result = [];
  for (let x = 0; x < array.length; x += size) {
    result.push(array.slice(x, x + size));
  }
  return result;
};

/**
 * creating UI perline
 * @param {object} sequenceData
 * @param {object} selectedHighlights
 */
const SequenceDisplay = ({ sequenceData, selectedHighlights }) => {
  const [rows, setRows] = useState([]);
  const perLine = window.innerWidth <= 500 ? 10 : 60;

  const space = "                 ";
  const space1 = "       ";
  const space2 = "          ";

  useEffect(() => {
    if (sequenceData && sequenceData.length) {
      const rows = sliceBy(sequenceData, perLine);
      const byChunks = rows.map(row => sliceBy(row, SEQUENCE_ROW_RUN_LENGTH));
      const reducedToRows = byChunks.map(row =>
        row.reduce(
          (all, chunk) => [
            ...all,
            ...chunk,
            {
              character: "&nbsp;",
              n_link_glycosylation: false,
              o_link_glycosylation: false,
              mutation: false,
              site_annotation: false
            }
          ],
          []
        )
      );

      setRows(reducedToRows);
    }
  }, [sequenceData, perLine]);

  return (
    <div className="highlight-display">
      <pre className="sequencePreClass">
        {space} +10{space1} +20{space1} +30{space1} +40 {space1}+50
      </pre>
      <pre className="sequencePreClass">
        {space}|{space2}|{space2}|{space2}|{space2}|
      </pre>
      {rows.map((row, index) => (
        <SequenceRow
          key={index}
          rowData={row}
          start={index * perLine}
          selectedHighlights={selectedHighlights}
        />
      ))}
    </div>
  );
};

export default SequenceDisplay;
