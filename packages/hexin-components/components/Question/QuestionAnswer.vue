<template>
  <div>
    <QuestionBase :data="data || {}" :enableAnswer="enableAnswer" />
  </div>
</template>

<script>
import QuestionBase from './QuestionBase';
export default {
  name: 'QuestionAnswer',
  components: {
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
};
</script>

<style lang="scss" scoped>
.others {
  margin-right: 20px;
  line-height: 20px;

  .doi {
    display: inline-block;
    width: 30px;
    margin-right: 4px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    vertical-align: top;
  }
}
</style>
