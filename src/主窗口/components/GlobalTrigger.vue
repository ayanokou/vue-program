<template>
    <el-dialog v-model="dialogVisibleGlobalVar" title="Tips" width="70%" >
        <template #header>
            全局触发
        </template>

        <el-button @click="addItem()">添加变量</el-button>
        <el-table :data="globalTrigger" style="width: 100%">
            <el-table-column label="序号" prop="id"/>
            <el-table-column label="触发事件">
                <template #default="scope">
                    <el-input v-model="scope.row.Triggerevent"/>
                </template>
            </el-table-column>
            <el-table-column label="触发命令类型">
                <template #default="scope">
                    <el-select v-model="scope.row.TriggerType" placeholder="Select">
                        <el-option key="int" label="切换方案" value="切换方案"/>
                        <el-option key="double" label="执行流程" value="执行流程"/>
                        <el-option key="string" label="执行模块" value="执行模块"/>
                        <el-option key="string" label="执行模块动作" value="执行模块动作"/>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="触发配置">
                <template #default="scope">
                    <el-select v-model="scope.row.Triggerconfig" placeholder="Select">
                        <el-option key="int" label="全流程" value="int"/>
                        <el-option key="double" label="流程1" value="double"/>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="操作">
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

export default {
    data() {
        return {
            globalTrigger: [
            {
                id: 1,
                Triggerevent: "", // 添加触发事件的初始值
                TriggerType: "", // 添加触发命令类型的初始值
                Triggerconfig: "" // 添加触发配置的初始值
            }
            ],
        }
    },

    methods: {
        addItem() {
            const newItem = {
                id: this.globalTrigger.length + 1,
                Triggerevent: "", // 添加触发事件的初始值
                TriggerType: "", // 添加触发命令类型的初始值
                Triggerconfig: "" // 添加触发配置的初始值
                };
                this.globalTrigger.push(newItem);
        },

        handleDelete(index, row) {
            this.tableData.splice(index,1)
        }
    }
}
</script>

<style>
.el-button {
    --el-button-hover-bg-color: rgb(121, 187, 255);
}
</style>