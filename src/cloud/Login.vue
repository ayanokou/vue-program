<template>
    <div class="login-wrapper">
      <el-form ref="form" :model="loginForm" label-width="80px" @submit.native.prevent="submitForm">
        <h2>FS 文件管理用户登录</h2>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入登录账号" autocomplete="off"
                     :rules="[{ required: true, message: '请输入登录账号', trigger: 'blur' }]">
            <i slot="prefix" class="el-input__icon el-icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入登录密码" type="password"
                     :rules="[{ required: true, message: '请输入登录密码', trigger: 'blur' }]">
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" placeholder="请输入验证码" autocomplete="off"
                     :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]">
            <i slot="prefix" class="el-input__icon el-icon-picture"></i>
          </el-input>
          <img class="login-captcha" alt="">
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
          <el-link @click.native="gotoAbout" target="_blank" >注册账号</el-link>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script src="./js/Login.js">

  </script>
  
  <style scoped>
  .login-wrapper {
      background-image: url("../assets/img/bg-login3.png");
      background-repeat: no-repeat;
      background-size: cover;
      min-height: 100vh;
  }
  
  .login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    
  }
  
  .el-form {
    width: 400px;
    padding: 40px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  h2 {
    margin-bottom: 20px;
    font-size: 20px;
    text-align: center;
  }
  
  .el-form-item {
    margin-bottom: 20px;
  }
  
  .el-input {
    width: 100%;
  }
  
  .el-input__icon {
    color: #c0c4cc;
  }
  
  .el-button {
    width: 100%;
  }
  
  .el-link {
    float: right;
  }
  
  </style>