<template>
    <el-table :data="conditionData" style="width: 100%">
        <el-table-column label="条件">
            <template #default="scope">
                <el-select v-model="scope.row.expr">
                    <template v-if="scope.row.precision==1">
                        <el-option 
                        v-for="item in conditionIntExpr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                    </template>
                    <template v-if="scope.row.precision==2">
                        <el-option 
                        v-for="item in conditionDoubleExpr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                    </template>
                    
                </el-select>
            </template>
        </el-table-column>
        <el-table-column label="有效范围下限">
            <template #default="scope">
                <el-input-number v-model="scope.row.left" :precision="scope.row.precision" :step="scope.row.step" />
            </template>
        </el-table-column>
        <el-table-column label="有效范围上限">
            <template #default="scope">
                <el-input-number v-model="scope.row.right" :precision="scope.row.precision" :step="scope.row.step" />
            </template>
        </el-table-column>
        <el-table-column align="right">
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

    <el-select v-model="value" placeholder="Select">
        <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
    </el-select>
    <el-button @click="addItem">添加</el-button>
    
</template>

<script>
export default{
    props:['conditionData','conditionIntExpr','conditionDoubleExpr'],
    data(){
        return{
            value:'double',
            options:[
                {
                    value:'double',
                    label:'double'
                },
                {
                    value:'int',
                    label:'int'
                }
            ]
        }
    },
    methods:{
        handleDelete(index,row){

        },
        addItem(){
            let precision=-1
            let step=0
            if(this.value=="double"){
                precision=2
                step=0.01
            }else{
                precision=0
                step=1
            }
            this.conditionData.push({
                expr:'',
                precision:precision,
                step:step,
                left:1,
                right:100
            })
        }
    }
}
</script>