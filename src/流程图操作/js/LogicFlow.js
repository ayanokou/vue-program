import {Menu, BpmnElement, SelectionSelect, Control, Snapshot} from '@logicflow/extension'
import {lfJson2Xml} from '@logicflow/extension'
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
    CircleNodeModel
} from '@logicflow/core'
import {LeftMenus} from './LeftMenuItems.js'
import {MiniMap} from './MiniMap.js'
import {eventHandle, events} from "../../sys/eventResponseController";
LogicFlow.use(SelectionSelect);
const handleOpen = (key, keyPath) => {
    console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
    console.log(key, keyPath)
}
//初始化socketio用于前后端传输
let socket = io.connect('http://localhost:9092')


class CycleModel extends CircleNodeModel{
    getNodeStyle() {
        const style = super.getNodeStyle();
        style.stroke = 'blue';
        return style;
    }
    setAttributes() {
        const size = this.properties.scale || 1;
        this.r=25*size
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

const suanziItemList = data

export default {
    name: 'FlowDemo',
    data() {
        return {
            //logic-flow
            lf: null,
            initHeight: '',
            initData: null,
            //点击事件的节点对象
            nodeModel:'',
            //点击事件的边对象
            edgeModel:'',
            //框选选中的数据
            selectedMSG:null,
            //赋值变量 算子和图形
            suanzis: suanziItemList,
            imgBase64:""
            //
        }
    },
    computed:{
    },
    mounted() {
        this.initHeight = window.innerHeight
        this.init()
        //设置节点点击事件监听, 修改帮助信息
        this.lf.on('node:click', (evt) => {
            //刷新nodeModel
            console.log(evt.data)
            this.nodeModel=this.lf.getNodeModelById(evt.data.id)
            //let type=this.nodeModel.getProperties().type
            let type=evt.data.properties.name
            console.log(type)

            switch(type){
                case "cycleStart":
                    window.open("#/conditionNode", "newwin", "width=400, height=400, top=400, left=400,toolbar=no,scrollbars=no,menubar=no")
                    break
                case "conditionJudge":
                    window.open("#/conditionNode", "newwin", "width=400, height=400, top=400, left=400,toolbar=no,scrollbars=no,menubar=no")
                    break
                case "input":
                    window.open("#/input", "newwin", "width=400, height=400, top=400, left=400,toolbar=no,scrollbars=no,menubar=no")
                    break

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

        this.lf.on('edge:click',(evt)=>{
            window.open('#/conditionEdge', "newwin", "toolbar=no,scrollbars=no,menubar=no")
            let edgeId=(evt.data.id)
            //获取边
            this.edgeModel=this.lf.getEdgeModelById(edgeId)

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
            if(evt.data.flag){
                //修改边的文本
                this.edgeModel.updateText(evt.data.flag)
            }
            if(evt.data.conditionValue){
                //修改节点的值
                this.nodeModel.setProperties({
                    value:evt.data.conditionValue
                })
            }
            if(evt.data.imgBase64){
                this.nodeModel.setProperties({
                    key:{
                        imgBase64:evt.data.imgBase64
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
                plugins: [Menu, BpmnElement, LeftMenus, SelectionSelect, Control, MiniMap, Snapshot],
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
                    let result={nodes:[],edges:[]}
                    for(let x of data){
                        //通过id获得model
                        let model=this.lf.getNodeModelById(x.id)
                        //通过model获得data
                        if(!model){
                            model=this.lf.getEdgeModelById(x.id)
                            result.edges.push(model.getData())
                        }else{
                            result.nodes.push(model.getData())
                        }
                    }
                    this.selectedMSG=result
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

            //test 传json给后端
            var jsonObject={
                userName:'Flow',
                message:JSON.stringify(this.lf.getGraphData())
            }
            socket.emit('chatevent',jsonObject);
            //test end
        }
    },

    //////////////////////YUANZHENG SOCKETIO TEST/////////////////
    //此处为前后端通信函数，因为前端UI逻辑还未完善，先放在这里，以后用的时候进行调整
    //具体逻辑为socketio.emit('参数名',json格式的参数);后端建立对应的监听器接收并进行下一步处理
    //有问题问袁征
    socketioNum(){
        var jsonObject = {userName: "Num",
            message: 1024,
        };
        socket.emit('chatevent', jsonObject);
    },
    socketioInt(){
        var jsonObject = {userName: "Int",
            message: 2048,
        };
        socket.emit('chatevent', jsonObject);
    },
    socketioDou(){
        var jsonObject = {userName: "Dou",
            message: 10.24,
        };
        socket.emit('chatevent', jsonObject);
    },
    socketioFlt(){
        var jsonObject = {userName: "Flt",
            message: 102.4,
        };
        socket.emit('chatevent', jsonObject);
    },
    socketioStr(){
        var jsonObject = {userName: "Str",
            message: "Hello Yuan Zheng!!!!!!",
        };
        socket.emit('chatevent', jsonObject);
    },
    socketioPic(){
        let base64Img
        let Img = this.$refs.imgUrl.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(Img)
        reader.onload=function (){
            var jsonObject = {userName: "Pic",
                message: this.result,
            };
            base64Img = this.result
            socket.emit('chatevent', jsonObject);
            console.log(this.result)
        }
    }
    //////////////////////////////////////////////////////////////
}

