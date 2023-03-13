<template>
    <div>
        <div class="head-btn-box">
            <el-button icon="zoom-in" @click="toBIgChange"></el-button>
            <el-button icon="zoom-out" @click="toSmallChange"></el-button>
            <el-button icon="RefreshLeft" @click="toReset"></el-button>
            <el-button icon="FullScreen" @click="onPreview"></el-button>
            <el-button icon="getUrl" @click="getUrl">网络请求</el-button>
            <input type="file" id="saveImage" name="myphoto" accept="image/png,image/gif,image/jpeg"
                   ref="imgUrl">
            <el-button icon="getUrl" @click="socketioPic">socketio测试(PIC)</el-button>
        </div>

        <div id="result">
<!--            <img :src="imgBase64" alt="" />-->
            <canvas id="cvs"  width="1024" height="768" style="border:1px solid #ccc;margin:20px auto;display: block;">
                当前浏览器不支持canvas
                <!-- 如果浏览器支持canvas，则canvas标签里的内容不会显示出来 -->
            </canvas>
        </div>
<!--        <img-->
<!--            :src="imgUrl"-->
<!--            alt="a cat"-->
<!--            id="img"-->
<!--            :style="{transform:'scale('+multiples+')'}"-->
<!--        />-->
<!--      <span>{{imgUrl}}</span>-->
<!--        <el-image-viewer-->
<!--            v-if="showViewer"-->
<!--            :src="imgUrl"-->
<!--            :on-close="closeViewer"/>-->
    </div>
</template>

<script src="../js/picWindow.js">
</script>



<style scoped>
.head-btn-box {
    margin-bottom: 20px;
}
.img {
    width: 200px;
}

</style>


