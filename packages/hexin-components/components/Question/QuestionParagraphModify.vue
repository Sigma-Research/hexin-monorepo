<template>
  <!--  todo -->
  <div class="correction">
    <span class="doi">{{ data.doi }}.</span>
    <span v-html="vhtml" class="text"></span>
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
  computed: {
    vhtml() {
      return this.getVHtml(this.data);
    },
  },
  methods: {
    getVHtml(data) {
      let vhtml = data.body;
      data.answer = data.answer.reverse();
      data.answer.forEach(item => {
        console.log(item.type);
        const start = item.start;
        const end = item.end;
        switch (item.type) {
          case 'insert_before':
            vhtml = this.insertText(vhtml, item.answer, start, end, true);
            break;
          case 'insert_after':
            vhtml = this.insertText(vhtml, item.answer, start, end);
            break;
          case 'replace':
            vhtml = this.replaceText(vhtml, item.answer, start, end);
            break;
          case 'delete':
            vhtml = this.deleteText(vhtml, item.answer, start, end);
            break;
          case 'replace_or_delete':
            vhtml = this.replaceOrDeleteText(vhtml, item.answer, start, end);
            break;
          default:
            break;
        }
      });
      return vhtml;
    },
    insertText(body, text, start, end, isBefore) {
      const classname = isBefore ? 'before' : 'after';
      let { prefix, middle, suffix } = this.getBodyPart({ body, start, end });
      middle = `<span class="insert">${middle}<span class="insert-text ${classname}">${text}</span></span>`;
      return `${prefix}${middle}${suffix}`;
    },
    replaceText(body, text, start, end) {
      let { prefix, middle, suffix } = this.getBodyPart({ body, start, end });
      middle = `<span class="replace">${middle}<span class="replace-text">${text}</span></span>`;
      return `${prefix}${middle}${suffix}`;
    },
    deleteText(body, text, start, end) {
      let { prefix, middle, suffix } = this.getBodyPart({ body, start, end });
      middle = `<span class="delete">${middle}</span>`;
      return `${prefix}${middle}${suffix}`;
    },
    replaceOrDeleteText(body, text, start, end) {
      let { prefix, middle, suffix } = this.getBodyPart({ body, start, end });
      middle = `<span class="delete replace">${middle}<span class="replace-text">或${text}</span></span>`;
      return `${prefix}${middle}${suffix}`;
    },
    getBodyPart({ body, start, end }) {
      const prefix = body.slice(0, start);
      const suffix = body.slice(end, body.length);
      const middle = body.slice(start, end);
      return {
        prefix,
        middle,
        suffix,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
$h: 40px;
.doi {
  display: inline-block;
  width: 2rem;
  font-size: 18px;
  line-height: $h;
  font-weight: bold;
  text-align: center;
  vertical-align: top;
}
.correction {
  $offset: 21px;
  margin-right: 20px;
  margin-bottom: 10px;
  font-size: 18px;
  line-height: 2.3;

  ::v-deep .insert {
    position: relative;

    &-text {
      position: absolute;
      top: $offset;
      right: 0;
      color: red;
      line-height: 1;
      transform: translateX(50%);

      &::before {
        content: "";
        position: absolute;
        top: -5px;
        left: 3px;
        width: 10px;
        height: 10px;
        border-right: 1px solid red;
        border-top: 1px solid red;
        transform: rotate(-45deg);
      }

      &.before {
        right: auto;
        left: 0;
        transform: translateX(-50%);

        &::before {
          left: 0;
        }
      }
    }
  }

  ::v-deep .replace {
    position: relative;
    line-height: 1;
    border-bottom: 2px solid red;
    &-text {
      position: absolute;
      top: $offset;
      left: 50%;
      white-space: nowrap;
      color: red;
      transform: translateX(-50%);
    }
  }

  ::v-deep .delete {
    position: relative;
    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background: red;
      transform: rotate(15deg) translateY($offset / 2);
    }
  }
}
</style>
