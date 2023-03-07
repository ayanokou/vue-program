<template>
    <el-tabs v-model="editableTabsValue" type="card" editable class="demo-tabs" @edit="handleTabsEdit">
        <el-tab-pane v-for="item in editableTabs" :key="item.name" :name="item.name">
            <template #label>
                {{ item.title }}
                <el-button icon="pointer" @click="getGeometry(item.name)">开始</el-button>
                <el-button icon="finished">结束</el-button>
            </template>
            <iframe src='#/logicFlow' width='100%' :height="iframeHeight + 'px'" scrolling="no"></iframe>
        </el-tab-pane>
        <!-- <ToolBar></ToolBar> -->
    </el-tabs>

</template>


<script>
export default {
    data(){
        return {
            tabIndex:1,
            //当前显示的标签页
            editableTabsValue:'1',
            editableTabs : [
                {
                    title: '流程 1',
                    name: '1',
                    iframeIndex:0
                },
            ],
            iframeHeight:window.innerHeight - 80 - 102 + 50
        }
    },
    methods:{
        getGeometry(id) {
            //给子iframe传数据
            window.frames[0].postMessage(id-1)
        },
        handleTabsEdit(targetName, action) {
            if (action === 'add') {
                const newTabName = `${++this.tabIndex}`
                this.editableTabs.push({
                    title: '流程 ' + this.tabIndex,
                    name: newTabName,
                    iframeIndex: this.editableTabs.length
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
                    tab.iframeIndex=index
                })
            }
            console.log(this.editableTabs)
        }
    },
    mounted() {
        /**接受userLf iframe发送来的数据， 并且用emitter发射到resultArea组件*/
        window.addEventListener('message', (event) => {
            if (event.data.nodeHelpMsg) /*添加判断是因为这个监听似乎会执行很多次*/ {
            }
            if(event.data.imgBase64){
                //更新imgBase64的值
                let payload=event.data.imgBase64
                this.$store.commit('setImgBase64',payload)
            }
        })
        window.addEventListener('resize', ()=>{
            this.iframeHeight = window.innerHeight - 80 - 102 + 50
        })
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