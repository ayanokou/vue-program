import axiosInstance from '../../axios';
import { saveAs } from 'file-saver';

export default {
  data() {
    return {
      file: null,
      algorithmType: null,
      algorithms: [],
      userRole:'',
      username:'',
      customAlgorithm: false,
      customAlgorithmType: '',
    };
  },

  
  created() {
    this.username = JSON.parse(sessionStorage.getItem('userInfo')).username;
    console.log('ssssss'+this.username)
    this.userRole = JSON.parse(sessionStorage.getItem('userInfo')).role;
  
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
    showUserManageDialog(){
      this.$router.push('/userManage');
    },
    
    handleFileChange(event) {
      this.file = event.target.files[0];
    },
    uploadFile() {
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
    },
    downloadAlgorithm(procedurename){
      axiosInstance.get(`/download/${procedurename}`
        
      )
        .then(response => {
          console.log(response.data);
          const blob = new Blob([response.data], { type: 'text/plain' });
      
      // 使用 FileSaver.js 进行文件下载
          saveAs(blob, procedurename);
          
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
    }
    }
    
    }

