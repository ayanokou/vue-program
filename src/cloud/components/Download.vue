<template>
    <div>
      <h1>License List</h1>
      <ul>
        <li v-for="(license, licensenum) in licenses" :key="licensenum">
          License Number {{ licensenum }} - {{ license.description }}
          <ul>
            <li v-for="filename in license.files" :key="filename">{{ filename }}</li>
          </ul>
          <el-button type="primary" size="small" icon="el-icon-download" @click="downloadLicense(license.files)">Download</el-button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axiosInstance from '../../axios';
  
  export default {
    data() {
      return {
        licenses: {}, // 存储获取到的许可证信息
      };
    },
    mounted() {
      // 从数据库获取许可证信息（你需要自己实现）
      this.fetchLicenses();
    },
    methods: {
      fetchLicenses() {
        // 模拟从数据库获取许可证信息的 API 调用
        // 用实际的 API 调用替换这里的代码
        const databaseData = [
          [1, 1, 'sobel.txt', 'a'],
          [2, 1, 'gauss.txt', 'a'],
          [3, 2, 'sobel.txt', 'b'],
          [4, 2, 'gauss.txt', 'b'],
          [5, 3, 'sobel.txt', 'c'],
          [6, 3, 'gauss.txt', 'c'],
        ];
  
        // 对数据进行处理，获取每个唯一许可证号对应的文件名列表和描述
        databaseData.forEach(([id, licensenum, filename, description]) => {
          if (this.licenses[licensenum]) {
            this.licenses[licensenum].files.push(filename);
          } else {
            this.licenses[licensenum] = {
              files: [filename],
              description: description,
            };
          }
        });
      },
      downloadLicense(files) {
        // 处理下载许可证的逻辑
        console.log('Download license', files);
        files.forEach(filename => {
        this.downloadAlgorithm(filename);
      });
        // 在这里实现下载许可证的操作
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
    },
  };
  </script>
  