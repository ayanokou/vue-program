<template>
    <el-upload  ref="test" action="#" list-type="picture-card" :auto-upload="false">
        <el-icon><Plus /></el-icon>

        <template #file="{ file }">
            <div>
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-select"
              @click="selectAndRun(file)"
          >
            <el-icon><CaretRight /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
            </div>
        </template>
    </el-upload>
    <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
</template>



<script>



import {mapState} from "vuex";

export default {
    data(){
        return{
            dialogImageUrl:'',
            dialogVisible:false,
            disabled:false
        }
    },
    computed:{
        ...mapState(['localImg'])
    },
    methods:{
        handleRemove(file) {
            this.$refs.test.handleRemove(file)
            console.log(file)
        },
        handlePictureCardPreview(file){
            this.dialogImageUrl = file.url
            this.dialogVisible= true
        },
        selectAndRun(file){
            //标识你选择的图像
            //将图片数据传入json中并运行流程
            const img=new Image()
            img.src=file.url
            img.onload=()=>{
                let canvas=document.createElement('canvas')
                canvas.width=img.width
                canvas.height=img.height
                let ctx=canvas.getContext('2d')
                ctx.drawImage(img,0,0,img.width,img.height)
                let base64Data=canvas.toDataURL('image/png')

                this.$store.commit('setLocalImg',base64Data)
            }
        }
    },

}
</script>