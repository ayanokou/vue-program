import { ref } from 'vue'

let tabIndex = 1
const editableTabsValue = ref('1')
const editableTabs = ref([
    {
        title: '流程 1',
        name: '1',
        content: `<iframe src='#/userLF' width='100%' height="800px"></iframe>`,
    }
])

const handleTabsEdit = (targetName, action) => {
    if (action === 'add') {
        const newTabName = `${++tabIndex}`
        editableTabs.value.push({
            title: '流程 '+tabIndex,
            name: newTabName,
            content: `<iframe src='#/userLF' width='100%' height='800px'></iframe>`
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

//iframe自适应高度
const iframeHeight = ref(0)
iframeHeight.value = window.innerHeight - 80 - 102+50
function dynamicIframeHeight(){
    iframeHeight.value = window.innerHeight - 80 - 102+50
}


export { tabIndex, editableTabsValue, editableTabs, handleTabsEdit,dynamicIframeHeight,iframeHeight}