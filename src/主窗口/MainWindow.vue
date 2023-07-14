<template>
    <NetworkManager v-model="networkManagerVisible"/>
    <SoftwareSet v-model="softwareSetVisible" :test="test"></SoftwareSet>
    <About v-model="aboutVisible"></About>
    <HelpDoc v-model="helpDocVisible"></HelpDoc>
    <el-dialog title="设备管理" v-model="subCommunicationManagementVisible" :modal="false"
        :close-on-click-modal="false"
        custom-class="custom-dialog-little"
        draggable>
    <div class="right-column" style="height: 90%;">
        <el-row :gutter="20" class="row-container">
            <el-col :span="24">
                <el-row class="content-head" style="flex: 4;">
                    <el-col>通信参数</el-col>
                    <div class="content-row">
                        <p class="content">协议类型</p>
                        <el-select class="input" v-model="selectedOption" placeholder="请选择" @change="updateContent">
                        <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value"></el-option>
                    </el-select>
                    </div>
                    <div class="content-row">
                        <p class="content">设备名称</p>
                        <el-input class="input" v-model="deviceName" placeholder="请输入设备名称"></el-input>
                    </div>
                </el-row>
                <el-row class="content-head" style="flex:6; border-top: 1px solid #ccc;">
                    <el-col>下部分内容</el-col>
                    <div v-if="selectedOptionContent === 'tcp'">
                        <div class="content-row">
                            <p class="content" >目标ip</p>
                            <el-input
                              class="input"
                              v-model="ip"
                              placeholder="xxx.xxx.xxx.xxx"
                              @input="validateIP"
                            />
                        </div>
                        <span class="content" v-if="!isIPValid" style="color: red;">请输入合法的 IP 地址</span>
                        <div class="content-row">
                            <p class="content" >目标端口</p>
                            <el-input
                              class="input"
                              v-model="portNumber"
                              @input="filterInput"
                            />
                        </div>
                        <el-radio-group v-model="updataValue">
                            <p class="content">数据上传</p>
                            <el-radio :label="true" class="content">True</el-radio>
                            <el-radio :label="false" class="content">False</el-radio>
                        </el-radio-group>
                        <el-radio-group v-model="autoReconnection">
                            <p class="content">自动重连</p>
                            <el-radio :label="true" class="content">True</el-radio>
                            <el-radio :label="false" class="content">False</el-radio>
                        </el-radio-group>
                        <el-radio-group v-model="receiveEndMark">
                            <p class="content">接收结束符</p>
                            <el-radio :label="true" class="content">True</el-radio>
                            <el-radio :label="false" class="content">False</el-radio>
                        </el-radio-group>
                    </div>
                </el-row>
                
            </el-col>
        </el-row>
        
    </div>
    <template #footer>
        <el-button @click="createAnDevice">创建</el-button>
    </template>
    </el-dialog>
    <el-dialog
        title="通信管理"
        v-model="communicationManagementVisible"
        :modal="false"
        :close-on-click-modal="false"
        custom-class="custom-dialog"
        draggable
    >
        <div class="container">
            <el-row :gutter="20" class="row-container">
                <el-col :span="4" class="left-column">
                    <!-- 左侧区域 -->
                    <div class="sidebar-content">
                        <div class="sidebar-item" :class="{ active: activeIcon === 'deviceManagement' }" @click="setActiveIcon('deviceManagement')" >
                            <el-icon><Monitor /></el-icon>
                            <span>设备管理</span>
                        </div>
                        <div class="sidebar-item" :class="{ active: activeIcon === 'receive' }" @click="setActiveIcon('receive')">
                            <el-icon><SortDown /></el-icon>
                            <span>接收事件</span>
                        </div>
                        <div class="sidebar-item" :class="{ active: activeIcon === 'send' }" @click="setActiveIcon('send')">
                            <el-icon><SortUp /></el-icon>
                            <span>发送事件</span>
                        </div>
                        <div class="sidebar-item" :class="{ active: activeIcon === 'heartbeat' }" @click="setActiveIcon('heartbeat')">
                            <el-icon><Refresh /></el-icon>
                            <span>心跳管理</span>
                        </div>
                        <div class="sidebar-item" :class="{ active: activeIcon === 'setting' }" @click="setActiveIcon('setting')">
                            <el-icon><Setting /></el-icon>
                            <span>响应配置</span>
                        </div>
                    </div>
                </el-col>
                <el-col :span="20" class="right-column">
                    <!-- 右侧区域 -->
                    <div class="right-content">
                    <!-- 这里根据点击不同的图标显示不同的内容 -->
                        <div v-if="activeIcon === 'deviceManagement'" class="mainfield-setting">
                            <el-row style="height: 100%;">
                                <el-col :span="6" class="content-head" style="border-right: 1px solid #ccc;">
                                    设备列表
                                    <button style="margin-left: 20%; " @click="subManageCommunication">+</button>
                                </el-col>
                                <el-col :span="18">
                                    <el-row class="content-head" style="height: 60%; border-bottom: 1px solid #ccc;">
                                        <el-col>通信参数</el-col>
                                        <div class="content" v-if="demoSelectedTCP ===true">
                                            <div class="content-row">
                                                <p class="content" >目标ip</p>
                                                <el-input
                                                class="input"
                                                v-model="ip"
                                                placeholder="xxx.xxx.xxx.xxx"
                                                @input="validateIP"
                                                />
                                            </div>
                                            <span class="content" v-if="!isIPValid" style="color: red;">请输入合法的 IP 地址</span>
                                            <div class="content-row">
                                                <p class="content" >目标端口</p>
                                                <el-input
                                                class="input"
                                                v-model="portNumber"
                                                @input="filterInput"
                                                />
                                            </div>
                                            <el-radio-group v-model="updataValue">
                                                <p class="content">数据上传</p>
                                                <el-radio :label="true" class="content">True</el-radio>
                                                <el-radio :label="false" class="content">False</el-radio>
                                            </el-radio-group>
                                            <el-radio-group v-model="autoReconnection">
                                                <p class="content">自动重连</p>
                                                <el-radio :label="true" class="content">True</el-radio>
                                                <el-radio :label="false" class="content">False</el-radio>
                                            </el-radio-group>
                                            <el-radio-group v-model="receiveEndMark">
                                                <p class="content">接收结束符</p>
                                                <el-radio :label="true" class="content">True</el-radio>
                                                <el-radio :label="false" class="content">False</el-radio>
                                            </el-radio-group>
                                        </div>
                                    </el-row>
                                    <el-row class="content-head" style="height: 40%;">
                                        <el-col>
                                            <div>
                                                <div class="content" >
                                                    <span style="margin-right:10px;" @click="selectGroup('接收数据')">接收数据</span>
                                                    <span @click="selectGroup('发送数据')">发送数据</span>
                                                </div>
                                                <div v-if="selectedGroup === '接收数据'">
                                                    <textarea rows="6" v-model="group1Input" style="width: 100%;"></textarea>
                                                </div>

                                                <div v-if="selectedGroup === '发送数据'">
                                                    <textarea rows="6" v-model="group2Output" style="width: 100%;"></textarea>
                                                    
                                                    <el-button @click="sendTCPData">发送</el-button>
                                                    
                                                </div>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </div>
                        <div v-if="activeIcon === 'receive'" class="mainfield-setting">
                            <el-row style="height: 100%;">
                                <el-col :span="6" class="content-head" style="border-right: 1px solid #ccc;">接收事件列表</el-col>
                                <el-col :span="18">
                                    <el-row class="content-head" style="height: 25%; border-bottom: 1px solid #ccc;">
                                        <el-col>绑定设备</el-col>
                                    </el-row>
                                    <el-row class="content-head" style="height: 25%; border-bottom: 1px solid #ccc;">
                                        <el-col>基本配置</el-col>
                                    </el-row>
                                    <el-row class="content-head" style="height: 50%;">
                                        <el-col>输出列表</el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </div>
                        <div v-if="activeIcon === 'send'" class="mainfield-setting">
                            <el-row style="height: 100%;">
                                <el-col :span="6" class="content-head" style="border-right: 1px solid #ccc;">发送事件列表</el-col>
                                <el-col :span="18">
                                    <el-row class="content-head" style="height: 25%; border-bottom: 1px solid #ccc;">
                                        <el-col>绑定设备</el-col>
                                    </el-row>
                                    <el-row class="content-head" style="height: 25%; border-bottom: 1px solid #ccc;">
                                        <el-col>基本配置</el-col>
                                    </el-row>
                                    <el-row class="content-head" style="height: 50%;">
                                        <el-col>参数列表</el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </div>
                        <div v-if="activeIcon === 'heartbeat'" class="mainfield-setting">显示删除内容</div>
                        <div v-if="activeIcon === 'setting'" class="mainfield-setting">显示设置内容</div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </el-dialog>

    <el-dialog
        title="相机管理"
        v-model="cameraManagementVisible"
        :modal="false"
        :close-on-click-modal="false"
        draggable
    >
        <div style="display: contents;">
            <el-row class="row-container">
                <el-col :span="4" class="left-column">
                    <!-- 左侧区域 -->
                    <div class="sidebar-content">
                        <el-button @click="takeOneImg()">测试拍照</el-button>
                        <div class="sidebar-item" :class="{ active: activeIcon === 'cameraManage' }" @click="getAccessCameras(); setActiveIcon('cameraManage')">
                            <el-icon><Monitor /></el-icon>
                            <span>添加相机</span>
                        </div> 
                    </div>
                </el-col>
                <el-col :span="20" class="right-column">
                    <!-- 右侧区域 -->
                    <div class="right-content">
                    <!-- 这里根据点击不同的图标显示不同的内容 -->
                        <div class="mainfield-setting" v-if="activeIcon === 'cameraManage'">
                            <el-row style="height: 100%;">
                                <el-col span="8" class="content-head" style="border-right: 1px solid #ccc;">
                                    <span>可用相机列表</span>
                                    <!--vue for循环从某个变量里把可用的设备信息输出出来，这个变量应该在页面初始化时请求后端而得到-->
                                    <template v-for="camera in availableCameras">
                                        <el-card class="box-card" style="width:max-content">
                                            <div class="text item">
                                                {{ 'deviceId:' + camera["deviceId"] }}<br>
                                                
                                                {{ 'UserDefinedName:' + camera["userDefinedName"] }}<br>
                                                
                                                {{ 'accessable:' + camera["accessable"] }}<br></div>
                                                <a v-if="camera['IP']">{{ 'IP:' + camera["IP"] }}</a>
                                                <el-button @click="addCamera(camera)">打开相机</el-button>
                                        </el-card>
                                    </template>
                                </el-col>

                                <el-col span="12" class="content-head" style="display: block;">
                                    <span>添加相机列表</span>
                                    <!--vue for循环从某个变量里把可用的设备信息输出出来，这个变量应该在页面初始化时请求后端而得到-->
                                    <template v-for="camera in foreEndCameras">
                                        <el-card class="box-card" style="width:max-content">
                                            <div class="text item">
                                                {{ 'deviceId:' + camera["deviceId"] }}<br>
                                                
                                                {{ "deviceVendorName:" + camera["deviceVendorName"] }}<br>
                                            </div>
                                            <el-button @click="pamraSettingVisible=true;selectedCameraID=camera['deviceId']">参数设置</el-button>
                                            <el-button @click="deleteCamera(camera['deviceId'])">关闭相机</el-button>     
                                        </el-card>
                                    </template>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-col>
            </el-row>

        </div>
    </el-dialog>

    <!--相机参数设置-->
    <el-dialog
        v-model="pamraSettingVisible" 
        title="相机参数设置"
        :modal="false"
        :close-on-click-modal="false"
        draggable>
        <el-form-item v-for="(value,key) in selectedCameraParams" :label="key">
            <div>
                <el-input v-model="selectedCameraParams[key]"/>
            </div>
        </el-form-item>
        <el-button @click="setParams()">设置参数</el-button>
    </el-dialog>
    
    <div class="common-layout">
        <img
            style="position: absolute; left: 0px; top: 0px"
            src="./img/logo_small.png"
        />
        <el-container style="height: 100%">
            <el-header
                style="
                    padding-left: 0px;
                    padding-right: 0px;
                    background-color: rgb(8, 36, 105);
                "
            >
                <el-menu
                    :default-active="activeIndex"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelect"
                    menu-trigger="hover"
                >
                    <el-sub-menu index="1">

                        <template #title
                            ><span style="color: aliceblue"
                                >文件</span
                            ></template
                        >
                        <el-menu-item @click="sendEvent('newSolutionEvent')"
                            ><span style="color: aliceblue"
                                >新建方案</span
                            ></el-menu-item
                        >
                        <el-menu-item @click="sendEvent('openSolutionEvent')"
                            ><span style="color: aliceblue"
                                >打开方案</span
                            ></el-menu-item
                        >
                        <el-sub-menu @mouseenter="updateLastOpenSolutions">
                            <template #title
                                ><span style="color: aliceblue"
                                    >最近打开方案</span
                                ></template
                            >
                            <el-menu-item
                                v-for="(item, index) in lastOpenSolutions"
                                :key="index"
                                @click="
                                    sendEvent('openSelectedSolutionEvent', {
                                        trigger: true,
                                        key: item.name,
                                    })
                                "
                                ><span style="color: aliceblue">{{
                                    item.name
                                }}</span></el-menu-item
                            >

                        </el-sub-menu>
                        <el-sub-menu
                            index="2-1"
                            @mouseenter="updateExampleSolutions"
                        >
                            <template #title
                                ><span style="color: aliceblue"
                                    >打开示例</span
                                ></template
                            >
                            <el-menu-item
                                v-for="(item, index) in exampleSolutions"
                                :key="index"
                                @click="
                                    sendEvent('openSelectedSolutionEvent', {
                                        trigger: true,
                                        key: item,
                                    })
                                "
                                ><span style="color: aliceblue">{{
                                    item
                                }}</span></el-menu-item
                            >
                        </el-sub-menu>
                        <el-menu-item @click="sendEvent('saveSolutionEvent')"
                            ><span style="color: aliceblue"
                                >保存方案</span
                            ></el-menu-item
                        >
                        <el-menu-item @click="sendEvent('saveSolutionAsEvent')"
                            ><span style="color: aliceblue"
                                >方案另存为</span
                            ></el-menu-item
                        >
                        <el-menu-item @click="sendEvent('flowAddEvent')"
                            ><span style="color: aliceblue"
                                >导入流程</span
                            ></el-menu-item
                        >
                        <el-menu-item id="export"
                            ><span style="color: aliceblue"
                                >导出Java/C++/Python</span
                            ></el-menu-item
                        >
                        <el-menu-item id="exit" @click="sendEvent('exitEvent')"
                            ><span style="color: aliceblue"
                                >退出</span
                            ></el-menu-item
                        >
                        <el-menu-item @click="sendEvent('deleteSolutionEvent')"
                            ><span style="color: aliceblue"
                                >删除方案</span
                            ></el-menu-item
                        >
                        <el-menu-item
                            @click="sendEvent('deleteCurrentSolutionEvent')"
                            ><span style="color: aliceblue"
                                >删除当前方案</span
                            ></el-menu-item
                        >
                        <!-- <el-menu-item id="exit" @click="logout"><span style="color:aliceblue;">退出</span></el-menu-item> -->
                    </el-sub-menu>

                    <el-menu-item id="project"
                        ><span style="color: aliceblue"
                            >工程</span
                        ></el-menu-item
                    >

                    <el-sub-menu index="2">
                        <template #title
                            ><span style="color: aliceblue"
                                >设置</span
                            ></template
                        >
                        <el-menu-item id="setPermission"
                            ><span style="color: aliceblue"
                                >权限设置</span
                            ></el-menu-item
                        >
                        <el-menu-item id="setSoftware" @click="setSoftware"
                            ><span style="color: aliceblue" 
                                >软件设置</span
                            ></el-menu-item
                        >
                    
                        <el-menu-item id="setSolution" @click="setScheme"
                            ><span style="color: aliceblue"
                                >方案设置</span
                            ></el-menu-item
                        >
                        <el-menu-item id="operationStrategy"
                            ><span style="color: aliceblue"
                                >运行策略</span
                            ></el-menu-item
                        >
                    </el-sub-menu>

                    <el-sub-menu index="3">
                        <template #title
                            ><span style="color: aliceblue"
                                >系统</span
                            ></template
                        >
                        <el-menu-item id="logs"
                            ><span style="color: aliceblue"
                                >日志</span
                            ></el-menu-item
                        >
                        <!-- <el-menu-item
                            id="manageCommunication"
                            @click="manageCommunication"
                            ><span style="color: aliceblue"
                                >通信管理</span
                            ></el-menu-item
                        > -->
                        <el-menu-item @click="openNetworkManager"
                            ><span style="color: aliceblue"
                                >通信管理</span
                            ></el-menu-item>
                        <el-menu-item id="manageController"
                            ><span style="color: aliceblue"
                                >控制器管理</span
                            ></el-menu-item
                        >
                        <el-menu-item id="manageCamera"
                            @click="manageCamera"
                            ><span style="color: aliceblue"
                                >相机管理</span
                            ></el-menu-item
                        >
                    </el-sub-menu>

                    <el-sub-menu index="4">
                        <template #title
                            ><span style="color: aliceblue"
                                >工具</span
                            ></template
                        >
                        <el-menu-item id="createCalibrationBoot"
                            ><span style="color: aliceblue"
                                >创建一键标定引导</span
                            ></el-menu-item
                        >
                        <el-menu-item id="operationEnvironmentTestTool"
                            ><span style="color: aliceblue"
                                >运行环境检测工具</span
                            ></el-menu-item
                        >
                        <el-menu-item id="calibrationBoardGenerationTool"
                            ><span style="color: aliceblue"
                                >标定板生成工具</span
                            ></el-menu-item
                        >
                    </el-sub-menu>

                    <el-sub-menu index="5">
                        <template #title
                            ><span style="color: aliceblue"
                                >其他</span
                            ></template
                        >
                        <el-menu-item id="about" @click="openAbout"
                            ><span style="color: aliceblue"
                                >关于</span
                            ></el-menu-item
                        >
                        <el-menu-item id="help" @click="openHelpDoc"
                            ><span style="color: aliceblue"
                                >帮助文档</span
                            ></el-menu-item
                        >
                    </el-sub-menu>
                    <el-button  @click="test">test</el-button>


                    <el-menu-item index="6" @click="returnto">
                        <span style="color: aliceblue">云端</span>
                    </el-menu-item>

                    <!--                    <el-sub-menu index="5">-->
                    <!--                        <template #title><span style="color:aliceblue">布局</span></template>-->
                    <!--                        <el-menu-item @click="layout(0)"><span style="color:aliceblue;">布局一</span></el-menu-item>-->
                    <!--                        <el-menu-item @click="layout(1)"><span style="color:aliceblue;">布局二</span></el-menu-item>-->
                    <!--                        <el-menu-item @click="layout(2)"><span style="color:aliceblue;">布局三</span></el-menu-item>-->
                    <!--                    </el-sub-menu>-->
                </el-menu>

                <el-menu
                    :default-active="activeIndex"
                    class="el-menu-demo1"
                    mode="horizontal"
                    @select="handleSelect"
                >
                    <!-- <el-menu-item title="撤销" id="revocation" index="1">
                        <el-icon style="color: aliceblue">
                            <Back />
                        </el-icon>
                    </el-menu-item>
                    <el-menu-item title="重做" id="redo" index="2">
                        <el-icon style="color: aliceblue">
                            <RefreshLeft />
                        </el-icon>
                    </el-menu-item> -->
                    <el-menu-item title="单次运行" id="singleRun" index="3" @click="sendEvent('runSolutionEvent')">
                        <el-icon style="color:aliceblue;">
                            <Right />
                        </el-icon>
                    </el-menu-item>
                    <!-- <el-menu-item title="局部运行" id="localRun" index="4">
                        <el-icon style="color: aliceblue">
                            <CaretRight />
                        </el-icon>
                    </el-menu-item> -->
                    <el-menu-item title="循环运行" id="circleRun" index="5" @click="runSolutionLoop">
                        <el-icon style="color: aliceblue">
                            <Refresh />
                        </el-icon>
                    </el-menu-item>
                    <el-menu-item title="停止" id="stop" index="6" @click="stopSolutionLoop">
                        <el-icon style="color: aliceblue">
                            <CircleClose />
                        </el-icon>
                    </el-menu-item>
                    <el-menu-item title="全局变量" id="globalVariable" index="7" @click="openDialogGV()">
                        <el-icon style="color:aliceblue;">
                            <Notification />
                        </el-icon>
                    </el-menu-item>
                    <el-menu-item title="全局触发" id="globalTrigger" index="8">
                        <el-icon style="color:aliceblue;">
                            <ZoomOut />
                        </el-icon>
                    </el-menu-item>
                    <el-menu-item title="全局脚本" id="globalScript" index="9" @click="openDialogGS()">
                        <el-icon style="color: aliceblue">
                            <Remove />
                        </el-icon>
                    </el-menu-item>
                    <el-menu-item
                        title="运行界面"
                        id="runningInterface"
                        index="10"
                    >
                        <el-icon style="color: aliceblue">
                            <ChatSquare />
                        </el-icon>
                    </el-menu-item>
                </el-menu>
            </el-header>

            <el-main class="main-window-content">
                <component
                    :is="mainLayout"
                    :compnts="compnts"
                    :height_right="height_right"
                ></component>
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
    <GlobalVar ></GlobalVar>
    <GlobalScript ></GlobalScript>
