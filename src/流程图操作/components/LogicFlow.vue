<template>

    <el-container style="height:100%">
        <el-aside style="width:150px;">
            <el-scrollbar>
                <el-menu class="el-menu-vertical" :collapse="true" style="width: 150px; height: 100%;">

                    <!-- <el-sub-menu v-for="(model_1, model_1_name, index1) in suanzis" :index="index1">
                        <template #title>
                            <el-icon style="vertical-align: middle">
                                <Expand/>
                            </el-icon>
                            {{ model_1_name }}
                        </template>

                        <el-space wrap class="second_left_menus_container">
                            <el-button class="second_left_menus" type="primary" v-for="(model_2, index2) in model_1"
                                       :index="'suanzi' + index1 + '-' + index2"
                                       :id="model_2.lfProperties.name"
                                       @click="clickToAddNode(model_2)"
                                       draggable="true" @dragend="dragToAddNode($event, model_2)">
                                       >

                                <template #title>
                                    <el-icon style="vertical-align: middle">
                                        <Expand/>
                                    </el-icon>
                                    {{ model_2.lfProperties.name }}
                                </template>


                            </el-button>

                        </el-space>
                    </el-sub-menu> -->
                    <el-sub-menu v-for="(value, key, index1) in suanzis" :index="index1">
                        <template #title>
                            <el-icon>
                                <location/>
                            </el-icon>
                            {{ key }}
                        </template>
                        <el-menu-item-group class="second_left_menus_container">
                            <!--vue 插入元素-->
                            <el-menu-item v-for="(model_2, index2) in value" :index="'suanzi' + index1 + '-' + index2"
                                          :id="model_2.lfProperties.name+tab.index">
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                </el-menu>
            </el-scrollbar>
        </el-aside>
        <!--流程图区域-->
        <el-main ref="lfMain" style="height: 100%; padding: 0; overflow:hidden">
            <div id="runtime-container">
                <span id="runtime">流程用时：{{ flowRunTime }}us</span><!-- {{ flowRunTime }} {{ algorithmRunTime }}-->
                <span style="margin-right: 20px"></span>
                <span id="runtime">算法用时：{{ algorithmRunTime }}us</span>
            </div>
            <slot></slot>
        </el-main>

        <el-dialog v-model="dialogVisible" :modal="false" :close-on-click-modal="false" :title="operatorData.name"
                   width="50%"
                   draggable>
            <el-form label-width="120px">
                <el-form-item v-if="operatorData.models.length>1" label="类型">
                    <el-select placeholder="选择类型" v-model="modelName">
                        <el-option v-for="model in operatorData.models" :label="model.modelName" :key="model.modelName"
                                   :value="model.modelName">
                        </el-option>
                    </el-select>
                </el-form-item>


                <template v-for="m in operatorData.models">
                    <el-form-item v-if="m.modelName==modelName" v-for="(item,index) in m.inPara" :label="item.varName">
                        <div v-if="item.defineVarInputWay === 'directInputWay'">
                            <el-input v-model="formData[index]"/>
                        </div>
                        <div
                            v-if="item.defineVarInputWay === 'selectedInputWay'||item.defineVarInputWay === 'smartInputWay'">
                            <el-select v-model="formData[index]" placeholder="Select">
                                <el-option
                                    v-for="(value,key) in item.comboList"
                                    :key="key"
                                    :label="key"
                                    :value="value"
                                />
                            </el-select>
                        </div>




                        <div v-if="item.defineVarInputWay === 'fileInputWay'">
                            <input @change="readFile(index)" type="file"  accept="image/*" id="imgUrl">
                        </div>



                    </el-form-item>
                </template>


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
                <el-table-column prop="type" label="type" width="120"/>
                <el-table-column fixed="right" label="Remove" width="120">
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

                    <el-form-item label="变量类型">
                        <el-select v-model="tableForm[2]" placeholder="字面值必选变量类型">
                            <el-option key="整型" label="整型" value="int"/>
                            <el-option key="浮点型" label="浮点型" value="double"/>
                            <el-option key="字符串" label="字符串" value="string"/>
                        </el-select>
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
        <el-dialog v-model="dialogVisiblePersist" :modal="false" :close-on-click-modal="false" :title="modelID"
                   width="25%"
                   draggable>
            <el-table :data="tableDataPersist" style="width: 100%" max-height="250">
                <el-table-column prop="name" label="Name" width="120"/>
                <el-table-column prop="value" label="Value" width="120"/>
                <el-table-column prop="type" label="type" width="120"/>
                <el-table-column fixed="right" label="Remove" width="120">
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
            <el-button class="mt-4" style="width: 100%" @click="onAddItemPersist"
            >Add Item
            </el-button
            >

            <el-dialog
                v-model="innerVisiblePersist"
                width="30%"
                title="增添持久变量"
                append-to-body :modal="false" :close-on-click-modal="false" draggable
            >
                <el-form label-width="120px">
                    <el-form-item label="变量名称">
                        <el-input v-model="tableFormPersist[0]"/>
                    </el-form-item>


                    <el-form-item label="变量来源">
                        <el-input v-model="tableFormPersist[1]"/>
                    </el-form-item>

                    <el-form-item label="变量类型">
                        <el-select v-model="tableFormPersist[2]" placeholder="字面值必选变量类型">
                            <el-option key="整型" label="整型" value="int"/>
                            <el-option key="浮点型" label="浮点型" value="double"/>
                            <el-option key="字符串" label="字符串" value="string"/>
                        </el-select>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button type="primary"
                                   @click="innerVisiblePersist = false;addItemPersist()">Submit</el-button>
                        <el-button @click="innerVisiblePersist = false;">Cancel</el-button>
                    </span>
                </template>
            </el-dialog>
            <template #footer>
                    <span class="dialog-footer">
                        <el-button type="primary"
                                   @click="dialogVisiblePersist = false;submitPersist()">Submit</el-button>
                        <el-button @click="dialogVisiblePersist = false;">Cancel</el-button>
                    </span>
            </template>
        </el-dialog>

        <el-dialog v-model="dialogVisibleConditionalEdge" :modal="false" :close-on-click-modal="false" :title="modelID"
                   width="50%"
                   draggable>
            <el-form label-width="120px">

                <el-form-item label="选择Y,N边">
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
            <el-button type="primary"
                       @click="dialogVisibleConditionalEdge = false;edgeConditionalSubmit();">Submit</el-button>
            <el-button @click="dialogVisibleConditionalEdge = false;">Cancel</el-button>
          </span>
            </template>
        </el-dialog>

        <el-dialog v-model="dialogVisibleSwitchEdge" :modal="false" :close-on-click-modal="false" :title="modelID"
                   width="50%"
                   draggable>
            <el-form label-width="120px">

                <el-form-item label="编辑switch文本">
                    <div>
                        <el-input v-model="switchEdge"/>
                    </div>
                </el-form-item>
            </el-form>
            <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="dialogVisibleSwitchEdge = false;edgeSwitchSubmit();">Submit</el-button>
            <el-button @click="dialogVisibleSwitchEdge = false;">Cancel</el-button>
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

/*设置样式 让按钮一行最多放三个*/
.second_left_menus_container {
    width: 288px;
    user-select: none;
}

.second_left_menus {
    width: 80px;
}

.third_menus {
    width: 110px;
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

#runtime-container {
    position: absolute;
    top: 10px; /* 距离顶部的距离 */
    left: 15%; /* 距离左侧的距离 */
    z-index: 999; /* 将其z-index设置为比流程图更高的值 */
}

#runtime {
    display: inline-block;
    width: 150px; /* 控制显示时间的小方块的宽度 */
    height: 20px; /* 控制显示时间的小方块的高度 */
    background-color: rgba(119, 76, 187, 0.452); /* 设置小方块的背景色，半透明 */
    color: #fff; /* 设置小方块中文字的颜色 */
    font-size: 14px; /* 控制小方块中文字的大小 */
    text-align: center; /* 设置小方块中文字居中 */
    line-height: 20px; /* 控制小方块中文字的行高，使其居中显示 */
    border-radius: 4px; /* 设置小方块的圆角 */
}
</style>