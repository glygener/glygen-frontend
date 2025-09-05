import React, { useState, useEffect, useReducer } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../../utils/head";
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import HorizontalDragDropColumns from "./HorizontalDragDropColumns";
import { getColumnList, setUserStoredColumns, getUserStoredColumns } from "../../data/customcolumn";
import ColumnSelector from "./ColumnSelector"
import Grid from '@mui/material/Grid';
import Button from 'react-bootstrap/Button';
import { logActivity } from "../../data/logging";
import PageLoader from "../load/PageLoader";
import DialogAlert from "../alert/DialogAlert";
import { axiosError } from "../../data/axiosError";
import FeedbackWidget from "../FeedbackWidget";

const Transition = React.forwardRef(function Transition(
  props,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CustomColumnsData = props => {
  const {
    open,
    setOpen,
    title,
    tableId,
    setUserSelectedColumns,
    userSelectedColumns
  } = props;

  const [categories, setCategories] = useState();
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [items, setItems] = useState([]);
  const [defaultColumns, setDefaultColumns] = useState([]);
  const [defaultItems, setDefaultItems] = useState([]);
  const [columns, setColumns] = useState([]);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  const handleClose = () => {
    setOpen(false);
  };

  function deleteItem(id) {
    let newItems = [...items];
    newItems = newItems.filter(itm => itm.id !== id);
    newItems = newItems.map((obj, index) => { obj.order = index + 1; return obj; })

    setItems(newItems);
    setSelectedColumns({
      ...selectedColumns,
      [id]: !selectedColumns[id]
    });
  }

  function addItem(id) {
    let newItems = [...items];

    let col = columns.filter((col => col.id === id))[0];
    let sortedItems = newItems.sort((obj1, obj2) => obj1.order - obj2.order);
    let order = newItems.length > 0 ? sortedItems[newItems.length - 1]?.order + 1 : 1;
    sortedItems.push({
      "id": col.id,
      "label": col.label,
      "immutable": col.immutable,
      "property_name": col.property_name,
      "tooltip": col.tooltip,
      "order": order,
      "oplist": col.oplist,
      "categories": col.categories,
      "typeaheadID": col.typeaheadID,
      "outputType": col.outputType
    });

    setItems(sortedItems);

    setTimeout(() => {
      let element = document.getElementById("drag-drop-list");
      element.scrollLeft = element.scrollWidth - element.clientWidth;
    }, 500);
  }

  const handleSelectHighlight = (type) => {
    if (selectedColumns[type]) {
      deleteItem(type);
    } else {
      addItem(type)
    }

    setSelectedColumns({
      ...selectedColumns,
      [type]: !selectedColumns[type]
    });
  }

  const saveColumns = (itemsParam, close = true) => {
    let itemLen = itemsParam.length;
    let length = itemLen;
    let itemCounter = 0;
    let colArr = [];
    for (let i = 0; length > 0; i++) {
      if (itemsParam[itemCounter]) {
        let itmCol = itemsParam[itemCounter];
        colArr.push({ ...itmCol })
        itemCounter++;
        length--;
      }
    }

    let sortedColms = colArr.sort((obj1, obj2) => obj1.order - obj2.order).map((obj, index) => { obj.order = index + 1; return obj; });
    setUserSelectedColumns(sortedColms);

    if (close) {
      props.saveColumnsToQuery(sortedColms);
      handleClose();
    }
  }

  function userUpdatedColumns(oldColumns, newColumns) {
    if (oldColumns.length !== newColumns.length) {
      return true;
    }
    for (let i = 0; i < oldColumns.length; i++) {
      if (columnValuesChanged(oldColumns[i], newColumns[i])) {
        return true;
      }
    }
    return false;
  }

  function columnValuesChanged(oldCol, newCol) {
    let propsNew = Object.keys(newCol);
    let propsOld = Object.keys(oldCol);

    if (propsNew.length !== propsOld.length) {
      return true;
    }
    for (let i = 0; i < propsNew.length; i++) {
      if (oldCol[propsNew[i]] !== newCol[propsNew[i]]) {
        return true;
      }
    }
    return false;
  }

  const restoreDefault = () => {
    setItems(defaultItems)

    Object.keys(selectedColumns).map(type => { selectedColumns[type] = false } )
    setSelectedColumns(selectedColumns);
  }

  useEffect(() => {
    if (!open)
      return;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    let categories = props.categories;
    let columns = props.columns;

    let dtArr = [];
    for (let i = 0; i < categories.length; i++) {
      let cat = categories[i];
      let cols = columns.filter(col => col?.categories.map(obj => obj.id).includes(cat.id)).sort((obj1, obj2) => obj1.order - obj2.order)
      if (cols.length > 0) {
        dtArr.push({ ...cat, "columns": [...cols] })
      }
    }
    setCategories(dtArr);
    setColumns(columns);
    let colArr = {};
    let colItems = [];
    let colUserSelArr = {};
    let colUserSelItems = [];
    let columnsTemp = columns.map(obj => { return { ...obj } });
    columnsTemp = columnsTemp.sort((obj1, obj2) => obj1.order - obj2.order).map((obj, index) => { obj.order = index + 1; return obj; });
    const usrSelCols = userSelectedColumns//[]//getUserStoredColumns(tableId);
    let usrSelColsPresent = usrSelCols.length > 0;
    for (let i = 0; i < columnsTemp.length; i++) {
      let col = columnsTemp[i];
      let colUsrArr = usrSelCols.filter(usrCol => usrCol.id === col.id);
      let colUsr = colUsrArr && colUsrArr.length > 0 ? colUsrArr[0] : null;

      if ((col.default || col.immutable) && !colArr[col.id]) {
        colItems.push({
          "id": col.id,
          "label": col.label,
          "immutable": col.immutable,
          "property_name": col.property_name,
          "tooltip": col.tooltip,
          "order": col.order,
          "oplist": col.oplist,
          "categories": col.categories,
          "typeaheadID": col.typeaheadID,
          "outputType": col.outputType
        })
      }
      if (usrSelColsPresent && colUsr && !colUserSelArr[col.id]) {
        colUserSelItems.push({
          "id": col.id,
          "label": col.label,
          "immutable": col.immutable,
          "property_name": col.property_name,
          "tooltip": col.tooltip,
          "order": colUsr.order,
          "oplist": col.oplist,
          "categories": col.categories,
          "typeaheadID": col.typeaheadID,
          "outputType": col.outputType
        })
      }

      colArr[col.id] = col.default ? col.default : col.immutable ? col.immutable : col.default;
      colUserSelArr[col.id] = colUsr ? true : false;
    }

    let sortedItems = colItems.sort((obj1, obj2) => obj1.order - obj2.order);
    if (usrSelColsPresent) {
      let colUserSelSortedItems = colUserSelItems.sort((obj1, obj2) => obj1.order - obj2.order);
      setItems(colUserSelSortedItems);
      setSelectedColumns(colUserSelArr);
      saveColumns(colUserSelSortedItems, false);
    } else {
      setItems(sortedItems)
      setSelectedColumns(colArr);
    }
    setDefaultColumns(colArr);
    setDefaultItems(sortedItems);

    // eslint-disable-next-line
  }, [open]);

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Helmet>
          {getTitle("customColumnsData")}
          {getMeta("customColumnsData")}
        </Helmet>
        <FeedbackWidget />
        <div className="alert-dialog-content">
          <AppBar sx={{ position: 'relative' }} className="gg-blue">
            <Toolbar>
              <Typography
                variant="h5"
                noWrap
                component="div"
                sx={{ flexGrow: 1 }}
              >
                {title}
              </Typography>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <DialogAlert
            alertInput={alertDialogInput}
            setOpen={input => {
              setAlertDialogInput({ show: input });
            }}
          />
          <Grid
            container
            style={{ margin: "0 0 0 -15px" }}
            className="pb-3"
            spacing={3}
            justifyContent='center'>
            <Grid item xs={12} sm={10}>
              <HorizontalDragDropColumns items={items} setItems={setItems} deleteItem={deleteItem} />
            </Grid>
            <Grid className={"small-text"} style={{paddingTop: "0px", paddingLeft: "20px", paddingRight: "20px"}}  item xs={12} sm={10}>
              <div className="text-center">*{" "}To reorder display of the columns on the list page, please drag the column name badges above.{" "}*</div>
            </Grid>

            {/* Buttons Top */}
            <Grid item xs={12} sm={10}>
              <div className='gg-align-right pt-2 pb-2 me-1'>
                <Button className='gg-btn-outline me-4' onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  className='gg-btn-blue me-4'
                  onClick={restoreDefault}
                  disabled={
                    false
                  }>
                  Restore Default
                </Button>
                <Button
                  className='gg-btn-blue'
                  onClick={() => saveColumns(items)}
                  disabled={
                    false
                  }>
                  Save Changes
                </Button>
              </div>
            </Grid>

            <Grid item xs={12} sm={10}>
              <div className1="p-4">
                <ColumnSelector categories={categories} handleSelectHighlight={handleSelectHighlight} selectedColumns={selectedColumns} />
              </div>
            </Grid>

            {/* Buttons Buttom */}
            <Grid item xs={12} sm={10}>
              {/* <Row className='gg-align-right pt-3 mb-2 mr-1'> */}
              <div className='gg-align-right pt-3 me-1'>
                <Button className='gg-btn-outline me-4' onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  className='gg-btn-blue me-4'
                  onClick={restoreDefault}
                  disabled={
                    false
                  }>
                  Restore Default
                </Button>
                <Button
                  className='gg-btn-blue'
                  onClick={() => saveColumns(items)}
                  disabled={
                    false
                  }>
                  Save Changes
                </Button>
              </div>
              {/* </Row> */}
            </Grid>
          </Grid>
        </div>
      </Dialog>
    </>);
};

export default CustomColumnsData;