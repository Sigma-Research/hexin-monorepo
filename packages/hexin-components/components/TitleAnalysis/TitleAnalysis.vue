<template>
  <div class="c-title-analysis">
    <div class="c-title-analysis-content">
      <el-row>
        <el-row
          class="c-title-analysis-header"
          type="flex"
          justify="space-between"
          style="margin-bottom: 20px"
        >
          <el-col>
            <span style="font-size: 14px">
              选中节点 {{ nodes.length }}/{{ plainNodes.length }} 检查结果
            </span>
            <el-button
              type="text"
              style="margin-left: 10px"
              :loading="checking"
              @click="handleCheck"
            >
              重新检查
            </el-button>
          </el-col>
          <el-col
            style="
              display: flex;
              align-items: center;
              justify-content: flex-end;
            "
          >
            <span
              :style="{
                'font-size': '14px',
                'white-space': 'nowrap',
                color: problems.length > 0 ? '#F56C6C' : 'inherit',
              }"
            >
              疑似问题：{{ problems.length }}
            </span>
          </el-col>
        </el-row>
        <el-row
          v-if="problems.length <= 0"
          style="margin-bottom: 20px; font-size: 14px; color: #67c23a"
        >
          未发现异常。
        </el-row>
        <el-collapse
          v-if="problems.length > 0"
          style="margin-bottom: 20px; font-size: 14px"
          accordion
        >
          <el-collapse-item v-for="problem in problem1s" :key="problem.id">
            <template slot="title">
              <div
                class="c-title-analysis-problem1-title"
                style="font-size: 14px"
              >
                相同内容处于不同层级：{{ problem.content }}
              </div>
            </template>
            <el-tabs class="c-title-analysis-problem1">
              <el-tab-pane
                :key="item.level"
                v-for="item in problem.levels"
                :label="`层级${item.level}（${item.nodes.length}个）`"
              >
                <div
                  v-for="(node, index) in item.nodes"
                  :key="node.node._id"
                  class="c-title-analysis-problem1-paths"
                >
                  <div
                    class="c-title-analysis-problem1-path"
                    v-html="handlePathFilter(node.path, index)"
                    style="font-size: 14px"
                  />
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-collapse-item>
          <el-collapse-item v-for="problem in problem2s" :key="problem.id">
            <template slot="title">
              <div
                class="c-title-analysis-problem1-title"
                style="font-size: 14px"
              >
                相同层级（{{ problem.level }}）标题相似：{{
                  problem.contents.map(i => i.content).join('、')
                }}
              </div>
            </template>
            <el-tabs class="c-title-analysis-problem1">
              <el-tab-pane
                :key="item.content"
                v-for="item in problem.contents"
                :label="`${item.content}（${item.nodes.length}个）`"
              >
                <div
                  v-for="(node, index) in item.nodes"
                  :key="node.node._id"
                  class="c-title-analysis-problem1-paths"
                >
                  <div
                    class="c-title-analysis-problem1-path"
                    v-html="handlePathFilter(node.path, index)"
                    style="font-size: 14px"
                  />
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row>
        <el-row
          class="c-title-analysis-header"
          type="flex"
          justify="space-between"
          style="margin-bottom: 20px"
        >
          <span style="font-size: 14px">标题层级分析</span>
          <span style="font-size: 14px">最深标题：{{ maxLevel }} 级</span>
        </el-row>
        <el-table :data="analysis" :span-method="handleSpanMethod" border>
          <el-table-column prop="node_level" label="层级" width="80">
            <template slot-scope="scope">
              {{ scope.row.node_level }} 级标题
            </template>
          </el-table-column>
          <el-table-column prop="node_level" label="数量" width="80">
            <template slot-scope="scope">
              {{ handleNodeFilter(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column prop="node_name" label="标题内容">
            <template slot-scope="scope">
              <div
                class="c-title-analysis-title"
                @click="handleActiveRow(scope.row)"
              >
                {{ scope.row.node_name }}
              </div>
              <div
                class="c-title-analysis-title-path"
                :show="activeNode === scope.row._id"
                :html="handleFindNodePath(scope.row)"
                :style="{ 'margin-top': '10px' }"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { deepClone } from '../../common/utils/json'
import { treeIterate, findNodePath, flattenJson } from '../../common/utils/tree'
import { TNode } from '../../common/types/json'
import { TProblem, EProblemType } from './problem'
import { checkProblem1, checkProblem2 } from './helper'
import mockJson from './mock';

@Component
export default class TitleAnalysis extends Vue {
  // TODO：json 数据结构待定义
  @Prop({ default: mockJson }) public json!: any[]
  @Prop({ default: mockJson }) public nodes!: any[]

  // 当前展开的标题路径
  public activeNode: string = ''
  // 检查出的疑似问题
  public problems: TProblem[] = []
  // 是否正在进行标题检查
  public checking = true

  get catalog() {
    return deepClone(this.json, {
      filter: node => !!node.node_name && node.node_type === 'chapter',
    })
  }
  get analysis() {
    const plainTitle: any[] = []
    treeIterate(this.catalog, null, item => plainTitle.push(item))
    plainTitle.sort((a, b) => a.node_name.localeCompare(b.node_name, 'zh'))
    plainTitle.sort((a, b) => a.node_level - b.node_level)
    return plainTitle
  }
  get maxLevel() {
    return Math.max(...this.analysis.map(i => i.node_level))
  }
  get problem1s() {
    return this.problems.filter(i => i.type === EProblemType.Problem1)
  }
  get problem2s() {
    return this.problems.filter(i => i.type === EProblemType.Problem2)
  }
  /**
   * 打平的 catalog 总共有多少节点
   */
  get plainNodes() {
    return flattenJson(this.catalog)
  }

  public mounted() {
    setTimeout(this.handleCheck)
  }

  public handleActiveRow(row: TNode) {
    this.activeNode = row._id
  }
  /**
   * 标题检查
   */
  public handleCheck() {
    if (!this.nodes || !this.json) {
      return
    }
    this.checking = true
    const nodes = this.nodes.length > 0 ? this.nodes : this.plainNodes
    const problems: TProblem[] = []
    problems.push(...checkProblem1(nodes, this.json))
    problems.push(...checkProblem2(nodes, this.json))
    this.problems = problems
    setTimeout(() => (this.checking = false), 1000)
  }
  public handleSpanMethod({ row, column, rowIndex }: any) {
    if (column.label === '层级') {
      const prev = this.analysis[rowIndex - 1] || {}
      const curr = row
      const group = this.analysis.filter(i => i.node_level === curr.node_level)
      if (curr.node_level !== prev.node_level) {
        return {
          rowspan: group.length,
          colspan: 1,
        }
      }
      return {
        rowspan: 0,
        colspan: 1,
      }
    }
    if (column.label === '数量' || column.label === '标题内容') {
      const prev = this.analysis[rowIndex - 1] || {}
      const curr = row
      const group = this.analysis.filter(i => i.node_name === curr.node_name)
      if (curr.node_name !== prev.node_name) {
        return {
          rowspan: group.length,
          colspan: 1,
        }
      }
      return {
        rowspan: 0,
        colspan: 1,
      }
    }
    return {
      rowspan: 1,
      colspan: 1,
    }
  }
  public handleFindNodePath(row: TNode) {
    const nodes = this.analysis.filter(
      i => i.node_name === row.node_name && i.node_level === row.node_level,
    )
    if (nodes.length === 1) {
      const path = findNodePath({ children: this.json }, nodes[0])
        .map((i: TNode) => i.node_name)
        .filter((i: string) => !!i)
        .join(`<span style="color: #F56C6C;"> -> </span>`)
      return `路径：${path}`
    }
    if (nodes.length > 1) {
      return `
      路径：<br/>
      ${nodes
        .map((node: TNode, index: number) => {
          const path = findNodePath({ children: this.json }, node)
            .map((i: TNode) => i.node_name)
            .filter((i: string) => !!i)
            .join(`<span style="color: #F56C6C;"> -> </span>`)
          return `${index + 1}. ${path}`
        })
        .join('<br/>')}
      `
    }
  }
  /**
   * Filters
   */
  public handleNodeFilter(node: TNode) {
    return this.analysis.filter(
      i => i.node_level === node.node_level && i.node_name === node.node_name,
    ).length
  }
  public handlePathFilter(path: TNode[], index: number) {
    return (
      `${index + 1}. ` +
      path
        .map((i: TNode) => i.node_name)
        .filter((i: string) => !!i)
        .join(`<span style="color: #F56C6C;"> -> </span>`)
    )
  }
}
</script>
<style lang="scss">
.c-title-analysis {
  padding: 0 10px;
  flex: 1;

  &-header {
    display: flex;
  }

  .el-tabs__item {
    font-size: 12px;
  }
}

.c-title-analysis-problem1-title {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
