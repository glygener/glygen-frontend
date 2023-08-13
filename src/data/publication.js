import { getJson, postToAndGetBlob } from "./api";
import { logActivity } from "../data/logging";

export const getPublicationDetail = (publId, publType) => {
  const queryParamString = JSON.stringify({
    id: publId,
    type: publType,
    paginated_tables:[{"table_id": "glycosylation_reported_with_glycan","offset":1, "limit":20,"sort": "glytoucan_ac","order":"asc"},
                      {"table_id": "glycosylation_reported","offset":1, "limit":20,"sort": "start_pos","order":"asc"},
                      {"table_id": "glycosylation_predicted","offset":1, "limit":20,"sort": "start_pos","order":"desc"},
                      {"table_id": "phosphorylation","offset":1, "limit":20,"sort": "uniprot_canonical_ac","order":"asc"},
                      {"table_id": "referenced_proteins","offset":1, "limit":20,"s1ort": "date","order":"desc"},
                      {"table_id": "referenced_glycans","offset":1, "limit":20,"s1ort": "date","order":"desc"}]
  });
  const url = `/publication/detail?query=${queryParamString}`;
  return getJson(url);
};
export const getPublicationDetailDownload = (id, format, compressed, type, headers) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, format, compressed };
  const url = `/data/detail_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};

export const getPublicationSectionDownload = (id, format, compressed, type, headers, section) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, section, format, compressed };
  const url = `/data/section_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};