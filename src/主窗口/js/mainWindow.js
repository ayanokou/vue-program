import { eventHandle, events } from "@/sys/eventResponseController"
import ProcessDp from "@/流程图操作/FlowArea.vue";
import ImageArea from "@/图像操作/ImageArea.vue";
import ResultArea from "@/流程图操作/结果描述与帮助/ResultArea.vue";
import LayoutOne from "@/主窗口/components/layout/LayoutOne.vue";
import LayoutTwo from "@/主窗口/components/layout/LayoutTwo.vue";
import LayoutThree from "@/主窗口/components/layout/LayoutThree.vue";
import { computed } from "vue";
import { mapState } from "vuex";

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
            moduleResultData: computed(() => { return this.moduleResultData }),
            currentTableData: computed(() => this.currentTableData),
            historyTableData: computed(() => this.historyTableData),
            helpInfo: computed(() => this.helpInfo),
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
    },
    computed: {
        ...mapState([])
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
            this.$store.commit('newSolutionEvent', true)
        },
        //删除方案
        deleteSolution() {
            this.$store.commit('deleteSolutionEvent', true)
        },
        //打开方案
        openSolution() {
            this.$store.commit('openSolutionEvent', true)
        },
        //最近打开方案
        lastOpenSolution() {
            let gainKey = null
            let lastTime = 0
            // console.log(localStorage.getItem("SLN"))
            // for(let key in localStorage){
            //     let cur = localStorage.getItem(key)
            //     console.log(cur)
            //     let curJson = JSON.parse(cur)
            //     console.log(curJson)
            //     if(curJson.type === "solution"){
            //         if(curJson.time > lastTime){
            //             gainKey = key
            //         }
            //     }
            // }
            for (let i = 1; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if(key === "debug") continue
                const value = localStorage.getItem(key);
                let curJson = JSON.parse(value)
                // console.log(curJson)
                if (curJson.type === "solution") {
                    // console.log(curJson)
                    // console.log("时间是：" + curJson.time)
                    if (curJson.time > lastTime) {
                        gainKey = key
                    }
                }
            }
            alert("最近打开方案为：" + gainKey)
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
    }
}