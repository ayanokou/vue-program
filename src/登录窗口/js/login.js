import axios from 'axios';
import router from '../../sys/router'

export default {
  data() {
    return {
      account: '', // 用户输入的账号
      password: '', // 用户输入的密码
    };
  },
  methods: {
    login() {

      axios.post('http://localhost:8080/login', {
        username: this.account,
        password: this.password,
      })
      .then(response => {
        const userInfo = {
          username: this.account,
          password: this.password,
        };
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));

      
        
        this.$message({
          message: '登录成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            router.push('/main');
          }
        });
      })
      .catch(error => {
        console.error(error);
        this.$message.error('登录失败，请重试');
      });
      
    },
  },
};