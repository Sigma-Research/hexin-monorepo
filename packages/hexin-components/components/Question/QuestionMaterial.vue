<template>
  <div>
    <QuestionBase :data="data || {}" :enableAnswer="enableAnswer" />
  </div>
</template>

<script>
import QuestionBase from './QuestionBase';
export default {
  name: 'QuestionMaterial',
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
