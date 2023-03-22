import {function_nS,function_onPreview,function_toReset,function_toSmall,function_toBig,function_revocation,function_runningInterface,function_globalScript,function_globalTrigger,function_globalVariable,function_stop,function_circleRun,function_localRun,function_singleRun,function_redo,function_help,function_about,function_project,function_calibrationBoardGenerationTool,function_createCalibrationBoot,function_setSolution,function_setSoftware,function_manageCommunication,function_setPermission,function_export,function_exit,function_importFlow,function_logs,function_openExample,function_lastOpenSolution,function_openSolution,function_saveSolution,function_saveSolutionAs,function_manageCamera,function_mF,function_bF,function_gF,function_sobel,function_lapras,function_canny} from './responseFunctionDefinition.js'  //将函数的定义引入
const V2F_Mapping={  //key为被触发事件的类型，value为对应应该运行的函数
    'newSolution':function_nS,
    "openSolution":function_openSolution,
    "lastOpenSolution":function_lastOpenSolution,
    "openExample":function_openExample,
    "saveSolution":function_saveSolution,
    "saveSolutionAs":function_saveSolutionAs,
    "importFlow":function_importFlow,
    "export":function_export,
    "exit":function_exit,
    "project":function_project,
    "setPermission":function_setPermission,
    "setSoftware":function_setSoftware,
    "setSolution":function_setSolution,
    "manageCommunication":function_manageCommunication,
    "manageCamera":function_manageCamera,
    "createCalibrationBoot":function_createCalibrationBoot,
    "calibrationBoardGenerationTool":function_calibrationBoardGenerationTool,
    "about":function_about,
    "logs":function_logs,
    "help":function_help,
    "meanFiltering":function_mF,
    "gaussianFiltering":function_gF,
    "bilateralFiltering":function_bF,
    "sobel":function_sobel,
    "lapras":function_lapras,
    "canny":function_canny,
    "revocation":function_revocation,
    "redo":function_redo,
    "singleRun":function_singleRun,
    "localRun":function_localRun,
    "circleRun":function_circleRun,
    "stop":function_stop,
    "globalVariable":function_globalVariable,
    "globalTrigger":function_globalTrigger,
    "globalScript":function_globalScript,
    "runningInterface":function_runningInterface,
    "toBig":function_toBig,
    "toSmall":function_toSmall,
    "toReset":function_toReset,
    "onPreview":function_onPreview,

}

//存储事件类型
export const events={
    msg_singleStepOpr:1,   //事件定义：单步计算
    msg_menuBar:2,               //事件定义：菜单栏事件
    onSubmitTest:3
}

//事件管理函数
export function eventHandle(event, paras){   //事件触发后的响应函数
    switch(event){
        case events.msg_singleStepOpr:  //单步计算算子
            eventFindValueFunction(paras)
            break;
        case events.msg_menuBar:
            eventFindValueFunction(paras)
            break
        default:
            //.....
    }
}

//事件管理函数中确定事件类型后的处理，先找到key对应的value函数，再调用value函数
function eventFindValueFunction(paras){
    let eventResponse = V2F_Mapping[paras.msg_key]
    if(eventResponse!==undefined&&typeof eventResponse === 'function'){
        eventResponse(paras)
    }
}