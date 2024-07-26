<script>
import Vue from 'vue';
import QuestionImage from './QuestionImage.vue';

export default {
  name: 'QuestionHTML',
  props: {
    html: {
      type: String,
      required: true,
    },
  },
  components: {},
  methods: {
    initImage(html) {
      const imgReg = /(<img[^>]*>)/g;
      return html.replace(imgReg, (...args) => {
        const image = args[1];
        let desc = '';
        let width = 0;
        let align = '';
        if (image.includes('data-description')) {
          // 图说
          desc = image.match(/<img.*?data-description="(.*?)".*?>/)[1];
        }
        if (/<img.*?width="(.*?)".*?>/.test(image)) {
          // 宽度对齐
          width = image.match(/<img.*?width="(.*?)".*?>/)[1];
        }
        if (image.includes('align-left')) align = 'left';
        if (image.includes('align-right')) align = 'right';
        // image-box 用于图说和制图状态的定位
        return `<span ${desc ? '' : 'class="image-box"'} style="${align ? `display: block;position: relative;text-align: ${align}` : 'position: relative; display:inline-block;'}">${
          desc
            ? `<span class="image-box" style="display: inline-block; ${width ? `width: ${width}px` : ''}">${image}<span style="text-align: center; display: block; ${width ? `width: ${width}px` : ''}">${desc}</span></span>`
            : image
        }</span>`;
      });
    },
    initJb(html) {
      return html.replace(
        /(<span data-label="jb-(left|right)-mark">)/g,
        `$1<span></span>`
      );
    },
    parseHTML(html) {
      const _html = this.initJb(this.initImage(html));
      return _html.replace(/<img[^>]*>/g, img => {
        const attrs = img.match(/<img\s+([^>]*)>/)[1];
        return `<QuestionImage ${attrs}/>`;
      });
    },
  },

  render(h) {
    const cnp = Vue.extend({
      template: `<span v-bind="$attrs" class="c-question-html clearfix">${this.parseHTML(this.html || '')}</span>`,
      data() {
        return {};
      },
      inheritAttrs: false, // 禁用默认将特性绑定到根元素
      created() {},
      components: { QuestionImage },
    });
    return h(cnp, {});
  },
};
</script>

<style lang="scss" scoped>
.c-question-html {
  ::v-deep table {
    margin: 5px auto
  }
}

::v-deep p {
  margin: 0px;
  word-break: break-word;
  // 在p标签下,img的位置根据align-($value)决定，value决定弹性布局的对齐方式，另外对于居右的图片，改为居中
  @each $val in (center, justify) {
    &.align-#{$val} {
      display: block;
      text-align: $val;
      justify-content: center;
    }
  }
  // 分别处理居左和居右的p标签，以避免img和文本冲突
  &.align-right {
    display: block;
    text-align: right;
    justify-content: center;
  }

  &.align-left {
    display: block;
    text-align: left;
    justify-content: flex-start;
  }
  @for $val from 1 to 3 {
    &.indent-#{$val} {
      text-indent: #{$val}em;
    }
  }

  img {
    margin: 5px 5px;
    height: auto;

    @each $val in (center, left, right) {
      &.align-#{$val} {
        display: inline;
        text-align: $val;
      }
    }
  }
}
</style>
