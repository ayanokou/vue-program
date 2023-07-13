import userData from '../login.json'; // 导入用户数据 JSON 文件
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
      // 遍历用户数据
      for (const user of userData.users) {
        if (user.username === this.account && user.password === this.password) {
          // 登录成功逻辑
          console.log('登录成功');
          const userInfo = {
            username: user.username,
            password: user.password
          };
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
          router.push('/main');
          return;
          ;
        }
      }
      // 登录失败逻辑
      console.log('登录失败');
    },
  },
};