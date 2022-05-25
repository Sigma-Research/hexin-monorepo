// import TitleAnalysis from './components/TitleAnalysis/TitleAnalysis.vue'
import JsonLevelAnalysis from './components/TitleAnalysisTools/JsonLevelAnalysis.vue'
// import JsonTree from './components/JsonTree/index.vue'
import HxTree from './components/HxTree/index.vue'

const components = {
  // TitleAnalysis,
  JsonLevelAnalysis,
  // JsonTree,
  HxTree
}
/**
 *
 * @param {Vue} Vue
 */
const install = Vue => {
  if (install.installed) {
    return
  }
  Object.keys(components).map(key => {
    const component = components[key]
    Vue.component(component.name, component)
  })
  install.installed = true
}
export default {
  install,
  ...components,
}
export { install, components }
