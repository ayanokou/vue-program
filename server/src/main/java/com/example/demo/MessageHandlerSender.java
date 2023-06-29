package com.example.demo;

import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;

public class MessageHandlerSender {
    private Socket socket;
    private final String ip;
    private final int port;

    public MessageHandlerSender(String ip, int port) {
        this.ip = ip;
        this.port = port;
    }

    public void tryConnect() {
        while (true) {
            try {
                socket = new Socket(ip, port);
                break;
            } catch (UnknownHostException e) {
                System.err.println("UnknownHostException");
            } catch (IOException e) {
                System.err.println("IOException");
            }
        }
    }

    public void sendToMessageHandler(String msg) throws IOException {
        if (socket == null || socket.isClosed()) {
            System.out.println("Socket is null or closed");
            return;
        }
        msg = "<MSG>" + msg + "</MSG>";
        socket.getOutputStream().write(msg.getBytes());
    }

    public Socket getSocket() {
        return socket;
    }
}
