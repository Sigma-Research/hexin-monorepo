import * as _ from 'lodash'
import { request } from './request'

interface IUploadOssParams {
  url: string
  data: any
  options?: any
}
const toFormData = (data: any) => {
  const form = new FormData()
  Object.keys(data).forEach((key: string) => {
    const item = data[key]
    const addItem = (item: any) => {
      if (_.isPlainObject(item)) {
        item.uid || (item.id && form.append(key, item.uid || item.id))
      } else {
        form.append(key, item)
      }
    }
    if (_.isArray(item)) {
      item.forEach(addItem)
    } else {
      addItem(item)
    }
  })
  return form
}
export const uploadOss = async (params: IUploadOssParams) => {
  return await request({
    method: 'POST',
    url: params.url,
    data: toFormData(params.data),
    // withCredentials: false,
  })
}
