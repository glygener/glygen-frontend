import React, { useState, useEffect, useReducer } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getGlycanImageUrl, getMotifList } from "../data/motif";
import PaginatedTable from "../components/PaginatedTable";
import Container from "@mui/material/Container";
import DownloadButton from "../components/DownloadButton";
import FeedbackWidget from "../components/FeedbackWidget";
import stringConstants from "../data/json/stringConstants.json";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import { Row } from "react-bootstrap";
import { Grid } from "@mui/material";
import LineTooltip from "../components/tooltip/LineTooltip";
import { Link } from "react-router-dom";
import routeConstants from "../data/json/routeConstants";
import { Col } from "react-bootstrap";

const glycanStrings = stringConstants.glycan.common;
const motifStrings = stringConstants.motif.common;

const MotifList = props => {
  let { id } = useParams();

  const [data, setData] = useState([]);
  // const [query, setQuery] = useState([]);
  const [pagination, setPagination] = useState([]);
  // const [motifListColumns, setMotifListColumns] = useState(MOTIF_LIST_COLUMNS);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(150);
  const [totalSize, setTotalSize] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  useEffect(() => {
    setPageLoading(true);
    logActivity("user", id);

    getMotifList(id)
      .then(({ data }) => {
        if (data.error_code) {
          let message = "list api call";
          logActivity("user", id, "No results. " + message);
          setPageLoading(false);
        } else {
          setData(data.results);
          // setQuery(data.cache_info.query);
          setPagination(data.pagination);
          const currentPage = (data.pagination.offset - 1) / sizePerPage + 1;
          setPage(currentPage);
          setTotalSize(data.pagination.total_length);
          setPageLoading(false);
        }
      })
      .catch(function(error) {
        let message = "list api call";
        axiosError(error, id, message, setPageLoading, setAlertDialogInput);
      });
  }, [id, sizePerPage]);

  const handleTableChange = (
    type,
    { page, sizePerPage, sortField, sortOrder }
  ) => {
    setPage(page);
    setSizePerPage(sizePerPage);

    getMotifList(
      id,
      (page - 1) * sizePerPage + 1,
      sizePerPage,
      sortField,
      sortOrder
    ).then(({ data }) => {
      // place to change values before rendering

      setData(data.results);
      // setQuery(data.cache_info.query);
      setPagination(data.pagination);

      //   setSizePerPage()
      setTotalSize(data.pagination.total_length);
    });
  };

  function rowStyleFormat(row, rowIdx) {
    return { backgroundColor: rowIdx % 2 === 0 ? "red" : "blue" };
  }

  const motifListColumns = [
    {
      dataField: "motif_ac",
      text: glycanStrings.glycan_image.name,
      sort: false,
      selected: true,
      formatter: (value, row) => (
        <div className="img-wrapper">
          <img
            className="img-cartoon"
            src={getGlycanImageUrl(row.motif_ac)}
            alt="Glycan img"
          />
        </div>
      ),
      headerStyle: (colum, colIndex) => {
        return {
          whiteSpace: "nowrap"
        };
      }
    },
    {
      dataField: "motif_ac",
      text: motifStrings.motif_id.name,
      sort: true,
      selected: true,
      headerStyle: () => {
        return { width: "20%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Link to={routeConstants.motifDetail + row.motif_ac}>
            {row.motif_ac}
          </Link>
        </LineTooltip>
      )
    },
    {
      dataField: "motif_name",
      text: motifStrings.motif_name.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "20%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Link to={routeConstants.motifDetail + row.motif_ac}>
            {row.motif_name}
          </Link>
        </LineTooltip>
      )
    },
    {
      dataField: "synonyms",
      text: motifStrings.motif_synonym.synonym,
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "20%" };
      },
      formatter: (value, row) => (
        <>
          {value.map(synonyms => (
            <Col className="nowrap pl-0">
              <LineTooltip text="View details">
                <Link to={routeConstants.motifDetail + row.motif_ac}>
                  {synonyms}
                </Link>
              </LineTooltip>
            </Col>
          ))}
        </>
      )
    },
    {
      dataField: "glycan_count",
      text: motifStrings.glycan_count.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "20%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Link to={routeConstants.motifDetail + row.motif_ac}>
            {row.glycan_count}
          </Link>
        </LineTooltip>
      )
    },
    {
      dataField: "protein_count",
      text: motifStrings.protein_count.name,
      sort: true,
    }
  ];

  return (
    <>
      <Helmet>
        {getTitle("motifList")}
        {getMeta("motifList")}
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
        <section>
          <div className="content-box-md">
            <Row>
              <Grid item xs={12} sm={12} className="text-center">
                <div className="horizontal-heading">
                  <h5>Look At</h5>
                  <h2>
                    List of <strong>Motifs</strong>
                  </h2>
                </div>
              </Grid>
            </Row>
          </div>

          <DownloadButton
            types={[
              {
                display: stringConstants.download.motif_jsondata.displayname,
                type: "json",
                data: "motif_list"
              }
            ]}
            dataId={""}
            dataType="motif_list"
          />

          {motifListColumns && motifListColumns.length !== 0 && (
            <PaginatedTable
              trStyle={rowStyleFormat}
              data={data}
              columns={motifListColumns}
              page={page}
              pagination={pagination}
              sizePerPage={sizePerPage}
              totalSize={totalSize}
              onTableChange={handleTableChange}
              defaultSortField="glycan_count"
              defaultSortOrder="desc"
            />
          )}
        </section>
      </Container>
    </>
  );
};

export default MotifList;
