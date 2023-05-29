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

    {{generalResult}}

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
            currentTableData:this.currentTableData
        }
    },
    computed:{
        ...mapState(['generalResult'])
    }
}
</script>