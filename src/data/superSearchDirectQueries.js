

/**
 * Class for creating direct super search queries.
 */
export default class SuperSearchDirectQueries {

    /**
	* Constructor for direct super search query object.
    **/
    constructor() {
        this.superSearchQuery = {
            query: {
              aggregator: "$and",
              unaggregated_list: [],
              aggregated_list: []
            }
        };
    }

    /**
	* Function to generate protein direct search json object.
    * @param {fieldType} fieldType - input field type.
    * @param {var} fieldValue - input field value.
    * @param {var} nodeType - node type.
    * @param {var} operator - input field operator.
    * @param {var} fieldPath - input field path.
    **/
    getJson(fieldType, fieldValue, nodeType, operator, fieldPath) {
        this.superSearchQuery.concept = nodeType;
        return this.getQuery(fieldType, fieldValue, operator, fieldPath);
    }

    /**
	* Function to generate motif search json object.
    * @param {fieldType} fieldType - input field type.
    * @param {var} fieldValue - input field value.
    * @param {var} operator - input field operator.
    * @param {var} fieldPath - input field path.
    **/
    getQuery(fieldType, fieldValue, operator, fieldPath) {

        this.superSearchQuery.query.unaggregated_list.push({
            path: fieldPath,
            order: 0,
            operator: operator,
            [fieldType]: fieldValue
        });

        return this.superSearchQuery;
    }
}