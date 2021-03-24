import TitleAnalysis from './components/TitleAnalysis/TitleAnalysis.vue'

const components = {
  TitleAnalysis,
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
