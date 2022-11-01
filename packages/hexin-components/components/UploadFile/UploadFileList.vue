<template>
  <div>
    <div
      v-if="!list || !list.length"
      class="empty-box flex-center"
      style="height: 50px"
    >
      <span>暂无上传文件</span>
    </div>
    <template v-else>
      <UploadFileListItem
        v-for="item in list"
        :key="item.index"
        :data="item"
        :fileList="list"
        @click="deleteFile($event)"
        @move="moveFile"
      />
    </template>
  </div>
</template>

<script>
import UploadFileListItem from './UploadFileListItem'
export default {
  name: 'UploadFileList',
  components: { UploadFileListItem },
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {}
  },
  methods: {
    deleteFile(data) {
      this.$emit('delete', data)
    },
    moveFile(data, type) {
      this.$emit('move', data, type)
    },
  },
}
</script>

<style scoped></style>
