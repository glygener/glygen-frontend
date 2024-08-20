import axios from "axios";
import { GLYGEN_API } from "../envVariables";

/**
 * Gets JSON from REST api call.
 * @param {string} url - url for REST api call.
 * @param {string} headers - header for REST api call.
 */
export const getJson = (url, headers = {}) => {
  return axios.get(GLYGEN_API + url, {
    headers
  });
};

/**
 * Gets JSON from REST api call.
 * @param {string} url - url for REST api call.
 * @param {string} headers - header for REST api call.
 */
export const getFile = (url, headers = {}) => {
  return axios.get(url, {
    headers
  });
};

export const postTo = (url, headers = {}) => {
  const options = {
    method: "POST",
    headers: headers,
    url: GLYGEN_API + url
  };

  return axios(options);
};

export const postFormDataTo = (url, formData = {}, headers = {}, userfile) => {
  const formDataElement = new FormData();

  Object.keys(formData).forEach(key => {
    formDataElement.append(key, formData[key]);
  });

  if (userfile) {
    formDataElement.append("userfile", userfile);
  }

  const myHeaders = {
    "Content-Type": "multipart/form-data",
    ...headers
  };

  const options = {
    method: "POST",
    headers: myHeaders,
    data: formDataElement,
    url: GLYGEN_API + url
  };

  return axios(options);
};

export const postFormDataTo1 = (url, formData = {}, headers = {}) => {
  //const formDataElement = new FormData();

  // Object.keys(formData).forEach(key => {
  //   formDataElement.append(key, formData[key]);
  // });

  // const myHeaders = {
  //   "Content-Type": "multipart/form-data",
  //   ...headers
  // };

  const options = {
    method: "POST",
    headers: headers,
    data: formData,
    url: GLYGEN_API + url
  };

  return axios(options);
};

export const postToAndGetBlob = (url, headers = {}) => {
  const options = {
    method: "POST",
    headers: headers,
    url: GLYGEN_API + url,
    responseType: "blob"
  };

  return axios(options);
};

export const getPageData = (url, headers = {}) => {
  return axios.get(url, {
    responseType: 'blob',
    headers
  });
};

export const glycanImageUrl = GLYGEN_API + "/glycan/image/";

export function glycanSvgUrl(acc) {
  return GLYGEN_API + '/glycan/image_svg/' + acc;
}

export function glycanJsonUrl(acc) {
  return GLYGEN_API + '/glycan/image_metadata/' + acc;
}