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

### 标题分析组件: 

## 组件使用
```
<!-- 标题分析组件 -->
const { JsonLevelAnalysis } = require('hexin-components').components;

<template>
  <!-- Json属性: 需要分析的Json树状结构 -->
  <JsonLevelAnalysis :Json="Json" />
</template>
```
## 组件props
Json  ----------  渲染标题分析表格的所有Json数据
hide  ----------  是否渲染标题分析的头部文字
selectItem  ----------  如果有选择需求，把树结构打平成列表，把选中的item放在数组中，树结构和列表需要有唯一标识




