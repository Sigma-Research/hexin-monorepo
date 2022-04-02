<template>
  <div>
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
        :label="item.userDescribe"
        :value="item.userId"
      >
        <el-tooltip
          class="item"
          effect="light"
          :content="item.userDescribe"
          placement="right-start"
        >
          <div style="display: flex; justify-content: space-between">
            <span style="width: 30%">{{ item.nickname }}</span>

            <span class="rightBox">{{ item.roleDescribe }}</span>
          </div>
        </el-tooltip>
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
      item.roleDescribe = ''
      if (item.role) {
        item.roleDescribe += item.role
          .map((item: IRole) => {
            return item.name
          })
          .join('、')
        item.userDescribe = item.nickname + '：' + item.roleDescribe
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
<style lang="scss">
.rightBox {
  color: #4a8de9;
  font-size: 13px;
  width: 70%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.el-input__inner {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>