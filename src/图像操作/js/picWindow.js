//import io from "../../../js/socket.io/socket.io";

let socket = io.connect('http://localhost:9092')

export default {
    name:"Index",
    data () {
        return {
            imgUrl: null,
            multiples: 1,
            showViewer:false,
        }
    },
    mounted() {
    },
    methods: {
        //放大
        toBIgChange () {
            if (this.multiples >= 2) {
                return
            }
            this.multiples += 0.25
        },
        // 缩小
        toSmallChange () {
            if (this.multiples <= 0.5) {
                return
            }
            this.multiples -= 0.25
        },
        //复原图像
        toReset(){
            this.multiples = 1
        },
        //全屏预览图像
        onPreview(){
            this.showViewer =true
        },
        //关闭全屏预览
        closeViewer() {
            this.showViewer =false
        },
        // //接受网络请求
        //   getUrl() {
        //       console.log("开始接受请求")
        //       var that = this;
        //       this.$axios.get("http://127.0.0.1:5173/getUrl").then(function(res){
        //         that.url = res.data.Text
        //         console.log("从后台接收到的数字式："+res.data.num)
        //         console.log("从后台接收到的数字式："+res.data.Text)
        //       })
        //
        //   }
        // getUrl() {
        //   this.axios({
        //     method:'get',
        //     url:'http://localhost:8081/getUrl',
        //   })
        //       .then(function(response) {
        //         this.data.url = response.data.Text
        //       })
        // }
        // getUrl() {
        //     fetch("http://localhost:8081/getUrl")
        //         .then(res => res.json())
        //         .then(data=> {
        //             console.log(data.text)
        //             this.imgUrl = data.text
        //         })
        // },
        f(){

        },
        socketioPic(){

            let base64Img=""
            //模板绑定
            let Img = this.$refs.imgUrl.files[0]
            let reader = new FileReader()
            reader.readAsDataURL(Img)
            reader.onload=function (){
                let base64Result=""
                let jsonObject = {userName: "Pic",
                    message: this.result,
                };
                base64Img = this.result
                socket.emit('chatevent', jsonObject);
                //接受处理后的结果，显示文件
                socket.on('revBase64',(data)=>{
                    base64Result=data;
                    console.log(base64Result)
                    let result = document.getElementById("result");
                    result.innerHTML = '<img src="' + base64Result + '" alt="" />';
                })
            }

        }


    }
}