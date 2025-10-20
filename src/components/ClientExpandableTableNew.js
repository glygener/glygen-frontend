import { styled } from '@mui/material/styles';
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "../App.css";
import Button from "react-bootstrap/Button";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  useMaterialReactTable,
  MRT_ExpandAllButton,
  MRT_Table
} from 'material-react-table';

import {
  Box,
  lighten,
} from '@mui/material';

const PREFIX = 'ClientExpandableTableNew';

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

const ExpandableTable = props => {
  const {
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
} = props;

 const table = useMaterialReactTable({
    columns,
    data,
    enableKeyboardShortcuts: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    expandableTableColumns,
    muiTableBodyRowProps: { hover: false },
    initialState: {
      columnPinning: {
        right: ['mrt-row-expand'],
      },
    },
    muiTableProps: {
      sx: {
        fontSize: '18px !important',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        border: '0.4px solid #fff',
        backgroundColor: "#4B85B6", 
        color: "#FFFFFF !important",
        fontSize: '18px',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: '0.4px solid rgba(191, 186, 186, 0.5)',
        fontSize: '18px',
        color: "#212529",
      },
    },
    muiExpandAllButtonProps:  ({ row }) => ({
       sx: { 
          color: '#FFFFFF'
       },
    }),
    muiExpandButtonProps: ({ row }) => ({
       sx: { width: '140px', backgroundColor: "inherit",
        '&:hover': {
          backgroundColor: '#FFFFFF',
        },

       },
      children: row.getIsExpanded() ?
        <Button className={"lnk-btn-show-more"} variant="link">
          <span style={{ whiteSpace: "nowrap"}}>Show&nbsp;Less...<ExpandLessIcon /></span>
        </Button>
      :
        <Button className={"lnk-btn-show-more"} variant="link">
           <span style={{ whiteSpace: "nowrap"}}> Show&nbsp;More...<ExpandMoreIcon /></span>
        </Button>
    }),
     displayColumnDefOptions: {
      'mrt-row-expand': {
        size: 80,
                color: "white",
        fontSize: '18px',
        Header: ({ table }) => {
        return (
          <span style={{ color: "#FFFF !important"}}> 
            <MRT_ExpandAllButton table={table} />
            {/*custom content*/}
          </span>
        );
      },
      },
    },
    renderDetailPanel: ({ row }) => (

        <Box sx={{ textAlign: 'center' }}>
          <Root>
            <div style={{paddingTop:"15px", fontSize: '18px'}}>
              <BootstrapTable
                keyField="order"
                bootstrap4
                // scrollTop={"Bottom"}
                striped
                // hover
                wrapperClasses={wrapperClasses}
                data={row.original.expanded_table}
                columns={expandableTableColumns}
                noDataIndication={noDataIndication}
                // rowStyle={rowStyle}
                headerClasses={classes.tableHeader}
              />
            </div>
          </Root>
        </Box>
    ),
    renderTopToolbar: ({ table }) => {
      return (
        <Box
          sx={(theme) => ({
            backgroundColor: lighten(theme.palette.background.default, 0.05),
            display: 'flex',
            gap: '0.5rem',
            p: '8px',
            justifyContent: 'space-between',
          })}
        >
          <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          </Box>
         </Box>
      );
    },
  });

  return <MRT_Table table={table} />;
};

const ClientExpandableTableNew = props => (
    <ExpandableTable
      data={props.data}
      orgExpandedRow={props.orgExpandedRow}
      columns={props.columns}
      expandableTableColumns={props.expandableTableColumns}
      defaultSortField={props.defaultSortField}
      onClickTarget={props.onClickTarget} 
    />
);

export default ClientExpandableTableNew;
