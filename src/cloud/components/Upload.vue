<template>
  <div>
    <el-form label-position="top">
      <el-form-item label="选择分类">
        <el-select v-model="selectedCategory" @change="updateSubcategory">
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="category in categories" :value="category" :label="category"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择子分类">
        <el-select v-model="selectedSubcategory">
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="subcategory in subcategories" :value="subcategory.lfProperties.name" :label="subcategory.lfProperties.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="模型名称">
        <el-input v-model="model.modelName" placeholder="模型名称"></el-input>
      </el-form-item>
      <el-form-item label="帮助信息">
        <el-input v-model="model.helpMsg" placeholder="帮助信息"></el-input>
      </el-form-item>
      <el-form-item label="DLL路径">
        <el-input v-model="model.dllPath" placeholder="DLL路径"></el-input>
      </el-form-item>
      <el-form-item label="模型ID">
        <el-input v-model="model.modelID" placeholder="模型ID"></el-input>
      </el-form-item>

      <el-form-item label="输入参数">
        <el-button @click="addInputParameter">添加输入参数</el-button>
        <div v-for="(parameter, index) in model.inPara" :key="index">
          <el-input v-model="parameter.varName" placeholder="变量名称"></el-input>
          <el-input v-model="parameter.varType" placeholder="变量类型"></el-input>
          <!--<el-input v-model="parameter.fromExpression" placeholder=""></el-input>
          <el-input v-model="parameter.defineVarInputWay" placeholder=""></el-input>
          <el-input v-model="parameter.varExplanation" placeholder=""></el-input>-->
        </div>
      </el-form-item>

      <el-form-item label="输出参数">
        <el-button @click="addOutputParameter">添加输出参数</el-button>
        <div v-for="(parameter, index) in model.outPara" :key="index">
          <el-input v-model="parameter.varName" placeholder="变量名称"></el-input>
          <el-input v-model="parameter.varType" placeholder="变量类型"></el-input>
          <el-input v-model="parameter.varExplanation" placeholder="参数说明"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="选择文件">
      <input type="file" ref="fileInput" @change="handleFileChange">
       </el-form-item>

       <el-form-item label="选择json文件">
      <input type="file" ref="jsonfileInput" @change="handlejsonFileChange">
       </el-form-item>
    </el-form>

    <el-button type="primary" @click="submit">提交</el-button>

    <el-button type="primary" @click="submitjson">更新json文件</el-button>
    
  </div>
</template>

<script>
import JsonData from '../newOperatorLib.json';
import axiosInstance from '../../axios';

export default {
  data() {
    return {
      file:'',
      jsonFile:'',
      jsonData : JsonData,
      selectedCategory: '',
      selectedSubcategory: '',
      categories: [],
      subcategories: [],
      model: {
        modelName: '',
        helpMsg: '',
        dllPath: '',
        modelID: '',
        inPara: [
          {
            varName: '',
            varType: '',
            /*fromExpression: '',
            defineVarInputWay: '',
            comboList: {},
            varExplanation: ''*/
          }
        ],
        outPara: [
          {
            varName: '',
            varType: '',
            varExplanation: ''
          }
        ]
      }
    };
  },
  mounted() {
    // 在组件挂载时加载JSON数据
    this.loadJSON();
  },
  methods: {
    handlejsonFileChange(event){
      this.jsonFile = event.target.files[0];

    },
    handleFileChange(event) {
    this.file = event.target.files[0]; // 获取选择的文件对象
    
    },
    submitjson(){
      const formData = new FormData();
      const jsonfileInput = this.$refs.jsonfileInput;
      const file = jsonfileInput.files[0];
      formData.append('file', file);
      axiosInstance.post('/changejson', formData)
        .then(response => {
        // 请求成功处理
          console.log('成功修改json文件');
          this.clearForm();
        })
        .catch(error => {
        // 请求错误处理
          console.error(error);
        });


    },


    submit() {

      const formData = new FormData();
      formData.append('model', JSON.stringify(this.model));
      formData.append('selectedCategory', this.selectedCategory);
      formData.append('selectedSubcategory', this.selectedSubcategory);

      // Get the selected file from the file input element
      const fileInput = this.$refs.fileInput;
      const file = fileInput.files[0];

      // Append the selected file to the FormData
      formData.append('file', file);
      /*const formData = {
        model: this.model,
        selectedCategory: this.selectedCategory,
        selectedSubcategory: this.selectedSubcategory,
        file: this.file  // 将文件对象添加到formData中
      };*/

      axiosInstance.post('/upload', formData)
        .then(response => {
        // 请求成功处理
          console.log(response.data);
          this.clearForm();
        })
        .catch(error => {
        // 请求错误处理
          console.error(error);
        });
    },
    loadJSON() {
      // 使用适当的方法加载您的JSON文件，这里假设您已经获得了JSON数据并将其保存在变量jsonData中
  

      // 提取最外层索引作为下拉选择框的选项
      this.categories = Object.keys(this.jsonData);
    },

    updateSubcategory() {
      // 根据第一个下拉选择框的选项更新第二个下拉选择框的选项
      if (this.selectedCategory) {
        this.subcategories = this.jsonData[this.selectedCategory];
      } else {
        this.subcategories = [];
      }
      this.selectedSubcategory = '';
    },

    addInputParameter() {
      this.model.inPara.push({
        varName: '',
        varType: '',
        fromExpression: '',
        defineVarInputWay: '',
        comboList: {},
        varExplanation: ''
      });
    },
    addOutputParameter() {
      this.model.outPara.push({
        varName: '',
        varType: '',
        varExplanation: ''
      });
    },

    clearForm() {
    this.selectedCategory = '';
    this.selectedSubcategory = '';
    this.model.modelName = '';
    this.model.helpMsg = '';
    this.model.dllPath = '';
    this.model.modelID = '';
    this.model.inPara = [{
      varName: '',
      varType: ''
    }];
    this.model.outPara = [{
      varName: '',
      varType: '',
      varExplanation: ''
    }];
  }
  }
};
</script>

<style scoped>
/* 可选：添加一些样式来美化界面 */
label {
  margin-right: 10px;
}
select {
  margin-bottom: 10px;
}
</style>