<template>

    <el-container style="height:100%">
        <el-aside style="width:150px;">
            <el-scrollbar>
                <el-menu class="el-menu-vertical" :collapse="true" style="width: 150px; height: 100%;">

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
                                          :id="model_2.name+tab.index">
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                </el-menu>
            </el-scrollbar>
        </el-aside>
        <!--流程图区域-->
        <el-main ref="lfMain" style="height: 100%; padding: 0; overflow:hidden">
            <!-- <div id="runtime-container">
                <span id="runtime">流程用时：{{ timeConsume.flowRunTime }}us</span>
                <span style="margin-right: 20px"></span>
                <span id="runtime">算法用时：{{ timeConsume.algorithmRunTime }}us</span> -->
            <div id="runtime-container"  style="position: absolute; bottom: 20px; left: 0; width: 100%; text-align: center;">
<<<<<<< HEAD
                <span id="runtime" style="display: inline-block;width: 200px">{{ state }}</span>
                <span style="margin-right: 20px"></span>
                <span id="runtime" style="display: inline-block; margin-right: 20px;">流程用时：{{ flowRunTime }}us</span><!-- {{ flowRunTime }} {{ algorithmRunTime }}-->
                <span id="runtime" style="display: inline-block;">算法用时：{{ algorithmRunTime }}us</span>
=======
                <span id="runtime" style="display: inline-block;width: 200px">{{ currentFlowState }}</span>
                <span id="runtime" style="display: inline-block; margin-right: 20px;">流程用时：{{ timeConsume.flowRunTime }}us</span><!-- {{ flowRunTime }} {{ algorithmRunTime }}-->
                <span id="runtime" style="display: inline-block;">算法用时：{{ timeConsume.algorithmRunTime }}us</span>
>>>>>>> 2b48627a455d74d10a6128dc3e83ebdab4585adc
                <span style="margin-right: 20px"></span>
                <span style="display: inline-block;width: 200px">
                    <el-slider v-model="sliderValue"  @change="handleSliderChange" />
                </span>
          
                
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
                            <el-input v-model="formData[index]" :placeholder="item.varExplanation"/>
                        </div>
                        <div
                            v-if="item.defineVarInputWay === 'selectedInputWay'||item.defineVarInputWay === 'smartInputWay'">
                            
                            <el-select v-if="item.varName==='cameraID'" v-model="formData[index]" :placeholder="item.varExplanation" @click="t()">
                                <el-option 
                                    v-for="camera in availableCameras"
                                    :value="camera['deviceId']"
                                    :label="camera['deviceVendorName']+camera['deviceId']"
                                    @click="m.dllPath=dllPaths[camera['deviceVendorName']]"
                                />
                                
                            </el-select>
                            
                            <el-select v-else v-model="formData[index]" :placeholder="item.varExplanation">
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
                    <div v-if="m.modelName == '相机输入'">
                        <el-input v-model="m.dllPath" disabled="true"/>
                    </div>
                </template>
            </el-form>

<!--            <component :is="dialogComponent">-->

            <Branch v-if="dialogBranch" :branchData="branchData"></Branch>
            <Condition v-if="dialogCondition" :conditionData="conditionData" :conditionIntExpr="conditionIntExpr" :conditionDoubleExpr="conditionDoubleExpr"></Condition>
            <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false;formDataSubmit();clear()">Submit</el-button>
            <el-button @click="dialogVisible = false;clear()">Cancel</el-button>
          </span>
            </template>
        </el-dialog>


<!--        <el-dialog v-model="dialogVisibleBranch" :modal="false" :close-on-click-modal="false" :title="operatorData.name"-->
<!--                   width="50%"-->
<!--                   draggable>-->
<!--            <Branch :branchData="branchData"></Branch>-->
<!--            <template #footer>-->
<!--          <span class="dialog-footer">-->
<!--            <el-button type="primary" @click="dialogVisibleBranch = false;formDataSubmit();">Submit</el-button>-->
<!--            <el-button @click="dialogVisibleBranch = false;">Cancel</el-button>-->
<!--          </span>-->
<!--            </template>-->
<!--        </el-dialog>-->

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
  position: fixed;
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