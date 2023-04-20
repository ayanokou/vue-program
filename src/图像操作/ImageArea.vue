<template>
    <div style="position: relative;">
        <el-switch style="position: absolute; right:5px; top:5px; z-index: 1;" v-model="showInPicWindow" active-text="显示为图像"
            inactive-text="显示为模块结果"></el-switch>
    </div>
    <el-tabs class="img-area-pane" v-model="activeName" @tab-click="handleClick" style="height: 100%;">
        <el-tab-pane label="图像展示区" name="first" style="height:100%;"> 
            <el-scrollbar> 
                <PicWindow></PicWindow> 
            </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="模块结果" name="second">
            <ModuleResult :moduleResultData="moduleResultData"></ModuleResult> 
        </el-tab-pane>
    </el-tabs>
</template>
<script setup>

import PicWindow from './components/PicWindow.vue' //图像显示区组件
import ModuleResult from "@/图像操作/components/ModuleResult.vue"; //模块结果显示区组件
import { ref, watch, computed, onMounted } from "vue";
import { useStore } from 'vuex';
const activeName = ref('first')     //当前选中标签页
const showInPicWindow = ref(true)
const moduleResultData = ref([])

const store = useStore()

const imgBase64 = computed(() => store.state.imgBase64)

watch(imgBase64, (newVal, oldVal) => {
    if (showInPicWindow.value) {
        //canvas标签插入图片
        let cvs = document.getElementById("cvs");
        //创建image对象
        let imgObj = new Image();
        imgObj.src = newVal;
        //待图片加载完后，将其显示在canvas上
        imgObj.onload = function () {
            let ctx = cvs.getContext('2d');
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            ctx.drawImage(this, 0, 0);
        }
        //在图片之上绘画
    }
    else {
        moduleResultData.value = [
            {
                paramName: "output",
                currentResult: newVal,
                globalVariable: ""
            }
        ]
    }
})

onMounted(() => {
    setInterval(() => {
        store.commit('setImgBase64', Math.random())
    }, 1000)
})

</script>

<style>
.img-area-pane.el-tabs.el-tabs--top {
    display: flex;
    flex-direction: column;
}

.img-area-pane.el-tabs__content {
    flex: 1;
}
</style>