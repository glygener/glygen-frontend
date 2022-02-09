import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import SequenceDataDisplay from "./SequenceDataDisplay";
import { getPhosphorylationHighlightData, getNLinkGlycanMapHighlights, getOLinkGlycanMapHighlights,
  getSequonHighlightData, getMutationHighlightData, getGlycationHighlightData } from "../../data/sequenceHighlighter";
import "../../css/proteinsequence.css";

/**
 * Sequence viewer control.
 */
const SequenceViewer = ({
  details,
  consensus,
  sequenceObject,
  selectedHighlights,
  multiSequence,
  sequenceSearchText
}) => {

  const [sequenceData, setSequenceData] = useState();

  const [siteAnnotationMapHighlights, setSiteAnnotationMapHighlights] = useState(new Map());
  const [glycationMapHighlights, setGlycationMapHighlights] = useState(new Map());
  const [mutationMapHighlights, setMutationMapHighlights] = useState(new Map());
  const [phosphorylationMapHighlights, setPhosphorylationMapHighlights] = useState(new Map());
  const [nLinkGlycanMapHighlights, setNLinkGlycanMapHighlights] = useState(new Map());
  const [oLinkGlycanMapHighlights, setOLinkGlycanMapHighlights] = useState(new Map());
  const [searchTextHighlights, setSearchTextHighlights] = useState(new Map());

/**
 * checking if position is highlighted or not
 * @param {number} position
 * @param {array} selection
 * @return: true {boolean} if position in the range
 */
function isHighlighted(position, selection, character) {
  var result = false;

  if (character === '-')
    return result;
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
 * builds highlight data for sequences and consensus.
 * @param {array} sequences
 * @param {string} consensus
 * @return: array
 */
function buildHighlightData(sequences, consensus) {
  var result = [];

  if (sequences) {
      for (let y = 0; y < sequences.length; y++){
        var sequence = sequences[y].aln;
        var uniprot_ac = sequences[y].uniprot_ac;
        var uniprot_id = sequences[y].uniprot_id;
        var tax_name = sequences[y].tax_name;
        var clickThruUrl = sequences[y].clickThruUrl;
        var result1 = [];
        var site_annotation = siteAnnotationMapHighlights[uniprot_ac];
        var glycation = glycationMapHighlights[uniprot_ac];
        var mutation = mutationMapHighlights[uniprot_ac];
        var phosphorylation = phosphorylationMapHighlights[uniprot_ac];
        var nLinkGlycan = nLinkGlycanMapHighlights[uniprot_ac];
        var oLinkGlycan = oLinkGlycanMapHighlights[uniprot_ac];
        var searchTextArr = searchTextHighlights[uniprot_ac];

        var offset = sequences[y].offset ? sequences[y].offset : 0;
        //alert(offset);
        var count = 0;
        for (var x = 0; x < sequence.length; x++) {
          if (sequence[x] === '-'){
            count--;
          }
          var position = offset + x + count + 1;
          result1.push({
            character: sequence[x] === " " ? "&nbsp;" : sequence[x],
            n_link_glycosylation: isHighlighted(position, nLinkGlycan, sequence[x]),
            o_link_glycosylation: isHighlighted(position, oLinkGlycan, sequence[x]),
            mutation: isHighlighted(position, mutation, sequence[x]),
            site_annotation: isHighlighted(position, site_annotation, sequence[x]),
            phosphorylation: isHighlighted(position, phosphorylation, sequence[x]),
            glycation: isHighlighted(position, glycation, sequence[x]),
            text_search: isHighlighted(x, searchTextArr, sequence[x]),
          });
        }
        result.push({consensus : false, uniprot_ac : uniprot_ac, clickThruUrl : clickThruUrl, uniprot_id : uniprot_id, tax_name : tax_name, seq: result1, offset : offset});
      }

      if (consensus && consensus !== "") {
        var result1 = [];
        for (var x = 0; x < consensus.length; x++) {
          var position = x + 1;
          result1.push({
            character: consensus[x] === " " ? "&nbsp;" : consensus[x],
            n_link_glycosylation: false,
            o_link_glycosylation: false,
            mutation: false,
            site_annotation: false,
            phosphorylation: false,
            glycation: false,
            text_search: false
          });
        }
        result.push({consensus : true, seq: result1});
      }  
      return result;
  }
  return [];
}

 /**
 * useEffect to build highlight data maps.
 */
  useEffect(() => {
    let glycoNMap = new Map();
    let glycoOMap = new Map();
    let phMap = new Map();
    let siAnMap = new Map();
    let muMap = new Map();
    let glycaMap = new Map();

    details && details.map((det) => {
      phMap[det.uniprot_canonical_ac] = getPhosphorylationHighlightData(det.phosphorylation);
      glycoNMap[det.uniprot_canonical_ac] = getNLinkGlycanMapHighlights(det.glycosylation);
      glycoOMap[det.uniprot_canonical_ac] = getOLinkGlycanMapHighlights(det.glycosylation);
      siAnMap[det.uniprot_canonical_ac] = getSequonHighlightData(det.site_annotation);
      muMap[det.uniprot_canonical_ac] = getMutationHighlightData(det.snv);
      glycaMap[det.uniprot_canonical_ac] = getGlycationHighlightData(det.glycation);
    });

    setSiteAnnotationMapHighlights(siAnMap);
    setGlycationMapHighlights(glycaMap);
    setMutationMapHighlights(muMap);
    setPhosphorylationMapHighlights(phMap);
    setNLinkGlycanMapHighlights(glycoNMap);
    setOLinkGlycanMapHighlights(glycoOMap);

  }, [details]);

  /**
  * useEffect to set sequence data.
  */
  useEffect(() => {
    setSequenceData(buildHighlightData(sequenceObject, consensus));
  }, [
    sequenceObject,
    selectedHighlights,
    searchTextHighlights
  ]);

  /**
  * useEffect to build text search highlight map.
  */
  useEffect(() => {
    if (sequenceObject && selectedHighlights.text_search) {
      let searchMap = new Map();
      let searchText = sequenceSearchText;
      var re;
      try {
        searchText = searchText.replaceAll(/x/ig, '\\w')
        re = new RegExp(searchText, 'ig');
      } catch(e){
        searchText = "";
        re = new RegExp(searchText, 'ig');
      }
      
      for (let y = 0; y < sequenceObject.length; y++){
        var result = [];
        var uniprot_ac = sequenceObject[y].uniprot_ac;

        if (searchText === "") {
          searchMap[uniprot_ac] = result;
          continue;
        }
        var sequence = sequenceObject[y].aln;
        var seqModArr = [];
        var dashCount = 0;
        for (let x = 0; x < sequence.length; x++) {
          if (sequence[x] === '-') {
            dashCount++;
          } else {
            seqModArr[x - dashCount] = x;
          }
        }

        var sequenceMod;
        if (sequenceObject[y].alnMod){
          sequenceMod = sequenceObject[y].alnMod ;
        }  else {
          sequenceMod = sequence.replaceAll(/-/ig, '');
          sequenceObject[y].alnMod = sequenceMod;
        }
        var textMatchArr =  sequenceMod.matchAll(re);
        for (const match of textMatchArr) {
          if (match[0].length !== 0) {
            result.push({
              start: seqModArr[match.index],
              length: seqModArr[match.index + match[0].length - 1] + 1 - seqModArr[match.index],
            });
          }
        } 
        searchMap[uniprot_ac] = result;
      }
      setSearchTextHighlights(searchMap);
    }
  }, [sequenceObject,
    sequenceSearchText,
    selectedHighlights
  ]);

  if (!sequenceObject) {
    return <p>No Data Available.</p>;
  }

  return (
    <Grid container className="content-box">
       <Grid item className="sequnce_highlight">
        <div>
          {sequenceObject && (
            <SequenceDataDisplay sequenceData={sequenceData} selectedHighlights={selectedHighlights} 
            multiSequence={multiSequence}/>
          )}
        </div>
      </Grid>
     </Grid>
  );
};

export default SequenceViewer;
