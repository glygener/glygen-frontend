import React from "react";

import ServerPaginatedTable from "./ServerPaginatedTable";
import ClientPaginatedTable from "./ClientPaginatedTable";
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Padding } from "@mui/icons-material";
import Typography from '@mui/material/Typography';
import DownloadButton from "../components/DownloadButton";

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
    open
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
        viewPort={viewPort}
        setOpen={setOpen}
        open={open}
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

// ClientServerPaginatedTable.propTypes = {
// 	setAlertDialogInput: PropTypes.func,
// 	setCardLoading: PropTypes.func
// };