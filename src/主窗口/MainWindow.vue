<template>
    
    <div class="common-layout">
        <img style="position:absolute;left:0px;top:0px" src="./img/logo_small.png"/>
        <el-container style="height: 100%;">
            <el-header style="padding-left:0px;padding-right:0px;background-color:rgb(8,36,105);">
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" menu-trigger="hover">
                    <el-sub-menu index="1">
                        <template #title><span style="color:aliceblue;">文件</span></template>
                        <el-menu-item v-if="userRole === 'admin'" value="1-1" @click="newSolution"><span style="color:aliceblue;">新建方案</span></el-menu-item>
                        <el-menu-item @click="deleteSolution"><span style="color:aliceblue;">删除方案</span></el-menu-item>
                        <el-menu-item @click="deleteCurrentSolution"><span style="color:aliceblue;">删除当前方案</span></el-menu-item>
                        <el-menu-item @click="openSolution"><span style="color:aliceblue;">打开方案</span></el-menu-item>
                        <el-sub-menu index="1-1" @mouseenter="updateLastOpenSolutions">
                            <template #title><span style="color:aliceblue;">最近打开方案</span></template>
                            <el-menu-item v-for="(item, index) in lastOpenSolutions" :key="index" @click="openSelectedSolution(item.name)"><span style="color:aliceblue;">{{ item.name }}</span></el-menu-item>
                        </el-sub-menu>
                        <el-menu-item id="openExample"><span style="color:aliceblue;">打开示例</span></el-menu-item>
                        <el-menu-item id="saveSolution" @click="saveSolution"><span style="color:aliceblue;">保存方案</span></el-menu-item>
                        <el-menu-item id="saveSolutionAs" @click="saveSolutionAs"><span style="color:aliceblue;">方案另存为</span></el-menu-item>
                        <el-menu-item id="importFlow" @click="importFlow"><span style="color:aliceblue;">导入流程</span></el-menu-item>
                        <el-menu-item id="export"><span style="color:aliceblue;">导出Java/C++/Python</span></el-menu-item>
                        <el-menu-item id="exit" @click="logout"><span style="color:aliceblue;">退出</span></el-menu-item>
                    </el-sub-menu>

                    
                    <el-menu-item id="project"><span style="color:aliceblue;">工程</span></el-menu-item>
                    

                    <el-sub-menu index="2">
                        <template #title><span style="color:aliceblue;">设置</span></template>
                        <el-menu-item id="setPermission"><span style="color:aliceblue;">权限设置</span></el-menu-item>
                        <el-menu-item id="setSoftware"><span style="color:aliceblue;">软件设置</span></el-menu-item>
                        <el-menu-item id="setSolution"><span style="color:aliceblue;">方案设置</span></el-menu-item>
                    </el-sub-menu>

                    <el-sub-menu index="3">
                        <template #title><span style="color:aliceblue;">系统</span></template>
                        <el-menu-item id="manageCommunication"><span style="color:aliceblue;">通信管理</span></el-menu-item>
                        <el-menu-item id="manageCamera"><span style="color:aliceblue;">相机管理</span></el-menu-item>
                    </el-sub-menu>

                    <el-sub-menu index="4">
                        <template #title><span style="color:aliceblue;">工具</span></template>
                        <el-menu-item id="createCalibrationBoot"><span style="color:aliceblue;">创建一键标定引导</span></el-menu-item>
                        <el-menu-item id="calibrationBoardGenerationTool"><span style="color:aliceblue;">标定板生成工具</span></el-menu-item>
                    </el-sub-menu>

                    <el-sub-menu index="5">
                        <template #title><span style="color:aliceblue;">其他</span></template>
                        <el-menu-item id="about" ><span style="color:aliceblue;">关于</span></el-menu-item>
                        <el-menu-item id="help"><span style="color:aliceblue;">帮助</span></el-menu-item>
                        <el-menu-item id="logs"><span style="color:aliceblue;">日志</span></el-menu-item>
                    </el-sub-menu>

                    <el-sub-menu index="6">
                        <template #title><span style="color:aliceblue;">云端</span></template>
                        <el-menu-item id="help" @click="dialogVisible = true"><span style="color:aliceblue;">文件操作</span></el-menu-item>
                        <el-menu-item id="logs"><span style="color:aliceblue;">日志</span></el-menu-item>
                        
                    </el-sub-menu>


