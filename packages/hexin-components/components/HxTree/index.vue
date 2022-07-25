<template>
  <div class="hexin-tree" style="height: 100%; overflow-y: auto;">
    <RecycleScroller
      class="scroller"
      :items="list"
      :item-size="40"
      key-field="node_id"
      v-slot="{ item }"
      v-if="list.length"
      v-loading="loading"
      :page-mode="true"
    >
      <!-- 根节点是否可以操作 -->
      <div
        class="item-style flex-center"
        style="justify-content: space-between"
        @mouseover="nodeEvent(item, 'mouseover')"
        @mouseleave="nodeEvent(item, 'mouseleave')"
        @contextmenu="item.node_type === 'chapter' ? handleRightTap($event, item, 'contextmenu') : ''"
        :draggable="draggable &&
          !disableNodeKeys.includes(item.node_id) &&
          item._parent.node_type === 'chapter' && 
          ((dragType === '') || (dragType === 'chapter' && item.node_type === 'chapter') || (dragType === 'content' && item.node_type !== 'chapter'))"
        @dragstart.stop="dragstartHandle($event, item)"
        @dragover.stop="dragoverHandle($event, item)"
        @dragend.stop="dragendHandle($event)"
        @drop.stop="dropHandle"
        :class="{
          'drag': !disableNodeKeys.includes(item.node_id) && dragendNode === item,
          'drag-before': !disableNodeKeys.includes(item.node_id) && dragendNode === item && dragendType === 'before',
          'drag-after': !disableNodeKeys.includes(item.node_id) && dragendNode === item && dragendType === 'after',
          'drag-inner': !disableNodeKeys.includes(item.node_id) && dragendNode === item && item.node_type === 'chapter' && dragendType === 'inner',
          'selected': selectList.includes(item),
          'item-style-active': activeNodeId === item.node_id,
          'disable-node': disableNodeKeys.includes(item.node_id)
        }"
      >
        <div
          class="item-level flex-center"
          v-if="showNodeLevel || showContentLevel"
          @click.stop
        >
          <div
            class="node-level flex-center"
            v-if="showNodeLevel"
            :style="showContentLevel ? 'border-right: 1px solid #aaa;' : ''"
          >
            {{ item.node_level }}
          </div>
          <div class="content-level flex-center" v-if="showContentLevel">
            {{ item.content.level }}
          </div>
        </div>
        <div
          :style="getItemBoxWidth()"
          :class="[
            item._status === 1 ? 'make' : '',
            item._status === 2 || item._status === 5 ? 'nomake' : '',
            'item-box',
            'flex-center',
          ]"
        >
          <div class="item-padding" :style="paddingLeft(item)">
            <div class="item-inner flex-center" @click="nodeClick(item)">
              <div class="icon-box flex-center" @click.stop="closeChapter(item)">
                <i
                  class="el-icon-caret-bottom"
                  v-if="
                    item.children.filter((item) => isChapterTree ? item.node_type === 'chapter' : item).length
                  "
                  :class="{ '_closed-node': item._closed }"
                ></i>
                <i class="no-chapter-children" v-else></i>
              </div>
              <div
                class="content-box"
                :class="{ 'act-node': actNode === item.node_id }"
              >
                <slot name="content">
                  <div class="flex-start">
                    <div>
                      <el-checkbox
                        v-if="showCheckbox && item.node_type !== 'chapter' && item._parent.node_type === 'chapter'"
                        v-model="item._checked"
                        @click.native.stop
                        @change="checkChange"
                        :disabled="disableNodeKeys.includes(item.node_id) || !(item._parent === (selectList.length ? selectList[0]._parent : item._parent))"
                      />
                    </div>
                    <div
                      v-if="item.node_type === 'question'"
                      class="m-a-4"
                    >
                      <span v-if="item.question_type === 'material'" style="color: #909399">材</span>
                      <span v-else style="color: #409eff">题</span>
                    </div>
                    <div
                      v-if="item.node_type === 'paragraph'"
                      style="color: #e6a23c"
                      class="m-a-4"
                      >段</div
                    >
                    <div v-if="item.content.serial_number && item.question_type !== 'material'" class="m-r-2">
                      {{item.content.serial_number}}.
                    </div>
                    <div
                      class="html-render"
                      v-html="parseHtml(item.content.body)"
                    />
                  </div>
                </slot>
              </div>
            </div>
          </div>
          <div
            class="item-operation flex-center c-p"
            v-if="item._parent.node_id && hoverNodeId === item.node_id && contextMenu.length"
          >
            <!-- <el-link type="primary" class="m-r-5" :underline="false" icon="el-icon-top" @click="move(item, 'up')"/>
            <el-link type="primary" class="m-r-5" :underline="false" icon="el-icon-bottom" @click="move(item, 'down')"/> -->
            <el-link v-if="!disableNodeKeys.includes(item.node_id)" type="primary" :underline="false" icon="el-icon-more" @click="handleRightTap($event, item, 'click')"/>
            <el-link v-else disabled type="info" :underline="false" icon="el-icon-lock"/>
          </div>
        </div>
      </div>
    </RecycleScroller>
    <div v-else class="empty flex-center">暂无数据</div>
    <VueContextMenu
      class="c-node-tree-context-menu"
      :show="contextMenuVisible"
      @update:show="(show) => (contextMenuVisible = show)"
    >
      <a v-if="contextMenu.includes('addSon')" href="javascript:;" @click="handleAddChildren">增加子标题</a>
      <a v-if="contextMenu.includes('addSibling')" href="javascript:;" @click="handleAddSibling">增加平级标题</a>
      <div v-if="contextMenu.includes('addSon') || contextMenu.includes('addSibling')" class="line"></div>
      <a v-if="contextMenu.includes('edit')" href="javascript:;" @click="handleEdit">编辑</a>
      <div v-if="contextMenu.includes('edit')" class="line"></div>
      <a v-if="contextMenu.includes('quitExport')" href="javascript:;" @click="handleQuitExport">快速导入</a>
      <a v-if="contextMenu.includes('styleExport')" href="javascript:;" @click="handleStyleExport">从体例导入</a>
      <div v-if="contextMenu.includes('quitExport') || contextMenu.includes('styleExport')" class="line"></div>
      <a v-if="contextMenu.includes('addLevel')" href="javascript:;" @click="handleContentLevelAdd">升级</a>
      <a v-if="contextMenu.includes('reduceLevel')" href="javascript:;" @click="handleContentLevelReduce">降级</a>
      <div v-if="contextMenu.includes('addLevel') || contextMenu.includes('reduceLevel')" class="line"></div>
      <a v-if="contextMenu.includes('deleteOne')" href="javascript:;" @click="handleDelete('one')">删除（仅该标题）</a>
      <a v-if="contextMenu.includes('deleteAll')" href="javascript:;" @click="handleDelete('children')">删除（含子内容）</a>
      <a v-if="contextMenu.includes('delete')" href="javascript:;" @click="handleDelete()">删除</a>
    </VueContextMenu>
    <el-dialog width="500px" title="标题编辑" :visible="renameDialogVisible">
      <el-input v-model="rename" autocomplete="off" class="m-v-20"/>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="renameDialogVisible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="handleRename">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import _cloneDeep from 'lodash/cloneDeep'
