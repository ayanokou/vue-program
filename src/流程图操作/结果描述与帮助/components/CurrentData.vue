<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column v-for="(value, key) in tableData[0]" :prop="key" :label="key" />
  </el-table>
</template>


<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      tableData: []
    }
  },
  computed: {
    ...mapState(['currentNode', 'runResults', 'showCurrentResult'])
  },
  watch: {
    showCurrentResult(newValue) {
      if (newValue) {
        this.tableData = this.normalizeData(this.currentNode.tabIndex, this.currentNode.nodeId)
        this.$store.commit('showCurrentResultEvent', false)
      }
    }
  },
  methods: {
    //格式化数据
    normalizeData(tabIndex, nodeId) {
      let ans = []
      let tab_result = this.runResults.find(item => item.tab_index === tabIndex)
      if (!tab_result) return []
      let node_result = tab_result.results.find(item => item.id === nodeId)
      if (!node_result) return []
      let results = node_result.outResults
      if (!results) return []
      results = results.filter(item => item.type !== "Mat")

      let depth = 1
      results.forEach(item => {
        if (Array.isArray(item.content)) {
          depth = depth > item.content.length ? depth : item.content.length
        }
      });
      for (let i = 0; i < depth; i++) {
        let obj = { "序号": i + 1 }
        results.forEach(item => {
          if (Array.isArray(item.content)) {
            if (i >= item.content.length) {
              if (typeof item.content[0] === 'object') {
                for (let key in item.content[0].content) {
                  obj[item.name + '_' + key] = '-'
                }
              } else {
                obj[item.name] = '-'
              }
            } else {
              if (typeof item.content[i] === 'object') {
                for (let key in item.content[i].content) {
                  obj[item.name + '_' + key] = item.content[i].content[key]
                }
              } else {
                obj[item.name] = item.content[i]
              }
            }
          } else {
            if (i == 0) {
              if (typeof item.content === "object") {
                for (let key in item.content) {
                  obj[item.name + '_' + key] = item.content[key]
                }
              } else {
                obj[item.name] = item.content
              }

            } else {

              if (typeof item.content === "object") {
                for (let key in item.content) {
                  obj[item.name + '_' + key] = '-'
                }
              } else {
                obj[item.name] = '-'
              }

            }
          }
        })
        ans.push(obj)
      }
      console.log(ans)
      return ans
    }
  }
}
</script>

<style>
.table {
  border-collapse: collapse;
  width: 100%;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.table th {
  background-color: #f2f2f2;
}

.table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table tr:hover {
  background-color: #ddd;
}
</style>