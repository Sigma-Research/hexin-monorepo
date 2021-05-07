<template>
  <el-dialog class="c-node-rename" title="标题编辑" :visible="renameDialogVisible.value" :modal="false">
    <el-form :model="renameForm" @submit.native.prevent>
      <el-form-item label>
        <el-input v-model="renameForm.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="()=>{this.renameDialogVisible.value = false;}">取消</el-button>
      <el-button type="primary" size="mini" @click="handleRename">确定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IRenameForm, IRenameDialogVisible } from "../../common/types/form";
import { TNode } from "../../common/types/json";

@Component({
  components: {}
})
export default class EditDialog extends Vue {
  @Prop() public renameDialogVisible!: IRenameDialogVisible;
  @Prop() public renameForm!: IRenameForm;
  @Prop() public source?: TNode;

  public handleRename() {
    this.source.node_name = this.renameForm.name;
    this.source.content.body = `<p>${this.renameForm.name}</p>`;
    (this as any).runClosest({
      vue: this,
      fn: "flattenAgain"
    });
    this.renameDialogVisible.value = false;
  }
}
</script>

<style>
</style>