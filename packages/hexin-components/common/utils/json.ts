/**
 * 下载 Json 文件
 * @param json
 * @param name
 */
export const download = (json: any, name: string) => {
  const data =
    'data:text/json;charset=utf-8,' + encodeURIComponent(safeStringify(json))
  const $a = document.createElement('a')
  $a.setAttribute('href', data)
  $a.setAttribute('download', name)
  $a.click()
  $a.remove()
}
/**
 * deepclone
 * - 同时支持过滤掉某些节点的功能
 * - 同时支持处理某些节点的功能
 * @param o
 * @param filter
 */
export const deepClone = (
  o: any,
  options?: {
    filter?: (node?: any) => boolean
    callback?: (node: any) => any
  },
) => {
  const { filter, callback } = options || {}
  if (
    typeof o === 'string' ||
    typeof o === 'number' ||
    typeof o === 'boolean' ||
    typeof o === 'undefined'
  ) {
    return o
  }
  if (Array.isArray(o)) {
    const _arr: any[] = []
    o.forEach(item => {
      if (filter && !filter(item)) {
        return
      }
      _arr.push(deepClone(item, options))
    })
    return _arr
  }
  if (typeof o === 'object') {
    const _o: any = {}
    if (filter && !filter(o)) {
      return o
    }
    for (const key in o) {
      _o[key] = deepClone(o[key], options)
    }
    return callback ? callback(_o) : _o
  }
  return o
}
export const safeStringify = (json: any) => {
  if (typeof json === 'string') {
    return json
  }
  try {
    return JSON.stringify(json)
  } catch (e) {
    return ''
  }
}
