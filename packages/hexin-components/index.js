import TitleAnalysis from './components/TitleAnalysis/TitleAnalysis.vue'
import JsonLevelAnalysis from './components/TitleAnalysisTools/JsonLevelAnalysis.vue'

const components = {
  TitleAnalysis,
  JsonLevelAnalysis
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
