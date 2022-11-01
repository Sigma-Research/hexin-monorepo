import axios from 'axios'
const api = axios.create({
  // timeout: 4000000,
})

const getWorkSheetUrl = url => {
  // const isInstra =
  //   location.origin.indexOf('hexin.im') > 0 ||
  //   location.origin.indexOf('localhost') > 0 ||
  //   location.origin.indexOf('192.') > 0
  const isInstra = false

  const suffix = isInstra
    ? 'http://worksheet.hexin.im/api/'
    : 'http://worksheet.hexinedu.com/api/'
  return suffix + url
}

/**
 * @description  MD5 获取“文件”
 * @param params md5
 * @return { Promise }
 */
export const getMaterialFile = params => {
  return api.get(getWorkSheetUrl('open/content/v1/file'), { params })
}

/**
 * @description 创建（上传）“文件”
 * @param params ticket_id
 * @return { Promise }
 */
export const creatMaterialFile = data => {
  return api.post(getWorkSheetUrl('open/content/v1/file'), { data })
}

/**
 * @description 获取 oss 信息
 * @param params
 * @return { Promise }
 */
export const getFileSystemOssInfo = params => {
  return api.get(getWorkSheetUrl('open/content/v1/get_oss_info'), { params })
}
