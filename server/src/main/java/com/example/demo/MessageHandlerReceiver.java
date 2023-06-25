package com.example.demo;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;

public class MessageHandlerReceiver implements Runnable {
    private Socket socket;
    private Thread t;
    private FCListener listener;

    public MessageHandlerReceiver(Socket socket, FCListener listener) {
        this.socket = socket;
        this.listener = listener;
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

                // <MSG>{"protocol": /* protocol */, "IP": /* IP */, "port": /* port */, "data":
                // /* data */}</MSG>
                while (startIndex != -1 && endIndex != -1 && startIndex < endIndex) {
                    String message = msg.substring(startIndex + 5, endIndex);

                    listener.onMessage("ReceivedTcpData", message);

                    msg = msg.substring(endIndex + 6);
                    startIndex = msg.indexOf("<MSG>");
                    endIndex = msg.indexOf("</MSG>");
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.err.println("MessageHandlerReceiver exited");
        }
    }

    public void start() {
        if (t == null) {
            t = new Thread(this, "MessageHandlerReceiver");
            t.start();
        }
    }
}
