import stringConstants from "../data/json/stringConstants";

const glycanData = stringConstants.glycan;
const commonGlycanData = glycanData.common;

/**
 * Class for creating direct glycan search queries.
 */
export default class GlycanDirectQueries {
    
    /**
	* Constructor for glycan direct search query object.
    **/
    constructor() {
        this.formjson = {
            [commonGlycanData.operation.id]: 'AND',
            [glycanData.advanced_search.query_type.id]: glycanData.advanced_search.query_type.name,
        };
    }

    /**
	* Function to generate glycan direct search json object.
    * @param {fieldType} fieldType - input field type.
    * @param {var} fieldValue - input field value.
    **/
    getJson(fieldType, fieldValue) {
        if (fieldType === commonGlycanData.mass.id){
            return this.getNativeMassJson(fieldValue);
        } else if (fieldType === commonGlycanData.mass_pme.id){
            return this.getMasspMeJson(fieldValue);
        } else if (fieldType === commonGlycanData.composition.id){
            return this.getCompositionJson(fieldValue);
        } else if (fieldType === commonGlycanData.glycan_type.id){
            return this.getTypeSubtypeJson(fieldValue);
        } else if (fieldType === commonGlycanData.organism.id){
            return this.getOrganismJson(fieldValue);
        } else if (fieldType === commonGlycanData.pmid.id){
            return this.getPMIDJson(fieldValue);
        } 
    }
   
    /**
	* Function to generate glycan native mass search json object.
    * @param {var} fieldValue - input field value.
    **/
    getNativeMassJson(fieldValue) {
        this.formjson[commonGlycanData.mass_type.id] = "Native";
        this.formjson[commonGlycanData.mass.id] = {
                        min: Math.floor(fieldValue.replace(/[^0-9.]/g, "")), 
                        max: Math.ceil(fieldValue.replace(/[^0-9.]/g, ""))
                    };

        return this.formjson;
    }

    /**
	* Function to generate glycan permethylated mass search json object.
    * @param {var} fieldValue - input field value.
    **/
    getMasspMeJson(fieldValue) {
        this.formjson[commonGlycanData.mass_type.id] = "Permethylated";
        this.formjson[commonGlycanData.mass.id] = {
                        min: Math.floor(fieldValue.replace(/[^0-9.]/g, "")), 
                        max: Math.ceil(fieldValue.replace(/[^0-9.]/g, ""))
                    };

        return this.formjson;
    }

    /**
	* Function to generate glycan composition search json object.
    * @param {var} fieldValue - input field value.
    **/
    getCompositionJson(fieldValue) {
        this.formjson[commonGlycanData.composition.id] = fieldValue.map((residue) => {
            return {
                residue: residue.residue.toLowerCase(),
                min: residue.count,
                max: residue.count
            }
        });
        return this.formjson;
    }

    /**
	* Function to generate glycan type search json object.
    * @param {var} fieldValue - input field value.
    **/
    getTypeSubtypeJson(fieldValue) {
        this.formjson[commonGlycanData.glycan_type.id] = fieldValue.type;
        if (fieldValue.subtype !== "") {
            this.formjson[commonGlycanData.glycan_subtype.id] = fieldValue.subtype;
        }
        return this.formjson;
    }

    /**
	* Function to generate glycan organism search json object.
    * @param {var} fieldValue - input field value.
    **/
    getOrganismJson(fieldValue) {
        this.formjson[commonGlycanData.organism.id] = fieldValue;
        return this.formjson;
    }

    /**
	* Function to generate glycan pmid search json object.
    * @param {var} fieldValue - input field value.
    **/
    getPMIDJson(fieldValue) {
        this.formjson[commonGlycanData.pmid.id] = fieldValue;
        return this.formjson;
    }
}
