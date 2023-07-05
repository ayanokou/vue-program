package com.example.demo;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.slf4j.Logger;

public class MessageHandlerInitializer implements Runnable {
    private final String path;
    private Process process;
    private Thread t;
    private Logger logger;

    public MessageHandlerInitializer(String path, Logger logger) {
        this.path = path;
        this.logger = logger;
    }

    @Override
    public void run() {
        try {
            this.process = new ProcessBuilder(path).start();
            Runtime.getRuntime().addShutdownHook(new Thread() {
                @Override
                public void run() {
                    if (process != null) {
                        process.destroy();
                    }
                }
            });

            InputStream is = process.getInputStream();
            InputStreamReader isr = new InputStreamReader(is);
            BufferedReader br = new BufferedReader(isr);
            String line;
            char[] buf = new char[65536];

            while (process.isAlive()) {
                int len = br.read(buf);
                line = new String(buf, 0, len - 1);
                logger.info("\n{}", line);
            }
        } catch (IOException e) {
            e.printStackTrace();
            logger.error("MessageHandlerInitializer exited");
        }
    }

    public void start() {
        if (t == null) {
            t = new Thread(this, "MessageHandlerInitializer");
            t.start();
        }
    }
}
