//组装模块并导出 store 的地方
import { stat } from 'original-fs'
import {createStore} from 'vuex'

export default createStore({
    state(){
        return{
            vuexHelpInfo:'I am helpInfo from vuex',
            //前端的图片
            imgBase64:"",
            newSolutionTrigger:false,
            openSolutionTrigger:false,
            saveSolutionTrigger:false,
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
        saveSolutionTrigger(state, payload){
            state.saveSolutionTrigger = payload
        }
    },
    modules:{

    }
})
