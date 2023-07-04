package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

import com.corundumstudio.socketio.listener.*;

import java.io.IOException;
import java.net.UnknownHostException;

import com.alibaba.fastjson.JSONObject;
import com.corundumstudio.socketio.*;

@SpringBootApplication
@RestController
@CrossOrigin
public class DemoApplication {

	private static String imgFormat;
	private HashMap<Integer, Boolean> flags;
	private static final String messageHandlerPath = "mh/MessageHandler.exe";
	private static final String IP = "127.0.0.1";
	private static final int PORT = 8180;

	static {
		// String path1 = "server/src/main/resources";
		// String path2 = "server/src/main/resources/Read.dll";
		// String path3 = "server/src/main/resources/GaussianBlur.dll";
		// String libPath = path1 + ";";
		// System.setProperty("java.library.path", libPath);
		// System.out.println(System.getProperty("java.library.path"));
		// System.loadLibrary("opencv_world470");
		// System.loadLibrary("opencv_world470_contrib");
		// System.loadLibrary("opencv_core343");
		// System.loadLibrary("opencv_imgproc343");
		// System.loadLibrary("bilateralFilter");
		// System.loadLibrary("fitLine");
		// System.loadLibrary("fitEllipse");
		// System.loadLibrary("detectField");
		// System.loadLibrary("getPosition");
		// System.loadLibrary("shadowcorrection");
		// System.loadLibrary("scratchDetection");
		// System.loadLibrary("myMorphology");
		// System.loadLibrary("myEdgeDetection");
		// System.loadLibrary("myColorIdentif");
		// System.loadLibrary("myBrightnessCorrection");
		// System.loadLibrary("myContrastEnhancement");
		// System.loadLibrary("uv");
		// System.loadLibrary("udpInFlow");
		// System.loadLibrary("udpCommunicate");
		// System.loadLibrary("tcpInFlow");
		// System.loadLibrary("tcpDll");
		// System.loadLibrary("clientSDK");
	}

	public boolean checkRunning(int port) {
		return flags.get(port);
	}

	private interface Register {
		void register(String event, int operation) throws IOException;
	}
	
	public static void main(String[] args) throws UnknownHostException, IOException {
		MessageHandlerInitializer initializer = new MessageHandlerInitializer(messageHandlerPath);
		initializer.start();

		com.corundumstudio.socketio.Configuration config = new Configuration();
		config.setMaxFramePayloadLength(5 * 1024 * 1024);
		config.setHostname("localhost");
		config.setPort(9092);

		final SocketIOServer server = new SocketIOServer(config);

		FCClient clientForCpp = new FCClient();
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
					System.out.println("client is null");
					return;
				}
				client.sendEvent(event, data);
			}
		};

		MessageHandlerSender sender = new MessageHandlerSender(IP, PORT);
		sender.tryConnect();
		MessageHandlerReceiver receiver = new MessageHandlerReceiver(sender.getSocket(), listenerForCpp);
		receiver.start();
		Register reg = (String event, int operation) -> {
			server.addEventListener(event, String.class, new DataListener<String>() {
				@Override
				public void onData(SocketIOClient socketIOClient, String msg, AckRequest ackRequest)
						throws Exception {
					if (listenerForCpp.getClient() == null) {
						listenerForCpp.setClient(socketIOClient);
					}
					System.out.println(msg);
					JSONObject jsonObject = new JSONObject();
					JSONObject data = JSONObject.parseObject(msg);
					jsonObject.put("operation", operation);
					jsonObject.put("data", data);
					String result = jsonObject.toJSONString();
					System.out.println(result);
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
		SpringApplication.run(DemoApplication.class, args);
	}

}
