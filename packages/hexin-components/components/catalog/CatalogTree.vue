<template>
  <div class="container">
    <!-- content.level目录树区域 -->
    <div class="content-level-tree">
      <div class="title" style="display: flex; align-items: center;">
        <div class="title-words">节点导航</div>
        <div style="padding: 0px 20px">
          <el-popover placement="right" trigger="click">
            <el-form :model="replaceForm" ref="replaceForm" size="small">
              <el-form-item label="查找：" prop="find">
                <el-input v-model="replaceForm.find" />
              </el-form-item>
              <el-form-item label="替换为：" prop="replace">
                <el-input v-model="replaceForm.replace" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSubmitForm">替换</el-button>
                <el-button @click="handleResetForm">重置</el-button>
              </el-form-item>
            </el-form>
            <el-button
              slot="reference"
              type="text"
              size="small"
              style="margin-left: 10px"
              icon="el-icon-search"
            >内容替换</el-button>
          </el-popover>
        </div>
        <el-dropdown type="primay" trigger="click" placement="bottom-end" :hide-on-click="false">
          <el-button type="text" icon="el-icon-s-tools" class="title-set-up"></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="image">
              显示内容层级
              <el-switch
                v-model="settingOption.contentLevelFlag"
              ></el-switch>
            </el-dropdown-item>
            <el-dropdown-item command="text">
              显示物理层级
              <el-switch
                v-model="settingOption.nodeLevelFlag"
              ></el-switch>
            </el-dropdown-item>
            <el-dropdown-item disabled>---------------------</el-dropdown-item>
            <el-dropdown-item command="rect">
              标题层级缩进
              <el-switch
                v-model="settingOption.levelIndentFlag"
              ></el-switch>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div
        style="color: #606266; font-size: 12px; display: flex; background-color: rgb(245, 247, 250); justify-content: space-between; align-items: center;  borderLeft: 1px solid #ccc;"
      >
        <div
          v-show="settingOption.nodeLevelFlag"
          style="width:27px; padding: 5px; font-size: 12px; border: 1px solid #ccc; borderLeft: none;"
        >物理层级</div>
        <div
          v-show="settingOption.contentLevelFlag"
          style="width:27px; padding: 5px; font-size: 12px; border: 1px solid #ccc; borderLeft: none;"
        >内容层级</div>
        <div
          style="padding: 5px; flex: 14; height: 24px; border: 1px solid #ccc; border-left: none; border-right: none; display: flex; align-items: center;"
        >
          <span style="padding-right:10px">节点内容</span>
          <el-button type="text" size="small" @click="openAllHandler">全部展开</el-button>
          <el-button type="text" size="small" @click="foldAllHandler">全部折叠</el-button>
          <el-popover placement="right" trigger="click">
            <el-row>
              <el-input-number v-model="level" size="small" :min="1" :precision="0" step-strictly />
              <el-button
                type="primary"
                size="mini"
                style="marginLeft:20px"
                @click="confirmHandle"
              >确认</el-button>
            </el-row>
            <el-button slot="reference" type="text" size="small" style="margin-left: 10px">展开到具体层级</el-button>
          </el-popover>
          <div style="position: fixed; left: 440px ">
            <div style="float: left; color: #409EFF; cursor: pointer;" @click="()=>{changeAllcheckedHandle(true)}">全选</div>
            <div style="float: left; color: #409EFF; cursor: pointer; margin-left: 10px" @click="()=>{changeAllcheckedHandle(false)}">反选</div>
          </div>
        </div>
      </div>
      <div class="catalogTree">
        <VirtualList
          style="height: 670px; overflow-y: auto; width:450px; overflow-x: hidden;"
          :data-key="'_id'"
          :data-sources="Json"
          :data-component="item"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import axios from "axios";
import Component from "vue-class-component";
import { Prop, Watch, Provide } from "vue-property-decorator";
// @ts-ignore
import VirtualList from "vue-virtual-scroll-list";
import NodeItem from "./NodeItem.vue";
import { uuid } from "../../common/utils/uuid";
import { download } from "../../common/services/json";
import { TTaskDetail } from "../../common/types/task";
import { IReplaceForm, IChoiceIndex, ISettingOption, ICheckedAllJson } from "../../common/types/form";
import { TJson, TNode } from "../../common/types/json";
import q$ from "../../common/utils/queue";
import { deepClone } from "../../common/utils/json";
import mock from "./mock"

