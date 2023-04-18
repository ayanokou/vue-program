import {eventHandle, events} from "@/sys/eventResponseController"
import ProcessDp from "@/流程图操作/FlowArea.vue";
import ImageArea from "@/图像操作/ImageArea.vue";
import ResultArea from "@/流程图操作/结果描述与帮助/ResultArea.vue";
import LayoutOne from "@/主窗口/components/layout/LayoutOne.vue";
import LayoutTwo from "@/主窗口/components/layout/LayoutTwo.vue";
import LayoutThree from "@/主窗口/components/layout/LayoutThree.vue";
import {computed} from "vue";
import {mapState} from "vuex";

//初始化socketio用于前后端传输
let socket = io.connect('http://localhost:9092')

export default {
    data() {
        return {
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
            moduleResultData: computed(()=>{return this.moduleResultData}),
            currentTableData: computed(()=>this.currentTableData),
            historyTableData: computed(()=>this.historyTableData),
            helpInfo: computed(()=>this.helpInfo),
        }
    },

    mounted() {
        //动态调整右半部分尺寸
        window.addEventListener('resize', this.dynamicRightHeight)

        setInterval(() => { //不用管
            this.moduleResultData = [];
            let count = 0;

            function setChildren(num, data) {
                let times = Math.floor(Math.random() * num);
                for (; times > 0; --times) {
                    let node = {
                        id: count++,
                        paramName: Math.random(),
                        currentResult: Math.random(),
                        globalVariable: Math.random(),
                        children: [],
                    };
                    setChildren(Math.floor(num / 2), node.children);
                    data.push(node);
                }
            }

            setChildren(10, this.moduleResultData)
        }, 5000)

        socket.on('revBase64', (data) => {
            //先传递给FlowArea组件
            this.$store.commit('setImgBase64',data)
        })
        socket.on('revDoubles',(data)=>{
            //先传递给FlowArea组件
            this.$store.commit('setRevDoubles',data)
        })
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
        //新建方案
        newSolution() {
            this.$store.commit('newSolutionEvent',true)
        },
        //打开方案
        openSolution(){
            this.$store.commit('openSolutionEvent',true)
        },
        //保存方案
        saveSolution(){
            this.$store.commit('saveSolutionEvent',true)
        }
    }
}
