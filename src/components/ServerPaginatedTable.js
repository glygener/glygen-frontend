import React, { useState, useEffect } from "react";

import PaginatedTable from "./PaginatedTable";
import { getTableList } from "../data/tablePaginated";
import { axiosError } from "../data/axiosError";
import PageLoader from "../components/load/PageLoader";
import { logActivity } from "../data/logging";
import PropTypes from 'prop-types';

const ServerPaginatedTable = props => {
  const {
    initData,
    totalDataSize,
    columns,
    defaultSizePerPage = 20,
    defaultSortField = "",
    defaultSortOrder = "desc",
    onClickTarget,
    idField,
    tableHeader,
    wrapperClasses,
    record_type,
    table_id,
    record_id,
    setAlertDialogInput,
    currentSortOrder,
    currentSort,
    setCardLoading,
    viewPort,
    setOpen,
    open
  } = props;

  const [page, setPage] = useState(1);
  const [firstLoad, setFirstLoad] = useState(false);
  const [firstLoadHandle, setFirstLoadHandle] = useState(false);
  const [sizePerPage, setSizePerPage] = useState(defaultSizePerPage);
  // const [cardLoading, setCardLoading] = useState(true);
  const [totalSize, setTotalSize] = useState(totalDataSize);
  const [data, setData] = useState([]);


useEffect(() => {
  setPage(1);
  logActivity("user", record_id);

  if (initData && initData.length > 0) {
    setData(initData);
    setPage(1);
    setTotalSize(totalDataSize);
    setCardLoading(false);
    return;
  }

  setCardLoading(true);
  getTableList(
    record_type,
    table_id,
    record_id,
    (page - 1) * sizePerPage + 1,
    sizePerPage,
    currentSort || defaultSortField,
    currentSortOrder || defaultSortOrder,
  )
    .then(({ data }) => {
      if (data.error_code) {
        let message = "table pagination api call";
        logActivity("user", record_id, "No results. " + message);
        setCardLoading(false);
      } else {
        if (data.query) {
          const currentPage = (data.query.offset - 1) / sizePerPage + 1;
          setPage(currentPage);
          setTotalSize(totalDataSize);
        } else {
          setPage(1);
          setTotalSize(0);
        }
        setCardLoading(false);
      }
    })
    .catch(function(error) {
      let message = "table pagination api call";
      axiosError(error, record_id, message, setCardLoading, setAlertDialogInput);
    });
  // eslint-disable-next-line
}, []);



useEffect(() => {

  // don't need to call the websrvice here when the component is loaded for the first time.
  if (!firstLoad) {
    setFirstLoad(true);
    return;
  }

  if (!currentSort || !currentSortOrder) {
    return;
  }

  logActivity("user", record_id);

  setCardLoading(true);
  getTableList(
    record_type,
    table_id,
    record_id,
    (page - 1) * sizePerPage + 1,
    sizePerPage,
    currentSort,
    currentSortOrder,
  )
    .then(({ data }) => {
      if (data.error_code) {
        let message = "table pagination api call";
        logActivity("user", record_id, "No results. " + message);
        setCardLoading(false);
      } else {
        if (data.query) {
          setData(data.results);
          const currentPage = (data.query.offset - 1) / sizePerPage + 1;
          setPage(currentPage);
          setTotalSize(totalDataSize);
        } else {
          setPage(1);
          setTotalSize(0);
        }
        setCardLoading(false);
      }
    })
    .catch(function(error) {
      let message = "table pagination api call";
      axiosError(error, record_id, message, setCardLoading, setAlertDialogInput);
    });
  // eslint-disable-next-line
}, [currentSort, currentSortOrder]);

const handleTableChange = (
  type,
  { page, sizePerPage, sortField, sortOrder }
) => {

    // // don't need to call the websrvice here when the component is loaded for the first time.
    if (!firstLoadHandle && sortField === defaultSortField && sortOrder === defaultSortOrder) {
      setFirstLoadHandle(true);
      return;
    } else {
      setFirstLoadHandle(true);
    }

  setPage(page);
  setSizePerPage(sizePerPage);
  setCardLoading(true);
  getTableList(
    record_type,
    table_id,
    record_id,
    (page - 1) * sizePerPage + 1,
    sizePerPage,
    sortField || currentSort,
    sortOrder || currentSortOrder
  ).then(({ data }) => {

    if (data.error_code) {
      let message = "table pagination api call";
      logActivity("user", record_id, "No results. " + message);
      setCardLoading(false);
    } else {
        if (data.query) {
          // place to change values before rendering
          setData(data.results);
          setTotalSize(totalDataSize);
        } else {
          setPage(1);
          setTotalSize(0);
        }
        setCardLoading(false);
      }
    })
    .catch(function(error) {
      let message = "table pagination api call";
      axiosError(error, record_id, message, setCardLoading, setAlertDialogInput);
    });
  };

  return (
    <>
    {/* <PageLoader pageLoading={cardLoading} /> */}
    {data && (
      <PaginatedTable
        data={data}
        columns={columns}
        page={page}
        sizePerPage={sizePerPage}
        totalSize={totalSize}
        onTableChange={handleTableChange}
        wrapperClasses={wrapperClasses ? wrapperClasses : "table-responsive table-height"}
        tableHeader={tableHeader}
        defaultSortField={defaultSortField}
        defaultSortOrder={defaultSortOrder}
        idField={idField}
        viewPort={viewPort}
        setOpen={setOpen}
        open={open}
        // noDataIndication={pageLoading ? "Fetching Data." : "No data available."}
      />)}
      </>
  );
};

export default ServerPaginatedTable;

ServerPaginatedTable.propTypes = {
	setAlertDialogInput: PropTypes.func,
	setCardLoading: PropTypes.func
};