@Component({
  components: {
    VirtualList,
    NodeItem
  }
})
export default class TaskCataTree extends Vue {
  // 传入的Json数据
  @Prop({
    default: () => {
      return mock
    }
  }) public taskJson: TNode[];
  // 选中的Json数据
  @Prop({
    default: () => {
      return []
    }
  }) public checkedJson: TNode[];
  // 扁平化Json
  public flattenJson: TNode[] = [];
  // 内容替换表单
  public replaceForm: IReplaceForm = {
    find: "",
    replace: ""
  };
  // 每条数据的组件
  public item: any = NodeItem;

  public level: number = 1;
  // 当前展开的数据
  public selectArr: TNode[] = [];

  public firstParent: TNode = { children: [], _selected: true, node_level: 0, _checked: true };

  public saving: boolean = false;

  public currentNode: TNode | null = null;

  public dragstartSource: TNode;

  public dragendSource: TNode;

  @Provide()
  public choiceIndex: IChoiceIndex = { value: 0 };

  @Provide()
  public checkedAllFlag: ICheckedAllJson = { value: true, update: 0 };

  @Provide()
  public settingOption: ISettingOption = {
    contentLevelFlag: true,
    nodeLevelFlag: false,
    levelIndentFlag: false
  };

  // 处理数据，数据改变驱动组件重新渲染
  // taskJson是最先获取到的Json数据，flattenJson是把taskJson扁平化之后获得列表，Json是根据level值来从flattenJson拿出一部分用来渲染页面
  public get Json() {
    const Json: TNode[] = [];
    this.flattenJson.forEach((item: TNode) => {
      if (this.selectArr.includes(item)) {
        item._selected = true;
      }
      if (!item._parent._selected) {
        item._selected = false;
      }
      if (!this.firstParent.children.length) {
        this.firstParent.children.forEach((item: TNode) => {
          Json.push(item);
        });
      }
      if (item._parent._selected === true) {
        Json.push(item);
      }
    });
    return Json;
  }

  public async mounted() {
    await this.firstFlattenJsonHandle(this.taskJson);
    this.currentNode = this.flattenJson[0];
    this.checkedJson = this.flattenJson;
  }

  // Json数据扁平化
  public firstFlattenJsonHandle(taskJson: TNode[]): void {
    taskJson.forEach((item1: TNode) => {
      if (!item1._parent) {
        this.firstParent.children.push(item1);
        item1._parent = this.firstParent;
        item1._selected = false;
        item1._checked = true;
      }
      item1.children.forEach((item2: TNode) => {
        if (!item1.content.level) {
          item2._parentLevel = "-";
          item2._selected = false;
          item2._parent = item1;
          item2._checked = true;
        } else {
          item2._parentLevel = item1.content.level + 1;
          item2._selected = false;
          item2._parent = item1;
          item2._checked = true;
        }
        if (item1.node_type !== "chapter") {
          item2._parentLevel = item1._parentLevel + 1;
          item2._selected = false;
          item2._parent = item1;
          item2._checked = true;
        }
      });
      this.flattenJson.push(item1);
      if (item1.children.length) {
        this.firstFlattenJsonHandle(item1.children);
      }
    });
  }

  // 全部展开
  public openAllHandler() {
    this.flattenJson.forEach((item: TNode) => {
      item._selected = true;
    });
    this.level = 999;
    this.flattenJson = [];
    this.flattenJsonHandle(this.taskJson);
  }

  // 全部折叠
  public foldAllHandler() {
    this.selectArr = [];
    this.flattenJson.forEach((item: TNode) => {
      item._selected = false;
    });
    this.level = 1;
    this.flattenJson = [];
    this.flattenJsonHandle(this.taskJson);
  }

  public confirmHandle() {
    this.selectArr.forEach((item: TNode) => {
      if (item.content.level >= this.level) {
        this.selectArr.splice(this.selectArr.indexOf(item), 1);
      }
    });
    this.flattenJson.forEach((item: TNode) => {
      if (!item.content.level) {
        if (this.level > 0) {
          item._selected = true;
        } else {
          item._selected = false;
        }
      }
      if (
        item.node_type === "chapter" &&
        item.content.level &&
        item.content.level < this.level
      ) {
        item._selected = true;
      }
      if (
        item.node_type === "chapter" &&
        item.content.level &&
        item.content.level >= this.level
      ) {
        item._selected = false;
      }
      if (item.node_type !== "chapter" && item._parentLevel < this.level) {
        item._selected = true;
      }
      if (item.node_type !== "chapter" && item._parentLevel > this.level) {
        item._selected = false;
      }
    });
    this.flattenJson = [];
    this.flattenJsonHandle(this.taskJson);
  }

