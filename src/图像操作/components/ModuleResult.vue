<template>
    <!-- 模块结果表格 -->
    <el-table row-key="id" lazy :data="moduleData" border style="width: 100%">
        <el-table-column prop="paramName" label="参数名称" /> <!-- 参数名称列 -->
        <el-table-column prop="currentResult" label="当前结果" /> <!-- 当前结果列 -->
        <el-table-column prop="globalVariable" label="全局变量" /> <!-- 全局变量列 -->
    </el-table>
</template>

<script>

import {mapState} from "vuex";
let id=0
export default {
    data(){
      return {
          moduleData:[]
      }
    },
    computed:{
        ...mapState(['moduleResultData']),
    },
    watch:{
        moduleResultData(newValue){
            let tmp=JSON.parse(newValue)
            this.markId(tmp)
            this.moduleData=tmp
        }
    },
    methods:{
        markId(data){
            data.forEach(item=>{
                //console.log(item)
                item.id=id++
                if(item.children){
                    this.markId(item.children)
                }
            })
        }
    }
}

</script>
