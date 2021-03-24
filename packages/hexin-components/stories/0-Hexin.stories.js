import TitleAnalysis from '../components/TitleAnalysis/TitleAnalysis.vue';
import '../plugins/element';

export default {
  title: 'hexin',
}

export const ChapterAnalysis = () => ({
  components: { TitleAnalysis },
  template: '<TitleAnalysis />',
})

ChapterAnalysis.story = {
  name: '标题分析组件',
}
