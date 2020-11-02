import React from "react";
import BootstrapTable from "react-bootstrap-table-next";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  PaginationTotalStandalone,
  SizePerPageDropdownStandalone,
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
}) => {
  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total Paginationtext">
      <strong>
        Showing {from} to {to} of {size} Results
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
        value: 20,
      },
      {
        text: "50",
        value: 50,
      },
      {
        text: "100",
        value: 100,
      },
      {
        text: "150",
        value: 150,
      },
      {
        text: "200",
        value: 200,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
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

  return (
    <div>
      <PaginationProvider
        pagination={paginationFactory({
          ...options,
          custom: true,
          page,
          sizePerPage,
          totalSize, //,
          // defaultSorted
        })}
      >
        {({ paginationProps, paginationTableProps }) => (
          <div>
            <div>
              <strong className="Paginationtext">Records per page {""}</strong>
              <SizePerPageDropdownStandalone
                {...paginationProps}
                className="mr-2 narrow-dropdown"
              />
              <PaginationTotalStandalone {...paginationProps} />
              {/* {onDownload && <button onClick={onDownload}>Download</button>} */}
              {downloadButton}
              <PaginationListStandalone {...paginationProps} />
            </div>
            <BootstrapTable
              bootstrap4
              scrollTop={"Bottom"}
              striped
              hover
              wrapperClasses="table-responsive table-height"
              remote
              keyField={idField}
              defaultSorted={[
                {
                  dataField: defaultSortField,
                  order: defaultSortOrder,
                },
              ]}
              data={data}
              columns={columns}
              onTableChange={handleTableChange}
              {...paginationTableProps}
            />
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
