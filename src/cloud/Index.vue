<template>
    <div>
      <div class="header">
        <el-container>
          <el-header>
            <el-row>
              <el-col :span="4">
                <div class="logo">
                  <span>文件服务器</span>
                </div>
              </el-col>
              <el-col :span="20">
                <el-menu  class="menu" mode="horizontal">
                  <el-menu-item index="1" @click="returnto">
                    <span>返回流程图界面</span>
                  </el-menu-item>
                  <el-menu-item index="2" @click="fullScreen">
                    <span>全屏</span>
                  </el-menu-item>
                  <el-sub-menu index="3">
                    <template #title>
                      <span v-if="username">{{ username }}</span>
                    </template>
                    <el-menu-item index="3-1" @click="logout">
                      <i class="el-icon-switch-button"></i>
                      <span>退出</span>
                    </el-menu-item>
                  </el-sub-menu>
                </el-menu>
              </el-col>
            </el-row>
          </el-header>
        </el-container>
      </div>
  
      <el-container class="main">
        <el-header>
          <div class="btnDiv">
            <el-button v-permission="'上传'" type="primary" size="small" @click="showUpload">文件上传</el-button>
            <el-button v-permission="'下载'" type="primary" size="small"  @click="showlicense"  >license管理</el-button>
            <el-button v-permission="'下载'" type="primary" size="small"  @click="showDownload"  >下载文件</el-button>
            <el-button v-permission="'删除'" type="primary" size="small"  @click="showUserManage"  >用户管理</el-button>
          </div>
        </el-header>
        
        <el-main>
          <hr>

        

          <!-- <el-tree
          ref="treeRef"
          :data="options"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :props="defaultProps"
        /> -->

        <component :is="component" :options="options" :openLicenseDialog="openLicenseDialog" :getCheckedNodes="getCheckedNodes" 
        :getCheckedNodesJson="getCheckedNodesJson" :getCheckedNodesDelete="getCheckedNodesDelete" :resetChecked="resetChecked" :username="username"></component>



        <!--<div class="buttons">
          <el-button v-permission="'下载'" type="primary" size="small" icon="el-icon-download" @click="openLicenseDialog"  id="dirDilaog">创建License</el-button>
          <el-button v-permission="'下载'" type="primary" size="small" icon="el-icon-download" @click="getCheckedNodes"  id="dirDilaog">下载文件</el-button>
          <el-button v-permission="'下载'" type="primary" size="small" icon="el-icon-download" @click="getCheckedNodesJson"  id="dirDilaog">下载json文件</el-button>
          <el-button v-permission="'删除'" type="primary" size="small" icon="el-icon-download" @click="getCheckedNodesDelete"  id="dirDilaog">删除文件</el-button>
          <el-button type="primary" size="small" icon="el-icon-download" @click="resetChecked">reset</el-button>
        </div>-->


        <!--<el-dialog v-model="showLicenseDialog" title="创建License" @close="resetLicenseForm">
          <el-form ref="licenseForm" :model="licenseForm" label-width="100px">
            <el-form-item >
              <el-input v-model="licenseForm.num" placeholder="请输入License的num"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getCheckedLicense">创建License</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>-->
          <!-- <div class="file-list">
            <ul>
            <li v-for="algorithm in algorithms" :key="algorithm.id">
              <el-dropdown>
                <el-button type="primary">
                  {{ algorithm.procedurename }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="downloadAlgorithm(algorithm.procedurename)">下载文件</el-dropdown-item>
                    <el-dropdown-item @click="downloadjson(algorithm.procedurename)">下载json文件</el-dropdown-item>
                    <el-dropdown-item @click="deleteFile(algorithm.id)">删除文件</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </li>
            </ul>
            
          </div>-->

        </el-main>
        <!-- 这是一个注释 
        <div class="m-4">
          <el-cascader v-model="value" :options="options" @change="handleChange" :show-all-levels="false">
            <template v-slot="{ node, data }">
              <span v-if="node.level !== options.length">{{ node.label }}</span>
              <el-button v-else @click="handleButtonClick(data)">{{ node.label }}</el-button>
            </template>
          </el-cascader>
        </div>-->

        
      </el-container>

      

      

    </div>

  
</template>

<script src="./js/Index.js">



  

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
}

/* 头部样式 */
.header {
  height: 80px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.logo img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.menu {
  display: flex;
  justify-content: flex-end;
  height: 100%;
}

.menu .el-menu-item:nth-child(2) {
  margin-left: 20px; /* Adjust the margin as per your preference */
}

/* 主体样式 */
.main {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  padding: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
}

.btnDiv {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.file-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.file-list li {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.file-list li:last-child {
  border-bottom: none;
}

.file-list li span {
  margin-left: 10px;
  font-weight: bold;
  color: #333;
}

.file-list li .el-icon-delete {
  margin-left: auto;
  cursor: pointer;
}



.file-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
}



.file-upload button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

.file-upload button:hover {
  background-color: #0056b3;
}

.file-download button {
  padding: 8px 16px;
  background-color: #17a2b8;
  color: #fff;
  border: none;
  cursor: pointer;
}

.file-download button:hover {
  background-color: #117a8b;
}

.disabled {
  opacity: 0.5; /* Adjust the opacity to visually indicate disabled state */
  cursor: not-allowed; /* Change cursor to not-allowed when disabled */
}




</style>