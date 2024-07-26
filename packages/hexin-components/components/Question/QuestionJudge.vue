<template>
  <!-- todo  -->
  <QuestionBase :data="data || {}" :enableAnswer="enableAnswer" />
</template>

<script>
import QuestionBase from './QuestionBase';
import QuestionAnswer from './QuestionAnswer.vue';
export default {
  components: { QuestionAnswer, QuestionBase },
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
    const options = 'TF';
    return {
      options: options.split(''),
    };
  },
};
</script>

<style lang="scss" scoped>
$gap: 4px;
$h: 20px;
.judge {
  margin: 0 4px;
}
.doi {
  display: inline-block;
  width: 2rem;
  font-size: 18px;
  line-height: $h;
  font-weight: bold;
  text-align: center;
  vertical-align: top;
}
.option {
  display: inline-block;
  width: $h;
  height: $h;
  margin: 0 $gap $gap + 2px;
  line-height: $h;
  text-align: center;
  color: #4b4b4b;
  border-radius: 4px;
  background: #eee;
  vertical-align: top;

  &.active {
    color: #fff;
    background: #08a7a1;
  }

  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
}
</style>
