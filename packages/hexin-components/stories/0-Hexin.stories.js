import JsonLevelAnalysis from '../components/TitleAnalysisTools/JsonLevelAnalysis.vue';
import JsonTree from '../components/JsonTree/index.vue';
import HxTree from '../components/HxTree/index.vue';
import UploadFile from '../components/UploadFile/index.vue';
import '../plugins/element';
import json from './json.json';

export default {
  title: 'hexin',
}

export const ChapterAnalysisHandle = () => ({
  components: { JsonLevelAnalysis },
  template: '<JsonLevelAnalysis />',
})

export const JsonTreeHandle = () => ({
  components: { JsonTree },
  data() { return { json, expandAll: true } },
  template: '<JsonTree :data="json" :expandAll="expandAll" />',
})

export const HxTreeHandle = () => ({
  components: { HxTree },
  data() { return { json, expandAll: true, contextMenu: ['addSon', 'addSibling', 'edit', 'addLevel', 'reduceLevel', 'deleteOne', 'deleteAll'] } },
  template: '<HxTree :data="json" :showCheckbox="true" :contextMenu="contextMenu" :expandAll="expandAll" :showNodeLevel="true" :showContentLevel="true"/>',
})

export const UploadFileHandle = () => ({
  components: { UploadFile },
  data() {
    return { imgToJpg: false, accept: '.jpg', multiple: true }
  },
  template: '<UploadFile :imgToJpg="imgToJpg" :accept="accept" :multiple="multiple"/>',
})

ChapterAnalysisHandle.story = {
  name: '标题分析组件',
}
JsonTreeHandle.story = {
  name: 'Json 树组件',
}
HxTreeHandle.story = {
  name: 'Hexin 树组件',
}
