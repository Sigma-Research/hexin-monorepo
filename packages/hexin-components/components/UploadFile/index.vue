<template>
  <div class="upload-file" v-if="componentsValid">
    <div class="trigger flex" @click="showUpload()">
      <slot name="reference"><el-button size="mini">选择文件</el-button></slot>
    </div>
    <input
      type="file"
      ref="file"
      class="file-input"
      :accept="accept"
      :multiple="multiple"
      @change="handleFileChange($event)"
    />
    <el-dialog
      width="700px"
      :visible.sync="visible"
      :append-to-body="true"
      @close="clearFileList()"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div slot="title" style="font-size: 16px">
        <slot name="title">上传文件</slot>
      </div>
      <slot name="desc"></slot>
      <div class="m-b-15">
        <span>选择文件{{ accept ? `(${accept}格式)` : '' }}：</span>
        <el-button size="mini" @click="handleUploadClick()" type="primary"
          >选择文件</el-button
        >
        <el-button
          size="mini"
          @click="uploadFiles()"
          :disabled="isFileFormatting"
          type="success"
          >上传</el-button
        >
      </div>
      <UploadFileList
        :list="fileVal"
        @delete="deleteFile($event)"
        @move="moveFile"
      />
      <div class="m-t-15">
        <slot name="footer"></slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFileMd5 } from '../../utils/uploadFileHelper'
import {
  getMaterialFile,
  creatMaterialFile,
  getFileSystemOssInfo,
} from '../../api/fileSystem'
import Oss from 'ali-oss'
import UploadFileList from './UploadFileList'
import imgTypeChange from '../../utils/imgTypeChange'

