<template>
  <div
    v-if="!isVirtualList"
    class="c-common-list render-all-data"
    @scroll="onScroll"
  >
    <div v-for="(item, index) in nodes" :key="item.node_id">
      <div
        class="render-item"
        :draggable="false"
        :key="item.node_id"
        :id="item.node_id"
        :parent-id="item.node_parent_id"
        :node-level="item.node_level"
      >
        <slot :item="item" :index="index">render node {{ index }}</slot>
      </div>
    </div>
  </div>
  <RecycleScroller
    v-else
    ref="virtual-scroller"
    key-field="node_id"
    class="c-common-list"
    :items="nodes"
    :min-item-size="54"
    :pageMode="true"
    :emitUpdate="true"
    :draggable="false"
    @visible="onVisible"
    @update="onUpdate"
    @scroll-start="onScrollStart"
    @scroll-end="onScrollEnd"
  >
    <template v-slot="{ item, index, active }">
      <div :active="active" :data-index="index" :data-item-id="item.node_id">
        <div
          class="render-item"
          :key="item.node_id"
          :id="item.node_id"
          :parent-id="item.node_parent_id"
          :node-level="item.node_level"
          :draggable="false"
        >
          <slot :item="item" :index="index">render node {{ index }}</slot>
        </div>
      </div>
    </template>
  </RecycleScroller>

  <!-- DynamicScroller 的 size 实现不太好控制，会有很强的抖动问题，pass 掉 -->
  <!-- <DynamicScroller
    v-else
    ref="virtual-scroller"
    key-field="node_id"
    :items="nodes"
    :min-item-size="54"
    :buffer="1000"
    :page-mode="true"
    :emit-update="true"
    :draggable="false"
    @visible="onVisible"
    @update="onUpdate"
    @scroll-start="onScrollStart"
    @scroll-end="onScrollEnd"
  >
    <template v-slot="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :data-index="index"
      >
        <div
          :active="active"
          :data-index="index"
          :data-item-id="item.node_id"
        >
          <div
            class="render-item"
            :key="item.node_id"
            :id="item.node_id"
            :parent-id="item.node_parent_id"
            :node-level="item.node_level"
            :draggable="false"
          >
            <slot :item="item" :index="index">render node {{ index }}</slot>
          </div>
        </div>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller> -->
</template>
<script>
import {
  DynamicScrollerItem,
  DynamicScroller,
  RecycleScroller,
} from 'vue-virtual-scroller';
import * as _ from 'lodash';

export default {
  components: {
    // DynamicScrollerItem,
    // DynamicScroller,
    RecycleScroller,
  },
  props: {
    mode: {
      // virtual-list, render-all
      type: String,
      require: false,
    },
    nodes: {
      type: Array,
      require: true,
    },
  },
  computed: {
    isVirtualList() {
      if (this.mode === 'render-all') return false;
      return this.nodes.length > 300 || this.mode === 'virtual-list';
    },
  },
  mounted() {
    if (!this.isVirtualList) {
      // @todo：等待首刷数据的图片加载完。
      return this.onVisible();
    }
  },
  methods: {
    // 这个方法只监听 render-all 的数据
    onScroll: _.throttle(function (e) {
      // @tips：虚拟列表在 @update 触发事件。
      const scrollTop = e.target.scrollTop;
      const scrollHeight = e.target.scrollHeight;
      const clientHeight = e.target.clientHeight;
      this.onUpdate();
      if (scrollHeight - (scrollTop + clientHeight) <= 20) {
        this.onScrollEnd();
      }
    }, 500),
    onVisible() {
      this.$emit('visible');
    },
    onUpdate(data) {
      this.$emit('update', data);
    },
    onScrollStart() {
      this.$emit('scrollStart');
      this.$emit('scroll-start');
    },
    onScrollEnd() {
      this.$emit('scrollEnd');
      this.$emit('scroll-end');
    },
  },
  destroyed() {
    // console.log('列表组件销毁了。');
  },
};
</script>
<style lang="scss" scoped>
.c-common-list {
  // 避免最顶部的标题节点看不到悬浮后的工具栏
  padding: 30px 10px 0;
}

.render-all-data {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}
</style>
