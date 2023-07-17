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

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@SpringBootApplication
public class DemoApplication {
	// private static String saveFolderPath;
    // private static String token;

    // @Value("${file.download.path}")
    // public void setSaveFolderPath(String saveFolderPath) {
    //     DemoApplication.saveFolderPath = saveFolderPath;
    // }
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
		SpringApplication.run(DemoApplication.class, args);
        //login("admin","123");
        //executeDownload("c");
	}
	// public static void login(String username,String password){
    //     RestTemplate restTemplate = new RestTemplate();
    //     LoginForm loginForm = new LoginForm();
    //     loginForm.setUsername(username);
    //     loginForm.setPassword(password);
    //     loginForm.setRememberMe(true);
    //     loginForm.setCode("123");

    //     // 设置请求头
    //     HttpHeaders headers = new HttpHeaders();
    //     headers.setContentType(MediaType.APPLICATION_JSON);

    //     // 创建请求体
    //     HttpEntity<LoginForm> request = new HttpEntity<>(loginForm, headers);

    //     // 发送POST请求
    //     String url = "http://10.13.2.43:8081/login";
    //     ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
    //     HttpHeaders responseHeaders = responseEntity.getHeaders();
    //     // 获取指定属性的值
    //     token = responseHeaders.getFirst("token");
    //     if (token != null) {
    //         System.out.println("Token: " + token);
    //     } else {
    //         System.out.println("Token未找到");
    //     }
    // }
    // public static void executeDownload(String filename) {


    //     RestTemplate restTemplate = new RestTemplate();


    //     // 创建请求头
    //     HttpHeaders downloadHeaders = new HttpHeaders();
    //     downloadHeaders.setContentType(MediaType.APPLICATION_JSON);
    //     downloadHeaders.set("token", token); // 将token设置到下载请求的头部

    //     // 创建请求体
    //     HttpEntity<String> downloadRequest = new HttpEntity<>(downloadHeaders);

    //     // 构建下载请求的URL
    //     String downloadUrl = "http://10.13.2.43:8081/download/" + filename;

    //     // 发送下载请求
    //     ResponseEntity<Resource> downloadResponse = restTemplate.exchange(downloadUrl, HttpMethod.GET, downloadRequest, Resource.class);

    //     // 获取下载的资源
    //     Resource downloadResource = downloadResponse.getBody();

    //     // 检查下载是否成功，根据需要进行逻辑处理

    //     // 处理下载的资源，例如保存到文件
    //     try (InputStream inputStream = downloadResource.getInputStream()) {
    //         String fileName = "c"; // 根据您的要求，使用发送请求的参数作为文件名
    //         String saveFilePath = saveFolderPath + "\\" + fileName + ".dll"; // 构建文件保存路径

    //         // 检查目标文件夹是否存在，若不存在则创建
    //         File folder = new File(saveFolderPath);
    //         if (!folder.exists()) {
    //             folder.mkdirs();
    //         }

    //         // 检查文件是否已存在，若存在则删除
    //         File existingFile = new File(saveFilePath);
    //         if (existingFile.exists()) {
    //             existingFile.delete();
    //         }

    //         // 使用 Files.copy() 方法将输入流保存到文件
    //         Files.copy(inputStream, Paths.get(saveFilePath), StandardCopyOption.REPLACE_EXISTING);

    //         System.out.println("文件下载成功：" + saveFilePath);
    //     } catch (IOException e) {
    //         System.err.println("文件下载失败: " + e.getMessage());
    //     }



    // }

}
