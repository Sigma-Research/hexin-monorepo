<template>
  <div class="h-full flex-column o-hidden">
    <div v-if="!hide" style="margin-bottom: 20px" class="flex">
      <span style="font-size:30px;" class="flex-1">标题层级分析</span>
      <el-button size="small" @click="$router.back()">返回</el-button>
    </div>
    <div class="m-b-15">
      <div class="flex">
        <el-radio-group
          v-model="changeLevelType"
          style="margin-right: 20px;"
          class="flex-1"
          @change="()=>{}"
        >
          <el-radio-button :label="true">内容层级</el-radio-button>
          <el-radio-button :label="false">物理层级</el-radio-button>
        </el-radio-group>
        <div
          class="flex-1"
          style="text-align:right;line-height:40px"
        >最深标题层级： {{ changeLevelType ? maxContentLevel : maxNodeLevel }}级</div>
      </div>
    </div>
    <div class="analysis flex-1 flex-column">
      <div class="flex text-light bold analysis-th">
        <div v-if="changeLevelType" class="title c-p">内容层级</div>
        <div v-if="!changeLevelType" class="title c-p">物理层级</div>
        <div class="m-r-10 p-v-10 p-l-15 c-p" @click="toggleSort('amount')">
          数量
          <i
            :class="{ 'el-icon-sort-down': amountSort === 'down', 'el-icon-sort-up': amountSort === 'up' }"
          ></i>
        </div>
        <div class="p-a-10">
          <span class="c-p" @click="toggleSort('content')">
            标题内容
            <i
              :class="{ 'el-icon-sort-down': contentSort === 'down', 'el-icon-sort-up': contentSort === 'up' }"
            ></i>
          </span>
        </div>
      </div>
      <div class="analysis-tbody flex-1" :key="jsonAnalysisUpdate">
        <div v-for="(item, index) in jsonAnalysis" :key="index" class="analysis-item flex">
          <span
            v-if="changeLevelType"
            class="title"
          >{{ item.content.level ? item.content.level : '--' }}级标题</span>
          <span v-if="!changeLevelType" class="title">{{ item.node_level }}级标题</span>
          <div class="analysis-item-content flex-1">
            <div v-for="info in item.children" :key="info.id" class="flex-1 item">
              <div class="flex j-between a-center p-a-10 c-p" @click="showAnalysisContent(info)">
                <div class="count">{{ info.count }}</div>
                <div class="flex-1">{{ info.name }}</div>
                <i
                  :class="{
                    'el-icon-arrow-right': currAnalysisId !== info.id,
                    'el-icon-arrow-down': currAnalysisId === info.id
                  }"
                ></i>
              </div>
              <div v-if="currAnalysisId === info.id" class="analysis-location">
                <div class="m-b-10">定位</div>
                <div v-for="(sub, index) in info.children" :key="sub.id" class="m-b-5">
                  <span class="m-r-5">{{ index + 1 }}.</span>
                  <span v-html="sub.path"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _groupBy from 'lodash/groupBy'
import mockJson from './mock'
import './style.scss'

