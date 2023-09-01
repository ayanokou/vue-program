package com.example.demo.entity;

public class SchemeParam {
    private Integer index;
    private String schemeRoute;
    private String schemePasswd;
    private String communString;
    private Boolean switching;

    public SchemeParam() {
    }

    public SchemeParam(Integer index, String schemeRoute, String schemePasswd, String communString, Boolean switching) {
        this.index = index;
        this.schemeRoute = schemeRoute;
        this.schemePasswd = schemePasswd;
        this.communString = communString;
        this.switching = switching;
    }

    public Integer getIndex() {
        return index;
    }

    public void setIndex(Integer index) {
        this.index = index;
    }

    public String getSchemeRoute() {
        return schemeRoute;
    }

    public void setSchemeRoute(String schemeRoute) {
        this.schemeRoute = schemeRoute;
    }

    public String getSchemePasswd() {
        return schemePasswd;
    }

    public void setSchemePasswd(String schemePasswd) {
        this.schemePasswd = schemePasswd;
    }

    public String getCommunString() {
        return communString;
    }

    public void setCommunString(String communString) {
        this.communString = communString;
    }

    public Boolean getSwitching() {
        return switching;
    }

    public void setSwitching(Boolean switching) {
        this.switching = switching;
    }
}
