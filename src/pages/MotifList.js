import React, { useState, useEffect, useReducer } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { useParams, useNavigate } from "react-router-dom";
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
import DirectSearch from "../components/search/DirectSearch.js";
import { getSuperSearch } from '../data/supersearch';

const glycanStrings = stringConstants.glycan.common;
const motifStrings = stringConstants.motif.common;
const superSearchDirectSearch = stringConstants.super_search.direct_search;

const MotifList = props => {
  let { id } = useParams();
  const navigate = useNavigate();

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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    logActivity("user", id);

    getMotifList(id, 1, sizePerPage)
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

/**
    * Function to execute super search query.
	* @param {array} superSearchQuery - query object.
	* @param {boolean} selected - true if sample query is executed.
	* @param {boolean} selected - true if sample query is executed.
  **/
  function executeSuperSearchQuery(superSearchQuery, navigateTo) {

    superSearchQuery = {
      concept_query_list : [superSearchQuery]
    };
  
    if (JSON.stringify(superSearchQuery) !== JSON.stringify({})){
      setPageLoading(true);
      let message = "Direct Search query=" + JSON.stringify(superSearchQuery);
      logActivity("user", "", "Performing Direct Search. " + message);
      getSuperSearch(superSearchQuery).then((response) => {
        let searchData = response.data;
        if (navigateTo === "protein") {
          if (searchData.results_summary.protein.list_id === "") {
           let error = {
             id: "no_data",
             error_code: "directSearchError"
           }
            axiosError(error, "", message, setPageLoading, setAlertDialogInput);          
          } else {
            setPageLoading(false);
            navigate(
              routeConstants.proteinList + searchData.results_summary.protein.list_id + "/sups"
            );
          }
        }
        if (navigateTo === "glycan") {
          if (searchData.results_summary.glycan.list_id === "") {
            let error = {
              id: "no_data",
              error_code: "directSearchError"
            }
            axiosError(error, "", message, setPageLoading, setAlertDialogInput);
          } else {
            setPageLoading(false);
            navigate(
              routeConstants.glycanList + searchData.results_summary.glycan.list_id + "/sups"
            );
          }
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
    }
    }


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
        <div>
          {row.motif_name}
        </div>
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
              <div>
                {synonyms}
              </div>
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
        <div>
          {row.glycan_count}
          {" "}
          {row.glycan_count > 0 && <DirectSearch
            text={superSearchDirectSearch.motif_glycan.text}
            nodeType="motif"
            searchType="superSearch"
            fieldType="string_value"
            fieldValue={row.motif_ac}
            operator="$eq"
            fieldPath= "motif_ac"
            navigateTo = "glycan"
            executeSearch={executeSuperSearchQuery}
          />}
        </div>
      )
    },
    {
      dataField: "protein_count",
      text: motifStrings.protein_count.name,
      sort: true,
      formatter: (value, row) => (
        <div>
          {row.protein_count}
          {" "}
          {row.protein_count > 0 && <DirectSearch
            text={superSearchDirectSearch.motif_protein.text}
            nodeType="motif"
            searchType="superSearch"
            fieldType="string_value"
            fieldValue={row.motif_ac}
            operator="$eq"
            fieldPath= "motif_ac"
            navigateTo = "protein"
            executeSearch={executeSuperSearchQuery}
          />}
        </div>
      )
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

          <div className="text-end">
            <DownloadButton
              types={[
                {
                  display: stringConstants.download.motif_jsondata.displayname,
                  type: "json",
                  data: "motif_list"
                }
              ]}
              dataId={""}
              itemType="motif_list"
            />
          </div>

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
