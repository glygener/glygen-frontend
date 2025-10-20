import React, { useEffect } from "react";
import { styled } from '@mui/material/styles';
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  PaginationTotalStandalone,
  SizePerPageDropdownStandalone
} from "react-bootstrap-table2-paginator";
import cellEditFactory from 'react-bootstrap-table2-editor';

const PREFIX = 'ClientEditableTable';

const classes = {
  tableHeader: `${PREFIX}-tableHeader`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.tableHeader}`]: {
    backgroundColor: "#4B85B6",
    color: theme.palette.common.white,
    height: "50px",
  }
}));

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
  defaultSortField = "",
  defaultSortOrder = "",
  tableHeader,
  updateTable,
  validateColumnData,
  saveColumnData,
  bordered = true
}) => {
  const handleTableChange = (type, values) => {
    // if (onClickTarget) {
    //   scrollToElement(onClickTarget);
    // }
    onTableChange(type, values);
  };


  useEffect(() => {
  }, [updateTable]);

  return (
    <Root>
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
        bordered={ bordered }
        defaultSorted={[
          {
            dataField: defaultSortField,
            order: defaultSortOrder
          }
        ]}
        noDataIndication={noDataIndication}
        rowStyle={rowStyle}
        headerClasses={tableHeader ? classes.tableHeader + " " + tableHeader : classes.tableHeader}
        cellEdit={ cellEditFactory({ mode: 'click', blurToSave: true,
          afterSaveCell: (oldValue, newValue, row, column) => { 
            if (row.error) {
              row.error = !errorColumns.every(
                (err) => validateColumnData(err, row[err] )
              )
            }

           if (saveColumnData) {
              saveColumnData(oldValue, newValue, row, column)
            }
          }
         })
        }
      />
      </div>
    </Root>
  );
};

export default ClientEditableTable;
