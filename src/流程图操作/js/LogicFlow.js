import { Menu, BpmnElement, SelectionSelect, Control, Snapshot, Group, GroupNode } from '@logicflow/extension'
import { lfJson2Xml } from '@logicflow/extension'
//test 框选
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
} from '@logicflow/core'

import { LeftMenus } from './LeftMenuItems.js'
import { MiniMap } from './MiniMap.js'
import { eventHandle, events } from "../../sys/eventResponseController";



LogicFlow.use(SelectionSelect);
LogicFlow.use(Menu);
const handleOpen = (key, keyPath) => {
    console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
    console.log(key, keyPath)
}
//初始化socketio用于前后端传输
let socket = io.connect('http://localhost:9092')


class CycleModel extends CircleNodeModel {
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

class SuanziModel extends RectNodeModel {
    setAttributes() {
        const size = this.properties.scale || 1;
        this.width = 100 * size
        this.height = 80 * size
    }
}

class ConditionJudgmentModel extends DiamondNodeModel {
    getNodeStyle() {
        const style = super.getNodeStyle();
        style.stroke = 'blue';
        return style;
    }
    setAttributes() {
        const size = this.properties.scale || 1;
        this.rx = 60 * size
        this.ry = 40 * size
    }
}
//定义Group节点，重写了节点的一些属性和方法
//由张瀚文添加
//参考https://blog.csdn.net/towersxu/article/details/124292204
class MyGroupModel extends GroupNode.model {
    initNodeData(data) {
        super.initNodeData(data);
        this.foldable = true;
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


//读json文件
//法一
// $(document).ready(function(){
//     $.getJSON("operatorLib.json",function(result){
//         console.log(result)
//         //var obj = JSON.parse(result);
//         //console.log(obj)
//
//     });
// });

//法二
// fetch('')
//     .then((response) => response.json())
//     .then((json)=>console.log(json))

//法三
import data from './operatorLib.json'
import { ref } from "vue";

import { ref } from "vue";


const suanziItemList = data

import operators from './operators.json'


// const dialogVisible = ref(false) //dialogVisible若为true,则显示页面内弹窗

export default {
    name: 'FlowDemo',
    data() {
        return {
            //logic-flow
            lf: null,
            initHeight: '',
            initData: null,
            //点击事件的节点对象
            nodeModel: '',
            //点击事件的边对象
            edgeModel: '',
            //框选选中的数据
            selectedMSG: null,
            //赋值变量 算子和图形
            suanzis: suanziItemList,
            imgBase64:"",
            opts:null,
            dialogVisible:false,
            type:"",
            formData:{
                checkboxes:[],
                inputs:"",
                radio:""
            }

        }
    },
    computed: {
    },
    mounted() {
        this.initHeight = window.innerHeight
        this.init()
        //设置节点点击事件监听, 修改帮助信息
        this.lf.on('node:click', (evt) => {
            console.log(this.opts)

            let type = evt.data.properties.name

            this.opts = operators[type]

            //刷新nodeModel
            console.log(type)
            this.nodeModel=this.lf.getNodeModelById(evt.data.id)
            //let type=this.nodeModel.getProperties().type


            switch (type) {
                case "cycleStart":
                    window.open("#/conditionNode", "newwin", "width=400, height=400, top=400, left=400,toolbar=no,scrollbars=no,menubar=no")
                    break
                case "conditionJudge":
                    window.open("#/conditionNode", "newwin", "width=400, height=400, top=400, left=400,toolbar=no,scrollbars=no,menubar=no")
                    break
                case "input":
                    window.open("#/input", "newwin", "width=400, height=400, top=400, left=400,toolbar=no,scrollbars=no,menubar=no")
                    break
                default:
                    this.dialogVisible=true



            }

            // if(type=="conditionJudge"||type=="cycleStart"){
            //     window.open("#/conditionNode", "newwin", "toolbar=no,scrollbars=no,menubar=no");
            // }


            //调用事件响应函数，做出响应
            //const msg_key = evt.data.properties.key
            //eventHandle(events.msg_singleStepOpr, {msg_key})//单步运算->key

            //iframe给父组件传递消息方法
            //window.parent.postMessage({nodeHelpMsg: evt.data.properties.helpMsg});
            //console.log(JSON.stringify(evt.data.text.value) + " is clicked. run some method related to label or type or id... and it's properties taht we can modify are: " + JSON.stringify(data.data.properties))
            //原生修改html元素方法
            // window.parent.document.getElementById("pane-third").innerText = evt.data.properties.helpMsg

        })

        this.lf.on('edge:click', (evt) => {
            window.open('#/conditionEdge', "newwin", "toolbar=no,scrollbars=no,menubar=no")
            let edgeId = (evt.data.id)
            //获取边
            this.edgeModel = this.lf.getEdgeModelById(edgeId)

        })

        //接收java传来的数据


        socket.on('revJson',(data)=>{
            console.log("this is json from java"+data)
        })
        socket.on('revBase64',(data)=>{
            console.log("this is img from java"+data)
            //先传递给FlowArea组件
            window.parent.postMessage({
                imgBase64:data
            })


        })
        //与弹出的dialog和标签页通信
        window.addEventListener('message', (evt) => {
            if (evt.data.flag) {
                //修改边的文本
                this.edgeModel.updateText(evt.data.flag)
            }
            if (evt.data.conditionValue) {
                //修改节点的值
                this.nodeModel.setProperties({
                    value: evt.data.conditionValue
                })
            }
            if (evt.data.imgBase64) {
                this.nodeModel.setProperties({
                    key: {
                        imgBase64: evt.data.imgBase64
                    }
                })

                //发送后端
                let jsonObject = {userName: "Pic",
                    message:evt.data.imgBase64,
                };
                socket.emit('chatevent', jsonObject);
            }

            console.log(evt.data)
        })
        window.onresize = () => {
            return (() => {
                this.initHeight = window.innerHeight
                this.lf.render(this.lf.getGraphData())
                const position = this.lf.getPointByClient(document.documentElement.clientWidth - 150, document.documentElement.clientHeight - 230)
                this.lf.extension.miniMap.show(position.domOverlayPosition.x, position.domOverlayPosition.y)
            })
        }
    },
    methods: {
        init() {
            const lf = new LogicFlow({
                container: document.querySelector("#lf"),
                height: this.initHeight,
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
                }
            })

            lf.extension.menu.setMenuConfig({
                nodeMenu: [
                    {
                        text: '删除',
                        callback(node) {
                            lf.deleteNode(node.id);
                        },
                    },
                    {
                        text: '编辑文本',
                        callback: function (node) {
                            lf.graphModel.editText(node.id);
                        },
                    },
                    {
                        text: '单步运行',
                        callback: function (node) {

                            console.log(node)
                        }

                    }
                ], // 覆盖默认的节点右键菜单
                edgeMenu: false, // 删除默认的边右键菜单
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
                        alert("222");
                        //将选区数据存储
                        const { nodes } = lf.getSelectElements();
                        const { startPoint, endPoint } = lf.extension.selectionSelect;
                        //清除选区数据
                        lf.clearSelectElements();
                        //如果节点中有不能组合的节点类型则返回
                        // if(nodes.some((node) => node.type === "someNode")){
                        //     return;
                        // }
                        //startPoint endPoint是dom坐标，需要转换成canvas坐标
                        const { transformModel } = lf.graphModel;
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
                            children: nodes.map((item) => item.id)
                        });
                    }
                },
                ]
            })

            lf.batchRegister([
                { // 圆形结点：标志循环开始循环结束
                    type: 'cycle',
                    view: CircleNode,
                    model: CycleModel
                },
                {
                    type: 'diamond',
                    view: DiamondNode,
                    model: ConditionJudgmentModel
                },
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

            // 设置算子面板
            var suanziItemListConcat = []
            for (var i in suanziItemList) {
                suanziItemListConcat = suanziItemListConcat.concat(suanziItemList[i])
            }
            lf.extension.leftMenus.setPatternItems(suanziItemListConcat)


            // 设置节点面板, 设置框选回调
            suanziItemList['控制模块'][2].callback = () => {
                //开启框选
                lf.openSelectionSelect()
                lf.once("selection:selected", (data) => {
                    let result = { nodes: [], edges: [] }
                    for (let x of data) {
                        //通过id获得model
                        let model = this.lf.getNodeModelById(x.id)
                        //通过model获得data
                        if (!model) {
                            model = this.lf.getEdgeModelById(x.id)
                            result.edges.push(model.getData())
                        } else {
                            result.nodes.push(model.getData())
                        }
                    }
                    this.selectedMSG = result
                    console.log(this.selectedMSG)
                });
            },


                lf.extension.control.addItem({
                    text: "下载快照",
                    onClick: () => {
                        this.downloadImage()
                    }
                })
            lf.extension.control.addItem({
                text: "下载XML",
                onClick: () => {
                    this.downloadXML()
                }
            })

            const initData = {}

            lf.render(initData)
            const position = lf.getPointByClient(document.documentElement.clientWidth - 150, document.documentElement.clientHeight - 230)
            lf.extension.miniMap.show(position.domOverlayPosition.x, position.domOverlayPosition.y)
            this.lf = lf
            this.initData = initData

        },
        download(filename, text) {
            console.log(filename, text)
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
            //this.download('flow.json', JSON.stringify(this.lf.getGraphData()))
            //前端开始运行逻辑不完善，因此将流程图json传到后端的语句写在这里了，以后实际开发的时候进行调整
            //socket.emit('flowInformation',this.lf.getGraphData());
            //test 传json串
            console.log(this.lf.getGraphData());
            //console.log(JSON.stringify(this.lf.getGraphData()))
            var jsonObject = {
                userName: 'Flow',
                message: JSON.stringify(this.lf.getGraphData())
            }

            socket.emit('chatevent', jsonObject);

            //test end
        },
        formDataSubmit() {
            console.log('Inputs:', this.formData.inputs)
            console.log('Checkboxes:', this.formData.checkboxes)
            console.log('Radio:', this.formData.radio)
            console.log("length:",this.formData.checkboxes[0])
            this.formData={
                checkboxes:[],
                inputs:"",
                radio:""
            }
        }
    },

    //////////////////////YUANZHENG SOCKETIO TEST/////////////////
    //此处为前后端通信函数，因为前端UI逻辑还未完善，先放在这里，以后用的时候进行调整
    //具体逻辑为socketio.emit('参数名',json格式的参数);后端建立对应的监听器接收并进行下一步处理
    //有问题问袁征
    socketioNum() {
        var jsonObject = {
            userName: "Num",
            message: 1024,
        };
        socket.emit('chatevent', jsonObject);
    },
    socketioInt() {
        var jsonObject = {
            userName: "Int",
            message: 2048,
        };
        socket.emit('chatevent', jsonObject);
    },
    socketioDou() {
        var jsonObject = {
            userName: "Dou",
            message: 10.24,
        };
        socket.emit('chatevent', jsonObject);
    },
    socketioFlt() {
        var jsonObject = {
            userName: "Flt",
            message: 102.4,
        };
        socket.emit('chatevent', jsonObject);
    },
    socketioStr() {
        var jsonObject = {
            userName: "Str",
            message: "Hello Yuan Zheng!!!!!!",
        };
        socket.emit('chatevent', jsonObject);
    },
    socketioPic() {
        let base64Img
        let Img = this.$refs.imgUrl.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(Img)
        reader.onload = function () {
            var jsonObject = {
                userName: "Pic",
                message: this.result,
            };
            base64Img = this.result
            socket.emit('chatevent', jsonObject);
            console.log(this.result)
        }
    }
    //////////////////////////////////////////////////////////////
}

