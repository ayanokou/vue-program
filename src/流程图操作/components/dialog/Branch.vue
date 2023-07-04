<template>
    <el-table :data="branchData" style="width: 100%">
        <el-table-column label="" prop="nodeId"/>
        
        <el-table-column label="条件输入值">
            <template #default="scope">
                <el-input v-model="scope.row.valueId"/>
            </template>
        </el-table-column>
        
    </el-table>
    
</template>

<script>
export default {
    props:['branchData'],
    data(){
        return {

        }
    },
    computed:{
    },
    methods:{

    }
}
</script>