<template>
  <div class="flex a-center">
    <div class="m-r-5">{{ data.letter }}.</div>
    <div v-html="parser(data.option)"></div>
  </div>
</template>

<script>
import { parser , tiff2Jpg} from '../../common/utils';
export default {
  name: 'QuestionChoiceItem',
  data() {
    return {
      data: {},
    };
  },
  methods: {
    parser,
  },
};
</script>
