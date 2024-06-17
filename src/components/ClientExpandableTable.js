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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import "../App.css";

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


  // const handleTableChange = (type, values) => {
  //   // if (onClickTarget) {
  //   //   scrollToElement(onClickTarget);
  //   // }
  //   onTableChange(type, values);
  // };
  const useStyles = makeStyles(theme => ({
    tableHeader: {
      backgroundColor: "#4B85B6",
      color: theme.palette.common.white,
      height: "50px",
    },
    extableHeader: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.white,
    }
  }));
  const classes = useStyles();

  const expandRow = {
    renderer: row => (
      <div>
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
      </div>
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
