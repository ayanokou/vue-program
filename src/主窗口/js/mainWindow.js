
import ProcessDp from "@/流程图操作/FlowArea.vue";
import ImageArea from "@/图像操作/ImageArea.vue";
import ResultArea from "@/流程图操作/结果描述与帮助/ResultArea.vue";
import LayoutOne from "@/主窗口/components/layout/LayoutOne.vue";
import LayoutTwo from "@/主窗口/components/layout/LayoutTwo.vue";
import LayoutThree from "@/主窗口/components/layout/LayoutThree.vue";
import GlobalVar from "../components/GlobalVar.vue";
import GlobalScript from "../components/GlobalScript.vue"
import NetworkManager from "../components/NetworkManager.vue";
import GlobalTrigger  from "../components/GlobalTrigger.vue";

import SoftwareSet from "../components/SoftwareSet.vue";
import About from "../components/About.vue"
import HelpDoc from "../components/HelpDoc.vue"

import { computed } from "vue";
import { mapState } from "vuex";
import axiosInstance from "../../axios"
import router from "../../sys/router"

import { ref } from 'vue'





import cameras from "./cameras.js"

//初始化socketio用于前后端传输
let socket = io.connect('http://localhost:9092')



export default {
    components:{
        GlobalVar,
        NetworkManager,
        SoftwareSet,
        About,
        HelpDoc,
        GlobalScript,
        GlobalTrigger
    },
    data() {
        return {
          globalTrigger:"",
          autoReconnection: false,
          receiveEndMark: false,
          demoSelectedTCP: false,
          //软件设置窗口
          softwareSetVisible:false,
          networkManagerVisible: false,
          globalTriggerVisible:false,
          aboutVisible: false,
          helpDocVisible: false,
          activeIcon: "deviceManagement",
          softwareIcon:"icon1",
          test:{softwareIcon:"icon1"},
          group1Input: "", //通信管理-设备管理接收数据
          group2Output: "", //通信管理-设备管理发送数据
          //是否显示相机管理窗口
          cameraManagementVisible: false,
          //使用相机ID
          selectedCameraID: 0,
          //相机默认参数设置 在拍图片时会被传到后端给相机做设置
          selectedCameraParams : { //默认参数
            "exposureTime" : 2313.0000, //微秒
            "width" : 640,
            "height" : 480,
            //其他
          },
          pamraSettingVisible: false,
          //可用相机列表
          availableCameras : {},
          foreEndCameras : [],
          tempCamera : {},//存储临时相机变量 open操作
          tempCameraID : 0,//存储临时相机ID close操作
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
    created() {
        this.userRole = JSON.parse(sessionStorage.getItem('userInfo')).role;
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
    created() {
        this.getAccessCameras()
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
        socket.on('getScriptVarInt',(data)=>{
            this.$message({message:data})
            this.$store.commit('setScriptVarInt',data)
        })
        socket.on('getScriptVarFloat',(data)=>{
            this.$message({message:data})
            this.$store.commit('setScriptVarFloat',data)
        })
        socket.on('getScriptVarString',(data)=>{
            this.$message({message:data})
            this.$store.commit('setScriptVarString',data)
        })

        socket.on('revTimeConsume',(data)=>{
            this.$store.commit('timeConsumeEvent', data);
        })

        socket.on("runResults",data=>{
            this.$store.commit('setRunResults',JSON.parse(data))
        })

        socket.on('revAvaCameras', data =>{
            
            this.availableCameras = JSON.parse(data).AvailableCameras
            cameras.availableCameras = this.availableCameras
            // console.log(this.$store.state.availableCameras)

        })
        socket.on('revOpenCamera', data =>{
            let open_success = JSON.parse(data)["status"]
            let cameraID = JSON.parse(data)["cameraID"]
            if(open_success){
                this.foreEndCameras.push({
                    "deviceId" : cameraID,
                    "width" : this.tempCamera["width"], 
                    "height" : this.tempCamera["height"],
                    "exposureTime" : this.tempCamera["exposureTime"],
                    "deviceVendorName" : this.tempCamera["deviceVendorName"],
                    "exposureTime" : this.tempCamera["exposureTime"],
                })

                cameras.foreEndCameras = this.foreEndCameras

                this.$message({
                    message: '打开相机 ' + cameraID + ' 成功',
                    type: 'success',
                    duration: 1500,
                });
            }else{
                this.$message({
                    message: '打开相机 ' + cameraID + ' 失败',
                    type: 'error',
                    duration: 1500,
                });
            }

        })
        socket.on('revCloseCamera', data =>{
            let close_success = JSON.parse(data)["status"]
            let cameraID = JSON.parse(data)["cameraID"]
            if(close_success){
                for(let i = 0; i < this.foreEndCameras.length; ++i){
                    if(this.foreEndCameras[i]["deviceId"] == cameraID){
                        this.foreEndCameras.splice(i, 1);
                        break;
                    }
                }

                cameras.foreEndCameras = this.foreEndCameras

                this.$message({
                    message: '关闭相机 ' + cameraID + ' 成功',
                    type: 'success',
                    duration: 1500,
                });
            } else {
                this.$message({
                    message: '关闭相机 ' + cameraID + ' 失败',
                    type: 'error',
                    duration: 1500,
                });
            }

        }),
        socket.on('revSetParam', data =>{
            let setParams_success = JSON.parse(data)["status"]
            let cameraID = JSON.parse(data)["cameraID"]
            if(setParams_success){
                this.$message({
                    message: '设置参数 ' + cameraID + ' 成功',
                    type: 'success',
                    duration: 1500,
                });
            } else {
                this.$message({
                    message: '设置参数 ' + cameraID + ' 失败',
                    type: 'error',
                    duration: 1500,
                });
            }

        })
        // socket.on('revRects',(data)=>{
        //     this.$store.commit('setModuleResultData', data);
        // })
        
    },

    computed:{
        ...mapState(['socketEmit','dialogVisibleGlobalVar',"softwareSet","dialogVisibleGlobalScript"])
    },
    watch:{
        socketEmit(newValue){
            if(newValue.trigger){
                //
                console.log('running...' + newValue.mode)
                socket.emit(newValue.mode, newValue.data);
                //
                this.$store.commit("setSocketEmit",{
                    trigger:false
                })
            }
        }

    },
    created() {

    },
    methods: {

        openDialogGT(){

            this.globalTriggerVisible=true
        },
        returnto(){
            console.log(JSON.parse(sessionStorage.getItem('userInfo')).username)
            console.log(JSON.parse(sessionStorage.getItem('userInfo')).password)
           if(JSON.parse(sessionStorage.getItem('userInfo')).password!=null){
             console.log('执行if');
             axiosInstance.post('/login', {
                 username: JSON.parse(sessionStorage.getItem('userInfo')).username,
                 password: JSON.parse(sessionStorage.getItem('userInfo')).password,
                 code: '123',
                 rememberMe: true
             })
               .then(response => {
                console.log(JSON.stringify(response.data));
                 sessionStorage.setItem('userInfo', JSON.stringify(response.data));
                 console.log(JSON.parse(sessionStorage.getItem('userInfo')).username);
                 console.log(JSON.parse(sessionStorage.getItem('userInfo')).permissions);
                 console.log(sessionStorage.getItem('userInfo'));
        
                 //window.location.href = 'http://10.13.3.245:5173/#/Index';
                 router.push('/Index');
               })
               .catch(error => {
                 console.error(error);
               });}
            else{
                router.push('/Index');
            }
             
        },
        showFileOperationsDialog() {
            // Show the file operations dialog
            this.$dialog
              .confirm({
                title: '文件操作',
                message: '选择要执行的文件操作',
                confirmButtonText: '上传文件',
                cancelButtonText: '下载文件',
                closeOnClickModal: false,
              })
              .then(() => {
                // Upload file logic here
                this.uploadFile();
              })
              .catch(() => {
                // Download file logic here
                this.downloadFile();
              });
          },
          uploadFile() {
            // Logic for file upload goes here
            // You can show a file upload dialog or perform any other necessary actions
            // when the user chooses to upload a file.
            console.log('Uploading file...');
          },
      
          downloadFile() {
            // Logic for file download goes here
            // You can initiate a file download or perform any other necessary actions
            // when the user chooses to download a file.
            console.log('Downloading file...');
          },

        testCurrentData(){
            this.$store.commit('setRunResults',[
                {
                  "tab_index": 0,
                  "results": [
                    {
                      "id": "0",
                      "outResults": [
                        {
                          "name":"dst",
                          "type":"Mat",
                          "content":""
                        },
                        {
                          "name":"dst1",
                          "type":"int",
                          "content":0
                        },
                        {
                          "name":"point",
                          "type":"Point",
                          "content":{
                            "x":0,
                            "y":0
                          }
                        },
                        {
                            "name":"points1",
                            "type":"vector<Point>",
                            "content":[
                                {
                                    "type":"Point",
                                    "content":{
                                        "x":1,
                                        "y":2
                                    }
                                }
                            ]
                        },
                        {
                            "name":"vi",
                            "type":"vector<int>",
                            "content":[
                                {
                                    "type":"int",
                                    "content":1
                                },
                                {
                                    "type":"int",
                                    "content":2
                                }
                            ]
                        },
                        {
                            "name":"points2",
                            "type":"vector<Point>",
                            "content":[
                                {
                                    "type":"Point",
                                    "content":{
                                        "x":1,
                                        "y":2
                                    }
                                },
                                {
                                    "type":"Point",
                                    "content":{
                                        "x":1,
                                        "y":2
                                    }
                                }
                            ]
                        }
                      ],
                      "timeConsume": 5688
                    },
                    {
                        "id": "1",
                        "outResults": [
                            {
                                "name":"dst",
                                "type":"int",
                                "content":0
                            }
                        ],
                        "timeConsume": 20
                    },
                   {
                        "id": "1",
                        "outResults": [
                            {
                                "name":"dst",
                                "type":"int",
                                "content":0
                            }
                        ],
                        "timeConsume": 20
                    }
                  ],
                  "totalTimeConsume": 6275
                },
                {
                  "tab_index": 1,
                  "results": [
                    {
                      "id": "0",
                      "outResults": [
                        {
                          "type":"Mat",
                          "content":""
                        },
                        {
                          "type":"int",
                          "content":0
                        }
                      ],
                      "timeConsume": 5688
                    },
                    {}
                  ],
                  "totalTimeConsume": 6275
                }
              ])
        },
        openHelpDoc(){
            this.helpDocVisible = true
        },
        openAbout(){
            this.aboutVisible = true
        },
        openNetworkManager(){
            this.networkManagerVisible = true
        },
        runSolutionLoop(){
            socket.emit("RunSolutionLoop",{trigger:true})
        },
        // async stopSolutionLoop(){
        //     //socket.emit("StopSolutionLoop",{message:JSON.stringify({})})
        //     const handle =await window.showSaveFilePicker()
        //     const writer = await handle.createWritable()
        //     await writer.write('hello world')
        //     await writer.close()
        // },
        stopSolutionLoop(){
            socket.emit("StopSolutionLoop",{trigger:true})
        },
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
                data:JSON.stringify({ip:this.ip, port: this.portNumber, data:this.group2Output})
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
              data: JSON.stringify({ IP: this.ip, port: parseInt(this.portNumber) } )              
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
        manageCamera(){
            this.cameraManagementVisible = true;
        },

        setSoftware() {
            this.softwareSetVisible=true;
            //this.softwareIcon="icon2";
            this.test.softwareIcon="icon2"
         },
         setScheme(){
            this.softwareSetVisible=true;
            //this.softwareIcon="icon3";
            this.test.softwareIcon="icon3"

         },

        setActiveIcon(icon){
            this.activeIcon = icon;
        },
        openDialogGV(){
            this.$store.commit('setDialogVisibleGlobalVar',true)
        },
        openDialogGS(){
            this.$store.commit('setDialogVisibleGlobalScript',true)
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
          //列出可用相机
          getAccessCameras(){
            let msg = JSON.stringify({"camera_op_type" : 0})
            let payload={
                trigger:true,
                mode:"CameraOperation",
                data:msg
            }
            this.$store.commit("setSocketEmit",payload)
          },
          //获取一张图片
          takeOneImg(){
            let msg = JSON.stringify({
                camera_op_type : 1, 
                cameraID : Number(this.selectedCameraID),
            })            
            let payload={
                trigger:true,
                mode:"CameraOperation",
                data:msg
            }
            this.$store.commit("setSocketEmit",payload)
          },
        
          //添加和打开使用相机 
          addCamera(camera){
            this.selectedCameraID = camera["deviceId"];
            console.log('setCameraID: ', this.selectedCameraID);

            for(let i = 0; i < this.foreEndCameras.length; ++i){
                if(camera["deviceId"] == "" || this.foreEndCameras[i]["deviceId"] == camera["deviceId"]){
                    this.$message({
                        message: '添加相机失败，相机重复或为空',
                        type: 'error',
                        duration: 1500,
                    });
                    return;
                }
            }

            this.tempCamera = camera
            
            //发消息给后端 打开相机
            let msg = JSON.stringify({
                camera_op_type : 2, 
                cameraID : Number(this.selectedCameraID)
            })
            let payload={
                trigger:true,
                mode:"CameraOperation",
                data:msg
            }
            this.$store.commit("setSocketEmit",payload)
          },
            //删除和关闭使用相机
          deleteCamera(cameraID){
            this.tempCameraID = cameraID

            let msg = JSON.stringify({
                camera_op_type : 3, 
                cameraID : Number(this.tempCameraID)
            })
            let payload={
                trigger:true,
                mode:"CameraOperation",
                data:msg
            }
            this.$store.commit("setSocketEmit",payload)

          },
          setParams(){
            let msg = JSON.stringify({
                camera_op_type : 4, 
                cameraID : Number(this.selectedCameraID),
                width : Number(this.selectedCameraParams["width"]),
                height : Number(this.selectedCameraParams["height"]),
                exposureTime : Number(this.selectedCameraParams["exposureTime"])
            })
            let payload={
                trigger:true,
                mode:"CameraOperation",
                data:msg
            }
            this.$store.commit("setSocketEmit",payload)
          }
    }
}