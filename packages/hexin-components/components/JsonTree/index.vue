<template>
  <div>
    <RecycleScroller
      class="scroller"
      :items="list"
      :item-size="34"
      key-field="node_id"
      v-slot="{ item }"
      v-if="list.length"
      v-loading="loading"
    >
      <div
        class="item-style flex-center"
        style="justify-content: space-between"
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
            <div class="item-inner flex-center" @click="closeChapter(item)">
              <div class="icon-box flex-center">
                <i
                  class="el-icon-caret-bottom"
                  v-if="
                    item.node_type === 'chapter' &&
                    item.children.filter((item) => item.node_type === 'chapter')
                      .length &&
                    isChapterTree &&
                    item.children.length
                  "
                  :class="{ 'closed-node': item.closed }"
                ></i>
                <i class="no-chapter-children" v-else></i>
              </div>
              <div
                class="content-box"
                :class="{ 'act-node': actNode === item.node_id }"
              >
                <slot name="content">
                  <div class="style-tool-chapter-self">
                    <span
                      v-if="item.node_type === 'question'"
                      style="color: #409eff"
                      >题</span
                    >
                    <span
                      v-if="item.node_type === 'paragraph'"
                      style="color: #e6a23c"
                      >段</span
                    >
                    <span
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
            :class="{ 'act-node': actNode === item.node_id }"
            v-if="showCheckbox || showCreatebox"
          >
            <slot name="operation">
              <div
                v-if="
                  showCheckbox && !showCreatebox && item.node_type === 'chapter'
                "
                class="flex-center"
              >
                <el-checkbox
                  v-model="item.checked"
                  @change="checkChange($event, item)"
                />
              </div>
              <div
                v-if="showCreatebox && item.node_type === 'chapter'"
                @click.stop="() => {}"
              >
                <div class="flex-center">
                  <div
                    class="text-center bold"
                    style="min-width: 100px; margin: 2px"
                  >
                    <div
                      v-if="item._status === 0"
                      class="flex-center"
                      style="
                        background: rgb(228, 241, 253);
                        height: 30px;
                        justify-content: space-between;
                      "
                      @click.stop="nodeStatusChange(item, 0)"
                    >
                      <div
                        style="
                          width: 18px;
                          height: 18px;
                          border: 2px solid #aaa;
                          border-radius: 5px;
                          margin-left: 10px;
                        "
                      ></div>
                      <div style="color: rgb(43, 120, 228); width: 74px">
                        待选择
                      </div>
                    </div>
                    <div
                      v-else-if="item._status === 1"
                      class="flex-center"
                      style="
                        background: rgb(191, 220, 181);
                        height: 30px;
                        justify-content: space-between;
                      "
                      @click.stop="nodeStatusChange(item, 1)"
                    >
                      <div
                        class="flex-center bold"
                        style="
                          width: 20px;
                          height: 20px;
                          border-radius: 5px;
                          margin-left: 10px;
                          background: rgb(58, 120, 32);
                          color: #fff;
                          font-size: 12px;
                          font-weight: 900;
                        "
                      >
                        <i class="el-icon-check"></i>
                      </div>
                      <div style="color: rgb(58, 120, 32); width: 74px">
                        制作
                      </div>
                    </div>
                    <div
                      v-else-if="item._status === 2"
                      class="flex-center"
                      style="
                        background: rgb(241, 224, 223);
                        height: 30px;
                        justify-content: space-between;
                      "
                      @click.stop="nodeStatusChange(item, 2)"
                    >
                      <div
                        class="flex-center bold"
                        style="
                          width: 20px;
                          height: 20px;
                          border-radius: 5px;
                          margin-left: 10px;
                          background: #f56c6c;
                          color: #fff;
                          font-size: 12px;
                          font-weight: 900;
                        "
                      >
                        <i class="el-icon-minus"></i>
                      </div>
                      <div style="color: #f56c6c; width: 74px">不制作</div>
                    </div>
                    <div
                      v-else-if="item._status === 3"
                      class="flex-center"
                      style="
                        background: rgb(235, 244, 233);
                        height: 30px;
                        justify-content: space-between;
                      "
                      @click.stop="nodeStatusChange(item, 3)"
                      @mouseenter="nodeMouseEnter(item)"
                      @mouseleave="nodeMouseLeave(item)"
                    >
                      <div
                        class="flex-center bold"
                        style="
                          width: 20px;
                          height: 20px;
                          border-radius: 5px;
                          background: rgb(146, 196, 126);
                          color: #fff;
                          font-size: 12px;
                          font-weight: 900;
                          margin-left: 10px;
                        "
                      ></div>
                      <div
                        style="
                          color: rgb(146, 196, 126);
                          font-size: 12px;
                          transform: scale(0.833333);
                          width: 74px;
                        "
                      >
                        <span v-if="item._currentFlag">父节点已选择</span>
                      </div>
                    </div>
                    <div
                      v-else-if="item._status === 4"
                      class="flex-center"
                      style="
                        background: rgb(252, 241, 230);
                        height: 30px;
                        justify-content: space-between;
                      "
                      @click.stop="nodeStatusChange(item, 4)"
                      @mouseenter="nodeMouseEnter(item)"
                      @mouseleave="nodeMouseLeave(item)"
                    >
                      <div
                        class="flex-center bold"
                        style="
                          width: 20px;
                          height: 20px;
                          border-radius: 5px;
                          background: rgb(243, 180, 108);
                          color: #fff;
                          font-size: 12px;
                          font-weight: 900;
                          margin-left: 10px;
                        "
                      ></div>
                      <div
                        style="
                          color: rgb(243, 180, 108);
                          font-size: 12px;
                          transform: scale(0.833333);
                          width: 74px;
                        "
                      >
                        <span v-if="item._currentFlag">子节点已选择</span>
                      </div>
                    </div>
                    <div
                      v-else-if="item._status === 5"
                      class="flex-center disabled"
                      style="
                        background: #ccc;
                        height: 30px;
                        justify-content: space-between;
                      "
                    >
                      <div
                        class="flex-center bold"
                        style="
                          width: 20px;
                          height: 20px;
                          border-radius: 5px;
                          margin-left: 10px;
                          background: #444;
                          color: #fff;
                          font-size: 12px;
                          font-weight: 900;
                        "
                      >
                        <i class="el-icon-lock"></i>
                      </div>
                      <div style="color: #444; width: 74px">
                        <span>已创建</span>
                      </div>
                    </div>
                    <div
                      v-else-if="item._status === 6"
                      class="flex-center"
                      style="
                        background: rgb(191, 220, 181);
                        height: 30px;
                        justify-content: space-between;
                      "
                      @click.stop="nodeStatusChange(item, 6)"
                    >
                      <div
                        class="flex-center bold"
                        style="
                          width: 20px;
                          height: 20px;
                          border-radius: 5px;
                          margin-left: 10px;
                          background: rgb(58, 120, 32);
                          color: #fff;
                          font-size: 12px;
                          font-weight: 900;
                        "
                      >
                        <i class="el-icon-check"></i>
                      </div>
                      <div style="color: rgb(58, 120, 32); width: 74px">
                        单独制作
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </RecycleScroller>
    <div v-else class="empty flex-center">暂无数据</div>
  </div>
