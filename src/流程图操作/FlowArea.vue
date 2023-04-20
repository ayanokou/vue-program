<template>
    <el-dialog  v-model="openSolutionVisible" :modal="false" :close-on-click-modal="false" :show-close="false" :title="modelName" width="20%" height="30%" draggable>
        <p>请选择您要打开的方案</p>
        <div class="scroll-container">
            <el-radio-group class="dialog-radio">
                <el-radio v-for="(item, index) in solutionKeys" :key="index" :label="item" @change="openSomeSolution(item)">
                </el-radio>
            </el-radio-group>
        </div>
    </el-dialog>
    <el-dialog v-model="deleteSolutionVisible" :modal="false" :close-on-click-modal="false" :show-close="false" :title="modelName" width="20%" draggable>
        <p>请选择您要删除的方案</p>
        <div class="scroll-container">
            <el-checkbox-group v-model="selectDeleteSolutions" class="dialog-checkbox">
                <el-checkbox v-for="(item, index) in solutionKeys" :key="index" :label="item" />
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
    <el-dialog  v-model="importFlowVisible" :modal="false" :close-on-click-modal="false" :show-close="false" :title="modelName" width="20%" height="30%" draggable>
        <p>请选择您要导入的流程</p>
        <div  class="scroll-container">
            <el-radio-group class="dialog-radio">
                <el-radio v-for="(item, index) in flowKeys" :key="index" :label="item" @change="importSomeFlow(item)">
                </el-radio>
            </el-radio-group>
        </div>
    </el-dialog>
    <el-tabs
        v-model="editableTabsValue"
        type="card"
        editable
        class="demo-tabs"
        @edit="addFlow"
    >
        <el-tab-pane
            v-for="item in editableTabs"
            :key="item.name"
            :name="item.name"
        >
            <template #label>
                {{ item.tabName }}
            </template>
            <LogicFlow
                ref="lfComponent"
                :tab="item"
                @changeTabName="changeTabName"
            >
                <div :id="item.title" style="height:100%"></div>
            </LogicFlow>
            <!--            <iframe src='#/logicFlow' width='100%' :height="iframeHeight + 'px'" scrolling="no"></iframe>-->
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
            //点击打开方案后弹窗
            openSolutionVisible: false,
            //点击删除方案后弹窗
            deleteSolutionVisible: false,
            //当前方案删除确认窗口
            showDeleteConfirmationDialog: false,
            //点击导入流程后弹窗
            importFlowVisible: false,
            //保存多选框选中的要被删除的解决方案
            selectDeleteSolutions: [],
            //现有的解决方案
            solutionKeys:[],
            //现有的流程图
            flowKeys: [],
            //当前显示的标签页
            editableTabsValue: "1",
            solutionKey: "default",
            editableTabs: [
                {
                    title: "logicFlow1", //作为标签id
                    name: "1", //作为标签页名
                    index: 0, //标签页下标
                    tabName: "lf",
                    initLF: {},
                },
            ],
        };
    },
    computed: {
        ...mapState([
            "newSolutionTrigger",
            "openSolutionTrigger",
            "openSelectedSolutionTrigger",
            "deleteSolutionTrigger",
            "deleteCurrentSolutionTrigger",
            "saveSolutionTrigger",
            "saveSolutionAsTrigger",
            "open",
            "flowAddTrigger",
        ]),
    },
    watch: {
        newSolutionTrigger(newValue) {
            if (newValue) {
                //处理逻辑
                for (let tab of this.editableTabs) {
                    //获得每一个tab的name
                    this.handleTabsEdit(tab.name, "remove");
                }
                let Name = prompt("请输入方案名");
                this.solutionKey = Name;
                this.handleTabsEdit("", "add");
                let lfs = [];
                //得到每个标签页的流程图内容
                for (let index in this.$refs.lfComponent) {
                    lfs.push({
                        name: this.editableTabs[index].tabName,
                        content: this.$refs.lfComponent[index].lfData,
                    });
                }
                let currentTime = Date.now();
                let text = {
                    name: this.solutionKey,
                    type: "solution",
                    time: currentTime,
                    contents: lfs,
                };
                localStorage.setItem(text.name, JSON.stringify(text));
                //关掉触发器
                this.$store.commit("newSolutionEvent", false);
            }
        },
        openSolutionTrigger(newValue) {
            if (newValue) {
                
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
                
                this.openSolutionVisible = false;
                this.solutionKeys=[]
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
                this.$store.commit("openSolutionEvent", false);
            }
        },
        openSelectedSolutionTrigger(newValue){
            if(newValue.trigger){
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
                    trigger:false,
                    key:""
                }
                this.$store.commit("openSelectedSolutionEvent", upCondition);
            }
        },
        deleteSolutionTrigger(newValue){
            if(newValue){
                this.solutionKeys = []
                this.selectDeleteSolutions = []
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
                this.$store.commit("deleteSolutionEvent", false);
            }
        },
        deleteCurrentSolutionTrigger(newValue){
            if(newValue){
                this.showDeleteConfirmationDialog = true;
                localStorage.removeItem(this.solutionKey);
                alert("方案：" + this.solutionKey + "已删除");
                //处理逻辑
                for (let tab of this.editableTabs) {
                    //关掉所有标签页
                    this.handleTabsEdit(tab.name, "remove");
                }
                this.$store.commit("deleteCurrentSolutionEvent", false);
            }
        },
        saveSolutionTrigger(newValue) {
            if (newValue) {
                //逻辑
                let lfs = [];
                //得到每个标签页的流程图内容
                for (let index in this.$refs.lfComponent) {
                    lfs.push({
                        name: this.editableTabs[index].tabName,
                        content: this.$refs.lfComponent[index].lfData,
                    });
                }
                let currentTime = Date.now();
                console.log("时间是"+currentTime)
                let text = {
                    name: this.solutionKey,
                    type: "solution",
                    time: currentTime,
                    contents: lfs,
                };
                console.log(text)
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
                this.$store.commit("saveSolutionEvent", false);
            }
        },
        saveSolutionAsTrigger(newValue) {
            if (newValue) {
                //逻辑
                let lfs = [];
                //得到每个标签页的流程图内容
                for (let index in this.$refs.lfComponent) {
                    lfs.push({
                        name: this.editableTabs[index].tabName,
                        content: this.$refs.lfComponent[index].lfData,
                    });
                }
                let Name = prompt("请输入解决方案名称", "sln");
                let currentTime = Date.now();
                let text = {
                    name: Name,
                    type: "solution",
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
                this.$store.commit("saveSolutionAsEvent", false);
            }
        },
        flowAddTrigger(newValue) {
            if (newValue) {
                console.log("flowAddTrigger")
                this.importFlowVisible = false;
                this.flowKeys=[]
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
                this.$store.commit("flowAddEvent", false);
            }     
        },
    },

    methods: { 
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
            
        },
        importSomeFlow(item){
            this.importFlowVisible = false
            let cnts = localStorage.getItem(item);
            let flowJson = JSON.parse(cnts);
            this.flowAdd(flowJson.content, flowJson.name);
            this.$store.commit("flowAddEvent", false);
        },
        addFlow(){
            let name = prompt("请输入新建流程名", "lf")
            this.handleTabsEdit("", "add", {}, name)
        },
        submit(){
            console.log('选中的选项：', this.selectDeleteSolutions);
            this.deleteSolutionVisible = false
            for(let i = 0; i < this.selectDeleteSolutions.length; ++i){
                localStorage.removeItem(this.selectDeleteSolutions[i]);
            }

        },
        changeTabName(data) {
            this.editableTabs[data.index].tabName = data.tabName;
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
                console.log("activeName:", activeName);
                console.log("targetName:", targetName);
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
            console.log(this.editableTabs);
        },
        flowAdd(flowcnts, flowname) {
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
.demo-tabs.el-tabs.el-tabs--top.el-tabs--card{
    display: flex;
    flex-direction: column;
}
.el-tabs__content{
    flex: 1;
}
.el-tabs__header.is-top{
    margin:0px;
}

.el-tabs.el-tabs--top.el-tabs--card.demo-tabs {
    height: 100%;
}

.scroll-container {
  height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-items:flex-start;
}

.dialog-radio {
  display: flex;
  flex-direction: column;
  justify-content:left;
  align-items:flex-start;
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
  align-items:flex-start;
  flex: 1; /* 子元素均分剩余空间 */
  margin: 0 5px; /* 设置子元素间的间距 */
}

.el-tab-pane {
    height: 100%;
}
</style>