import { component as VueContextMenu } from '@xunlei/vue-context-menu'
function* backIterate(list) {
  for (let i = list.length - 1; i >= 0; i -= 1) {
    yield list[i]
  }
}
function* enumerate(iterable) {
  let i = 0
  for (const item of iterable) {
    yield [item, i]
    i += 1
  }
}
function* iterateNode(
  nodes,
  {
    level = 0,
    parent = {},
    parentItem = {},
    back = false,
    order = 'pre',
    getChildren = (n) => n.children
  } = {},
) {
  const iter = back ? backIterate(nodes) : nodes // 正向or反向
  for (const [node, index] of enumerate(iter)) {
    let stop = false
    const stopIterateChildren = () => { // 停止遍历（当前节点的）子节点
      stop = true
    }
    if (order === 'pre') { // 先序 dfs
      yield { node, index, parent, siblings: nodes, level, stopIterateChildren, parentItem }
    }
    if (!stop) { // 递归遍历子节点
      const children = getChildren(node)
      if (children && children.length) {
        yield* iterateNode(children, { level: level + 1, parent: node, back, order, getChildren, parentItem: { node, index, parent, siblings: nodes, level, stopIterateChildren, parentItem } })
      }
    }
    if (order === 'post') { // 后序 dfs
      yield { node, index, parent, siblings: nodes, level }
    }
  }
}
const randomString = (n, caseInsensitive) => {
  let x = '0123456789abcdefghijklmnopqrstuvwxyz',
    y = ''
  if (!caseInsensitive) {
    x += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  }
  for (let i = 0; i < n; i++) {
    y += x[Math.floor(Math.random() * x.length)]
  }
  return y
}
const uuid = (n = 25) => {
  // 当前时间戳（hex）+ (n-5) 位随机串
  let suffix = new Date().getTime().toString(16)
  if (suffix.length > 5) {
    suffix = suffix.substring(suffix.length - 5)
  } else if (suffix.length < 5) {
    suffix = new Array(6 - suffix.length).join('0') + suffix
  }
  return randomString(n - 5, true) + suffix
}

