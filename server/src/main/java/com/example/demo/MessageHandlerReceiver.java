package com.example.demo;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;

import org.slf4j.Logger;

import com.alibaba.fastjson.JSONObject;

public class MessageHandlerReceiver implements Runnable {
    private Socket socket;
    private Thread t;
    private FCListener listener;
    private Logger logger;

    public MessageHandlerReceiver(Socket socket, FCListener listener, Logger logger) {
        this.socket = socket;
        this.listener = listener;
        this.logger = logger;
    }

    @Override
    public void run() {
        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            char[] buf = new char[65536];
            String msg = "";
            while (socket.isConnected()) {
                int len = br.read(buf);
                msg += new String(buf, 0, len);
                int startIndex = msg.indexOf("<MSG>");
                int endIndex = msg.indexOf("</MSG>");

                // <MSG>{"event": /* event */, "data": /* data */ }</MSG>
                while (startIndex != -1 && endIndex != -1 && startIndex < endIndex) {
                    String message = msg.substring(startIndex + 5, endIndex);
                    
                    logger.info("MessageHandlerReceiver: {}", message);
                    JSONObject jsonObject = JSONObject.parseObject(message);
                    String event = jsonObject.getString("event");
                    String data;
                    if(jsonObject.getJSONObject(msg) != null) {
                    	data = jsonObject.getJSONObject(msg).toJSONString();
                    }else if(jsonObject.getJSONArray(msg) != null) {
                        data=jsonObject.getJSONArray(msg).toJSONString();
                    }else{
                        data="";
                    }
                    listener.onMessage(event, data);

                    msg = msg.substring(endIndex + 6);
                    startIndex = msg.indexOf("<MSG>");
                    endIndex = msg.indexOf("</MSG>");
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            logger.error("MessageHandlerReceiver exited");
        }
    }

    public void start() {
        if (t == null) {
            t = new Thread(this, "MessageHandlerReceiver");
            t.start();
        }
    }
}
