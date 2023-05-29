import { eventHandle, events } from "@/sys/eventResponseController"
import ProcessDp from "@/流程图操作/FlowArea.vue";
import ImageArea from "@/图像操作/ImageArea.vue";
import ResultArea from "@/流程图操作/结果描述与帮助/ResultArea.vue";
import LayoutOne from "@/主窗口/components/layout/LayoutOne.vue";
import LayoutTwo from "@/主窗口/components/layout/LayoutTwo.vue";
import LayoutThree from "@/主窗口/components/layout/LayoutThree.vue";
import { computed } from "vue";
import { mapState } from "vuex";
import axiosInstance from "../../axios"

//初始化socketio用于前后端传输
let socket = io.connect('http://localhost:9092')

export default {
    data() {
        return {
            //是否显示最近打开方案子菜单栏
           showLastOpenSolution: false, 
            //最近打开的方案名，存三个
            lastOpenSolutions: [],
            //存储示例方案
            exampleSolutions: [],
            //右半部分的高度
            height_right: window.innerHeight - 82,
            mainLayout: LayoutOne,
            compnts: [
                ProcessDp,
                ImageArea,
                ResultArea
            ],
            moduleResultData: [
                {
                    id: 1,
                    paramName: '参数名',
                    currentResult: '当前结果',
                    globalVariable: '全局变量',
                    children: [
                        {
                            id: 2,
                            paramName: '参数名',
                            currentResult: '当前结果',
                            globalVariable: '全局变量',
                        },
                        {
                            id: 3,
                            paramName: '参数名',
                            currentResult: '当前结果',
                            globalVariable: '全局变量',
                        },
                        {
                            id: 4,
                            paramName: '参数名',
                            currentResult: '当前结果',
                            globalVariable: '全局变量',
                            children: [
                                {
                                    id: 5,
                                    paramName: '参数名',
                                    currentResult: '当前结果',
                                    globalVariable: '全局变量',
                                },
                            ]
                        },
                    ],
                },
                {
                    id: 6,
                    paramName: '参数名',
                    currentResult: '当前结果',
                    globalVariable: '全局变量',
                },
            ],
            currentTableData: [],
            historyTableData: [],
            helpInfo: '',
        }
    },
    //在顶端组件提供模块结果数据
    provide() {
        return {
            moduleResultData: computed(() => { return this.moduleResultData }),
            currentTableData: computed(() => this.currentTableData),
            historyTableData: computed(() => this.historyTableData),
            helpInfo: computed(() => this.helpInfo),
        }
    },

    mounted() {
        //动态调整右半部分尺寸
        window.addEventListener('resize', this.dynamicRightHeight)
        socket.on('flowChartOK',(data)=>{
            this.$store.commit('setFlowChartOK',{
                trigger:true,
                index:parseInt(data)
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
        socket.on('revDoubles',(data)=>{
            //先传递给FlowArea组件
            this.$store.commit('setRevDoubles',data)
        })
        socket.on('revStr',(data)=>{
            console.log("this is string result:"+data);
        })
        socket.on('revTimeConsume',(data)=>{
            this.$store.commit('timeConsumeEvent', data);
        })
        // socket.on('revRects',(data)=>{
        //     this.$store.commit('setModuleResultData', data);
        // })
    },
    computed:{
        ...mapState(['socketEmit'])
    },
    watch:{
        socketEmit(newValue){
            if(newValue.trigger){
                //
                console.log('running...')
                socket.emit(newValue.mode, newValue.data);
                //
                this.$store.commit("setSocketEmit",{
                    trigger:false
                })
            }
        }

    },
    methods: {
        newInt(){
            socket.emit("chatevent", {
                userName: 'new',
                message: "new"
            });
        },
        getInt(){
            socket.emit("chatevent", {
                userName: 'get',
                message: "get"
            });
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