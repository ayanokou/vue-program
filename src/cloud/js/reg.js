import axiosInstance from '../../axios';
  
  
  export default {
    data() {
      return {
        form: {
          username: '',
          nickName: '',
          password: '',
          password2: '',
          code: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入登录账号', trigger: 'blur' }
          ],
          nickName: [
            { required: true, message: '请输入昵称', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' }
          ],
          password2: [
            { required: true, message: '请再次输入登录密码', trigger: 'blur' },
            { validator: this.validatePassword2, trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      onSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            // Handle form submission
            axiosInstance.post('/reg', {
            username: this.form.username,
            password: this.form.password,
            })
              .then(response => {
                  if (response.data.code === 200) {
                    this.$message({
                      message: '注册成功',
                      type: 'success',
                      duration: 1500,
                      onClose: () => {
                        this.$router.push('/');
                      }
                    });
                  } else {
                    this.$message.error(response.data.msg);
                  // this.refreshCaptcha();
                  }
                })
  
          } else {
            console.log('Form validation failed.')
            return false
          }
        })
      },
      gotohome() {
        this.$router.push('/');
      },
      onReset() {
        this.$refs.form.resetFields()
      },
      validatePassword2(rule, value, callback) {
        if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
    }
  }