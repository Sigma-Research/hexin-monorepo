<template>
  <div
    :style="{width:'100%',height:'36px',color: '#606266',fontSize: '14px',borderBottom: '1px solid #ccc', borderLeft: '1px solid #ccc', display: 'flex', borderLeft: '1px solid #ccc'}"
  >
    <div
      v-show="settingOption.nodeLevelFlag"
      :style="{ width:'27px',height:'26px',lineHeight: '26px', padding: '5px', textAlign:'center', backgroundColor: 'rgb(245, 247, 250)', borderRight:'1px solid #ccc'}"
    >{{source.node_level}}</div>
    <div
      v-show="settingOption.contentLevelFlag"
      :style="{ width:'27px',height:'26px',lineHeight: '26px', padding: '5px', textAlign:'center', backgroundColor: 'rgb(245, 247, 250)', borderRight:'1px solid #ccc'}"
    >{{level}}</div>
    <div
      @contextmenu="handleRightTap"
      class="node-style"
      @click="changeStyleHandle"
      :class="[choiceIndex.value === index ? 'active' : '',settingOption.levelIndentFlag ? nodeClass : '',dragAnimationFlag? 'drag-active': '']"
      draggable="true"
      @dragstart="dragstartHandle"
      @dragleave="dragleaveHandle"
      @dragenter="dragenterHandle"
      @dragend="dragendHandle"
    >
      <div
        
        :style="{float:'left', height:'26px', lineHeight: '26px',color: '#66b1ff', padding: '5px'}"
        @click="handleCatalogToggle"
      >
        <i v-if="source.children.length" :class="[(changSelectedStatus) ? 'el-icon-caret-bottom' : 'el-icon-caret-right']"></i>
        <i v-else style="width: 5px; height: 5px; display: inline-block; background: #ccc; margin: 4px; border-radius: 5px"></i>
      </div>
      <div class="catalog-content">
        <div v-html="handleNodeName(source)"></div>
      </div>
      <el-checkbox v-model="checkedFlag" style="margin-right: 12px; float: right" @change="changeCheckedFlagHandle"></el-checkbox>
      <div class="setting">
        <el-button
          v-if="source.node_type === 'chapter'"
          type="text"
          icon="el-icon-circle-plus-outline"
          @click="handleLevelAdd"
        ></el-button>
        <el-button
          v-if="source.node_type === 'chapter'"
          type="text"
          icon="el-icon-remove-outline"
          @click="handleLevelReduce"
        ></el-button>
        <el-button type="text" icon="el-icon-more-outline" @click="handleRightTap"></el-button>
      </div>
    </div>
    <ContextMenu
      class="c-node-tree-context-menu"
      :contextMenuVisible="contextMenuVisible"
      :source="source"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from "vue-property-decorator";
import {
  IRenameForm,
  IRenameDialogVisible,
  IChoiceIndex,
  ISettingOption,
  ICheckedAllJson
} from "../../common/types/form";
import { TNode } from "../../common/types/json";
import ContextMenu from "./ContextMenu.vue";

@Component({
  components: {
    ContextMenu
  }
})
export default class NodeItem extends Vue {
  @Prop() public index?: number;
  @Prop() public source: TNode;

  public contextMenuVisible: IRenameDialogVisible = {
    value: false,
    type: "boolean"
  };
  // 重命名 dialog 可见性
  public renameDialogVisible: boolean = false;
  // 重命名表单
  public renameForm: IRenameForm = { name: "" };

  @Inject("choiceIndex")
  public choiceIndex!: IChoiceIndex;

  @Inject("checkedAllFlag")
  public checkedAllFlag!: ICheckedAllJson;

  @Inject("settingOption")
  public settingOption!: ISettingOption;

  public changSelectedStatus: boolean = false;

  public dragAnimationFlag: boolean = false;

  public nodeClass: string = "";

  public level: string = "";

  public checkedFlag: boolean = true

  public mounted() {
    this.checkedFlag = this.source._checked
    this.changSelectedStatus = this.source._selected;
  }

  @Watch("checkedAllFlag", {deep: true})
  onCheckedAllFlagChanged() {
    this.checkedFlag = this.checkedAllFlag.value
  }

  @Watch("source", { immediate: true, deep: true })
  onSourceChanged() {
    if(!this.source.content.level){
      this.level = '-'
    } else {
      this.level = this.source.node_type === "chapter" ? this.source.content.level : this.source._parentLevel;
    }
    this.nodeClass = "level" + this.level;
  }

  public handleNodeName(data: TNode) {
    if (data.node_type === "chapter") {
      return data.content.body;
    }
    if (data.node_type === "paragraph") {
      const index = data._parent.children.findIndex(
        (i: TNode) => i._id === data._id
      );
      return `<div style="color: #E6A23C; float: left">文</div> <div style="width: 150px; height: 36px; float: left; margin-left: 10px; color: #aaa">${data.content.body}</div>`
    }
    if (data.node_type === "question") {
      const index = data._parent.children.findIndex(
        (i: TNode) => i._id === data._id
      );
      return `<div style="color: #409EFF; float: left">题</div> <div style="width: 150px; height: 36px; float: left; margin-left: 10px; color: #aaa">${data.content.body}</div>`;
    }
  }

