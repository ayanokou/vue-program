<template>
    <el-dialog
        v-model="openSolutionVisible"
        :modal="false"
        :close-on-click-modal="false"
        :show-close="false"
        :title="modelName"
        width="20%"
        height="30%"
        draggable
    >
        <p>请选择您要打开的方案</p>
        <div class="scroll-container">
            <el-radio-group class="dialog-radio">
                <el-radio
                    v-for="(item, index) in solutionKeys"
                    :key="index"
                    :label="item"
                    @change="openSomeSolution(item)"
                >
                </el-radio>
            </el-radio-group>
        </div>
    </el-dialog>
    <el-dialog
        v-model="deleteSolutionVisible"
        :modal="false"
        :close-on-click-modal="false"
        :show-close="false"
        :title="modelName"
        width="20%"
        draggable
    >
        <p>请选择您要删除的方案</p>
        <div class="scroll-container">
            <el-checkbox-group
                v-model="selectSolutionsToDelete"
                class="dialog-checkbox"
            >
                <el-checkbox
                    v-for="(item, index) in solutionKeys"
                    :key="index"
                    :label="item"
                />
            </el-checkbox-group>
            <el-button @click="submit">提交</el-button>
        </div>
    </el-dialog>
    <!-- <div>
        <el-message-box
        v-model="showDeleteConfirmationDialog"
        title="确认删除"
        message="是否删除当前方案？"
        show-confirm-button
        show-cancel-button
        confirm-button-text="确认"
        cancel-button-text="取消"
        :show-close="false"
        :show="showDeleteDialog"
        @confirm="deleteCurrentSolutionFunc"
        @cancel="showDeleteConfirmationDialog = false"
        ></el-message-box>
    </div> -->
    <el-dialog
        v-model="importFlowVisible"
        :modal="false"
        :close-on-click-modal="false"
        :show-close="false"
        :title="modelName"
        width="20%"
        height="30%"
        draggable
    >
        <p>请选择您要导入的流程</p>
        <div class="scroll-container">
            <el-radio-group class="dialog-radio">
                <el-radio
                    v-for="(item, index) in flowKeys"
                    :key="index"
                    :label="item"
                    @change="importSomeFlow(item)"
                >
                </el-radio>
            </el-radio-group>
        </div>
    </el-dialog>

    <el-dialog
        v-model="softwareSetVisible"
        :modal="false"
        :close-on-click-modal="false"
        :show-close="false"
        :title="modelName"
        width="20%"
        height="30%"
        draggable
    >
        <p>软件设置窗口</p>
        <div class="scroll-container">
            <el-radio-group class="dialog-radio">
                <el-radio
                    v-for="(item, index) in flowKeys"
                    :key="index"
                    :label="item"
                    @change="importSomeFlow(item)"
                >
                </el-radio>
            </el-radio-group>
        </div>
    </el-dialog>

    <el-tabs
        v-model="editableTabsValue"
        type="card"
        editable
        class="demo-tabs"
        @edit="handleFlowsEdit"
    >
        <el-tab-pane
            v-for="item in editableTabs"
            :key="item.name"
            :name="item.name"
        >
            <template #label>
                {{ item.tabName }}
                <el-button  class="tab-button run-button" @click="run(item.index)">
                    <el-icon style="color:black;">
                        <CaretRight />
                    </el-icon>
                </el-button>
                <el-button class="tab-button">
                    <el-icon style="color:black;">
                        <Refresh />
                    </el-icon>
                </el-button>
            </template>
            <LogicFlow
                ref="lfComponent"
                :tab="item"
                @changeTabName="changeTabName"
            >
                <div :id="item.title" style="height: 100%"></div>
            </LogicFlow>

        </el-tab-pane>
    </el-tabs>
</template>



<script>
import { mapState } from "vuex";

import LogicFlow from "./components/LogicFlow.vue";

