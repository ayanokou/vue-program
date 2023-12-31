import { Menu, BpmnElement, SelectionSelect, Control, Snapshot, Group, GroupNode } from '@logicflow/extension' //引入组件扩展模块
import { lfJson2Xml } from '@logicflow/extension'

//test 框选
import data from './newOperatorLib.json'
import { mapState } from "vuex";
import '@logicflow/extension/lib/style/index.css'
//test end
import {
    LogicFlow,
    PolygonNode,
    PolygonNodeModel,
    RectNode,
    RectNodeModel,
    DiamondNode,
    DiamondNodeModel,
    CircleNode,
    CircleNodeModel,
    h
} from '@logicflow/core'   //对基础类型的节点的引入

import { LeftMenus } from './LeftMenuItems.js'
import { MiniMap } from './MiniMap.js'
import { eventHandle, events } from "../../sys/eventResponseController";
import { ElNotification, ElStep } from 'element-plus'
import Branch from "../components/dialog/Branch.vue";
import Condition from "../components/dialog/Condition.vue";
import cameras from "../../主窗口/js/cameras.js";


LogicFlow.use(SelectionSelect); //框选
LogicFlow.use(Menu);  //右键菜单
//自定义节点的设置
class MyCircleModel extends CircleNodeModel { //继承基础的圆形节点 并对该节点的样式进行定义
    getNodeStyle() {
        const style = super.getNodeStyle();
        style.stroke = 'blue';
        return style;
    }

    setAttributes() {
        const size = this.properties.scale || 1;
        this.r = 25 * size
    }
}

class SuanziModel extends RectNodeModel {  //继承基础的矩形节点 并对该节点的样式进行定义
    setAttributes() {
        const size = this.properties.scale || 1;
        
        this.width = 100 * size
        this.height = 80 * size
        this.limit_edge = 1;
        this.current_edge = 0;
        this.node_stage = "init"
        this.style.strokeWidth = 3
    }
    
    getNodeStyle(){
        const style = super.getNodeStyle();
        style.stroke = color[this.properties.state];
        return style;
    }

    createId() {

        const idSet = new Set()
        // find the smallest unused id
        this.graphModel.nodes.forEach(node => {
            idSet.add(node.id)
        })
        let id = 0
        while (idSet.has(id.toString())) {
            id++
        }
        return id.toString()
    }

    // isAllowConnectedAsSource(target) {
    //     if(this.current_edge < this.limit_edge)
    //         return true;
    //     else
    //         return false;
    // }
}

//定义Group节点，重写了节点的一些属性和方法
//由张瀚文添加
//参考https://blog.csdn.net/towersxu/article/details/124292204
class MyGroupModel extends GroupNode.model {
    initNodeData(data) {
        super.initNodeData(data);
        this.foldable = true;
        this.resizeable = true;
        this.width = data.width || 300;
        this.height = data.height || 200;
        const noTarget = {
            message: "no link",
            validate: () => {
                return false;
            }
        };
        this.targetRules.push(noTarget);
    }

    updateText(value) {
        const textValue = value.replace(/\n/gm, "");
        super.updateText(textValue.slice(0, 10));
    }

    getNodeStyle() {
        const style = super.getNodeStyle();
        style.stroke = "#AEAFAE";
        style.strokeDasharray = '3 3';
        style.strokeWidth = 1;
        style.fill = "rgba(239,245,255,0.45)";
        return style;
    }

    foldGroup(isFolded) {
        super.foldGroup(isFolded);
        if (isFolded) {
            this.text = { ...this.foldText };
            if (!this.text.value) {
                this.text.value = "已折叠";
            }
            this.text.x = this.x + 10;
            this.text.y = this.y;
        } else {
            this.foldText = { ...this.text };
            this.text = {};
        }

    }

    deleteGroup() {
        this.graphModel.deleteNode(this.id);
    }

    getAnchorStyle() {
        const style = super.getAnchorStyle();
        style.stroke = "transparent";
        style.fill = "none";
        style.hover.stroke = "transparent";
        return style;
    }

    createId() {
        const idSet = new Set()
        // find the smallest unused id
        this.graphModel.nodes.forEach(node => {
            idSet.add(node.id)
        })
        let id = 0
        while (idSet.has(id.toString())) {
            id++
        }
        return id.toString()
    }
}

