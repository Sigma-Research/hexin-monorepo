<template>
  <QuestionBase class="choice" :data="data" :enableAnswer="enableAnswer">
    <div
      class="flex-wrap"
      ref="choice"
      style="align-items: center"
      v-if="
        data.content.body !== blankBody &&
        data.content.body !== '' &&
        !enableAnswer
      "
    >
      <div
        v-for="(item, index) in data.content.choices"
        :key="index"
        class="option"
        :class="choiceOptionClass"
      >
        <p class="m-r-5">{{ item.letter }}.</p>
        <QuestionHTML
          class="flex-center option-content"
          :html="processChoice(item)"
        />
      </div>
    </div>
  </QuestionBase>
</template>

<script>
import Vue from 'vue';
import { parser , tiff2Jpg} from '../../common/utils';
import QuestionBase from './QuestionBase';
import QuestionChoiceItem from './QuestionChoiceItem';
import QuestionHTML from './QuestionHTML.vue';

export default {
  components: {
    QuestionHTML,
    QuestionBase,
  },
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
  watch: {
    data: {
      handler() {
        this.initChoiceOptions();
      },
      deep: true,
    },
  },
  mounted() {
    this.data.content.choices = this.data.content.choices.map(item => {
      return {
        letter: item.letter,
        option: item.option,
        option2: item.option, // 防止数据双向绑定，导致编辑时保存了多余标签
      };
    });
  },
  destroyed() {},
  methods: {
    parser,
    processChoice(item) {
      if (item.option2) {
        return parser(item.option2);
      }
      // option2是初始化的时候加进来的，后续data变了的话这个地方就没有加option2了，直接用下面这个return
      return parser(item.option);
    },
    initChoiceOptions() {
      if (
        this.data.content.body === this.blankBody ||
        this.data.content.body === '' ||
        this.enableAnswer
      ) {
        return;
      }
      this.$nextTick(() => {
        const containerW = this.$refs.choice && this.$refs.choice.clientWidth;
        const id =
          'choice' + new Date().getTime() + parseInt(Math.random() * 100);
        const div = document.createElement('div');
        div.style = 'position: absolute; height: 0; overflow: hidden;';
        div.id = id;
        const ChoiceItem = Vue.extend(QuestionChoiceItem);
        this.data.content.choices.forEach(item => {
          const choiceItemInstance = new ChoiceItem({
            data: {
              data: {
                ...item,
                option: item.option2,
              },
            },
          });
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
.option {
  height: 100%;
  // Tips：
  // 该样式用于把结构化数据看起来是 inline 的，
  // 这里需要注意不可以直接用 * 匹配，避免误伤公式。
  // white-space: nowrap;
  ::v-deep p {
    display: inline;
  }
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
.option-content {
  display: inline;
}
</style>
