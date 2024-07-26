import JsonLevelAnalysis from '../components/TitleAnalysisTools/JsonLevelAnalysis.vue';
import JsonTree from '../components/JsonTree/index.vue';
import HxTree from '../components/HxTree/index.vue';
import '../plugins/element';
import json from './json.json';
import CommonList from '../components/CommonList/index.vue'
import CommonNode from '../components/CommonList/CommonNode.vue'
import { flattenJson } from '../common/utils/tree'

export default {
  components: { CommonNode },
  title: 'hexin',
}

export const ChapterAnalysisHandle = () => ({
  components: { JsonLevelAnalysis },
  template: '<JsonLevelAnalysis />',
})

export const CommonListHandle = () => ({
  components: { CommonList, CommonNode },
  data() { return { json: flattenJson(json), expandAll: true } },
  watch: {
  },
  methods: {
  },
  template: `
    <CommonList :nodes="json" :mode="json.length ? 'render-all' :'virtual-list'">
      <template v-slot="{ item, index }">
        <div class="flex">
          <div
            style="width: 10px; height: inherit; margin-right: 10px;"
          />
          <div class="flex-1 edit-item">
            <div>
              <CommonNode :item="item" />
            </div>
          </div>
        </div>
      </template>
    </CommonList>
  `,
})

export const JsonTreeHandle = () => ({
  components: { JsonTree },
  data() { return { json, expandAll: true } },
  template: '<JsonTree :data="json" :expandAll="expandAll" />',
})

export const HxTreeHandle = () => ({
  components: { HxTree },
  data() { return { json, expandAll: true, contextMenu: ['addSon', 'addSibling', 'edit', 'addLevel', 'reduceLevel', 'deleteOne', 'deleteAll'] } },
  template: '<HxTree :data="json" :showCheckbox="true" :contextMenu="contextMenu" :expandAll="expandAll" :showNodeLevel="true" :showContentLevel="true"/>',
})

ChapterAnalysisHandle.story = {
  name: '标题分析组件',
}
CommonListHandle.story = {
  name: '通用列表组件',
}
JsonTreeHandle.story = {
  name: 'Json 树组件',
}
HxTreeHandle.story = {
  name: 'Hexin 树组件',
}