//自定义Group节点的外观
class MyGroup extends GroupNode.view {
    getFoldIcon() {
        const { model } = this.props;
        const foldX = model.x - model.width / 2 + 5;
        const foldY = model.y - model.height / 2 + 5;
        if (!model.foldable) return null;
        // 展开的icon
        const unFoldIcon = h(
            "svg",
            {
                transform: "translate(329.000000, 311.000000)",
                x: foldX,
                y: foldY,
                width: 20,
                height: 20,
                fill: "#3C96FE"
            },
            [
                h("path", {
                    "pointer-events": "none",
                    d:
                        "M10.5097656,8.61914062 L16.8066406,2.32226563 C16.8554688,2.2734375 16.8203125,2.18945313 16.7519531,2.18945313 L13.6035156,2.18945313 C13.2636719,2.18945313 12.9746094,1.921875 12.9648438,1.58203125 C12.9550781,1.22851563 13.2382813,0.939453125 13.5898438,0.939453125 L18.4492188,0.939453125 C18.7949219,0.939453125 19.0742188,1.21875 19.0742188,1.56445313 L19.0742188,6.41015625 C19.0742188,6.75 18.8066406,7.0390625 18.4667969,7.04882813 C18.1132813,7.05859375 17.8242188,6.77539063 17.8242188,6.42382813 L17.8242188,3.25976563 C17.8242188,3.18945313 17.7402344,3.15625 17.6914063,3.20507813 L11.3925781,9.50195312 C11.1484375,9.74609375 10.7519531,9.74609375 10.5078125,9.50195312 C10.265625,9.2578125 10.265625,8.86328125 10.5097656,8.61914062 Z M0.921875,18.4375 L0.921875,13.5917969 C0.921875,13.2519531 1.18945312,12.9628906 1.52929688,12.953125 C1.8828125,12.9433594 2.171875,13.2265625 2.171875,13.578125 L2.171875,16.7402344 C2.171875,16.8105469 2.25585938,16.84375 2.3046875,16.7949219 L8.6015625,10.4980469 C8.72460938,10.375 8.8828125,10.3144531 9.04296875,10.3144531 C9.203125,10.3144531 9.36328125,10.375 9.484375,10.4980469 C9.72851562,10.7421875 9.72851562,11.1386719 9.484375,11.3828125 L3.18945312,17.6796875 C3.140625,17.7285156 3.17578125,17.8125 3.24414063,17.8125 L6.39257812,17.8125 C6.73242187,17.8125 7.02148438,18.0800781 7.03125,18.4199219 C7.04101562,18.7734375 6.7578125,19.0625 6.40625,19.0625 L1.546875,19.0625 C1.20117188,19.0625 0.921875,18.7832031 0.921875,18.4375 Z M1.25,6.875 L0,6.875 L0,0 L6.875,0 L6.875,1.25 L1.25,1.25 L1.25,6.875 Z M20,20 L13.125,20 L13.125,18.75 L18.75,18.75 L18.75,13.125 L20,13.125 L20,20 Z"
                })
            ]
        );

        // 收起的icon
        const foldIcon = h(
            "svg",
            {
                transform: "translate(330.000000, 495.000000)",
                x: foldX,
                y: foldY,
                width: 20,
                height: 20,
                fill: "#3C96FE"
            },
            [
                h("path", {
                    "pointer-events": "none",
                    d:
                        "M18.890625,2.00390625 L12.59375,8.30273438 C12.5449219,8.3515625 12.5800781,8.43554688 12.6484375,8.43554688 L15.796875,8.43554688 C16.1367187,8.43554688 16.4257812,8.703125 16.4355469,9.04296875 C16.4453125,9.39648438 16.1621094,9.68554688 15.8105469,9.68554688 L10.9511719,9.68554688 C10.6054687,9.68554688 10.3261719,9.40625 10.3261719,9.06054688 L10.3261719,4.21484375 C10.3261719,3.875 10.59375,3.5859375 10.9335938,3.57617188 C11.2871094,3.56640625 11.5761719,3.84960938 11.5761719,4.20117188 L11.5761719,7.36328125 C11.5761719,7.43359375 11.6601562,7.46679688 11.7089844,7.41796875 L18.0078125,1.12109375 C18.2519531,0.876953125 18.6484375,0.876953125 18.8925781,1.12109375 C19.1347656,1.36523438 19.1347656,1.75976562 18.890625,2.00390625 L18.890625,2.00390625 Z M9.66992188,10.9394531 L9.66992188,15.7851562 C9.66992188,16.125 9.40234375,16.4140625 9.0625,16.4238281 C8.70898438,16.4335938 8.41992188,16.1503906 8.41992188,15.7988281 L8.41992188,12.6367188 C8.41992188,12.5664062 8.3359375,12.5332031 8.28710938,12.5820312 L1.98828125,18.8789062 C1.86523438,19.0019531 1.70703125,19.0625 1.546875,19.0625 C1.38671875,19.0625 1.2265625,19.0019531 1.10546875,18.8789062 C0.861328125,18.6347656 0.861328125,18.2382812 1.10546875,17.9941406 L7.40234375,11.6972656 C7.45117188,11.6484375 7.41601563,11.5644531 7.34765625,11.5644531 L4.19921875,11.5644531 C3.859375,11.5644531 3.5703125,11.296875 3.56054688,10.9570312 C3.55078125,10.6035156 3.83398438,10.3144531 4.18554688,10.3144531 L9.04492188,10.3144531 C9.390625,10.3144531 9.66992188,10.59375 9.66992188,10.9394531 Z M1.25,6.875 L0,6.875 L0,0 L6.875,0 L6.875,1.25 L1.25,1.25 L1.25,6.875 Z M20,20 L13.125,20 L13.125,18.75 L18.75,18.75 L18.75,13.125 L20,13.125 L20,20 Z"
                })
            ]
        );
        return h("g", {}, [
            h("rect", {
                height: 20,
                width: 20,
                rx: 2,
                ry: 2,
                strokeWidth: 1,
                fill: "transparent",
                stroke: "transparent",
                cursor: "pointer",
                x: model.x - model.width / 2 + 5,
                y: model.y - model.height / 2 + 5,
                onClick: () => {
                    model.foldGroup(!model.properties.isFolded);
                    // console.log(model);
                    // model.foldGroup(true);
                }
            }),
            model.properties.isFolded ? unFoldIcon : foldIcon
        ]);
    }

