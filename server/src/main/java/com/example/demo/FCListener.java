package com.example.demo;

import com.corundumstudio.socketio.SocketIOClient;

public interface FCListener{
//    public void onMessage(String res);
public void onMessage(String event,String data);
public SocketIOClient getClient();
public void setClient(SocketIOClient client);
}

