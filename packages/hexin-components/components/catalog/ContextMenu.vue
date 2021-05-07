<template>
  <div>
    <VueContextMenu
      :class="classname"
      :show="contextMenuVisible.value"
      @update:show="(show) => (contextMenuVisible.value = show)"
    >
      <a v-if="source.node_type === 'chapter'" href="javascript:;" @click="handleEdit">编辑</a>
      <a v-if="source.node_type === 'chapter'" href="javascript:;" @click="handleAddChildren">增加子标题</a>
      <a href="javascript:;" @click="handleAddSibling">增加平级标题</a>
      <div class="line"></div>
      <!-- <a href="javascript:;" @click="handlePositionUp">位置上移</a>
      <a href="javascript:;" @click="handlePositionDown">位置下移</a> -->
      <!-- <div class="line"></div> -->
      <!-- <a v-if="source.node_type === 'chapter'" href="javascript:;" @click="handleMergeUp">向上合并</a>
      <a v-if="source.node_type === 'chapter'" href="javascript:;" @click="handleMergeDown">向下合并</a> -->
      <!-- <div v-if="source.node_type === 'chapter'" class="line"></div> -->
      <!-- <a v-if="source.node_type === 'chapter'" href="javascript:;" @click="handleLevelAdd">层级+1</a>
      <a v-if="source.node_type === 'chapter'" href="javascript:;" @click="handleLevelReduce">层级-1</a> -->
      <!-- <div v-if="source.node_type === 'chapter'" class="line"></div> -->
      <a href="javascript:;" @click="handleDelete">删除</a>
    </VueContextMenu>
    <EditDialog
      :renameDialogVisible="renameDialogVisible"
      :renameForm="renameForm"
      :source="source"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IRenameForm, IRenameDialogVisible } from "../../common/types/form";
import { TNode } from '../../common/types/json';
import { uuid } from '../../common/utils/uuid';
const { component: VueContextMenu } = require('@xunlei/vue-context-menu');
import EditDialog from './EditDialog.vue';
import EmptyChapter from './helper';

@Component({
  components: {
    VueContextMenu,
    EditDialog,
  },
})
export default class ContextMenu extends Vue {
  @Prop() public contextMenuVisible!: IRenameDialogVisible;
  @Prop() public source?: TNode;
  @Prop() public classname?: string;
  // 重命名 dialog 可见性
  public renameDialogVisible: IRenameDialogVisible = { value: false, type: 'boolean' };
  // 重命名表单
  public renameForm: IRenameForm = { name: '' };

  public handleAddChildren() {
    if (!this.source || this.source.node_type !== 'chapter') {
      return;
    }
    const nid = uuid();
    const newNode: TNode = {
      ...EmptyChapter,
      _id: nid,
      _parentLevel: this.source.content.level,
      _parent: this.source,
      content: {
        level: !this.source.content.level
          ? 1
          : this.source.content.level * 1 + 1,
        body: '<p>新增标题</p>',
      },
    };
    newNode.children = [];
    this.source.children.unshift({ ...newNode });
    (this as any).runClosest({
      vue: this,
      fn: 'flattenAgain',
    });
    this.contextMenuVisible.value = false;
  }

  public handleAddSibling() {
    if (!this.source || this.source.node_type !== 'chapter') {
      return;
    }
    const nid = uuid();
    const newNode: TNode = {
      ...EmptyChapter,
      _id: nid,
      _parentLevel: this.source.content.level,
      _parent: this.source._parent,
      content: {
        level: !this.source.content.level ? '-' : this.source.content.level * 1,
        body: '<p>新增标题</p>',
      },
    };
    newNode.children = [];
    const index = this.source._parent.children.indexOf(this.source);
    this.source._parent.children.splice(index + 1, 0, { ...newNode });
    (this as any).runClosest({
      vue: this,
      fn: 'flattenAgain',
    });
    this.contextMenuVisible.value = false;
  }

  public handleMergeUp() {
    const index = this.source._parent.children.indexOf(this.source);
    if (index > 0) {
      this.source.children.forEach((item: TNode) => {
        this.source._parent.children[index - 1].children.push(item);
      });
      this.source._parent.children.splice(index, 1);
    } else {
      return;
    }
    (this as any).runClosest({
      vue: this,
      fn: 'flattenAgain',
    });
    this.contextMenuVisible.value = false;
  }