    getDeleteIcon() {
        const { model } = this.props;

        return h("g", {}, [
            h("rect", {
                height: 20,
                width: 20,
                rx: 2,
                ry: 2,
                strokeWidth: 1,
                fill: "transparent",
                stroke: "transparent",
                cursor: "pointer",
                x: model.x + model.width / 2 + 14,
                y: model.y - model.height / 2 + 5,
                onClick: () => {
                    model.deleteGroup();
                }
            }),
            h(
                "svg",
                {
                    transform: "translate(1.000000, 1.000000)",
                    fill: "#3C96FE",
                    x: model.x + model.width / 2 + 14,
                    y: model.y - model.height / 2 + 5,
                    width: 20,
                    height: 20
                },
                [
                    h("path", {
                        "pointer-events": "none",
                        d:
                            "M15.3,1.4 L12.6,1.4 L12.6,0 L5.4,0 L5.4,1.4 L0,1.4 L0,2.8 L2,2.8 L2,17.3 C2,17.6865993 2.31340068,18 2.7,18 L15.3,18 C15.6865993,18 16,17.6865993 16,17.3 L16,2.8 L18,2.8 L18,1.4 L15.3,1.4 Z M14.6,16.6 L3.4,16.6 L3.4,2.8 L14.6,2.8 L14.6,16.6 Z"
                    }),
                    h("path", {
                        "pointer-events": "none",
                        d:
                            "M6,5.4 L7.4,5.4 L7.4,14.4 L6,14.4 L6,5.4 Z M10.6,5.4 L12,5.4 L12,14.4 L10.6,14.4 L10.6,5.4 Z"
                    })
                ]
            )
        ]);
    }

    getResizeShape() {
        return h("g", {}, [super.getResizeShape(), this.getDeleteIcon()]);
    }
}
const suanziItemList = data
//节点状态颜色字典
const color = {"init" : "orange", "ready" : "gray", "success" : "green", "error" : "red"}

