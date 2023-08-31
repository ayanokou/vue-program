<template>
    <!-- 表格组件 -->
    <el-scrollbar :height="height_">
        <el-table :data="historyResults" border style="width: 100%">
            
            <el-table-column prop="index" label="执行序号"/> <!-- 执行序号列 -->
            <el-table-column prop="time" label="时间"/> <!-- 时间列 -->
            <el-table-column prop="moduleData" label="模块数据"/> <!-- 模块数据列 -->
        </el-table>
    </el-scrollbar>
</template>


<script>
import {mapState} from 'vuex'
import { mapMutations } from 'vuex'
export default {
    data() {
        return {
            height_:(window.innerHeight-80)*29/100-40+"px",
            historyResults:[]
        }
    },
    computed: {
        ...mapState(['runResults'])
    },
    mounted(){
        let elements=document.getElementsByClassName("splitpanes__pane")
        let splitpanes_length=elements.length
        console.log(window.innerHeight-80)


    },
    watch:{
        runResults(newValue){
            //格式化数据
            this.runResults.forEach(tab_result => {
                tab_result.results.forEach(module_result => {
                    let time_stamp=module_result.timeStamp
                    let module_data="模块:"+module_result.id+"状态"+module_result.state+" "

                    module_result.outResults.forEach(out_result => {
                        let content=""
                        if(out_result.type=="Mat"){
                            content="图片数据"
                        }else{

                            if(Array.isArray(out_result.content)){
                                out_result.content.forEach(item=>{
                                    content+=JSON.stringify(item.content)+";"
                                });
                            }else{
                                content=JSON.stringify(out_result.content)
                            }

                        }
                        module_data+=out_result.name+":"+content+" "    
                    })
                    //推到历史数据组中
                    this.historyResults.push({
                        index:this.historyResults.length+1,
                        time:time_stamp,
                        moduleData:module_data
                    })
                })
            });
        }
    },
    methods:{

    }
}
</script>