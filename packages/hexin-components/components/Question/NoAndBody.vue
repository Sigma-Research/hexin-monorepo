<template>
  <!-- 题目的题号和题干 -->
  <div ref="noAndBody" class="noandbody" v-bind:data-node-id="data.node_id">
    <div
      v-if="data.content.body.includes('loading-word')"
      class="loading-word flex a-center j-center"
      style="border: 1px solid #ddd; font-size: 16px; padding: 5px"
    >
      <i
        class="el-icon-loading"
        style="font-size: 20px; color: rgb(72, 99, 143); margin-right: 10px"
      />
      Word 文档内容解析中...
    </div>
    <div v-else-if="!enableAnswer" class="flex-start">
      <QuestionHTML
        ref="questionBody"
        :class="
          data.content.body !== blankBody && data.content.body !== ''
            ? 'content-box'
            : ''
        "
        :html="contentBody || ''"
      />
      <div
        v-if="data.content.body === blankBody || data.content.body === ''"
        class="flex-wrap flex-1 m-l-15"
        ref="choice"
        style="align-items: center"
      >
        <div
          v-for="(item, index) in data.content.choices"
          :key="index"
          class="option"
          :class="choiceOptionClass"
        >
          <div class="flex-start">
            <div class="m-r-5">{{ item.letter }}.</div>
            <QuestionHTML
              class="flex-center"
              :html="parser(item.option) || ''"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { highlight } from 'pinyin';
import { parser , tiff2Jpg} from '../../common/utils';

import QuestionChoiceItem from './QuestionChoiceItem';
import QuestionHTML from './QuestionHTML.vue';

