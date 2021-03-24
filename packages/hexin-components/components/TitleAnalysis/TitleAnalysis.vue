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
                v-show="activeNode === scope.row._id"
                v-html="handleFindNodePath(scope.row)"
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
import { treeIterate, findNodePath } from '../../common/utils/tree'
import { uuid } from '../../common/utils/uuid'
import { TJson, TNode } from '../../common/types/json'
import mockJson from './mock';

@Component
export default class TitleAnalysis extends Vue {
  @Prop({ default: mockJson }) public json!: TJson[]

  formattedJson: TJson[] = [];

  // 当前展开的标题路径
  public activeNode: string = ''

  get catalog() {
    // TODO：这里的深拷贝可以优化掉、仅过滤即可
    return deepClone(this.formattedJson, {
      filter: node => !!node.node_name && node.node_type === 'chapter',
    })
  }
  get analysis() {
    const plainTitle: TNode[] = []
    treeIterate(this.catalog, null, item => plainTitle.push(item))
    plainTitle.sort((a, b) => a.node_name.localeCompare(b.node_name, 'zh'))
    plainTitle.sort((a, b) => a.node_level - b.node_level)
    return plainTitle
  }
  get maxLevel() {
    return Math.max(...this.analysis.map(i => i.node_level))
  }

  mounted() {
    this.formattedJson = deepClone(this.json, {
      callback: (node: TNode) => {
        if (node && node.node_type) {
          /**
           * 这里需要注意，在 Json 预处理环节中，数据可能是不持有 _id 的，所以需要生成逻辑 id 使用
           */
          node._id = uuid();
        }
        return node;
      },
    });
  }

  public handleActiveRow(row: TNode) {
    this.activeNode = row._id
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
      const path = findNodePath({ children: this.formattedJson }, nodes[0])
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
          const path = findNodePath({ children: this.formattedJson }, node)
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