  public handleMergeDown() {
    const index = this.source._parent.children.indexOf(this.source);
    if (index > 0 && index < this.source._parent.children.length - 1) {
      this.source.children.forEach((item: TNode) => {
        this.source._parent.children[index + 1].children.push(item);
      });
      this.source._parent.children.splice(index, 1);
    } else {
      return;
    }
    (this as any).runClosest({
      vue: this,
      fn: 'flattenAgain',
    });
    this.contextMenuVisible.value = false;
  }

  public handlePositionUp() {
    const index = this.source._parent.children.indexOf(this.source);
    if (index === 0) {
      this.$message({
        message: '已经到头啦，无法上移',
        center: true,
      });
    } else {
      this.source._parent.children.splice(index, 1);
      this.source._parent.children.splice(index - 1, 0, this.source);
    }
    (this as any).runClosest({
      vue: this,
      fn: 'flattenAgain',
    });
    this.contextMenuVisible.value = false;
  }

  public handlePositionDown() {
    const index = this.source._parent.children.indexOf(this.source);
    if (index === this.source._parent.children.length - 1) {
      this.$message({
        message: '已经到底啦，无法下移',
        center: true,
      });
    } else {
      this.source._parent.children.splice(index, 1);
      this.source._parent.children.splice(index + 1, 0, this.source);
    }
    (this as any).runClosest({
      vue: this,
      fn: 'flattenAgain',
    });
    this.contextMenuVisible.value = false;
  }

  public handleLevelAdd() {
    if (!this.source.content.level) {
      this.source.content.level = 1;
    } else if (this.source.node_type === 'chapter') {
      this.source.content.level++;
      this.findAllChildren('add', this.source);
      const sourceIndex = this.source._parent.children.indexOf(this.source);
      if (this.source._parent.children[sourceIndex - 1] && this.source.content.level === this.source._parent.children[sourceIndex - 1].content.level + 1) {
        this.source._parent.children.splice(sourceIndex, 1);
        this.source._parent.children[sourceIndex - 1].children.push(this.source);
        this.source._parent = this.source._parent.children[sourceIndex - 1];
      }
    }
    (this as any).runClosest({
      vue: this,
      fn: 'flattenAgain',
    });
    this.contextMenuVisible.value = false;
  }

  public findAllChildren(operate: string, data: TNode) {
    data.children.forEach((item: TNode) => {
      if (item.node_type === 'chapter') {
        if (operate === 'add') {
          item.content.level++;
        } else if (operate === 'reduce') {
          item.content.level--;
        }
        if (!item.children.length) {
          this.findAllChildren(operate, item);
        } else {
          return;
        }
      }
    });
  }

  public handleLevelReduce() {
    if (
      !this.source.content.level ||
      (this.source.node_type === 'chapter' && this.source.content.level === 1)
    ) {
      this.$message({
        message: '已经是最上层了，无法上移',
        center: true,
      });
      return;
    } else {
      if (this.source.node_type === 'chapter') {
        this.source.content.level--;
        this.findAllChildren('reduce', this.source);
        if (this.source.content.level === this.source._parent.content.level) {
          const sourceIndex = this.source._parent.children.indexOf(this.source);
          const parentIndex = this.source._parent._parent.children.indexOf(
            this.source._parent,
          );
          this.source._parent.children.splice(sourceIndex, 1);
          this.source._parent._parent.children.splice(
            parentIndex + 1,
            0,
            this.source,
          );
          this.source._parent = this.source._parent._parent;
        }
      }
    }
    (this as any).runClosest({
      vue: this,
      fn: 'flattenAgain',
    });
    this.contextMenuVisible.value = false;
  }

  public handleEdit() {
    this.renameForm.name = this.source.node_name;
    this.renameDialogVisible.value = true;
    this.contextMenuVisible.value = false;
  }

  public handleDelete() {
    const index = this.source._parent.children.indexOf(this.source);
    this.source._parent.children.splice(index, 1);
    this.contextMenuVisible.value = false;
    (this as any).runClosest({
      vue: this,
      fn: 'flattenAgain',
    });
  }
}
</script>

<style lang="scss">
.line{
  width: 100%;
  height: 1px;
  background: #ccc
}
</style>