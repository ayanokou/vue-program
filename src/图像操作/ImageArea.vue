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

// watch(imgBase64, (newVal, oldVal) => {
//     if (showInPicWindow.value) {
//         //canvas标签插入图片
//         let cvs = document.getElementById("cvs");
//         //创建image对象
//         let imgObj = new Image();
//         imgObj.src = newVal;
//         //待图片加载完后，将其显示在canvas上
//         imgObj.onload = function () {
//             let ctx = cvs.getContext('2d');
//             ctx.clearRect(0, 0, cvs.width, cvs.height);
//             ctx.drawImage(this, 0, 0);
//         }
//           //在图片之上绘画
//           var isDrawing = true;
//           var lastX = 100,lastY=100;
//           //var currentX,currentY;
//           var drawType = "circle";
//          // var ctx= document.getElementById("cvs").getContext("2d");
//
//           if (isDrawing) {
//             //ctx.clearRect(0,0,cvs.width,cvs.height);
//             // var currentX = cvs.offsetLeft / 2;
//             // var currentY = cvs.offsetTop / 2;
//             let currentX = 200;
//             let currentY = 200;
//
//             if (drawType === "rect") {
//
//               ctx.beginPath();
//               ctx.rect(lastX, lastY, currentX - lastX, currentY - lastY);
//               ctx.stroke();
//             }
//             else if (drawType === "line") {
//               //ctx.clearRect(0,0,cvs.width,cvs.height);
//               ctx.beginPath();
//               ctx.moveTo(lastX, lastY);
//               ctx.lineTo(currentX, currentY);
//               ctx.stroke();
//             }
//             else if (drawType === "circle") {
//               //ctx.clearRect(0,0,cvs.width,cvs.height);
//               ctx.beginPath();
//               var radius = Math.sqrt(Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2));
//               ctx.arc(lastX, lastY, radius, Math.PI / 4, 2 * Math.PI);
//               ctx.strokeStyle = 'red';
//               ctx.stroke();
//             }
//             else if (drawType === "slot") {
//
//               //先画一条直线
//               ctx.beginPath();
//               ctx.moveTo(lastX, lastY);
//               ctx.lineTo(currentX, lastY);
//               ctx.stroke();
//
//               //再画一条直线
//               ctx.beginPath();
//               ctx.moveTo(lastX, currentY);
//               ctx.lineTo(currentX, currentY);
//               ctx.stroke();
//
//
//               let radiusLeftX = lastX;
//               let radiusLeftY = (lastY + currentY) / 2;
//               let radiusRightX = currentX;
//               let radiusRightY = (lastY + currentY) / 2;
//               let radius = Math.sqrt(Math.pow(currentY - lastY, 2)) / 2;
//
//               //画左半圆
//               ctx.beginPath();
//               ctx.arc(radiusLeftX, radiusLeftY, radius, Math.PI / 2, 3 * Math.PI / 2);
//               ctx.stroke();
//               //画右上半圆
//               ctx.beginPath();
//               ctx.arc(radiusRightX, radiusRightY, radius, 0, Math.PI / 2);
//               ctx.stroke();
//               //画右下半圆
//               ctx.beginPath();
//               ctx.arc(radiusRightX, radiusRightY, radius, Math.PI * 3 / 2, 2 * Math.PI);
//               ctx.stroke();
//             }
//
//
//           }
//
//         }
//
//
//
//
//     else {
//         moduleResultData.value = [
//             {
//                 paramName: "output",
//                 currentResult: newVal,
//                 globalVariable: ""
//             }
//         ]
//     }
// })
//
// onMounted(() => {
//     setInterval(() => {
//         store.commit('setImgBase64', Math.random())
//     }, 1000)
// }
// )

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