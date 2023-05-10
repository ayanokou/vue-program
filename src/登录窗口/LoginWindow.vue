<template>

    <div class="common-layout">
        <el-container>
            <el-aside class="login-aside" width="50%">
            </el-aside>
            <el-main class="login-main">
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
                        <el-link @click.native="gotoReg" target="_blank" >注册账号</el-link>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" native-type="submit">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import axiosInstance from '../axios';
import ClipboardJS from 'clipboard';
import router from '../sys/router';
import {onLoginBtnClick } from './js/login';

export default {
  data() {
    return {
      loginForm:{
        username: '',
        password: '',
        code: '',
        rememberMe: ''
      },
      
    }
  },
  methods: {
    submitForm() {
      
      console.log(this.loginForm);
      console.log(this.loginForm.username);
      // Use axios to make a login request with the data stored in the component's data properties
      axiosInstance.post('/login', {
          username: this.loginForm.username,
          password: this.loginForm.password,
          code: this.loginForm.code,
          rememberMe: this.loginForm.rememberMe
      })
        .then(response => {
          sessionStorage.setItem('userInfo', JSON.stringify(response.data));
          console.log(JSON.parse(sessionStorage.getItem('userInfo')).username);
          
          this.$message({
            message: '登录成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              router.push('/Index');
            }
          });
        })
        .catch(error => {
          console.error(error);
          this.$message.error('登录失败，请重试');
        });
    },
   /* refreshCaptcha() {
      $('img.login-captcha').attr('src', 'captcha?' + Math.random());
    },*/
    gotoReg() {
      this.$router.push('/reg');
    }
  },
  mounted() {
    // Use ClipboardJS to copy text to clipboard
    new ClipboardJS('.copy-btn');
  },
};

</script>

<style>
    .common-layout {
        height: 100%;
    }

    .el-container {
        height: 100%;
    }

    .user-login {
        position: relative;
        top: 20%;
        text-align: center;
    }

    .login-aside {
        background-image: url(img/login_left.png);
        background-repeat: no-repeat;

        background-size: 50% 100%;
        background-attachment: fixed
    }

    .login-main {
        background-color: rgb(6, 6, 53);
    }
</style>