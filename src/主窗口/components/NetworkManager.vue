<template>
  <el-dialog
    title="通信管理"
    :model-value="isVisible"
    @close="$emit('update:isVisible', false)"
  >
    <el-tabs class="left-menu" tab-position="left" style="height: 400px">
      <el-tab-pane class="pane">
        <template #label>
          <el-icon>
            <Monitor />
          </el-icon>
          <span class="menu-item-title">设备管理</span>
        </template>
        <el-row class="row" :gutter="20">
          <el-col
            :span="6"
            style="height: 100%; border-right: solid 2px lightgray"
          >
            <div style="display: flex; flex-direction: column; height: 100%">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 5px;
                "
              >
                <span>设备列表</span>
                <el-button @click="currentActiveItem = 'AddDevice'">
                  <el-icon>
                    <Plus />
                  </el-icon>
                </el-button>
              </div>
              <el-scrollbar>
                <ul class="list">
                  <li
                    v-for="(device, index) in devices"
                    :key="device.name"
                    @click="currentActiveItem = index"
                    style="cursor: pointer"
                    class="li-item"
                  >
                    {{ device.name }}
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </el-col>
          <el-col :span="18" style="height: 100%">
            <div style="display: flex; flex-direction: column; height: 100%">
              <p style="margin-top: 0">通信参数</p>
              <template v-if="currentActiveItem === 'AddDevice'">
                <el-form :model="deviceToCreate">
                  <el-row :gutter="20">
                    <el-col :span="10">
                      <el-form-item label="名称">
                        <el-input v-model="deviceToCreate.name"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="协议类型">
                        <el-select v-model="deviceToCreate.type">
                          <el-option
                            label="TCP服务端"
                            value="TcpListener"
                          ></el-option>
                          <el-option
                            label="TCP客户端"
                            value="TcpConnector"
                          ></el-option>
                          <el-option
                            label="UDP"
                            value="UdpListener"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <template
                    v-if="
                      deviceToCreate.type === 'TcpListener' ||
                      deviceToCreate.type === 'TcpConnector' ||
                      deviceToCreate.type === 'UdpListener'
                    "
                  >
                    <el-row :gutter="20">
                      <el-col :span="14">
                        <el-form-item label="目标IP">
                          <el-input v-model="deviceToCreate.IP"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="10">
                        <el-form-item label="目标端口">
                          <el-input v-model="deviceToCreate.port"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="数据上传">
                          <el-switch
                            v-model="deviceToCreate.upload"
                          ></el-switch>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="自动重连">
                          <el-switch
                            v-model="deviceToCreate.reconnect"
                          ></el-switch>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="接受结束符">
                          <el-switch
                            v-model="deviceToCreate.endFlag"
                          ></el-switch>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <div style="display: flex; justify-content: end">
                      <el-form-item>
                        <el-button type="primary" @click="onCreateDevice"
                          >创建</el-button
                        >
                      </el-form-item>
                    </div>
                  </template>
                </el-form>
              </template>
              <template v-else-if="currentActiveItem < devices.length">
                <template
                  v-if="
                    devices[currentActiveItem].type === 'TcpListener' ||
                    devices[currentActiveItem].type === 'TcpConnector' ||
                    devices[currentActiveItem].type === 'UdpListener'
                  "
                >
                  <el-row :gutter="20">
                    <el-col :span="10">
                      <el-form-item label="名称">
                        <el-input
                          disabled
                          v-model="devices[currentActiveItem].name"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="协议类型">
                        <el-select
                          disabled
                          v-model="devices[currentActiveItem].type"
                        >
                          <el-option
                            label="TCP服务端"
                            value="TcpListener"
                          ></el-option>
                          <el-option
                            label="TCP客户端"
                            value="TcpConnector"
                          ></el-option>
                          <el-option
                            label="UDP"
                            value="UdpListener"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="14">
                      <el-form-item label="目标IP">
                        <el-input
                          disabled
                          v-model="devices[currentActiveItem].IP"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item disabled label="目标端口">
                        <el-input
                          disabled
                          v-model="devices[currentActiveItem].port"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="数据上传">
                        <el-switch
                          disabled
                          v-model="devices[currentActiveItem].upload"
                        ></el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="自动重连">
                        <el-switch
                          disabled
                          v-model="devices[currentActiveItem].reconnect"
                        ></el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="接受结束符">
                        <el-switch
                          disabled
                          v-model="devices[currentActiveItem].endFlag"
                        ></el-switch>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-tabs class="receive-send-menu" style="flex: 1">
                    <el-tab-pane label="接收数据" class="pane">
                      <el-form style="margin-top: 5px; height: 100%">
                        <el-form-item style="height: 80%">
                          <el-input
                            type="textarea"
                            :rows="5"
                            readonly
                            resize="none"
                            placeholder="..."
                            v-model="devices[currentActiveItem].receivedData"
                            style="height: 100%"
                          ></el-input>
                        </el-form-item>
                      </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="发送数据" class="pane">
                      <el-form style="margin-top: 5px; height: 100%">
                        <el-form-item style="height: 80%; margin-bottom: 5px">
                          <el-input
                            type="textarea"
                            :rows="5"
                            placeholder="请输入内容"
                            v-model="devices[currentActiveItem].dataToSend"
                            resize="none"
                            style="height: 100%"
                          ></el-input>
                        </el-form-item>
                        <div style="display: flex; justify-content: end">
                          <el-form-item>
                            <el-button type="primary">发送</el-button>
                          </el-form-item>
                        </div>
                      </el-form>
                    </el-tab-pane>
                  </el-tabs>
                </template>
              </template>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane class="pane">
        <template #label>
          <el-icon>
            <SortDown />
          </el-icon>
          <span class="menu-item-title">接受事件</span>
        </template>
        <el-row class="row" :gutter="20">
          <el-col
            :span="6"
            style="height: 100%; border-right: solid 2px lightgray"
          >
            <div style="display: flex; flex-direction: column; height: 100%">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 5px;
                "
              >
                <span>接受事件列表</span>
                <el-button @click="currentAcceptEvent = 'AddAcceptEvent'">
                  <el-icon>
                    <Plus />
                  </el-icon>
                </el-button>
              </div>
              <el-scrollbar>
                <ul class="list">
                  <li
                    v-for="(AcceptEvent, index) in AcceptEvents"
                    :key="index"
                    @click="currentAcceptEvent = index"
                    style="cursor: pointer"
                    class="li-item"
                  >
                  {{ index +  AcceptEvent.manner + (AcceptEvent.manner === '脚本' ? '' : '-'+AcceptEvent.type) }}
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </el-col>
          <el-col :span="18" style="height: 100%">
            <div style="display: flex; flex-direction: column; height: 100%">
              <p style="margin-top: 0">事件管理</p>
              <template v-if="currentAcceptEvent === 'AddAcceptEvent'">
                <el-form :model="acceptEventToCreate">
                  <el-row :gutter="20">
                    <el-col :span="10">
                      <el-form-item label="处理方式">
                        <el-select v-model="acceptEventToCreate.manner">
                          <el-option
                            label="文本"
                            value="文本"
                          ></el-option>
                          <el-option
                            label="字节匹配"
                            value="字节匹配"
                          ></el-option>
                          <el-option
                            label="脚本"
                            value="脚本"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="事件类型">
                        <el-select v-model="acceptEventToCreate.type"  :disabled="acceptEventToCreate.manner === '脚本'">
                          <el-option
                            label="协议解析"
                            value="协议解析"
                          ></el-option>
                          <el-option
                            label="协议组装"
                            value="协议组装"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <div style="display: flex; justify-content: end">
                      <el-form-item>
                        <el-button type="primary" @click="onCreateAcceptEvent"
                          >创建</el-button
                        >
                      </el-form-item>
                  </div>
                  
                  

                  
                </el-form>
              </template>
              <template v-else-if="currentAcceptEvent < AcceptEvents.length">
                <template
                  v-if="
                    AcceptEvents[currentAcceptEvent].manner === '文本' 
                  "
                >
                  <el-row :gutter="20">
                    <el-col :span="10">
                      <el-form-item label="处理方式">
                        <el-select disabled v-model="AcceptEvents[currentAcceptEvent].manner">
                          <el-option
                            label="文本"
                            value="文本"
                          ></el-option>
                          <el-option
                            label="字节匹配"
                            value="字节匹配"
                          ></el-option>
                          <el-option
                            label="脚本"
                            value="脚本"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="事件类型">
                        <el-select disabled v-model="AcceptEvents[currentAcceptEvent].type">
                          <el-option
                            label="协议解析"
                            value="协议解析"
                          ></el-option>
                          <el-option
                            label="协议组装"
                            value="协议组装"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>
                <template
                  v-if="
                    AcceptEvents[currentAcceptEvent].manner === '字节匹配'
                  "
                >
                  <el-row :gutter="20">
                    <el-col :span="14">
                      <el-form-item label="处理方式">
                        <el-select disabled v-model="AcceptEvents[currentAcceptEvent].manner">
                          <el-option
                            label="文本"
                            value="文本"
                          ></el-option>
                          <el-option
                            label="字节匹配"
                            value="字节匹配"
                          ></el-option>
                          <el-option
                            label="脚本"
                            value="脚本"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="事件类型">
                        <el-select disabled v-model="AcceptEvents[currentAcceptEvent].type">
                          <el-option
                            label="协议解析"
                            value="协议解析"
                          ></el-option>
                          <el-option
                            label="协议组装"
                            value="协议组装"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  
                </template>

               

                <div>
                  <p style="margin-top: 0">绑定设备</p>
                  <el-row :gutter="20">
                    <el-col :span="14">
                      <el-form-item label="绑定设备">
                        <el-input ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <p style="margin-top: 0">基本配置</p>
                <template
                  v-if="
                    AcceptEvents[currentAcceptEvent].manner === '文本'
                  "
                >
                  <el-row :gutter="20">
                    <el-col :span="14">
                      <el-form-item label="分隔符">
                        <el-select  v-model="AcceptEvents[currentAcceptEvent].separator">
                          <el-option
                            label=";"
                            value=";"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                     
                      <el-form-item label="字符长度比较">
                        <el-switch
                          v-model="AcceptEvents[currentAcceptEvent].CharacterLengthComparison"
                        ></el-switch>
                      </el-form-item>
                      
                    </el-col>
                  </el-row>
                  
                </template>

                <template
                  v-if="
                    AcceptEvents[currentAcceptEvent].manner === '字节匹配'
                  "
                >
                  <el-row :gutter="20">
                    <el-col :span="14">
                     
                      <el-form-item label="字符长度比较">
                        <el-switch
                          v-model="AcceptEvents[currentAcceptEvent].CharacterLengthComparison"
                        ></el-switch>
                      </el-form-item>

                      <el-form-item label="16进制接受">
                        <el-switch
                          v-model="AcceptEvents[currentAcceptEvent].hexadecimal"
                        ></el-switch>
                      </el-form-item>
                      
                    </el-col>
                  </el-row>
                  
                </template>

                <template
                  v-if="
                    AcceptEvents[currentAcceptEvent].manner === '脚本'
                  "
                >
                  <el-row :gutter="20">
                    <el-col :span="14">
                     
                      <el-form-item label="回复给设备">
                        <el-switch
                          v-model="AcceptEvents[currentAcceptEvent].ReturnToDevice"
                        ></el-switch>
                      </el-form-item>

                      <el-form-item label="载入路径">
                        <el-input v-model="AcceptEvents[currentAcceptEvent].load"></el-input>
                        
                      </el-form-item>
                      
                    </el-col>
                  </el-row>
                  
                </template>


              </template>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane class="pane">
        <template #label>
          <el-icon>
            <SortUp />
          </el-icon>
          <span class="menu-item-title">发送事件</span>
        </template>
        <el-row class="row" :gutter="20">
          <el-col
            :span="6"
            style="height: 100%; border-right: solid 2px lightgray"
          >
            <div style="display: flex; flex-direction: column; height: 100%">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 5px;
                "
              >
                <span>发送事件列表</span>
                <el-button @click="currentSendEvent = 'AddSendEvent'">
                  <el-icon>
                    <Plus />
                  </el-icon>
                </el-button>
              </div>
              <el-scrollbar>
                <ul class="list">
                  <li
                    v-for="(SendEvent, index) in SendEvents"
                    :key="index"
                    @click="currentSendEvent = index"
                    style="cursor: pointer"
                    class="li-item"
                  >
                  {{ index +  SendEvent.manner + (SendEvent.manner === '脚本' ? '' : '-'+SendEvent.type) }}
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </el-col>
          <el-col :span="18" style="height: 100%">
            <div style="display: flex; flex-direction: column; height: 100%">
              <p style="margin-top: 0">事件管理</p>
              <template v-if="currentSendEvent === 'AddSendEvent'">
                <el-form :model="sendEventToCreate">
                  <el-row :gutter="20">
                    <el-col :span="10">
                      <el-form-item label="处理方式">
                        <el-select v-model="sendEventToCreate.manner">
                          <el-option
                            label="文本"
                            value="文本"
                          ></el-option>
                          <el-option
                            label="脚本"
                            value="脚本"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="事件类型">
                        <el-select v-model="sendEventToCreate.type"  :disabled="sendEventToCreate.manner === '脚本'">
                          <el-option
                            label="直接输出"
                            value="直接输出"
                          ></el-option>
                          <el-option
                            label="组装输出"
                            value="组装输出"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <div style="display: flex; justify-content: end">
                      <el-form-item>
                        <el-button type="primary" @click="onCreateSendEvent"
                          >创建</el-button
                        >
                      </el-form-item>
                  </div>
                  
                  

                  
                </el-form>
              </template>
              <template v-else-if="currentSendEvent < SendEvents.length">
                <template
                  v-if="
                    SendEvents[currentSendEvent].manner === '文本' 
                  "
                >
                  <el-row :gutter="20">
                    <el-col :span="10">
                      <el-form-item label="处理方式">
                        <el-select disabled v-model="SendEvents[currentSendEvent].manner">
                          <el-option
                            label="文本"
                            value="文本"
                          ></el-option>
                          <el-option
                            label="脚本"
                            value="脚本"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="事件类型">
                        <el-select disabled v-model="SendEvents[currentSendEvent].type">
                          <el-option
                            label="直接输出"
                            value="直接输出"
                          ></el-option>
                          <el-option
                            label="组装输出"
                            value="组装输出"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>

                <div>
                  <p style="margin-top: 0">绑定设备</p>
                  <el-row :gutter="20">
                    <el-col :span="14">
                      <el-form-item label="绑定设备">
                        <el-input ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>

                <template
                  v-if="
                    SendEvents[currentSendEvent].type === '直接输出'
                  "
                >
                  <p style="margin-top: 0">基本配置</p>
                  <el-row :gutter="20">
                    <el-col :span="14">
                      <el-form-item label="分隔符">
                        <el-select  v-model="AcceptEvents[currentAcceptEvent].separator">
                          <el-option
                            label=";"
                            value=";"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  
                </template>

               

              
                
                <template
                  v-if="
                    SendEvents[currentSendEvent].type === '组装输出'
                  "
                >
                  <p style="margin-top: 0">参数列表</p>
                  
                  
                </template>

                <template
                  v-if="
                    SendEvents[currentSendEvent].manner === '脚本'
                  "
                >
                  <el-row :gutter="20">
                    <el-col :span="14">
                     
                      
                      <el-form-item label="载入路径">
                        <el-input v-model="SendEvents[currentSendEvent].load"></el-input>
                        
                      </el-form-item>
                      <p style="margin-top: 0">组装列表</p>

                      
                    </el-col>
                  </el-row>
                  
                </template>

                


              </template>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane class="pane">
        <template #label>
          <el-icon>
            <Refresh />
          </el-icon>
          <span class="menu-item-title">心跳管理</span>
        </template>
      </el-tab-pane>
      <el-tab-pane class="pane">
        <template #label>
          <el-icon>
            <Setting />
          </el-icon>
          <span class="menu-item-title">响应配置</span>
        </template>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
