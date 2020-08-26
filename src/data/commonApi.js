import { getJson} from "./api";

export const getTypeahed = (typeahedID, inputValue, limit=100) => {
    const url = `/typeahead?query={"field":"${typeahedID}","value":"${inputValue}","limit":${limit}}`;
    return getJson(url);
}

export const getCategorizedTypeahed = (typeahedID, inputValue, totalLimit=15, categorywiseLimit=5) => {
    const url = `/categorized_typeahead?query={"field":"${typeahedID}","value":"${inputValue}","total_limit":${totalLimit},"categorywise_limit":${categorywiseLimit}}`;
    return getJson(url);
}

export const getGlobalSearch = (searchTerm) => {
    const url = `/globalsearch/search?query={"term":"${searchTerm}"}`;
    return getJson(url);
}