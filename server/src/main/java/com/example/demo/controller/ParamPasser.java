package com.example.demo.controller;
import com.example.demo.entity.SchemeParam;
import com.google.gson.Gson;

import com.example.demo.entity.ParamListA;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

@RestController
public class ParamPasser {
    @PostMapping("/paramPass")
    public String paramPass(@RequestBody ParamListA paramLista) {

//        System.out.println(paramLista.getChooseIdentity());
//        System.out.println(paramLista.getDefaultRunInterface());
//        System.out.println(paramLista.getFileAutomaticLoading());
//        System.out.println(paramLista.getLoadPath());
//        System.out.println(paramLista.getMaximizeRuntimeInterfaceStartsIndependently());

        // 使用 Gson 将实例转换为 JSON 字符串
        Gson gson = new Gson();
        String json = gson.toJson(paramLista);


        // 将 JSON 字符串写入到本地文件
        try {
            File file =new File("./server/src/main/resources/softwareParam.txt");
            FileWriter fileWriter = new FileWriter(file);
            BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
            bufferedWriter.write(json);
            bufferedWriter.close();
            System.out.println("JSON 数据已成功保存到文件 " + file.getAbsolutePath());
        } catch (IOException e) {
            e.printStackTrace();
            return "ERROR";
        }
        return "SUCCESS";
    }

    @PostMapping("/schemeParamPass")
    public String schemeParamPass(@RequestParam("rows") SchemeParam[] schemeParam){

        // 使用 Gson 将实例转换为 JSON 字符串
        Gson gson = new Gson();
        String json = gson.toJson(schemeParam);


        // 将 JSON 字符串写入到本地文件
        try {
            File file =new File("./server/src/main/resources/schemeParam.txt");
            FileWriter fileWriter = new FileWriter(file);
            BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
            bufferedWriter.write(json);
            bufferedWriter.close();
            System.out.println("JSON 数据已成功保存到文件 " + file.getAbsolutePath());
        } catch (IOException e) {
            e.printStackTrace();
            return "ERROR";
        }
        return "SUCCESS";
    }
}
