<template>
  <div>
    
    <el-input id="license-key" type="text" v-model="licenseKey" placeholder="LicenseKey" />
    <el-button type="primary" @click="submitLicenseKey">Confirm</el-button>
    <el-table :data="tableData" style="width: 100%">

    <el-table-column prop="licenseName" label="license名称" width="180" />
    <el-table-column prop="procedureName" label="文件名" width="180" />
    <el-table-column prop="description" label="描述" />
    <el-table-column fixed="right" label="Operations" width="120">
      <template #default="{ row }">
        <el-button link type="primary" size="small" @click="downloadLicense(row.procedureName)"
          >下载</el-button
        >

      </template>
    </el-table-column>
    </el-table>


    
  </div>
</template>
  
  <script>
  import axiosInstance from '../../axios';
  
  export default {
    data() {
      return {
        licenseKey: '', // 存储获取到的许可证信息
        tableData:[],
      };
    },
    props: ['username'],
    created() {
    // Fetch the table data when the component is created
    this.fetchTableData();
    },

  
    
    methods: {
      fetchTableData() {
      // Make a request to the Spring Boot backend to fetch table data based on the current username
      axiosInstance.get(`/tableData/${this.$props.username}`) // Replace '/tableData' with your actual API endpoint
        .then(response => {
          console.log(response.data);
          const groupedData = {}; // 用于存储按照licensename分组的数据

    response.data.forEach(item => {
      const { licensename, procedurename, description } = item;
      if (!groupedData[licensename]) {
        // 如果该licensename不存在于groupedData中，则创建一个新的数组
        groupedData[licensename] = [];
      }

      // 将数据添加到相应的licensename数组中
      groupedData[licensename].push({ procedureName: procedurename ,Description : description});
    });

    this.tableData = Object.keys(groupedData).map(licensename => ({
      licenseName: licensename,
      procedureName: groupedData[licensename].map(data => data.procedureName),
      description: groupedData[licensename][0].Description,
    }));
        })
        .catch(error => {
          console.error(error);
          // Handle any errors that occur during the request
        });
    },

      submitLicenseKey() {
      console.log(this.licenseKey);
      const formData = {
        licenseKey: this.licenseKey,
        username: this.$props.username // Replace this with your logic to get the current username
      };

      // Send the data to the Spring Boot backend
      axiosInstance .post('/licenseKey', formData)
        .then(response => {
          console.log(response.data);
          this.$router.go(0);
          // Handle the response from the backend
        })
        .catch(error => {
          console.error(error);
          // Handle any errors that occur during the request
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
  