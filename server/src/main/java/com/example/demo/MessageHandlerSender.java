package com.example.demo;

import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;

import org.slf4j.Logger;

public class MessageHandlerSender {
    private Socket socket;
    private final String ip;
    private final int port;
    private Logger logger;

    public MessageHandlerSender(String ip, int port, Logger logger) {
        this.ip = ip;
        this.port = port;
        this.logger = logger;
    }

    public void tryConnect() throws InterruptedException {
        while (true) {
            try {
                socket = new Socket(ip, port);
                break;
            }catch(UnknownHostException e) {
                logger.error("UnknownHostException: " + e.getMessage());
            }catch(IOException e) {
                logger.error("IOException: " + e.getMessage());
            }
            Thread.sleep(1000);
        }
    }

    public void sendToMessageHandler(String msg) throws IOException {
        if (socket == null || socket.isClosed()) {
            logger.error("socket is null or closed");
            return;
        }
        msg = "<MSG>" + msg + "</MSG>";
        socket.getOutputStream().write(msg.getBytes());
    }

    public Socket getSocket() {
        return socket;
    }
}
