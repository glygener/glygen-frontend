import React, { useState, useEffect } from "react";

import PaginatedTable from "./PaginatedTable";

const createSorter = (sortField, sortOrder) => (a, b) => {
  let sortFieldArr = sortField.split(".");
  let val1 = a;
  let val2 = b;
  for (let i = 0; i < sortFieldArr.length; i++) {
    val1 = val1[sortFieldArr[i]];
    val2 = val2[sortFieldArr[i]];
  }
  if (val1 > val2) {
    return sortOrder === "asc" ? 1 : -1;
  } else if (val1 < val2) {
    return sortOrder === "asc" ? -1 : 1;
  }
  return 0;
};

const ClientPaginatedTable = props => {
  const {
    data,
    columns,
    defaultSizePerPage = 20,
    defaultSortField = "",
    defaultSortOrder = "desc",
    onClickTarget,
    idField,
    tableHeader,
    wrapperClasses,
    viewPort,
    setOpen,
    open
  } = props;

  const [page, setPage] = useState(1);
  const [pageContents, setPageContents] = useState([]);
  const [currentSort, setCurrentSort] = useState(defaultSortField);
  const [currentSortOrder, setCurrentSortOrder] = useState(defaultSortOrder);
  const [sizePerPage, setSizePerPage] = useState(defaultSizePerPage);

  useEffect(() => {
    const start = (page - 1) * sizePerPage;
    const end = page * sizePerPage;
    const pageData = data.slice(start, end);
    setPageContents(pageData);
  }, [data, page, currentSort, currentSortOrder, sizePerPage]);

  const handleTableChange = (
    type,
    { page, sizePerPage, sortField, sortOrder }
  ) => {
    data.sort(createSorter(sortField, sortOrder));

    setPage(page);
    setCurrentSort(sortField);
    setCurrentSortOrder(sortOrder);
    setSizePerPage(sizePerPage);
  };

  // if (defaultSortField) {
  //   data.sort(createSorter(defaultSortField, defaultSortOrder));
  // }

  return (
    <PaginatedTable
      data={pageContents}
      columns={columns}
      page={page}
      sizePerPage={sizePerPage}
      totalSize={data.length}
      onTableChange={handleTableChange}
      onClickTarget={onClickTarget}
      defaultSortField={defaultSortField}
      defaultSortOrder={defaultSortOrder}
      idField={idField}
      wrapperClasses={wrapperClasses ? wrapperClasses : "table-responsive table-height"}
      tableHeader={tableHeader}
      viewPort={viewPort}
      setOpen={setOpen}
      open={open}
    />
  );
};

export default ClientPaginatedTable;
