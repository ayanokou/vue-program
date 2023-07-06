<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column v-for="(value,key) in tableData[0]" :prop="key" :label="key" />
    <!-- <el-table-column prop="label" label="姓名"></el-table-column>
    <el-table-column prop="value" label="性别"></el-table-column> -->

  </el-table>
    <!-- 表格组件 -->
<!--    <el-table :data="currentTableData" border style="width: 100%">-->
<!--        <el-table-column prop="index" label="序号" /> &lt;!&ndash; 序号列 &ndash;&gt;-->
<!--        <el-table-column prop="codeInfo" label="编码信息" /> &lt;!&ndash; 编码信息列 &ndash;&gt;-->
<!--        <el-table-column prop="codeState" label="码状态" /> &lt;!&ndash; 码状态列 &ndash;&gt;-->
<!--        <el-table-column prop="centerX" label="中心X" /> &lt;!&ndash; 中心X列 &ndash;&gt;-->
<!--        <el-table-column prop="centerY" label="中心Y" /> &lt;!&ndash; 中心Y列 &ndash;&gt;-->
<!--        <el-table-column prop="codeAngle" label="码角度" /> &lt;!&ndash; 码角度列 &ndash;&gt;-->
<!--        <el-table-column prop="PPM" label="PPM" /> &lt;!&ndash; PPM列 &ndash;&gt;-->
<!--    </el-table>-->
    <!-- <table class="table">
        <thead>
        <tr>
            <th v-for="(value, key) in normalizedTargetData[0]" :key="key">{{ key }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in normalizedTargetData" :key="index">
            <td v-for="(value, key) in item" :key="key">{{ value }}</td>
        </tr>
        </tbody>
    </table> -->

</template>


<script>
import {mapState} from "vuex";
export default{
    data(){
        return {
            tableData:[
            ]
        }
    },
    computed:{
        ...mapState(['currentNode','runResults','showCurrentResult'])
    },
    watch:{
        showCurrentResult(newValue){
          if(newValue){
            this.tableData=this.normalizeData(this.currentNode.tabIndex,this.currentNode.nodeId)
            this.$store.commit('showCurrentResultEvent',false)
          }
        }
        
    },
    methods:{
        //格式化数据
        normalizeData(tabIndex, nodeId) {
          let results=this.runResults.find(item=>item.tab_index===tabIndex).results.find(item=>item.id===nodeId).outResults
            let ans=[]
            let temp={}
            if(results){
                results=results.filter(item=>item.type!=="Mat")
            }

            results.forEach(item=>{
              if(typeof item.content!="object"){
                temp[item.name]=item.content
              }else{
                for(let key in item.content){
                  temp[item.name+"_"+key]=item.content[key]
                }
              }
            })
            ans.push(temp)
            console.log(ans)
            return ans
        }

    },
    mounted(){




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