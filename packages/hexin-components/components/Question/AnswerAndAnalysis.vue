<template>
  <QuestionHTML
    ref="content"
    :class="content ? 'm-t-5' : ''"
    :html="content"
    class="clearfix"
  />
</template>

<script>
import { highlight } from 'pinyin';
import QuestionHTML from './QuestionHTML.vue';
import { parser , tiff2Jpg} from '../../common/utils';

export default {
  name: 'AnswerAndAnalysis',
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
    return { isLoading: false };
  },
  mounted() {},
  destroyed() {},
  computed: {
    analysis() {
      let analysis = this.data.content.analysis;
      if (!analysis) return '';
      analysis = /^<p.*?>/.test(analysis)
        ? analysis.replace(
            /^(<p.*?>)/,
            '$1<span style="color: #409EFF !important">【解析】</span>'
          )
        : `<span style="color: #409EFF !important">【解析】</span>${analysis}`;
      return this.data?.$$pinyin?.$$analysis
        ? '<div class="analysis">' +
            highlight(
              parser(tiff2Jpg(analysis)),
              this.data.$$pinyin.$$analysis
            ) +
            '</div>'
        : '<div class="analysis">' + parser(tiff2Jpg(analysis)) + '</div>';
    },
    answer() {
      const { question_type } = this.data;
      const { answer, serial_number } = this.data.content;
      let sn = '';
      if (!answer || !answer.filter(item => Boolean(item.trim())).length) {
        return '';
      }
      // Tips：
      // 若开启“只显示答案”，则题干部分隐藏，
      // 把题号加在答案前面。
      if (this.enableAnswer && serial_number) {
        sn =
          serial_number && question_type !== 'material'
            ? `${serial_number}${/^[1-9]\d*$/.test(serial_number) ? '. ' : ''}`
            : '';
        sn = `<span>${sn}</span>`;
      }
      if (question_type !== 'other') {
        return (
          '<div class="answer">' +
          answer
            .map((item, index) => {
              const a = item.replace(/<(\/)?p[^<>]*?>/g, '');
              if (
                index === 0 &&
                this.data.$$pinyin &&
                this.data.$$pinyin.$$answer
              ) {
                return highlight(
                  parser(tiff2Jpg(a)),
                  this.data.$$pinyin.$$answer
                );
              }
              return parser(tiff2Jpg(a));
            })
            .map((item, index) => {
              if (index === 0) {
                return (
                  sn +
                  `<span class="text"><span style="color: #409EFF !important">【答案】</span>${item}</span>`
                );
              }
              return `<span class="text">${item}</span>`;
            })
            .join('&nbsp&nbsp&nbsp') +
          '</div>'
        );
      }
      return (
        '<div class="answer">' +
        answer
          .map((item, index) => {
            if (
              index === 0 &&
              this.data.$$pinyin &&
              this.data.$$pinyin.$$answer
            ) {
              return highlight(
                parser(tiff2Jpg(item)),
                this.data.$$pinyin.$$answer
              );
            }
            return parser(tiff2Jpg(item));
          })
          .map((item, index) => {
            if (index === 0) {
              return (
                sn +
                `<span class="text"><span style="color: #409EFF !important">【答案】</span>${item.replace('<p>', '').replace('</p>', '')}</span>`
              );
            }
            return `<span class="text">${item}</span>`;
          })
          .join('') +
        '</div>'
      );
    },
    content() {
      if (this.data.content._sequence && this.data.content._sequence.length) {
        // @tips：_sequence 可能存在重复项，在这里先过滤一下。
        for (let i = 0; i < this.data.content._sequence.length; i++) {
          const item = this.data.content._sequence[i];
          if (this.data.content._sequence.indexOf(item) !== i) {
            this.data.content._sequence.splice(i, 1);
          }
        }
        if (
          this.data.content._sequence.includes('answer') &&
          this.data.content._sequence.includes('analysis')
        ) {
          this.data.content._sequence = this.data.content._sequence;
        } else if (this.data.content._sequence.includes('answer')) {
          const index = this.data.content._sequence.findIndex(
            item => item === 'answer'
          );
          this.data.content._sequence.splice(index + 1, 0, 'analysis');
        } else if (this.data.content._sequence.includes('analysis')) {
          const index = this.data.content._sequence.findIndex(
            item => item === 'analysis'
          );
          this.data.content._sequence.splice(index, 0, 'answer');
        }
        const contentList = this.data.content._sequence.map(item => {
          if (item === 'answer' || item === 'analysis') {
            return this[item];
          } else if (item.includes('extra')) {
            return this.getExtraHtml(this.data.content[item]);
          }
        });
        return contentList.join('');
      }
      return this.answer + this.analysis;
    },
  },
  methods: {
    parser,
    tiff2Jpg,
    highlight,
    getExtraHtml(data) {
      let extra = data.body;
      const title = data.title;
      if (!extra) return '';
      if (title) {
        extra = /^<p.*?>/.test(extra)
          ? extra.replace(
              /^(<p.*?>)/,
              `$1<span style="color: #409EFF !important">【${title}】</span>`
            )
          : `<span style="color: #409EFF !important">【${title}】</span>${extra}`;
      }
      return this.data?.$$pinyin?.$$extra
        ? '<div class="answer">' +
            highlight(parser(tiff2Jpg(extra)), this.data.$$pinyin.$$extra) +
            '</div>'
        : '<div class="answer">' + parser(tiff2Jpg(extra)) + '</div>';
    },
  },
};
</script>

<style lang="scss" scoped>
.text {
  position: relative;
  padding-right: 12px;

  &:after {
    content: "、";
    position: absolute;
    right: -4px;
  }

  &:last-child:after {
    content: "";
  }
}
</style>
