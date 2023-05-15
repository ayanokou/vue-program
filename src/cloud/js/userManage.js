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
    deleteUser(id){
      axiosInstance.post(`/deleteUser/${id}`)
            .then(response => {
              console.log("删除成功");
              this.$router.go(0);

            })
            .catch(error => {
            console.error(error);
            });
          
    },
    gotoindex(){
      this.$router.push('/Index');


    }

  }
};