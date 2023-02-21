<template>
    <el-tabs v-model="editableTabsValue" type="card" editable class="demo-tabs" @edit="handleTabsEdit">
        <el-tab-pane v-for="item in editableTabs" :key="item.name" :name="item.name">
            <template #label>
                {{ item.title }}
                <el-button icon="pointer" @click="getGeometry(item.name)">开始</el-button>
                <el-button icon="finished">结束</el-button>
            </template>

            <iframe src='#/logicFlow' ref="mapFrame" width='100%' :height="iframeHeight + 'px'" scrolling="no"></iframe>

        </el-tab-pane>
        <!-- <ToolBar></ToolBar> -->
    </el-tabs>

</template>


<!--<script setup>-->

<!--import { editableTabsValue, editableTabs, handleTabsEdit, iframeHeight, dynamicIframeHeight } from './js/FlowArea'-->

<!--import emitter from '../sys/emiter.js'-->

<!--//iframe自适应高度-->
<!--window.addEventListener('resize', dynamicIframeHeight)-->

<!--/**接受userLf iframe发送来的数据， 并且用emitter发射到resultArea组件*/-->
<!--window.addEventListener('message', (event) => {-->
<!--    if (event.data.nodeHelpMsg) /*添加判断是因为这个监听似乎会执行很多次*/ {-->
<!--        emitter.emit("refresh_help_msg", event.data.nodeHelpMsg)-->
<!--        emitter.emit("refresh_tableData_msg", { "newResult": "a new result", "globalVariable": "a global variable" })-->
<!--    }-->
<!--    if(event.data.imgBase64){-->
<!--        //更新imgBase64的值-->

<!--    }-->
<!--})-->
<!--// /**接受iframe发送来的数据 */-->
<!--// window.addEventListener('message', handleMessage)-->
<!--// function handleMessage (event) {-->
<!--//     // 根据上面制定的结构来解析iframe内部发回来的数据-->
<!--//     const data = event.data-->
<!--//     switch (data.cmd) {-->
<!--//       case 'returnFormJson':-->
<!--//         console.log("returnFormJson")-->
<!--//         emitter.emit("msg", data.params.helpMsg)-->
<!--//         break-->
<!--//       case 'returnHeight':-->
<!--//         // 业务逻辑-->
<!--//         console.log("returnHeight")-->
<!--//         emitter.emit("msg", data.params.helpMsg)-->
<!--//         break-->
<!--//     }-->
<!--// }-->


<!--function getGeometry(id) {-->
<!--    //给子iframe传数据-->
<!--    window.frames[0].postMessage(id-1)-->
<!--}-->
<!--</script>-->

<script>
import { mapState } from 'vuex'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {mapMutations} from "vuex";

export default {
    setup() {
        let tabIndex = 1
        const editableTabsValue = ref('1')
        const editableTabs = ref([
            {
                title: '流程 1',
                name: '1',
                content: `<iframe src='#/userLF' width='100%' height="800px"></iframe>`,
            },
        ])

        const handleTabsEdit = (targetName, action) => {
            if (action === 'add') {
                const newTabName = `${++tabIndex}`
                editableTabs.value.push({
                    title: '流程 ' + tabIndex,
                    name: newTabName,
                    content: `<iframe src='#/userLF' width='100%' height='800px'></iframe>`,
                })
                editableTabsValue.value = newTabName
            } else if (action === 'remove') {
                const tabs = editableTabs.value
                let activeName = editableTabsValue.value
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

                editableTabsValue.value = activeName
                editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
            }
        }

        const iframeHeight = ref(0)

        const dynamicIframeHeight = () => {
            iframeHeight.value = window.innerHeight - 80 - 102 + 50
        }

        onMounted(() => {
            dynamicIframeHeight()
            window.addEventListener('resize', dynamicIframeHeight)
        })

        onBeforeUnmount(() => {
            window.removeEventListener('resize', dynamicIframeHeight)
        })

        return {
            tabIndex,
            editableTabsValue,
            editableTabs,
            handleTabsEdit,
            iframeHeight,
        }
    },
    data(){
        return {

        }
    },
    methods:{
        getGeometry(id) {
            //给子iframe传数据
            window.frames[0].postMessage(id-1)
        },

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