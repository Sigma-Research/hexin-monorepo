<template>
  <div class="c-user-select">
    <el-select
      @change="selectChange"
      filterable
      clearable
      v-model="value"
      placeholder="请选择"
    >
      <el-option
        v-for="item in users"
        :key="item.userId"
        :label="item.userDescription"
        :value="item.userId"
      >
        <el-tooltip
          class="item"
          effect="light"
          :content="item.userDescription"
          v-show="item.roleDescription.length > 11"
          placement="right-start"
        >
          <div class="c-box-content">
            <span style="width: 30%">{{ item.nickname }}</span>
            <span class="right-box">{{ item.roleDescription }}</span>
          </div>
        </el-tooltip>

        <div class="c-box-content" v-show="item.roleDescription.length <= 11">
          <span style="width: 30%">{{ item.nickname }}</span>
          <span class="right-box">{{ item.roleDescription }}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>
<script lang="ts">
import { IUserType, IRole } from './user'
import { Component, Prop, Vue } from 'vue-property-decorator'
import mock from './mock'

@Component
export default class UserSelect extends Vue {
  @Prop({ default: mock })
  public data!: IUserType[]

  async mounted() {
    await this.init()
  }

  private users: IUserType[] = []

  init() {
    this.users = this.data.map((item: IUserType) => {
      item.roleDescription = ''
      if (item.role) {
        item.roleDescription += item.role
          .map((item: IRole) => {
            return item.name
          })
          .join('、')
        item.userDescription = item.nickname + '：' + item.roleDescription
      }
      return item
    })
  }

  private value = ''

  public selectChange() {
    this.$emit('getSelectUser', this.value)
  }
}
</script>
<style scoped lang="scss">
.c-box-content {
  display: flex; 
  justify-content: space-between;

  .right-box {
    color: #4a8de9;
    font-size: 13px;
    width: 70%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.el-input__inner {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>