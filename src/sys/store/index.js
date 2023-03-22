//组装模块并导出 store 的地方
import {createStore} from 'vuex'

export default createStore({
    state(){
        return{
            vuexHelpInfo:"",
            //网络通讯传过来的图片
            imgBase64:"",
            //网络通讯穿过来的double数组
            revDoubles:null
        }
    },
    mutations:{
        setVuexHelpInfo(state,payload){
            state.vuexHelpInfo=payload
        },
        setImgBase64(state,payload){
            state.imgBase64=payload
        },
        setRevDoubles(state,payload){
            state.revDoubles=payload
        }
    },
    modules:{

    }
})
