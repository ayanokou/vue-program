<template>
    <el-dialog title="帮助" :model-value="isVisible" @close="$emit('update:isVisible', false)">
        <el-tabs tab-position="left">
            <el-tab-pane label="帮助1">
            </el-tab-pane>
            <el-tab-pane label="帮助1">
            </el-tab-pane>
            <el-tab-pane label="帮助1">
            </el-tab-pane>
            <el-tab-pane label="帮助1">
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script>
export default {
    props:['isVisible'],
    emits:['update:isVisible'],
    data(){
        return {}
    }
}
</script>

<style>
</style>