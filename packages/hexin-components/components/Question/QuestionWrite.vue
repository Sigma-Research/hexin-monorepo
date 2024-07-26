<template>
  <div>
    <div class="m-b-8">
      321321
      <span class="doi">题目</span>
      <span class="text">{{ data.title }}</span>
    </div>
    <div class="m-b-8">
      <span class="doi">抬头</span>
      <span class="text">{{ data.header }}</span>
    </div>
    <div class="m-b-8">
      <span class="doi">要求字数</span>
      <span class="text"
        >不少于{{ data.number_lower }}，不多于{{ data.number_upper }}字</span
      >
    </div>
    <div class="m-b-8">
      <span class="doi">满分</span>
      <span class="text">{{ data.score }}</span>
    </div>
    <div class="m-b-8">
      <span class="doi">年纪</span>
      <span class="text">{{ data.grade }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}
.doi {
  display: inline-block;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}
.text {
  padding: 4px 8px;
  border-radius: 4px;
}
</style>
