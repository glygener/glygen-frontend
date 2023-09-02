import { getJson, postToAndGetBlob, glycanImageUrl } from "./api";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { logActivity } from "./logging";

export const getBiomarkerDetailDownload = (id, format, compressed, type, headers) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, format, compressed };
  const url = `/data/detail_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};

export const getBiomarkerDetail = (
  id,
) => {
  const queryParams = {
    paginated_tables:[{"table_id": "publication","offset":1, "limit":200,"sort": "date","order":"desc"}]
  };

  const queryParamString = JSON.stringify(queryParams);
  const url = `/biomarker/detail/${id}?query=${queryParamString}`;
  return getJson(url);
};

export const getGlycanImageUrl = (glytoucan_id) => {
  return glycanImageUrl + glytoucan_id;
};