  // 点击替换
  public handleSubmitForm() {
    const { find, replace } = this.replaceForm;
    if (!find || !replace) {
      return;
    }
    for (let i = 0; i < this.flattenJson.length; i++) {
      const item = this.flattenJson[i];
      if (item.node_name && item.node_type === "chapter") {
        const r = new RegExp(`(?<!<[^<>]*)${find}(?![^<>]*>)`, "g");
        if (r.test(item.node_name)) {
          console.log("[replace]", item.node_name, replace);
        }
        item.content = {
          ...item.content,
          body: item.content.body.replace(r, replace)
        };
        item.node_name = item.node_name.replace(r, replace);
      }
    }
  }
  // 点击重置
  public handleResetForm() {
    this.replaceForm = {
      find: "",
      replace: ""
    };
  }

  // TODO: 因为每次更改都要再次扁平化，更改为局部操作数据，优化性能
  // 再次扁平化
  public async flattenAgain(data?: any) {
    this.flattenJson = [];
    if (this.firstParent.children.length > this.taskJson.length) {
      this.taskJson = [];
      this.firstParent.children.forEach((item: TNode) => {
        this.taskJson.push(item);
      });
    }
    if (this.firstParent.children.length < this.taskJson.length) {
      this.taskJson = [];
      this.firstParent.children.forEach((item: TNode) => {
        this.taskJson.push(item);
      });
    }
    if (data && data.name === "add") {
      this.selectArr.push(data.source._parent);
    }
    await this.flattenJsonHandle(this.taskJson);
  }

  public flattenJsonHandle(taskJson: TNode[]): void {
    taskJson.forEach((item1: TNode) => {
      this.flattenJson.push(item1);
      if (item1.children.length) {
        this.flattenJsonHandle(item1.children);
      }
    });
  }

  // 获取选中展开的目录
  public selectFn(data: any) {
    if (data.select) {
      this.selectArr.push(data.node);
    } else {
      const index = this.selectArr.indexOf(data.node);
      this.selectArr.splice(index, 1);
    }
    this.selectArr = Array.from(new Set(this.selectArr));
  }

  public changeStyleFn(data: any) {
    this.choiceIndex.value = data.index;
    this.currentNode = data.source;
  }

  public changeDragstartSource(data: any) {
    this.dragstartSource = data.source;
  }

  public changeDragenterSource(data: any) {
    this.dragendSource = data.source;
  }

  public async changeDragendSource() {
    if (this.dragstartSource || this.dragendSource) {
      const startIndex = this.dragstartSource._parent.children.indexOf(
        this.dragstartSource
      );
      const endIndex = this.dragendSource._parent.children.indexOf(
        this.dragendSource
      );
      this.dragstartSource._parent.children.splice(startIndex, 1);
      this.dragendSource._parent.children.splice(
        endIndex,
        0,
        this.dragstartSource
      );
      this.dragstartSource._parent = this.dragendSource._parent;
      this.dragstartSource.content.level = this.dragendSource.content.level;
      this.flattenJson = [];
      this.taskJson = [];
      this.firstParent.children.forEach((item: TNode) => {
        this.taskJson.push(item);
      });
      this.choiceIndex.value = endIndex + 1;
      await this.flattenJsonHandle(this.taskJson);
    }
  }

  public changeAllcheckedHandle(boo: boolean) {
    this.flattenJson.forEach((item: TNode) => {
      item._checked = boo
    })
    this.checkedAllFlag.value = boo
    this.checkedAllFlag.update ++
    if(boo){
      this.checkedJson = this.flattenJson
    } else {
      this.checkedJson = []
    }
  }

  public changeCheckedJsonHandle() {
    this.checkedJson = []
    this.flattenJson.forEach((item: TNode) => {
      if(item._checked){
        this.checkedJson.push(item)
      }
    })
  }
}
</script>
<style lang="scss">
.container {
  display: flex;
  height: 750px;
  .content-preview {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    flex: 6;
    .content {
      height: 700px;
      overflow: auto;
    }
  }
  .content-level-tree {
    flex: 2;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    margin-right: 20px;
    .title {
      background-color: rgb(245, 247, 250);
      padding-left: 10px;
      color: rgb(96, 98, 102);
      .title-set-up {
        color: rgb(96, 98, 102);
        margin-left: 200px;
      }
      .title-words {
        font-size: 14px;
      }
    }
  }
}

.catalogTree {
  width: 450px;
}
.act-drag-item {
  border-color: #ccc;
  background: #dae1e8;
}
</style>