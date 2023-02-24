<template>
    <el-tabs v-model="activeName" class="demo-tabs" type="border-card">
        <el-tab-pane label="本地" name="first">


                <el-form :model="form" >
                    <el-form-item>
                        <input type="file" id="saveImage" name="myphoto" accept="image/png,image/gif,image/jpeg" ref="imgUrl">
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">确认</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>

        </el-tab-pane>

        <el-tab-pane label="相机" name="second">

        </el-tab-pane>
    </el-tabs>
</template>

<script>

export default {
    data(){
        return {
            activeName:'first'
        }
    },
    methods:{
        onSubmit(){
            alert(1)
            //读取图片
            let Img=this.$refs.imgUrl.files[0]
            let reader=new FileReader()
            reader.readAsDataURL(Img)
            reader.onload=function(){
                //传给父窗口
                window.opener.postMessage({imgBase64:this.result});
                window.close()
            }
        }
    }
}
</script>

<style scoped>
.demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}
</style>