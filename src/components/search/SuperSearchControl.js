import React, { useEffect, useReducer, useState } from 'react';
import '../../css/Search.css';
import stringConstants from '../../data/json/stringConstants';
import superSearchData from '../../data/json/superSearchData';
import { getSuperSearch } from '../../data/supersearch';
import SuperSearchInputcontrol from '../input/SuperSearchInputcontrol';
import { Dialog } from "@material-ui/core";
import Button from 'react-bootstrap/Button';
import {logActivity} from '../../data/logging';
import {axiosError} from '../../data/axiosError';
import TextAlert from '../../components/alert/TextAlert';
import {sortByOrder} from '../../utils/common';
import PropTypes from "prop-types";

/**
 * Super search component for showing dialog box with input controls.
 */
const SuperSearchControl = (props) => {

    let fieldTypes = superSearchData.common.fieldTypes;

    const [controlArray, setControlArray] = useState([
        {
            "order":0,
            "aggregator":"",
            "field":"",
            "fieldType":"",
            "operation":"",
            "value":"",
            "typeaheadID":"",
            "maxlength":100,
            "error":false,
            "operationEnum":[],
            "selectEnum":[]
        }]);

    const [alertTextInput, setAlertTextInput] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {show: false, id: ""}
    );

    /**
	 * useEffect for populating query data into array and set the respective state variable.
	 */
    useEffect(() => {
        setControlArray([]);

        document.addEventListener('click', (event) => {
			!event.defaultPrevented && setAlertTextInput({"show": false})
        });
        
        var tempArray = [];

        let queryDataTemp = props.queryData.filter((value) => value.concept === props.selectedNode);

        queryDataTemp && supSearchQueryDataToArray(queryDataTemp, tempArray)

        tempArray.sort(sortByOrder);

        let lastOrder = 0;
        if  (tempArray.length > 0){
            lastOrder = tempArray[tempArray.length - 1].order;
        }
        let len = lastOrder > 4 ? lastOrder : 4;
        for (let i = 0; i < len; i++){
            let curOrder = tempArray.find((que) => {return que.order === i});

            if (curOrder) {
                continue;
            }

            tempArray.push(
                {
                    order: i, 
                    aggregator:"",
                    field:"",
                    fieldType:"",
                    operation:"",
                    value:"",
                    typeaheadID:"",
                    maxlength:100,
                    error:false,
                    operationEnum:[],
                    selectEnum:[]
                })
        }
        setControlArray(tempArray);
    }, [props.selectedNode])


    /**
	 * Function to convert query data into array.
	 * @param {array} queryData - complex query data used in search.
     * @param {array} tempArray - query data will be converted into array - out param.
	 **/
    function supSearchQueryDataToArray(queryData, tempArray) {

        for (let i = 0; queryData && i < queryData.length && props.data.fields && props.data.fields.length > 0 ; i++){

            let curQuery = queryData[i].query ? queryData[i].query : queryData[i];

            for (let j = 0; curQuery.unaggregated_list && j < curQuery.unaggregated_list.length; j++){

                let query = curQuery.unaggregated_list[j];
                let curfield = props.data.fields.filter((value)=> value.id === query.path)[0];
                tempArray.push(
                    {
                        order: query.order, 
                        aggregator: curQuery.aggregator,
                        field: query.path,
                        fieldType: curfield.type,
                        operation: query.operator,
                        value: query[fieldTypes[curfield.type]],
                        typeaheadID:curfield.typeahead,
                        maxlength: curfield.maxlength,
                        error:false,
                        operationEnum: curfield.oplist,
                        selectEnum: curfield.enum
                    })
            }
            supSearchQueryDataToArray(curQuery.aggregated_list, tempArray);
        }
    }

    /**
	 * Function to delete query.
	 * @param {number} order - query order number.
	 **/
	function supSearchDeleteQuery(order) {
        var tempArray = controlArray.filter(query => query.order !== order);
        tempArray.map((value, index, arr) => {
            if (value.order > order) {
                value.order = value.order - 1;
            }
            return value;
        }) 
        setControlArray(tempArray);
    }

    /**
	 * Function to add query.
	 * @param {number} order - query order number.
	 **/
	function supSearchAddQuery(order) {
        var tempArray = controlArray.slice();
        tempArray.map((value, index, arr) => {
            if (value.order >= order) {
                value.order = value.order + 1;
            }
            return value;
        }) 
        tempArray.push({
            order:order,
            aggregator:"",
            field:"",
            fieldType:"",
            operation:"",
            value:"",
            typeaheadID:"",
            maxlength:100,
            error:false,
            operationEnum:[],
            selectEnum:[]
        });
        setControlArray(tempArray);
    }

    /**
	 * Function to move query up.
	 * @param {number} currOrder - current query order number.
     * @param {number} prevOrder - previous query order number.
	 **/
	function supSearchMoveUpQuery(currOrder, prevOrder) {
        var tempArray = controlArray.slice();
        var currQuery = tempArray.filter(query => query.order === currOrder)[0];
        var prevQuery = tempArray.filter(query => query.order === prevOrder)[0];

        var updatedArray = tempArray.filter(query => query.order !== currOrder && query.order !== prevOrder);

        currQuery.order = prevOrder;
        prevQuery.order = currOrder;

        updatedArray.push(prevQuery);
        updatedArray.push(currQuery);

        setControlArray(updatedArray);
    }

    /**
	 * Function to move query down.
	 * @param {number} currOrder - current query order number.
     * @param {number} nextOrder - next query order number.
	 **/
	function supSearchMoveDownQuery(currOrder, nextOrder) {
        var tempArray = controlArray.slice();
        var currQuery = tempArray.filter(query => query.order === currOrder)[0];
        var nextQuery = tempArray.filter(query => query.order === nextOrder)[0];

        var updatedArray = tempArray.filter(query => query.order !== currOrder && query.order !== nextOrder);

        currQuery.order = nextOrder;
        nextQuery.order = currOrder;

        updatedArray.push(currQuery);
        updatedArray.push(nextQuery);

        setControlArray(updatedArray);
    }

    /**
	 * Function to update query data.
	 * @param {number} currOrder - current query order number.
     * @param {string} field - value type.
	 * @param {var} value - value of the field.
	 **/
	function supSearchUpdateQuery(currOrder, field, value) {
        var tempArray = controlArray.slice();
        var currQuery = tempArray.filter(query => query.order === currOrder)[0];

        var updatedArray = tempArray.filter(query => query.order !== currOrder);

        currQuery[field] = value;

        updatedArray.push(currQuery);

        setControlArray(updatedArray);
    }

    /**
	 * Function to perform super search query and update result count.
     * @param {object} event - event object.
	 **/
	function supSearchSubmitQuery(event) {
        event.preventDefault(true);

        var tempArray = controlArray.slice();
        var concept = props.selectedNode;
        var searchQuery = {
            concept: concept, 
            query:{} 
        };

        var tempArray1 = tempArray.filter((query) => query.field !== "")
                        .sort(sortByOrder);
        var currentQuery;

        var tempArray2 = tempArray1.filter((query) => query.value === "" || query.error);
        if (tempArray2.length > 0) {
           let tempArray3 = controlArray.map((query) => {
                if (query.value === "" && query.field !== ""){
                    query.error = true;
                }
                return query;
            })
            setControlArray(tempArray3);
            setAlertTextInput({"show": true, "id": stringConstants.errors.superSearchError.id});
            return;
        }
        
        for (var i = tempArray1.length - 1; i >= 0; i--){
            if (i === tempArray1.length - 1){
                searchQuery.query = {
                    aggregator: "",
                    aggregated_list: [],
                    unaggregated_list: []
                };
                currentQuery = searchQuery.query;
                currentQuery.aggregator = tempArray1[i].aggregator;

                let temp = {
                    path: tempArray1[i].field,
                    order: tempArray1[i].order, 
                    operator: tempArray1[i].operation,
                    [fieldTypes[tempArray1[i].fieldType]]: tempArray1[i].fieldType === "number" ? Number(tempArray1[i].value) : tempArray1[i].value, 
                }
                currentQuery.unaggregated_list.push(temp);
            } else {
                if (currentQuery.aggregator === tempArray1[i].aggregator || i === 0) {

                    let temp = {
                        path: tempArray1[i].field,
                        order: tempArray1[i].order, 
                        operator: tempArray1[i].operation,
                        [fieldTypes[tempArray1[i].fieldType]]: tempArray1[i].fieldType === "number" ? Number(tempArray1[i].value) : tempArray1[i].value, 
                    }
                    currentQuery.unaggregated_list.push(temp);
                } else {
                    let query = {
                        aggregator: tempArray1[i].aggregator,
                        aggregated_list: [],
                        unaggregated_list: []
                    } 

                    let temp = {
                        path: tempArray1[i].field,
                        order: tempArray1[i].order, 
                        operator: tempArray1[i].operation,
                        [fieldTypes[tempArray1[i].fieldType]]: tempArray1[i].fieldType === "number" ? Number(tempArray1[i].value) : tempArray1[i].value
                    }
                    query.unaggregated_list.push(temp);
                    currentQuery.aggregated_list.push(query);
                    currentQuery = query;
                }
            }
        }

        // Commented to block second query execution.
        // let finalSearchQuery = props.queryData.filter((query) => query.concept !== props.selectedNode);

        let finalSearchQuery = [];

        if (tempArray1.length > 0) {
            finalSearchQuery.push(searchQuery);
        }

        props.executeSuperSearchQuery(finalSearchQuery);
    }

    /**
	 * Function to clear input field values.
	 **/
	const clearSuperSearchFields = () => {
        var tempArray = controlArray.slice();

        for (let i = 0; i < tempArray.length; i++){
            tempArray[i].aggregator = "";
            tempArray[i].field = "";
            tempArray[i].fieldType = "";
            tempArray[i].operation = "";
            tempArray[i].value = "";
            tempArray[i].typeaheadID = "";
            tempArray[i].maxlength = 100;
            tempArray[i].error = false;
            tempArray[i].operationEnum = [];
            tempArray[i].selectEnum = [];
        }
        setControlArray(tempArray);
	};

    return (
		<>            
            <Dialog
                open={props.selectedNode !== "" && !props.userPermission}
                classes= {{
                    paper: "alert-dialog",
                }}
                style={{margin:40}}
                maxWidth={'lg'}
                disableScrollLock
                onClose={() => props.setSelectedNode("")} 
            >  
                <div className = "gf-content-div">
                    <h5 className= "sups-dialog-title" style={{width: '1200px' }}>Add {props.data.label ? props.data.label.toLowerCase() : props.data.label} properties to search</h5>
                    <div 
                        style={{paddingRight:40, paddingLeft:40, content:'center', width: '1200px' }}
                    >
                        <p><span id='display'></span></p>
                        <TextAlert
                            alertInput={alertTextInput}
                        />
                        <div style={{height: alertTextInput.show ? '15px' : '30px'}}></div>
                        <div style={{paddingTop: '2px', overflow: 'scroll', content:'center', height: '270px', width: '1120px' }}>
                            {controlArray.sort(sortByOrder).map((query, index, cntArr ) =>
                                <SuperSearchInputcontrol 
                                    key={query.order}
                                    query={query} 
                                    prevOrderId={index - 1 === -1 ? undefined : cntArr[index - 1].order} 
                                    nextOrderId={index + 1 === controlArray.length ? undefined : cntArr[index + 1].order}
                                    supSearchDeleteQuery={supSearchDeleteQuery} supSearchAddQuery={supSearchAddQuery}
                                    supSearchMoveUpQuery={supSearchMoveUpQuery} supSearchMoveDownQuery={supSearchMoveDownQuery}
                                    supSearchUpdateQuery={supSearchUpdateQuery}
                                    data={props.data} selectedNode={props.selectedNode}
                            />)}
                        </div>
                        <div style={{ marginTop: "20px", marginRight: "15px" }}>
                            <Button
                                className='gg-btn-blue mb-5'
                                style={{ float: "right" }}
                                onClick={supSearchSubmitQuery}
                                disabled={
                                    !controlArray.every(
                                        ({error}) => error === false
                                    )
                                    }
                                >
                                Search
                            </Button>
                            <Button
                                className='gg-btn-outline mr-3 mb-5'
                                style={{ float: "right" }}
                                onClick={clearSuperSearchFields}
                                >
                                Clear Fields
                            </Button>
                            <Button
                                className='gg-btn-outline mr-3 mb-5'
                                style={{ float: "right" }}
                                onClick={() => props.setSelectedNode("")}
                                >
                                Cancel
                            </Button>
                        </div>
                    </div>  
                </div>
            </Dialog>
        </>
	);
};

export default SuperSearchControl;

SuperSearchControl.propTypes = {
    data: PropTypes.array,
    queryData: PropTypes.array,
	selectedNode: PropTypes.string,
	setSelectedNode: PropTypes.func,
	executeSuperSearchQuery: PropTypes.func
};
