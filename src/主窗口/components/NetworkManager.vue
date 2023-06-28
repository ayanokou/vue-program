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
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
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
                        <el-select v-model="deviceToCreate.protocol">
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
                      deviceToCreate.protocol === 'TcpListener' ||
                      deviceToCreate.protocol === 'TcpConnector' ||
                      deviceToCreate.protocol === 'UdpListener'
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
                        <el-button type="primary" @click="onSubmit"
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
                            v-model="devices[currentActiveItem].receiveData"
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
                            v-model="devices[currentActiveItem].sendData"
                            resize="none"
                            style="height: 100%"
                          ></el-input>
                        </el-form-item>
                        <div
                          style="
                            display: flex;
                            justify-content: end;
                          "
                        >
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
      </el-tab-pane>
      <el-tab-pane class="pane">
        <template #label>
          <el-icon>
            <SortUp />
          </el-icon>
          <span class="menu-item-title">发送事件</span>
        </template>
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
      deviceToCreate: { name: "" },
      currentActiveItem: "AddDevice",
      devices: [],
    };
  },
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
  },
  methods: {
    onSubmit() {
      console.log(this.deviceToCreate);
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
