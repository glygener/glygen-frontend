import { getJson } from './api';

export const getSystemData = () => {
    const url = `/pages/home_init`;

    return getJson(url);
}