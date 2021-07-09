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
export const getPublicationDownload = (id, format, compressed, type, headers) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, type, format, compressed };
  const url = `/data/download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};
