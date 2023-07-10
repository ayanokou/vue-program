package com.example.demo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;

import com.corundumstudio.socketio.listener.*;

import java.io.IOException;
import java.net.UnknownHostException;

import com.alibaba.fastjson.JSONObject;
import com.corundumstudio.socketio.*;

import org.apache.commons.cli.*;

public class DemoApplication {
	private HashMap<Integer, Boolean> flags;
	private static final String MESSAGE_HANDLER_PATH = "mh/MessageHandler.exe";
	private static final String IP = "127.0.0.1";
	private static final int PORT = 8180;

	public boolean checkRunning(int port) {
		return flags.get(port);
	}

	private interface Register {
		void register(String event, int operation) throws IOException;
	}
	
	public static void main(String[] args) throws UnknownHostException, IOException {
		Logger logger = LoggerFactory.getLogger(DemoApplication.class);

		Options options = new Options();
		Option detached = new Option("d", "detached", false, "run in detached mode");
		options.addOption(detached);

		CommandLine cmd = null;
		CommandLineParser parser = new DefaultParser();
		HelpFormatter formatter = new HelpFormatter();
		try {
			cmd = parser.parse(options, args);
		} catch (ParseException e) {
			logger.error("Parsing failed.  Reason: " + e.getMessage());
			formatter.printHelp("Usage: ", options);
			System.exit(1);
		}
		
		if (cmd.hasOption("detached")) {
			logger.info("run in detached mode");
		} else {
			logger.info("run in attached mode");
			MessageHandlerInitializer initializer = new MessageHandlerInitializer(MESSAGE_HANDLER_PATH, logger);
			initializer.start();
		}

		com.corundumstudio.socketio.Configuration config = new Configuration();
		config.setMaxFramePayloadLength(5 * 1024 * 1024 * 1024);
		config.setHostname("localhost");
		config.setPort(9092);

		final SocketIOServer server = new SocketIOServer(config);

		FCListener listenerForCpp = new FCListener() {
			private SocketIOClient client;

			@Override
			public SocketIOClient getClient() {
				return client;
			}

			@Override
			public void setClient(SocketIOClient client) {
				this.client = client;
			}

			@Override
			public void onMessage(String event, String data) {
				if (client == null) {
					logger.warn("client is null");
					return;
				}
				client.sendEvent(event, data);
			}
		};

		MessageHandlerSender sender = new MessageHandlerSender(IP, PORT, logger);
		sender.tryConnect();
		MessageHandlerReceiver receiver = new MessageHandlerReceiver(sender.getSocket(), listenerForCpp, logger);
		receiver.start();

		Register reg = (String event, int operation) -> {
			server.addEventListener(event, String.class, new DataListener<String>() {
				@Override
				public void onData(SocketIOClient socketIOClient, String msg, AckRequest ackRequest)
						throws Exception {
					listenerForCpp.setClient(socketIOClient);
					JSONObject jsonObject = new JSONObject();
					JSONObject data = JSONObject.parseObject(msg);
					jsonObject.put("operation", operation);
					jsonObject.put("data", data);
					String result = jsonObject.toJSONString();
					logger.info("receive event: {}, data: {}", event, result);
					sender.sendToMessageHandler(result);
				}
			});
		};

		HashMap<String, Integer> operationMap = new HashMap<String, Integer>();
		operationMap.put("AddTcpListener", 0);
		operationMap.put("RemoveTcpListener", 1);
		operationMap.put("SendTcpMessageFromListener", 2);
		operationMap.put("AddTcpConnector", 3);
		operationMap.put("RemoveTcpConnector", 4);
		operationMap.put("SendTcpMessageFromConnector", 5);
		operationMap.put("AddUdpListener", 6);
		operationMap.put("RemoveUdpListener", 7);
		operationMap.put("SendUdpMessage", 8);
		operationMap.put("RunFlow", 9);
		operationMap.put("RunSolution", 10);
		operationMap.put("SaveGlobalVar", 11);
		operationMap.put("RunSolutionLoop",12);
		operationMap.put("StopSolutionLoop",13);

		for (String key : operationMap.keySet()) {
			Integer value = operationMap.get(key);
			reg.register(key, value);
		}


		server.start();
	}
}
