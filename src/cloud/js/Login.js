import axiosInstance from '../../axios';
import ClipboardJS from 'clipboard';
import router from '../../sys/router';



export default {  //指定默认输出
  data() {
    return {
      loginForm:{
        username: '',    //用户名
        password: '',    //密码
        code: '',        //验证码
        rememberMe: ''   //记住密码
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
    gotoAbout() {
      this.$router.push('/about');
    }
  },
  mounted() {
    // Use ClipboardJS to copy text to clipboard
    new ClipboardJS('.copy-btn');
  },
};
