import React, { useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { makeStyles } from "@mui/styles";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  PaginationTotalStandalone,
  SizePerPageDropdownStandalone
} from "react-bootstrap-table2-paginator";
import cellEditFactory from 'react-bootstrap-table2-editor';

const ClientEditableTable = ({
  data,
  idField = "id",
  page,
  columns,
  errorColumns,
  sizePerPage,
  onTableChange,
  noDataIndication,
  rowStyle,
  wrapperClasses = "table-responsive",
  totalSizeText = "Results",
  tableHeader,
  updateTable,
  validateColumnData
}) => {


  const handleTableChange = (type, values) => {
    // if (onClickTarget) {
    //   scrollToElement(onClickTarget);
    // }
    onTableChange(type, values);
  };
  const useStyles = makeStyles(theme => ({
    tableHeader: {
      backgroundColor: "#4B85B6",
      color: theme.palette.common.white,
      height: "50px",
    }
  }));
  const classes = useStyles();

	useEffect(() => {
	}, [updateTable]);

  return (
    <div>
      <div style={{paddingTop:"20px"}}>
      <BootstrapTable
        keyField="id"
        bootstrap4
        scrollTop={"Bottom"}
        striped
        hover
        wrapperClasses={wrapperClasses}
        data={data}
        columns={columns}
        noDataIndication={noDataIndication}
        rowStyle={rowStyle}
        headerClasses={tableHeader ? tableHeader : classes.tableHeader}
        cellEdit={ cellEditFactory({ mode: 'click', blurToSave: true,
          afterSaveCell: (oldValue, newValue, row, column) => { 
            if (row.error) {
              row.error = !errorColumns.every(
                (err) => validateColumnData(err, row[err] )
              )
            }
          }
         })
        }
      />
      </div>
    </div>
  );
};

export default ClientEditableTable;
