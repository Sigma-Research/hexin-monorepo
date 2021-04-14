import JsonLevelAnalysis from '../components/TitleAnalysisTools/JsonLevelAnalysis.vue';
import '../plugins/element';

export default {
  title: 'hexin',
}

export const ChapterAnalysisHandle = () => ({
  components: { JsonLevelAnalysis },
  template: '<JsonLevelAnalysis />',
})

ChapterAnalysisHandle.story = {
  name: '标题分析组件',
}