export default {
  props: ["isVisible"],
  emits: ["update:isVisible"],
  data() {
    return {
      currentAcceptEvent: "AddAcceptEvent",
      currentSendEvent: "AddSendEvent",
      AcceptEvents: [],
      SendEvents: [],
      acceptEventToCreate: { name:""},
      sendEventToCreate: {name:""},
      deviceToCreate: { name: "" },
      currentActiveItem: "AddDevice",
      devices: [],
    };
  },
  inject: ["socket"],
  mounted() {
    for (let i = 0; i < 100; i++) {
      this.devices.push({
        name: "device" + i,
        IP: "127.0.0.1",
        port: 9090,
        type: "TcpListener",
        upload: true,
        reconnect: true,
        endFlag: true,
      });
    }
    console.log(this.devices);

    this.socket.on("TcpConnectorReceivedData", (data) =>
      console.log(`TcpConnectorReceivedData: ${data}`)
    );
    this.socket.on("TcpListenerReceivedData", (data) =>
      console.log(`TcpListenerReceivedData: ${data}`)
    );
    this.socket.on("UdpListenerReceivedData", (data) =>
      console.log(`UdpListenerReceivedData: ${data}`)
    );
  },
  unmounted() {
    this.socket.off("TcpConnectorReceivedData");
    this.socket.off("TcpListenerReceivedData");
    this.socket.off("UdpListenerReceivedData");
  },
  methods: {
    onCreateSendEvent() {
      
      this.SendEvents.push(this.sendEventToCreate);
      console.log(this.SendEvents);
      this.sendEventToCreate = {}; // 重置为一个新的空对象

    },
    onCreateAcceptEvent() {
      
      this.AcceptEvents.push(this.acceptEventToCreate);
      console.log(this.AcceptEvents);
      this.acceptEventToCreate = {}; // 重置为一个新的空对象

    },
    onCreateDevice() {
      this.deviceToCreate.receivedData = "";
      this.deviceToCreate.dataToSend = "";
      // if deviceToCreate has port field convert it to number
      if (this.deviceToCreate.port) {
        this.deviceToCreate.port = Number(this.deviceToCreate.port);
      }
      console.log(this.deviceToCreate);
      this.devices.push(this.deviceToCreate);

      const operation = `Add${this.deviceToCreate.type}`;
      this.socket.emit(operation, JSON.stringify(this.deviceToCreate));
    },
  },
};
</script>

<style>
.left-menu .el-tabs__item {
  height: 60px;
}

.receive-send-menu .el-tabs__item {
  height: var(--el-tabs-header-height);
}

.left-menu .el-tabs__content {
  height: 100%;
}

.receive-send-menu .el-tabs__content {
  height: 80%;
}

.receive-send-menu textarea {
  height: 100%;
}

.left-menu .menu-item-title {
  margin-left: 10px;
}

.left-menu .pane {
  height: 100%;
}

.left-menu .row {
  height: 100%;
}

.left-menu .list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.left-menu .li-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: lightblue;
}
</style>
