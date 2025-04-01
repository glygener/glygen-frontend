import { getJson } from "./api";

export const getCartList = (
  id,
  type
) => {
  const queryParams = {
    id: id,
    type: type
  };
  const queryParamString = JSON.stringify(queryParams);
  const url = `/cart/list/?query=${queryParamString}`;
  return getJson(url);
};
