import { getJson, getFile } from "./api";
import { logActivity } from "./logging";
import { replaceSpecialCharacters } from "../utils/common";

/**
 * Gets JSON for typeahead.
 * @param {string} typeahedID - typeahead id.
 * @param {string} inputValue - user input.
 * @param {string} limit - total array size.
 */
export const getTypeahed = (typeahedID, inputValue, limit=100) => {
    const url = `/typeahead/typeahead?query={"field":"${typeahedID}","value":"${inputValue}","limit":${limit}}`;
    return getJson(url);
}

/**
 * Gets JSON for categorized typeahead.
 * @param {string} typeahedID - typeahead id.
 * @param {string} inputValue - user input.
 * @param {string} totalLimit - total array size.
 * @param {string} categorywiseLimit - category wise array size.
 */
export const getCategorizedTypeahed = (typeahedID, inputValue, totalLimit=15, categorywiseLimit=5) => {
    const url = `/typeahead/categorized_typeahead?query={"field":"${typeahedID}","value":"${inputValue}","total_limit":${totalLimit},"categorywise_limit":${categorywiseLimit}}`;
    return getJson(url);
}

/**
 * Gets JSON for global search query.
 * @param {string} searchTerm - search term.
 */
export const getGlobalSearch = (searchTerm) => {
    const query = { "term": searchTerm };
    const url = `/globalsearch/search?query=${JSON.stringify(query)}`;
    return getJson(url);
}

export const getFileDownload = (id, url) => {
    let message = "Downloading - ";
    logActivity("user", id, message + url);
    return getFile(url);
    // return postToAndGetBlob(url, headers);
  };