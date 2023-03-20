import {eventHandle, events} from "@/sys/eventResponseController"
import ProcessDp from "@/流程图操作/FlowArea.vue";
import ImageArea from "@/图像操作/ImageArea.vue";
import ResultArea from "@/流程图操作/结果描述与帮助/ResultArea.vue";
import LayoutOne from "@/主窗口/components/layout/LayoutOne.vue";
import LayoutTwo from "@/主窗口/components/layout/LayoutTwo.vue";
import LayoutThree from "@/主窗口/components/layout/LayoutThree.vue";
import {computed} from "vue";

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
        //新建文件的点击事件
        document.getElementById('newSolution').addEventListener('click', function () {
            const msg_key='newSolution'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('openSolution').addEventListener('click', function () {
            const msg_key='openSolution'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('lastOpenSolution').addEventListener('click', function () {
            const msg_key='lastOpenSolution'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('openExample').addEventListener('click', function () {
            const msg_key='openExample'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('saveSolution').addEventListener('click', function () {
            const msg_key='saveSolution'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('importFlow').addEventListener('click', function () {
            const msg_key='importFlow'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('export').addEventListener('click', function () {
            const msg_key='export'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('exit').addEventListener('click', function () {
            const msg_key='exit'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('saveSolutionAs').addEventListener('click', function () {
            const msg_key='saveSolutionAs'
            eventHandle(events.msg_menuBar, {msg_key})
        })

        document.getElementById('setPermission').addEventListener('click', function () {
            const msg_key='setPermission'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('setSoftware').addEventListener('click', function () {
            const msg_key='setSoftware'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('setSolution').addEventListener('click', function () {
            const msg_key='setSolution'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('manageCommunication').addEventListener('click', function () {
            const msg_key='manageCommunication'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('manageCamera').addEventListener('click', function () {
            const msg_key='manageCamera'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('createCalibrationBoot').addEventListener('click', function () {
            const msg_key='createCalibrationBoot'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('calibrationBoardGenerationTool').addEventListener('click', function () {
            const msg_key='calibrationBoardGenerationTool'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('about').addEventListener('click', function () {
            const msg_key='about'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('logs').addEventListener('click', function () {
            const msg_key='logs'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('help').addEventListener('click', function () {
            const msg_key='help'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('project').addEventListener('click', function () {
            const msg_key='project'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('revocation').addEventListener('click', function () {
            const msg_key='revocation'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('redo').addEventListener('click', function () {
            const msg_key='redo'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('singleRun').addEventListener('click', function () {
            const msg_key='singleRun'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('localRun').addEventListener('click', function () {
            const msg_key='localRun'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('circleRun').addEventListener('click', function () {
            const msg_key='circleRun'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('stop').addEventListener('click', function () {
            const msg_key='stop'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('globalVariable').addEventListener('click', function () {
            const msg_key='globalVariable'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('globalTrigger').addEventListener('click', function () {
            const msg_key='globalTrigger'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('globalScript').addEventListener('click', function () {
            const msg_key='globalScript'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('runningInterface').addEventListener('click', function () {
            const msg_key='runningInterface'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('toBig').addEventListener('click', function () {
            const msg_key='toBig'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('toSmall').addEventListener('click', function () {
            const msg_key='toSmall'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('toReset').addEventListener('click', function () {
            const msg_key='toReset'
            eventHandle(events.msg_menuBar, {msg_key})
        })
        document.getElementById('onPreview').addEventListener('click', function () {
            const msg_key='onPreview'
            eventHandle(events.msg_menuBar, {msg_key})
        })


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
        }
    }
}
