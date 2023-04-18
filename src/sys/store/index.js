//组装模块并导出 store 的地方
import {createStore} from 'vuex'

export default createStore({
    state(){
        return{
            vuexHelpInfo:"",
            //网络通讯传过来的图片
            imgBase64:"",
            newSolutionTrigger:false,
            openSolutionTrigger:false,
            saveSolutionTrigger:false,
            socketEmit:null
        }
    },
    mutations:{
        setVuexHelpInfo(state,payload){
            state.vuexHelpInfo=payload
        },
        setImgBase64(state,payload){
            state.imgBase64=payload
        },
        newSolutionEvent(state,payload){
            state.newSolutionTrigger=payload
        },
        openSolutionEvent(state,payload){
            state.openSolutionTrigger=payload
        },
        saveSolutionEvent(state, payload){
            state.saveSolutionTrigger = payload
        },
        setSocketEmit(state,payload){
            state.socketEmit=payload
        }
    },
    modules:{

    }
})