  // 右键菜单
  public handleRightTap(e: any) {
    e.returnValue = false;
    this.contextMenuVisible.value = true;
    const $contextmenus = document.querySelectorAll(
      ".c-node-tree-context-menu"
    );
    if ($contextmenus?.length <= 0) {
      return;
    }
    $contextmenus.forEach($contextmenu => {
      ($contextmenu as any).style.top = `${e.clientY}px`;
      ($contextmenu as any).style.left = `${e.clientX + 10}px`;
    });
  }

  // 展开收起功能
  public handleCatalogToggle() {
    this.source._selected = !this.source._selected as boolean;
    this.changSelectedStatus = this.source._selected as boolean;
    (this as any).runClosest({
      vue: this,
      fn: "selectFn",
      param: { node: this.source, select: this.source._selected }
    });
  }

  public dragstartHandle() {
    (this as any).runClosest({
      vue: this,
      fn: "changeStyleFn",
      param: { index: this.index, source: this.source }
    });
    (this as any).runClosest({
      vue: this,
      fn: "changeDragstartSource",
      param: { source: this.source }
    });
  }

  public dragendHandle() {
    (this as any).runClosest({
      vue: this,
      fn: "changeDragendSource",
      param: {}
    });
  }

  public dragleaveHandle() {
    this.dragAnimationFlag = false;
  }

  public dragenterHandle() {
    this.dragAnimationFlag = true;
    (this as any).runClosest({
      vue: this,
      fn: "changeDragenterSource",
      param: { source: this.source }
    });
  }

  public changeStyleHandle() {
    (this as any).runClosest({
      vue: this,
      fn: "changeStyleFn",
      param: { index: this.index, source: this.source }
    });
  }

  public async handleLevelAdd() {
    if (!this.source.content.level) {
      this.source.content.level = 1;
    } else if (this.source.node_type === "chapter") {
      this.source.content.level++;
      await this.findAllChildren("add", this.source);
      const sourceIndex = this.source._parent.children.indexOf(this.source);
      if (
        this.source._parent.children[sourceIndex - 1] &&
        this.source.content.level ===
          this.source._parent.children[sourceIndex - 1].content.level + 1
      ) {
        this.source._parent.children.splice(sourceIndex, 1);
        this.source._parent.children[sourceIndex - 1].children.push(
          this.source
        );
        this.source._parent = this.source._parent.children[sourceIndex - 1];
      }
    }
    (this as any).runClosest({
      vue: this,
      fn: "flattenAgain"
    });
  }

  public findAllChildren(operate: string, data: TNode) {
    data.children.forEach((item: TNode) => {
      if (item.node_type === "chapter") {
        if (operate === "add") {
          item.content.level++;
        } else if (operate === "reduce") {
          item.content.level--;
        }
      } else {
        if (operate === "add") {
          item._parentLevel++;
        } else if (operate === "reduce") {
          item._parentLevel--;
        }
      }
      if (item.children.length) {
        this.findAllChildren(operate, item);
      }
    });
  }

  public handleLevelReduce() {
    if (
      !this.source.content.level ||
      (this.source.node_type === "chapter" && this.source.content.level === 1)
    ) {
      this.$message({
        message: "已经是最上层了，无法上移",
        center: true
      });
      return;
    } else {
      if (this.source.node_type === "chapter") {
        this.source.content.level--;
        this.findAllChildren("reduce", this.source);
        if (this.source.content.level === this.source._parent.content.level) {
          const sourceIndex = this.source._parent.children.indexOf(this.source);
          const parentIndex = this.source._parent._parent.children.indexOf(
            this.source._parent
          );
          this.source._parent.children.splice(sourceIndex, 1);
          this.source._parent._parent.children.splice(
            parentIndex + 1,
            0,
            this.source
          );
          this.source._parent = this.source._parent._parent;
        }
      }
    }
    (this as any).runClosest({
      vue: this,
      fn: "flattenAgain"
    });
  }

  public changeCheckedFlagHandle() {
    this.source._checked = this.checkedFlag;
    (this as any).runClosest({
      vue: this,
      fn: "changeCheckedJsonHandle"
    });
  }

}
</script>

<style lang="scss">
.level1 {
  box-sizing: border-box;
}
.level2 {
  padding-left: 20px;
  box-sizing: border-box;
}
.level3 {
  padding-left: 40px;
  box-sizing: border-box;
}
.level4 {
  padding-left: 60px;
  box-sizing: border-box;
}
.level5 {
  padding-left: 80px;
  box-sizing: border-box;
}
.level6 {
  padding-left: 100px;
  box-sizing: border-box;
}
.level7 {
  padding-left: 120px;
  box-sizing: border-box;
}
.level8 {
  padding-left: 140px;
  box-sizing: border-box;
}
.level9 {
  padding-left: 160px;
  box-sizing: border-box;
}
.level10 {
  padding-left: 180px;
  box-sizing: border-box;
}
.node-style {
  flex: 14;
  height: 36px;
  line-height: 36px;
  color: #606266;
  border-radius: 5px;
  cursor: pointer;
  text-overflow: clip;
  overflow: hidden;
}
.node-style:hover {
  background-color: #eee;
  .setting {
    display: block;
  }
}
.active {
  background-color: #eee;
}
.drag-active {
  border-top: 1px solid #66b1ff;
  border-bottom: 1px solid #66b1ff;
}
.catalog-content {
  max-width: 50%;
  overflow: hidden;
  float: left;
}
.setting {
  float: right;
  margin-right: 20px;
  display: none;
}
</style>