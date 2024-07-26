<template>
  <div
    class="paper-chapter"
    :class="{
      paragraph: data.node_type !== 'chapter',
      chapter: data.node_type === 'chapter',
      'text-center': +data.node_level === 1,
    }"
  >
    <QuestionHTML
      class="paper-chapter-content"
      :data-node-id="data.node_id"
      :class="{
        'paragraph-style': data.node_type === 'paragraph',
        'no-body': !(data.content && data.content.body),
      }"
      :style="
        data.node_type === 'chapter' ? getChapterFs(data.content.level) : ''
      "
      :html="
        latexHtml(data.content && data.content.body) ||
        `请输入${data.node_type === 'chapter' ? '章节名称' : '文段内容'}`
      "
    />
  </div>
</template>

<script>
import katex from 'katex';
import { parser , tiff2Jpg} from '../../common/utils';
import QuestionHTML from './QuestionHTML.vue';

export default {
  components: { QuestionHTML },
  props: {
    data: { type: Object, required: true },
    edit: { type: Boolean, default: false },
    hiddenButton: { type: Boolean, default: false },
  },
  data() {
    return {
      content: '',
      hideMarkBtn: window.location.search.includes('hideMarkBtn'),
    };
  },
  watch: {
    edit(n, o) {
      if (n !== o) {
        this.initContent();
      }
    },
  },
  created() {
    this.initContent();
  },
  methods: {
    latexHtml: parser,
    renderMath(element, latex) {
      katex.render(latex, element, {
        throwOnError: false,
      });
    },
    initContent() {
      this.content =
        (this.data.content && this.data.content.body) || this.data.node_name;
    },
    updateContent() {
      this.$emit('update', this.data, this.content);
    },
    cancel() {
      this.$emit('cancel');
    },
    getChapterFs(level) {
      const styleOption = {};
      switch (level) {
        case 1:
          styleOption['font-size'] = '20pt';
          break;
        case 2:
          styleOption['font-size'] = '16pt';
          break;
        case 3:
          styleOption['font-size'] = '14pt';
          break;
        case 4:
          styleOption['font-size'] = '14pt';
          break;
      }
      return styleOption;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../common/style/_vars.scss";

.paper-chapter {
  user-select: none;
  //padding: 0 16px;

  &-editor {
    padding-top: 5.5px;
    min-height: 54px;
    overflow: hidden;
    ::v-deep span,
    img {
      text-indent: 0em !important;
    }
  }

  &-operator {
    float: right;
    margin: 10px 0;
    padding: 0 15px;
    box-sizing: border-box;

    &-button {
      margin-left: 12px;
      cursor: pointer;
      color: $c_focus;
      font-weight: normal;
    }
  }

  &.paragraph {
    .paper-chapter-content {
      overflow-x: auto; // 避免比较宽的表格被截断
      overflow-y: hidden;

      ::v-deep {
        line-height: 1.7;
        color: #000;
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
        letter-spacing: 1px;
      }
    }
  }

  &.chapter {
    .paper-chapter-content {
      ::v-deep {
        line-height: 2.5;
        font-family: ST Heiti;
        letter-spacing: 1px;
        -webkit-font-smoothing: antialiased;
      }
    }
  }

  &-content {
    ::v-deep {
      img {
        border: 1px solid #aaa;
        margin: 5px 0;
      }

      p {
        margin: 0;
        color: #000;
        @each $val in (center, left, right, justify) {
          &.align-#{$val} {
            display: block;
            text-align: $val;
          }
        }

        @for $val from 1 to 3 {
          &.indent-#{$val} {
            text-indent: #{$val}em;
          }
        }

        img {
          margin: 5px 5px;
          height: auto;
        }
      }
    }
  }
}

::v-deep .cke_editable {
  padding: 5px 10px;
  line-height: 30px;
  background: #fff;
  border: none;
  outline: none;
}
.no-body {
  color: #bbb !important;
}
</style>
