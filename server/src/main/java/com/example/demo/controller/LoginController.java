package com.example.demo.controller;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
public class LoginController {
    private String userJsonPath = "src\\登录窗口\\login.json";
    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<?> login(@RequestBody User loginForm) {
        System.out.println(loginForm.getUsername());
        try {
            // 读取JSON文件并将其转换为用户对象列表
            List<User> users = readUsersFromJson();

            // 验证用户名和密码是否匹配
            boolean isAuthenticated = authenticateUser(loginForm, users);

            if (isAuthenticated) {
                // 用户验证成功
                return ResponseEntity.ok().body("登录成功");
            } else {
                // 用户验证失败
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } catch (IOException e) {
            // 处理文件读取或JSON解析错误
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }




    }

    private List<User> readUsersFromJson() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        File file = new File(userJsonPath);

        JsonNode rootNode = objectMapper.readTree(file);
        JsonNode usersNode = rootNode.get("users");

        return objectMapper.readValue(usersNode.toString(), new TypeReference<List<User>>() {});
    }

    private boolean authenticateUser(User loginForm, List<User> users) {
        for (User user : users) {
            if (user.getUsername().equals(loginForm.getUsername()) &&
                    user.getPassword().equals(loginForm.getPassword())) {
                return true;
            }
        }
        return false;
    }


    public static class User {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

}
