import JsonLevelAnalysis from '../components/TitleAnalysisTools/JsonLevelAnalysis.vue';
// import CatalogTree from '../components/catalog/CatalogTree.vue'
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

// export const CatalogTreeHandle = () => ({
//   components: { CatalogTree },
//   template: '<CatalogTree />',
// })

// CatalogTreeHandle.story = {
//   name: 'content.level目录树组件',
// }
