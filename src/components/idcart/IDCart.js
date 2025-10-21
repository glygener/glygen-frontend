import React, { useEffect, useReducer, useState, useContext } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../../utils/head.js";
import PageLoader from "../load/PageLoader.js";
import Button from "react-bootstrap/Button";
import TextAlert from "../alert/TextAlert.js";
import DialogAlert from "../alert/DialogAlert.js";
import { Tab, Tabs, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../css/Search.css";
import stringConstants from "../../data/json/stringConstants";
import routeConstants from "../../data/json/routeConstants";
import { logActivity } from "../../data/logging.js";
import { axiosError } from "../../data/axiosError.js";
import FeedbackWidget from "../FeedbackWidget.js";
import LineTooltip from "../tooltip/LineTooltip.js";
import { getGlycanImageUrl } from "../../data/glycan.js";
import PaginatedTable from "../PaginatedTable.js";
import deleteIcon from "../../images/icons/delete.svg";
import { Image } from "react-bootstrap";
import { getIDsFromStore, deleteID, updateIDCartObject, clearCartType } from "../../data/idCartApi.js"
import GlyGenNotificationContext from "../GlyGenNotificationContext.js";
import SelectControl from "../select/SelectControl.js";
import { getCartList } from "../../data/cart.js"
import idCartJson from "../../data/json/idCart";
import DownloadButton from "../DownloadButton.js";
import DownloadFileMenu from "../DownloadFileMenu.js";
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import { getGlycanSearch, getGlycanSimpleSearch } from "../../data/glycan.js";
import { getProteinSearch, getProteinSimpleSearch } from "../../data/protein.js";
import { getGlycanList, getProteinList } from "../../data/index.js";
import { getGlobalSearch } from '../../data/commonApi.js';
import { getSuperSearch } from '../../data/supersearch.js';
import IDCartAlert from "../alert/IDCartAlert.js";
import Badge from '@mui/material/Badge';

const searchErrorMsg =  "If re-execution of search fails repeatedly or record does not exist. Please delete the current cached list record and re-execute the search and save list result to cart.";
const listErrorMsg =  "If re-execution of import fails repeatedly or record does not exist. Please re-execute the search to update the cached list results.";

const createSorter = (sortField, sortOrder) => (a, b) => {
  if (a[sortField] > b[sortField]) {
    return sortOrder === "asc" ? 1 : -1;
  } else if (a[sortField] < b[sortField]) {
    return sortOrder === "asc" ? -1 : 1;
  }
  return 0;
};

/**
 * Protein search component for showing protein search tabs.
 */
const IDCart = props => {
  
  const [proActTabKey, setProActTabKey] = useState("Glycan");
  const [pageLoading, setPageLoading] = useState(false);
  const [alertTextInput, setAlertTextInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const [clearDialogInput, setClearDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "", cartType: "" }
  );

  const [pageGlycan, setPageGlycan] = useState(1);
  const [pageDataGlycan, setPageDataGlycan] = useState([]);
  const [sizePerPageGlycan, setSizePerPageGlycan] = useState(20);
  const [totalGlycanSize, setTotalGlycanSize] = useState(0);
  const [currentGlycanSort, setCurrentGlycanSort] = useState("");
  const [currentGlycanSortOrder, setCurrentGlycanSortOrder] = useState("asc");

  const [pageProtein, setPageProtein] = useState(1);
  const [pageDataProtein, setPageDataProtein] = useState([]);
  const [sizePerPageProtein, setSizePerPageProtein] = useState(20);
  const [totalProteinSize, setTotalProteinSize] = useState(0);
  const [currentProteinSort, setCurrentProteinSort] = useState("");
  const [currentProteinSortOrder, setCurrentProteinSortOrder] = useState("asc");

  const [pageGlycanList, setPageGlycanList] = useState(1);
  const [pageDataGlycanList, setPageDataGlycanList] = useState([]);
  const [sizePerPageGlycanList, setSizePerPageGlycanList] = useState(20);
  const [totalGlycanListSize, setTotalGlycanListSize] = useState(0);
  const [currentGlycanListSort, setCurrentGlycanListSort] = useState("");
  const [currentGlycanListSortOrder, setCurrentGlycanListSortOrder] = useState("asc");

  const [pageProteinList, setPageProteinList] = useState(1);
  const [pageDataProteinList, setPageDataProteinList] = useState([]);
  const [sizePerPageProteinList, setSizePerPageProteinList] = useState(20);
  const [totalProteinListSize, setTotalProteinListSize] = useState(0);
  const [currentProteinListSort, setCurrentProteinListSort] = useState("");
  const [currentProteinListSortOrder, setCurrentProteinListSortOrder] = useState("asc");

  const [glycanData, setGlycanData] = useState([]);
  const [selectedGlycanData, setSelectedGlycanData] = useState([]);
  const [selectedGlycanRows, setSelectedGlycanRows] = useState([]);
  
  const [glycanListData, setGlycanListData] = useState([]);
  const [selectedGlycanListData, setSelectedGlycanListData] = useState([]);
  const [selectedGlycanListRows, setSelectedGlycanListRows] = useState([]);
  const [proteinData, setProteinData] = useState([]);
  const [selectedProteinData, setSelectedProteinData] = useState([]);
  const [selectedProteinRows, setSelectedProteinRows] = useState([]);
  const [proteinListData, setProteinListData] = useState([]);
  const [selectedProteinListData, setSelectedProteinListData] = useState([]);
  const [selectedProteinListRows, setSelectedProteinListRows] = useState([]);
  const [update, setUpdate] = useState(false);
  const [glycanMenu, setGlycanMenu] = useState([]);
  const [glycanListMenu, setGlycanListMenu] = useState([]);
  const [proteinMenu, setProteinMenu] = useState([]);
  const [proteinListMenu, setProteinListMenu] = useState([]);
  const [validationMap, setValidationMap] = useState(new Map());
  const [glycanValue, setGlycanValue] = useState("");
  const [glycanListValue, setGlycanListValue] = useState("");
  const [proteinValue, setProteinValue] = useState("");
  const [proteinListValue, setProteinListValue] = useState("");
  const {showTotalCartIdsNotification} = useContext(GlyGenNotificationContext);
  const [idCartErrorDialogInput, setIDCartErrorDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, error: "" }
  );
  const navigate = useNavigate();
  let proteinStrings = stringConstants.protein.common;
  const glycanStrings = stringConstants.glycan.common;

   /**
   * Function to delete cart entry.
   * @param {number} id - id number.
   **/
    function deleteIDFromStore(e, type, id) {
      e.preventDefault();

      if (type === "glycanID") {
        let glycanIDs = selectedGlycanData.filter(glid => glid !== id);
        setSelectedGlycanData(glycanIDs);
        setSelectedGlycanRows(glycanIDs);
      } else if (type === "glycanList") {
        setSelectedGlycanListData("");
        setSelectedGlycanListRows([]);
      } else if (type === "proteinID") {
        let proteinIDs = selectedProteinData.filter(obj => obj.uniprot_canonical_ac !== id);
        setSelectedProteinData(proteinIDs);
        let selRows = selectedProteinRows.filter(ind =>ind !== id);
        setSelectedProteinRows(selRows);
      } else if (type === "proteinList") {
        setSelectedProteinListData("");
        setSelectedProteinListRows([]);
      }

      let totalCartCount = deleteID(type, id);
      showTotalCartIdsNotification(totalCartCount);
      let now = Date.now();
      setUpdate(now);
    }

       /**
   * Function to delete cart entry.
   * @param {number} id - id number.
   **/
       function clearCart(type) {
        if (type === "glycanID") {
          setSelectedGlycanData([]);
          setSelectedGlycanRows([]);
        } else if (type === "glycanList") {
          setSelectedGlycanListData("");
          setSelectedGlycanListRows([]);
        } else if (type === "proteinID") {
          setSelectedProteinData([]);
          setSelectedProteinRows([]);
        } else if (type === "proteinList") {
          setSelectedProteinListData("");
          setSelectedProteinListRows([]);
        }

        let totalCartCount = clearCartType(type);
        showTotalCartIdsNotification(totalCartCount);
        let now = Date.now();
        setUpdate(now);
      }

      function setIDCartError(name, listErrorMsg, queryType, searchQuery, columns, applied_filters, list_id, list_cache_id, error) {
        setPageLoading(false);
        setIDCartErrorDialogInput({ show: true, name: name, message: listErrorMsg, queryType: queryType, searchQuery: searchQuery, columns: columns, applied_filters: applied_filters, list_id: list_id, list_cache_id: list_cache_id, error: error })
      }

    
    /**
       * Function to handle protein simple search.
       **/
      const getImportList = (id, type, row) => {
        if (id === undefined) {
          navigate(routeConstants.idMapping, { state:{selectedIDs: []} })  
          return;
        }
        setPageLoading(true);
        logActivity("user", id, "Performing Cart Import using list ID");
        let message = "Performing Cart Import=" + JSON.stringify({id: id, type: type});
        getCartList(id, type)
          .then(response => {
            if (response.data) {
              let selectedIDs = response.data.map(obj => obj.id);
              logActivity(
                "user",
                (id || "") + ">" + id,
                message + " Count: " + selectedIDs.length
              ).finally(() => {
                setPageLoading(false);
                navigate(routeConstants.idMapping, { state:{selectedIDs: selectedIDs} })  
              });
            } else {
              logActivity("user", "", "No results. " + message);
              setPageLoading(false);
              setAlertTextInput({
                show: true,
                id: stringConstants.errors.idCartError.id
              });
              window.scrollTo(0, 0);
            }
          })
          .catch(function(error) {
            setIDCartError(row.name, listErrorMsg, row.queryType, row.searchQuery, row.columns, row.applied_filters, row.list_id, row.list_cache_id, error.response ? error.response.data : error);
          });
      };

  function buttonGlycanDelete(cell, row, rowIndex) {
    return (
      <Button
        className='gg-btn-outline mb-1 mt-1'
        onClick={(e) => deleteIDFromStore(e, "glycanID", row.glytoucan_ac)}
      >
        <Image
          src={deleteIcon}
          alt="delete button"
        />
      </Button>
    );
  }

  function buttonGlycanListDelete(cell, row, rowIndex) {
    return (
      <Button
        className='gg-btn-outline mb-1 mt-1'
        onClick={(e) => deleteIDFromStore(e, "glycanList", row.list_cache_id)}
      >
        <Image
          src={deleteIcon}
          alt="delete button"
        />
      </Button>
    );
  }

  function buttonProteinDelete(cell, row, rowIndex) {
    return (
      <Button
        className='gg-btn-outline mb-1 mt-1'
        onClick={(e) => deleteIDFromStore(e, "proteinID", row.uniprot_canonical_ac)}
      >
        <Image
          src={deleteIcon}
          alt="delete button"
        />
      </Button>
    );
  }

  function buttonProteinListDelete(cell, row, rowIndex) {
    return (
      <Button
        className='gg-btn-outline mb-1 mt-1'
        onClick={(e) => deleteIDFromStore(e, "proteinList", row.list_cache_id)}
      >
        <Image
          src={deleteIcon}
          alt="delete button"
        />
      </Button>
    );
  }

  const executeGlycanSearch = (type, formObject) => {
    if (type === stringConstants.glycan.simple_search.query_type.name) {
      return getGlycanSimpleSearch(formObject);
    } else {
      return getGlycanSearch(formObject);
    }
  }

  /**
   * Function to handle glycan direct search.
   **/
  const glycanSearch = row => {
    let formObject = row.searchQuery;
    let type =  row.searchQuery.query_type;
    let oldListCacheId = row.list_cache_id;

    setPageLoading(true);
    logActivity("user", "", "Performing ID Cart Search");
    let message = "Direct Search query=" + JSON.stringify(formObject);
    executeGlycanSearch(type, formObject)
      .then(response => {
        if (response.data["list_id"] !== "") {
            let listId = response.data["list_id"];
            getGlycanList(
              response.data["list_id"],
              1,
              20,
              "hit_score",
              "desc",
              row.applied_filters,
              row.columns
            ).then(({ data }) => {

              let listCacheId = data.cache_info.listcache_id;

              let obj = { 
                "name" : row.name, "appliedFilters" : row.applied_filters, "listCacheId" : listCacheId,
                "listId" : listId, searchQuery: row.searchQuery, columns : row.columns, queryType : row.queryType, totalSize : data.pagination.total_length } 

              updateIDCartObject("glycanList", oldListCacheId, obj);
              let now = Date.now();
              setUpdate(now);
              setPageLoading(false);
            })
            .catch(function(error) {
              setIDCartError(row.name, searchErrorMsg, row.queryType, row.searchQuery, row.columns, row.applied_filters, row.list_id, row.list_cache_id, error.response ? error.response.data : error);
            });

        } else {
          let error = {
            response: {
              status: stringConstants.errors.defaultDialogAlert.id
            }
          };
          axiosError(
            error,
            "",
            "No results. " + message,
            setPageLoading,
            setAlertDialogInput
          );
        }
      })
      .catch(function(error) {
        setIDCartError(row.name, searchErrorMsg, row.queryType, row.searchQuery, row.columns, row.applied_filters, row.list_id, row.list_cache_id, error.response ? error.response.data : error);
      });
  };

  /**
   * Function to handle glycan global search.
   **/
  const globalSearch = (type, row, queryType) => {
    let formObject = row.searchQuery;
    let term =  row.searchQuery.term;
    let oldListCacheId = row.list_cache_id;

    setPageLoading(true);
    logActivity("user", "", "Performing ID Cart Global Search");
    let message = "Performing ID Cart Global Search=" + JSON.stringify(formObject);
    getGlobalSearch(term)
      .then(({ data }) => {
        let listId = undefined;

        if (type === "glycanList" && data.other_matches && data.other_matches.glycan.all.list_id) {
          listId = data.other_matches.glycan.all.list_id;
        } else if (type === "proteinList" && queryType === "gsgp" && data.other_matches && data.other_matches.glycoprotein.all.list_id) {
          listId = data.other_matches.glycoprotein.all.list_id;
        } else if (type === "proteinList" && data.other_matches && data.other_matches.protein.all.list_id) {
          listId = data.other_matches.protein.all.list_id;
        }

        if (listId) {
            (type === "glycanList" ? getGlycanList(
              listId,
              1,
              20,
              "hit_score",
              "desc",
              row.applied_filters,
              row.columns
            ) :
            getProteinList(
              listId,
              1,
              20,
              "hit_score",
              "desc",
              row.applied_filters,
              row.columns
            )
          ).then(({ data }) => {

              let listCacheId = data.cache_info.listcache_id;

              let obj = { 
                "name" : row.name, "appliedFilters" : row.applied_filters, "listCacheId" : listCacheId,
                "listId" : listId, searchQuery: row.searchQuery, columns : row.columns, queryType : row.queryType, totalSize : data.pagination.total_length } 

              updateIDCartObject(type, oldListCacheId, obj);
              let now = Date.now();
              setUpdate(now);
              setPageLoading(false);
            })
            .catch(function(error) {
              setIDCartError(row.name, searchErrorMsg, row.queryType, row.searchQuery, row.columns, row.applied_filters, row.list_id, row.list_cache_id, error.response ? error.response.data : error);
            });

        } else {             
          let error = {
            response: {
              status: stringConstants.errors.defaultDialogAlert.id
            }
          };
          axiosError(
            error,
            "",
            "No results. " + message,
            setPageLoading,
            setAlertDialogInput
          );
        }
       }
    )
    .catch(function(error) {
      setIDCartError(row.name, searchErrorMsg, row.queryType, row.searchQuery, row.columns, row.applied_filters, row.list_id, row.list_cache_id, error.response ? error.response.data : error);
    });
  };

  /**
      * Function to execute super search query.
    * @param {array} superSearchQuery - query object.
    **/
   function superSearch(type, row, queryType) {
    let superSearchQuery = { concept_query_list : row.searchQuery.concept_query_list ? row.searchQuery.concept_query_list : [] }
    let oldListCacheId = row.list_cache_id;
    let results = queryType.split("_");
    let type1 = ""; 
    if (results.length > 0) {
      type1 = results[1];
    } 
    let type2 = "";
    if (results.length > 1) {
      type2 = results[2];
    }

    if (type1 === "") return;
  
    if (JSON.stringify(superSearchQuery) !== JSON.stringify({})){
      setPageLoading(true);
      let message = "Super Search query=" + JSON.stringify(superSearchQuery);
      logActivity("user", "", "Performing Super Search. " + message);
      getSuperSearch(superSearchQuery).then((response) => {
        let searchData = response.data;
        setPageLoading(false);
        let resultsSummary = searchData.results_summary;
        let resultType1 = resultsSummary[type1]

        let resultType2 = undefined;
        if (type2 !== "") {
          let temp = resultType1.bylinkage;
          resultType2 = temp[type2];
        }

        let listId = undefined;

        if (type === "glycanList") {
          if (resultType2) {
            listId = resultType2.list_id;
          } else if (resultType1) {
            listId = resultType1.list_id;
          }
        } else if (type === "proteinList") {
          if (resultType2) {
            listId = resultType2.list_id;
          } else if (resultType1) {
            listId = resultType1.list_id;
          }
        }

        if (listId) {
          (type === "glycanList" ? getGlycanList(
              listId,
              1,
              20,
              "hit_score",
              "desc",
              row.applied_filters,
              row.columns
            ) :
            getProteinList(
              listId,
              1,
              20,
              "hit_score",
              "desc",
              row.applied_filters,
              row.columns
            )
          ).then(({ data }) => {

            let listCacheId = data.cache_info.listcache_id;

            let obj = { 
              "name" : row.name, "appliedFilters" : row.applied_filters, "listCacheId" : listCacheId,
              "listId" : listId, searchQuery: row.searchQuery, columns : row.columns, queryType : row.queryType, totalSize : data.pagination.total_length } 

            updateIDCartObject(type, oldListCacheId, obj);
            let now = Date.now();
            setUpdate(now);
            setPageLoading(false);
          })
          .catch(function(error) {
            setIDCartError(row.name, searchErrorMsg, row.queryType, row.searchQuery, row.columns, row.applied_filters, row.list_id, row.list_cache_id, error.response ? error.response.data : error);
          });

        } else {
          let error = {
            response: {
              status: stringConstants.errors.defaultDialogAlert.id
            }
          };
          axiosError(
            error,
            "",
            "No results. " + message,
            setPageLoading,
            setAlertDialogInput
          );
        }

      })
      .catch(function (error) {
        setIDCartError(row.name, searchErrorMsg, row.queryType, row.searchQuery, row.columns, row.applied_filters, row.list_id, row.list_cache_id, error.response ? error.response.data : error);
      });
    }
  }

  const executeProteinSearch = (type, formObject) => {
    if (type === stringConstants.protein.simple_search.query_type.name) {
      return getProteinSimpleSearch(formObject);
    } else {
      return getProteinSearch(formObject);
    }
  }

    /**
     * Function to handle glycan direct search.
     **/
    const proteinSearch = row => {
      let formObject = row.searchQuery;
      let type =  row.searchQuery.query_type;
      let oldListCacheId = row.list_cache_id;

      setPageLoading(true);
      logActivity("user", "", "Performing ID Cart Search");
      let message = "ID Cart Search query=" + JSON.stringify(formObject);
      executeProteinSearch(type, formObject)
        .then(response => {
          if (response.data["list_id"] !== "") {
              let listId = response.data["list_id"];
              getProteinList(
                listId,
                1,
                20,
                "hit_score",
                "desc",
                row.applied_filters,
                row.columns
              ).then(({ data }) => {

                let listCacheId = data.cache_info.listcache_id;

                let obj = { 
                  "name" : row.name, "appliedFilters" : row.applied_filters, "listCacheId" : listCacheId,
                  "listId" : listId, searchQuery: row.searchQuery, columns : row.columns, queryType : row.queryType, totalSize : data.pagination.total_length } 

                updateIDCartObject("proteinList", oldListCacheId, obj);
                let now = Date.now();
                setUpdate(now);
                setPageLoading(false);
              })
              .catch(function(error) {
                setIDCartError(row.name, searchErrorMsg, row.queryType, row.searchQuery, row.columns, row.applied_filters, row.list_id, row.list_cache_id, error.response ? error.response.data : error);
              });

          } else {
            let error = {
              response: {
                status: stringConstants.errors.defaultDialogAlert.id
              }
            };
            axiosError(
              error,
              "",
              "No results. " + message,
              setPageLoading,
              setAlertDialogInput
            );
          }
        })
        .catch(function(error) {
          setIDCartError(row.name, searchErrorMsg, row.queryType, row.searchQuery, row.columns, row.applied_filters, row.list_id, row.list_cache_id, error.response ? error.response.data : error);
        });
    };

  function buttonRestartGlycanSearch(cell, row, rowIndex) {
    return (
      <Button
        className='gg-btn-outline mb-1 mt-1'
        onClick={() => {
          if (row.queryType === "gs") {
            globalSearch("glycanList", row, row.queryType)
          } else if (row.queryType && row.queryType.includes("sups")) {
            superSearch("glycanList", row, row.queryType)
          } else {
            glycanSearch(row)
          }
        }}
      >
        <RestartAltOutlinedIcon sx={{ color: 'text.primary' }}/>
      </Button>
    );
  }

  function buttonRestartProteinSearch(cell, row, rowIndex) {
    return (
      <Button
        className='gg-btn-outline mb-1 mt-1'
        onClick={() => {
          if (row.queryType === "gs" || row.queryType === "gsgp") {
            globalSearch("proteinList", row, row.queryType)
          } else if (row.queryType && row.queryType.includes("sups")) {
            superSearch("proteinList", row, row.queryType)
          } else {
            proteinSearch(row)
          }
        }}
      >
        <RestartAltOutlinedIcon sx={{ color: 'text.primary' }}/>
      </Button>
    );
  }

  const selectGlycanRow = {
    mode: 'checkbox',
    clickToSelect: true,
    hideSelectAll: false,
    selected: selectedGlycanRows,
    onSelect: (row, isSelect, rowIndex, e) => {
     if (e.defaultPrevented)
       return;
      let glycanIDs = [];
      if (isSelect) {
         selectedGlycanData.push(row.glytoucan_ac);
         setSelectedGlycanData(selectedGlycanData);
         setSelectedGlycanRows(selectedGlycanData);
      } else {
        glycanIDs = selectedGlycanData.filter(id => id !== row.glytoucan_ac);
        setSelectedGlycanData(glycanIDs);
        setSelectedGlycanRows(glycanIDs);
      }
    },
    onSelectAll: (isSelect, rows, e) => {
      let glycanIDs = rows.map(obj => obj.glytoucan_ac);
      if (isSelect) {
         selectedGlycanData.push(...glycanIDs);
         setSelectedGlycanData(selectedGlycanData);
         setSelectedGlycanRows(selectedGlycanData);
      } else {
        let glyIDs = selectedGlycanData.filter(id => !glycanIDs.includes(id));
        setSelectedGlycanData(glyIDs);
        setSelectedGlycanRows(glyIDs);
      }
    }
  };

  const GLYCAN_COLUMNS = [
    {
      dataField: glycanStrings.glycan_id.id,
      text: glycanStrings.glycan_id.shortName,
      sort: true,
      smallScreen: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "40% !important"
        };
      },
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Button className={"lnk-btn"} variant="link" onClick={() => {
            props.handleClose();
            navigate(routeConstants.glycanDetail + row.glytoucan_ac)
          }}>
            {row.glytoucan_ac}
          </Button>
        </LineTooltip>
      )
    },
    {
      text: glycanStrings.glycan_image.name,
      dataField: glycanStrings.glycan_id.id,
      sort: false,
      formatter: (value, row) => (
        <div className="img-wrapper">
          <img
            className="img-cartoon"
            src={getGlycanImageUrl(row.glytoucan_ac)}
            alt="Glycan img"
          />
        </div>
      ),
      headerStyle: (colum, colIndex) => {
        return {
          width: "40%",
          textAlign: "left",
          backgroundColor: "#4B85B6",
          color: "white",
          whiteSpace: "nowrap"
        };
      }
    },
    {
      text: '',
      smallScreen: true,
      formatter: buttonGlycanDelete,
      editable: false
    }
  ];

  const selectGlycanListRow = {
    mode: 'radio',
    clickToSelect: true,
    hideSelectAll: true,
    selected: selectedGlycanListRows,
    onSelect: (row, isSelect, rowIndex, e) => {
      if (e.defaultPrevented)
        return;
      let glycanIDs = [];
      if (isSelect) {
        setSelectedGlycanListData({"applied_filters" : row.applied_filters, "list_cache_id" : row.list_cache_id,
          "list_id" : row.list_id, "name": row.name, "queryType": row.queryType, "searchQuery": row.searchQuery, "columns": row.columns });
        setSelectedGlycanListRows([row.list_cache_id]);
      } else {
        setSelectedGlycanListData("");
        setSelectedGlycanListRows([]);
      }
    }
  };

  const PROTEIN_COLUMNS = [
    {
      dataField: proteinStrings.uniprot_canonical_ac.id,
      text: proteinStrings.uniprot_accession.name,
      sort: true,
      selected: true,
      smallScreen: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "15% !important"
        };
      },
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Button className={"lnk-btn"} variant="link" onClick={() => {
            props.handleClose();
            navigate(routeConstants.proteinDetail + row.uniprot_canonical_ac)
          }}>
            {row.uniprot_canonical_ac}
          </Button>
        </LineTooltip>
      )
    },
    {
      dataField: "protein_name",
      text: proteinStrings.protein_names.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "15% !important"
        };
      },    
    },
    {
      dataField: proteinStrings.organism.shortName,
      text: proteinStrings.organism.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "15% !important"
        };
      },
    },
    {
      text: '',
      smallScreen: true,
      formatter: buttonProteinDelete,
      editable: false
    }
  ];

  const selectProteinRow = {
    mode: 'checkbox',
    clickToSelect: true,
    hideSelectAll: false,
    selected: selectedProteinRows,
    onSelect: (row, isSelect, rowIndex, e) => {
      if (e.defaultPrevented)
        return;
      let proteinIDs = [];
      if (isSelect) {
         selectedProteinData.push({ uniprot_canonical_ac:row.uniprot_canonical_ac, organism:row.organism, protein_name:row.protein_name } );
         setSelectedProteinData(selectedProteinData);
         selectedProteinRows.push(row.uniprot_canonical_ac);
         setSelectedProteinRows(selectedProteinRows);
      } else {
        proteinIDs = selectedProteinData.filter(obj => obj.uniprot_canonical_ac !== row.uniprot_canonical_ac);
        setSelectedProteinData(proteinIDs);
        let selRows = selectedProteinRows.filter(ind =>ind !== row.uniprot_canonical_ac);
        setSelectedProteinRows(selRows);
      }
    },
    onSelectAll: (isSelect, rows, e) => {
      if (isSelect) {
        let proteinIDs = rows.map(obj => {return { ...obj }});
         selectedProteinData.push(...proteinIDs);
         let selRows = selectedProteinData.map(obj =>  obj.uniprot_canonical_ac);
         setSelectedProteinData(selectedProteinData);
         setSelectedProteinRows(selRows);
      } else {
        let proteinIDs = rows.map(obj =>  obj.uniprot_canonical_ac);
        let proIDs = selectedProteinData.filter(obj => !proteinIDs.includes(obj.uniprot_canonical_ac));
        setSelectedProteinData(proIDs);
        let selRows = proIDs.map(obj =>  obj.uniprot_canonical_ac);
        setSelectedProteinRows(selRows);
      }
    }
  };

  const GLYCAN_LIST_COLUMNS = [
    {
      dataField: "name",
      text: "Name",
      sort: true,
      selected: true,
      smallScreen: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "40% !important"
        };
      }
    },
    {
      dataField: "list_id",
      text: "List ID",
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return {
          width: "40%",
          textAlign: "left",
          backgroundColor: "#4B85B6",
          color: "white",
          whiteSpace: "nowrap"
        };
      },
      formatter: (value, row) => (
        <LineTooltip text="View glycan list page">
          <Button className={"lnk-btn"} variant="link" onClick={() => {
            props.handleClose();
            navigate(routeConstants.glycanList + value + "/" + row.queryType, { state:{appliedFilters: row.applied_filters} })
          }}>
            {value}
          </Button>
        </LineTooltip>
      )
    },
    {
      dataField: "totalSize",
      text: "No of Glycans",
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "15% !important"
        };
      }
    },
    {
      text: '',
      smallScreen: true,
      formatter: (cell, row, rowIndex) => {
        return (<>
              {buttonRestartGlycanSearch(cell, row, rowIndex)}
              {<span style={{marginRight:"10px"}}/>}
              {buttonGlycanListDelete(cell, row, rowIndex)}
          </>
        );
      },
      editable: false
    }
  ];

  const PROTEIN_LIST_COLUMNS = [
    {
      dataField: "name",
      text: "Name",
      sort: true,
      selected: true,
      smallScreen: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "15% !important"
        };
      }
    },
    {
      dataField: "list_id",
      text: "List ID",
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return {
          width: "30%",
          textAlign: "left",
          backgroundColor: "#4B85B6",
          color: "white",
          whiteSpace: "nowrap"
        };
      },
      formatter: (value, row) => (
        <LineTooltip text="View protein list page">
          <Button className={"lnk-btn"} variant="link" onClick={() => {
            props.handleClose();
            navigate(routeConstants.proteinList + value + "/" + row.queryType, { state:{appliedFilters: row.applied_filters} })
          }}>
            {value}
          </Button>
        </LineTooltip>
      )
    },
    {
      dataField: "totalSize",
      text: "No of Proteins",
      sort: true,
      selected: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "15% !important"
        };
      }
    },
    {
      text: '',
      smallScreen: true,
      formatter: (cell, row, rowIndex) => {
        return (<>
            {buttonRestartProteinSearch(cell, row, rowIndex)}
            {<span style={{marginRight:"10px"}}/>}
            {buttonProteinListDelete(cell, row, rowIndex)}
          </>
        );
      },
      editable: false
    }
  ];

  const selectProteinListRow = {
    mode: 'radio',
    clickToSelect: true,
    hideSelectAll: true,
    selected: selectedProteinListRows,
    onSelect: (row, isSelect, rowIndex, e) => {
      if (e.defaultPrevented)
        return;
      let proteinIDs = [];
      if (isSelect) {
        setSelectedProteinListData({"applied_filters" : row.applied_filters, "list_cache_id" : row.list_cache_id,
          "list_id" : row.list_id, "name": row.name, "queryType": row.queryType, "searchQuery": row.searchQuery, "columns": row.columns });

        setSelectedProteinListRows([row.list_cache_id]);
      } else {
        setSelectedProteinListData("");
        setSelectedProteinListRows([]);
      }
    }
  };

  function rowStyleFormat(row, rowIdx) {
    return { backgroundColor: rowIdx % 2 === 0 ? "red" : "blue" };
  }

  function getCSVFileDataGlycan(type) {
    let glycanDataTemp = []
    if (type === "selected") {
      glycanDataTemp = selectedGlycanData;
    } else if (type === "all") {
      glycanDataTemp = glycanData.map(obj => obj.glytoucan_ac);
    }

    if (glycanDataTemp.length === 0)
      return glycanDataTemp;

    let header = "Glycan ID" + "\n";
    for (let i = 0; i < glycanDataTemp.length; i++) {
      header += glycanDataTemp[i] + "\n";
    }
    return header;
  }

  function getCSVFileDataProtein(type) {
    let proteinDataTemp = []
    if (type === "selected") {
      proteinDataTemp = selectedProteinData;
    } else if (type === "all") {
      proteinDataTemp = proteinData;
    }

    if (proteinDataTemp.length === 0)
      return proteinDataTemp;

    let header = "UniProtKB Accession, UniProtKB Name, Organism " + "\n";
    for (let i = 0; i < proteinDataTemp.length; i++) {
      header += proteinDataTemp[i].uniprot_canonical_ac + "," + proteinDataTemp[i].protein_name + "," + proteinDataTemp[i].organism + "\n";
    }
    return header;
  }

  /**
   * useEffect for retriving data from api and showing page loading effects.
   */
  useEffect(() => {
    setPageLoading(true);

    let idCart = getIDsFromStore();
    let glyDt = [];
    if (idCart.glycanID) {
      glyDt = idCart.glycanID.map(id =>  { return { "glytoucan_ac" : id } });
    }
    setGlycanData(glyDt);

    glyDt.sort(createSorter(currentGlycanSort, currentGlycanSortOrder));
    let start = (pageGlycan - 1) * sizePerPageGlycan;
    let end = pageGlycan * sizePerPageGlycan;
    let pageData = glyDt.slice(start, end);
    setPageDataGlycan(pageData);

    if (glyDt.length > 0) {
      setTotalGlycanSize(glyDt.length);
    } else {
      setPageGlycan(1);
      setTotalGlycanSize(0);
    }

    let glyListDt = [];
    if (idCart.glycanList) {
      glyListDt = idCart.glycanList.map(obj =>  { return { 
        "name" : obj.name, "applied_filters" : obj.appliedFilters, "list_cache_id" : obj.listCacheId,
        "list_id" : obj.listId, searchQuery: obj.searchQuery, columns:obj.columns, queryType:obj.queryType, totalSize:obj.totalSize } });
    }
    setGlycanListData(glyListDt);

    glyListDt.sort(createSorter(currentGlycanListSort, currentGlycanListSortOrder));
    start = (pageGlycanList - 1) * sizePerPageGlycanList;
    end = pageGlycanList * sizePerPageGlycanList;
    pageData = glyListDt.slice(start, end);
    setPageDataGlycanList(pageData);

    if (glyListDt.length > 0) {
      setTotalGlycanListSize(glyListDt.length);
    } else {
      setPageGlycanList(1);
      setTotalGlycanListSize(0);
    }

    let proDt = [];
    if (idCart.proteinID) {
      proDt = idCart.proteinID.map(obj =>  { return { ...obj } });
    }
    setProteinData(proDt);

    proDt.sort(createSorter(currentProteinSort, currentProteinSortOrder));
    start = (pageProtein - 1) * sizePerPageProtein;
    end = pageProtein * sizePerPageProtein;
    pageData = proDt.slice(start, end);
    setPageDataProtein(pageData);

    if (proDt.length > 0) {
      setTotalProteinSize(proDt.length);
    } else {
      setPageProtein(1);
      setTotalProteinSize(0);
    }

    let proListDt = [];
    if (idCart.proteinList) {
      proListDt = idCart.proteinList.map(obj =>  { return { 
        "name" : obj.name, "applied_filters" : obj.appliedFilters, "list_cache_id" : obj.listCacheId,
        "list_id" : obj.listId, searchQuery: obj.searchQuery, columns:obj.columns, queryType:obj.queryType, totalSize:obj.totalSize } });
    }
    setProteinListData(proListDt);

    proListDt.sort(createSorter(currentProteinListSort, currentProteinListSortOrder));
    start = (pageProteinList - 1) * sizePerPageProteinList;
    end = pageProteinList * sizePerPageProteinList;
    pageData = proListDt.slice(start, end);
    setPageDataProteinList(pageData);

    if (proListDt.length > 0) {
      setTotalProteinListSize(proListDt.length);
    } else {
      setPageProteinList(1);
      setTotalProteinListSize(0);
    }

    setPageLoading(false);

  }, [update]);

  const handleTableChangeGlycan = (
      type,
      { page, sizePerPage, sortField, sortOrder }
    ) => {
      if (pageLoading) {
        return;
      }
      setPageLoading(true);
      glycanData.sort(createSorter(sortField, sortOrder));

      const start = (page - 1) * sizePerPage;
      const end = page * sizePerPage;
      const pageData = glycanData.slice(start, end);
      setCurrentGlycanSort(sortField);
      setCurrentGlycanSortOrder(sortOrder);
  
      setPageDataGlycan(pageData);
      setPageGlycan(page);
      setSizePerPageGlycan(sizePerPage);
      setPageLoading(false);
    };

    const handleTableChangeProtein = (
      type,
      { page, sizePerPage, sortField, sortOrder }
    ) => {
      if (pageLoading) {
        return;
      }
      setPageLoading(true);
      proteinData.sort(createSorter(sortField, sortOrder));

      const start = (page - 1) * sizePerPage;
      const end = page * sizePerPage;
      const pageData = proteinData.slice(start, end);
      setCurrentProteinSort(sortField);
      setCurrentProteinSortOrder(sortOrder);
  
      setPageDataProtein(pageData);
      setPageProtein(page);
      setSizePerPageProtein(sizePerPage);
      setPageLoading(false);
    };

    const handleTableChangeGlycanList = (
      type,
      { page, sizePerPage, sortField, sortOrder }
    ) => {
      if (pageLoading) {
        return;
      }
      setPageLoading(true);
      glycanListData.sort(createSorter(sortField, sortOrder));

      const start = (page - 1) * sizePerPage;
      const end = page * sizePerPage;
      const pageData = glycanListData.slice(start, end);
      setCurrentGlycanListSort(sortField);
      setCurrentGlycanListSortOrder(sortOrder);
  
      setPageDataGlycanList(pageData);
      setPageGlycanList(page);
      setSizePerPageGlycanList(sizePerPage);
      setPageLoading(false);
    };

    const handleTableChangeProteinList = (
      type,
      { page, sizePerPage, sortField, sortOrder }
    ) => {
      if (pageLoading) {
        return;
      }
      setPageLoading(true);

      proteinListData.sort(createSorter(sortField, sortOrder));

      const start = (page - 1) * sizePerPage;
      const end = page * sizePerPage;
      const pageData = proteinListData.slice(start, end);
      setCurrentProteinListSort(sortField);
      setCurrentProteinListSortOrder(sortOrder);

      setPageDataProteinList(pageData);
      setPageProteinList(page);
      setSizePerPageProteinList(sizePerPage);
      setPageLoading(false);
    };

  /**
   * useEffect for retriving data from api and showing page loading effects.
   */
  useEffect(() => {
    setPageLoading(true);
    logActivity();

    document.addEventListener('click', () => {
			setAlertTextInput({"show": false, "id": "", message: "", custom: ""});
		});

    let idCartMap = idCartJson.idCartMap;
    let validMap = new Map();
    let glycanDropdown = [];
    let glycanListDropdown = []; 
    let proteinDropdown = [];
    let proteinListDropdown = []; 

    for (let i = 0; i < idCartMap.length; i++) {
      let cartOptionSupport = idCartMap[i].cartOptionSupport;

      validMap.set(idCartMap[i].toolType, idCartMap[i].validations);

      for (let j = 0; j < cartOptionSupport.length; j++) {
        if (cartOptionSupport[j] ===  "glycan") {
          glycanDropdown.push({"id": idCartMap[i].toolType, "name": idCartMap[i].toolName});
        } else if (cartOptionSupport[j] ===  "glycanList") {
          glycanListDropdown.push({"id": idCartMap[i].toolType, "name": idCartMap[i].toolName});
        }  else if (cartOptionSupport[j] ===  "protein") {
          proteinDropdown.push({"id": idCartMap[i].toolType, "name": idCartMap[i].toolName});
        }  else if (cartOptionSupport[j] ===  "proteinList") {
          proteinListDropdown.push({"id": idCartMap[i].toolType, "name": idCartMap[i].toolName});
        }
      }
    }

    validMap.set("", []);
    setValidationMap(validMap);

    setGlycanMenu(glycanDropdown);
    setGlycanListMenu(glycanListDropdown);
    setProteinMenu(proteinDropdown);
    setProteinListMenu(proteinListDropdown);
    setPageLoading(false);
  }, []);

    /**
   * Function to handle import glycan IDs.
   **/
    const importGlycanIDs = (toolType) => {
      if (toolType === "mapper") {
        navigate(routeConstants.idMapping, { state:{selectedIDs: selectedGlycanData} })  
      }
    };

  /**
   * Function to handle import glycan list ID.
   **/
  const importGlycanListID = () => {
    getImportList(selectedGlycanListData.list_cache_id, "glycan", selectedGlycanListData);
  }

  const validateTool = (toolType, data) => {
    let validations = validationMap.get(toolType);
    
    for (let i = 0; i < validations.length; i++) {
      if (validations[i] === "idCartSingleIDError" && data.length > 1) {
        setAlertDialogInput({show: true, id: validations[i]});
        return false;
      }
    }

    return true;
  }
    /**
   * Function to handle import protein IDs.
   **/
      const importProteinIDs = (toolType) => {
      if (toolType === "mapper") {
        let proteinIDs = selectedProteinData.map(obj => obj.uniprot_canonical_ac);
        navigate(routeConstants.idMapping, { state:{selectedIDs: proteinIDs} })  
      }
      if (toolType === "blast") {
        let proteinIDs = selectedProteinData.map(obj => obj.uniprot_canonical_ac);
        if (validateTool("blast", proteinIDs)) {
          navigate(routeConstants.blastSearch, { state:{selectedID: proteinIDs[0]} });
        }
      }
    };

    /**
   * Function to handle import protein list ID.
   **/
    const importProteinListID = () => {
      getImportList(selectedProteinListData.list_cache_id, "protein", selectedProteinListData);
    }

  return (
    <>
      <Helmet>
        {getTitle("idCart")}
        {getMeta("idCart")}
      </Helmet>
      <FeedbackWidget />
      <div className="lander">
        <Container className="tab-bigscreen">
          <PageLoader pageLoading={pageLoading} />
          <DialogAlert
            alertInput={alertDialogInput}
            setOpen={input => {
              setAlertDialogInput({ show: input });
            }}
          />
          <DialogAlert
            alertInput={clearDialogInput}
            setOpen={input => {
              setClearDialogInput({ show: input });
            }}
            callBack={clearCart}
          />
          <IDCartAlert
            idCartErrorDialogInput={idCartErrorDialogInput}
            setPageLoading={setPageLoading}
            setOpen={(input) => {
              setIDCartErrorDialogInput({ show: input });
            }}
          />
          <section>
            <Tabs
              defaultActiveKey="Glycan"
              transition={false}
              activeKey={proActTabKey}
              mountOnEnter={true}
              unmountOnExit={true}
              className="dialog-content-navbar-nav"
              onSelect={key => {
                setProActTabKey(key)}}
            >
              <Tab
                eventKey="Glycan"
                className="tab-content-padding"
                title={
                 <div>
                  <Badge sx={{marginTop: "-10px", marginLeft: "45px"}} anchorOrigin={{vertical: 'top', horizontal: 'left'}} color={"primary"} badgeContent={glycanData.length } max={99}>                                  
                    <span style={{paddingTop: "7px", marginLeft: "-45px"}}>{idCartJson.glycan.tabTitle}</span>
                  </Badge>
                </div> 
              }
              >
                <TextAlert alertInput={alertTextInput} />
                <div style={{ paddingBottom: "20px" }}></div>
                <Container className="tab-bigscreen">
                  <div className="text-end pb-3" >
                    <span className="pe-3" >
                      <SelectControl
                        inputValue={glycanValue}
                        menu={glycanMenu}
                        placeholder={idCartJson.placeholder}
                        placeholderId={idCartJson.placeholderId}
                        placeholderName={idCartJson.placeholderName}
                        setInputValue={(value) => {
                          setGlycanValue(value);
                        }}
                      />
                    </span>
                    <span className="text-end pe-3">
                      <Button disabled={glycanValue === ""} onClick={() => importGlycanIDs(glycanValue)} type="button" className="gg-btn-blue">Import</Button>
                    </span>
                    <span className="text-end">
                      <Button onClick={() => { 
                          setClearDialogInput({show: true, id: stringConstants.errors.idCartClear.id, cartType: "glycanID"})
                        }} 
                        type="button" className="gg-btn-blue">Clear</Button>
                    </span>
                    <DownloadFileMenu
                        types={[
                          {
                            display: "Selected Data",
                            type: "selected",
                          },
                          {
                            display: "All Data",
                            type: "all",
                          }
                        ]}
                        dataId={selectedGlycanListData.list_cache_id}
                        fileName="glycan_cart"
                        mimeType="csv"
                        enable={true}
                        getData={getCSVFileDataGlycan}
                        filters={selectedGlycanListData.applied_filters}
                      />
                  </div> 
                  <PaginatedTable
                      trStyle={rowStyleFormat}
                      data={pageDataGlycan}
                      columns={props.size === "50%" ? GLYCAN_COLUMNS.filter(obj => obj.smallScreen === true) : GLYCAN_COLUMNS}
                      page={pageGlycan}
                      sizePerPage={sizePerPageGlycan}
                      totalSize={totalGlycanSize}
                      onTableChange={handleTableChangeGlycan}
                      defaultSortField={currentGlycanSort}
                      defaultSortOrder={currentGlycanSortOrder}
                      idField="glytoucan_ac"
                      selectRow={selectGlycanRow}
                      noDataIndication={pageLoading ? "Fetching Data." : "No data available."}
                    />
                </Container>
              </Tab>
              <Tab
                eventKey="Glycan-List"
                className="tab-content-padding"
                title={
                  <div>
                   <Badge sx={{marginTop: "-10px", marginLeft: "80px"}} anchorOrigin={{vertical: 'top', horizontal: 'left'}} color={"primary"} badgeContent={glycanListData.length } max={99}>                                  
                    <span style={{paddingTop: "7px", marginLeft: "-80px"}}>{idCartJson.glycan_list.tabTitle}</span>
                  </Badge>
                 </div> 
               }
              >
                <TextAlert alertInput={alertTextInput} />
                <div style={{ paddingBottom: "20px" }}></div>
                <Container className="tab-bigscreen">
                  <div className="text-end pb-3" >
                        <span className="pe-3" >
                          <SelectControl
                            inputValue={glycanListValue}
                            menu={glycanListMenu}
                            placeholder={idCartJson.placeholder}
                            placeholderId={idCartJson.placeholderId}
                            placeholderName={idCartJson.placeholderName}
                            setInputValue={(value) => {
                              setGlycanListValue(value);
                            }}
                          />
                      </span>
                      <span className="text-end pe-3">
                        <Button disabled={glycanListValue === ""} onClick={() => importGlycanListID(glycanListValue)} type="button" className="gg-btn-blue">Import</Button>
                      </span>
                      <span className="text-end">
                        <Button onClick={() => { 
                            setClearDialogInput({show: true, id: stringConstants.errors.idCartClear.id, cartType: "glycanList"})
                          }} 
                        type="button" className="gg-btn-blue">Clear</Button>
                      </span>
                      <DownloadButton
                        types={[
                          {
                            display:
                              stringConstants.download.glycan_csvdata.displayname,
                            type: "csv",
                            data: "glycan_list"
                          },
                          {
                            display:
                              stringConstants.download.glycan_jsondata.displayname,
                            type: "json",
                            data: "glycan_list"
                          },
                          {
                            display:
                              stringConstants.download.glycan_byonicdata.displayname,
                            type: "byonic",
                            data: "glycan_list"
                          }
                        ]}
                        dataId={selectedGlycanListData.list_cache_id}
                        dataType="glycan_list"
                        validations={true}
                        filters={selectedGlycanListData.applied_filters}
                      />
                    </div> 
                    <PaginatedTable
                      trStyle={rowStyleFormat}
                      data={pageDataGlycanList}
                      columns={props.size === "50%" ? GLYCAN_LIST_COLUMNS.filter(obj => obj.smallScreen === true) : GLYCAN_LIST_COLUMNS}
                      page={pageGlycanList}
                      sizePerPage={sizePerPageGlycanList}
                      totalSize={totalGlycanListSize}
                      onTableChange={handleTableChangeGlycanList}
                      defaultSortField={currentGlycanListSort}
                      defaultSortOrder={currentGlycanListSortOrder}
                      idField="list_cache_id"
                      selectRow={selectGlycanListRow}
                      noDataIndication={pageLoading ? "Fetching Data." : "No data available."}
                    />
                </Container>
              </Tab>
              <Tab
                eventKey="Protein"
                className="tab-content-padding"
                title={
                  <div>
                   <Badge sx={{marginTop: "-10px", marginLeft: "47px"}} anchorOrigin={{vertical: 'top', horizontal: 'left'}} color={"primary"} badgeContent={proteinData.length } max={99}>                                  
                    <span style={{paddingTop: "7px", marginLeft: "-47px"}}>{idCartJson.protein.tabTitle}</span>
                  </Badge>
                 </div> 
               }
              >
                <TextAlert alertInput={alertTextInput} />
                <div style={{ paddingBottom: "20px" }}></div>
                <Container className="tab-bigscreen">

                <div className="text-end pb-3" >
                    <span className="pe-3" >
                      <SelectControl
                        inputValue={proteinValue}
                        menu={proteinMenu}
                        placeholder={idCartJson.placeholder}
                        placeholderId={idCartJson.placeholderId}
                        placeholderName={idCartJson.placeholderName}
                        setInputValue={(value) => {
                          setProteinValue(value);
                        }}
                      />
                    </span>
                    <span className="text-end pe-3">
                      <Button disabled={proteinValue === ""} onClick={() => importProteinIDs(proteinValue)} type="button" className="gg-btn-blue">Import</Button>
                    </span>
                    <span className="text-end">
                        <Button onClick={() => { 
                            setClearDialogInput({show: true, id: stringConstants.errors.idCartClear.id, cartType: "proteinID"})
                          }} 
                        type="button" className="gg-btn-blue">Clear</Button>
                    </span>
                    <DownloadFileMenu
                        types={[
                          {
                            display: "Selected Data",
                            type: "selected",
                          },
                          {
                            display: "All Data",
                            type: "all",
                          }
                        ]}
                        dataId={selectedProteinListData.list_cache_id}
                        fileName="protein_cart"
                        mimeType="csv"
                        enable={true}
                        getData={getCSVFileDataProtein}
                        filters={selectedProteinListData.applied_filters}
                      />
                  </div> 

                  <PaginatedTable
                    trStyle={rowStyleFormat}
                    data={pageDataProtein}
                    columns={props.size === "50%" ? PROTEIN_COLUMNS.filter(obj => obj.smallScreen === true) : PROTEIN_COLUMNS}
                    page={pageProtein}
                    sizePerPage={sizePerPageProtein}
                    totalSize={totalProteinSize}
                    onTableChange={handleTableChangeProtein}
                    defaultSortField={currentProteinSort}
                    defaultSortOrder={currentProteinSortOrder}
                    idField="uniprot_canonical_ac"
                    selectRow={selectProteinRow}
                    noDataIndication={pageLoading ? "Fetching Data." : "No data available."}
                  />
                </Container>
              </Tab>
              <Tab
                eventKey="Protein-List"
                className="tab-content-padding"
                title={
                  <div>
                   <Badge sx={{marginTop: "-10px", marginLeft: "82px"}} anchorOrigin={{vertical: 'top', horizontal: 'left'}} color={"primary"} badgeContent={proteinListData.length } max={99}>                                  
                    <span style={{paddingTop: "7px", marginLeft: "-82px"}}>{idCartJson.protein_list.tabTitle}</span>
                  </Badge>
                 </div> 
               }
              >
                <TextAlert alertInput={alertTextInput} />
                <div style={{ paddingBottom: "20px" }}></div>
                <Container className="tab-bigscreen">
                  <div className="text-end pb-3" >
                    <span className="pe-3" >
                      <SelectControl
                        inputValue={proteinListValue}
                        menu={proteinListMenu}
                        placeholder={idCartJson.placeholder}
                        placeholderId={idCartJson.placeholderId}
                        placeholderName={idCartJson.placeholderName}
                        setInputValue={(value) => {
                          setProteinListValue(value);
                        }}
                      />
                    </span>
                  <span className="text-end pe-3">
                    <Button disabled={proteinListValue === ""} onClick={() => importProteinListID(proteinListValue)} type="button" className="gg-btn-blue">Import</Button>
                  </span>
                  <span className="text-end">
                    <Button onClick={() => { 
                        setClearDialogInput({show: true, id: stringConstants.errors.idCartClear.id, cartType: "proteinList"})
                      }}
                      type="button" className="gg-btn-blue">Clear
                    </Button>
                    </span>
                    <DownloadButton
                      types={[
                        {
                          display:
                            stringConstants.download.protein_csvdata.displayname,
                          type: "csv",
                          data: "protein_list"
                        },
                        {
                          display:
                            stringConstants.download.protein_jsondata.displayname,
                          type: "json",
                          data: "protein_list"
                        },
                        {
                          display:
                            stringConstants.download.protein_fastadata.displayname,
                          type: "fasta",
                          data: "protein_list"
                        }
                      ]}
                      dataId={selectedProteinListData.list_cache_id}
                      dataType="protein_list"
                      validations={true}
                      filters={selectedProteinListData.applied_filters}
                    />
                  </div>
                  <PaginatedTable
                    trStyle={rowStyleFormat}
                    data={pageDataProteinList}
                    columns={props.size === "50%" ? PROTEIN_LIST_COLUMNS.filter(obj => obj.smallScreen === true) : PROTEIN_LIST_COLUMNS}
                    page={pageProteinList}
                    sizePerPage={sizePerPageProteinList}
                    totalSize={totalProteinListSize}
                    onTableChange={handleTableChangeProteinList}
                    defaultSortField={currentProteinListSort}
                    defaultSortOrder={currentProteinListSortOrder}
                    idField="list_cache_id"
                    selectRow={selectProteinListRow}
                    noDataIndication={pageLoading ? "Fetching Data." : "No data available."}
                  />
                </Container>
              </Tab>
            </Tabs>
          </section>
        </Container>
      </div>
    </>
  );
};

export default IDCart;
