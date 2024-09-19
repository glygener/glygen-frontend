import React, { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { makeStyles } from "@mui/styles";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Button from "react-bootstrap/Button";
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  PaginationTotalStandalone,
  SizePerPageDropdownStandalone
} from "react-bootstrap-table2-paginator";

const PaginatedTable = ({
  data,
  idField = "id",
  page,
  columns,
  sizePerPage,
  onTableChange,
  totalSize,
  downloadButton,
  defaultSortField = "",
  defaultSortOrder = "asc",
  onClickTarget,
  noDataIndication,
  rowStyle,
  wrapperClasses = "table-responsive",
  totalSizeText = "Results",
  tableHeader,
  viewPort,
  setOpen,
  open
}) => {
  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total Paginationtext">
      <strong>
        Showing {from} to {to} of {size} {totalSizeText}
      </strong>
    </span>
  );

  const options = {
    firstPageTitle: "Next page",
    lastPageTitle: "Last page",
    showTotal: true,
    paginationTotalRenderer: customTotal,
    sizePerPageList: [
      {
        text: "20",
        value: 20
      },
      {
        text: "50",
        value: 50
      },
      {
        text: "100",
        value: 100
      },
      {
        text: "150",
        value: 150
      },
      {
        text: "200",
        value: 200
      }
    ] // A numeric array is also available. the purpose of above example is custom the text
  };

  // const scrollToElement = elementSelector => {
  //   const elmnt = document.querySelector(elementSelector);
  //   elmnt.scrollIntoView();
  // };

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
  const [expand, setExpand] = useState(false);

  return (
    <div style1={{height: viewPort && expand ? window.innerHeight : undefined, width: viewPort && expand ? window.innerWidth : undefined}}>

      <PaginationProvider
        pagination={paginationFactory({
          ...options,
          custom: true,
          page,
          sizePerPage,
          totalSize //,
          // defaultSort
        })}
      >
        {({ paginationProps, paginationTableProps }) => (
          <div>
            <div>
              <strong className="Paginationtext">Records per page {""}</strong>
              <SizePerPageDropdownStandalone
                {...paginationProps}
                className="me-2 narrow-dropdown"
              />
              <PaginationTotalStandalone {...paginationProps} />
              {/* {onDownload && <button onClick={onDownload}>Download</button>} */}
              {downloadButton}
              <PaginationListStandalone {...paginationProps} />
              {viewPort && 
                <Button
                  type="button"
                  style={{ marginLeft: "10px", paddingBottom: "5px", paddingTop: "5px" }}
                  className="gg-btn-blue"
                  onClick={() => { setOpen(!open); setExpand(!expand); }}>{!open ? <FullscreenIcon/> : <FullscreenExitIcon/>}
              </Button>}
            </div>
            <div style={{paddingTop:"20px"}}>
            <BootstrapTable
              bootstrap4
              scrollTop={"Bottom"}
              striped
              hover
              wrapperClasses={wrapperClasses}
              remote
              keyField={idField}
              defaultSorted={[
                {
                  dataField: defaultSortField,
                  order: defaultSortOrder
                }
              ]}
              data={data}
              columns={columns}
              onTableChange={handleTableChange}
              {...paginationTableProps}
              noDataIndication={noDataIndication}
              rowStyle={rowStyle}
              headerClasses={tableHeader ? tableHeader : classes.tableHeader}
            />
            </div>
            <div>
              <PaginationTotalStandalone {...paginationProps} />
              <PaginationListStandalone {...paginationProps} />
            </div>
          </div>
        )}
      </PaginationProvider>
    </div>
  );
};

export default PaginatedTable;
