import axiosInstance from '../../axios';
import { saveAs } from 'file-saver';
import jsonData from '../newOperatorLib.json';
import { ref } from 'vue'
import { ElTree } from 'element-plus'
import Download from '../components/Download.vue'
import License from '../components/License.vue'
import Upload from '../components/Upload.vue'
import UserManage from '../components/UserManage.vue'
import router from '../../sys/router';



const value = ref([])

const handleChange = (value) => {
  console.log(value)
}

const handleButtonClick = (data) => {
  // Handle button click event
  console.log('Button clicked:', data);
};



const treeRef = ref(null)



export default {
  component:{
    Download,
    Upload,
    License,
    UserManage,
  },

  data() {
    return {
      showLicenseDialog: false,
      licenseForm: {
        num: ''
      },
      value: [],// 存储级联选择器的值
      handleChange,
      handleButtonClick,
      optionsData: jsonData,
      fileAttributes:[],
      showFileAttributesDialog: false,
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
      file: null,
      algorithmType: null,
      algorithms: [],
      userRole:'',
      username:'',
      customAlgorithm: false,
      customAlgorithmType: '',
      component:Upload
    };
  },

  computed: {
    options() {
      return this.transformOptions(this.optionsData);
    }
  },

  
  created() {
    this.username = JSON.parse(sessionStorage.getItem('userInfo')).username;
    console.log('ssssss'+this.username)
    this.userRole = JSON.parse(sessionStorage.getItem('userInfo')).role;
    console.log('ssssss'+this.userRole)
  
  },
  

  mounted() {
    axiosInstance.get('/algorithms')
      .then((response) => {
        this.algorithms = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },

  watch: {
  algorithmType(val) {
    if (val === '__CUSTOM__') {
      this.customAlgorithm = true;
    }
  },
 },
    
  methods: {
    returnto(){
      router.push('/main');


    },
    showUpload(){
      this.component = Upload
    },
    showlicense(){
      this.component = License
    },
    showDownload(){
      this.component = Download
    },
    showUserManage(){
      this.component = UserManage;
    },
    
    createLicense() {
      // 在这里处理创建License的逻辑，使用 this.licenseForm.num 获取输入的License的num
      // 然后可以调用相应的方法将License创建到数据库中
      // 完成后关闭对话框
      this.showLicenseDialog = false;
    },


    
    transformOptions(data) {
      const options = [];

      // 遍历每个分类
      for (const category in data) {
        const categoryData = {
          id: category,
          label: category,
          children: []
        };

        // 遍历每个模型
        for (const model of data[category]) {
          const modelData = {
            id: model.lfProperties.name,
            label: model.lfProperties.text,
            children: []
          };

          // 遍历每个参数
          for (const parameter of model.properties.models) {
            console.log(parameter.modelName);
            modelData.children.push({
              id: parameter.modelName,
              label: parameter.modelName
            });
          }

          categoryData.children.push(modelData);
        }

        options.push(categoryData);
      }
      console.log(options);
      return options;
    },

    addInParaField() {
      this.properties.inPara.push({
        varName: '',
        varType: '',
      });
    },
    saveFileAttributes() {
      // 首先进行表单验证，确保必填字段已填写完整
      if (this.validateForm()) {
        // 执行保存逻辑，将文件属性数据提交到后端或进行其他操作
        this.fileAttributes = {
          lfProperties: this.lfProperties,
          properties: this.properties,
        };
    
      }
    },
    
    validateForm() {
      // 表单验证逻辑，检查必填字段是否填写完整
      // 可以根据需要进行具体的验证规则和错误提示
      if (!this.lfProperties.name || !this.lfProperties.type || !this.lfProperties.text || !this.lfProperties.label) {
        // 如果lfProperties字段有任何一个必填字段为空，则返回false表示验证失败
        console.log('lfProperties字段必填项未填写完整');
        return false;
      }
    
      for (const parameter of this.properties.inPara) {
        if (!parameter.varName || !parameter.varType) {
          // 如果inPara字段的任何一个必填字段为空，则返回false表示验证失败
          console.log('inPara字段必填项未填写完整');
          return false;
        }
      }
    
      // 所有必填字段都填写完整，返回true表示验证通过
      return true;
    },

    applyCustomAlgorithm() {
    // 判断自定义算法类型是否为空
    if (this.customAlgorithmType.trim() === '') {
      this.$message.error('自定义算法类型不能为空');
      return;
    }

    // 将 customAlgorithmType 设为 algorithmType
    this.algorithmType = this.customAlgorithmType;
    this.customAlgorithm = false;
    this.customAlgorithmType = '';
  },

    fullScreen(){},
    logout(){
      axiosInstance.get('/logout')
        .then(response => {
          this.$message({
            message: '退出成功',
            type: 'success',
            duration: 1500,
          });
          sessionStorage.clear();
        })
        .catch(error => {
          console.error(error);
        });
      //sessionStorage.clear();
      
    
    },
  
    
    handleFileChange(event) {
      this.file = event.target.files[0];
    },
    /*uploadFile() {
      localStorage.setItem('file','abc123')
      const fileData = localStorage.getItem('file');
      // 将文件数据转换为Blob对象
      const blob = new Blob([fileData], { type: 'application/octet-stream' });
      // 创建File对象，并将其赋值给this.file
      this.file = new File([blob], 'File.txt');
      const formData = new FormData();
      var algorithmType = this.algorithmType;
      formData.append('file', this.file);
      formData.append('algorithmType', algorithmType)

      // 发起文件上传请求
      axiosInstance.post('/upload', formData)
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    },*/
    
    uploadFile() {
        // 执行保存逻辑，将文件属性数据提交到后端或进行其他操作

        const formData = new FormData();
        var algorithmType = this.algorithmType;
        const fileAttributesString = JSON.stringify(this.fileAttributes);
        formData.append('file', this.file);
        formData.append('algorithmType', algorithmType)
        formData.append('fileAttributes',fileAttributesString)

        // 发起文件上传请求
        axiosInstance.post('/upload', formData)
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error(error);
          });
    },

    

    downloadFile() {
      var fileName = this.file.name; // 要下载的文件名
      console.log(fileName);
      
      // 发起文件下载请求
      axiosInstance.get(`/download/${fileName}`
        
      )
        .then(response => {
          console.log(response.data);
          const blob = new Blob([response.data], { type: 'text/plain' });
      
      // 使用 FileSaver.js 进行文件下载
          saveAs(blob, 'text_file.txt');
          
        })
        .catch(error => {
          console.error(error);
        });
    },

    

   
    },

    
    
}

