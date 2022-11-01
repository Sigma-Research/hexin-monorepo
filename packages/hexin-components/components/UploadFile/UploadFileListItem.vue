<template>
  <div class="file-item flex j-between a-center">
    <span class="flex-1">
      <span v-if="data.file.type.includes('image')">
        <el-image
          v-if="data.url"
          style="width: 20px; height: 20px"
          :src="data.url"
          :preview-src-list="fileList.map(item => item.url)"
        >
        </el-image>
        <i :class="getFileIcon(data.file.name)" v-else></i>
      </span>
      <span class="icon" v-else>
        <i :class="getFileIcon(data.file.name)"></i>
      </span>
      {{ data.file.name }}
    </span>
    <span>
      <i
        class="el-icon-top fs-18 c-p m-h-5"
        @click="moveHandler(data, 'up')"
      ></i>
      <i
        class="el-icon-bottom fs-18 c-p m-h-5"
        @click="moveHandler(data, 'down')"
      ></i>
      <i class="el-icon-delete fs-18 c-p m-h-5" @click="clickHandler(data)"></i>
    </span>
    <div
      v-if="data.progress"
      :style="{ width: `${data.progress}%` }"
      class="file-progress bg-success"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    fileList: {
      type: Array,
    },
  },
  name: 'UploadFileItem',
  methods: {
    clickHandler(data) {
      this.$emit('click', data)
    },
    moveHandler(data, type) {
      this.$emit('move', data, type)
    },
    getFileIcon(fileName) {
      const type = fileName
        .split('.')
        .slice(-1)[0]
        .toLowerCase()
      switch (type) {
        case 'pdf':
          return 'fa fa-file-pdf-o fa-fw'
        case 'xlsx':
          return 'fa fa-file-excel-o fa-fw'
        case 'doc':
          return 'fa fa-file-word-o fa-fw'
        case 'docx':
          return 'fa fa-file-word-o fa-fw'
        case 'jpg':
          return 'fa fa-file-image-o fa-fw'
        case 'png':
          return 'fa fa-file-image-o fa-fw'
        case 'ppt':
          return 'fa fa-file-powerpoint-o fa-fw'
        case 'pptx':
          return 'fa fa-file-powerpoint-o fa-fw'
        default:
          return 'fa fa-file-o fa-fw'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.file {
  &-progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    transition: width 0.2s linear;
    opacity: 0.3;
    z-index: -1;
  }
  &-item {
    position: relative;
    padding: 15px;
    border: 1px solid #cdd4d9;
    border-radius: 4px;
    margin-bottom: 10px;

    z-index: 1;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
