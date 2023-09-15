import axiosInstance from '../../axios';

export default {
  data() {
    return {
      users: [],
    };
  },
  mounted() {
    axiosInstance.post('/user')
      .then(response => {
        this.users = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    deleteUser(id){    //删除用户信息
      axiosInstance.post(`/deleteUser/${id}`)
            .then(response => {
              console.log("删除成功");
              this.$router.go(0);

            })
            .catch(error => {
            console.error(error);
            });
          
    },
    gotoindex(){     //跳转目录
      this.$router.push('/Index');


    },
    changeRole(user,role){   //修改用户权限
      user.role = role;
      axiosInstance.post('/changeRole',user)
            .then(response => {
              console.log("权限修改成功");
              this.$router.go(0);

            })
            .catch(error => {
            console.error(error);
            });
      
    }

  }
};