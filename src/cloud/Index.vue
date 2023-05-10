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
                  <el-menu-item index="1" @click="fullScreen">
                    <span>全屏</span>
                  </el-menu-item>
                  <el-sub-menu index="2">
                    <template #title>
                      <span v-if="username">{{ username }}</span>
                    </template>
                    <el-menu-item index="2-1" @click="logout">
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
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path:'/'}">{{  }}</el-breadcrumb-item>
          </el-breadcrumb>
        </el-header>
        <el-main>
          <div class="btnDiv">
            <input type="file" @change="handleFileChange" />
            <el-select v-model="algorithmType" placeholder="选择算法类型">
              <el-option label="滤波" value="filter"></el-option>
              <el-option label="高斯" value="gauss"></el-option>
              <el-option label="形态学" value="morphology"></el-option>
              <el-option v-if="!customAlgorithm" label="自定义算法" value="__CUSTOM__"></el-option>
              <el-option v-if="customAlgorithm" label="确定" value="__APPLY__"></el-option>
            </el-select>

            <el-input v-if="customAlgorithm" v-model="customAlgorithmType" placeholder="输入自定义算法类型"></el-input>
            <el-button v-if="customAlgorithm" type="primary" @click="applyCustomAlgorithm">确定</el-button>
            
            <el-button v-if="userRole === 'admin'" type="primary" size="small" icon="el-icon-upload" @click="uploadFile" >上传文件</el-button>
            <el-button type="primary" size="small" icon="el-icon-download" @click="downloadFile"  id="dirDilaog">下载文件</el-button>
            <el-button type="primary" size="small" icon="el-icon-user" @click="showUserManageDialog"  id="userManage">用户管理</el-button>
          </div>
          <hr>
          <div class="file-list">
            <ul>
            <li v-for="algorithm in algorithms" :key="algorithm.id">
              <a href="#/Index" @click="downloadAlgorithm(algorithm.procedurename)">
                {{ algorithm.procedurename }}
              </a>
            </li>
          </ul>
          </div>
        </el-main>
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

.menu-item {
  display: flex;
  align-items: center;
  margin-left: 20px;
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




</style>