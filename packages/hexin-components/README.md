# vue-cli-typescript-storybook

本项目是基于 vue-cli 创建的 vue 项目，并添加了 storybook 及其 storybook-addon-vue-info 插件，以及 vue 的 Typescript 组件写法支持的配置。eslint + prettier 配置支持 vscode save autofix 

# 用法

克隆本项目到本地

## 安装依赖

```
npm install

# yarn
```

## 运行

```
npm run storybook

# yarn run storybook
```

# hexin-components 组件库用法

@yunmingchun：第一次写 Vue 组件库，有什么问题期望可以多提建议，感谢。

## 安装依赖
```
yarn add hexin-components
```
## 挂载组件库
```
const hexin = require('hexin-components');
hexin.install(Vue);
```
## 使用组件
```
const { TitleAnalysis } = require('hexin-components').components;
```