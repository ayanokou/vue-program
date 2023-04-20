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
            openSelectedSolutionCont:{
                trigger:false,
                key:"",
            },
            deleteSolutionTrigger:false,
            deleteCurrentSolutionTrigger:false,
            saveSolutionTrigger:false,
            saveSolutionAsTrigger:false,
            flowAddTrigger:false,
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
        openSelectedSolutionEvent(state, payload){
            state.openSelectedSolutionTrigger=payload
        },
        deleteSolutionEvent(state,payload){
            state.deleteSolutionTrigger=payload
        },
        deleteCurrentSolutionEvent(state,payload){
            state.deleteCurrentSolutionCont = payload
        },
        saveSolutionEvent(state, payload){
            state.saveSolutionTrigger = payload
        },
        saveSolutionAsEvent(state, payload){
            state.saveSolutionAsTrigger = payload
        },
        flowAddEvent(state, payload){
            state.flowAddTrigger = payload
        },
    },
    modules:{

    }
})
