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
      copyArray:[],
      tableData: []
    }
  },
  computed: {
    ...mapState(['currentNode', 'runResults', 'showCurrentResult'])
  },
  watch: {
    showCurrentResult(newValue) {
      if (newValue) {
        this.mergeRunResults()
        this.tableData = this.normalizeData(this.currentNode.tabIndex, this.currentNode.nodeId)
        this.$store.commit('showCurrentResultEvent', false)
      }
    }
  },
  methods: {
    //整合同一个标签页下，多个同id的节点的数据
    mergeRunResults(){
      this.copyArray = Array.from(this.runResults)
      this.copyArray.forEach(tab=>{
        const merged_results=tab.results.reduce((acc,cur)=>{
          const index=acc.findIndex(item=>item.id===cur.id)
          if(index===-1){
            acc.push({...cur})
          }else{
            acc[index].timeConsume+=cur.timeConsume
            acc[index].outResults=[...acc[index].outResults,...cur.outResults]

          }
          return acc
        },[])
        tab.results=merged_results

        tab.results.forEach(node_result=>{
            if(!node_result.outResults) return
            const merged_outResults=node_result.outResults.reduce((acc2,cur2)=>{
                const index2=acc2.findIndex(item=>item.name===cur2.name)
                console.log('index2:',index2)
                if(index2===-1){
                    acc2.push({...cur2})
                }else{
                    if(!Array.isArray(acc2[index2].content)) 
                        acc2[index2].content=[...[{content:acc2[index2].content}],...[{content:cur2.content}]]
                    else
                        acc2[index2].content=[...acc2[index2].content,...[{content:cur2.content}]]
                }
                return acc2
            },[])
            node_result.outResults=merged_outResults
        })
      }) 
      
    },
    //格式化数据
    normalizeData(tabIndex, nodeId) {
      console.log(this.copyArray)
      let ans = []
      let tab_result = this.copyArray.find(item => item.tab_index === tabIndex)
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
              if (typeof item.content[0].content === 'object') {
                for (let key in item.content[0].content) {
                  obj[item.name + '_' + key] = '-'
                }
              } else {
                obj[item.name] = '-'
              }
            } else {
              console.log(item.content[i])
              if (typeof item.content[i].content === 'object') {
                for (let key in item.content[i].content) {
                  obj[item.name + '_' + key] = item.content[i].content[key]
                }
              } else {
                obj[item.name] = item.content[i].content
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