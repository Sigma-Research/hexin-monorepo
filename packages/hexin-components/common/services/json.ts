import { request } from '../utils/request';

export const download = (url: string) => {
    if (!url) {
        return null;
    }
    return request({
        url: `${url}?t=${new Date().getTime()}`,
        method: 'GET',
        responseType: 'json',
    });
};
