import React from "react";
import ServerPaginatedTable from "./ServerPaginatedTable";
import ClientPaginatedTable from "./ClientPaginatedTable";
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(
  props,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
    setCardLoading,
    viewPort,
    setOpen,
    appliedFilters,
    setAvailableFilters,
    setListCacheId,
    open,
    noDataIndication
  } = props;

  return (
    <>
      {serverPagination ? <ServerPaginatedTable
        initData={data}
        columns={columns}
        defaultSizePerPage={defaultSizePerPage}
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
        viewPort={viewPort}
        setOpen={setOpen}
        open={open}
        appliedFilters={appliedFilters}
        setAvailableFilters={setAvailableFilters}
        setListCacheId={setListCacheId}
        noDataIndication={noDataIndication}
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
          viewPort={viewPort}
          setOpen={setOpen}
          open={open}
      />}
  </>);
};

export default ClientServerPaginatedTable;