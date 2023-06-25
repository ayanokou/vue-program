<template>
    <el-form label-position="top">
                <el-form-item label="lfProperties">
                  <el-input v-model="lfProperties.name" placeholder="名称"></el-input>
                  <el-select v-model="algorithmType" placeholder="选择算法类型">
                    <el-option label="滤波" value="filter"></el-option>
                    <el-option label="高斯" value="gauss"></el-option>
                    <el-option label="形态学" value="morphology"></el-option>
                    <el-option v-if="!customAlgorithm" label="自定义算法" value="__CUSTOM__"></el-option>
                    <el-option v-if="customAlgorithm" label="确定" value="__APPLY__"></el-option>
                  </el-select>
                  <el-input v-if="customAlgorithm" v-model="customAlgorithmType" placeholder="输入自定义算法类型"></el-input>
                  <el-button v-if="customAlgorithm" type="primary" @click="applyCustomAlgorithm">确定</el-button>
                  <el-input v-model="lfProperties.type" placeholder="类型"></el-input>
                  <el-input v-model="lfProperties.text" placeholder="文本"></el-input>
                  <el-input v-model="lfProperties.label" placeholder="标签"></el-input>
                </el-form-item>

                <el-form-item label="properties">
                  <el-input v-model="properties.dllPath" placeholder="DLL路径"></el-input>
                  <el-input v-model="properties.modelID" placeholder="模型ID"></el-input>
                  <el-form-item label="inPara">
                  <div v-for="(parameter, index) in properties.inPara" :key="index">
                    <el-input v-model="parameter.varName" placeholder="变量名称"></el-input>
                    <el-input v-model="parameter.varType" placeholder="变量类型"></el-input>
                  </div>
                  <el-button @click="addInParaField">添加inPara</el-button>
                </el-form-item>
                  <el-form-item label="outPara">
                    <div v-for="(parameter, index) in properties.outPara" :key="index">
                      <el-input v-model="parameter.varName" placeholder="变量名称"></el-input>
                      <el-input v-model="parameter.varType" placeholder="变量类型"></el-input>
                      <!-- Add more input fields for other properties of outPara -->
                    </div>
                  </el-form-item>
                </el-form-item>

                <el-form-item>
                  <el-button  type="primary" @click="uploadFile">{{ a }}</el-button>
                  <input type="file" @change="handleFileChange" />
                </el-form-item>
    
              </el-form>
</template>

<script >
export default {
  data() {
    return{
        lfProperties: {
        name: '',
        type: '',
        text: '',
        label: '',
      },
      properties: {
        dllPath: '',
        modelID: '',
        inPara: [
          {
            varName: '',
            varType: '',
            // Add more properties for inPara as needed
          },
        ],
        outPara: [
          {
            varName: '',
            varType: '',
            // Add more properties for outPara as needed
          },
        ],
      },

    }
  }
}

</script>