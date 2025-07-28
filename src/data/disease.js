import { getJson, postToAndGetBlob, glycanImageUrl } from "./api";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { logActivity } from "./logging";
import routeConstants from "./json/routeConstants";
import stringConstants from "./json/stringConstants";
import LineTooltip from "../components/tooltip/LineTooltip";
import HitScoreTooltip from "../components/tooltip/HitScoreTooltip";
import HitScoreTooltipBiomarker from "../components/tooltip/biomarker/HitScoreTooltip";
import { Link } from "react-router-dom";
import { GLYGEN_BUILD } from "../envVariables";
import DirectSearch from "../components/search/DirectSearch.js";
import { getProteinSearch } from '../data/protein.js';
import { axiosError } from "../data/axiosError";

function HeaderwithsameStyle(colum, colIndex) {
  return { backgroundColor: "#4B85B6", color: "white" };
}
const proteinStrings = stringConstants.protein.common;
const biomarkerStrings = stringConstants.disease.common;
const diseaseStrings = stringConstants.disease.common;


export const getDiseaseDetailDownload = (id, format, compressed, type, headers) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, format, compressed };
  const url = `/data/detail_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};

export const getDiseaseDetail = (
  id,
) => {
  const queryParams = {
    paginated_tables:[{"table_id": "publication","offset":1, "limit":200,"sort": "date","order":"desc"}]
  };

  const queryParamString = JSON.stringify(queryParams);
  const url = `/disease/detail/${id}`;
  return getJson(url);
};

export const getGlycanImageUrl = (glytoucan_id) => {
  return glycanImageUrl + glytoucan_id;
};

export const getDiseaseSectionDownload = (id, format, compressed, type, headers, section) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, section, format, compressed };
  const url = `/data/section_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};


/**
 * Gets JSON for disease search.
 * @param {object} formObject - glycan search JSON query object.
 */
export const getDiseaseSearch = formObject => {
  var json = "query=" + JSON.stringify(formObject);
  const url = "/disease/search?" + json;
  return getJson(url);
};

/**
 * Gets JSON for disease simple search.
 * @param {object} formObject - glycan simple search JSON query object.
 */
export const getDiseaseSimpleSearch = formObject => {
  var json = "query=" + JSON.stringify(formObject);
  const url = "/disease/search_simple?" + json;
  return getJson(url);
};

/**
 * Gets JSON for disease search init.
 */
export const getDiseaseInit = () => {
  const url = `/disease/search_init`;
  return getJson(url);
};


/**
 * Gets JSON for disease list.
 */
export const getDiseaseList = (
  biomarkerListId,
  offset = 1,
  limit = 20,
  sort = decodeURI("hit_score"),
  order = "desc",
  filters = []
) => {
  const queryParams = {
    id: biomarkerListId,
    offset: offset,
    sort: sort,
    limit: limit,
    order: order,
    filters: filters
  };
  const queryParamString = JSON.stringify(queryParams);
  const url = `/disease/list?query=${queryParamString}`;
  return getJson(url);
};

export const getDiseaseListDownload = (
  id,
  format,
  compressed,
  type,
  headers, 
  section, 
  filters
) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, format, compressed, filters };
  const url = `/data/list_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};


 /**
   * Function to handle protein direct search.
   **/
  const proteinSearch = (formObject) => {

    //setPageLoading(true);
    logActivity("user", "", "Performing Direct Search");
    let message = "Direct Search query=" + JSON.stringify(formObject);
    getProteinSearch(formObject)
      .then((response) => {
        if (response.data["list_id"] !== "") {
          logActivity("user", "" + ">" + response.data["list_id"], message).finally(() => {
            // setPageLoading(false);
             //const basename = GLYGEN_BASENAME === "/" ? "" : GLYGEN_BASENAME;
                  window.location =
                    //basename +
                    routeConstants.proteinList +
                    response.data["list_id"];
          });
        } else {
          let error = {
            response: {
              status: stringConstants.errors.defaultDialogAlert.id,
            },
          };
          axiosError(error, "", "No results. " + message, undefined, undefined);
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, undefined, undefined);
      });
  };


export const DISEASE_COLUMNS = [
  {
    dataField: diseaseStrings.disease_id.id,
    text: diseaseStrings.disease_id.name,
    sort: true,
    selected: true,
    headerStyle: HeaderwithsameStyle,
    formatter: (value, row) => (
      <LineTooltip text="View details">
        <Link to={routeConstants.diseaseDetail + row.disease_id}>
          {row.disease_id}
        </Link>
      </LineTooltip>
    )
  },
  {
    dataField: "recommended_name",
    text: "Recommended Name",
    sort: true,
    headerStyle: HeaderwithsameStyle
  },
  {
    dataField: "glycan_count",
    text: "Glycan Count",
    sort: true,
    headerStyle: HeaderwithsameStyle
  },
  {
    dataField: "protein_count",
    text: "Protein Count",
    sort: true,
    headerStyle: HeaderwithsameStyle,
          formatter: (value, row) => (
        <div>
          {row.protein_count}
          {" "}
          {row.protein_count > 0 && 
            <DirectSearch
              text={"Find all proteins / glycoproteins with the same disease."}
              searchType={"protein"}
              fieldType={"disease_id"}
              fieldValue={row.disease_id}
              executeSearch={proteinSearch}
            />
          }
        </div>
      )
  },
  {
    dataField: proteinStrings.hit_score.id,
    text: proteinStrings.hit_score.name,
    sort: true,
    headerStyle: HeaderwithsameStyle,
    formatter: (value, row) => (
      <>
        <HitScoreTooltip
          title={"Hit Score"}
          text={"Hit Score Formula"}
          formula={"0.1 + ∑ (Weight + 0.01 * Frequency)"}
          contributions={row.score_info && row.score_info.contributions && row.score_info.contributions.map(item => {
            return {
              c: diseaseStrings.contributions[item.c]
                ? diseaseStrings.contributions[item.c].name
                : item.c,
              w: item.w,
              f: item.f
            };
          })}
        />
        {row.hit_score}
      </>
    )
  }
];