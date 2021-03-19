import HelloWorld from './HelloWorld';

const components = [
    HelloWorld,
]
/**
 *
 * @param {Vue} Vue
 */
const install = Vue => {
    if (install.installed) {
        return;
    }
    components.map(component => Vue.component(component.name, component))
}
export default {
    install,
    ...components
}
export { install, components }