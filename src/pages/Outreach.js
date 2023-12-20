import React, { useEffect, useState, useReducer } from "react";
import Helmet from "react-helmet";
import { useLocation } from "react-router-dom";
import Container from "@mui/material/Container";
import { getTitle, getMeta } from "../utils/head";
import CssBaseline from "@mui/material/CssBaseline";
import VerticalHeading from "../components/headings/VerticalHeading";
import PanelOutreach from "../components/PanelOutreach";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import outreachJSON from "../data/json/outreach.json";
import { Row, Col } from "react-bootstrap";
import Sidebar from "../components/navigation/Sidebar";
import { logActivity } from "../data/logging";
import { ReactComponent as ArrowRightIcon } from "../images/icons/arrowRightIcon.svg";
import { ReactComponent as ArrowLeftIcon } from "../images/icons/arrowLeftIcon.svg";
import Button from "react-bootstrap/Button";
import ListFilter from "../components/ListFilter";
import { getOutreachData } from "../data/outreachApi";
import PageLoader from "../components/load/PageLoader";
import {axiosError} from '../data/axiosError';
import DialogAlert from '../components/alert/DialogAlert';

/**
 * Outreach component for showing glygen outreach page.
 */
const Outreach = (props) => {

  const [appliedFilters, setAppliedFilters] = useState([]);
  const [availableFilters, setAvailableFilters] = useState([]);
  const [sidebar, setSidebar] = useState(true);
  const [outreachItemsArray, setOutreachItemsArray] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [filterReset, setFilterReset] = useState(0);
  const [dataStatus, setDataStatus] = useState("Fetching Data.");
  const [alertDialogInput, setAlertDialogInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{show: false, id: ""}
	);

  const location = useLocation();

  const vertHeadHowToCite = {
    h2textTop: "Our",
    h2textBottomStrongBefore: "Outreach",
  };

  useEffect(() => {
    setPageLoading(true);
    let anchorElement = location.hash;
    if (anchorElement === undefined || anchorElement === null || anchorElement === "") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    logActivity();
    getOutreachData().then(( {data} ) => {
        let dateArray = [];
        let projectArray = [];
        let outreachTypeArray = [];
        let fl = outreachJSON.filters;
        let outreachTypes = outreachJSON.outreach_type;
        let outreachTypeKeys = Object.keys(outreachTypes);
        for (let i = 0; i < outreachTypeKeys.length; i++) {
          let filterOp = outreachTypes[outreachTypeKeys[i]];
          if (filterOp) {
            outreachTypeArray.push(filterOp);
          }
        }

        for (let i = 0; i < data.length; i++) {
          let obj = data[i];
          let filterOp = outreachTypes[obj.category];
          obj.filterOptions = [];

          if (filterOp && filterOp.id) {
            obj.filterOptions.push(filterOp.id);
            obj.outreach_type = filterOp.label;
            obj.imagePath = filterOp.imagePath;
          }

          if (obj.funding) {
            for (let k = 0; k < obj.funding.length; k++) {
              obj.filterOptions.push(obj.funding[k]);
              if (!projectArray.find(temp => temp.id === obj.funding[k])) {
                let temp = {
                  "id": obj.funding[k] + "",
                  "label": outreachJSON.funding[obj.funding[k]] ? outreachJSON.funding[obj.funding[k]].label + "" : obj.funding[k] + "",
                  "order": outreachJSON.funding[obj.funding[k]] ? outreachJSON.funding[obj.funding[k]].order : outreachJSON.funding["default"].order + k
                }
                projectArray.push(temp);
              }
            }
          }

          if (obj.files) {
            for (let k = 0; k < obj.files.length; k++) {
              if (obj.files[k]) {
                obj.files[k].imagePath = outreachJSON.file_formats[obj.files[k].format] ? outreachJSON.file_formats[obj.files[k].format].imagePath : outreachJSON.file_formats.default.imagePath
                obj.files[k].label = outreachJSON.file_types[obj.files[k].type] ? outreachJSON.file_types[obj.files[k].type].label : outreachJSON.file_types.default.label
              }
            }
          }

          if (obj.date) {
            let dt = new Date(obj.date);
            let yr = dt.getFullYear();
            obj.filterOptions.push(yr + "");

            if (!dateArray.find(temp => temp.id === yr + "")) {
              let temp = {
                "id": yr + "",
                "label": yr + "",
                "order": dateArray.length + 1
              }
              dateArray.push(temp);
            }
          }
        }

        let temp1 = fl.filter(obj => obj.id === "year")[0];
        if (temp1) {
          temp1.options = dateArray.sort(outreachLabelSort).map((obj, index) => { obj.order = index + 1; return obj; })
        }

        let temp2 = fl.filter(obj => obj.id === "project")[0];
        if (temp2) {
          temp2.options = [];
          temp2.options.push(...projectArray);
        }

        let temp3 = fl.filter(obj => obj.id === "outreach_type")[0];
        if (temp3) {
          temp3.options = [];
          temp3.options.push(...outreachTypeArray);
        }

        setAvailableFilters(fl);
        setOutreachItemsArray(data);
        setPageLoading(false);
        setDataStatus("No data available.");
    })
    .catch(function (error) {
      let message = "outreach api call";
      axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      setDataStatus("No data available.");
    });

  }, []);

    /**
 * Function to sort based on order.
 * @param {object} a input value.
 * @param {object} b input value.
 **/
function outreachLabelSort(a, b) {
  let dta = new Date(a.label);
  let dtb = new Date(b.label);
  if (dta > dtb) {
    return -1;
  }
  if (dtb > dta) {
    return 1;
  }
  return 0;
}

  /**
 * Function to sort based on order.
 * @param {object} a input value.
 * @param {object} b input value.
 **/
function outreachArraySort(a, b) {
  let dta = new Date(a.date);
  let dtb = new Date(b.date);
  if (dta > dtb) {
    return -1;
  }
  if (dtb > dta) {
    return 1;
  }
  return 0;
}

 /**
 * Function to sort based on order.
 * @param {object} a input value.
 * @param {object} b input value.
 **/
 function outreachArrayFilter(a) {
    let nofilterApplied = true;

    for (let i = 0; i < appliedFilters.length; i++) {
      if (appliedFilters[i] && appliedFilters[i].selected &&  appliedFilters[i].selected.length > 0) {
        nofilterApplied = false;
        for (let j = 0; j < appliedFilters[i].selected.length; j++) {
          if (a.filterOptions && a.filterOptions.length > 0) {
            if (a.filterOptions.includes(appliedFilters[i].selected[j]))
              return true;
          }
        }
      }
    }
    return nofilterApplied;
}

  const handleFilterChange = newFilter => {

    const existingFilter = appliedFilters.find(
      filter => filter.id === newFilter.id
    );

    if (
      existingFilter &&
      existingFilter.selected &&
      newFilter &&
      newFilter.selected &&
      (newFilter.selected.length || existingFilter.selected.length)
    ) {
      const otherFilters = appliedFilters.filter(
        filter => filter.id !== newFilter.id
      );

      if (newFilter.selected.length) {
        setAppliedFilters([...otherFilters, newFilter]);
      } else {
        setAppliedFilters(otherFilters);
      }
    } else if (newFilter.selected.length) {
      setAppliedFilters([...appliedFilters, newFilter]);
    }
  };

  return (
    <>
      <Helmet>
        {getTitle("outreach")}
        {getMeta("outreach")}
      </Helmet>
      <CssBaseline />
      <PageLoader pageLoading={pageLoading} />
      <DialogAlert
        alertInput={alertDialogInput}
        setOpen={(input) => {
          setAlertDialogInput({"show": input})
        }}
      />
      <div className="gg-baseline list-page-container">
        {availableFilters && availableFilters.length !== 0 && (
          <div className="list-sidebar-container">
            <div className={"list-sidebar" + (sidebar ? "" : " closed")}>
              <div className="reset-filter-btn-container">
                <Button
                  type="button"
                  className="gg-btn-blue reset-filter-btn"
                  onClick={() => {
                    if (appliedFilters.length > 0) {
                      setFilterReset(appliedFilters.length);
                    }
                  }}
                >
                  Reset Filters
                </Button>
              </div>

              <ListFilter
                availableOptions={availableFilters}
                selectedOptions={appliedFilters}
                onFilterChange={handleFilterChange}
                filterOperations={false}
                filterReset={filterReset}
                setFilterReset={setFilterReset}
              />
              <div className="reset-filter-btn-container ">
                <Button
                  type="button"
                  className="gg-btn-blue reset-filter-btn"
                  onClick={() => {
                    if (appliedFilters.length > 0) {
                      setFilterReset(appliedFilters.length);
                    }
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
        <div className="sidebar-page-outreach">
          <div class="list-mainpage-container">
            <VerticalHeading post={vertHeadHowToCite} />
            {outreachItemsArray && outreachItemsArray.length > 0 && <PanelOutreach id="Our-Papers" data={outreachItemsArray.filter(outreachArrayFilter).sort((a, b) => outreachArraySort(a, b))} />}
            {outreachItemsArray && outreachItemsArray.length === 0 && (
              <Container maxWidth="xl" className="gg-container">
                <table>
                  <tbody className="table-body">
                    <tr>
                      <td>
                        <p className="no-data-msg text-center1">{dataStatus}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Container>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Outreach;
