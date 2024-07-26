<template>
  <div>
    <div
      v-if="!hideChildren && data.children && data.children.length"
      class="multiple-question"
    >
      <Question
        :data="bigQuestion"
        :enableAnswer="enableAnswer"
        :inherit="data.content.body === '' ? 'stem' : ''"
        :hideTag="true"
        :isBigQuestion="true"
      />
      <div class="small-q">
        <div v-for="(item, index) in data.children" :key="item.node_id">
          <Question
            class="small-q-item"
            :key="item.node_id"
            :data="smallQuestion(item, data.tag_key)"
            :enableAnswer="enableAnswer"
            :inherit="
              data.content.body === '' && index === 0
                ? `${data.content.serial_number}`
                : ''
            "
          />
          <!--            <div v-if="index !== data.children.length -1" class="break-line"></div>-->
        </div>
        <div class="question">
          <AnswerAndAnalysis
            v-if="
              (data.tag_key === 'example' || enableAnswer) &&
              !data.children.length
            "
            :data="data"
            :enableAnswer="enableAnswer"
          />
        </div>
      </div>
    </div>
    <QuestionChoice
      v-else-if="data.question_type === 'choice'"
      class="question"
      :edit="edit"
      :multiple="!!data.multiple"
      :data="data"
      :class="{ warning: data.placeholder_info === 'empty' }"
      :enableAnswer="enableAnswer"
    />
    <QuestionJudge
      v-else-if="data.question_type === 'true_or_false'"
      class="question"
      :data="data"
      :class="{ warning: data.placeholder_info === 'empty' }"
      :enableAnswer="enableAnswer"
    />
    <QuestionFill
      v-else-if="['blank', 'fill_in_blanks'].includes(data.question_type)"
      :data="data"
      class="question"
      :class="{ warning: data.placeholder_info === 'empty' }"
      :enableAnswer="enableAnswer"
    />
    <QuestionAnswer
      v-else-if="['other', 'others'].includes(data.question_type)"
      class="question"
      :data="isBigQuestion ? Object.assign({}, data, { tag_key: '' }) : data"
      :class="{ warning: data.placeholder_info === 'empty' }"
      :enableAnswer="enableAnswer"
    />
    <QuestionParagraphModify
      v-else-if="data.question_type === 'correction'"
      class="question"
      :data="data"
      :class="{ warning: data.placeholder_info === 'empty' }"
    />
    <QuestionWrite
      v-else-if="data.question_type === 'writing'"
      class="question"
      :data="data"
      :class="{ warning: data.placeholder_info === 'empty' }"
    />
    <QuestionMaterial
      v-else
      class="question"
      :data="data"
      :class="{ warning: data.placeholder_info === 'empty' }"
      :enableAnswer="enableAnswer"
    />
    <!-- 标签 -->
    <QuestionTag v-if="!hideTag" :data="data" />
  </div>
</template>

<script>
import QuestionChoice from './QuestionChoice';
import QuestionJudge from './QuestionJudge';
import QuestionFill from './QuestionFill';
import QuestionAnswer from './QuestionAnswer';
import QuestionParagraphModify from './/QuestionParagraphModify';
import QuestionWrite from './QuestionWrite';
import QuestionMaterial from './QuestionMaterial';
import QuestionTag from './QuestionTag';
import AnswerAndAnalysis from './AnswerAndAnalysis';

export default {
  name: 'Question',
  components: {
    QuestionChoice,
    QuestionJudge,
    QuestionFill,
    QuestionAnswer,
    QuestionParagraphModify,
    QuestionWrite,
    QuestionMaterial,
    QuestionTag,
    AnswerAndAnalysis,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    enableAnswer: {
      type: Boolean,
      required: false,
    },
    hideChildren: {
      type: Boolean,
      required: false,
    },
    hideTag: {
      type: Boolean,
      required: false,
    },
    inherit: {
      type: String,
      default: '',
      required: false,
    },
    highLightKey: {
      type: String,
      required: false,
    },
    isBigQuestion: {
      type: Boolean,
      required: false,
    },
  },
  provide() {
    return {
      inherit_serial_number: () => this.inherit,
    };
  },
  computed: {
    bigQuestion() {
      return Object.assign({}, this.data, { children: [] });
    },
  },
  created() {
    if (this.data && this.highLightKey) {
      const mark = `<span style="color: #E6A23C; background: #e6a23c1f">${this.highLightKey}</span>`;
      ['body', 'analysis'].forEach(attr => {
        if (this.data.content[attr]) {
          this.data.content[attr] = this.data.content[attr].replace(
            this.highLightKey,
            mark
          );
        }
      });
      ['answer', 'choices'].forEach(attr => {
        if (this.data.content[attr] && this.data.content[attr].length) {
          for (let index = 0; index < this.data.content[attr].length; index++) {
            if (attr === 'answer') {
              this.data.content[attr][index] = this.data.content[attr][
                index
              ].replace(this.highLightKey, mark);
            } else {
              this.data.content[attr][index].option = this.data.content[attr][
                index
              ].option.replace(this.highLightKey, mark);
            }
          }
        }
      });
    }
    // 监听 img 事件，img 最大宽度不超过 p 元素的 50%
    // this.$nextTick(() => {
    //   const imgs = this.$el.querySelectorAll('img');
    //   imgs.forEach(img => {
    //     img.onload = () => {
    //       if (img.width > img.parentNode.clientWidth * 0.5) {
    //         img.style.width = '50%';
    //       }
    //     }
    //   });
    // });
  },
  methods: {
    smallQuestion(sQ, tag_key) {
      this.$set(sQ, 'tag_key', tag_key);
      return sQ;
    },
  },
};
</script>

<style lang="scss" scoped>
.question {
  width: 100%;
  // Tips：
  // 集中处理试题节点的样式，
  // 规整一些
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
  // letter-spacing: .55px;
  ::v-deep {
    * {
      user-select: none;
      line-height: 20px;
    }

    .katex {
      text-rendering: auto;
      font:
        normal 1.21em KaTeX_Main,
        Times New Roman,
        serif;
      line-height: 1.2;
      text-indent: 0;
      .msupsub {
        .mfrac {
          font-size: 16px;
        }
      }
    }

    .katex-html {
      white-space: pre-wrap;
    }

    span {
      overflow-wrap: anywhere;
    }

    font {
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
    }
  }
}
.warning {
  background: #fde2e2;
}
.break-line {
  border-bottom: 1px dashed #dcdcdc;
  margin-bottom: 15px;
  padding-bottom: 10px;
}
// .small-q {
//   &-item {
//     margin-bottom: 15px;

//     &:last-child {
//       margin-bottom: 0;
//     }
//   }
// }
</style>
