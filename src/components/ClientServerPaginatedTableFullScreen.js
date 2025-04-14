import React, { useState, useEffect } from "react";
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
import { getFilterInit } from "../data/tablePaginated";
import Button from "react-bootstrap/Button";
import ListFilter from "../components/ListFilter";
import { ReactComponent as ArrowRightIcon } from "../images/icons/arrowRightIcon.svg";
import { ReactComponent as ArrowLeftIcon } from "../images/icons/arrowLeftIcon.svg";
import PageLoader from "../components/load/PageLoader";
import { axiosError } from "../data/axiosError";
import { logActivity } from "../data/logging";

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
    showFilters,
    noDataIndication
  } = props;

  const [open, setOpen] = React.useState(false);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [availableFilters, setAvailableFilters] = useState([]);
  const [sidebar, setSidebar] = useState(true);
  const [listCacheId, setListCacheId] = useState();

  const handleClose = () => {
    setOpen(false);
  };

  const handleFilterChange = newFilter => {
    // find if a filter exists for this type
    const existingFilter = appliedFilters.find(
      filter => filter.id === newFilter.id
    );
    // if no filter exists
    if (
      existingFilter &&
      existingFilter.selected &&
      newFilter &&
      newFilter.selected &&
      (newFilter.selected.length || existingFilter.selected.length)
    ) {
      // list of all the other filters
      // add a new filter of this type
      const otherFilters = appliedFilters.filter(
        filter => filter.id !== newFilter.id
      );

      if (newFilter.selected.length) {
        // for this existing filter, make sure we remove this option if it existed
        setAppliedFilters([...otherFilters, newFilter]);
      } else {
        setAppliedFilters(otherFilters);
      }
    } else if (newFilter.selected.length) {
      setAppliedFilters([...appliedFilters, newFilter]);
    }
  };

  useEffect(() => {
    if (!open) {
      if (appliedFilters.length > 0) {
        setAppliedFilters([]);
      }
      return;
    }

    if (!showFilters)
      return;

    setPageLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    let message = "filter init api call: " + record_type;
    logActivity("user", record_id, message);
    getFilterInit(record_type, table_id, record_id)
      .then(({ data }) => {
        if (data.error_code) {
          let message = "filter init api call: " + record_type;
          logActivity("user", record_id, "No results. " + message);
          setPageLoading(false);
        } else {
          setAvailableFilters(data.available);
          setPageLoading(false);
        }
      })
      .catch(function (error) {
        let message = "filter init api call: " + record_type;
        axiosError(error, record_id, message, setPageLoading, setAlertDialogInput);
      });
    // eslint-disable-next-line
  }, [open]);

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <div className="alert-dialog-content">
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
          <div className="list-page-container" style={{ padding: "5px" }}>
            {availableFilters && availableFilters.length !== 0 && (
              <div className="list-sidebar-container">
                <div className={"list-sidebar" + (sidebar ? "" : " closed")}>
                  <div className="reset-filter-btn-container">
                    <Button
                      type="button"
                      className="gg-btn-blue reset-filter-btn"
                      onClick={() => {
                        setAppliedFilters([]);
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                  <ListFilter
                    availableOptions={availableFilters}
                    selectedOptions={appliedFilters}
                    onFilterChange={handleFilterChange}
                  />
                  <div className="reset-filter-btn-container ">
                    <Button
                      type="button"
                      className="gg-btn-blue reset-filter-btn"
                      onClick={() => {
                        setAppliedFilters([]);
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
                <div
                  className="list-sidebar-opener sidebar-arrow-center"
                  onClick={() => setSidebar(!sidebar)}
                >
                  {sidebar ? <ArrowLeftIcon /> : <ArrowRightIcon />}
                </div>
              </div>
            )}
            <div className={"sidebar-page-outreach"}>
              <div class="list-mainpage-container list-mainpage-container">
                <section>

                  <div className="text-end" style={{ paddingRight: "10px" }}>
                    <DownloadButton {...{ ...download, dataId: listCacheId ? listCacheId : record_id }} />
                  </div>
                  <ClientServerPaginatedTable
                    data={data}
                    columns={columns}
                    onClickTarget={onClickTarget}
                    defaultSortField={defaultSortField}
                    defaultSortOrder={defaultSortOrder}
                    defaultSizePerPage={defaultSizePerPage}
                    idField={idField}
                    wrapperClasses={"table-responsive"}
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
                    appliedFilters={appliedFilters}
                    setAvailableFilters={setAvailableFilters}
                    setListCacheId={showFilters ? setListCacheId : undefined}
                    noDataIndication={noDataIndication}
                  />
                </section>
              </div>
            </div>
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