package com.example.demo;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class MessageHandlerInitializer implements Runnable {
    private final String path;
    private Process process;
    private Thread t;

    public MessageHandlerInitializer(String path) {
        this.path = path;
    }

    @Override
    public void run() {
        try {
            this.process = new ProcessBuilder(path).start();
            InputStream is = process.getInputStream();
            InputStreamReader isr = new InputStreamReader(is);
            BufferedReader br = new BufferedReader(isr);
            String line;
            
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.err.println("MessageHandlerInitializer exited");
        }
    }

    public void start() {
        if (t == null) {
            t = new Thread(this, "MessageHandlerInitializer");
            t.start();
        }
    }
}
