<template>
    <el-container>
        <el-aside style="width:120px">
            <el-menu class="el-menu-vertical" :collapse="true" style="width: 120px">
                <!--遍历添加算子菜单块-->
                <el-sub-menu v-for="(value, key, index1) in suanzis" :index="index1">
                    <template #title>
                        <el-icon>
                            <location/>
                        </el-icon>
                        {{ key }}
                    </template>
                    <el-menu-item-group>
                        <!--vue 插入元素-->
                        <el-menu-item v-for="(suanziItem, index2) in value" :index="'suanzi' + index1 + '-' + index2"
                                      :id="suanziItem.name">
                        </el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
            </el-menu>
        </el-aside>

        <!--流程图区域-->
        <el-main id="lf" style="height: 100%; padding: 0;"></el-main>

        <el-dialog v-model="dialogVisible" width="50%" draggable>
            <el-form label-width="120px">
                <el-form-item :label="dialogUI.selector.label" v-if="dialogUI.selector.content.length>1">
                    <el-select placeholder="请选择">
                        <el-option>
                        </el-option>
                    </el-select>
                </el-form-item>

                <template v-for="method in dialogUI.methods">
                    <el-form-item v-if="method.test===1" v-for="item in method.methodUI" :label="item.label" required>
                        <div v-if="item.type === 'input'">
                            <label>
                                <input type="text">
                            </label>
                        </div>
                    </el-form-item>
                </template>
            </el-form>
            <!--            <el-form  label-width="120px">-->
            <!--                单选框-->
            <!--                <el-form-item>-->
            <!--                    <div v-if="dialogUI.content.length>0">-->
            <!--                        <label>-->
            <!--                            <el-select v-model="formData[index]" placeholder="请选择">-->
            <!--                                <el-option-->
            <!--                                    v-for="option in item.content"-->
            <!--                                    :key="option.options"-->
            <!--                                    :label="option.options"-->
            <!--                                    :value="option.options"-->
            <!--                                ></el-option>-->
            <!--                            </el-select>-->
            <!--                        </label>-->
            <!--                    </div>-->
            <!--                </el-form-item>-->
            <!--                    <el-form-item v-for="(item,index) in optUI " :label="item.text" required>-->
            <!--&lt;!&ndash;                    <div v-if="item.type === 'checkbox'">&ndash;&gt;-->
            <!--&lt;!&ndash;                        <div v-for="(cont,index2) in item.content">&ndash;&gt;-->
            <!--&lt;!&ndash;                            <label>&ndash;&gt;-->
            <!--&lt;!&ndash;                                <input type="checkbox" name="{{index}}" :value="cont.options" v-model="formData.checkboxes[index2]"/>&ndash;&gt;-->
            <!--&lt;!&ndash;                                {{cont.options}}&ndash;&gt;-->
            <!--&lt;!&ndash;                            </label>&ndash;&gt;-->
            <!--&lt;!&ndash;                        </div>&ndash;&gt;-->
            <!--&lt;!&ndash;                    </div >&ndash;&gt;-->

            <!--&lt;!&ndash;                    <div v-if="item.type === 'radio'">&ndash;&gt;-->
            <!--&lt;!&ndash;                        <div v-for="(cont,index2) in item.content">&ndash;&gt;-->
            <!--&lt;!&ndash;                            <label>&ndash;&gt;-->
            <!--&lt;!&ndash;                                <input type="radio" name="{{index}}" :value="cont.options" v-model="formData.radio"/>&ndash;&gt;-->
            <!--&lt;!&ndash;                                {{cont.options}}&ndash;&gt;-->
            <!--&lt;!&ndash;                            </label>&ndash;&gt;-->
            <!--&lt;!&ndash;                        </div>&ndash;&gt;-->
            <!--&lt;!&ndash;                    </div >&ndash;&gt;-->

            <!--                    <div v-if="item.type === 'input'">-->
            <!--                        <label>-->
            <!--                            <input type="text" v-model="formData[index]">-->
            <!--                        </label>-->
            <!--                    </div>-->

            <!--                    <div v-if="item.type==='dropDownBox'">-->
            <!--                        <label>-->
            <!--                            <el-select v-model="formData[index]" placeholder="请选择">-->
            <!--                                <el-option-->
            <!--                                    v-for="option in item.content"-->
            <!--                                    :key="option.options"-->
            <!--                                    :label="option.options"-->
            <!--                                    :value="option.options"-->
            <!--                                ></el-option>-->
            <!--                            </el-select>-->
            <!--                        </label>-->
            <!--                    </div>-->

            <!--                </el-form-item>-->

            <!--            </el-form>-->

            <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false;formDataSubmit();clear()">Submit</el-button>
            <el-button @click="dialogVisible = false;clear()">Cancel</el-button>
          </span>
            </template>
        </el-dialog>
    </el-container>


</template>

<script src="../js/LogicFlow.js">

</script>

<style>
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