export default {
    name: 'FlowDemo',
    props: ['tab'],
    expose: ['lfData'],
    emits:['changeTabName','setFlowStateToFlowArea'],
    components: {
        Branch,Condition
    },
    data() {
        return {
            state:'等待添加组件',
            previousSliderValue:50,
            sliderValue: 50,
            //logic-flow
            lf: null,
            initHeight: '',
            //点击事件的节点对象
            nodeModel: null,
            //当前选中的算子id
            selectedAlgorithm:0,
            //点击事件的边对象
            edgeModel: '',
            //框选选中的数据
            selectedMSG: null,
            //赋值变量 算子和图形
            suanzis: suanziItemList,
            dialogVisible: false,
            formData: [],

            timeConsume:{
                flowRunTime: -1, //流程用时
                algorithmRunTime: -1, //算法用时
            },

            currentFlowState:"",

            //拖拽节点的初始
            modelName:"",//模型名称
            operatorData:{},//拖拽节点的原始properties数据
            dialogBranch:false,
            branchData:[],
            dialogCondition:false,
            conditionData:[],
            conditionIntExpr:undefined,
            conditionDoubleExpr:undefined,

            availableCameras : {},
            dllPaths : {
                "Hikrobot" : "resources\\HKCamera.dll",
                // "Hikrobot" : "D:\\Documents\\opencv_splitFunction_test\\camera_demo\\x64\\Release\\HKCamera.dll",
                "Basler" : "xxx",},
          }
    },
    computed: {
        //某个模型的数据
        modelData(){
            let models=this.nodeModel.getProperties().models
            return models.find(item=>{
                item.modelName=this.modelName
            })
        },

        lfData() {
            return this.lf.getGraphData()
        },
        ...mapState([
            "timeConsume",
            "runResults"
        ]),

    },
    watch:{

        //在对话框中监听修改模型,同时切换nodeModel也会触发
        modelName(newValue){
            if(this.operatorData.models){
                //更新formData、outPara
                let outPara
                //如果这个结点有inPara,就是提交过的，那么就从里面读
                if(this.nodeModel.getProperties().inPara)
                    this.formData=this.nodeModel.getProperties().inPara.map(param=>param.fromExpression)

                else
                    this.formData=(this.operatorData.models.find(item=>item.modelName==newValue)).inPara.map(param=>param.fromExpression)
                //this.operatorData.models.find(item=>item.modelName==newValue)
            }
        },
        nodeModel(newValue){
            let state=newValue.getProperties().state
            switch(state){
                case "init":
                    this.currentFlowState=`模块${newValue.id}未配置参数}`
                    break;
                case "ready":
                    this.currentFlowState=`模块${newValue.id}已配置完成`
                    break;
                default:
                    break;
            }
        },
        
        runResults(newValue){
            let tab_result=newValue.find(item=>item.tab_index===this.tab.index)
            if(tab_result){
                //set flow time consume
                //set state of each ndoe
                this.timeConsume.flowRunTime=tab_result.totalTimeConsume                         
                tab_result.results.forEach(item=>{
                    let id=item.id
                    this.changeNodeStage(id,"success")
                })
                //set ack to logicFlow.vue
                this.$emit('setFlowStateToFlowArea',{tabIndex:this.tab.index,payload:"runOver"})
            }

        }
    },

    mounted() {
        // this.initHeight = 800
        // this.initHeight = window.innerHeight-150
        this.init()
        //鼠标移到节点显示帮助信息
        this.lf.on('node:mouseenter', (evt) => {
            let res = ""
            if (evt.data.properties.outPara) {
                for (let x of evt.data.properties.outPara) {
                    //res.push(evt.data.properties.modelID +`.${evt.data.id}`+ `.${x.varName}`)
                    let str="<div>变量:&nbsp;"+evt.data.properties.modelID +`.${evt.data.id}`+ `.${x.varName}`+"&nbsp;&nbsp;&nbsp;;类型:&nbsp;"+`${x.varType}`+"</div>"
                    res+=str
                }
                    ElNotification({
                        title: '输出变量:',
                        dangerouslyUseHTMLString: true,
                        message: res,
                        duration: 2000,
                    })

            }
        })
        //单击选中节点
        this.lf.on('node:click',(evt)=>{
            console.log('node:click')
            //更新耗时显示
            this.updateTimeconsume(evt.data.id)
            //更新选中节点全局数据
            this.$store.commit('setCurrentNode',{tabIndex:this.tab.index,nodeId:evt.data.id})
            //触发显示当前结果命令
            this.$store.commit('showCurrentResultEvent',true)
            //触发显示图片命令
            this.$store.commit('showImgEvent',true)
            //刷新nodeModel
            this.nodeModel = this.lf.getNodeModelById(evt.data.id)
            this.selectedAlgorithm = evt.data.id
            this.$store.commit('setNodeModelName',this.nodeModel.getProperties().name)
            // this.changeNodeStage(evt.data.id, "running") //改变节点状态 再节点类中getnodestyle方法中会根据状态改变节点颜色
        })
        //双击节点，弹出对话框
        this.lf.on('node:dbclick', (evt) => {
            if(evt.data.properties.modelName!="group")
                this.setInParams(evt.data) 
        })



        this.lf.on('node:dnd-add',(evt)=>{
            this.nodeModel=this.lf.getNodeModelById(evt.data.id)
            let array=suanziItemList[evt.data.properties.superName]
            this.operatorData=array.find(item=>item.name==evt.data.properties.name)
            //更改text加序号
            this.nodeModel.updateText(evt.data.id+evt.data.text.value)
            //初始化模型和outPara
            this.modelName=evt.data.properties.models[0].modelName
            this.nodeModel.setProperties({outPara:evt.data.properties.models[0].outPara})
        })

        this.lf.on('node:delete',(evt)=>{
            console.log('node:delete')
            //找父节点
            let fatherNodes=this.lf.getNodeIncomingNode(evt.data.id)
            console.log(fatherNodes.length)
            for(let node of fatherNodes){
                console.log(node)
            }
        })


        this.lf.on('edge:click', (evt) => {

            let edgeId = (evt.data.id)
            this.edgeModel = this.lf.getEdgeModelById(edgeId)

            let edge_sourceNodeId=evt.data.sourceNodeId
            let sourceNode=this.lf.getNodeModelById(edge_sourceNodeId)
            let sourceNodeName=sourceNode.getProperties().modelID
        })
        //限制节点出边的数量 限制数目定义在每个节点的类里面 使用变量current_edge和limit_dege
        this.lf.on('edge:add', (evt) => {


        })
        this.lf.on('edge:delete', (evt) => {

        })


    },
    methods: {
        handleSliderChange(){
            console.log("调用了");
            const difference = this.sliderValue - this.previousSliderValue; // 计算滑块值的变化差值

            if (difference > 0) {
            // 滑块向右滑动，调用放大函数
            for (let i = 0; i < difference; i++) {
                console.log("放大");
                this.lf.zoom(true); // 调用放大函数
            }
            } else if (difference < 0) {
            // 滑块向左滑动，调用缩小函数
            for (let i = 0; i < Math.abs(difference); i++) {
                console.log("缩小");
                this.lf.zoom(false); // 调用缩小函数
            }
            }

            this.previousSliderValue = this.sliderValue; // 更新前一个滑块值
            
        },
        init() {
            const lf = new LogicFlow({
                container: document.querySelector("#"+this.tab.title),
                // height: this.initHeight,
                plugins: [Menu, BpmnElement, LeftMenus, SelectionSelect, Control, MiniMap, Snapshot, Group],
                background: {
                    color: '#2b364a' // 网格背景颜色
                },
                keyboard: {
                    enabled: true // 支持快捷键操作
                },
                grid: { // 开启网格
                    type: 'mesh', // 网格类型为线状
                    size: 20,
                    visible: true // 是否可见
                },
                stopMoveGraph: true,
                nodeTextEdit : false, // 使得节点文本不可选
            })

            const setInParams=this.setInParams

            lf.extension.menu.setMenuConfig({
                nodeMenu: [
                    {
                        text: '删除',
                        callback(node) {
                            lf.deleteNode(node.id);
                        },
                    },
                    {
                        text: '配置参数',
                        callback: function (node) {
                            setInParams(node)
                        },
                    },

                ], // 覆盖默认的节点右键菜单
                //edgeMenu: false, // 删除默认的边右键菜单
                graphMenu: [],


                // 覆盖默认的边右键菜单，与false表现一样
            });

            //设置选区菜单
            //由张瀚文添加
            lf.extension.menu.setMenuByType({
                type: 'lf:defaultSelectionMenu',
                menu: [{
                    text: '删除',
                    callback() {
                        alert("111");
                    }
                },
                    {
                        text: '组合',
                        callback() {
                            //将选区数据存储
                            const {nodes} = lf.getSelectElements();
                            const {startPoint, endPoint} = lf.extension.selectionSelect;
                            //清除选区数据
                            lf.clearSelectElements();
                            //如果节点中有不能组合的节点类型则返回
                            // if(nodes.some((node) => node.type === "someNode")){
                            //     return;
                            // }
                            //startPoint endPoint是dom坐标，需要转换成canvas坐标
                            const {transformModel} = lf.graphModel;
                            const [x1, y1] = transformModel.HtmlPointToCanvasPoint([
                                startPoint.x, startPoint.y
                            ]);
                            const [x2, y2] = transformModel.HtmlPointToCanvasPoint([
                                endPoint.x, endPoint.y
                            ]);
                            const width = x2 - x1;
                            const height = y2 - y1;
                            if (width < 175 && height < 40) {
                                return;
                            }
                            //创建一个GroupNode
                            lf.addNode({
                                type: "mygroup",
                                x: x1 + width / 2,
                                y: y1 + height / 2,
                                width,
                                height,
                                properties: {
                                    "helpMsg": "it is a help message",
                                    "dllPath": "",
                                    "modelID": "group",
                                    "inPara": [
                                        {
                                            "varName": "count",
                                            "varType": "int",
                                            "fromExpression": "",
                                            "typeUI": "input",
                                            "explanation": ""
                                        }
                                    ],
                                    "outPara": [
                                    ]
                                },
                                children: nodes.map((item) => item.id)
                            });

                        }
                    },
                ]
            })

            lf.batchRegister([
                {
                    type: 'operator',
                    view: RectNode,
                    model: SuanziModel
                },
                {
                    type: 'mygroup',
                    view: MyGroup,
                    model: MyGroupModel
                }

            ])

            var suanziItemListConcat = []


            Object.entries(suanziItemList).forEach(([key_1, value_1])=>{
                value_1.forEach((value_2)=>{
                    var temp = {
                        label: value_2.name,
                        text:value_2.name,
                        type:"operator",
                        name:value_2.name,
                        properties:value_2,
                        icon : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAEFVwZaAAAABGdBTUEAALGPC/xhBQAAAqlJREFUOBF9VM9rE0EUfrMJNUKLihGbpLGtaCOIR8VjQMGDePCgCCIiCNqzCAp2MyYUCXhUtF5E0D+g1t48qAd7CCLqQUQKEWkStcEfVGlLdp/fm3aW2QQdyLzf33zz5m2IsAZ9XhDpyaaIZkTS4ASzK41TFao88GuJ3hsr2pAbipHxuSYyKRugagICGANkfFnNh3HeE2N0b3nN2cgnpcictw5veJIzxmDamSlxxQZicq/mflxhbaH8BLRbuRwNtZp0JAhoplVRUdzmCe/vO27wFuuA3S5qXruGdboy5/PRGFsbFGKo/haRtQHIrM83bVeTrOgNhZReWaYGnE4aUQgTJNvijJFF4jQ8BxJE5xfKatZWmZcTQ+BVgh7s8SgPlCkcec4mGTmieTP4xd7PcpIEg1TX6gdeLW8rTVMVLVvb7ctXoH0Cydl2QOPJBG21STE5OsnbweVYzAnD3A7PVILuY0yiiyDwSm2g441r6rMSgp6iK42yqroI2QoXeJVeA+YeZSa47gZdXaZWQKTrG93rukk/l2Al6Kzh5AZEl7dDQy+JjgFahQjRopSxPbrbvK7GRe9ePWBo1wcU7sYrFZtavXALwGw/7Dnc50urrHJuTPSoO2IMV3gUQGNg87IbSOIY9BpiT9HV7FCZ94nPXb3MSnwHn/FFFE1vG6DTby+r31KAkUktB3Qf6ikUPWxW1BkXSPQeMHHiW0+HAd2GelJsZz1OJegCxqzl+CLVHa/IibuHeJ1HAKzhuDR+ymNaRFM+4jU6UWKXorRmbyqkq/D76FffevwdCp+jN3UAN/C9JRVTDuOxC/oh+EdMnqIOrlYteKSfadVRGLJFJPSB/ti/6K8f0CNymg/iH2gO/f0DwE0yjAFO6l8JaR5j0VPwPwfaYHqOqrCI319WzwhwzNW/aQAAAABJRU5ErkJggg=="
                    }
                    if (value_2.name=="group")
                        temp.type="mygroup"
                    suanziItemListConcat = suanziItemListConcat.concat(temp)
                })
            })

            lf.extension.leftMenus.setPatternItems(suanziItemListConcat,this.tab.index)

            lf.extension.control.addItem({
                text: "保存流程",
                onClick: () => {
                    let Name = this.tab.tabName
                    let currentTime = Date.now()
                    let text = {
                        name: Name,
                        type: "flow",
                        time: currentTime,
                        content: this.lf.getGraphData(),
                    }
                    localStorage.setItem(text.name, JSON.stringify(text))
                }
            })
            lf.extension.control.addItem({
                text: "导入流程",
                onClick: () => {
                    this.loadFlowChart();
                },
            });
            lf.extension.control.addItem({
                text: "下载Json",
                onClick: () => {
                    this.downloadXML()
                }
            });
            lf.extension.control.addItem({
                text: "重命名流程",
                onClick: () => {
                    this.renameLogic()
                }
            });
            lf.extension.control.addItem({
                text: "测试",
                onClick: () => {
                }
            })
            lf.render(this.tab.initLF)
            const position = lf.getPointByClient(document.documentElement.clientWidth / 2 - 150, document.documentElement.clientHeight - 230)
            lf.extension.miniMap.show(position.domOverlayPosition.x, position.domOverlayPosition.y)
            this.lf = lf

        },
        getIncomingData(id,type){
            let ans=[]
            let queue=[id]
            while(queue.length>0){
                let targetid=queue.shift()
                this.lf.getNodeIncomingNode(targetid).forEach(item=>{
                    queue.push(item.id)

                    if(item.getProperties().outPara){
                        item.getProperties().outPara.forEach(outp=>{
                            if(true||outp.varType==type){
                                ans.push({
                                    lable:item.text.value+"."+outp.varExplanation+"."+outp.varName,
                                    value:item.id.toString()+"."+outp.varName
                                })
                            }
                        })
                    }
                })
            }
            return ans
        },


        findInPara(id) {
            //done fix:如果这个节点在group里面就要多添加一些带[loopIndex]的可选入参
            //done fix：如果这个节点正好是group，需要为终止坐标参数构建那些vector<*>的长度，作为可选参数
            let set=new Set()
            let comboList={}
            let queue=[id]
            if(this.modelName=="group"){
                queue.push(...this.nodeModel.getData().children)
            }
            while(queue.length>0){
                let targetid=queue.shift()

                for(let edge of this.lf.getGraphData().edges){
                    if(edge.targetNodeId==targetid){
                        queue.push(edge.sourceNodeId)
                        set.add(edge.sourceNodeId)
                    }
                }
            }

            let children=[]
            for(let node of this.lf.getGraphData().nodes){
                if(node.children){
                    children.push(...node.children)
                }
            }
            console.log(children)


            set.forEach(item=>{
                let each_outPara=[]
                if(this.lf.getNodeModelById(item).getProperties().outPara)
                    each_outPara=this.lf.getNodeModelById(item).getProperties().outPara
                let text=this.lf.getNodeModelById(item).getData().text.value
                for(let para of each_outPara){
                    comboList[text+"."+para.varExplanation+"."+para.varName]=item.toString()+"."+para.varName+"#"+para.varType
                }
            })

            set.clear()

            //let model=this.operatorData.models.find(item=>item.modelName==this.modelName)
            for(let model of this.operatorData.models){
                for(let p of model.inPara){
                    if(p.defineVarInputWay=="smartInputWay"){
                        //修改bug，清除之前连接的记录
                        p.comboList={}
                        if(p.varType=="object"){
                            for(let i in comboList)
                                p.comboList[i]=comboList[i].split('#')[0]

                        }else{
                            if(this.modelName=="group"){
                                const format_regex=/^vector<.*>$/
                                for(let i in comboList){
                                    let type=comboList[i].split('#')[1]
                                    if(format_regex.test(type))
                                        p.comboList["size of ("+i+")-1"]=comboList[i].split('#')[0]
                                }
                            }else{
                                for(let i in comboList){
                                    let type=comboList[i].split('#')[1]
                                    if(type==p.varType)
                                        p.comboList[i]=comboList[i].split('#')[0]
                                    else if(children.includes(id)&&type=="vector<"+p.varType+">"){
                                        p.comboList[i+"[loopIndex]"]=comboList[i].split('#')[0]+"[loopIndex]"
                                    }
                                }
                            }
                            
                        }
                    }
                }
            }
        },
        loadFlowChart() {
            let inputObj = document.createElement('input');
            inputObj.type = 'file';
            inputObj.accept = 'json';
            let solutionJson = null;
            inputObj.onchange = () => {
                let file = inputObj.files[0];
                let reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => {
                    solutionJson = JSON.parse(reader.result);

                    this.lf.render(solutionJson)
                    //test tabName
                    this.$emit('changeTabName', {
                        index: this.tab.index,
                        tabName: file.name.substring(0, file.name.lastIndexOf('.'))
                    })
                };
            };
            inputObj.click();


        },
        download(filename, text) {
            var element = document.createElement("a")
            element.setAttribute(
                "href",
                "data:text/plain;charset=utf-8," + encodeURIComponent(text)
            )
            element.setAttribute("download", filename)

            element.style.display = "none"
            document.body.appendChild(element)

            element.click()

            document.body.removeChild(element)
        },
        downloadImage() {
            this.lf.getSnapshot()
        },
        downloadXML() {
            //下载json
            this.download('flow.json', JSON.stringify(this.lf.getGraphData()))

        },
        renameLogic(){
            let name = prompt("请输入新名称", "lf");
            this.tab.tabName = name
        },
        paramCheck(inputWay, data, type){
            const int_regex=/^-?\d+$/
            const double_regex=/^-?\d+(.\d+)?$/
            const Size_regex=/^\d+,\d+$/
            let flag=true;
            if(inputWay=="smartInputWay") return true
            switch(type){
                case "int":
                    flag=int_regex.test(data)
                    break;
                case "double":
                    flag=double_regex.test(data)
                    break;
                case "Size":
                    flag=Size_regex.test(data)
                    break;
                default:
                    break;
            }
            if(!flag){
                alert("提交类型出错!")
            }
            return flag
        },
        formDataSubmit() {
            console.log('formit')
            console.log(this.branchData)
            this.nodeModel.deleteProperty("models")
            let model=this.operatorData.models.find(item=>item.modelName==this.modelName)
            let model_copy=JSON.parse(JSON.stringify(model))
            
            let paramReady = true
            for(let i in model_copy["inPara"]){

                if(this.formData[i]==""||!this.paramCheck(model_copy["inPara"][i].defineVarInputWay,this.formData[i],model_copy["inPara"][i].varType)) paramReady = false
                else model_copy["inPara"][i].fromExpression=this.formData[i]
            }

            
            if(this.nodeModel.properties.name=="分支模块"){
                model_copy['payload']=this.branchData
            }else if(this.nodeModel.properties.name=="条件检测"){
                model_copy['payload']=this.conditionData
            }

            this.nodeModel.setProperties(model_copy)

            if(paramReady) { //参数配置完成 改变状态
                this.nodeModel.properties.state = "ready"
            }

        },
        clear() {
            this.formData = []
        },
        clickLeftMenu() {
            let es = document.getElementsByClassName('el-overlay-dialog')
            for (let e of es) {
                e.parentNode.style.width = '0px'
            }
        },
        //根据节点运行状态改变节点边的颜色 状态init running finished
        //let color = {"init" : "blue", "running" : "green", "success" : "gray", "error" : "red"}
        changeNodeStage(nodeId, stage){
            let node = this.lf.getNodeModelById(nodeId)
            node.properties.state = stage;
        },
        readFile(idx){
            let input=document.getElementById('imgUrl')

            if (input.files[0]) {
                let reader = new FileReader();

                reader.onload = (event) => {
                    // 转换为 base64 格式
                    let base64 = event.target.result;

                    this.formData[idx]=base64
                    // 在这里可以将转换后的 base64 信息存储到组件的 data 属性中
                    // this.data = base64;
                };

                reader.readAsDataURL(input.files[0]);
            }
        },
        updateTimeconsume(nodeId){
            let tab_result=this.runResults.find(item=>item.tab_index===this.tab.index)
            if(tab_result){
                this.timeConsume.flowRunTime=tab_result.totalTimeConsume

                let node_result=tab_result.results.find(item=>item.id===nodeId)
                if(node_result){
                    this.timeConsume.algorithmRunTime=node_result.timeConsume
                }else{
                    this.timeConsume.algorithmRunTime=-1
                }
            }else{
                this.timeConsume.flowRunTime=-1
            }
        },
        t(){
            this.availableCameras = cameras.foreEndCameras
        },

        setInParams(node){    
            this.nodeModel=this.lf.getNodeModelById(node.id)
            //console.log(evt.data)//运行的结点信息
            let array=suanziItemList[node.properties.superName]
            this.operatorData=array.find(item=>item.name==node.properties.name)
            //找modelName和formData
            //console.log(this.nodeModel.getProperties())
            if(this.nodeModel.getProperties().inPara){
                this.modelName=this.nodeModel.getProperties().modelName
                this.formData=this.nodeModel.getProperties().inPara.map(param=>param.fromExpression)
            }else{
                this.modelName=this.operatorData.models[0].modelName
                this.formData=this.operatorData.models[0].inPara.map(param=>param.fromExpression)
            }
            // //获得输入源
            this.findInPara(node.id)
            // for(let i in this.nodeProperties.models){
            //     if(this.model.modelName==this.nodeProperties.models[i].modelName){
            //         this.nodeProperties.models[i].inPara=inPara
            //     }
            // }
            this.selectedAlgorithm = node.id
            this.$store.commit('setVuexHelpInfo', this.nodeModel.getProperties().helpMsg)

            this.dialogBranch=false
            this.dialogCondition=false
            this.dialogVisible = true
            //是否补充其他组件
            if(node.properties.name=="分支模块"){
                this.dialogBranch=true

                let sonsModel=this.lf.getNodeOutgoingNode(node.id)
                let data=[]
                let payload=[]
                if(this.nodeModel.getProperties().payload)
                    payload=this.nodeModel.getProperties().payload

                for(let model of sonsModel){
                    let node_id=model.id
                    data.push({
                        "nodeId":"模块ID:"+node_id,
                        "valueId":-1
                    })
                }

                for(let idx in payload){
                    data[idx].valueId=payload[idx].valueId
                }
                this.branchData=data
            }else if(node.properties.name=="条件检测"){
                this.dialogCondition=true
                
                if(this.nodeModel.getProperties().payload){
                    this.conditionData=this.nodeModel.getProperties().payload
                }else{
                    this.conditionData=[]
                }

                this.conditionIntExpr=this.getIncomingData(node.id,'int')
                this.conditionDoubleExpr=this.getIncomingData(node.id,'double')
            }
                
            let e = document.getElementsByClassName('el-overlay-dialog')[0].parentNode
            e.style.width = '0px';
        }
    }
}

