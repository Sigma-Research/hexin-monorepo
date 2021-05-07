import JsonLevelAnalysis from './components/TitleAnalysisTools/JsonLevelAnalysis.vue'
// import CatalogTree from './components/catalog/CatalogTree.vue'

const components = {
  JsonLevelAnalysis,
  // CatalogTree
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
