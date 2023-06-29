
import ProcessDp from "@/流程图操作/FlowArea.vue";
import ImageArea from "@/图像操作/ImageArea.vue";
import ResultArea from "@/流程图操作/结果描述与帮助/ResultArea.vue";
import LayoutOne from "@/主窗口/components/layout/LayoutOne.vue";
import LayoutTwo from "@/主窗口/components/layout/LayoutTwo.vue";
import LayoutThree from "@/主窗口/components/layout/LayoutThree.vue";
import GlobalVar from "../components/GlobalVar.vue";
import NetworkManager from "../components/NetworkManager.vue";
import { computed } from "vue";
import { mapState } from "vuex";
import axiosInstance from "../../axios"

//初始化socketio用于前后端传输
let socket = io.connect('http://localhost:9092')

export default {
    components:{
        GlobalVar,
        NetworkManager
    },
    data() {
        return {
          selectedOption: "", // 用于存储选择的选项值
          selectedOptionContent: "", // 用于存储选项对应的内容
          options: [
            { label: "选项一", value: "option1", content: "选项一的内容" },
            { label: "选项二", value: "option2", content: "选项二的内容" },
            { label: "TCP客户端", value: "TCP客户端", content: "tcp" },
          ],
          deviceName: "device1",
          ip: "127.0.0.1",
          portNumber: 7920,
          isIPValid: true,
          updataValue: true,
          autoReconnection: false,
          receiveEndMark: false,
          demoSelectedTCP: false,
          //是否显示通信管理窗口
          communicationManagementVisible: false,
          subCommunicationManagementVisible: false,
          testFlag: false,
          activeIcon: "deviceManagement",
          selectedGroup: "接收数据",
          group1Input: "", //通信管理-设备管理接收数据
          group2Output: "", //通信管理-设备管理发送数据
          //是否显示最近打开方案子菜单栏
          showLastOpenSolution: false,
          //最近打开的方案名，存三个
          lastOpenSolutions: [],
          //存储示例方案
          exampleSolutions: [],
          //右半部分的高度
          height_right: window.innerHeight - 82,
          mainLayout: LayoutOne,
          compnts: [ProcessDp, ImageArea, ResultArea],
          moduleResultData: [
            {
              id: 1,
              paramName: "参数名",
              currentResult: "当前结果",
              globalVariable: "全局变量",
              children: [
                {
                  id: 2,
                  paramName: "参数名",
                  currentResult: "当前结果",
                  globalVariable: "全局变量",
                },
                {
                  id: 3,
                  paramName: "参数名",
                  currentResult: "当前结果",
                  globalVariable: "全局变量",
                },
                {
                  id: 4,
                  paramName: "参数名",
                  currentResult: "当前结果",
                  globalVariable: "全局变量",
                  children: [
                    {
                      id: 5,
                      paramName: "参数名",
                      currentResult: "当前结果",
                      globalVariable: "全局变量",
                    },
                  ],
                },
              ],
            },
            {
              id: 6,
              paramName: "参数名",
              currentResult: "当前结果",
              globalVariable: "全局变量",
            },
          ],
          currentTableData: [],
          historyTableData: [],
          helpInfo: "",
        //   communicator: {
        //     tcpClient: net.createConnection(
        //       { port: 8180, host: "localhost" },
        //       () => console.log("connected to communicator server!")
        //     ),
        //     buf: "",
        //   },
        };
    },
    //在顶端组件提供模块结果数据
    provide() {
        return {
            moduleResultData: computed(() => { return this.moduleResultData }),
            currentTableData: computed(() => this.currentTableData),
            historyTableData: computed(() => this.historyTableData),
            helpInfo: computed(() => this.helpInfo),
            socket: computed(() => socket),
        }
    },

    mounted() {
        //动态调整右半部分尺寸
        window.addEventListener('resize', this.dynamicRightHeight)
        socket.on('flowChartOK',(data)=>{
            console.log('in flow chart ok'+data)
            this.$store.commit('setFlowChartOK',{
                trigger:true,
                index:parseInt(data)
            })
        })
        socket.on('run_state',(data)=>{
            this.$store.commit('setRunState',{
                trigger:true,
                content:JSON.parse(data)
            })
        })
        socket.on('revBase64',(data)=>{

            this.$store.commit('setImgBase64',JSON.parse(data).content)
        })
        socket.on('revGeneral',(data)=>{
            this.$store.commit('setGeneralResult',data)
        })
        socket.on('revRunResult', (data) => {
            //先传递给FlowArea组件
            this.$store.commit('setRunResult',data)
        })

        socket.on('revTimeConsume',(data)=>{
            this.$store.commit('timeConsumeEvent', data);
        })

        socket.on("TcpConnectorReceivedData", (data) =>
          console.log(`TcpConnectorReceivedData: ${data}`)
        );
        socket.on("TcpListenerReceivedData", (data) =>
          console.log(`TcpListenerReceivedData: ${data}`)
        );
        socket.on("UdpListenerReceivedData", (data) =>
          console.log(`UdpListenerReceivedData: ${data}`)
        );
        // socket.on('revRects',(data)=>{
        //     this.$store.commit('setModuleResultData', data);
        // })

        
    },
    computed:{
        ...mapState(['socketEmit','dialogVisibleGlobalVar'])
    },
    watch:{
        socketEmit(newValue){
            if(newValue.trigger){
                
                socket.emit(newValue.mode, {
                    message:JSON.stringify({data:newValue.data})
                });
                
                this.$store.commit("setSocketEmit",{
                    trigger:false
                })
            }
        }

    },
    methods: {
        openTest(){
            this.testFlag = true
        },
        selectGroup(group) {
            this.selectedGroup = group;
            
        },

        sendTCPData(){
            let payload={
                trigger:true,
                mode:"TCP",
                data:{ip:this.ip, port: this.portNumber, data:this.group2Output}
            }
            this.$store.commit("setSocketEmit",payload)
        },

        createAnDevice(){
            const getOperationName = name => {
                switch(name){
                    case 'TCP客户端':
                        return 'AddTcpConnector'
                    case 'TCP服务端':
                        return 'AddTcpListener'
                    case 'UDP':
                        return 'AddUdpListener'
                    default:
                        return undefined
                }
            }
            const operationName = getOperationName(this.selectedOption)
            if(operationName === undefined){
                this.$message.error('请选择通信方式')
                return
            }
            this.demoSelectedTCP = true;

            let payload = {
              trigger: true,
              mode: operationName,
              data: { IP: this.ip, port: parseInt(this.portNumber) }               
            };

            this.$store.commit("setSocketEmit", payload);

            this.subCommunicationManagementVisible = false;
        },

        validateIP() {
            const parts = this.ip.split('.');
            this.isIPValid = parts.length === 4 && parts.every(part => {
              const num = parseInt(part);
              return num >= 0 && num <= 255;
            });
        },

        filterInput() {
            this.portNumber = this.portNumber.replace(/\D/g, ''); // 使用正则表达式替换非数字字符为空字符串
        },

        updateContent() {
            // 根据选中的选项值更新下半部分的内容
            const selectedOption = this.options.find(option => option.value === this.selectedOption);
            if(selectedOption.label === "TCP客户端"){
                this.deviceName = "1，TCP客户端"
            }
            this.selectedOptionContent = selectedOption ? selectedOption.content : '';
          },

        manageCommunication(){
            this.communicationManagementVisible = true;
        },
        subManageCommunication(){
            this.subCommunicationManagementVisible = true;
        },

        setActiveIcon(icon){
            this.activeIcon = icon;
        },
        openDialogGV(){
            this.$store.commit('setDialogVisibleGlobalVar',true)
        },
        //动态布局
        layout(i) {
            switch (i) {
                case 1:
                    this.mainLayout = LayoutTwo
                    break;
                case 2:
                    this.mainLayout = LayoutThree
                    break;
                default:
                    this.mainLayout = LayoutOne
            }
        },
        //右半部分自适应调整高度
        dynamicRightHeight() {
            this.height_right = window.innerHeight - 82
        },
        eventTrigger(event, cont){
            this.$store.commit(event, cont)
        },
        //新建方案
        newSolution() {
            this.$store.commit('newSolutionEvent', true)
        },
        //删除方案
        deleteSolution() {
            this.$store.commit('deleteSolutionEvent', true)
        },
        deleteCurrentSolution(){
            this.$store.commit('deleteCurrentSolutionEvent', true)
        },
        //打开方案
        openSolution() {
            this.$store.commit('openSolutionEvent', true)
        },
        openSelectedSolution(key){
            let cont = {
                trigger:true,
                key:key,
            }
            this.$store.commit('openSelectedSolutionEvent', {trigger:true, key:key})
        },
        // //最近打开方案
        // lastOpenSolution() {
        //     let gainKey = null
        //     let lastTime = 0
        //     // console.log(localStorage.getItem("SLN"))
        //     // for(let key in localStorage){
        //     //     let cur = localStorage.getItem(key)
        //     //     console.log(cur)
        //     //     let curJson = JSON.parse(cur)
        //     //     console.log(curJson)
        //     //     if(curJson.type === "solution"){
        //     //         if(curJson.time > lastTime){
        //     //             gainKey = key
        //     //         }
        //     //     }
        //     // }
        //     for (let i = 1; i < localStorage.length; i++) {
        //         const key = localStorage.key(i);
        //         if(key === "debug") continue
        //         const value = localStorage.getItem(key);
        //         let curJson = JSON.parse(value)
        //         // console.log(curJson)
        //         if (curJson.type === "solution") {
        //             // console.log(curJson)
        //             // console.log("时间是：" + curJson.time)
        //             if (curJson.time > lastTime) {
        //                 gainKey = key
        //             }
        //         }
        //     }
        //     alert("最近打开方案为：" + gainKey)
        // },
        //打开示例方案
        updateExampleSolutions(){
             this.exampleSolutions = []
            for(let i = 0; i < localStorage.length; ++i){
                let key = localStorage.key(i)
                let value = localStorage.getItem(key);
                if (key === "debug") continue;
                let cont = JSON.parse(value);
                if (cont.type === "solution") {
                    // let pos = this.lastOpenSolutions.length - 1;
                    // for(let j = 0; j < this.lastOpenSolutions.length; ++j){
                    //     pos = j;
                    //     if(cont.time < this.lastOpenSolutions[j].time) continue;
                    //     break;
                    // }
                    // this.lastOpenSolutions.splice(pos, 0, {name:key, time:cont.time})
                    if(cont.solutionType === "Yes"){
                        this.exampleSolutions.push(key)
                    }
                }
            }
        },
        //刷新最近打开方案
        updateLastOpenSolutions(){
            this.lastOpenSolutions = []
            for(let i = 0; i < localStorage.length; ++i){
                let key = localStorage.key(i)
                let value = localStorage.getItem(key);
                if (key === "debug") continue;
                let cont = JSON.parse(value);
                if (cont.type === "solution") {
                    let pos = this.lastOpenSolutions.length - 1;
                    for(let j = 0; j < this.lastOpenSolutions.length; ++j){
                        pos = j;
                        if(cont.time < this.lastOpenSolutions[j].time) continue;
                        break;
                    }
                    this.lastOpenSolutions.splice(pos, 0, {name:key, time:cont.time})
                    this.lastOpenSolutions.splice(3)
                }
            }
            this.lastOpenSolutions = this.lastOpenSolutions.splice(0, 3);
        },
        //保存方案
        saveSolution() {
            this.$store.commit('saveSolutionEvent', true)
        },
        //另存为方案
        saveSolutionAs() {
            this.$store.commit('saveSolutionAsEvent', true)
        },
        //加载流程图
        importFlow() {
            this.$store.commit('flowAddEvent', true)
        },
        deleteFlow() {
            this.FlowKeys = []
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                let value = localStorage.getItem(key);
                if(key === 'debug') continue
                let cont = JSON.parse(value)
                if(cont.type === 'flow'){
                    let text = {
                        name:key,
                        check:0
                    }
                    this.FlowKeys.push(text)
                    console.log(text)
                }
            }
            this.dialogVisible = true;
            // localStorage.removeItem(name);
        },
        sendEvent(event, cont = {trigger:true}){
            this.$store.commit(event, cont)
        },
        exitFunc(){
            this.$router.push('/')
        },

        logout(){
            axiosInstance.get('/logout')
              .then(response => {
                this.$message({
                  message: '退出成功',
                  type: 'success',
                  duration: 1500,
                });
                sessionStorage.clear();
              })
              .catch(error => {
                console.error(error);
              });
            //sessionStorage.clear();
            
          
          },

          
        
    }
}