export default {
  name: 'NoAndBody',
  inject: ['inherit_serial_number'],
  components: { QuestionHTML },
  props: {
    data: {
      type: Object,
      required: true,
    },
    enableAnswer: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      choiceOptionClass: '',
      blankBody: '<p><span data-label="bracket"></span></p>',
      isLoading: false,
    };
  },
  computed: {
    hasWordLoading() {
      if (!this.data) {
        return false;
      }
      if (this.data.content.body.includes('loading-word')) {
        return true;
      }
      if (/^<html/.test(this.data.content.body)) {
        return true;
      }
      return false;
    },
    contentLoaded() {
      if (!this.data) {
        return false;
      }
      if (/NoSuchKey/.test(this.data.content.body)) {
        // Todo：这里需要更严格的判断，404
        return false;
      }
      if (this.hasWordLoading) {
        return /^<html/.test(this.data.content.body);
      }
      return true;
    },
    contentBody() {
      if (!this.data) {
        return '';
      }
      const inherit_serial_number = this.inherit_serial_number();
      let { serial_number, source, body } = this.data.content;
      if (inherit_serial_number === 'stem' && body === '') {
        return;
      }
      if (this.data.node_type === 'chapter') {
        source = '';
      }
      const { $$pinyin, question_type } = this.data;
      if (this.hasWordLoading && this.contentLoaded) {
        return parser(body);
      }
      if (/^<html/.test(this.data.content.body) && this.contentLoaded) {
        return parser(body);
      }
      serial_number =
        serial_number && question_type !== 'material'
          ? `${serial_number}${/^[1-9]\d*$/.test(serial_number) ? '. ' : ' '}`
          : '';
      if (inherit_serial_number !== '' && inherit_serial_number !== 'stem') {
        serial_number =
          `${inherit_serial_number}${/^[1-9]\d*$/.test(inherit_serial_number) ? '. ' : ' '}` +
          `${serial_number}`;
      }
      if (source) {
        source =
          '<span> [</span>' +
          ($$pinyin && $$pinyin?.$$source
            ? highlight(parser(tiff2Jpg(source || '')), $$pinyin.$$source)
            : (source || '').replace(/\(（+(.*?)\)）+/g, '$1')) +
          '<span>] </span>';
      }
      body = $$pinyin?.body
        ? highlight(parser(tiff2Jpg(body)), $$pinyin.$$body)
        : parser(tiff2Jpg(body));
      body = /^<p.*?>/.test(body)
        ? body.replace(/^(<p.*?>)/, `$1 <b>${serial_number}</b>${source}`)
        : `<b>${serial_number}</b>${source}${body}`;
      body = /<br>/.test(body) ? body.replace(/<br>/g, '') : body;
      if (this.data.placeholder_info === 'empty') {
        body = body.split('undefined')[1];
      }
      body = body.replace(/	/g, '&nbsp; &nbsp; &nbsp; &nbsp; '); // 清理浏览器渲染不出来的空格
      return body;
    },
  },
  watch: {
    data: {
      handler() {
        this.$nextTick(() => {
          this.init();
        });
      },
    },
  },
  mounted() {
    this.init();
  },
  destroyed() {},
  methods: {
    parser,
    tiff2Jpg,
    highlight,
    init() {
      this.initBlank();
      if (
        (this.data.question_type === 'choice' &&
          this.data.content.body === this.blankBody) ||
        this.data.content.body === ''
      ) {
        this.initChoiceOptions();
      }
    },
    initBlank() {
      const el = this.$refs.questionBody.$el;
      const blank = el && el.querySelectorAll('[data-label="blank"]');
      blank &&
        blank.forEach(item => {
          const placeholder = '&emsp;'.repeat(
            item.dataset.blankLength || item.dataset.length || 2
          );
          item.innerHTML = `<span class="blank-content">${item.innerHTML}</span>${placeholder}`;
        });
    },
    initChoiceOptions() {
      this.$nextTick(() => {
        const containerW = this.$refs.choice?.clientWidth;
        const id =
          'choice' + new Date().getTime() + parseInt(Math.random() * 100);
        const div = document.createElement('div');
        div.style = 'position: absolute; height: 0; overflow: hidden;';
        div.id = id;
        const ChoiceItem = Vue.extend(QuestionChoiceItem);
        this.data.content.choices &&
          this.data.content.choices.forEach(item => {
            const choiceItemInstance = new ChoiceItem({ data: { data: item } });
            const choiceItemVm = choiceItemInstance.$mount();
            div.appendChild(choiceItemVm.$el);
          });
        document.body.appendChild(div);
        const tmpDom = document.getElementById(id);
        const optionMaxWidth = tmpDom.clientWidth;
        let choiceOptionClass = 'option-1';
        if (optionMaxWidth > containerW) {
          choiceOptionClass = 'option-1';
        } else {
          const childNodes = tmpDom.childNodes;
          let subChildNodesW = 0;
          for (const item of childNodes) {
            subChildNodesW += item.clientWidth + 20;
          }
          if (subChildNodesW < containerW) {
            choiceOptionClass = `option-${childNodes.length}`;
          } else {
            for (let i = 0; i < childNodes.length; i += 2) {
              if (
                childNodes[i] &&
                childNodes[i + 1] &&
                childNodes[i].clientWidth + childNodes[i + 1].clientWidth >
                  containerW
              ) {
                choiceOptionClass = 'option-1';
                break;
              }
              choiceOptionClass = 'option-2';
            }
          }
        }
        document.body.removeChild(tmpDom);
        this.choiceOptionClass = choiceOptionClass;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.noandbody {
  // Tips：
  // 该样式用于把结构化数据看起来是 inline 的，
  // 这里需要注意不可以直接用 * 匹配，避免误伤公式。
  // ::v-deep p, div {
  //   display: inline;
  // }
  .html-from-word {
    ::v-deep {
      word-break: break-all;
    }
  }

  .content-box {
    width: 100%;
  }
}

::v-deep [data-label="bracket"] {
  text-indent: 0px;
  display: inline-block;
  height: 20px;
  position: relative;
  // 上移bracket使得可以与题目的内容对齐
  top: 4px;
  padding-left: 1.5em;

  &::before {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
  }

  &::after {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
  }
}

::v-deep span[data-label="blank"] {
  display: inline-block;
  min-width: 50px;
  height: 20px;
  line-height: 20px;
  position: relative;
  text-indent: 0px;
}

::v-deep .blank-content {
  line-height: 20px !important;
  position: absolute;
  white-space: nowrap;
  text-align: center;
  left: 50%;
  bottom: 0px;
  transform: translateX(-50%);
}

.no {
  margin-right: 3px;
}

.option-1 {
  width: 100%;
}

.option-2 {
  width: 50%;
}

.option-3 {
  width: 33%;
}

.option-4 {
  width: 25%;
}

.option-5 {
  width: 20%;
}

img {
  margin: 5px 0;
}
</style>
