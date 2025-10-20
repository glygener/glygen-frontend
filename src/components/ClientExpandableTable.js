import React, { useEffect } from "react";
import { styled } from '@mui/material/styles';
import ReactDOM from "react-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "../App.css";

const PREFIX = 'ClientExpandableTable';

const classes = {
  tableHeader: `${PREFIX}-tableHeader`,
  extableHeader: `${PREFIX}-extableHeader`
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
  },

  [`& .${classes.extableHeader}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.white,
  }
}));

const ClientExpandableTable = ({
  data,
  idField = "id",
  page,
  columns,
  sizePerPage,
  onTableChange,
  noDataIndication,
  rowStyle,
  wrapperClasses = "table-responsive",
  totalSizeText = "Results",
  tableHeader,
  updateTable,
  orgExpandedRow,
  expandableTableColumns
}) => {


  const expandRow = {
    renderer: row => (
      <Root>
        <div style={{paddingTop:"15px"}}>
          <BootstrapTable
            keyField="order"
            bootstrap4
            // scrollTop={"Bottom"}
            striped
            // hover
            wrapperClasses={wrapperClasses}
            data={row.expanded_table}
            columns={expandableTableColumns}
            noDataIndication={noDataIndication}
            // rowStyle={rowStyle}
            headerClasses={tableHeader ? tableHeader : classes.tableHeader}
          />
        </div>
      </Root>
    ),
    // className: "expandable-table expandable-table-no-hover",
    showExpandColumn: false,
    expandByColumnOnly: true,
    expanded: orgExpandedRow.orgArr,
  };

  return (
    <div>
      <div style={{paddingTop1:"20px", marginBottom: "-1rem"}}>
      <BootstrapTable
        keyField="common_name"
        bootstrap4
        scrollTop={"Bottom"}
        striped
        // hover
        wrapperClasses={wrapperClasses}
        data={data}
        columns={columns}
        noDataIndication={noDataIndication}
        rowStyle={rowStyle}
        headerClasses={tableHeader ? tableHeader : classes.tableHeader}
        expandRow={ expandRow }
      />
      </div>
    </div>
  );
};

export default ClientExpandableTable;
