import SparkMD5 from 'spark-md5'
import { Message } from 'element-ui'

export const getFileMd5 = async file => {
  // 这里需要用到File的slice( )方法，以下是兼容写法
  const blobSlice = File.prototype.slice
  const chunkSize = 2097152 // 以每片2MB大小来逐次读取
  const chunks = Math.ceil(file.size / chunkSize)
  let currentChunk = 0
  const spark = new SparkMD5() // 创建sparkMD5的实例
  const fileReader = new FileReader()
  const loadNext = async () => {
    const start = currentChunk * chunkSize
    const end = start + chunkSize >= file.size ? file.size : start + chunkSize
    await fileReader.readAsBinaryString(blobSlice.call(file, start, end))
  }
  return new Promise(resolve => {
    fileReader.onload = e => {
      spark.appendBinary(e.target.result) // append array buffer
      currentChunk += 1
      if (currentChunk < chunks) {
        loadNext()
      } else {
        resolve(spark.end())
        return spark.end() // 完成计算，返回结果
      }
    }
    fileReader.onerror = () => {
      Message.error('读取文件MD5值失败！')
    }
    loadNext()
  })
}
