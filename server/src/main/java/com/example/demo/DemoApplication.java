package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

import com.corundumstudio.socketio.listener.*;

import java.io.IOException;
import java.net.UnknownHostException;

//import com.alibaba.fastjson.JSONObject;
import com.corundumstudio.socketio.*;

@SpringBootApplication
@RestController
@CrossOrigin
public class DemoApplication {

	private static String imgFormat;
	private HashMap<Integer, Boolean> flags;
	private static final String IP = "127.0.0.1";
	private static final int PORT = 8180;

	static {
		String path1 = "server/src/main/resources";
		// String path2 = "server/src/main/resources/Read.dll";
		// String path3 = "server/src/main/resources/GaussianBlur.dll";
		String libPath = path1 + ";";
		System.setProperty("java.library.path", libPath);
		System.out.println(System.getProperty("java.library.path"));
		// System.loadLibrary("opencv_world470");
		// System.loadLibrary("opencv_world470_contrib");
		// System.loadLibrary("opencv_core343");
		// System.loadLibrary("opencv_imgproc343");
		// System.loadLibrary("bilateralFilter");
		// System.loadLibrary("fitLine");
		// System.loadLibrary("fitEllipse");
		// //System.loadLibrary("detectField");
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

	public static void main(String[] args) throws UnknownHostException, IOException {
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

//		MessageHandlerSender sender = new MessageHandlerSender(IP, PORT);
//		sender.tryConnect();
//		MessageHandlerReceiver receiver = new MessageHandlerReceiver(sender.getSocket(), listenerForCpp);
//		receiver.start();

		server.addEventListener("chatevent", ChatObject.class, new DataListener<ChatObject>() {
			@Override
			public void onData(SocketIOClient client, ChatObject data, AckRequest ackRequest) throws IOException {
				if (listenerForCpp.getClient() == null) {
					listenerForCpp.setClient(client);
				}
				if (data.getUserName().equals("Flow")) {
					// 创建与cpp通讯类
					// 接听类
					String result = data.getMessage();
					// 发送dll数据
					clientForCpp.eventHandle(listenerForCpp, 0, result);
				} else if (data.getUserName().equals("Solution")) {
					String result = data.getMessage();
					clientForCpp.eventHandle(listenerForCpp, 1, result);
				} else if (data.getUserName().equals("SaveGlobalVar")) {
					String result = data.getMessage();
					System.out.println(result);
					clientForCpp.eventHandle(listenerForCpp, 4, result);
				} else if (data.getUserName().equals("....")) {
					String result = data.getMessage();
					System.out.println(result);
					clientForCpp.eventHandle(listenerForCpp, 4, result);
				}
//				else if (data.getUserName().equals("AddTcpListener")) {
//					String result = data.getMessage();
//					JSONObject jsonObject = JSONObject.parseObject(result);
//					jsonObject.put("operation", 0);
//					result = jsonObject.toJSONString();
//					System.out.println(result);
//					sender.sendToMessageHandler(result);
//				}


			}
		});
		server.start();
		SpringApplication.run(DemoApplication.class, args);
	}

}