export default {
  name: 'JsonCatalogTree',
  components: {
    RecycleScroller,
    VueContextMenu
  },
  props: {
    data: {
      // 输入的 JSON 数据
      type: Array,
      default: () => [],
    },
    expandAll: {
      // 全部展开或全部收缩
      type: Boolean,
      default: false,
    },
    expandNumber: {
      // 按层级展开
      type: Number,
      default: -1,
    },
    checkAll: {
      // 全部选中或全部不选中
      type: Boolean,
      default: false,
    },
    checkedKeys: {
      // 默认选中节点的 node_id
      type: Array,
      default: null,
    },
    isChapterTree: {
      // 是否只展示标题
      type: Boolean,
      default: false,
    },
    showNodeLevel: {
      // 是否在左侧展示 node_level
      type: Boolean,
      default: false,
    },
    showContentLevel: {
      // 是否在左侧展示 content.level
      type: Boolean,
      default: false,
    },
    showCheckbox: {
      // 是否在 operation 区域展示 checkbox
      type: Boolean,
      default: false,
    },
    contextMenu: {
      // 右键操作功能列表
      type: Array,
      default: () => { return [] },
    },
    draggable: {
      // 是否开启拖拽
      type: Boolean,
      default: true,
    },
    dragType: {
      // 拖拽模式
      type: String,
      default: '',
    },
    expandOnClickNode: {
      // 是否在点击节点的时候展开或者收缩节点
      type: Boolean,
      default: true,
    },
    disableNodeKeys: {
      // 需要 disable 的节点列表
      type: Array,
      default: () => { return [] },
    }
  },
  data() {
    return {
      flattenJson: [],
      flattenDataMap: new Map(),
      riginalDataMap: new Map(),
      actNode: '',
      loading: false,
      hoverNodeId: '',
      activeNodeId: '',
      contextMenuVisible: false,
      renameDialogVisible: false,
      currNode: null,
      rename: '',
      dragstartNode: '',
      dragendNode: '',
      dragendType: '',
      selectList: [],
    }
  },
  watch: {
    data() {
      this.selectList = []
      this.init()
      this.$forceUpdate()
    },
    expandAll() {
      this.expandNumber = 0
      this.init()
      this.$forceUpdate()
    },
    expandNumber() {
      this.init()
      this.$forceUpdate()
    },
    expandNumber() {
      this.init()
      this.$forceUpdate()
    },
    checkAll(val) {
      this.flattenJson.forEach((node) => {
        node._checked = val
      })
      this.$forceUpdate()
    }
  },
  computed: {
    list() {
      if (this.isChapterTree) {
        return this.flattenJson
          .filter((item) => item.node_type === 'chapter')
          .filter((node) => !node._path.some((item) => item._closed))
      }
      return this.flattenJson.filter(
        (node) => !node._path.some((item) => item._closed),
      )
    },
  },
  async created() {
    this.init()
  },
  methods: {
    init() {
      const list = []
      const json = _cloneDeep(this.data);
      for (const { node } of iterateNode(this.data)) {
        this.riginalDataMap.set(node.node_id, node)
      }
      this.riginalDataMap.set('root', { node_id: 'root', children: this.data, node_type: 'chapter', node_level: this.data[0].node_level - 1, content: {level: this.data[0].node_level - 1} })
      for (const { node, parent } of iterateNode(json)) {
        node._parent_id = parent.node_id ? parent.node_id : 'root'
        node._parent = parent.node_id ? parent : { node_id: 'root', children: json, _path: [], node_type: 'chapter', node_level: this.data[0].node_level - 1, content: {level: this.data[0].node_level - 1} }
        if (this.flattenDataMap.get(node.node_id)) {
          node._closed = this.flattenDataMap.get(node.node_id)._closed
        } else {
          if (this.expandNumber === -1) {
            node._closed = !this.expandAll
          } else {
            node._closed = node.node_level > this.expandNumber
          }
        }
        node._path = parent._path ? [...parent._path, parent] : []
        if (this.showCheckbox) {
          node._checked = this.checkAll
        }
        if (
          !this.checkAll &&
          this.checkedKeys &&
          (this.checkedKeys.includes(node.node_id) ||
            node._path.some((item) => this.checkedKeys.includes(item.node_id)))
        ) {
          node._checked = true
        }
        list.push(node)
        this.flattenDataMap.set(node.node_id, node)
      }
      this.flattenJson = list
    },
    paddingLeft(node) {
      let { node_level: level } = node;
      return {
        'padding-left': 18 * (level - 1) + 'px',
        'min-width': this.contextMenu.length ? 'calc(100% - 40px)' : '100%',
        'max-width': this.contextMenu.length ? 'calc(100% - 40px)' : '100%',
      }
    },
    getItemBoxWidth() { 
      let left = 0
      if (this.showNodeLevel) {
        left += 12
      }
      if (this.showContentLevel) {
        left += 12
      }
      return {
        width: `calc(100% - ${left}px)`,
      }
    },
    closeChapter(item) {
      this.$set(item, '_closed', !item._closed);
      // Todo: 研究一下为什么 $set 设置没有更新计算属性的变化
      this.flattenJson = [...this.flattenJson];
    },
    nodeClick (item) {
      if (this.expandOnClickNode) {
        this.$set(item, '_closed', !item._closed);
        // Todo: 研究一下为什么 $set 设置没有更新计算属性的变化
        this.flattenJson = [...this.flattenJson];
      }
      this.activeNodeId = item.node_id;
      if (item.node_type === 'chapter' || item._parent.node_type === 'chapter') {
        this.$emit('node-click', this.riginalDataMap.get(item.node_id));
      }
    },
    checkChange() {
      this.selectList = this.flattenJson.filter((item) => item._checked);
      this.$emit('check-change', this.selectList.map(item => this.riginalDataMap.get(item.node_id)));
    },
    html2text(html) {
      let el = document.createElement('div')
      el.innerHTML = html
      let text = el.innerText
      return text
    },
    parseHtml(html) {
      if (html.indexOf('%') >= 0 && html.indexOf('\\%') === -1) {
        // 补丁：如果字符串中有百分号，且不是 \%，则前端转换一下
        html = html.replace(/%/g, '\\%')
      }
      html = html.replace(/<[^<>]+>/g, '')
      html = html.replace(/\$\$(.*?)\$\$/gi, function (match, tex) {
        // 对公式的转换
        return katex.renderToString(tex, {
          output: 'html',
          displayMode: true,
          strict: false,
          throwOnError: false,
        })
      })
      return html
    },
    nodeEvent(item, eventName) {
      if (eventName === 'mouseleave') {
        this.hoverNodeId = '';
        return;
      } else if (eventName === 'mouseover') {
        this.hoverNodeId = item.node_id
        return;
      }
    },
    handleRightTap(e, node, eventName) {
      if (this.disableNodeKeys.includes(node.node_id)) return;
      this.currNode = node;
      this.activeNodeId = node.node_id;
      e.returnValue = false;
      this.contextMenuVisible = true;
      this.$nextTick(() => {
        const $contextmenu = document.querySelector(
          '.c-node-tree-context-menu',
        );
        if (!$contextmenu) return;
        // const container = document.querySelector('.hexin-tree');
        const maxLeft = document.body.clientWidth - $contextmenu.clientWidth;
        const maxTop = document.body.clientHeight - $contextmenu.clientHeight;
        if (eventName === 'contextmenu') {
          $contextmenu.style.top = `${e.clientY + 5 > maxTop ? maxTop - 10 : e.clientY + 5}px`;
          $contextmenu.style.left = `${e.clientX + 10 > maxLeft ? maxLeft : e.clientX + 10}px`;
          return;
        } else if (eventName === 'click') {
          $contextmenu.style.top = `${e.clientY + 5 > maxTop ? maxTop - 10 : e.clientY + 5}px`;
          $contextmenu.style.left = `${e.clientX + 10 > maxLeft ? maxLeft : e.clientX + 10}px`;
          return;
        }
      })
    },
    handleAddChildren() {
      if (!this.currNode || this.currNode.node_type !== 'chapter') {
        this.contextMenuVisible = false;
        return;
      }
      const nid = uuid();
      const newNode = {
        node_id: nid,
        node_name: '新增标题',
        node_level: this.currNode.node_level + 1,
        source_node_id: null,
        order: this.currNode.children.length,
        content: {
          level: this.currNode.node_level + 1,
          body: '<p>新增标题</p>',
        },
        children: [],
        node_type: 'chapter',
      };
      // 更新原数据
      if (typeof this.data[0].node_parent_id === 'string') newNode.node_parent_id = this.currNode.node_id;
      if (typeof this.data[0].parent_id === 'string') newNode.parent_id = this.currNode.node_id;
      if (typeof this.data[0].task_id === 'string') newNode.task_id = this.currNode.task_id;
      const riginalNewNode = _cloneDeep(newNode);
      this.riginalDataMap.get(this.currNode.node_id).children.push(riginalNewNode);
      if (this.riginalDataMap.get(this.currNode._parent_id)) {
        this.riginalDataMap.get(this.currNode._parent_id).children.forEach((item, index) => {
          if (item.order !== index + 1) this.$set(item, 'order', index + 1);
        });
      } else {
        this.data.forEach((item, index) => {
          if (item.order !== index + 1) this.$set(item, 'order', index + 1);
        });
      }
      this.riginalDataMap.set(newNode.node_id, riginalNewNode);
      // 更新目录组件
      newNode._checked = false;
      newNode._parent = this.currNode;
      newNode._path = [...this.currNode._path, this.currNode];
      newNode._closed = false;
      newNode._parent_id = this.currNode.node_id;
      const tagetIndex = this.flattenJson.findIndex(item => item.node_id === this.currNode.node_id);
      const nodeAllChildren = this.flattenJson.filter(n => n._path.some(item => item.node_id === this.currNode.node_id));
      this.flattenJson = this.flattenJson.filter(n => !(n._path.some(item => item.node_id === this.currNode.node_id)));
      this.flattenJson.splice(tagetIndex + 1, 0, newNode);
      this.flattenJson.splice(tagetIndex + 1, 0, ...nodeAllChildren);
      this.currNode.children.push(newNode);
      this.$message.success('创建成功');
      this.$emit('add-node-children', this.riginalDataMap.get(newNode.node_id), this.riginalDataMap.get(this.currNode.node_id));
      this.contextMenuVisible = false;
    },
    handleAddSibling() {
      if (!this.currNode || this.currNode.node_type !== 'chapter') {
        this.contextMenuVisible = false;
        return;
      }
      const nid = uuid();
      const newNode = {
        node_id: nid,
        node_name: '新增标题',
        node_level: this.currNode.node_level,
        source_node_id: null,
        order: this.currNode.order + 1,
        content: {
          level: this.currNode.node_level,
          body: '<p>新增标题</p>',
        },
        children: [],
        node_type: 'chapter',
      };
      // 更新原数据
      if (typeof this.data[0].node_parent_id === 'string') newNode.node_parent_id = this.currNode.node_parent_id;
      if (typeof this.data[0].parent_id === 'string') newNode.parent_id = this.currNode.parent_id;
      if (typeof this.data[0].task_id === 'string') newNode.task_id = this.currNode.task_id;
      const currNodeIndex = this.currNode._parent.children.findIndex(item => item.node_id === this.currNode.node_id);
      const riginalNewNode = _cloneDeep(newNode);
      if (this.riginalDataMap.get(this.currNode._parent_id)) {
        this.riginalDataMap.get(this.currNode._parent_id).children.splice(currNodeIndex + 1, 0, riginalNewNode);
        this.riginalDataMap.get(this.currNode._parent_id).children.forEach((item, index) => {
          if (item.order !== index + 1) this.$set(item, 'order', index + 1);
        });
      } else {
        this.data.splice(currNodeIndex + 1, 0, newNode);
        this.data.forEach((item, index) => {
          if (item.order !== index + 1) this.$set(item, 'order', index + 1);
        });
      }
      this.riginalDataMap.set(newNode.node_id, riginalNewNode);
      // 更新目录组件
      newNode._parent = this.currNode._parent;
      newNode._path = [...this.currNode._path];
      newNode._closed = false;
      newNode._parent_id = this.currNode._parent_id;
      const tagetIndex = this.flattenJson.findIndex(item => item.node_id === this.currNode.node_id);
      const nodeAllChildren = this.flattenJson.filter(n => n._path.some(item => item.node_id === this.currNode.node_id));
      this.flattenJson = this.flattenJson.filter(n => !(n._path.some(item => item.node_id === this.currNode.node_id)));
      this.flattenJson.splice(tagetIndex + 1, 0, newNode);
      this.flattenJson.splice(tagetIndex + 1, 0, ...nodeAllChildren);
      this.currNode._parent.children.splice(currNodeIndex + 1, 0, newNode);
      this.$message.success('创建成功');
      this.$emit('add-node-sibling', this.riginalDataMap.get(newNode.node_id), this.riginalDataMap.get(this.currNode.node_id));
      this.contextMenuVisible = false;
    },
    handleContentLevelAdd() {
      this.$set(this.currNode.content, 'level', this.currNode.content.level + 1);
      this.$set(this.riginalDataMap.get(this.currNode.node_id).content, 'level', this.currNode.content.level);
      this.$emit('content-level-add', this.riginalDataMap.get(this.currNode.node_id))
      this.contextMenuVisible = false;
    },
    handleContentLevelReduce() {
      if (this.currNode.content.level > 1) {
        this.$set(this.currNode.content, 'level', this.currNode.content.level - 1);
        this.$set(this.riginalDataMap.get(this.currNode.node_id).content, 'level', this.currNode.content.level);
        this.$emit('content-level-reduce', this.riginalDataMap.get(this.currNode.node_id))
      }
      this.contextMenuVisible = false;
    },
    move(node, type) {
      const parent = node._parent;
      // 获取打平的所有 chapter 节点
      const chapterList = this.flattenJson.filter(item => item.node_type === 'chapter');
      const index = parent.children.findIndex(n => n.node_id === node.node_id);
      if ((index > 0 && type === 'up') || (index < parent.children.length - 1 && type === 'down')) { // 在标题节点内下上下移动
        let targetNode = null;
        if (type === 'up') {
          targetNode = parent.children[index - 1];
          parent.children.splice(index - 1, 2, node, targetNode);
        } else {
          targetNode = parent.children[index + 1];
          parent.children.splice(index, 2, targetNode, node);
        }
        const nodeAllChildren = this.flattenJson.filter(n => n._path.some(item => item.node_id === node.node_id));
        this.flattenJson = this.flattenJson.filter(n => !(n._path.some(item => item.node_id === node.node_id)));
        const targetAllChildren = this.flattenJson.filter(n => n._path.some(item => item.node_id === targetNode.node_id));
        this.flattenJson = this.flattenJson.filter(n => !(n._path.some(item => item.node_id === targetNode.node_id)));
        if (type === 'up') {
          this.flattenJson.splice(this.flattenJson.findIndex(item => item === targetNode), 2, node, targetNode);
        } else {
          this.flattenJson.splice(this.flattenJson.findIndex(item => item === node), 2, targetNode, node);
        }
        this.flattenJson.splice(this.flattenJson.findIndex(item => item === targetNode) + 1, 0, ...targetAllChildren)
        this.flattenJson.splice(this.flattenJson.findIndex(item => item === node) + 1, 0, ...nodeAllChildren)
      } else if (index === 0 && type === 'up') { // 跨标题上移
        if (node.node_type !== 'chapter') {
          return this.$message('暂时不支持非标题节点跨标题移动');
        }
        const prevChapterIndex = chapterList.findIndex(item => item.node_id === parent.node_id) - 1;
        if (prevChapterIndex < 0) return this.$message('当前节点无法上移');
        const prevChapter = chapterList[prevChapterIndex];
        const levelChangeCount = prevChapter.node_level + 1 - node.node_level
        this.$set(node, 'node_level', prevChapter.node_level + 1)
        this.$set(node, '_path', [...prevChapter._path, prevChapter])
        this.$set(node, '_parent', prevChapter)
        parent.children.splice(index, 1);
        let previndex = 1;
        if (prevChapter.node_level < parent.node_level) {
          previndex = prevChapter.children.findIndex(item => item.node_id === parent.node_id) - 1;
          prevChapter.children.splice(previndex - 1, 0, node);
        } else {
          previndex = prevChapter.children.length;
          prevChapter.children.splice(previndex, 0, node);
        }
        const nodeAllChildren = this.flattenJson.filter(n => n._path.some(item => item.node_id === node.node_id));
        nodeAllChildren.forEach(children => {
          this.$set(children, 'node_level', children.node_level + levelChangeCount);
          this.$set(children, '_path', [...children._parent._path, children._parent]);
        })
        this.flattenJson = this.flattenJson.filter(n => !(n._path.some(item => item.node_id === node.node_id)));
        this.flattenJson.splice(this.flattenJson.findIndex(item => item === node), 1);
        this.flattenJson.splice(this.flattenJson.findIndex(item => item === parent), 0, node);
        this.flattenJson.splice(this.flattenJson.findIndex(item => item === node) + 1, 0, ...nodeAllChildren);
      } else if (index === parent.children.length - 1 && type === 'down') { // 跨标题下移
        if (node.node_type !== 'chapter') {
          return this.$message('暂时不支持非标题节点跨标题移动');
        }
        const nextChapterIndex = chapterList.findIndex(item => item.node_id === node.node_id) + 1;
        if (nextChapterIndex > chapterList.length - 1) return this.$message('当前节点无法上移');
        const nextChapter = chapterList[nextChapterIndex];
        const levelChangeCount = nextChapter.node_level + 1 - node.node_level;
        this.$set(node, 'node_level', nextChapter.node_level + 1);
        this.$set(node, '_path', [...nextChapter._path, nextChapter]);
        this.$set(node, '_parent', nextChapter);
        parent.children.splice(index, 1);
        nextChapter.children.unshift(node);
        const nodeAllChildren = this.flattenJson.filter(n => n._path.some(item => item.node_id === node.node_id));
        nodeAllChildren.forEach(children => {
          this.$set(children, 'node_level', children.node_level + levelChangeCount);
          this.$set(children, '_path', [...children._parent._path, children._parent]);
        })
        this.flattenJson = this.flattenJson.filter(n => !(n._path.some(item => item.node_id === node.node_id)));
        this.flattenJson.splice(this.flattenJson.findIndex(item => item === node), 1);
        this.flattenJson.splice(this.flattenJson.findIndex(item => item === nextChapter) + 1, 0, node);
        this.flattenJson.splice(this.flattenJson.findIndex(item => item === node) + 1, 0, ...nodeAllChildren);
      }
    },
    handleEdit() {
      this.rename = this.currNode.node_name;
      this.renameDialogVisible = true;
      this.contextMenuVisible = false;
    },
    handleRename() {
      this.$set(this.currNode, 'node_name', this.rename);
      this.$set(this.currNode.content, 'body', `<p>${this.rename}</p>`);
      const orgNode = this.riginalDataMap.get(this.currNode.node_id);
      this.$set(orgNode, 'node_name', this.rename);
      this.$set(orgNode.content, 'body', `<p>${this.rename}</p>`);
      this.$emit('node-rename', orgNode)
      this.renameDialogVisible = false;
    },
    handleDelete(type) {
      const index = this.currNode._parent.children.indexOf(this.currNode);
      if (type === 'children') {
        this.currNode._parent.children.splice(index, 1);
        this.riginalDataMap.get(this.currNode._parent_id).children.splice(index, 1);
        this.riginalDataMap.get(this.currNode._parent_id).children.forEach((item, index) => {
          if (item.order !== index + 1) this.$set(item, 'order', index + 1)
        })
        this.flattenJson = this.flattenJson.filter(node => !(node.node_id === this.currNode.node_id || node._path.some(item => item.node_id === this.currNode.node_id)))
        this.$emit('delete-node-children', this.riginalDataMap.get(this.currNode.node_id), index)
      } else if (type === 'one') {
        if (this.currNode._parent.children.filter(item => item.node_type === 'chapter').indexOf(this.currNode) > 0) {
          const children = this.flattenJson.filter(node => node._path.some(item => item.node_id === this.currNode.node_id));
          const prevParent = this.currNode._parent.children[index - 1];
          children.forEach(node => {
            this.$set(node, '_parent', prevParent)
            this.$set(node, '_path', node._path.map(item => {
              if (item.node_id === this.currNode.node_id) {
                return prevParent
              }
              return item
            }))
          })
          this.currNode._parent.children.splice(index, 1);
          prevParent.children.splice(prevParent.length - 1, 0, children);
          // 更新原数据
          const orgChildren = this.riginalDataMap.get(this.currNode.node_id).children;
          const orgPrevParent = this.riginalDataMap.get(this.currNode._parent_id).children[index - 1];
          orgChildren.forEach(node => {
            this.$set(node, 'parent_id', orgPrevParent.node_id)
            this.$set(node, 'node_parent_id', orgPrevParent.node_id)
          })
          this.riginalDataMap.get(this.currNode._parent_id).children.splice(index, 1);
          this.riginalDataMap.get(this.currNode._parent_id).children.forEach((item, index) => {
            if (item.order !== index + 1) this.$set(item, 'order', index + 1)
          })
          orgPrevParent.children.splice(orgPrevParent.length - 1, 0, orgChildren);
          this.$emit('delete-node-one', this.riginalDataMap.get(this.currNode.node_id), index, orgPrevParent)
        } else {
          const children = this.flattenJson.filter(node => node._path.some(item => item.node_id === this.currNode.node_id));
          children.forEach(node => {
            this.$set(node, '_parent', this.currNode._parent)
            this.$set(node, 'node_level', node.node_level - 1)
            this.$set(node, '_path', node._path.filter(item => item.node_id !== this.currNode.node_id))
          })
          this.currNode._parent.children.splice(index, 1, children);
          // 更新原数据
          const orgChildren = this.riginalDataMap.get(this.currNode.node_id).children;
          orgChildren.forEach(node => {
            this.$set(node, 'parent_id', this.currNode._parent_id)
            this.$set(node, 'node_parent_id', this.currNode._parent_id)
          })
          this.riginalDataMap.get(this.currNode._parent_id).children.splice(index, 1, orgChildren);
          this.riginalDataMap.get(this.currNode._parent_id).children.forEach((item, index) => {
            if (item.order !== index + 1) this.$set(item, 'order', index + 1)
          })
          this.$emit('delete-node-one', this.riginalDataMap.get(this.currNode.node_id), index, this.riginalDataMap.get(this.currNode._parent_id))
        }
        this.flattenJson.splice(this.flattenJson.findIndex(item => item.node_id === this.currNode.node_id), 1)
      } else {
        const children = this.flattenJson.filter(node => node._path.some(item => item.node_id === this.currNode.node_id));
        if (children.length) return this.$alert('该标题含有内容，请将内容移出后重试', '', {confirmButtonText: '我知道了'});
        this.currNode._parent.children.splice(index, 1);
        // 更新原数据
        this.riginalDataMap.get(this.currNode._parent_id).children.splice(index, 1);
        this.riginalDataMap.get(this.currNode._parent_id).children.forEach((item, index) => {
          if (item.order !== index + 1) this.$set(item, 'order', index + 1)
        })
        this.$emit('delete-node', this.riginalDataMap.get(this.currNode.node_id), index, this.riginalDataMap.get(this.currNode._parent_id))
        this.flattenJson.splice(this.flattenJson.findIndex(item => item.node_id === this.currNode.node_id), 1)
      }
      this.$message.success('删除成功');
      this.contextMenuVisible = false;
    },
    dragstartHandle(e, item) {
      if (this.selectList.length) {
        this.dragstartNode = this.selectList;
      } else {
        this.dragstartNode = [item];
      }
      this.$emit('node-drag-start', e, this.dragstartNode.map(item => this.riginalDataMap.get(item.node_id)))
    },
    dropHandle(e) {
      e.preventDefault();
    },
    dragoverHandle(e, item) {
      this.dragendNode = item;
      const width = this.getContentWidth();
      if (e.offsetY < 10) {
        if (this.dragstartNode[0].node_type !== 'chapter' && item.node_type === 'chapter') {
          this.dragendType = 'inner';
        } else {
          this.dragendType = 'before';
        }
      } else {
        if (item.node_type === 'chapter' && e.offsetX > width / 4) {
          this.dragendType = 'inner';
        } else {
          if (this.dragstartNode[0].node_type !== 'chapter' && item.node_type === 'chapter') {
            this.dragendType = 'inner';
          } else {
            this.dragendType = 'after';
          }
        }
      }
      e.preventDefault();
    },
    getContentWidth () {
      const itemBox = document.querySelector('.item-box');
      return itemBox.clientWidth;
    },
    dragendHandle(e) {
      if (this.dragstartNode.some(item => this.disableNodeKeys.includes(item.node_id)) || this.disableNodeKeys.includes(this.dragendNode.node_id)) return;
      if (this.dragendType === 'after') {
        this.dragstartNode.reverse();
      }
      for (let node of this.dragstartNode) {
        const parent = node._parent.node_id ? node._parent : undefined;
        const target = this.dragendNode;
        const targetParent = this.dragendNode._parent.node_id ? this.dragendNode._parent : undefined;
        if (target === node) return this.dragendNode = '';
        if (!node || !parent || !target || !targetParent) return this.dragendNode = '';
        if (targetParent.node_type !== 'chapter') return this.dragendNode = '';
        const index = parent.children.findIndex(item => item.node_id === node.node_id);
        const targetIndex = targetParent.children.findIndex(item => item.node_id === target.node_id);
        if (this.dragendType === 'before') {
          parent.children.splice(index, 1);
          targetParent.children.splice(targetIndex - 1, 0, node);
          const levelChangeCount = targetParent.node_level + 1 - node.node_level;
          // 更新原数据
          const orgNode = this.riginalDataMap.get(node.node_id);
          this.$set(orgNode, 'parent_id', targetParent.node_id === 'root' ? '' : targetParent.node_id);
          const orgIndex = this.riginalDataMap.get(parent.node_id).children.findIndex(item => item.node_id === orgNode.node_id);
          this.riginalDataMap.get(parent.node_id).children.splice(orgIndex, 1);
          const orgTargetIndex = this.riginalDataMap.get(targetParent.node_id).children.findIndex(item => item.node_id === target.node_id);
          this.riginalDataMap.get(targetParent.node_id).children.splice(orgTargetIndex, 0, orgNode);
          this.riginalDataMap.get(parent.node_id).children.forEach((item, index) => {
            if (item.order !== index + 1) this.$set(item, 'order', index + 1)
          })
          this.riginalDataMap.get(targetParent.node_id).children.forEach((item, index) => {
            if (item.order !== index + 1) this.$set(item, 'order', index + 1)
          })
          for (const { node } of iterateNode([orgNode])) {
            const node_level = node.node_level + levelChangeCount
            this.$set(node, 'node_level', node_level);
            if (node.node_type === 'chapter') {
              this.$set(node.content, 'level', node_level);
            }
          }
          // 更新目录树
          this.$set(node, 'node_level', targetParent.node_level + 1);
          this.$set(node, '_path', [...targetParent._path, targetParent]);
          this.$set(node, '_parent', targetParent);
          const nodeAllChildren = this.flattenJson.filter(n => n._path.some(item => item.node_id === node.node_id));
          nodeAllChildren.forEach(children => {
            this.$set(children, 'node_level', children.node_level + levelChangeCount);
            this.$set(children, '_path', [...children._parent._path, children._parent]);
          })
          this.flattenJson = this.flattenJson.filter(n => !(n._path.some(item => item.node_id === node.node_id)));
          this.flattenJson.splice(this.flattenJson.findIndex(item => item === node), 1);
          this.flattenJson.splice(this.flattenJson.findIndex(item => item === target), 0, node);
          this.flattenJson.splice(this.flattenJson.findIndex(item => item === node) + 1, 0, ...nodeAllChildren);
        } else if (this.dragendType === 'inner') {
          parent.children.splice(index, 1);
          target.children.unshift(node);
          const levelChangeCount = target.node_level + 1 - node.node_level;
          // 更新原数据
          const orgNode = this.riginalDataMap.get(node.node_id);
          this.$set(orgNode, 'parent_id', target.node_id === 'root' ? '' : target.node_id);
          this.$set(orgNode, 'order', 1);
          this.riginalDataMap.get(parent.node_id).children.splice(index, 1);
          this.riginalDataMap.get(target.node_id).children.unshift(orgNode);
          this.riginalDataMap.get(parent.node_id).children.forEach((item, index) => {
            if (item.order !== index + 1) this.$set(item, 'order', index + 1)
          })
          this.riginalDataMap.get(target.node_id).children.forEach((item, index) => {
            if (item.order !== index + 1) this.$set(item, 'order', index + 1)
          })
          for (const { node } of iterateNode([orgNode])) {
            const node_level = node.node_level + levelChangeCount
            this.$set(node, 'node_level', node_level);
            if (node.node_type === 'chapter') {
              this.$set(node.content, 'level', node_level);
            }
          }
          // 更新目录树
          this.$set(node, 'node_level', target.node_level + 1);
          this.$set(node, '_path', [...target._path, target]);
          this.$set(node, '_parent', target);
          const nodeAllChildren = this.flattenJson.filter(n => n._path.some(item => item.node_id === node.node_id));
          nodeAllChildren.forEach(children => {
            this.$set(children, 'node_level', children.node_level + levelChangeCount);
            this.$set(children, '_path', [...children._parent._path, children._parent]);
          })
          this.flattenJson = this.flattenJson.filter(n => !(n._path.some(item => item.node_id === node.node_id)));
          this.flattenJson.splice(this.flattenJson.findIndex(item => item === node), 1);
          this.flattenJson.splice(this.flattenJson.findIndex(item => item === target) + 1, 0, node);
          this.flattenJson.splice(this.flattenJson.findIndex(item => item === node) + 1, 0, ...nodeAllChildren);
        } else {
          parent.children.splice(index, 1);
          targetParent.children.splice(targetIndex + 1, 0, node);
          const levelChangeCount = targetParent.node_level + 1 - node.node_level;
          // 更新原数据
          const orgNode = this.riginalDataMap.get(node.node_id);
          this.$set(orgNode, 'parent_id', targetParent.node_id === 'root' ? '' : targetParent.node_id);
          const orgIndex = this.riginalDataMap.get(parent.node_id).children.findIndex(item => item.node_id === orgNode.node_id);
          this.riginalDataMap.get(parent.node_id).children.splice(orgIndex, 1);
          const orgTargetIndex = this.riginalDataMap.get(targetParent.node_id).children.findIndex(item => item.node_id === target.node_id);
          this.riginalDataMap.get(targetParent.node_id).children.splice(orgTargetIndex + 1, 0, orgNode);
          this.riginalDataMap.get(parent.node_id).children.forEach((item, index) => {
            if (item.order !== index + 1) this.$set(item, 'order', index + 1)
          })
          this.riginalDataMap.get(targetParent.node_id).children.forEach((item, index) => {
            if (item.order !== index + 1) this.$set(item, 'order', index + 1)
          })
          for (const { node } of iterateNode([orgNode])) {
            const node_level = node.node_level + levelChangeCount
            this.$set(node, 'node_level', node_level);
            if (node.node_type === 'chapter') {
              this.$set(node.content, 'level', node_level);
            }
          }
          // 更新目录树
          this.$set(node, 'node_level', targetParent.node_level + 1);
          this.$set(node, '_path', [...targetParent._path, targetParent]);
          this.$set(node, '_parent', targetParent);
          const nodeAllChildren = this.flattenJson.filter(n => n._path.some(item => item.node_id === node.node_id));
          nodeAllChildren.forEach(children => {
            this.$set(children, 'node_level', children.node_level + levelChangeCount);
            this.$set(children, '_path', [...children._parent._path, children._parent]);
          });
          this.flattenJson = this.flattenJson.filter(n => !(n._path.some(item => item.node_id === node.node_id) || n.node_id === node.node_id));
          const targetChildren = this.flattenJson.filter(n => n._path.some(item => item.node_id === target.node_id));
          const targetLastIndex = this.flattenJson.findIndex(item => item === (targetChildren.length ? targetChildren[targetChildren.length - 1] : target));
          this.flattenJson.splice(this.flattenJson.findIndex(item => item === node), 1);
          this.flattenJson.splice(targetLastIndex + 1, 0, node);
          this.flattenJson.splice(this.flattenJson.findIndex(item => item === node) + 1, 0, ...nodeAllChildren);
        }
        this.$set(node, '_checked', false)
      }
      this.$emit('node-drag-end', e, this.dragstartNode.map(item => this.riginalDataMap.get(item.node_id)), this.riginalDataMap.get(this.dragendNode.node_id), this.dragendType);
      this.dragendNode = '';
      this.selectList = [];
      return;
    },
    handleQuitExport() {
      if (!this.currNode || this.currNode.node_type !== 'chapter') {
        this.contextMenuVisible = false;
        return;
      }
      this.$emit('quit-export', this.currNode.node_id)
      this.contextMenuVisible = false;
    },
    handleStyleExport() {
      if (!this.currNode || this.currNode.node_type !== 'chapter') {
        this.contextMenuVisible = false;
        return;
      }
      this.$emit('style-export', this.currNode.node_id)
      this.contextMenuVisible = false;
    }
  },
}
</script>

