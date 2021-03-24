import * as _ from 'lodash'

export const getUrlAllParams = () => {
  const url = decodeURI(window.location.href) // 解决乱码问题
  const r: any = {}
  const query = _.split(url, '?').length > 1 ? _.split(url, '?')[1] : null
  if (!query) {
    return {}
  }
  const params = _.split(query, '&')
  _.forEach(params, (item: string) => {
    const key = _.split(item, '=')[0]
    const value = _.split(item, '=')[1]
    r[key] = value
  })
  return r
}
export const getQuery = (name: string) => {
  return getUrlAllParams()[name]
}
