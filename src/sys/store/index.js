//组装模块并导出 store 的地方
import {createStore} from 'vuex'

export default createStore({
    state(){
        return{
            vuexHelpInfo:"",
            //网络通讯传过来的图片
            imgBase64:"",
            newSolution:false,
            openSolution:false,
            openSelectedSolutionCont:{
                trigger:false,
                key:"",
            },
            deleteSolution:false,
            deleteCurrentSolution:false,
            saveSolution:false,
            socketEmit:null,
            saveSolutionAs:false,
            flowAdd:false,
            timeConsume: "",
            //模块结果，树形数据
            moduleResultData:"[]"
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
            state.newSolution=payload
        },
        openSolutionEvent(state,payload){
            state.openSolution=payload
        },
        openSelectedSolutionEvent(state, payload){
            state.openSelectedSolution=payload
        },
        deleteSolutionEvent(state,payload){
            state.deleteSolution=payload
        },
        deleteCurrentSolutionEvent(state,payload){
            state.deleteCurrentSolution = payload
        },
        saveSolutionEvent(state, payload){
            state.saveSolution = payload
        },

        setSocketEmit(state,payload){
            state.socketEmit=payload
        },

        saveSolutionAsEvent(state, payload){
            state.saveSolutionAs = payload
        },
        flowAddEvent(state, payload){
            state.flowAdd = payload
        },
        timeConsumeEvent(state, payload){
            state.timeConsume = payload
        },
        setModuleResultData(state,payload){
            state.moduleResultData=payload
        }

    },
    modules:{

    }
})