<style lang="scss" scoped>
.scroller {
  margin-bottom: 50px;
  .item-style {
    position: relative;
    &-active{
      color: #409eff;
      background-color: aliceblue;
      opacity: 0.8;
    }
    .item-level {
      margin-right: 5px;
      background: #eee;
      font-size: 12px;
      .node-level {
        min-width: 12px;
      }
      .content-level {
        min-width: 12px;
      }
    }
    .item-box {
      height: 40px;
      justify-content: space-between;
      .item-padding {
        box-sizing: border-box;
        .item-inner {
          height: 100%;
          cursor: pointer;
          justify-content: space-between;
          .icon-box {
            min-width: 14px;
            max-width: 14px;
            .el-icon-caret-bottom {
              transition: all 0.2s;
            }
            ._closed-node {
              transform: rotate(-90deg);
            }
            .no-chapter-children {
              min-width: 5px;
              max-width: 5px;
              height: 5px;
              background: rgb(204, 204, 204);
              display: inline-block;
              margin: 4px;
              border-radius: 5px;
            }
          }
          .content-box {
            width: calc(100% - 16px);
            .html-render {
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              line-clamp: 1;
              -webkit-box-orient: vertical;
            }
          }
          .act-node {
            color: #198cff;
          }
        }
      }
      .item-operation {
        margin-right: 20px;
        height: 100%;
        min-width: 40px;
        max-width: 40px;

        .el-link{
          font-size: 15px;
        }
      }
    }
  }
  .item-style:hover {
    color: #409eff;
    background-color: aliceblue;
    opacity: 0.8;
  }
  .make {
    background-color: rgb(215, 234, 210);
  }
  .nomake {
    background-color: rgb(244, 247, 246);
  }
  .disabled {
    pointer-events: none;
    cursor: default;
    opacity: 0.5;
  }
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .text-center {
    text-align: center;
  }
  .bold {
    font-weight: bold;
  }
  .html-render {
    display: inline;

    .katex-display {
      display: inline;
      margin: 0;
      text-align: initial;
    }
    .katex-display > .katex {
      display: inline;
      text-align: initial;
      white-space: normal;
    }
    .katex-display > .katex > .katex-html {
      display: inline;
    }
    .katex {
      display: inline-block;
      white-space: nowrap;
      font-size: 1em;
    }
  }
}
.line{
  width: 100%;
  height: 1px;
  background: #ccc
}
.c-node-tree-context-menu{
  font-size: 12px;
  position: fixed;
  background: #fff;
  border-radius: 3px;
  z-index: 999;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  a {
    width: 150px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    display: block;
    color: #606266;
    padding: 2px;
    text-decoration: none;
  }
  a:hover{
    background: #409EFF;
    color: #fff;
  }
}
.drag {
  background-color: aliceblue;
  &-before{
    &:before {
      content: '';
      position: absolute;
      left: 0px;
      top: 0px;
      right: 0;
      height: 5px;
      width: 100%;
      background-color: #66b1ff;
    }
  }
  &-inner{
    &:after {
      content: '';
      position: absolute;
      left: 30%;
      bottom: 0px;
      right: 0;
      height: 5px;
      width: 70%;
      background-color: #66b1ff;
    }
  }
  &-after{
    &:after {
      content: '';
      position: absolute;
      left: 0px;
      bottom: 0px;
      right: 0;
      height: 5px;
      width: 100%;
      background-color: #66b1ff;
    }
  }
}
.selected {
  background-color: rgb(253,242,231) !important;
}
.flex-start{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.disable-node{
  cursor: default !important;
  background-color: #eee !important;
  color: #aaa !important;
}
.empty {
  height: 100px;
  color: #aaa;
}
</style>