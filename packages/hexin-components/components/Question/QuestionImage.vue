<script>
export default {
  name: 'QuestionImage',
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      originalUrl: '',
      imgHeight: '',
      imgWidth: '',
    };
  },
  async mounted() {
    /**
     * 1.拿到src，根据这个src获取naturalWidth和naturalHeight宽高
     * 2.拿到去除resize的路径
     * 3.重新设置宽高
     */
    const initImage = async () => {
      const imgSize = await this.getImageSize(this.src);
      if (imgSize) {
        const reg = /\/resize,(p|w)_(\d+)/;
        this.originalUrl = this.src.replace(reg, '');
        this.imgHeight = imgSize.height;
        this.imgWidth = imgSize.width;
      }
    };

    await initImage();
  },
  methods: {
    getImageSize(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          const imgStyle = {
            width: `${img.naturalWidth}px`,
            height: `${img.naturalHeight}px`,
          };
          resolve(imgStyle);
        };
        img.onerror = () => {
          resolve(null);
        };
      });
    },
  },
};
</script>

<template>
  <img
    class="c-question-img"
    :src="originalUrl ? originalUrl : src"
    :width="imgWidth ? imgWidth : 'auto'"
    :height="imgHeight ? imgHeight : 'auto'"
    style="vertical-align: middle"
  />
</template>

<style scoped lang="scss"></style>
