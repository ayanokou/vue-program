<template>
    <div class="login-wrapper">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="login-form">
        <h2>用户注册</h2>
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入登录账号"></el-input>
        </el-form-item>
        <el-form-item prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入登录密码"></el-input>
        </el-form-item>
        <el-form-item prop="password2">
          <el-input type="password" v-model="form.password2" placeholder="请再次输入登录密码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
          <img class="login-captcha" alt="" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">注册</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-link @click.native="gotohome" target="_blank" class="login-link">返回登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script src="./js/reg.js">
 
  </script>
  
  <style scoped>
  .login-form {
    max-width: 400px;
    margin: 0 auto;
    margin-top: 100px;
  }
  
  .el-link {
    float: right;
  }
  </style>