<template>
  <el-dialog title="设置" :model-value="isVisible" :modal="false" :close-on-click-modal="false"
    custom-class="custom-dialog" draggable @close="$emit('update:isVisible', false)">
    <div class="container">
      <el-row :gutter="20" class="row-container">
        <el-col :span="4" class="left-column">
          <!-- 左侧区域 -->
          <div class="sidebar-content">
            <div class="sidebar-item" :class="{ active: softwareIcon === 'icon1' }"
              @click="setActiveIcon('deviceManagement')">
              <!-- <el-icon><Monitor /></el-icon> -->
              <span>权限设置</span>
            </div>
            <div class="sidebar-item" :class="{ active: softwareIcon === 'icon2' }" @click="setActiveIcon('icon2')">
              <!-- <el-icon><SortDown /></el-icon> -->
              <span>软件设置</span>
            </div>
            <div class="sidebar-item" :class="{ active: softwareIcon === 'icon3' }" @click="setActiveIcon('icon3')">
              <!-- <el-icon><SortUp /></el-icon> -->
              <span>方案设置</span>
            </div>
            <div class="sidebar-item" :class="{ active: softwareIcon === 'icon4' }" @click="setActiveIcon('icon4')">
              <!-- <el-icon><Refresh /></el-icon> -->
              <span>运行策略</span>
            </div>
          </div>
        </el-col>
        <el-col :span="20" class="right-column">
          <!-- 右侧区域 -->
          <div class="right-content">
            <!-- 这里根据点击不同的图标显示不同的内容 -->
            <div v-if="test.softwareIcon === 'icon1'" class="mainfield-setting">
              <el-row style="height: 100%">
                <el-col :span="6" class="content-head" style="border-right: 1px solid #ccc">
                  设备列表
                  <button style="margin-left: 20%" @click="subManageCommunication">
                    +
                  </button>
                </el-col>
                <el-col :span="18">
                  <el-row class="content-head" style="height: 60%; border-bottom: 1px solid #ccc">
                    <el-col>通信参数</el-col>
                    <div class="content" v-if="demoSelectedTCP === true">
                      <div class="content-row">
                        <p class="content">目标ip</p>
                        <el-input class="input" v-model="ip" placeholder="xxx.xxx.xxx.xxx" @input="validateIP" />
                      </div>
                      <span class="content" v-if="!isIPValid" style="color: red">请输入合法的 IP 地址</span>
                      <div class="content-row">
                        <p class="content">目标端口</p>
                        <el-input class="input" v-model="portNumber" @input="filterInput" />
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
                  <el-row class="content-head" style="height: 40%">
                    <el-col>
                      <div>
                        <div class="content">
                          <span style="margin-right: 10px" @click="selectGroup('接收数据')">接收数据</span>
                          <span @click="selectGroup('发送数据')">发送数据</span>
                        </div>
                        <div v-if="selectedGroup === '接收数据'">
                          <textarea rows="6" v-model="group1Input" style="width: 100%"></textarea>
                        </div>

                        <div v-if="selectedGroup === '发送数据'">
                          <textarea rows="6" v-model="group2Output" style="width: 100%"></textarea>

                          <el-button @click="sendTCPData">发送</el-button>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
            <div v-if="test.softwareIcon === 'icon2'" class="mainfield-setting">
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
              <el-row class="content-head" style="color: #ffffff">
                <el-col>开机软件自启动
                  <el-switch v-model="softwareParam.selfStartOfStartupSoftware" /></el-col>
              </el-row>
              <el-row class="content-head" style="color: #ffffff">
                <el-col>默认运行界面
                  <el-switch v-model="softwareParam.defaultRunInterface" /></el-col>
              </el-row>
              <el-row class="content-head" style="color: #ffffff">
                <el-col>运行界面独立启动时最大化
                  <el-switch v-model="softwareParam.maximizeRuntimeInterfaceStartsIndependently
                    " /></el-col>
              </el-row>
              <el-row class="content-head" style="color: #ffffff">
                <el-col>文件自动加载
                  <el-switch v-model="softwareParam.fileAutomaticLoading" /></el-col>
              </el-row>
              <el-row class="content-head" style="color: #ffffff">
                <el-col>载入路径
                  <el-input v-model="softwareParam.loadPath" placeholder="Please input" /></el-col>
              </el-row>
              <el-row class="content-head" style="color: #ffffff">
                <el-col>方案密码
                  <el-input v-model="softwareParam.schemepassword" placeholder="Please input" /></el-col>
              </el-row>
              <el-row class="content-head" style="color: #ffffff">
                <el-col>启动状态
                  <el-input v-model="softwareParam.startupStatus" placeholder="Please input" /></el-col>
              </el-row>
              <el-row class="content-head" style="color: #ffffff">
                <el-col>选择身份
                  <el-input v-model="softwareParam.chooseIdentity" placeholder="Please input" /></el-col>
              </el-row>
              <el-row class="content-head" style="border-bottom: 1px solid #ccc">
                <el-col>软件关闭设置</el-col>
                <div class="mb-2 flex items-center text-sm">
                  <el-radio-group v-model="softwareParam.softwareShutdownSettings" class="ml-4">
                    <el-radio label="1" size="large">后台运行</el-radio>
                    <el-radio label="2" size="large">退出软件，停止运行</el-radio>
                  </el-radio-group>
                </div>
              </el-row>
              <el-button class="btn" @click="softwareParamPass">确认</el-button>
            </div>
            <div v-if="test.softwareIcon === 'icon3'" class="mainfield-setting">
              <el-row class="content-head" style="">
                <el-col>方案管理</el-col>
              </el-row>
              <p>启用“通信初始化”后，将可以通过配置通信字符串，实现对方案自动切换</p>

              <div id="app">
                <el-button type="primary" @click="addRow">添加行</el-button>
                <el-table :data="schemeParam.rows">
                  <el-table-column prop="index" label="序号"></el-table-column>
                  <el-table-column label="方案路径">
                    <template #default="scope">
                    <el-input v-model="scope.row.schemeRoute"/>
                </template>
                    <!-- <el-input v-model="schemeParam.rows.input1"></el-input> -->
                  </el-table-column>
                  <el-table-column label="方案密码">
                    <template #default="scope">
                    <el-input v-model="scope.row.schemePasswd"/>
                </template>
                    <!-- <el-input v-model="schemeParam.rows.input2"></el-input> -->
                  </el-table-column>
                  <el-table-column label="通信字符串">
                    <template #default="scope">
                    <el-input v-model="scope.row.communString"/>
                </template>
                    <!-- <el-input v-model="schemeParam.rows.input3"></el-input> -->
                  </el-table-column>
                  <el-table-column label="通信切换">
                    <template #default="scope">
                      <el-switch v-model="scope.row.switching" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </template>
                    <!-- <el-switch v-model="schemeParam.rows.switch" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch> -->
                  </el-table-column>
                </el-table>
              </div>
              <el-button class="btn" @click="schemeParamPass">确认</el-button>
            </div>
            <div v-if="test.softwareIcon === 'icon4'" class="mainfield-setting">
            </div>
          </div>
        </el-col>
        
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios';
export default {
  props: ["test"],
  data() {
    return {
      // activeIcon: "deviceManagement",

      softwareParam: {
        selfStartOfStartupSoftware: true,
        defaultRunInterface: true,
        maximizeRuntimeInterfaceStartsIndependently: true,
        fileAutomaticLoading: true,
        softwareShutdownSettings: "1",
        loadPath: "",
        schemepassword: "",
        startupStatus: "",
        chooseIdentity: "",
      },
      schemeParam: {
        rows: [
          { index: 1, schemeRoute: '', schemePasswd: '', communString: '', switching: 1 },
        
        ]
      },
      message:'hello'

    };
  },
  methods: {
    setActiveIcon(icon) {
      this.test.softwareIcon = icon;
    },
    softwareParamPass() {
      console.log(this.softwareParam);
      axios.post('http://localhost:8080/paramPass', {
          selfStartOfStartupSoftware:this.softwareParam.selfStartOfStartupSoftware,
          defaultRunInterface: this.softwareParam.defaultRunInterface,
        maximizeRuntimeInterfaceStartsIndependently: this.softwareParam.maximizeRuntimeInterfaceStartsIndependently,
        fileAutomaticLoading: this.softwareParam.fileAutomaticLoading,
        softwareShutdownSettings: this.softwareParam.softwareShutdownSettings,
        loadPath: this.softwareParam.loadPath,
        schemepassword: this.softwareParam.schemepassword,
        startupStatus: this.softwareParam.startupStatus,
        chooseIdentity: this.softwareParam.chooseIdentity,
        //paramLista:this.softwareParam

  }).then((resp) => {
        console.log(resp);
})
},
    schemeParamPass(){
      console.log(this.schemeParam.rows);
      const jsondata=JSON.stringify(this.schemeParam.rows);
      console.log(jsondata);
      axios.post('http://localhost:8080/schemeParamPass', 
      jsondata,{
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
    }
      
  ).then((resp) => {
        console.log(resp);
})
    },
    confirm1() {
      //localStorage.setItem("softwareParam", JSON.stringify(softwareParam));
      console.log(this.softwareParam);
      paramPassA();
    },
    confirm2() {
      localStorage.setItem("schemeParam", JSON.stringify(schemeParam));
    },
    addRow: function () {
      // 获取当前行的最大索引
      var maxIndex = Math.max.apply(null, this.schemeParam.rows.map(function (row) {
        return row.index;
      }));

      // 添加一行到数组中
      this.schemeParam.rows.push({
        index: maxIndex + 1,
        schemeRoute: '',
        schemePasswd: '',
        communString: '',
        communSwitching:1, 
      });
    }
  },
};
</script>
<style>
.btn {
  position: absolute;
  bottom: 10px;
  /* 距离底部的距离 */
  right: 10px;
  /* 距离右侧的距离 */
}
</style>
