<template>
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
    <table class="table">
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
    </table>

</template>

<!--<script setup>-->
<!--import { inject } from 'vue';-->
<!--const currentTableData = inject(['currentTableData']) //当前结果显示区组件中注入帮助信息-->
<!--</script>-->
<script>
import {mapState} from "vuex";

export default{
    inject:['currentTableData'],//当前结果显示区组件中注入帮助信息
    data(){
        return {
            currentTableData:this.currentTableData,
            allData:[], //所有数据
            selectedData:[{
            "name":"dst",
            "type":"Mat",
            "content":""
          },
          {
            "name":"dst1",
            "type":"int",
            "content":0
          },
          {
            "name":"point",
            "type":"Point",
            "content":{
              "x":0,
              "y":0
            }
          }],//特定流程里的特定一个模块的数据
            normalizedTargetData:[],//表格里要显示的格式的数据
        }
    },
    computed:{
        ...mapState(['generalResult'])
    },
    methods:{
        currentTargetData(tabIndex, moduleId){
            // 查找指定的 tab_index
            const tabData = this.allData.find((item) => item.tab_index === tabIndex);

            // 如果找到了对应的 tab_data
            if (tabData) {
            // 查找指定的 id
            const resultData = tabData.results.find((item) => item.id === moduleId);
            return resultData.outResults
            }

            return null

        },
        normalizeTargetData(){
            this.selectedData = this.selectedData.filter(item => item.type !== "Mat");
            const Data = this.selectedData.reduce((result, item) => {
                const { name, type, content } = item;
                const keys = Object.keys(content);
                console.log(keys)
                if(keys.length == 0){
                    const newKey = name;
                    const value = content;
                    result[newKey] = value;
                    console.log(keys)
                }
                keys.forEach((key) => {
                    const newKey = name + '_' + key;
                    const value = content[key];
                    result[newKey] = value;
                });
                return result;
            }, {});
            this.normalizedTargetData = [Data]
            console.log(this.normalizedTargetData)
        },
        updateTable(tabIndex, moduleId){
            this.selectedData = this.currentTableData(tabIndex, moduleId)
            this.normalizedTargetData()
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