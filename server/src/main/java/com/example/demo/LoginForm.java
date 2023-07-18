package com.example.demo;



public class LoginForm  {
    private String username;
    private String password;
    private String code;
    private Boolean rememberMe;

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getCode() {
        return code;
    }


    public Boolean getRememberMe() {
        return rememberMe;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRememberMe(Boolean rememberMe) {
        this.rememberMe = rememberMe;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
