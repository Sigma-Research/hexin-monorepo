<template>
  <div>
    <!-- 题目的题号和题干 -->
    <NoAndBody :data="data" :enableAnswer="enableAnswer" />
    <!-- 不同题目的差异部分 -->
    <slot />
    <!-- 题目的答案和解析 -->
    <AnswerAndAnalysis
      v-if="data.tag_key === 'example' || enableAnswer"
      :data="data"
      :enableAnswer="enableAnswer"
    />
  </div>
</template>

<script>
import NoAndBody from './NoAndBody';
import AnswerAndAnalysis from './AnswerAndAnalysis';
import { parser } from '../../common/utils'
export default {
  name: 'QuestionBase',
  components: { NoAndBody, AnswerAndAnalysis },
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
  methods: {
    parser,
  },
};
</script>

<style lang="scss" scoped></style>