export default {
  name: 'JsonLevelAnalysis',
  props: {
    Json: {
      type: Array,
      default: mockJson,
    },
    hide: {
      type: Boolean,
      default: true,
    },
    selectItem: {
      type: Array,
      default: () => null
    }
  },
  data() {
    return {
      currAnalysisId: '',
      amountSort: 'up',
      contentSort: '',
      changeLevelType: true,
      maxNodeLevel: 0,
      maxContentLevel: 0,
      jsonAnalysis: [],
      jsonAnalysisUpdate: 0,
    }
  },
  created() {
    this.jsonAnalysis = this.getJsonAnalysis()
  },
  watch: {
    Json: {
      handler() {
        this.jsonAnalysis = this.getJsonAnalysis()
        this.jsonAnalysisUpdate++
      },
      deep: true,
    },
    selectItem: {
      handler() {
        this.jsonAnalysis = this.getJsonAnalysis()
        this.jsonAnalysisUpdate++
      },
      deep: true,
    },
    changeLevelType: {
      handler() {
        this.jsonAnalysis = this.getJsonAnalysis()
        this.jsonAnalysisUpdate++
      },
    },
  },
  methods: {
    getJsonAnalysis() {
      const { amountSort, contentSort } = this
      let res = this.getNodeNamePath(this.Json)
      if (this.changeLevelType) {
        res = _groupBy(res, function(n) {
          return n.content.level
        })
      } else {
        res = _groupBy(res, 'node_level')
      }
      const list = this.getLevelAnalysis(res)
      this.maxContentLevel = 0
      this.maxNodeLevel = 0
      return list.map(item => {
        if (item.content.level * 1 > this.maxContentLevel) {
          this.maxContentLevel = item.content.level * 1
        }
        if (item.node_level * 1 > this.maxNodeLevel) {
          this.maxNodeLevel = item.node_level * 1
        }
        item.children = item.children.sort((a, b) => {
          if (amountSort === 'down') {
            return b.count - a.count
          } else if (amountSort === 'up') {
            return a.count - b.count
          } else if (amountSort === '') {
            if (contentSort === 'down') {
              return b.name.localeCompare(a.name, 'zh')
            } else if (contentSort === 'up') {
              return a.name.localeCompare(b.name, 'zh')
            } else {
              return 0
            }
          } else {
            return 0
          }
        })
        return item
      })
    },
    getLevelAnalysis(res) {
      let id = 1
      let analysisResult = []
      let namesMap = {}
      for (let key in res) {
        const resItem = res[key]
        resItem.forEach(item => {
          const { node_name } = item
          item.id = `analysis-${id++}`
          if (namesMap[node_name]) {
            namesMap[node_name].push(item)
          } else {
            namesMap[node_name] = [item]
          }
        })
        const children = Object.keys(namesMap).map(item => {
          return {
            name: item,
            children: namesMap[item],
            count: namesMap[item].length,
            id: `analysis-${id++}`,
          }
        })
        analysisResult.push({
          id: `analysis-${id++}`,
          node_level: key,
          children,
          content: {
            level: resItem[0].content.level,
          },
        })
        namesMap = {}
      }
      return analysisResult
    },
    getNodeNamePath(data) {
      let res = []
      const select = this.selectItem
      function trackBack(data, nameStr) {
        for (let item of data) {
          const path = `${
            nameStr ? `${nameStr}<span class="text-danger" style="color: red">-</span>` : ''
          }${item.node_name || ''}`
          if (item.node_type === 'chapter') {
            if (select === null) {
              res.push({
                node_level: item.node_level,
                node_name: item.node_name,
                path,
                content: {
                  level: item.content.level ? item.content.level : '--',
                },
              })
            } else {
              select.forEach(selectitem => {
                if (selectitem._id === item._id) {
                  res.push({
                    node_level: item.node_level,
                    node_name: item.node_name,
                    path,
                    content: {
                      level: item.content.level ? item.content.level : '--',
                    },
                  })
                  break;
                }
              })
            }
            if (item.children.length) {
              trackBack(item.children, path)
            }
          }
        }
      }
      trackBack(data)
      return res
    },
    showAnalysisContent(info) {
      if (info.id === this.currAnalysisId) {
        this.currAnalysisId = ''
        return
      }
      this.currAnalysisId = info.id
    },
    toggleSort(name) {
      if (name === 'amount') {
        this.amountSort = this.amountSort === 'up' ? 'down' : 'up'
        this.contentSort = ''
      } else {
        this.contentSort = this.contentSort === 'up' ? 'down' : 'up'
        this.amountSort = ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$borderColor: #d3dce6;
.h-full {
  height: 100%;
}
.analysis {
  overflow: hidden;
  border: 1px solid $borderColor;

  &-th {
    background: #f2f2f2;
  }
  &-tbody {
    overflow-y: scroll;
  }
  .title {
    width: 100px;
    padding: 10px 10px;
  }
  .count {
    width: 40px;
    margin-right: 10px;
    text-align: center;
  }
  &-item {
    border-bottom: 1px solid $borderColor;
    &:last-child {
      border-bottom: none;
    }
    .item {
      border-left: 1px solid $borderColor;
      border-bottom: 1px solid $borderColor;

      &:last-child {
        border-bottom: none;
      }
    }
  }

  &-location {
    padding: 5px 10px;
    background: #f2f2f2;
  }
}
.change-level-type {
  padding-left: 30px;
  cursor: pointer;
  color: #198cff;
}
</style>
