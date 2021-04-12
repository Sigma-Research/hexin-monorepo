monorpeo

packages 目录下的文件夹都是独立的 npm 包：
- hexin-components 组件库
- hexin-utils 工具库

# 如何封装组件
```
- yarn storybook
```
1. 组件代码放在 components 目录下
2. 多个组件复用/共用的代码放在 common 目录下
3. storybook 上的用例维护在 stories 目录下
# 如何上传组件
```
- yarn build
?- npm version patch // 1.0.x
?- npm version xxx // 发布测试包 1.0.x-alpah.x
- npm publish // 需要向 @yunmingchun 申请权限
```
> TODO：组件库版本规范待指定