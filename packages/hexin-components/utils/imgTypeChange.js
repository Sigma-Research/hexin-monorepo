// 把 image 转换为 canvas对象
function imgToCanvas(image) {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  canvas.getContext('2d').drawImage(image, 0, 0)
  return canvas
}

// canvas转换为image
function canvasToImg(canvas, type = 'jpeg') {
  return new Promise(resolve => {
    canvas.toBlob(image => {
      resolve(image)
    }, `image/${type}`)
  })
}

// 获取图片信息
function getImg(fn, file) {
  return new Promise(resolve => {
    const imgFile = new FileReader()
    // 使用FileReader来把文件读入内存，并且读取文件中的数据。 readAsDataURL方法可以在浏览器主线程中异步访问文件系统，读取文件中的数据，且读取后 result 为 DataURL, DataURL 可直接 赋值给 img.src
    imgFile.readAsDataURL(file)
    imgFile.onload = function(e) {
      const image = new Image()
      image.src = e.target.result // base64数据
      image.onload = async function() {
        resolve(await fn(image))
      }
    }
  })
}

// 该方法最后拿到的结果是一个File类型的文件
async function imgTypeChange(file) {
  // 获取图片信息
  return await getImg(async function(image) {
    const imgName = file.name.split('.')[0]
    // 把image 转换为 canvas对象
    const can = imgToCanvas(image)
    // canvas转换为Bolb 类型image
    const blobImg = await canvasToImg(can, 'jpeg')
    return new Promise(resolve => {
      resolve(new File([blobImg], `${imgName}.jpg`, { type: blobImg.type }))
    })
  }, file)
}

export default imgTypeChange
