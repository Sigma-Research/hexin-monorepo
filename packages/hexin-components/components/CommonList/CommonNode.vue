<template>
  <PaperChapter
    v-if="
      ['chapter', 'paragraph'].includes(item.node_type) &&
      !(item.node_type === 'paragraph' && enableAnswer)
    "
    :ref="`node#${item.node_id}`"
    :class="{ 'fs-18': item.node_type === 'chapter' }"
    :data="item"
    @dblclick.native="ondblclick(item)"
  />
  <Question
    v-else-if="item.node_type === 'question'"
    :ref="`node#${item.node_id}`"
    :data="item"
    :hide-tag="!enableKnowledge"
    :enableAnswer="enableAnswer"
    :highLightKey="highLightKey"
    @dblclick.native="ondblclick(item)"
  />
</template>
<script>
import { load$img } from '../../common/utils'
import PaperChapter from '../Question/PaperChapter.vue'
import Question from '../Question/Question.vue'

export default {
  components: { Question, PaperChapter },
  props: {
    item: {
      type: Object,
      required: true,
    },
    imgStatusMap: {
      type: Object,
      required: false,
    },
    enableKnowledge: {
      type: Boolean,
      required: false,
    },
    enableAnswer: {
      type: Boolean,
      required: false,
    },
    highLightKey: {
      type: String,
      required: false,
    },
  },
  data() {
    return { loading: false };
  },
  computed: {},
  watch: {
    imgStatusMap: {
      handler(n, o) {
        // @tips：监听到制图状态改变，则应该刷一下节点 dom。
        if (!n && !o) return;
        if (!this.item) return;
        const $element = this.$refs[`node#${this.item.node_id}`] && this.$refs[`node#${this.item.node_id}`].$el;
        const $imgs = ($element ? [...$element.querySelectorAll('img')] : []);
        const uids = $imgs
          .map(img => img.getAttribute('data-image-uid'))
          .filter(uid => uid);
        if (uids.length === 0) return;
        // - 新的和旧的不一样
        // - 旧的还没有加载出来，新的加载出来
        // - 有状态、但是没有对应的 dom 节点
        const needToUpdateUids = uids.filter(uid => {
          const oldUidValue = o && o[uid];
          const newUidValue = n && n[uid];
          const hasImageElement = $element.querySelector('.make-image');

          return (
            oldUidValue !== newUidValue ||
            (!oldUidValue && newUidValue) ||
            (newUidValue && !hasImageElement)
          );
        });

        if (!needToUpdateUids.length) return;
        this.updateImageStatus(needToUpdateUids);
      },
      deep: true,
      immediate: true,
    },
  },
  async mounted() {
    // 创建 ResizeObserver 实例
    const resizeObserver = new ResizeObserver(async () => {
      // 执行相应的处理逻辑
      const nodeRef = this.$refs[`node#${this.item.node_id}`];
      const nodeElement = nodeRef ? nodeRef.$el : null;
      const $imgs = nodeElement ? [...nodeElement.querySelectorAll('img')] : [];

      await Promise.all($imgs.map($img => load$img($img)));
      if (!$imgs.some($img => $img.offsetHeight <= 0)) {
        this.handleImagesAligin();
        // @todo：建议使用 this.$refs[`node#${this.item.node_id}`]?.$el?.offsetHeight，有些细微的差异、应该抹平掉。
        const element = document.querySelector(`[data-item-id="${this.item.node_id}"]`);
        const height = element ? element.offsetHeight : 0;

        this.$set(this.item, 'size', height);
        this.$emit('load', this.item);
        this.loading = false;
        this.initImageStatus();
      }
    });
    // 开始监听元素的大小变化
    const nodeRef = this.$refs[`node#${this.item.node_id}`];
    if (nodeRef && nodeRef.$el) {
      resizeObserver.observe(this.$refs[`node#${this.item.node_id}`].$el);
    }
    // 在组件销毁时停止监听，防止内存泄漏
    this.$once('hook:beforeDestroy', () => resizeObserver.disconnect());
  },
  methods: {
    ondblclick(item) {
      this.$emit('dblclick', item);
    },
    initImageStatus() {
      const nodeRef = this.$refs[`node#${this.item.node_id}`];
      const nodeElement = nodeRef && nodeRef.$el;
      const $imgs = nodeElement ? [...nodeElement.querySelectorAll('img')] : [];

      const uids = $imgs
        .map(img => img.getAttribute('data-image-uid'))
        .filter(uid => uid);
      if (uids.length === 0) return;
      this.updateImageStatus(uids);
    },
    updateImageStatus(uids) {
      if (!this.imgStatusMap) return;
      const $element = this.$refs[`node#${this.item.node_id}`] && this.$refs[`node#${this.item.node_id}`].$el;
      uids.forEach(uid => {
        const status = this.imgStatusMap && this.imgStatusMap[uid];
        if (status === undefined) {
          return;
        }
        [...$element.querySelectorAll(`img[data-image-uid="${uid}"]`)].forEach(
          img => {
            const makeImgEl = img.closest('.image-box');
            if (!makeImgEl) return;
            let spanEl = document.createElement('span');
            if (makeImgEl.querySelector('.make-img')) {
              spanEl = makeImgEl.querySelector('.make-img');
            }
            spanEl.className = 'make-img';
            spanEl.dataset.uid = uid;
            spanEl.style.background = status === 2 ? '#67c23acb' : '#f56c6cd3';
            spanEl.innerHTML = status === 2 ? '已制图' : '制图中';
            if (!makeImgEl.querySelector('.make-img')) {
              makeImgEl.insertBefore(spanEl, makeImgEl.firstChild);
            } // 插到前面
          }
        );
      });
    },
    handleImagesAligin() {
      const ref = this.$refs[`node#${this.item.node_id}`];
      if (!ref) return;
      const PElement = ref.$el.querySelectorAll('p');
      const pWithImgOnly = Array.from(PElement).filter(p => {
        return this.checkP(p);
      });
      pWithImgOnly.forEach(p => {
        p.style.display = 'flex';
        // 获取图片
        const imgElements = p.querySelectorAll('img');
        const maxHeight = Math.max(
          ...Array.from(imgElements).map(img => img.offsetHeight)
        );
        imgElements.forEach(img => {
          img.style.marginTop = `${maxHeight - img.offsetHeight}px`;
        });
      });
    },
    checkP(element) {
      if (!element.querySelector('img') || element.querySelector('table'))
        return false;
      const clone = element.cloneNode(true);
      document.body.appendChild(clone);
      // 去除样式
      clone.querySelectorAll('*').forEach(el => {
        el.removeAttribute('style');
      });
      clone.querySelectorAll('.image-box').forEach(el => {
        el.remove();
      });
      // 判断高度，如果有空格影响高度则根据innerText判断
      const conditionFilter =
        clone.offsetHeight === 0 || /^\s+$/.test(clone.innerText);
      document.body.removeChild(clone);
      return conditionFilter;
    },
  },
  destroyed() {
    // console.log('节点重新渲染了...', this.item.node_id);
  },
};
</script>
<style lang="scss" scoped></style>
