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
                  :model="currentDevice"
                  :disabled="!isCreatingDevice()"
                  style="margin-top: 15px"
                >
                  <el-row :gutter="20">
                    <el-col :span="10">
                      <el-form-item label="名称">
                        <el-input v-model="currentDevice.name"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">
                      <el-form-item label="协议类型">
                        <el-select v-model="currentDevice.type">
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
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <template
                    v-if="
                      currentDevice.type === 'TcpListener' ||
                      currentDevice.type === 'TcpConnector' ||
                      currentDevice.type === 'UdpListener'
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
                      v-if="isCreatingDevice()"
                      style="display: flex; justify-content: end"
                    >
                      <el-form-item>
                        <el-button type="primary" @click="onCreateDevice"
                          >创建</el-button
                        >
                      </el-form-item>
                    </div>
                  </template>
                  <template v-else-if="currentDevice.type === 'ModbusMaster'">
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="功能码">
                          <el-select v-model="currentDevice.functionType">
                            <el-option
                              label="读保持寄存器"
                              value="readRegister"
                            >
                            </el-option>
                            <el-option
                              label="读输入寄存器"
                              value="readInputRegister"
                            ></el-option>
                            <el-option
                              label="写多个寄存器"
                              value="writeRegisters"
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
                        v-if="isCreatingDevice()"
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
                            <el-input-number v-model="currentDevice.baud"></el-input-number>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row :gutter="20">
                        <el-col :span="8">
                          <el-form-item label="数据位">
                            <el-select v-model="currentDevice.dataBits">
                              <el-option label="8" value="8"></el-option>
                              <el-option label="7" value="7"></el-option>
                              <el-option label="6" value="6"></el-option>
                              <el-option label="5" value="5"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="停止位">
                            <el-select v-model="currentDevice.stopBits">
                              <el-option label="1" value="1"></el-option>
                              <el-option label="2" value="2"></el-option>
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
                        v-if="isCreatingDevice()"
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
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="接收数据" v-if="!isCreatingDevice()">
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
              <el-tab-pane label="发送数据" v-if="!isCreatingDevice()">
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
  computed: {
    currentDevice() {
      return this.isCreatingDevice()
        ? this.deviceToCreate
        : this.devices[this.currentActiveItem];
    },
  },
  mounted() {
    this.devices = [
      {
        enabled: true,
        name: "TcpListener1",
        type: "TcpListener",
        IP: "127.0.0.1",
        port: 8080,
      },
      {
        enabled: true,
        name: "TcpConnector1",
        type: "TcpConnector",
        IP: "127.0.0.1",
        port: 8090,
      },
      {
        enabled: true,
        name: "UdpListener1",
        type: "UdpListener",
        IP: "127.0.0.1",
        port: 9090,
      },
      {
        enabled: true,
        name: "ModbusMaster1",
        type: "ModbusMaster",
        functionType: "readRegister",
        deviceAddress: 1,
        registerAddress: 0,
        registerNumber: 1,
        protocol: "TCP",
        IP: "127.0.0.1",
        port: 502,
      },
      {
        enabled: true,
        name: "ModbusMaster2",
        type: "ModbusMaster",
        functionType: "readRegister",
        deviceAddress: 1,
        registerAddress: 0,
        registerNumber: 1,
        protocol: "RTU",
        device: "COM1",
        baud: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: "N",
      },
    ];
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
    isCreatingDevice() {
      return this.currentActiveItem === "AddDevice";
    },
    onCreateDevice() {
      const fieldsMap = {
        TcpListener: [
          "name",
          "type",
          "IP",
          "port",
          "upload",
          "reconnect",
          "endFlag",
        ],
        TcpConnector: [
          "name",
          "type",
          "IP",
          "port",
          "upload",
          "reconnect",
          "endFlag",
        ],
        UdpListener: [
          "name",
          "type",
          "IP",
          "port",
          "upload",
          "reconnect",
          "endFlag",
        ],
        ModbusMaster: {
          TCP: [
            "name",
            "type",
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
            "type",
            "functionType",
            "deviceAddress",
            "registerAddress",
            "registerNumber",
            "protocol",
            "device",
            "baud",
            "dataBits",
            "stopBits",
            "parity",
          ],
        },
      };
      const numberFields = [
        "port",
        "deviceAddress",
        "registerAddress",
        "numberOfRegisters",
        "baud",
        "dataBits",
        "stopBits",
      ];

      // filter out wrong fields
      if (this.deviceToCreate.type === "ModbusMaster") {
        this.deviceToCreate = Object.fromEntries(
          Object.entries(this.deviceToCreate).filter(([key, value]) => {
            return fieldsMap.ModbusMaster[this.deviceToCreate.protocol].includes(
              key
            );
          })
        );
      } else {
        this.deviceToCreate = Object.fromEntries(
          Object.entries(this.deviceToCreate).filter(([key, value]) => {
            return fieldsMap[this.deviceToCreate.type].includes(key);
          })
        );
      }

      // make sure number fields are numbers
      for (const field of numberFields) {
        if (this.deviceToCreate[field]) {
          this.deviceToCreate[field] = Number(this.deviceToCreate[field]);
        }
      }

      console.log(this.deviceToCreate);
      this.devices.push(this.deviceToCreate);

      const operation = `Add${this.deviceToCreate.type}`;
      this.socket.emit(operation, JSON.stringify(this.deviceToCreate));
    },
    onClickDevice(index) {
      this.currentActiveItem = index;
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
