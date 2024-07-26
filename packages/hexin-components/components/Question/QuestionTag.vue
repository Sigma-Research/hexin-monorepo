<template>
  <div>
    <!-- 标签 -->
    <div
      v-show="data._tagList && data._tagList.length"
      class="tags flex a-center"
    >
      <div
        v-for="(type, index) in data._tagList"
        :key="type.node_id"
        class="type flex a-center"
      >
        <span class="type-name">{{ type.node_name }}：</span>
        <div
          v-for="(tag, tagindex) in type.children"
          :key="tag.node_id"
          class="tag"
        >
          <el-tooltip
            v-if="tag.path.length"
            class="item"
            effect="light"
            placement="top-start"
          >
            <div slot="content">
              <span v-for="(item, index) in tag.path" :key="item.node_id">
                {{ item.node_name }}
                <i
                  class="el-icon-arrow-right"
                  v-show="index !== tag.path.length - 1"
                ></i>
              </span>
            </div>
            <span class="tag-name">{{ tag.node_name }}</span>
          </el-tooltip>
          <span class="tag-name" v-else>{{ tag.node_name }}</span>
        </div>
        <span
          class="type-boundary"
          v-show="index !== data._tagList.length - 1"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import { parser , tiff2Jpg} from '../../common/utils';
export default {
  name: 'QuestionTag',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    parser,
  },
};
</script>

<style lang="scss" scoped>
.tags {
  border-top: 1px solid #eeeff0;
  margin: 5px 0;
  padding-top: 5px;
  color: #999;
  font-family:
    DengXian,
    Helvetica Neue,
    Helvetica,
    Nimbus Sans L,
    Arial,
    Liberation Sans,
    Hiragino Sans GB,
    Source Han Sans CN,
    Source Han Sans SC,
    Microsoft YaHei,
    "\5FAE\8F6F\96C5\9ED1",
    Wenquanyi Micro Hei,
    WenQuanYi Zen Hei,
    ST Heiti,
    SimHei,
    WenQuanYi Zen Hei Sharp,
    sans-serif;
  white-space: nowrap;
  flex-wrap: wrap;
  .tag {
    padding: 0 5px;
    flex-wrap: wrap;
  }
  .tag + .tag::before {
    content: "|";
    display: inline-block;
    margin: 0px 6px 0 0;
    position: relative;
    top: -1px;
  }
  .type-boundary {
    display: inline-block;
    width: 1px;
    height: 18px;
    background: #999;
    margin-left: 5px;
    margin-right: 10px;
  }
}
</style>
