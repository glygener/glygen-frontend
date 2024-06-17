import stringConstants from "../data/json/stringConstants";

const proteinData = stringConstants.protein;
const commonProteinData = proteinData.common;

/**
 * Class for creating direct protein search queries.
 */
export default class ProteinDirectQueries {

    /**
	* Constructor for protein direct search query object.
    **/
    constructor() {
        this.formjson = {
            [commonProteinData.operation.id]: 'AND',
            [proteinData.advanced_search.query_type.id]: proteinData.advanced_search.query_type.name,
        };
    }

    /**
	* Function to generate protein direct search json object.
    * @param {fieldType} fieldType - input field type.
    * @param {var} fieldValue - input field value.
    **/
    getJson(fieldType, fieldValue) {
        if (fieldType === commonProteinData.chemical_mass.id){
            this.getChemicalMassJson(fieldValue);
        } else if (fieldType === commonProteinData.go_id.id){
            this.getGoTermIDJson(fieldValue);
        } else if (fieldType === commonProteinData.pathway_id.id){
            this.getPathwayIDJson(fieldValue);
        } else if (fieldType === commonProteinData.disease_id.id){
            this.getDiseaseIDJson(fieldValue);
        } else if (fieldType === commonProteinData.pmid.id){
            this.getPMIDJson(fieldValue);
        }
        return this.formjson;
    }

    /**
	* Function to generate protein chemical mass search json object.
    * @param {var} fieldValue - input field value.
    **/
    getChemicalMassJson(fieldValue) {
        this.formjson[commonProteinData.mass.id] = {
                        min: parseInt(fieldValue) - 1, 
                        max: parseInt(fieldValue) + 1
                    };
        return this.formjson;
    }

    /**
	* Function to generate protein go id search json object.
    * @param {var} fieldValue - input field value.
    **/
    getGoTermIDJson(fieldValue) {
        this.formjson[commonProteinData.go_id.id] = fieldValue;
        return this.formjson;
    }

    /**
	* Function to generate protein pathway id search json object.
    * @param {var} fieldValue - input field value.
    **/
    getPathwayIDJson(fieldValue) {
        this.formjson[commonProteinData.pathway_id.id] = fieldValue;
        return this.formjson;
    }

    /**
	* Function to generate protein disease id search json object.
    * @param {var} fieldValue - input field value.
    **/
    getDiseaseIDJson(fieldValue) {
        this.formjson[commonProteinData.disease_id.id] = fieldValue;
        return this.formjson;
    }

    /**
	* Function to generate protein pmid search json object.
    * @param {var} fieldValue - input field value.
    **/
    getPMIDJson(fieldValue) {
        this.formjson[commonProteinData.pmid.id] = fieldValue;
        return this.formjson;
    }
}