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
            softwareSet:false,
            openSelectedSolutionCont:{
                trigger:false,
                key:"",
            },
            deleteSolution:false,
            deleteCurrentSolution:false,
            saveSolution:false,
            socketEmit:null,//请求
            saveSolutionAs:false,
            flowAdd:false,
            timeConsume: "",
            //模块结果，树形数据
            moduleResultData:"[]",
            //流程运行结束信号
            flowChartOK:{trigger:false,index:-1},
            generalResult:"",
            runState:{trigger:false,content:null},
            runSolution:null,
            dialogVisibleGlobalVar:false,
            nodeModelName:""
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
        softwareSetEvent(state,payload){
            state.softwareSet=playload
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
        runSolutionEvent(state,payload){
            state.runSolution=payload
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
        },
        setFlowChartOK(state,payload){
            state.flowChartOK=payload
        },
        setGeneralResult(state,payload){
            state.generalResult=payload
        },
        setRunState(state,payload){
            state.runState=payload
        },
        setDialogVisibleGlobalVar(state,payload){
            state.dialogVisibleGlobalVar=payload
        },
        setNodeModelName(state,payload){
            state.nodeModelName=payload
        }
    },
    modules:{

    }
})
