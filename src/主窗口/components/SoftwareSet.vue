<template>
        <el-dialog
        title="软件设置"
        v-model="softwareSetVisible"
        :modal="false"
        :close-on-click-modal="false"
        custom-class="custom-dialog"
        draggable
        @close="$emit('closeSoftwareSet', false)"
    >
    <div class="container">
            <el-row :gutter="20" class="row-container">
                <el-col :span="4" class="left-column">
                    <!-- 左侧区域 -->
                    <div class="sidebar-content">
                        <div class="sidebar-item" :class="{ active: activeIcon === 'deviceManagement' }" @click="setActiveIcon('deviceManagement')" >
                            <!-- <el-icon><Monitor /></el-icon> -->
                            <span>权限设置</span>
                        </div>
                        <div class="sidebar-item" :class="{ active: activeIcon === 'receive' }" @click="setActiveIcon('receive')">
                            <!-- <el-icon><SortDown /></el-icon> -->
                            <span>软件设置</span>
                        </div>
                        <div class="sidebar-item" :class="{ active: activeIcon === 'send' }" @click="setActiveIcon('send')">
                            <!-- <el-icon><SortUp /></el-icon> -->
                            <span>方案设置</span>
                        </div>
                        <div class="sidebar-item" :class="{ active: activeIcon === 'heartbeat' }" @click="setActiveIcon('heartbeat')">
                            <!-- <el-icon><Refresh /></el-icon> -->
                            <span>运行策略</span>
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
                            <!-- <el-row style="height: 100%;">
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
                            </el-row> -->
                            <el-row class="content-head" style="">
                                <el-col>启动加载设置</el-col>
                            </el-row>
                            <el-row class="content-head" style=" color:#ffffff ;">
                                <el-col>开机软件自启动  <el-switch v-model="softwareParam.selfStartOfStartupSoftware" /></el-col>
                            </el-row>
                            <el-row class="content-head" style=" color:#ffffff ;">
                                <el-col>默认运行界面 <el-switch v-model="softwareParam.defaultRunInterface" /></el-col>
                            </el-row>
                            <el-row class="content-head" style=" color:#ffffff ;">
                                <el-col>运行界面独立启动时最大化 <el-switch v-model="softwareParam.maximizeRuntimeInterfaceStartsIndependently" /></el-col>
                            </el-row>
                            <el-row class="content-head" style=" color:#ffffff ;">
                                <el-col>文件自动加载 <el-switch v-model="softwareParam.fileAutomaticLoading" /></el-col>
                            </el-row>
                            <el-row class="content-head" style=" color:#ffffff ;">
                                <el-col>载入路径 <el-input v-model="softwareParam.loadPath" placeholder="Please input" /></el-col>
                            </el-row>
                            <el-row class="content-head" style=" color:#ffffff ;">
                                <el-col>方案密码 <el-input v-model="softwareParam.schemepassword" placeholder="Please input" /></el-col>
                            </el-row>
                            <el-row class="content-head" style=" color:#ffffff ;">
                                <el-col>启动状态 <el-input v-model="softwareParam.startupStatus" placeholder="Please input" /></el-col>
                            </el-row>
                            <el-row class="content-head" style=" color:#ffffff ;">
                                <el-col>选择身份 <el-input v-model="softwareParam.chooseIdentity" placeholder="Please input" /></el-col>
                            </el-row>
                            <el-row class="content-head" style=" border-bottom: 1px solid #ccc;">
                                <el-col>软件关闭设置</el-col>
                                <div class="mb-2 flex items-center text-sm">
                                    <el-radio-group v-model="softwareParam.softwareShutdownSettings" class="ml-4">
                                        <el-radio label="1" size="large">后台运行</el-radio>
                                        <el-radio label="2" size="large">退出软件，停止运行</el-radio>
                                    </el-radio-group>
                                </div>
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
                <el-button class="btn" @click="confirm">确认</el-button>
            </el-row>
        </div>
  
    </el-dialog> 
</template>

<script>
export default{
    props:['softwareSetVisible'],
    data(){
        return {

                activeIcon: "deviceManagement",

            softwareParam:{
                selfStartOfStartupSoftware:true,
                defaultRunInterface:true,
                maximizeRuntimeInterfaceStartsIndependently:true,
                fileAutomaticLoading:true,
                softwareShutdownSettings:'1',
                loadPath:'',
                schemepassword:'',
                startupStatus:'',
                chooseIdentity:''
            }
            
        }
    },
    methods:{
        setActiveIcon(icon){
            this.activeIcon = icon;
        },
        confirm(){
            localStorage.setItem('softwareParam', JSON.stringify(softwareParam));
        }
    }
}
</script>
<style>
    .btn {
  position: absolute;
  bottom: 10px; /* 距离底部的距离 */
  right: 10px; /* 距离右侧的距离 */
}
</style>