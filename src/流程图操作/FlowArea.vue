<template>
    <el-tabs v-model="editableTabsValue" type="card" editable class="demo-tabs" @edit="handleTabsEdit">
        <el-tab-pane v-for="item in editableTabs" :key="item.name" :name="item.name">
            <template #label>
                {{ item.tabName }}
                <el-button icon="pointer">开始</el-button>
                <el-button icon="finished">结束</el-button>
            </template>
            <LogicFlow :tabName="item.title" @changeTabName="changeTabName">
                <div :id="item.title"></div>
            </LogicFlow>
<!--            <iframe src='#/logicFlow' width='100%' :height="iframeHeight + 'px'" scrolling="no"></iframe>-->
        </el-tab-pane>
    </el-tabs>

</template>


<script>
import {mapState} from "vuex";
import LogicFlow from "./components/LogicFlow.vue"
export default {
    components:{
      LogicFlow
    },
    data(){
        return {
            tabIndex:1,
            //当前显示的标签页
            editableTabsValue:'1',
            editableTabs : [
                {
                    title: 'logicFlow1',//作为标签id
                    name: '1',//作为标签页名
                    index:0,//标签页下标
                    tabName:'lf1'
                },
            ]
        }
    },
    methods:{
        changeTabName(data){
            this.editableTabs[0].tabName=data
        },
        handleTabsEdit(targetName, action) {
            if (action === 'add') {
                const newTabName = `${++this.tabIndex}`
                this.editableTabs.push({
                    title: 'logicFlow' + this.tabIndex,
                    name: newTabName,
                    index: this.editableTabs.length,
                    tabName:'lf'+this.tabIndex
                })
                this.editableTabsValue = newTabName
            } else if (action === 'remove') {
                const tabs = this.editableTabs
                let activeName = this.editableTabsValue
                console.log('activeName:',activeName)
                console.log('targetName:',targetName)
                //更新如果当前activeName被删除，需要重新定位activeName
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            const nextTab = tabs[index + 1] || tabs[index - 1]
                            if (nextTab) {
                                activeName = nextTab.name
                            }
                        }
                    })
                }

                this.editableTabsValue = activeName
                //将删掉的目标标签页过滤掉
                this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
                //重新排序
                this.editableTabs.forEach((tab,index)=>{
                    tab.index=index
                })
            }
            console.log(this.editableTabs)
        }
    },
    mounted() {

    }
}
</script>
<style scoped>

.demo-tabs>.el-tabs__content {
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