export default {
  name: 'UploadFile',
  inheritAttrs: false,
  data() {
    return {
      componentsValid: true,
      hasSlot: false,
      fileVal: [],
      showFileContainer: false,
      visible: false,
      isFileFormatting: false,
    }
  },
  components: {
    UploadFileList,
  },
  props: {
    // 是否将上传的所有图片转成 jpg 格式
    imgToJpg: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: '',
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    // ossInfo: {
    //   required: true,
    //   type: Object,
    //   default: () => {
    //     return {};
    //   }
    // }
  },
  created() {
    this.checkSlotValid()
  },
  mounted() {},
  computed: {},
  watch: {
    fileVal: {
      async handler(val) {
        if (val.length === 0) {
          this.showFileContainer = false
        }
        // 添加 md5 值
        this.isFileFormatting = true
        for (const item of val) {
          if (item.md5 === '') {
            item.md5 = await getFileMd5(item.file)
          }
        }
        this.isFileFormatting = false
      },
    },
  },
  methods: {
    checkSlotValid() {
      // 检查传递的插槽内容数量
      const slotLen = this.$slots && this.$slots.default && this.$slots.length
      if (typeof slotLen === 'undefined') {
        return
      }
      if (slotLen > 1) {
        this.componentsValid = false
        throw new Error('组件内部根元素只能存在一个')
      }
      this.hasSlot = true
    },
    handleUploadClick() {
      this.$refs.file.click()
    },
    showUpload() {
      this.visible = true
    },
    closeUpload() {
      this.visible = false
      this.fileVal = []
      this.$forceUpdate()
    },
    async handleFileChange(event) {
      let arr = Object.keys(event.target.files)
      for (const item of arr) {
        let file = event.target.files[item]
        // Tips：
        // xdoc 目前支持 jpg 格式的图片，
        // 在上传的时候转换一下格式。
        if (
          this.imgToJpg &&
          file.type.includes('image') &&
          !file.type.includes('image/jpeg')
        ) {
          file = await imgTypeChange(event.target.files[item])
        }
        arr[item] = {
          file,
          md5: '',
          status: 'init',
          progress: 0,
        }
      }
      const accepts = this.accept.split(',')
      arr = arr.filter(item => {
        const extension =
          '.' +
          item.file.name
            .split('.')
            .slice(-1)[0]
            .toLowerCase()
        if (accepts.includes(extension)) return true
        this.$message.error(`请选择以 ${this.accept} 为后缀的文件`)
        return false
      })
      if (this.multiple) {
        this.fileVal = this.fileVal.concat(arr)
      } else {
        this.fileVal = arr
      }
      this.showFileContainer = true
    },
    deleteFile(data) {
      const index = this.fileVal.findIndex(item => item === data)
      this.fileVal.splice(index, 1)
    },
    moveFile(data, type) {
      const index = this.fileVal.findIndex(item => item === data)
      if (type === 'up') {
        const prevFile = this.fileVal[index - 1]
        this.fileVal.splice(index - 1, 2, data, prevFile)
      } else {
        const nextFile = this.fileVal[index + 1]
        this.fileVal.splice(index, 2, nextFile, data)
      }
    },
    async uploadFiles() {
      const { fileVal, isFileFormatting, imgToJpg } = this
      if (isFileFormatting) {
        this.$message.warning('文件前序处理进行中')
        return
      }
      const res = await getFileSystemOssInfo({
        path_alias: 'file',
      })
      const { access_key_id, access_key_secret_id, bucket, region, key } = res
      let success = 0
      let fail = 0
      for (const item of fileVal) {
        if (item.status === 'error') {
          fail++
          continue
        }
        if (item.status !== 'success') {
          try {
            item.status = 'ing'
            item.progress = 0
            // 根据md5值向文件系统获取文件
            const material = await getMaterialFile({
              md5: item.md5,
            })
            const { path } = material
            const extension = imgToJpg
              ? 'jpg'
              : item.file.name
                  .split('.')
                  .slice(-1)[0]
                  .toLowerCase()
            if (path) {
              // 获取到
              this.$set(
                item,
                'url',
                `http://${bucket}.${region}.aliyuncs.com/${key}/${item.md5}.${extension}`,
              )
              this.$set(item, 'name', item.file.name)
              this.$set(item, 'extension', extension)
              this.$set(item, 'path', `${key}/${item.md5}.${extension}`)
              item.progress = 100
              item.status = 'success'
              success++
            } else {
              // 没获取到文件
              const client = new Oss({
                region,
                accessKeyId: access_key_id,
                accessKeySecret: access_key_secret_id,
                bucket,
              })
              await client.multipartUpload(
                `${key}/${item.md5}.${extension}`,
                item.file,
                {
                  parallel: 4,
                  partSize: 500 * 1024,
                  timeout: 4000000,
                  progress: function(p) {
                    item.progress = +(p * 100).toFixed(2)
                  },
                },
              )
              await creatMaterialFile({
                md5: item.md5,
                name: item.file.name,
                extension,
                path: `${key}/${item.md5}.${extension}`,
              })
              this.$set(
                item,
                'url',
                `http://${bucket}.${region}.aliyuncs.com/${key}/${item.md5}.${extension}`,
              )
              this.$set(item, 'name', item.file.name)
              this.$set(item, 'extension', extension)
              this.$set(item, 'path', `${key}/${item.md5}.${extension}`)
              item.status = 'success'
              success++
            }
          } catch (error) {
            fail++
            item.status = 'fail'
            item.progress = 0
          }
        }
      }
      if (!fail && success) {
        this.$message.success('上传成功！')
      } else if (fail && !success) {
        this.$message.error('上传失败！')
      } else if (fail && success) {
        this.$message.info('部分上传成功！')
      }
      this.$emit('save-file-links', fileVal)
    },
    clearFileList() {
      this.fileVal = []
    },
  },
}
</script>

<style lang="scss" scoped>
.upload-file {
  .trigger {
    .show-file {
      margin: 0px;
      border-left: none;
      min-width: auto;
      padding: 0px;
    }
  }
  .file__container {
    position: relative;
    .file__list {
      width: 600px;
      // height: 100px;
      border: 1px solid #ebeef5;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      position: absolute;
      z-index: 9999;
      background: #fff;
      top: 15px;
      border-radius: 5px;
      padding: 10px 15px;
      word-break: break-all;
      &::before {
        display: inline-block;
        position: absolute;
        content: '';
        // width: 10px;
        // height: 10px;
        border: 10px solid transparent;
        border-bottom: 10px solid #fff;
        top: -18px;
        left: 35px;
        z-index: 2001;
      }
      .list__header {
        text-align: right;
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid #bbb;
      }
      .list__body {
        max-height: 300px;
        overflow: auto;
        .file__item {
          margin: 8px 0;
          &:hover {
            background: #ecf5ff;
          }
          .icon {
            margin-right: 4px;
            width: 18px;
          }
          .name {
            width: 450px;
          }
          .progress {
            min-width: 60px;
            margin: 0 10px;
          }
          .success {
            color: #67c23a;
          }
          .ing {
            color: #409eff;
          }
          .ready {
            color: #bbb;
          }
          .op-group {
            margin-left: 15px;
            width: 16px;
            i {
              cursor: pointer;
              &:hover {
                color: #409eff;
              }
            }
          }
        }
      }
    }
  }
}
.file-input {
  display: none;
}
</style>
