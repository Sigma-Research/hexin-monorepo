import HelloWorld from './index.vue';

export default {
  title: 'Example/HelloWorld',
  component: HelloWorld,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { HelloWorld },
  template:
    '<hello-world />',
});

export const 组件示例 = Template.bind({});
