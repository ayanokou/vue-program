<template>
    <el-dialog v-model="dialogVisibleGlobalVar" title="Tips" width="70%" @close="close()">
        <template #header>
            全局变量
        </template>

        <el-button @click="addItem()">添加变量</el-button>
        <el-button @click="saveAllVars()">保存变量</el-button>
        <el-table :data="filterTableData" style="width: 100%">
            <el-table-column label="序号" prop="id"/>
            <el-table-column label="Name">
                <template #default="scope">
                    <el-input v-model="scope.row.name"/>
                </template>
            </el-table-column>
            <el-table-column label="注释">
                <template #default="scope">
                    <el-input v-model="scope.row.explanation"/>
                </template>
            </el-table-column>
            <el-table-column label="类型">
                <template #default="scope">
                    <el-select v-model="scope.row.type" placeholder="Select">
                        <el-option key="int" label="int" value="int"/>
                        <el-option key="double" label="double" value="double"/>
                        <el-option key="string" label="string" value="string"/>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="当前值">
                <template #default="scope">
                    <el-input v-model="scope.row.value"/>
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search"/>
                </template>
                <template #default="scope">
                    <el-button
                        size="small"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)"
                    >Delete
                    </el-button>
                </template>
            </el-table-column>
        </el-table>


        <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">Cancel</el-button>
        <el-button type="primary" @click="close">
          Confirm
        </el-button>
      </span>
        </template>
    </el-dialog>
</template>

<script>
import {mapState} from "vuex";

export default {
    data() {
        return {
            tableData: [],
            search: '',
        }
    },
    computed: {
        ...mapState(['dialogVisibleGlobalVar']),
        filterTableData() {
            return this.tableData.filter(
                (data) =>
                    !this.search ||
                    data.name.toLowerCase().includes(this.search.toLowerCase())
            )
        }
    },
    mounted() {
    },
    methods: {
        close() {
            this.$store.commit('setDialogVisibleGlobalVar', false)
        },
        addItem() {
            let newItem={
                id:-1,
                name:'default',
                explanation:'',
                type:'int',
                value:'0'
            }
            newItem.id=this.tableData.length+1
            newItem.name="var"+newItem.id
            this.tableData.push(newItem)

        },
        saveAllVars() {
            let payload={
                trigger:true,
                mode:"SaveGlobalVar",
                data:JSON.stringify(this.tableData)
            }
            this.$store.commit("setSocketEmit",payload)
        },
        handleDelete(index, row) {
            this.tableData.splice(index,1)
        }
    }
}
</script>


<style scoped>
.el-button {
    --el-button-hover-bg-color: rgb(121, 187, 255);
}
</style>