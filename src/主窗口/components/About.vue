<template>
    <el-dialog title="关于" :model-value="isVisible" @close="$emit('update:isVisible', false)">
        <p>关于关于关于关于关于关于关于关于关于关于关于
            关于关于关于关于关于关于关于关于关于关于关于关于关于关
            于关于关于关于关于关于关于关于关于关于关于关于关于关于关于
            关于关于关于关于关于关于关于关于关于关于关于关于</p>
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