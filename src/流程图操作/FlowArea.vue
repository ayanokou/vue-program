<template>
    <el-tabs
        v-model="editableTabsValue"
        type="card"
        editable
        class="demo-tabs"
        @edit="handleTabsEdit"
    >
        <el-tab-pane
            v-for="item in editableTabs"
            :key="item.name"
            :name="item.name"
        >
            <template #label>
                {{ item.tabName }}
                <el-button icon="pointer">开始</el-button>
                <el-button icon="finished">结束</el-button>
            </template>
            <LogicFlow
                ref="lfComponent"
                :tab="item"
                @changeTabName="changeTabName"
            >
                <div :id="item.title"></div>
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
            //当前显示的标签页
            editableTabsValue: "1",
            editableTabs: [
                {
                    title: "logicFlow1", //作为标签id
                    name: "1", //作为标签页名
                    index: 0, //标签页下标
                    tabName: "lf",
                    initLF:{}
                },
            ],
        };
    },
    computed: {
        ...mapState(["newSolutionTrigger", "openSolutionTrigger", "saveSolutionTrigger"]),
    },
    watch: {
        newSolutionTrigger(newValue) {
            if (newValue) {
                //处理逻辑
                for (let tab of this.editableTabs) {
                    //获得每一个tab的name
                    this.handleTabsEdit(tab.name, "remove");
                }
                this.handleTabsEdit("", "add");
                //关掉触发器
                this.$store.commit("newSolutionEvent", false);
            }
        },
        openSolutionTrigger(newValue) {
            if (newValue) {
                //处理逻辑
                for (let tab of this.editableTabs) {
                    //关掉所有标签页
                    this.handleTabsEdit(tab.name, "remove");
                }
                let inputObj = document.createElement("input");
                inputObj.type = "file";
                inputObj.accept = "json";
                let solutionJson = null;
                inputObj.onchange = () => {
                    let file = inputObj.files[0];
                    let reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = () => {
                        solutionJson = JSON.parse(reader.result);
                        //console.log(solutionJson); // 读取json
                        //遍历JSON
                        for(let singleLogicflow of solutionJson.contents){
                            this.handleTabsEdit("", "add", singleLogicflow.content,singleLogicflow.name)
                        }
                    };
                };
                inputObj.click();
                //循环：打开标签页
                //关掉触发器
                this.$store.commit("openSolutionEvent", false);
            }
        },
        saveSolutionTrigger(newValue){
            if(newValue){
                //逻辑
                let lfs=[]
                //得到每个标签页的流程图内容
                for(let index in this.$refs.lfComponent){
                    lfs.push({
                        name:this.editableTabs[index].tabName,
                        content:this.$refs.lfComponent[index].lfData
                    })
                }
                let text={
                    name:"sln",
                    contents:lfs
                }

                let element = document.createElement("a")
                element.setAttribute(
                    "href",
                    "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(text))
                )
                element.setAttribute("download", "solution.json")

                element.style.display = "none"
                document.body.appendChild(element)

                element.click()

                document.body.removeChild(element)
                //关掉触发器
                this.$store.commit("saveSolutionEvent", false);
            }

        }
    },

    methods: {
        changeTabName(data) {
            this.editableTabs[data.index].tabName = data.tabName;
        },
        handleTabsEdit(targetName, action, singleJSON={},tabName="lf") {
            if (action === "add") {
                const newTabName = `${++this.tabIndex}`;
                this.editableTabs.push({
                    title: "logicFlow" + this.tabIndex,
                    name: newTabName,
                    index: this.editableTabs.length,
                    tabName: tabName,
                    initLF:singleJSON
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

    },
    mounted() {},
};
</script>
<style scoped>
.demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}

.el-tabs.el-tabs--top.el-tabs--card.demo-tabs {
    height: 100%;
}

.el-tab-pane {
    height: 100%;
}
</style>