</template>

<script>
import _cloneDeep from 'lodash/cloneDeep'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import katex from 'katex'
import { iterateNode } from '../../common/utils/tree'
import 'katex/dist/katex.min.css'

export default {
  name: 'JsonCatalogTree',
  components: {
    RecycleScroller,
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
    showCreatebox: {
      // 是否展示 createbox
      type: Boolean,
      default: false,
    },
    createdData: {
      // 已创建任务的 JSON 数据
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      flattenJson: [],
      actNode: '',
      riginalDataMap: new Map(),
      loading: false,
    }
  },
  watch: {
    data() {
      this.init()
    },
    expandAll() {
      this.init()
    },
    checkAll(val) {
      this.flattenJson.forEach((node) => {
        node.checked = val
      })
    },
  },
  computed: {
    list() {
      if (this.isChapterTree) {
        return this.flattenJson
          .filter((item) => item.node_type === 'chapter')
          .filter((node) => !node.path.some((item) => item.closed))
      }
      return this.flattenJson.filter(
        (node) => !node.path.some((item) => item.closed),
      )
    },
  },
  async created() {
    this.init()
  },
  methods: {
    init() {
      const list = []
      const json = _cloneDeep(this.data)
      for (const { node, parent } of iterateNode(json)) {
        node.node_parent_id = parent.node_id ? parent.node_id : ''
        this.riginalDataMap.set(node.node_id, _cloneDeep(node))
        node.parent = parent ? parent : ''
        node.closed = !this.expandAll
        node.path = parent.path ? [...parent.path, parent] : []
        if (this.showCheckbox) {
          node.checked = this.checkAll
        }
        if (
          !this.checkAll &&
          this.checkedKeys &&
          (this.checkedKeys.includes(node.node_id) ||
            node.path.some((item) => this.checkedKeys.includes(item.node_id)))
        ) {
          node.checked = true
        }
        if (this.showCreatebox) {
          node._children = node.children.filter(
            (sub) => sub.node_type === 'chapter',
          )
          if (!node._status) {
            node._status = 0
          }
          node._currentFlag = false
          node._isActive = false
          if (this.createdData.includes(node.node_id)) {
            node._status = 5
            for (const { node } of iterateNode(node._children)) {
              this.$set(node, '_status', 5)
            }
            if (parent.node_id) {
              this.$set(parent, '_status', 4)
            }
          }
        }
        list.push(node)
      }
      this.flattenJson = list
    },
    paddingLeft(node) {
      let { content: { level } } = node;
      if (node.node_type !== 'chapter') {
        let parent = node.parent;
        while (parent && parent.node_type !== 'chapter') {
          parent = parent.parent;
        }
        if (parent) {
          level = parent.content.level + 1;
        }
      }
      return {
        'padding-left': 18 * (level - 1) + 'px',
        'min-width': `calc(100% - ${
          this.showCheckbox || this.showCreatebox ? '100px' : '0px'
        })`,
        'max-width': `calc(100% - ${
          this.showCheckbox || this.showCreatebox ? '100px' : '0px'
        })`,
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
      this.$emit('node-click', this.riginalDataMap.get(item.node_id))
      item.closed = !item.closed
    },
    checkChange(val, currItem) {
      this.flattenJson.forEach((node) => {
        if (node.path.some((item) => item.node_id === currItem.node_id)) {
          node.checked = val
        }
      })
      const node_ids = this.flattenJson
        .filter((item) => item.checked && item.node_type === 'chapter')
        .map((item) => item.node_id)
      this.$emit(
        'check-change',
        this.riginalDataMap.get(currItem.node_id),
        val,
        node_ids,
      )
    },
    html2text(html) {
      let el = document.createElement('div')
      el.innerHTML = html
      let text = el.innerText
      return text
    },
    nodeStatusChange(item, status) {
      switch (status) {
        case 0:
          for (const { node } of iterateNode(item._children)) {
            if (node._status === 5) {
              return this.$message.warning('请先删除已创建的任务。')
            }
          }
          this.$set(item, '_status', 1)
          for (const { node } of iterateNode(item._children)) {
            this.$set(node, '_status', 3)
          }
          if (item.parent.node_id) {
            this.$set(item.parent, '_status', 4)
          }
          break
        case 1:
          this.$set(item, '_status', 0)
          for (const { node } of iterateNode(item._children)) {
            this.$set(node, '_status', 0)
          }
          if (
            item.parent.node_id &&
            !item.parent._children.filter(
              (item) => item._status === 1 || item._status === 5,
            ).length
          ) {
            this.$set(item.parent, '_status', 0)
          }
          break
        case 2:
          this.$set(item, '_status', 3)
          for (const { node } of iterateNode(item._children)) {
            this.$set(node, '_status', 3)
          }
          break
        case 3:
          this.$set(item, '_status', 6)
          break
        case 4:
          for (const { node } of iterateNode(item._children)) {
            if (node._status === 5) {
              return this.$message.warning('请先删除已创建的任务。')
            }
          }
          this.$confirm(
            '已有子节点被标记为制作，若标记本节点则将覆盖子节点上标记，是否继续?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            },
          ).then(() => {
            this.$set(item, '_status', 1)
            for (const { node } of iterateNode(item._children)) {
              this.$set(node, '_status', 3)
            }
            if (item.parent.node_id) {
              this.$set(item.parent, '_status', 4)
            }
            this.$forceUpdate()
          })
          break
        case 6:
          this.$set(item, '_status', 2)
          for (const { node } of iterateNode(item._children)) {
            this.$set(node, '_status', 2)
          }
          break
      }
      this.updateCreatData()
      this.$forceUpdate()
    },
    updateCreatData() {
      const tasks = this.getCreatTasks()
      const isAllCreat = !this.flattenJson.filter((item) => item._status === 0)
        .length
      this.$emit('create-change', { tasks, isAllCreat })
    },
    nodeMouseEnter(item) {
      this.$set(item, '_currentFlag', true)
      this.$forceUpdate()
    },
    nodeMouseLeave(item) {
      this.$set(item, '_currentFlag', false)
      this.$forceUpdate()
    },
    getCreatTasks() {
      const { flattenJson } = this
      const res = []
      for (const item of flattenJson) {
        if (item._status === 1 || item._status === 6) {
          const name = item.path.map((i) => i.node_name).join('-')
            ? item.path.map((i) => i.node_name).join('-') + '-' + item.node_name
            : item.node_name
          res.push({
            json: this.getJsonByNodeId(item.node_id),
            name,
            _id: item.node_id,
          })
        }
      }
      return res
    },
    getJsonByNodeId(nodeId) {
      const { riginalDataMap } = this
      const cloneData = _cloneDeep(riginalDataMap)
      let preNode = cloneData.get(nodeId)
      let firstNodeIndex = 0
      if (preNode.node_parent_id && preNode.node_parent_id !== '') {
        firstNodeIndex = cloneData
          .get(preNode.node_parent_id)
          .children.filter((item) => item.node_type === 'chapter')
          .findIndex((item) => item.node_id === preNode.node_id)
      }
      // fileJson 开始点
      while (preNode.node_parent_id && preNode.node_parent_id !== '') {
        const currNode = preNode
        preNode = cloneData.get(preNode.node_parent_id)
        const pNode = []
        const currindex = preNode.children.findIndex(
          (item) => item.node_id === currNode.node_id,
        )
        if (!firstNodeIndex && currindex > 0) {
          for (let i = currindex - 1; i >= 0; i--) {
            if (preNode.children[i].node_type === 'chapter') {
              break
            }
            pNode.push(preNode.children[i])
            preNode.children.splice(i, 1)
          }
        }
        preNode.children = [...pNode, ...[currNode]]
      }
      for (const cloneItem of iterateNode(_cloneDeep([preNode]))) {
        if (cloneItem.node.node_type === 'chapter') {
          const flattenNode = this.flattenJson.find(
            (flat) => flat.node_id === cloneItem.node.node_id,
          )
          if (
            (flattenNode._status === 2 || flattenNode._status === 6) &&
            flattenNode.node_id !== nodeId
          ) {
            for (const item of iterateNode([preNode])) {
              if (item.node.node_id === cloneItem.node.node_id) {
                const parentNode = item.parent
                parentNode.children.splice(
                  parentNode.children.findIndex(
                    (slid) => slid.node_id === item.node.node_id,
                  ),
                  1,
                )
                break
              }
            }
          }
        }
      }
      return preNode
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
  },
}
</script>

<style lang="scss">
.scroller {
  .item-style {
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
            .closed-node {
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
            .style-tool-chapter-self {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .act-node {
            color: #198cff;
          }
        }
      }
      .item-operation {
        height: 100%;
        min-width: 100px;
        max-width: 100px;
      }
    }
  }
  .item-style:hover {
    color: #409eff;
    opacity: 0.8;
  }
  .empty {
    height: 100px;
    color: #aaa;
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
  .style-tool-chapter-self {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
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
</style>