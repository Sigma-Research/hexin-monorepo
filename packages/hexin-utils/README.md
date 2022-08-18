# hexin-utils 工具库用法

## 安装依赖
```
yarn add hexin-utils
```
## 挂载工具库
```
import * as utils from 'hexin-utils';
```
## 使用工具库
```
import * as utils from 'hexin-utils';

// 获取学科中文名称
utils.getSubjectChineseName('chinese');

// 获取学科英文名称
utils.getSubjectEnglishName('语文');

// 获取学段中文名称
utils.getStageChineseName('primary');

// 获取学段英文名称
utils.getStageEnglishName('小学');
```