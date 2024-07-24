import JsonLevelAnalysis from '../components/TitleAnalysisTools/JsonLevelAnalysis.vue';
import JsonTree from '../components/JsonTree/index.vue';
import HxTree from '../components/HxTree/index.vue';
import '../plugins/element';
import json from './json.json';
import CommonList from '../components/CommonList/index.vue'

export default {
  title: 'hexin',
}

export const ChapterAnalysisHandle = () => ({
  components: { JsonLevelAnalysis },
  template: '<JsonLevelAnalysis />',
})

export const CommonListHandle = () => ({
  components: { CommonList },
  data() { return { json, expandAll: true } },
  methods: {
    flatJson(json) {
      const result = [];
      // 递归把 children 字段打平
      function flat(node) {
        result.push(node);
        if (node.children) {
          node.children.forEach(child => flat(child));
        }
      }
      flat(json);
      return result;
    },
  },
  template: `<CommonList :nodes="flatJson(json)"/>`,
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

ChapterAnalysisHandle.story = {
  name: '标题分析组件',
}
CommonListHandle.story = {
  name: '通用列表组件',
}
JsonTreeHandle.story = {
  name: 'Json 树组件',
}
HxTreeHandle.story = {
  name: 'Hexin 树组件',
}
