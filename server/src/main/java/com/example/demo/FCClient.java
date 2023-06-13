package com.example.demo;

public class FCClient {

    public native void eventHandle(FCListener listener,int a, String para);

    public native void start_event_loop(FCListener listener);

}
