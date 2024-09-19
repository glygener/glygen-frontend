import React from "react";

import ServerPaginatedTable from "./ServerPaginatedTable";
import ClientPaginatedTable from "./ClientPaginatedTable";
import ClientServerPaginatedTable from "./ClientServerPaginatedTable";
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
import DownloadButton from "./DownloadButton";

const Transition = React.forwardRef(function Transition(
  props,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ClientServerPaginatedTableFullScreen = props => {
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
    setPageLoading,
    viewPort,
    title,
    download,
    abc="xyz",
    down
  } = props;

  // const [page, setPage] = useState(1);
  // const [pageContents, setPageContents] = useState([]);
  // const [currentSort, setCurrentSort] = useState(defaultSortField);
  // const [currentSortOrder, setCurrentSortOrder] = useState(defaultSortOrder);
  // const [sizePerPage, setSizePerPage] = useState(defaultSizePerPage);

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
     <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      > 
        <AppBar sx={{ position: 'relative' }} className="gg-blue">
          <Toolbar>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
          >
            {title}
          </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div style={{padding:"20px"}}>
        <div className="text-end" style={{paddingRight:"10px"}}>
          <DownloadButton {...download} />
        </div>
        <div style={{padding:"20px"}}>
          <ClientServerPaginatedTable
            data={data}
            columns={columns}
            onClickTarget={onClickTarget}
            defaultSortField={defaultSortField}
            defaultSortOrder={defaultSortOrder}
            defaultSizePerPage={defaultSizePerPage}
            idField={idField}
            wrapperClasses={wrapperClasses}
            tableHeader={tableHeader}
            record_type={record_type}
            table_id={table_id}
            record_id={record_id}
            serverPagination={serverPagination}
            totalDataSize={totalDataSize}
            currentSort={currentSort}
            currentSortOrder={currentSortOrder}
            setAlertDialogInput={setAlertDialogInput}
            setCardLoading={setPageLoading}
            setPageLoading={setPageLoading}
            viewPort={viewPort}
            title={title}
            setOpen={setOpen}
            open={open}
          />
        </div>
        </div>
      </Dialog> 
      <ClientServerPaginatedTable
        data={data}
        columns={columns}
        onClickTarget={onClickTarget}
        defaultSortField={defaultSortField}
        defaultSortOrder={defaultSortOrder}
        defaultSizePerPage={defaultSizePerPage}
        idField={idField}
        wrapperClasses={wrapperClasses}
        tableHeader={tableHeader}
        record_type={record_type}
        table_id={table_id}
        record_id={record_id}
        serverPagination={serverPagination}
        totalDataSize={totalDataSize}
        currentSort={currentSort}
        currentSortOrder={currentSortOrder}
        setAlertDialogInput={setAlertDialogInput}
        setCardLoading={setCardLoading}
        viewPort={viewPort}
        title={title}
        setOpen={setOpen}
        open={open}
      />
  </>);
};

export default ClientServerPaginatedTableFullScreen;

// ClientServerPaginatedTable.propTypes = {
// 	setAlertDialogInput: PropTypes.func,
// 	setCardLoading: PropTypes.func
// };