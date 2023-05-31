import { getJson, postToAndGetBlob } from "./api";
import { logActivity } from "../data/logging";

export const getPublicationDetail = (publId, publType) => {
  const queryParamString = JSON.stringify({
    id: publId,
    type: publType,
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