<!--                    <el-sub-menu index="5">-->
<!--                        <template #title><span style="color:aliceblue">布局</span></template>-->
<!--                        <el-menu-item @click="layout(0)"><span style="color:aliceblue;">布局一</span></el-menu-item>-->
<!--                        <el-menu-item @click="layout(1)"><span style="color:aliceblue;">布局二</span></el-menu-item>-->
<!--                        <el-menu-item @click="layout(2)"><span style="color:aliceblue;">布局三</span></el-menu-item>-->
<!--                    </el-sub-menu>-->

                </el-menu>

                <el-menu :default-active="activeIndex" class="el-menu-demo1" mode="horizontal" @select="handleSelect">

                    <el-menu-item title="撤销" id="revocation" index="1">
                        <el-icon style="color:aliceblue;">
                            <Back />
                        </el-icon>
                    </el-menu-item>
                    <el-menu-item title="重做" id="redo" index="2">
                        <el-icon style="color:aliceblue;">
                            <RefreshLeft />
                        </el-icon>
                    </el-menu-item>
                    <el-menu-item title="单次运行" id="singleRun" index="3">
                        <el-icon style="color:aliceblue;">
                            <Right />
                        </el-icon>
                    </el-menu-item>
                    <el-menu-item title="局部运行" id="localRun" index="4">
                        <el-icon style="color:aliceblue;">
                            <CaretRight />
                        </el-icon>
                    </el-menu-item>
                    <el-menu-item title="循环运行" id="circleRun" index="5">
                        <el-icon style="color:aliceblue;">
                            <Refresh />
                        </el-icon>
                    </el-menu-item>
                    <el-menu-item title="停止" id="stop" index="6">
                        <el-icon style="color:aliceblue;">
                            <CircleClose />
                        </el-icon>
                    </el-menu-item>
                    <el-menu-item title="全局变量" id="globalVariable" index="7">
                        <el-icon style="color:aliceblue;">
                            <Notification />
                        </el-icon>
                    </el-menu-item>
                    <el-menu-item title="全局触发" id="globalTrigger" index="8">
                        <el-icon style="color:aliceblue;">
                            <ZoomOut />
                        </el-icon>
                    </el-menu-item>
                    <el-menu-item title="全局脚本" id="globalScript" index="9">
                        <el-icon style="color:aliceblue;">
                            <Remove />
                        </el-icon>
                    </el-menu-item>
                    <el-menu-item title="运行界面" id="runningInterface" index="10">
                        <el-icon style="color:aliceblue;">
                            <ChatSquare />
                        </el-icon>
                    </el-menu-item>
                </el-menu>

            </el-header>


            <el-main class="main-window-content">

                <component :is="mainLayout" :compnts="compnts" :height_right="height_right"></component>

            </el-main>
        </el-container>
        <el-dialog
            v-model="dialogVisible"
            title="Tips"
            width="30%"
            :before-close="handleClose"
        >
            <span>This is a message</span>
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="dialogVisible = false">
                Confirm
                </el-button>
            </span>
            </template>
        </el-dialog>
    </div>

</template>


<script src="./js/mainWindow.js">

</script>

<style>
.el-overlay-dialog {
    pointer-events: none;
}

.el-dialog {
    pointer-events: auto;
}

.el-header {
    --el-header-height: 80px;
}

.common-layout {
    height: 100%;
}

ul.el-menu.el-menu--horizontal.el-menu-demo {
    background-color: rgb(8, 36, 105);
    margin-right: 0;
    height: 40%;
    width: 94%;
    border-bottom: 1px solid #f6f2f2;
    position: relative;
    left: 6%;
}

.el-menu-demo1 span {
    height: 100%;
}

ul.el-menu.el-menu--horizontal.el-menu-demo :hover {
    background-color: rgb(121, 187, 255);
}

:root {
    --el-color-primary-light-9: rgb(8, 36, 105);
    --el-color-primary: rgb(8, 36, 105);
    --el-menu-bg-color: white;
    --el-menu-hover-bg-color: rgb(121, 187, 255);
}

.el-menu--horizontal .el-menu .el-menu-item,
.el-menu--horizontal .el-menu .el-sub-menu__title {
    background-color: rgb(8, 36, 105);
}

.el-main {
    padding: 0px;
}

ul.el-menu.el-menu--horizontal.el-menu-demo1 {
    background-color: rgb(8, 36, 105);
    margin-right: 0;
    height: 60%;
    width: 94%;
    border-bottom: 0px;
    position: relative;
    left: 6%;
}

ul.el-menu.el-menu--horizontal.el-menu-demo1 :hover {
    background-color: rgb(121, 187, 255);
}
</style>