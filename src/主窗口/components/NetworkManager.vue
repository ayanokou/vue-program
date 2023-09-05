<template>
  <el-dialog
    title="通信管理"
    :model-value="isVisible"
    @close="$emit('update:isVisible', false)"
    style="width: 60vw"
  >
    <el-tabs class="left-menu" tab-position="left" style="height: 60vh">
      <el-tab-pane class="pane">
        <template #label>
          <el-icon>
            <Monitor />
          </el-icon>
          <span class="menu-item-title">设备管理</span>
        </template>
        <el-row class="row" :gutter="20">
          <el-col
            :span="8"
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
                    @click="onClickDevice(index)"
                    style="cursor: pointer"
                    class="li-item"
                  >
                    <span>{{ device.name }}</span>
                    <el-switch v-model="device.enabled"></el-switch>
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </el-col>
          <el-col :span="16" style="height: 100%">
            <el-tabs class="params-menu">
              <el-tab-pane label="通信参数">
                <el-form
                  ref="createDeviceFormRef"
                  :model="currentDevice"
                  :disabled="!isCreatingDevice"
                  :rules="createDeviceRules"
                  style="margin-top: 15px"
                >
                  <el-row :gutter="20">
                    <el-col :span="10">
                      <el-form-item label="名称" prop="name">
                        <el-input v-model="currentDevice.name"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="协议类型">
                        <el-select v-model="currentDevice.deviceType">
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
                          <el-option
                            label="Modbus主站"
                            value="ModbusMaster"
                          ></el-option>
                          <el-option
                            label="串口"
                            value="SerialPort"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <template
                    v-if="
                      currentDevice.deviceType === 'TcpListener' ||
                      currentDevice.deviceType === 'TcpConnector' ||
                      currentDevice.deviceType === 'UdpListener'
                    "
                  >
                    <el-row :gutter="20">
                      <el-col :span="14">
                        <el-form-item label="目标IP">
                          <el-input v-model="currentDevice.IP"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="10">
                        <el-form-item label="目标端口">
                          <el-input-number
                            v-model="currentDevice.port"
                          ></el-input-number>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="数据上传">
                          <el-switch v-model="currentDevice.upload"></el-switch>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="自动重连">
                          <el-switch
                            v-model="currentDevice.reconnect"
                          ></el-switch>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="接受结束符">
                          <el-switch
                            v-model="currentDevice.endFlag"
                          ></el-switch>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <div
                      v-if="isCreatingDevice"
                      style="display: flex; justify-content: end"
                    >
                      <el-form-item>
                        <el-button type="primary" @click="onCreateDevice"
                          >创建</el-button
                        >
                      </el-form-item>
                    </div>
                  </template>
                  <template
                    v-else-if="currentDevice.deviceType === 'ModbusMaster'"
                  >
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="功能码">
                          <el-select v-model="currentDevice.functionType">
                            <el-option label="读保持寄存器" :value="0">
                            </el-option>
                            <el-option
                              label="读输入寄存器"
                              :value="1"
                            ></el-option>
                            <el-option
                              label="写多个寄存器"
                              :value="2"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="设备地址">
                          <el-input-number
                            v-model="currentDevice.deviceAddress"
                            min="0"
                          >
                          </el-input-number>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="寄存器地址">
                          <el-input-number
                            v-model="currentDevice.registerAddress"
                            min="0"
                          >
                          </el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="寄存器个数">
                          <el-input-number
                            v-model="currentDevice.numberOfRegisters"
                            min="1"
                          >
                          </el-input-number>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-divider></el-divider>
                    <el-row>
                      <el-col>
                        <el-form-item label="底层协议类型">
                          <el-select v-model="currentDevice.protocol">
                            <el-option label="TCP" value="TCP"></el-option>
                            <el-option label="RTU" value="RTU"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <template v-if="currentDevice.protocol === 'TCP'">
                      <el-row :gutter="20">
                        <el-col :span="14">
                          <el-form-item label="目标IP">
                            <el-input v-model="currentDevice.IP"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="10">
                          <el-form-item label="目标端口">
                            <el-input-number
                              v-model="currentDevice.port"
                            ></el-input-number>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <div
                        v-if="isCreatingDevice"
                        style="display: flex; justify-content: end"
                      >
                        <el-form-item>
                          <el-button type="primary" @click="onCreateDevice"
                            >创建</el-button
                          >
                        </el-form-item>
                      </div>
                    </template>
                    <template v-else-if="currentDevice.protocol === 'RTU'">
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-form-item label="设备名">
                            <el-input v-model="currentDevice.device"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="波特率">
                            <el-input-number
                              v-model="currentDevice.baud"
                            ></el-input-number>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row :gutter="20">
                        <el-col :span="8">
                          <el-form-item label="数据位">
                            <el-select v-model="currentDevice.dataBits">
                              <el-option label="8" :value="8"></el-option>
                              <el-option label="7" :value="7"></el-option>
                              <el-option label="6" :value="6"></el-option>
                              <el-option label="5" :value="5"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="停止位">
                            <el-select v-model="currentDevice.stopBits">
                              <el-option label="1" :value="1"></el-option>
                              <el-option label="2" :value="2"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="校验位">
                            <el-select v-model="currentDevice.parity">
                              <el-option label="无" value="N"></el-option>
                              <el-option label="奇校验" value="O"></el-option>
                              <el-option label="偶校验" value="E"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <div
                        v-if="isCreatingDevice"
                        style="display: flex; justify-content: end"
                      >
                        <el-form-item>
                          <el-button type="primary" @click="onCreateDevice"
                            >创建</el-button
                          >
                        </el-form-item>
                      </div>
                    </template>
                  </template>
                  <template
                    v-else-if="currentDevice.deviceType === 'SerialPort'"
                  >
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="串口号">
                          <el-input v-model="currentDevice.device"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12"
                        ><el-form-item label="校验位">
                          <el-select v-model="currentDevice.parity">
                            <el-option label="无" value="N"></el-option>
                            <el-option label="奇校验" value="O"></el-option>
                            <el-option label="偶校验" value="E"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="数据位">
                          <el-select v-model="currentDevice.dataBits">
                            <el-option label="1" :value="1"></el-option>
                            <el-option label="1.5" :value="1.5"></el-option>
                            <el-option label="2" :value="2"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="波特率">
                          <el-input-number
                            v-model="currentDevice.baud"
                            min="1"
                          ></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="停止位">
                          <el-select v-model="currentDevice.stopBits">
                            <el-option label="6" :value="6"></el-option>
                            <el-option label="7" :value="7"></el-option>
                            <el-option label="8" :value="8"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <div
                      v-if="isCreatingDevice"
                      style="display: flex; justify-content: end"
                    >
                      <el-form-item>
                        <el-button type="primary" @click="onCreateDevice"
                          >创建</el-button
                        >
                      </el-form-item>
                    </div>
                  </template>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="接收数据" v-if="!isCreatingDevice">
                <el-form style="margin-top: 5px; height: 100%">
                  <el-form-item style="height: 80%">
                    <el-input
                      type="textarea"
                      :rows="5"
                      readonly
                      resize="none"
                      placeholder="..."
                      v-model="currentDevice.receivedData"
                      style="height: 100%"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="发送数据" v-if="!isCreatingDevice">
                <el-form style="margin-top: 5px; height: 100%">
                  <el-form-item style="height: 80%; margin-bottom: 5px">
                    <el-input
                      type="textarea"
                      :rows="5"
                      placeholder="请输入内容"
                      v-model="currentDevice.dataToSend"
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
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane class="pane">
        <template #label>
          <el-icon>
            <SortDown />
          </el-icon>
          <span class="menu-item-title">接收事件</span>
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
                    {{
                      index +
                      AcceptEvent.manner +
                      (AcceptEvent.manner === "脚本"
                        ? ""
                        : "-" + AcceptEvent.type)
                    }}
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </el-col>
          <el-col :span="18" style="height: 100%">
            <el-tabs class="SendEventParams-menu">
              <el-tab-pane label="参数">
                <el-form
                  :model="CurrentAcceptEvent"
                  :disabled="!isCreatingAcceptEvent()"
                  style="margin-top: 15px"
                >
                  <el-row :gutter="20">
                    <el-col :span="10">
                      <el-form-item label="处理方式">
                        <el-select v-model="CurrentAcceptEvent.manner">
                          <el-option label="文本" value="文本"></el-option>
                          <el-option
                            label="字节匹配"
                            value="字节匹配"
                          ></el-option>
                          <el-option label="脚本" value="脚本"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="事件类型">
                        <el-select
                          v-model="CurrentAcceptEvent.type"
                          :disabled="CurrentAcceptEvent.manner === '脚本'"
                        >
                          <el-option
                            v-if="CurrentAcceptEvent.manner != '字节匹配'"
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

                  <div
                    v-if="isCreatingAcceptEvent()"
                    style="display: flex; justify-content: end"
                  >
                    <el-form-item>
                      <el-button type="primary" @click="onCreateAcceptEvent"
                        >创建</el-button
                      >
                    </el-form-item>
                  </div>
                </el-form>
              </el-tab-pane>

              <el-tab-pane
                v-if="
                  (CurrentAcceptEvent.type === '协议解析' ||
                    CurrentAcceptEvent.manner == '脚本') &&
                  !isCreatingAcceptEvent()
                "
                label="设置"
              >
                <template v-if="CurrentAcceptEvent.manner == '文本'">
                  <p style="margin-top: 0">绑定设备</p>

                  <el-row :gutter="20">
                    <el-col :span="14">
                      <el-form-item label="绑定设备">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <p style="margin-top: 0">基本配置</p>

                  <el-row :gutter="20">
                    <el-col :span="14">
                      <el-form-item label="分隔符">
                        <el-select v-model="CurrentAcceptEvent.separator">
                          <el-option label=";" value=";"></el-option>
                        </el-select>
                      </el-form-item>

                      <el-form-item label="字符长度比较">
                        <el-switch
                          v-model="CurrentAcceptEvent.CharacterLengthComparison"
                        ></el-switch>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <p style="margin-top: 0">输出列表</p>
                  <el-row :gutter="20">
                    <el-col :span="14">
                      <el-table
                        :data="CurrentAcceptEvent.ParametersTable"
                        style="width: 100%"
                      >
                        <el-table-column
                          prop="licenseName"
                          label="序号"
                          width="180"
                        />
                        <el-table-column
                          prop="procedureName"
                          label="名称"
                          width="180"
                        />
                        <el-table-column prop="description" label="类型" />
                        <el-table-column prop="description" label="数据结果" />
                      </el-table>
                    </el-col>
                  </el-row>
                </template>

                <template v-if="CurrentAcceptEvent.manner == '脚本'">
                  <p style="margin-top: 0">绑定设备</p>

                  <el-row :gutter="20">
                    <el-col :span="14">
                      <el-form-item label="绑定设备">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <p style="margin-top: 0">基本配置</p>
                  <el-row :gutter="20">
                    <el-col :span="14">
                      <el-form-item label="回复给设备">
                        <el-switch
                          v-model="CurrentAcceptEvent.ReturnToDevice"
                        ></el-switch>
                      </el-form-item>

                      <el-form-item label="载入路径">
                        <el-input v-model="CurrentAcceptEvent.load"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <p style="margin-top: 0">组装列表</p>
                  <el-row :gutter="20">
                    <el-col :span="14">
                      <el-table
                        :data="CurrentAcceptEvent.ParametersTable"
                        style="width: 100%"
                      >
                        <el-table-column
                          prop="licenseName"
                          label="序号"
                          width="180"
                        />
                        <el-table-column
                          prop="procedureName"
                          label="名称"
                          width="180"
                        />
                        <el-table-column prop="description" label="类型" />
                        <el-table-column prop="description" label="数据结果" />
                      </el-table>
                    </el-col>
                  </el-row>
                </template>
              </el-tab-pane>

              <el-tab-pane
                v-if="
                  CurrentAcceptEvent.type === '协议组装' &&
                  !isCreatingAcceptEvent()
                "
                label="输入配置"
              >
                <p style="margin-top: 0">绑定设备</p>

                <el-row :gutter="20">
                  <el-col :span="14">
                    <el-form-item label="绑定设备">
                      <el-input></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <p style="margin-top: 0">基本配置</p>

                <el-row :gutter="20">
                  <el-col :span="14">
                    <el-form-item label="分隔符">
                      <el-select v-model="CurrentAcceptEvent.separator">
                        <el-option label=";" value=";"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="字符长度比较">
                      <el-switch
                        v-model="CurrentAcceptEvent.CharacterLengthComparison"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>

                <p style="margin-top: 0">解析列表</p>
                <el-row :gutter="20">
                  <el-col :span="14">
                    <el-table
                      :data="CurrentAcceptEvent.ParametersTable"
                      style="width: 100%"
                    >
                      <el-table-column
                        prop="licenseName"
                        label="序号"
                        width="180"
                      />
                      <el-table-column
                        prop="procedureName"
                        label="名称"
                        width="180"
                      />
                      <el-table-column prop="description" label="类型" />
                      <el-table-column
                        prop="description"
                        label="比较规则配置"
                      />
                    </el-table>
                  </el-col>
                </el-row>
              </el-tab-pane>

              <el-tab-pane
                v-if="
                  CurrentAcceptEvent.type === '协议组装' &&
                  !isCreatingAcceptEvent()
                "
                label="组装配置"
              >
                <p style="margin-top: 0">基本配置</p>
                <el-row :gutter="20">
                  <el-col :span="14">
                    <el-form-item label="回复给设备">
                      <el-switch
                        v-model="CurrentAcceptEvent.ReturnToDevice"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>

                <p style="margin-top: 0">组装列表</p>
                <el-row :gutter="20">
                  <el-col :span="14">
                    <el-table
                      :data="CurrentAcceptEvent.ParametersTable"
                      style="width: 100%"
                    >
                      <el-table-column
                        prop="licenseName"
                        label="序号"
                        width="180"
                      />
                      <el-table-column
                        prop="procedureName"
                        label="类型"
                        width="180"
                      />
                      <el-table-column prop="description" label="内容" />
                      <el-table-column prop="description" label="数据结果" />
                    </el-table>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
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
                    {{
                      index +
                      SendEvent.manner +
                      (SendEvent.manner === "脚本" ? "" : "-" + SendEvent.type)
                    }}
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </el-col>
          <el-col :span="18" style="height: 100%">
            <el-tabs class="SendEventParams-menu">
              <el-tab-pane label="参数">
                <el-form
                  :model="CurrentSendEvent"
                  :disabled="!isCreatingSendEvent()"
                  style="margin-top: 15px"
                >
                  <el-row :gutter="20">
                    <el-col :span="10">
                      <el-form-item label="处理方式">
                        <el-select v-model="CurrentSendEvent.manner">
                          <el-option label="文本" value="文本"></el-option>
                          <el-option label="脚本" value="脚本"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="事件类型">
                        <el-select
                          v-model="CurrentSendEvent.type"
                          :disabled="CurrentSendEvent.manner === '脚本'"
                        >
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

                  <div
                    v-if="isCreatingSendEvent()"
                    style="display: flex; justify-content: end"
                  >
                    <el-form-item>
                      <el-button type="primary" @click="onCreateSendEvent"
                        >创建</el-button
                      >
                    </el-form-item>
                  </div>
                </el-form>
              </el-tab-pane>

              <el-tab-pane
                v-if="
                  (CurrentSendEvent.type === '直接输出' ||
                    CurrentSendEvent.manner == '脚本') &&
                  !isCreatingSendEvent()
                "
                label="设置"
              >
                <template v-if="CurrentSendEvent.manner == '文本'">
                  <p style="margin-top: 0">绑定设备</p>

                  <el-row :gutter="20">
                    <el-col :span="14">
                      <el-form-item label="绑定设备">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <p style="margin-top: 0">基本配置</p>

                  <el-row :gutter="20">
                    <el-col :span="14">
                      <el-form-item label="分隔符">
                        <el-select v-model="CurrentSendEvent.separator">
                          <el-option label=";" value=";"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <p style="margin-top: 0">参数列表</p>
                  <el-row :gutter="20">
                    <el-col :span="14">
                      <el-table
                        :data="CurrentSendEvent.ParametersTable"
                        style="width: 100%"
                      >
                        <el-table-column
                          prop="licenseName"
                          label="序号"
                          width="180"
                        />
                        <el-table-column
                          prop="procedureName"
                          label="名称"
                          width="180"
                        />
                        <el-table-column prop="description" label="类型" />
                      </el-table>
                    </el-col>
                  </el-row>
                </template>

                <template v-if="CurrentSendEvent.manner == '脚本'">
                  <p style="margin-top: 0">绑定设备</p>

                  <el-row :gutter="20">
                    <el-col :span="14">
                      <el-form-item label="绑定设备">
                        <el-input></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="20">
                    <el-col :span="14">
                      <el-form-item label="载入路径">
                        <el-input v-model="CurrentSendEvent.load"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <p style="margin-top: 0">组装列表</p>
                  <el-row :gutter="20">
                    <el-col :span="14">
                      <el-table
                        :data="CurrentSendEvent.ParametersTable"
                        style="width: 100%"
                      >
                        <el-table-column
                          prop="licenseName"
                          label="序号"
                          width="180"
                        />
                        <el-table-column
                          prop="procedureName"
                          label="名称"
                          width="180"
                        />
                        <el-table-column prop="description" label="类型" />
                      </el-table>
                    </el-col>
                  </el-row>
                </template>
              </el-tab-pane>

              <el-tab-pane
                v-if="
                  CurrentSendEvent.type === '组装输出' && !isCreatingSendEvent()
                "
                label="输入配置"
              >
                <p style="margin-top: 0">绑定设备</p>

                <el-row :gutter="20">
                  <el-col :span="14">
                    <el-form-item label="绑定设备">
                      <el-input></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <p style="margin-top: 0">参数列表</p>
                <el-row :gutter="20">
                  <el-col :span="14">
                    <el-table
                      :data="CurrentSendEvent.ParametersTable"
                      style="width: 100%"
                    >
                      <el-table-column
                        prop="licenseName"
                        label="序号"
                        width="180"
                      />
                      <el-table-column
                        prop="procedureName"
                        label="名称"
                        width="180"
                      />
                      <el-table-column prop="description" label="类型" />
                    </el-table>
                  </el-col>
                </el-row>
              </el-tab-pane>

              <el-tab-pane
                v-if="
                  CurrentSendEvent.type === '组装输出' && !isCreatingSendEvent()
                "
                label="组装配置"
              >
                <p style="margin-top: 0">分隔符设置</p>
                <el-row :gutter="20">
                  <el-col :span="14">
                    <el-form-item label="分隔符">
                      <el-select v-model="CurrentSendEvent.separator">
                        <el-option label=";" value=";"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <p style="margin-top: 0">组装列表</p>
                <el-row :gutter="20">
                  <el-col :span="14">
                    <el-table
                      :data="CurrentSendEvent.ParametersTable"
                      style="width: 100%"
                    >
                      <el-table-column
                        prop="licenseName"
                        label="序号"
                        width="180"
                      />
                      <el-table-column
                        prop="procedureName"
                        label="类型"
                        width="180"
                      />
                      <el-table-column prop="description" label="内容" />
                    </el-table>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
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
      SendAssembleTable: [],
      currentAcceptEvent: "AddAcceptEvent",
      currentSendEvent: "AddSendEvent",
      AcceptEvents: [],
      SendEvents: [],
      acceptEventToCreate: { name: "" },
      sendEventToCreate: { name: "" },
      deviceToCreate: { name: "" },
      currentActiveItem: "AddDevice",
      devices: [],
      createDeviceRules: {
        name: [
          { required: true, trigger: "blur" },
          { validator: this.validateDeviceName, trigger: "blur" },
        ],
      },
    };
  },
  inject: ["socket"],
  computed: {
    CurrentAcceptEvent() {
      return this.isCreatingAcceptEvent()
        ? this.acceptEventToCreate
        : this.AcceptEvents[this.currentAcceptEvent];
    },
    currentDevice() {
      return this.isCreatingDevice
        ? this.deviceToCreate
        : this.devices[this.currentActiveItem];
    },

    CurrentSendEvent() {
      return this.isCreatingSendEvent()
        ? this.sendEventToCreate
        : this.SendEvents[this.currentSendEvent];
    },

    isCreatingDevice() {
      return this.currentActiveItem === "AddDevice";
    },
  },
  mounted() {
    this.socket.on("DeviceReceivedData", (data) =>
      // find device according to data.name
      // then append data to device.receivedData
      {
        data = JSON.parse(data);
        console.log(data);
        for (let i = 0; i < this.devices.length; i++) {
          if (this.devices[i].name === data.name) {
            this.devices[i].receivedData += data.data;
            break;
          }
        }
      }
    );
  },
  unmounted() {
    this.socket.off("DeviceReceivedData");
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
    isCreatingAcceptEvent() {
      return this.currentAcceptEvent === "AddAcceptEvent";
    },
    isCreatingSendEvent() {
      return this.currentSendEvent === "AddSendEvent";
    },
    onCreateDevice() {
      this.$refs.createDeviceFormRef.validate((isValid, invalidFields) => {
        if (!isValid) {
          return;
        }

        const FieldsMap = {
          TcpListener: [
            "name",
            "deviceType",
            "IP",
            "port",
            "upload",
            "reconnect",
            "endFlag",
          ],
          TcpConnector: [
            "name",
            "deviceType",
            "IP",
            "port",
            "upload",
            "reconnect",
            "endFlag",
          ],
          UdpListener: [
            "name",
            "deviceType",
            "IP",
            "port",
            "upload",
            "reconnect",
            "endFlag",
          ],
          ModbusMaster: {
            TCP: [
              "name",
              "deviceType",
              "functionType",
              "deviceAddress",
              "registerAddress",
              "numberOfRegisters",
              "protocol",
              "IP",
              "port",
            ],
            RTU: [
              "name",
              "deviceType",
              "functionType",
              "deviceAddress",
              "registerAddress",
              "numberOfRegisters",
              "protocol",
              "device",
              "baud",
              "dataBits",
              "stopBits",
              "parity",
            ],
          },
          SerialPort: [
            "name",
            "deviceType",
            "device",
            "baud",
            "dataBits",
            "stopBits",
            "parity",
          ],
        };

        const DeviceType = {
          TcpListener: 0,
          TcpConnector: 1,
          UdpListener: 2,
          ModbusMaster: 3,
          SerialPort: 4,
        };

        // filter out wrong fields
        if (this.deviceToCreate.deviceType === "ModbusMaster") {
          this.deviceToCreate = Object.fromEntries(
            Object.entries(this.deviceToCreate).filter(([key, value]) => {
              return FieldsMap.ModbusMaster[
                this.deviceToCreate.protocol
              ].includes(key);
            })
          );
        } else {
          this.deviceToCreate = Object.fromEntries(
            Object.entries(this.deviceToCreate).filter(([key, value]) => {
              return FieldsMap[this.deviceToCreate.deviceType].includes(key);
            })
          );
        }

        this.deviceToCreate.enabled = true;
        this.deviceToCreate.receivedData = "";

        this.devices.push({ ...this.deviceToCreate });

        // map deviceType to number in a new object
        const deviceToCreate = { ...this.deviceToCreate };
        deviceToCreate.deviceType = DeviceType[deviceToCreate.deviceType];

        console.log(JSON.stringify(deviceToCreate));

        this.socket.emit("AddDevice", JSON.stringify(deviceToCreate));
      });
    },
    onClickDevice(index) {
      this.currentActiveItem = index;
    },
    validateDeviceName(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入设备名称"));
      } else {
        for (const device of this.devices) {
          if (device.name === value) {
            callback(new Error("设备名称已存在"));
          }
        }
        callback();
      }
    },
  },
};
</script>

<style scoped>
.left-menu :deep(.el-tabs__item) {
  height: 60px;
}

.params-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.params-menu :deep(.el-tab-pane) {
  height: 100%;
}

.params-menu :deep(textarea) {
  height: 100%;
}

.params-menu :deep(.el-tabs__item) {
  height: var(--el-tabs-header-height);
}

.left-menu :deep(.el-tabs__content) {
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
  justify-content: space-between;
  padding: 0 15px;
  height: 30px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: lightblue;
}
</style>
