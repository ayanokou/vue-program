import axios from 'axios';
import router from '../../sys/router'

export default {  //指定默认输出
  data() {
    return {
      account: '', // 用户输入的账号
      password: '', // 用户输入的密码
    };
  },
  methods: {
    login() {

      axios.post('http://localhost:8080/login', {   //发送post请求
        username: this.account,
        password: this.password,
      })
      .then(response => {
        const userInfo = {
          username: this.account,
          password: this.password,
        };
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo)); // 保存数据

      
        
        this.$message({  //登录成功
          message: '登录成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            router.push('/main'); //路由跳转导航，返回到main
          }
        });
      })
      .catch(error => {  //登录失败
        console.error(error);
        this.$message.error('登录失败，请重试');
      });

      // //for dev
      //   const userInfo = {
      //     username: this.account,
      //     password: this.password,
      //   };
      //   sessionStorage.setItem('userInfo', JSON.stringify(userInfo));

      
        
      //   this.$message({
      //     message: '登录成功',
      //     type: 'success',
      //     duration: 1500,
      //     onClose: () => {
      //       router.push('/main');
      //     }
      //   });
      // //for dev/


      router.push('/main');
      
    },
  },
};