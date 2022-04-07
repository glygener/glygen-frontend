/**
 * Getting mutation data
 * @param {array} mutationData
 * @return an array of highlight info.
 */
 export function getMutationHighlightData(mutationData) {
    var result = [];
    var positions = {};
  
    if (mutationData) {
      for (var x = 0; x < mutationData.length; x++) {
        if (!positions[mutationData[x].start_pos]) {
          positions[mutationData[x].start_pos] = true;
          result.push({
            start: mutationData[x].start_pos,
            length: mutationData[x].end_pos - mutationData[x].start_pos + 1,
          });
        }
      }
    }
    return result;
  }
  
  /**
   * Getting sequon data
   * @param {array} sequonData
   * @return an array of highlight info.
   */
   export function getSequonHighlightData(sequonData) {
    var result = [];
    var positions = {};
  
    if (sequonData){
      for (var x = 0; x < sequonData.length; x++) {
        if (!positions[sequonData[x].start_pos]) {
          positions[sequonData[x].start_pos] = true;
          result.push({
            start: sequonData[x].start_pos,
            length: sequonData[x].end_pos - sequonData[x].start_pos + 1,
          });
        }
      }
    }
    return result;
  }
  
  /**
   * Getting phosphorylation data
   * @param {array} phosphorylationData
   * @return an array of highlight info.
   */
   export function getPhosphorylationHighlightData(phosphorylationData) {
    var result = [];
    var positions = {};
  
    if (phosphorylationData){
      for (var x = 0; x < phosphorylationData.length; x++) {
        if (!positions[phosphorylationData[x].start_pos]) {
          positions[phosphorylationData[x].start_pos] = true;
          result.push({
            start: phosphorylationData[x].start_pos,
            length: phosphorylationData[x].end_pos - phosphorylationData[x].start_pos + 1,
          });
        }
      }
    }
    return result;
  }
  
  /**
   * Getting glycation data
   * @param {array} glycationData
   * @return an array of highlight info.
   */
   export function getGlycationHighlightData(glycationData) {
    var result = [];
    var positions = {};
  
    if (glycationData) {
      for (var x = 0; x < glycationData.length; x++) {
        if (!positions[glycationData[x].start_pos]) {
          positions[glycationData[x].start_pos] = true;
          result.push({
            start: glycationData[x].start_pos,
            length: glycationData[x].end_pos - glycationData[x].start_pos + 1,
          });
        }
      }
    }
    return result;
  }
  
/**
   * Getting distinct glycan posittions
   * @param {object} value
   * @param {int} index
   * @param {array} self
   * @return boolean value.
  */  
 const distinctGlycanPositions = (value, index, self) => {
  const findPosition = self.find((item) => item.start_pos === value.start_pos);
    return self.indexOf(findPosition) === index;
  };
  
  
  /**
   * Getting N glycosylation data
   * @param {array} glycosylationData
   * @return an array of highlight info.
   */
   export function getNLinkGlycanMapHighlights(glycosylationData) {
    if (glycosylationData) {
      const tempGlycosylation = glycosylationData.filter((item) => item.start_pos !== undefined && item.start_pos === item.end_pos);    
      const nLink = tempGlycosylation
        .filter((item) => item.type === "N-linked")
        //.filter(hasStartPos)
        .filter(distinctGlycanPositions)
        .map((item) => ({
          start: item.start_pos,
          length: 1,
        }));
        return nLink;
    }

    return [];
  }
  
  /**
   * Getting glycosylation data
   * @param {array} glycosylationData
   * @return an array of highlight info.
   */
   export function getOLinkGlycanMapHighlights(glycosylationData) {    
    if (glycosylationData){
      const tempGlycosylation = glycosylationData.filter((item) => item.start_pos !== undefined && item.start_pos === item.end_pos);    
      const oLink = tempGlycosylation
        .filter((item) => item.type === "O-linked")
        //.filter(hasStartPos)
        .filter(distinctGlycanPositions)
        .map((item) => ({
          start: item.start_pos,
          length: 1,
        }));
    
        return oLink;
    }
    return [];
  }