<template>
  <!-- todo -->
  <QuestionBase :data="data || {}" :enableAnswer="enableAnswer" />
</template>

<script>
import QuestionBase from './QuestionBase';
export default {
  components: { QuestionBase },
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