export default {
    components: {
        LogicFlow,
    },
    data() {
        return {
            tabIndex: 1,
            solutionIndex: 1,
            //点击打开方案后弹窗
            openSolutionVisible: false,
            //点击删除方案后弹窗
            deleteSolutionVisible: false,
            //当前方案删除确认窗口
            showDeleteConfirmationDialog: false,
            //点击导入流程后弹窗
            importFlowVisible: false,
            //软件设置窗口
            softwareSetVisible:false,
            //保存多选框选中的要被删除的解决方案
            selectSolutionsToDelete: [],
            //现有的解决方案
            solutionKeys: [],
            //现有的流程图
            flowKeys: [],
            //当前显示的标签页
            editableTabsValue: "1",
            solutionKey: null,
            editableTabs: [
                {
                    title: "logicFlow1", //作为标签id
                    name: "1", //作为标签页名
                    index: 0, //标签页下标
                    tabName: "lf",
                    initLF: {},
                },
            ],
            //confirmationDialog确认后，哪些窗口要弹出
            confirmationDialogFlag: "",
        };
    },
    computed: {
        ...mapState([
            "newSolution",
            "openSolution",
            "openSelectedSolution",
            "deleteSolution",
            "deleteCurrentSolution",
            "saveSolution",
            "saveSolutionAs",
            //"open",
            "flowAdd",
            "flowChartOK",
            "runSolution",
            "localImg"
        ]),
        solution(){
            let lfs = [];
            //得到每个标签页的流程图内容
            for (let index in this.$refs.lfComponent) {
                lfs.push({
                    tabIndex: parseInt(index),
                    content: this.$refs.lfComponent[index].lfData,
                });
            }
            return {content:lfs}
        }
    },
    watch: {
        runSolution(newValue){
            if(newValue.trigger){
                let jsonObject = {
                    userName: 'Solution',
                    message: JSON.stringify(this.solution)
                }
                let payload={
                    trigger:true,
                    mode:"chatevent",
                    data:jsonObject
                }
                this.$store.commit("setSocketEmit",payload)

                this.$store.commit('runSolutionEvent',{trigger:false})
            }
        },
        flowChartOK(newValue){
            if(newValue.trigger){
                let index=newValue.index
                let run_button=document.getElementsByClassName('run-button')[index]
                run_button.classList.remove('running')
                run_button.classList.add('runover')

                this.$store.commit('setFlowChartOK',{trigger:false,index:-1})
            }
        },
        newSolution(newValue) {
            if (newValue.trigger) {
                this.$confirm('是否保存当前方案?', '提示', {
                confirmButtonText: '保存',
                cancelButtonText: '不保存',
                type: 'warning'
                })
                .then(() => {
                    if(this.solutionKey === null){
                        this.solutionKey = prompt("请为方案命名", "solution" + this.solutionIndex++)
                    }
                    this.$store.commit('saveSolutionEvent', {trigger: true})
                })
                .catch(() => {
                })
                .finally( ()=>{
                    //处理逻辑
                    for (let tab of this.editableTabs) {
                        //获得每一个tab的name
                        this.handleTabsEdit(tab.name, "remove");
                    }
                    let name = prompt(
                        "请输入新建方案名",
                        "solution" + this.solutionIndex++
                    );
                    this.solutionKey = name;
                    this.handleTabsEdit("", "add");
                    let lfs = [];
                    //得到每个标签页的流程图内容
                    for (let index in this.$refs.lfComponent) {
                        lfs.push({
                            name: this.editableTabs[index].tabName,
                            content: this.$refs.lfComponent[index].lfData,
                        });
                    }
                    let solutionType = "No";
                    let currentTime = Date.now();
                    let text = {
                        name: this.solutionKey,
                        type: "solution",
                        solutionType: solutionType,
                        time: currentTime,
                        contents: lfs,
                    };
                    localStorage.setItem(text.name, JSON.stringify(text));
                    //关掉触发器
                    this.$store.commit("newSolutionEvent", {trigger: false});
                })
                
            }
        },
        openSolution(newValue) {
            if (newValue.trigger) {
                this.$confirm('是否保存当前方案?', '提示', {
                confirmButtonText: '保存',
                cancelButtonText: '不保存',
                type: 'warning'
                })
                .then(() => {
                    if(this.solutionKey === null){
                        this.solutionKey = prompt("请为方案命名", "solution" + this.solutionIndex++)
                    }
                    this.$store.commit('saveSolutionEvent', {trigger: true})
                })
                .catch(() => {
                })
                .finally( ()=>{
                    this.openSolutionVisible = false;
                    this.solutionKeys = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        let key = localStorage.key(i);
                        let value = localStorage.getItem(key);
                        if (key === "debug") continue;
                        let cont = JSON.parse(value);
                        if (cont.type === "solution") {
                            this.solutionKeys.push(key);
                        }
                    }
                    this.openSolutionVisible = true;
                    //关掉触发器
                    this.$store.commit("openSolutionEvent", {trigger: false});
                })

                // let inputObj = document.createElement("input");
                // inputObj.type = "file";
                // inputObj.accept = "json";
                // let solutionJson = null;
                // inputObj.onchange = () => {
                //     let file = inputObj.files[0];
                //     let reader = new FileReader();
                //     reader.readAsText(file);
                //     reader.onload = () => {
                //         solutionJson = JSON.parse(reader.result);
                //         //console.log(solutionJson); // 读取json
                //         //遍历JSON
                // for(let singleLogicflow of solutionJson.contents){
                //     this.handleTabsEdit("", "add", singleLogicflow.content,singleLogicflow.name)
                // }
                //     };
                // };
                // inputObj.click();
                
            }
        },
        openSelectedSolution(newValue) {
            if (newValue.trigger) {
                this.$confirm('是否保存当前方案?', '提示', {
                confirmButtonText: '保存',
                cancelButtonText: '不保存',
                type: 'warning'
                })
                .then(() => {
                    if(this.solutionKey === null){
                        this.solutionKey = prompt("请为方案命名", "solution" + this.solutionIndex++)
                    }
                    this.$store.commit('saveSolutionEvent', {trigger: true})
                })
                .catch(() => {
                })
                .finally( ()=>{
                    //处理逻辑
                    for (let tab of this.editableTabs) {
                        //关掉所有标签页
                        this.handleTabsEdit(tab.name, "remove");
                    }
                    this.solutionKey = newValue.key;
                    let cnts = localStorage.getItem(newValue.key);
                    let solutionJson = JSON.parse(cnts);
                    // //循环：打开标签页
                    for (let singleLogicflow of solutionJson.contents) {
                        this.handleTabsEdit(
                            "",
                            "add",
                            singleLogicflow.content,
                            singleLogicflow.name
                        );
                    }
                    let upCondition = {
                        trigger: false,
                        key: "",
                    };
                    this.$store.commit("openSelectedSolutionEvent", upCondition);
                })
                
            }
        },
        softwareSet(newValue){
            if (newValue.trigger) {
                this.softwareSetVisible = false;
                this.flowKeys = [];
                for (let i = 0; i < localStorage.length; i++) {
                    let key = localStorage.key(i);
                    let value = localStorage.getItem(key);
                    if (key === "debug") continue;
                    let cont = JSON.parse(value);
                    if (cont.type === "flow") {
                        this.flowKeys.push(key);
                    }
                }
                this.importFlowVisible = true;
                this.$store.commit("softwareSetEvent", {trigger: false});
            }
        },
        deleteSolution(newValue) {
            if (newValue.trigger) {
                this.solutionKeys = [];
                this.selectSolutionsToDelete = [];
                for (let i = 0; i < localStorage.length; i++) {
                    let key = localStorage.key(i);
                    let value = localStorage.getItem(key);
                    if (key === "debug") continue;
                    let cont = JSON.parse(value);
                    if (cont.type === "solution") {
                        this.solutionKeys.push(key);
                    }
                }
                this.deleteSolutionVisible = true;
                this.$store.commit("deleteSolutionEvent", {trigger: false});
            }
        },
        deleteCurrentSolution(newValue) {
            if (newValue.trigger) {
                this.$confirm('是否删除当前方案?', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
                })
                .then(() => {
                    // this.showDeleteConfirmationDialog = true;
                    localStorage.removeItem(this.solutionKey);
                    alert("方案：" + this.solutionKey + "已删除");
                    //处理逻辑
                    for (let tab of this.editableTabs) {
                        //关掉所有标签页
                        this.handleTabsEdit(tab.name, "remove");
                    }
                    this.$store.commit("deleteCurrentSolutionEvent", {trigger: false});
                })
                .catch(() => {
                })
            }
        },
        saveSolution(newValue) {
            if (newValue.trigger) {
                //逻辑
                let lfs = [];
                //得到每个标签页的流程图内容
                for (let index in this.$refs.lfComponent) {
                    lfs.push({
                        name: this.editableTabs[index].tabName,
                        content: this.$refs.lfComponent[index].lfData,
                    });
                }
                let solutionType = prompt(
                    "是否是示例方案，请输入Yes或No",
                    "No"
                );
                let currentTime = Date.now();
                let text = {
                    name: this.solutionKey,
                    type: "solution",
                    solutionType: solutionType,
                    time: currentTime,
                    contents: lfs,
                };
                localStorage.setItem(text.name, JSON.stringify(text));
                // let element = document.createElement("a")
                // element.setAttribute(
                //     "href",
                //     "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(text))
                // )
                // element.setAttribute("download", "solution.json")

                // element.style.display = "none"
                // document.body.appendChild(element)

                // element.click()

                // document.body.removeChild(element)
                //关掉触发器
                this.$store.commit("saveSolutionEvent", {trigger: false});
            }
        },
        saveSolutionAs(newValue) {
            if (newValue.trigger) {
                //逻辑
                let lfs = [];
                //得到每个标签页的流程图内容
                for (let index in this.$refs.lfComponent) {
                    lfs.push({
                        name: this.editableTabs[index].tabName,
                        content: this.$refs.lfComponent[index].lfData,
                    });
                }
                let solutionType = prompt(
                    "是否是示例方案，请输入Yes或No",
                    "No"
                );
                let Name = prompt("请输入解决方案名称", "sln");
                let currentTime = Date.now();
                let text = {
                    name: Name,
                    type: "solution",
                    solutionType: solutionType,
                    time: currentTime,
                    contents: lfs,
                };
                localStorage.setItem(text.name, JSON.stringify(text));
                // let element = document.createElement("a")
                // element.setAttribute(
                //     "href",
                //     "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(text))
                // )
                // element.setAttribute("download", "solution.json")

                // element.style.display = "none"
                // document.body.appendChild(element)

                // element.click()

                // document.body.removeChild(element)
                //关掉触发器
                this.$store.commit("saveSolutionAsEvent", {trigger: false});
            }
        },
        flowAdd(newValue) {
            if (newValue.trigger) {
                this.importFlowVisible = false;
                this.flowKeys = [];
                for (let i = 0; i < localStorage.length; i++) {
                    let key = localStorage.key(i);
                    let value = localStorage.getItem(key);
                    if (key === "debug") continue;
                    let cont = JSON.parse(value);
                    if (cont.type === "flow") {
                        this.flowKeys.push(key);
                    }
                }
                this.importFlowVisible = true;
                this.$store.commit("flowAddEvent", {trigger: false});
            }
        },
        localImg(newValue){

        }
    },

    methods: {
        run(index){
            let run_button=document.getElementsByClassName('run-button')[index]
            run_button.classList.add('running');
            let msg={
                tabIndex:index,
                content:this.$refs.lfComponent[index].lfData
            }
            let jsonObject = {
                userName: 'Flow',
                message: JSON.stringify(msg)
            }
            let payload={
                trigger:true,
                mode:"chatevent",
                data:jsonObject
            }
            this.$store.commit("setSocketEmit",payload)
        },
        openSomeSolution(item){
            this.openSolutionVisible = false
            //处理逻辑
            for (let tab of this.editableTabs) {
                //关掉所有标签页
                this.handleTabsEdit(tab.name, "remove");
            }
            this.solutionKey = item;
            let cnts = localStorage.getItem(item);
            let solutionJson = JSON.parse(cnts);
            // //循环：打开标签页
            for (let singleLogicflow of solutionJson.contents) {
                this.handleTabsEdit(
                    "",
                    "add",
                    singleLogicflow.content,
                    singleLogicflow.name
                );
            }
            solutionJson.time = Date.now();
            localStorage.setItem(
                this.solutionKey,
                JSON.stringify(solutionJson)
            );
        },
        importSomeFlow(item) {
            this.importFlowVisible = false;
            let cnts = localStorage.getItem(item);
            let flowJson = JSON.parse(cnts);
            this.flowAddSingle(flowJson.content, flowJson.name);
            this.$store.commit("flowAddEvent", false);
        },
        addFlow() {
            let name = prompt("请输入新建流程名", "lf");
            this.handleTabsEdit("", "add", {}, name);
        },
        submit() {
            this.deleteSolutionVisible = false;
            for (let i = 0; i < this.selectSolutionsToDelete.length; ++i) {
                localStorage.removeItem(this.selectSolutionsToDelete[i]);
            }
        },
        changeTabName(data) {
            this.editableTabs[data.index].tabName = data.tabName;
        },
        handleFlowsEdit(targetName, action, singleJSON = {}) {
            if (action === "add") {
                this.addFlow();
            } else if (action === "remove") {
                this.handleTabsEdit(targetName, "remove");
            }
        },
        handleTabsEdit(targetName, action, singleJSON = {}, tabName = "lf") {
            if (action === "add") {
                const newTabName = `${++this.tabIndex}`;
                this.editableTabs.push({
                    title: "logicFlow" + this.tabIndex,
                    name: newTabName,
                    index: this.editableTabs.length,
                    tabName: tabName,
                    initLF: singleJSON,
                });
                this.editableTabsValue = newTabName;

            } else if (action === "remove") {
                const tabs = this.editableTabs;
                let activeName = this.editableTabsValue;
                //更新如果当前activeName被删除，需要重新定位activeName
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            const nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }

                this.editableTabsValue = activeName;
                //将删掉的目标标签页过滤掉
                this.editableTabs = tabs.filter(
                    (tab) => tab.name !== targetName
                );
                //重新排序
                this.editableTabs.forEach((tab, index) => {
                    tab.index = index;
                });
            }
        },
        flowAddSingle(flowcnts, flowname) {
            const newTabName = `${++this.tabIndex}`;
            this.editableTabs.push({
                title: "logicFlow" + this.tabIndex,
                name: newTabName,
                index: this.editableTabs.length,
                tabName: flowname,
                initLF: flowcnts,
            });
            this.editableTabsValue = newTabName;
        },
    },
    mounted() {},
};
</script>
<style scoped>
.running{
    /*background-color: rgb(121, 187, 255);*/
    background-color: red;
}
.runover{
    background-color: white;
}
.el-button{
    --el-button-hover-bg-color:rgb(121, 187, 255);
}
.demo-tabs.el-tabs.el-tabs--top.el-tabs--card{
    display: flex;
    flex-direction: column;
}
.el-tabs__header.is-top {
    margin-bottom: 5px;
}

.el-tabs.el-tabs--top.el-tabs--card.demo-tabs {
    height: 100%;
}
.tab-button:hover{
    background-color:rgb(121, 187, 255)
}
.tab-button:active{
    background-color:rgb(121, 187, 255)
}

.scroll-container {
    height: 300px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-items: flex-start;
}

.dialog-radio {
    display: flex;
    flex-direction: column;
    justify-content: left;
    align-items: flex-start;
}

.dialog-checkbox {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.dialog-checkbox el-checkbox {
    justify-content: center;
    flex: 1; /* 子元素均分剩余空间 */
    margin: 0 5px; /* 设置子元素间的间距 */
}

.dialog-radio el-radio {
    align-items: flex-start;
    flex: 1; /* 子元素均分剩余空间 */
    margin: 0 5px; /* 设置子元素间的间距 */
}

.el-tab-pane {
    height: 100%;
}
</style>
