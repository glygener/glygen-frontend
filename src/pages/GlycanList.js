import React, { useState, useEffect, useReducer } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getGlycanList } from "../data";
import { GLYCAN_COLUMNS, getUserSelectedColumns } from "../data/glycan";
import GlycanQuerySummary from "../components/GlycanQuerySummary";
import PaginatedTable from "../components/PaginatedTable";
import Container from "@material-ui/core/Container";
import DownloadButton from "../components/DownloadButton";
import FeedbackWidget from "../components/FeedbackWidget";
import stringConstants from "../data/json/stringConstants.json";
import ReactHtmlParser from "react-html-parser";
import routeConstants from "../data/json/routeConstants";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import { GLYGEN_BASENAME } from "../envVariables";

const GlycanList = props => {
  let { id } = useParams();
  let { searchId } = useParams();
  let quickSearch = stringConstants.quick_search;

  const [data, setData] = useState([]);
  const [query, setQuery] = useState([]);
  const [timestamp, setTimeStamp] = useState();
  const [pagination, setPagination] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(GLYCAN_COLUMNS);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(20);
  const [totalSize, setTotalSize] = useState();
  const [pageLoading, setPageLoading] = useState(true);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  const fixResidueToShortNames = query => {
    const residueMap = stringConstants.glycan.common.composition;
    const result = { ...query };

    if (result.composition) {
      result.composition = result.composition
        .sort((a, b) => {
          if (residueMap[a.residue].orderID < residueMap[b.residue].orderID) {
            return -1;
          } else if (
            residueMap[a.residue].orderID < residueMap[b.residue].orderID
          ) {
            return 1;
          }
          return 0;
        })
        .map(item => ({
          ...item,
          residue: ReactHtmlParser(residueMap[item.residue].name.bold())
        }));
    }

    return result;
  };

  useEffect(() => {
    setPageLoading(true);
    logActivity("user", id);
    // const selected = getUserSelectedColumns();
    // const userSelectedColumn = GLYCAN_COLUMNS.filter(column =>
    //   selected.includes(column.dataField)
    // );
    // setSelectedColumns(userSelectedColumn);

    getGlycanList(id)
      .then(({ data }) => {
        if (data.error_code) {
          let message = "list api call";
          logActivity("user", id, "No results. " + message);
          setPageLoading(false);
        } else {
          setData(data.results);
          if (
            data.cache_info.query.glycan_identifier &&
            data.cache_info.query.glycan_identifier.glycan_id
          ) {
            data.cache_info.query.glycan_identifier.glycan_id_short =
              data.cache_info.query.glycan_identifier.glycan_id.split(",")
                .length > 9
                ? data.cache_info.query.glycan_identifier.glycan_id
                    .split(",")
                    .slice(0, 9)
                    .join(",")
                : "";
          }
          setQuery(fixResidueToShortNames(data.cache_info.query));
          setTimeStamp(data.cache_info.ts);
          setPagination(data.pagination);
          const currentPage = (data.pagination.offset - 1) / sizePerPage + 1;
          setPage(currentPage);
          //   setSizePerPage()
          setTotalSize(data.pagination.total_length);
          setPageLoading(false);
        }
      })
      .catch(function(error) {
        let message = "list api call";
        axiosError(error, id, message, setPageLoading, setAlertDialogInput);
      });
  }, []);

  const handleTableChange = (
    type,
    { page, sizePerPage, sortField, sortOrder }
  ) => {
    setPage(page);
    setSizePerPage(sizePerPage);

    getGlycanList(
      id,
      (page - 1) * sizePerPage + 1,
      sizePerPage,
      sortField,
      sortOrder
    ).then(({ data }) => {
      // place to change values before rendering

      setData(data.results);
      setTimeStamp(data.cache_info.ts);
      setPagination(data.pagination);

      //   setSizePerPage()
      setTotalSize(data.pagination.total_length);
    });
  };

  function rowStyleFormat(row, rowIdx) {
    return { backgroundColor: rowIdx % 2 === 0 ? "red" : "blue" };
  }
  const handleModifySearch = () => {
    if (searchId === "gs") {
      props.history.push(routeConstants.globalSearchResult + query.term);
    } else if (searchId === "sups") {
      props.history.push(routeConstants.superSearch + id);
    } else if (quickSearch[searchId] !== undefined) {
      const basename = GLYGEN_BASENAME === "/" ? "" : GLYGEN_BASENAME;
      window.location =
        basename +
        routeConstants.quickSearch +
        id +
        "/" +
        quickSearch[searchId].id +
        "#" +
        quickSearch[searchId].id;
    } else {
      props.history.push(routeConstants.glycanSearch + id);
    }
  };

  return (
    <>
      <Helmet>
        {getTitle("glycanList")}
        {getMeta("glycanList")}
      </Helmet>

      <FeedbackWidget />
      <Container maxWidth="xl" className="gg-container">
        <PageLoader pageLoading={pageLoading} />
        <DialogAlert
          alertInput={alertDialogInput}
          setOpen={input => {
            setAlertDialogInput({ show: input });
          }}
        />
        <section className="content-box-md">
          <GlycanQuerySummary
            data={query}
            question={quickSearch[searchId]}
            searchId={searchId}
            timestamp={timestamp}
            onModifySearch={handleModifySearch}
          />
        </section>
        <section>
          <DownloadButton
            types={[
              {
                display: stringConstants.download.glycan_csvdata.displayname,
                type: "csv",
                data: "glycan_list"
              },
              {
                display: stringConstants.download.glycan_jsondata.displayname,
                type: "json",
                data: "glycan_list"
              }
            ]}
            dataId={id}
          />
          {selectedColumns && selectedColumns.length !== 0 && (
            <PaginatedTable
              trStyle={rowStyleFormat}
              data={data}
              columns={selectedColumns}
              page={page}
              sizePerPage={sizePerPage}
              totalSize={totalSize}
              onTableChange={handleTableChange}
              defaultSortField="hit_score"
              defaultSortOrder="desc"
              idField="glytoucan_ac"
            />
          )}
        </section>
      </Container>
    </>
  );
};

export default GlycanList;
