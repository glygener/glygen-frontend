import React from "react";

import ServerPaginatedTable from "./ServerPaginatedTable";
import ClientPaginatedTable from "./ClientPaginatedTable";
import PropTypes from 'prop-types';

const ClientServerPaginatedTable = props => {
  const {
    data,
    totalDataSize,
    columns,
    defaultSizePerPage = 20,
    defaultSortField = "",
    defaultSortOrder = "desc",
    onClickTarget,
    idField,
    tableHeader,
    serverPagination,
    wrapperClasses,
    record_type,
    table_id,
    record_id,
    currentSortOrder,
    currentSort,
    setAlertDialogInput,
    setCardLoading
  } = props;

  // const [page, setPage] = useState(1);
  // const [pageContents, setPageContents] = useState([]);
  // const [currentSort, setCurrentSort] = useState(defaultSortField);
  // const [currentSortOrder, setCurrentSortOrder] = useState(defaultSortOrder);
  // const [sizePerPage, setSizePerPage] = useState(defaultSizePerPage);

  return (
    <>
    {serverPagination ? <ServerPaginatedTable
      initData={data}
      columns={columns}
      defaultSizePerPage={defaultSizePerPage}
      // totalSize={data.length}
      onClickTarget={onClickTarget}
      defaultSortField={defaultSortField}
      defaultSortOrder={defaultSortOrder}
      idField={idField}
      wrapperClasses={wrapperClasses}
      tableHeader={tableHeader}
      record_type={record_type}
      table_id={table_id}
      record_id={record_id}
      totalDataSize={totalDataSize}
      currentSort={currentSort}
      currentSortOrder={currentSortOrder}
      setAlertDialogInput={setAlertDialogInput}
      setCardLoading={setCardLoading}
    />
     : <ClientPaginatedTable
     data={data}
     columns={columns}
     onClickTarget={onClickTarget}
     defaultSizePerPage={defaultSizePerPage}
     defaultSortField={defaultSortField}
     defaultSortOrder={defaultSortOrder}
     idField={idField}
     wrapperClasses={wrapperClasses}
     tableHeader={tableHeader}
     currentSort={currentSort}
     currentSortOrder={currentSortOrder}
  />}
  </>);
};

export default ClientServerPaginatedTable;

// ClientServerPaginatedTable.propTypes = {
// 	setAlertDialogInput: PropTypes.func,
// 	setCardLoading: PropTypes.func
// };