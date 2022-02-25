import JsonLevelAnalysis from '../components/TitleAnalysisTools/JsonLevelAnalysis.vue';
import JsonTree from '../components/JsonTree/index.vue';
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

ChapterAnalysisHandle.story = {
  name: '标题分析组件',
}
JsonTreeHandle.story = {
  name: 'Json 树组件',
}

