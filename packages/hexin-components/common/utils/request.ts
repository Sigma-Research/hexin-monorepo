import axios, { AxiosRequestConfig } from 'axios'

type TRequestConfig = AxiosRequestConfig & {
  __retry?: number
  __host?: string
}
export const request = async (config: TRequestConfig) => {
  try {
    // let host = location.origin;
    // if (config.__host) {
    //     host = config.__host;
    // } else {
    //     host = 'http://192.168.0.219:8096';
    // }
    // config.url = /^http/.test(config.url || '')
    //     ? config.url
    //     : `${host}${config.url}`;
    const resp = await axios(config)
    if (!resp || resp.status !== 200) {
      return null
    }
    return resp.data
  } catch (e) {
    console.error('[request]', e)
    // TODO：对捕获的网络异常进行集中处理
    return null
  }
}
