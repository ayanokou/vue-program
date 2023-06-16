<template>
    <el-table :data="branchData" style="width: 100%">
        <el-table-column label="分支模块" prop="model"/>
        <el-table-column label="条件输入值">
            <template #default="scope">
                <el-input v-model="scope.row.id"/>
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
    methods:{

    }
}
</script>