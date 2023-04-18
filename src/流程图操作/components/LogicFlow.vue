<template>
    <el-container>
        <el-aside style="width:120px">
            <el-menu class="el-menu-vertical" :collapse="true" style="width: 120px">

                <el-sub-menu v-for="(model_1, index1) in suanzis.models" :index="index1">
                    <template #title>
                        <el-icon style="vertical-align: middle">
                            <Expand/>
                        </el-icon>
                        {{ model_1.lfProperties.name }}
                    </template>

                    <el-space warp>
                        <el-button type="primary" v-for="(model_2, index2) in model_1.models"
                                   :index="'suanzi' + index1 + '-' + index2"
                                   @click="dialogControl[model_2.lfProperties.name]=true;clickLeftMenu()">

                            {{ model_2.lfProperties.name }}

                            <el-dialog v-model="dialogControl[model_2.lfProperties.name]" width="30%" :modal="false"
                                       :close-on-click-modal="false" draggable append-to-body="true" modal="false">

                                <template #title>
                                    {{ model_2.lfProperties.name }}
                                </template>
                                <el-space wrap>
                                    <el-button type="primary" :icon="Place" v-for="(model_3, index3) in model_2.models"
                                               :index="'suanzi' + index1 + '-' + index2 + '-' + index3"
                                               :id="model_3.lfProperties.name"
                                               @click="dialogControl[model_2.lfProperties.name]=false;clickToAddNode(model_3)"
                                               draggable="true" @dragend="dragToAddNode($event, model_3)">
                                        {{ model_3.lfProperties.name }}
                                    </el-button>

                                </el-space>

                            </el-dialog>

                        </el-button>

                    </el-space>


                </el-sub-menu>
            </el-menu>
        </el-aside>

        <!--流程图区域-->
        <el-main ref="lfMain" style=":height: 100%; padding: 0;">
            <slot></slot>
        </el-main>

        <el-dialog v-model="dialogVisible" :modal="false" :close-on-click-modal="false" :title="modelID" width="50%"
                   draggable>
            <el-form label-width="120px">

                <el-form-item v-for="(item,index) in dialogUI" :label="item.varName">
                    <div v-if="item.defineInputWay === 'directInputWay'">
                        <el-input v-model="formData[index]"/>
                    </div>
                    <div v-if="item.defineInputWay === 'selectedInputWay'">
                        <el-select v-model="formData[index]" placeholder="Select">
                            <el-option
                                v-for="(value,key) in item.selectContent"
                                :key="key"
                                :label="key"
                                :value="value"
                            />
                        </el-select>
                    </div>
                </el-form-item>
            </el-form>
            <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false;formDataSubmit();clear()">Submit</el-button>
            <el-button @click="dialogVisible = false;clear()">Cancel</el-button>
          </span>
            </template>
        </el-dialog>
        <el-dialog v-model="dialogVisibleGV" :modal="false" :close-on-click-modal="false" :title="modelID" width="25%"
                   draggable>
            <el-table :data="tableData" style="width: 100%" max-height="250">
                <el-table-column prop="name" label="Name" width="120"/>
                <el-table-column prop="value" label="Value" width="120"/>
                <el-table-column fixed="right" label="Operations" width="120">
                    <template #default="scope">
                        <el-button
                            link
                            type="primary"
                            size="small"
                            @click.prevent="deleteRow(scope.$index)"
                        >
                            Remove
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button class="mt-4" style="width: 100%" @click="onAddItem"
            >Add Item
            </el-button
            >

            <el-dialog
                v-model="innerVisible"
                width="30%"
                title="增添全局变量"
                append-to-body :modal="false" :close-on-click-modal="false" draggable
            >
                <el-form label-width="120px">
                    <el-form-item label="变量名称">
                        <el-input v-model="tableForm[0]"/>
                    </el-form-item>

                    <el-form-item label="变量来源">
                        <el-input v-model="tableForm[1]"/>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button type="primary" @click="innerVisible = false;addItem()">Submit</el-button>
                        <el-button @click="innerVisible = false;">Cancel</el-button>
                    </span>
                </template>
            </el-dialog>
            <template #footer>
                    <span class="dialog-footer">
                        <el-button type="primary" @click="dialogVisibleGV = false;submitGV()">Submit</el-button>
                        <el-button @click="dialogVisibleGV = false;">Cancel</el-button>
                    </span>
            </template>
        </el-dialog>
        <el-dialog v-model="dialogVisibleEdge" :modal="false" :close-on-click-modal="false" :title="modelID" width="50%"
                   draggable>
            <el-form label-width="120px">

                <el-form-item  label="选择Y,N边">
                    <div>
                        <el-select v-model="yorn" placeholder="Select">
                            <el-option
                                key="Y"
                                label="Y"
                                value="Y"
                            />
                            <el-option
                                key="N"
                                label="N"
                                value="N"
                            />
                        </el-select>
                    </div>
                </el-form-item>
            </el-form>
            <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="dialogVisibleEdge = false;edgeSubmit();">Submit</el-button>
            <el-button @click="dialogVisibleEdge = false;">Cancel</el-button>
          </span>
            </template>
        </el-dialog>

    </el-container>


</template>

<script src="../js/LogicFlow.js">

</script>

<style scoped>

.el-menu-vertical:not(.el-menu--collapse) {
    width: 180px;
    min-height: 400px;
}

.el-sub-menu__title el-tooltip__trigger {
    padding-left: 10px
}

.el-menu--popup {
    min-width: 180px;
    width: 180px;
}

.el-menu-item {
    display: inline-table;
    padding: 2px;
    width: 57px;
    min-width: 57px;
}

.lf-dnd-text {
    font-size: 5px;
    font-weight: bold;
    height: 30px;
}

.lf-mini-map-header {
    visibility: hidden;
}

/* 禁用侧边栏文字选中*/
.lf-dnd-text {
    user-select: none;
    /* CSS3属性 */
}
</style>