<template>
    <el-tree
          ref="treeRef"
          :data="options"
          show-checkbox
          node-key="id"
          highlight-current
          :props="defaultProps"
        />
    <el-form ref="licenseForm" :model="licenseForm" label-width="100px">
      <el-form-item>
        <el-input v-model="licenseForm.name" placeholder="请输入License的名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="licenseForm.description" placeholder="请输入License的描述"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="block">
          <el-date-picker
            v-model="licenseForm.validity"
            type="datetime"
            placeholder="选择license的截至日期"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getCheckedLicense">创建License</el-button>
      </el-form-item>
    </el-form>
    <div class="buttons">
        <el-button v-permission="'下载'" type="primary" size="small" icon="el-icon-download" @click="getCheckedNodes"  id="dirDilaog">下载文件</el-button>
        <el-button v-permission="'下载'" type="primary" size="small" icon="el-icon-download" @click="getCheckedNodesJson"  id="dirDilaog">下载json文件</el-button>
        <el-button v-permission="'删除'" type="primary" size="small" icon="el-icon-download" @click="getCheckedNodesDelete"  id="dirDilaog">删除文件</el-button>
        <el-button type="primary" size="small" icon="el-icon-download" @click="resetChecked">reset</el-button>
    </div>
    

    
</template>

<script >
import axiosInstance from '../../axios';

export default {
  data() {
    return {
        showLicenseDialog: false,
        licenseForm: {
        name: '',
        description: '',
        validity:'',
      },

    }
  },
  props: ['options'],
  methods:{
    getCheckedLicense(){
      if (this.$refs.treeRef !== null) {
        const checkedNodes = this.$refs.treeRef.getCheckedNodes(false, false);
        const lastLevelNodes = new Set();
    
        const traverseTree = (nodes) => {
          for (const node of nodes) {
            if (!node.children || node.children.length === 0) {
              lastLevelNodes.add(node);
            } else {
              traverseTree(node.children);
            }
          }
        };

      
    
        traverseTree(checkedNodes);
        console.log(Array.from(lastLevelNodes));


        
        const labels = Array.from(lastLevelNodes).map(node => node.label);
        console.log(labels);
        
        
        // 创建请求体对象，将标签数据作为其中的一个属性
        const requestBody = {
          labels: labels,
          name: this.licenseForm.name,
          description: this.licenseForm.description,
          
          validity:this.licenseForm.validity
        };

        // 发送POST请求到Spring Boot后端
        axiosInstance.post('/license', requestBody)
          .then(response => {
            // 处理成功响应
            console.log(response.data);
            this.$message({
            message: '创建成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
            }
          })
          })
          .catch(error => {
            // 处理错误
            console.error(error);
          });
        
      }


    },
    resetLicenseForm() {
      this.licenseForm.name = '';
      this.licenseForm.description = '';
    },
    openLicenseDialog() {
      this.showLicenseDialog = true;
    },

    getCheckedNodes() {
      if (this.$refs.treeRef !== null) {
        const checkedNodes = this.$refs.treeRef.getCheckedNodes(false, false);
        const lastLevelNodes = new Set();
    
        const traverseTree = (nodes) => {
          for (const node of nodes) {
            if (!node.children || node.children.length === 0) {
              lastLevelNodes.add(node);
            } else {
              traverseTree(node.children);
            }
          }
        };
    
        traverseTree(checkedNodes);
        console.log(Array.from(lastLevelNodes));
        for (const node of lastLevelNodes) {
          this.downloadAlgorithm(node.label);
          
        }
      }
    },

    getCheckedNodesJson(){
      if (this.$refs.treeRef !== null) {
        const checkedNodes = this.$refs.treeRef.getCheckedNodes(false, false);
        const lastLevelNodes = new Set();
    
        const traverseTree = (nodes) => {
          for (const node of nodes) {
            if (!node.children || node.children.length === 0) {
              lastLevelNodes.add(node);
            } else {
              traverseTree(node.children);
            }
          }
        };
    
        traverseTree(checkedNodes);
        console.log(Array.from(lastLevelNodes));
        for (const node of lastLevelNodes) {
          this.downloadjson(node.label);
          
        }
      }

    },

    getCheckedNodesDelete(){
      if (this.$refs.treeRef !== null) {
        const checkedNodes = this.$refs.treeRef.getCheckedNodes(false, false);
        const lastLevelNodes = new Set();
    
        const traverseTree = (nodes) => {
          for (const node of nodes) {
            if (!node.children || node.children.length === 0) {
              lastLevelNodes.add(node);
            } else {
              traverseTree(node.children);
            }
          }
        };

      
    
        traverseTree(checkedNodes);
        console.log(Array.from(lastLevelNodes));
        for (const node of lastLevelNodes) {
          this.deleteFile(node.label);
          
        }
      }
    

    },

    

    resetChecked() {
      if (this.$refs.treeRef !== null) {
        this.$refs.treeRef.setCheckedKeys([], false)
      }
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

    downloadjson(fileName) {
    
    // 发起文件下载请求
    axiosInstance.get(`/downloadjson/${fileName}`
      
    )
      .then(response => {
        console.log(response.data);
        const fileAttributesJson = JSON.stringify(response.data);
        console.log(fileAttributesJson);
        const blob = new Blob([fileAttributesJson], { type: 'application/json' });
    
    // 使用 FileSaver.js 进行文件下载
        saveAs(blob, fileName);
        
        
      })
      .catch(error => {
        console.error(error);
      });
  },

  deleteFile(fileName){
    axiosInstance.post(`/deleteFile/${fileName}`)
      .then(response => {
        console.log("删除成功")
        this.$router.go(0);
      })
      .catch(error => {
        console.error(error);
      });

  }

  }
}
</script>