</template>


<script src="./js/mainWindow.js">

//import GlobalVar from "./components/GlobalVar";
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

.custom-dialog {
  width: 45%;
  height: 58%;
}

.custom-dialog-little {
  width: 22%;
  height: 52%;
}


.custom-dialog .el-dialog__wrapper {
  display: flex;
}

.container {
    height:50vh; /* 设置容器高度占满整个视口 */
    flex:1;
    background-color: rgb(235, 235, 235); /* 设置背景色为棕色 */
}

.row-container {
    height: 100%; /* 设置 row 的高度为 100% */
}

.left-column {
    background-color: rgb(255, 255, 255); /* 设置左侧区域背景色为棕色 */
}

.right-column {
    background-color: rgb(238, 238, 238); /* 设置右侧区域背景色为白色 */
}

.left-content {
    height: 100%; /* 设置左侧内容区域高度占满左侧区域 */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.right-content {
    height: 100%; /* 设置右侧内容区域高度占满右侧区域 */
    display: flex;
    align-items: center;
    justify-content: center;
}

.mainfield-setting{
    height: 100%;
    width: 100%;
}

.content-head {
    font-size: 16px;
    padding-top: 5px;
    padding-left: 5px;
    font-weight: bold;
}

.content {
    font-size: 12px;
    margin-top: 10px;
    margin-bottom: 5px;
    margin-right: 5px;
    padding-left: 10px;
    font-weight: normal;
}

.sidebar-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  padding: 10px; /* 设置内边距 */
}

.sidebar-item.active {
  background-color: rgb(247, 243, 243); /* 设置选中的图标背景色 */
}

.content-row {
  display: flex;
  align-items: center;
}

.input {
  width: 120px; /* 设置输入框的宽度 */
}

.el-tabs__header {
    margin: 0px 0px 0px 0px;
}
/*camera card style*/
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
}
</style>